package com.example.hansei.programs;

import com.example.hansei.entity.HanUser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProgramService {
    private final ProgramRepository programRepository;
    private final ApplicationRepository applicationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final String uploadDir = "uploads/";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PersistenceContext
    private EntityManager entityManager;

    public ProgramService(ProgramRepository programRepository, ApplicationRepository applicationRepository, SimpMessagingTemplate messagingTemplate) {
        this.programRepository = programRepository;
        this.applicationRepository = applicationRepository;
        this.messagingTemplate = messagingTemplate;
        createUploadDir();
    }

    /**
     * ✅ 프로그램 추가 (새로운 프로그램을 DB에 저장)
     */
    @Transactional
    public Program addProgram(Program program) {
        return programRepository.save(program);
    }

    /**
     * ✅ 특정 사용자가 신청한 프로그램 조회 (신청자 정보 포함)
     */
    public List<ApplicationDto> getMyPrograms(Long userId) {
        List<Application> applications = applicationRepository.findByUserUserId(userId);

        // ✅ 프로그램별로 그룹화하여 모든 신청자를 포함
        return applications.stream()
                .collect(Collectors.groupingBy(app -> app.getProgram().getId())) // 프로그램 ID 기준으로 그룹화
                .values()
                .stream()
                .map(appList -> ApplicationDto.fromApplications(appList.get(0).getProgram().getId(), appList))
                .collect(Collectors.toList());
    }

    // ✅ 모든 프로그램 조회
    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    // ✅ 특정 카테고리의 프로그램 조회
    public List<Program> getProgramsByCategory(String category) {
        try {
            return programRepository.findByCategory(Program.Category.valueOf(category));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("🚨 잘못된 카테고리 값입니다: " + category);
        }
    }

    // ✅ ID로 특정 프로그램 조회
    public Optional<Program> getProgramById(Long id) {
        return programRepository.findById(id);
    }

    /**
     * ✅ 프로그램 신청 (사용자가 특정 프로그램을 신청)
     */
    @Transactional
    public boolean applyForProgram(Long userId, Long programId) {
        // ✅ 프로그램 존재 여부 확인
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("🚨 프로그램이 존재하지 않습니다. programId=" + programId));

        // ✅ 사용자 존재 여부 확인
        HanUser user = entityManager.find(HanUser.class, userId);
        if (user == null) {
            throw new IllegalArgumentException("🚨 사용자가 존재하지 않습니다. userId=" + userId);
        }

        // ✅ 같은 유저가 이미 신청했는지 확인 (existsBy → findBy 사용)
        if (applicationRepository.findByUserUserIdAndProgramId(userId, programId).isPresent()) {
            throw new IllegalArgumentException("🚨 이미 신청한 프로그램입니다. userId=" + userId + ", programId=" + programId);
        }

        // ✅ 정원 초과 여부 확인
        if (program.getCurrentParticipants() >= program.getMaxParticipants()) {
            throw new IllegalStateException("🚨 신청 정원을 초과하였습니다. programId=" + programId);
        }

        // ✅ 신청 객체 생성 및 저장
        Application application = new Application();
        application.setUser(user);
        application.setProgram(program);
        application.setStatus(Application.ApplicationStatus.APPLIED);
        applicationRepository.save(application);

        // ✅ 신청자 수 증가
        program.setCurrentParticipants(program.getCurrentParticipants() + 1);
        programRepository.save(program);

        // ✅ WebSocket을 통해 신청 반영
        messagingTemplate.convertAndSend("/topic/programs", new WebSocketResponse(userId, programId, true, "✅ 신청 완료"));

        return true;
    }

    // ✅ 일정 데이터를 JSON에서 객체로 변환
    public List<Schedule> parseSchedules(String schedulesJson) {
        try {
            return objectMapper.readValue(schedulesJson, new TypeReference<List<Schedule>>() {});
        } catch (Exception e) {
            throw new RuntimeException("🚨 일정 데이터 파싱 오류: " + e.getMessage(), e);
        }
    }

    // ✅ 이미지 저장
    public String saveImage(MultipartFile image) throws IOException {
        String uniqueFilename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, uniqueFilename);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, image.getBytes());
        return uniqueFilename;
    }

    // ✅ 이미지 로드
    public byte[] loadImage(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir, filename);
        if (Files.exists(filePath)) {
            return Files.readAllBytes(filePath);
        } else {
            throw new IOException("🚨 파일을 찾을 수 없습니다: " + filename);
        }
    }

    // ✅ 업로드 디렉터리 생성
    private void createUploadDir() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
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