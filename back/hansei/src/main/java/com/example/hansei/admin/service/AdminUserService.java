package com.example.hansei.admin.service;

import com.example.hansei.entity.HanUser;
import com.example.hansei.admin.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;

    // 전체 사용자 수 반환
    public long getUserCount() {
        return adminUserRepository.count();
    }

    // 최근 등록된 사용자 목록 반환
    public HanUser getLatestUser() {
        return adminUserRepository.findTopByOrderByRegTimeDesc().orElse(null);
    }
}
