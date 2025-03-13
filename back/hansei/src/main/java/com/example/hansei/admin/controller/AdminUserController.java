package com.example.hansei.admin.controller;

import com.example.hansei.entity.HanUser;
import com.example.hansei.admin.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;  // ✅ 변수명 수정

    // 전체 사용자 수 반환
    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        long count = adminUserService.getUserCount();
        return ResponseEntity.ok(count);
    }

    // 최근 등록된 사용자 반환
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestUser() {
        HanUser latestUser = adminUserService.getLatestUser();
        if (latestUser == null) {
            return ResponseEntity.noContent().build();  // ✅ 204 No Content 반환
        }
        return ResponseEntity.ok(latestUser);
    }
}

