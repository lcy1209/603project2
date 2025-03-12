package com.example.hansei.mypage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hansei.entity.HanUser;
import com.example.hansei.mypage.entity.ProFavorite;
import com.example.hansei.programs.Program;

@Repository
public interface ProFavoriteRepository extends JpaRepository<ProFavorite, Long> {

    // ✅ 특정 사용자와 프로그램의 즐겨찾기 데이터 조회
    Optional<ProFavorite> findByUserAndProgram(HanUser user, Program program);

    // 특정 유저가 특정 프로그램의 즐겨찾기를 삭제
    void deleteByUserAndProgram(HanUser user, Program program);

    // ✅ 특정 사용자의 favorite=true인 데이터만 조회
    List<ProFavorite> findByUserAndFavoriteTrue(HanUser user);
}


    