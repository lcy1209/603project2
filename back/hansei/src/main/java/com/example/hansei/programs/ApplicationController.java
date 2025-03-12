package com.example.hansei.programs;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.hansei.security.user.CustomUser;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/programs/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {
    private final ApplicationService applicationService;

    // Constructor to inject the ApplicationService
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * ✅ 특정 사용자의 신청 내역 조회 (같은 프로그램 신청자 포함)
     * 이 엔드포인트는 로그인한 사용자의 신청 내역을 조회합니다.
     * 신청자는 같은 프로그램을 여러 번 신청할 수 있으므로, 같은 프로그램을 신청한 사용자들을 묶어 조회합니다.
     * 
     * @param customUser - 현재 로그인한 사용자 정보
     * @return ResponseEntity<List<ApplicationDto>> - 신청 내역 리스트 (ProgramDto 형태로 반환)
     */
    @GetMapping
    public ResponseEntity<List<ApplicationDto>> getUserApplications(@AuthenticationPrincipal CustomUser customUser) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Long userId = customUser.getUser().getUserId(); // 로그인된 사용자 ID 가져오기
        // getUserApplications에서 List<ApplicationDto> 반환한다고 가정
        List<ApplicationDto> applicationDtos = applicationService.getUserApplications(userId);

        System.out.println("📌 [신청 내역 조회] userId=" + userId + " → 신청 내역: " + applicationDtos);
        return ResponseEntity.ok(applicationDtos);
    }

    /**
     * ✅ 특정 프로그램의 신청 내역 조회 (같은 프로그램 신청자 포함)
     * 이 엔드포인트는 특정 프로그램에 대한 모든 신청 내역을 조회합니다.
     * 프로그램 ID를 기준으로 신청자 목록을 반환합니다.
     * 
     * @param programId - 조회할 프로그램 ID
     * @return ResponseEntity<ApplicationDto> - 특정 프로그램에 대한 신청 내역 (DTO 형태로 반환)
     */
    @GetMapping("/{programId}")
    public ResponseEntity<ApplicationDto> getProgramApplications(@PathVariable Long programId) {
        List<ApplicationDto> applicationDtos = applicationService.getProgramApplications(programId);

        if (applicationDtos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(applicationDtos.get(0)); // ✅ 리스트에서 첫 번째 DTO만 반환 (같은 프로그램을 신청한 여러 신청자를 하나로 묶어서 반환)
    }

    /**
     * ✅ 프로그램 신청 (JWT 기반 userId 자동 처리)
     * 이 엔드포인트는 사용자가 특정 프로그램에 신청하는 기능을 제공합니다.
     * 사용자가 신청하려는 프로그램 ID와 함께 POST 요청을 보내면, 프로그램에 신청한 사용자로 처리됩니다.
     * 
     * @param programId - 신청할 프로그램 ID
     * @param customUser - 현재 로그인한 사용자 정보
     * @return ResponseEntity<String> - 신청 완료 또는 실패 메시지
     */
    @PostMapping("/{programId}/apply")
    public ResponseEntity<String> applyForProgram(@PathVariable Long programId,
                                                  @AuthenticationPrincipal CustomUser customUser) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Long userId = customUser.getUser().getUserId(); // 로그인된 사용자 ID 가져오기
        Optional<Application> application = applicationService.applyForProgram(userId, programId);

        if (application.isPresent()) {
            System.out.println("✅ [신청 완료] userId=" + userId + ", programId=" + programId);
            return ResponseEntity.ok("✅ 신청 완료");
        } else {
            System.out.println("🚨 [신청 실패] 이미 신청했거나 정원이 초과됨: userId=" + userId + ", programId=" + programId);
            return ResponseEntity.badRequest().body("🚨 신청 실패: 이미 신청했거나 정원이 초과되었습니다.");
        }
    }
}