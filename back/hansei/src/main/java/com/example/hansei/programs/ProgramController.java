package com.example.hansei.programs;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/programs")
@CrossOrigin(origins = "http://localhost:3000") // CORS 정책 설정 (React 앱에서 API 호출을 허용)
public class ProgramController {
    private final ProgramService programService; // ProgramService를 통한 프로그램 비즈니스 로직 처리
    private final SimpMessagingTemplate messagingTemplate; // WebSocket 메시지 송신

    // ProgramService와 SimpMessagingTemplate을 주입받는 생성자
    public ProgramController(ProgramService programService, SimpMessagingTemplate messagingTemplate) {
        this.programService = programService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * ✅ 특정 사용자의 신청 내역 조회 (신청자 정보 포함)
     * 이 메서드는 로그인한 사용자의 신청 내역을 조회하여 반환합니다.
     * 
     * @param userId - 신청 내역을 조회할 사용자의 ID
     * @return ResponseEntity<List<ApplicationDto>> - 사용자의 신청 내역
     */
    @GetMapping("/mypage/{userId}")
    public ResponseEntity<List<ApplicationDto>> getMyPrograms(@PathVariable("userId") Long userId) {
        System.out.println("📌 [API 요청] 신청 내역 조회: userId=" + userId);
        List<ApplicationDto> applications = programService.getMyPrograms(userId); // ProgramService에서 신청 내역 조회
        return ResponseEntity.ok(applications); // 신청 내역을 성공적으로 반환
    }

    /**
     * ✅ 모든 프로그램 조회
     * 모든 프로그램을 조회하고 반환합니다.
     * 
     * @return List<Program> - 모든 프로그램 리스트
     */
    @GetMapping
    public List<Program> getAllPrograms() {
        return programService.getAllPrograms(); // 모든 프로그램을 반환
    }

    /**
     * ✅ 특정 카테고리 프로그램 조회
     * 주어진 카테고리명에 해당하는 프로그램들을 조회하여 반환합니다.
     * 
     * @param category - 카테고리 이름
     * @return List<Program> - 특정 카테고리에 속하는 프로그램 리스트
     */
    @GetMapping("/category/{category}")
    public List<Program> getProgramsByCategory(@PathVariable String category) {
        return programService.getProgramsByCategory(category); // 카테고리별 프로그램 조회
    }

    /**
     * ✅ 특정 프로그램 ID로 조회
     * 특정 프로그램의 ID를 사용하여 해당 프로그램의 정보를 반환합니다.
     * 
     * @param id - 조회할 프로그램 ID
     * @return ResponseEntity<Program> - 특정 프로그램 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<Program> getProgramById(@PathVariable("id") Long id) {
        return programService.getProgramById(id)
                .map(ResponseEntity::ok) // 프로그램이 존재하면 반환
                .orElse(ResponseEntity.notFound().build()); // 프로그램이 없으면 404 반환
    }

    /**
     * ✅ 프로그램 추가
     * 사용자가 프로그램을 추가할 수 있는 메서드입니다.
     * 요청된 파라미터들을 바탕으로 새로운 프로그램을 생성하고 저장합니다.
     * 
     * @param name - 프로그램명
     * @param startDate - 시작일
     * @param endDate - 종료일
     * @param maxParticipants - 최대 참여자 수
     * @param target - 모집 대상
     * @param gradeGender - 학년/성별
     * @param department - 학과
     * @param posterName - 기관명
     * @param posterEmail - 기관 이메일
     * @param posterPhone - 기관 전화번호
     * @param posterLocation - 기관 위치
     * @param description - 프로그램 설명
     * @param image - 프로그램 이미지 (Optional)
     * @param schedulesJson - 일정 데이터 (Optional)
     * @param category - 카테고리
     * @return ResponseEntity<Program> - 추가된 프로그램 정보
     * @throws IOException - 이미지 저장 또는 일정 데이터 처리 시 발생할 수 있는 예외
     */
    @PostMapping
    public ResponseEntity<Program> addProgram(
            @RequestParam("name") String name,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("maxParticipants") int maxParticipants,
            @RequestParam(value = "target", required = false) String target,
            @RequestParam(value = "gradeGender", required = false) String gradeGender,
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "posterName", required = false) String posterName,
            @RequestParam(value = "posterEmail", required = false) String posterEmail,
            @RequestParam(value = "posterPhone", required = false) String posterPhone,
            @RequestParam(value = "posterLocation", required = false) String posterLocation,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "schedules", required = false) String schedulesJson, // 일정 데이터 JSON
            @RequestParam("category") String category
    ) throws IOException {
        try {
            Program program = new Program();
            program.setName(name);
            program.setStartDate(startDate);
            program.setEndDate(endDate);
            program.setMaxParticipants(maxParticipants);
            program.setTarget(target);
            program.setGradeGender(gradeGender);
            program.setDepartment(department);
            program.setPosterName(posterName);
            program.setPosterEmail(posterEmail);
            program.setPosterPhone(posterPhone);
            program.setPosterLocation(posterLocation);
            program.setDescription(description);
            program.setCategory(Program.Category.valueOf(category)); // 카테고리 설정

            if (image != null && !image.isEmpty()) {
                String imagePath = programService.saveImage(image); // 이미지 저장
                program.setImageUrl(imagePath);
            }

            if (schedulesJson != null && !schedulesJson.isEmpty()) {
                List<Schedule> schedules = programService.parseSchedules(schedulesJson); // 일정 파싱
                program.setSchedules(schedules);
            }

            Program savedProgram = programService.addProgram(program); // 프로그램 저장

            messagingTemplate.convertAndSend("/topic/programs", savedProgram); // WebSocket으로 업데이트 전송

            System.out.println("✅ 프로그램 등록 완료: " + savedProgram.getName());
            return ResponseEntity.ok(savedProgram); // 프로그램 등록 성공
        } catch (IllegalArgumentException e) {
            System.out.println("🚨 잘못된 카테고리 값: " + category);
            return ResponseEntity.badRequest().build(); // 잘못된 카테고리 값 처리
        }
    }

    /**
     * ✅ 이미지 파일 조회
     * 저장된 이미지를 조회하여 반환하는 메서드입니다.
     * 
     * @param filename - 조회할 이미지 파일 이름
     * @return ResponseEntity<byte[]> - 이미지 데이터
     * @throws IOException - 파일을 읽는 중 발생할 수 있는 예외
     */
    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws IOException {
        System.out.println("📌 [API 요청] 이미지 조회: " + filename);
        byte[] image = programService.loadImage(filename); // 이미지 파일 로드

        if (image != null) {
            String contentType = Files.probeContentType(Paths.get("uploads/" + filename)); // 이미지 타입 추측
            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=\"" + filename + "\"") // 이미지 표시
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType)) // 이미지 타입 설정
                    .body(image); // 이미지 반환
        } else {
            System.out.println("🚨 이미지 파일을 찾을 수 없음: " + filename);
            return ResponseEntity.notFound().build(); // 이미지 파일 없으면 404 반환
        }
    }

    /**
     * ✅ 사용자 요청을 받기 위한 내부 DTO
     * 사용자 ID를 전달받기 위한 DTO입니다.
     */
    static class UserRequest {
        private Long userId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }

    /**
     * ✅ WebSocket 응답 DTO
     * WebSocket 메시지를 송신하기 위한 DTO입니다.
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
    }
}