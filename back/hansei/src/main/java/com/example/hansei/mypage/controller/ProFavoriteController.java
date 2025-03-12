package com.example.hansei.mypage.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.mypage.dto.ProFavoriteRequestDto;
import com.example.hansei.mypage.dto.ProFavoriteResponseDto;
import com.example.hansei.mypage.service.ProFavoriteService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Slf4j
public class ProFavoriteController {

    private final ProFavoriteService proFavoriteService;

    // ✅ 즐겨찾기 추가/해제 (토글)
    @PostMapping("/toggle")
    public ResponseEntity<String> toggleFavorite(@RequestBody ProFavoriteRequestDto requestDto) {
        proFavoriteService.toggleFavorite(requestDto.getUserId(), requestDto.getProgramId());
        return ResponseEntity.ok("즐겨찾기 상태 변경 완료");
    }

    // ✅ 즐겨찾기 해제 (favorite=false)
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFavorite(@RequestBody ProFavoriteRequestDto requestDto) {
        proFavoriteService.removeFavorite(requestDto.getUserId(), requestDto.getProgramId());
        return ResponseEntity.ok("즐겨찾기 해제 완료");
    }

    // ✅ 특정 사용자의 즐겨찾기 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<ProFavoriteResponseDto>> getFavorites(@RequestParam Long userId) {
        List<ProFavoriteResponseDto> favorites = proFavoriteService.getUserFavorites(userId)
            .stream()
            .map(ProFavoriteResponseDto::fromEntity)
            .toList();
        return ResponseEntity.ok(favorites);
    }
}