package com.example.hansei.programs;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.hansei.entity.HanUser;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ProgramRepository programRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    public ApplicationService(ApplicationRepository applicationRepository, ProgramRepository programRepository, SimpMessagingTemplate messagingTemplate) {
        this.applicationRepository = applicationRepository;
        this.programRepository = programRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * ✅ 특정 사용자의 신청 내역 조회 (같은 프로그램 신청자 포함)
     */
    public List<ApplicationDto> getUserApplications(Long userId) {
        List<Application> applications = applicationRepository.findByUserUserId(userId)
                .stream()
                .filter(app -> app.getStatus() != Application.ApplicationStatus.CANCELED) // ✅ 취소된 신청 제외
                .toList();

        // ✅ 프로그램별로 그룹화하여 같은 프로그램의 모든 신청자 포함
        return applications.stream()
                .collect(Collectors.groupingBy(app -> app.getProgram().getId()))
                .values()
                .stream()
                .map(appList -> ApplicationDto.fromApplications(appList.get(0).getProgram().getId(), appList))
                .collect(Collectors.toList());
    }

    /**
     * ✅ 특정 프로그램의 신청 내역 조회 (모든 신청자 포함)
     */
    public List<ApplicationDto> getProgramApplications(Long programId) {
        List<Application> applications = applicationRepository.findByProgramId(programId);
        
        if (applications == null || applications.isEmpty()) {
            throw new IllegalArgumentException("🚨 해당 프로그램에 대한 신청 내역이 없습니다!");
        }

        return applications.stream()
                .map(app -> new ApplicationDto(
                        app.getId(),
                        app.getProgram().getPosterName(),
                        app.getProgram().getName(),
                        app.getProgram().getStartDate(),
                        app.getProgram().getEndDate(),
                        List.of(app.getUser().getName()), // ✅ 한 명의 신청자만 포함하여 개별 데이터 유지
                        app.getStatus().name()
                ))
                .toList(); // ✅ 개별 신청 내역 리스트 반환
    }


    /**
     * ✅ 프로그램 신청 (사용자가 특정 프로그램을 신청)
     */
    @Transactional
    public Optional<Application> applyForProgram(Long userId, Long programId) {
        Optional<Program> optionalProgram = programRepository.findById(programId);
        if (optionalProgram.isEmpty()) {
            throw new IllegalArgumentException("🚨 프로그램이 존재하지 않습니다.");
        }

        Program program = optionalProgram.get();

        // ✅ 사용자 조회
        HanUser user = entityManager.find(HanUser.class, userId);
        if (user == null) {
            throw new IllegalArgumentException("🚨 사용자가 존재하지 않습니다.");
        }

        // ✅ 중복 신청 여부 확인 (existsBy 사용)
        if (applicationRepository.existsByUserUserIdAndProgramId(userId, programId)) {
            throw new IllegalStateException("🚨 이미 신청한 프로그램입니다.");
        }

        // ✅ 정원 초과 확인
        if (program.getCurrentParticipants() >= program.getMaxParticipants()) {
            throw new IllegalStateException("🚨 신청 정원을 초과하였습니다.");
        }

        // ✅ 신청 저장
        Application application = new Application();
        application.setUser(user);
        application.setProgram(program);
        application.setStatus(Application.ApplicationStatus.APPLIED);
        applicationRepository.save(application);

        // ✅ 신청자 수 증가
        program.setCurrentParticipants(program.getCurrentParticipants() + 1);
        programRepository.save(program);

        // ✅ WebSocket 업데이트 (신청 반영)
        messagingTemplate.convertAndSend("/topic/programs", new WebSocketResponse(userId, programId, true, "✅ 신청 완료"));

        return Optional.of(application);
    }

    /**
     * ✅ WebSocket 응답 DTO (내부 클래스)
     */
    private static class WebSocketResponse {
        private final Long userId;
        private final Long programId;
        private final boolean isApplied;
        private final String message;

        public WebSocketResponse(Long userId, Long programId, boolean isApplied, String message) {
            this.userId = userId;
            this.programId = programId;
            this.isApplied = isApplied;
            this.message = message;
        }

        public Long getUserId() { return userId; }
        public Long getProgramId() { return programId; }
        public boolean isApplied() { return isApplied; }
        public String getMessage() { return message; }
    }
}