package com.example.hansei.mypage.service;



import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.entity.HanUser;
import com.example.hansei.programs.Program;
import com.example.hansei.mypage.entity.ProFavorite;
import com.example.hansei.mypage.repository.ProFavoriteRepository;
import com.example.hansei.programs.ProgramRepository;
import com.example.hansei.login.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProFavoriteService {

    private final ProFavoriteRepository proFavoriteRepository;
    private final UserRepository userRepository;
    private final ProgramRepository programRepository;

    // ✅ 즐겨찾기 추가 / 삭제 (토글)
    @Transactional // ✅ 반드시 트랜잭션을 사용해야 함
    public void toggleFavorite(Long userId, Long programId) {
        // 유저 및 프로그램 조회
        HanUser user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Program program = programRepository.findById(programId)
            .orElseThrow(() -> new RuntimeException("Program not found"));

        // 기존 즐겨찾기 존재 여부 확인
        Optional<ProFavorite> existingFavorite = proFavoriteRepository.findByUserAndProgram(user, program);

        if (existingFavorite.isPresent()) {
            // 즐겨찾기가 이미 있으면 삭제
            proFavoriteRepository.deleteByUserAndProgram(user, program);
            log.info("❌ 즐겨찾기 해제됨: userId={}, programId={}", userId, programId);
        } else {
            // 즐겨찾기 없으면 추가 (favorite를 true로 설정)
            ProFavorite newFavorite = new ProFavorite(user, program);
            newFavorite.setFavorite(true); // 즐겨찾기를 추가할 때는 true로 설정
            proFavoriteRepository.save(newFavorite);
            log.info("✅ 즐겨찾기 추가됨: userId={}, programId={}", userId, programId);
        }
    }

    // ✅ 특정 사용자의 즐겨찾기 목록 조회 (favorite=true인 데이터만)
    public List<ProFavorite> getUserFavorites(Long userId) {
        HanUser user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return proFavoriteRepository.findByUserAndFavoriteTrue(user); // favorite가 true인 데이터만 조회
    }

    // ✅ 즐겨찾기 해제 (favorite=false) - 삭제만 하는 메소드
    @Transactional
    public void removeFavorite(Long userId, Long programId) {
        HanUser user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Program program = programRepository.findById(programId)
            .orElseThrow(() -> new RuntimeException("Program not found"));

        Optional<ProFavorite> existingFavorite = proFavoriteRepository.findByUserAndProgram(user, program);

        if (existingFavorite.isPresent()) {
            // 즐겨찾기 삭제 (favorite를 false로 설정)
            proFavoriteRepository.deleteByUserAndProgram(user, program); // 데이터에서 삭제
            log.info("❌ 즐겨찾기 해제됨: userId={}, programId={}", userId, programId);
        } else {
            log.info("🚨 즐겨찾기 없음: userId={}, programId={}", userId, programId);
        }
    }
}