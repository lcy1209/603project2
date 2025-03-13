package com.example.hansei.admin.repository;

import com.example.hansei.entity.HanUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<HanUser, Long> {

    // 전체 사용자 수 조회
    long count();

    // 최근 등록된 사용자 조회
    Optional<HanUser> findTopByOrderByRegTimeDesc();
}
