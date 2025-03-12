package com.example.hansei.login.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hansei.entity.HanUser;

public interface UserRepository extends JpaRepository<HanUser, Long> {

    // 아이디 중복 체크
    Optional<HanUser> findByLoginid(String loginid);

    // 이메일 중복 체크
    Optional<HanUser> findByEmail(String email);

    // 아이디 찾기
    Optional<HanUser> findByEmailAndName(String email, String name);

    // 비밀번호 재설정용 사용자 조회
    Optional<HanUser> findByLoginidAndEmail(String loginid, String email);
}
