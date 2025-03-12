package com.example.hansei.mypage.controller;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.entity.HanUser;
import com.example.hansei.mypage.service.FavoriteBoardService;
import com.example.hansei.recruitment.dto.SuggestBoardDto;
import com.example.hansei.security.user.CustomUser;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteBoardController {

	private static final Logger logger = LoggerFactory.getLogger(FavoriteBoardController.class);
	
    private final FavoriteBoardService favoriteBoardService;

    @PostMapping("/{boardId}")
    public ResponseEntity<String> addFavorite(@PathVariable Long boardId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("🚨 SecurityContext에서 인증 객체를 찾을 수 없습니다!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUser customUser) { // ✅ CustomUser에서 HanUser 가져오기
            HanUser user = customUser.getUser();
            logger.info("✅ 로그인한 사용자 ID: {}", user.getUserId());
            favoriteBoardService.addFavorite(user.getUserId(), boardId);
            return ResponseEntity.ok("즐겨찾기에 추가되었습니다.");
        }

        logger.error("🚨 인증 객체가 CustomUser 타입이 아닙니다. 현재 타입: {}", principal.getClass().getName());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 인증 정보입니다.");
    }



    @DeleteMapping("/{boardId}")
    public ResponseEntity<String> removeFavorite(@PathVariable Long boardId, @AuthenticationPrincipal CustomUser customUser) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        HanUser user = customUser.getUser();

        try {
            favoriteBoardService.removeFavorite(user.getUserId(), boardId);
            return ResponseEntity.ok("즐겨찾기가 취소되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    
    @GetMapping("/my-favorites")
    public ResponseEntity<List<SuggestBoardDto>> getUserFavorites(@AuthenticationPrincipal CustomUser customUser) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList());
        }

        HanUser user = customUser.getUser();
        List<SuggestBoardDto> favorites = favoriteBoardService.getUserFavoriteBoards(user.getUserId());

        return ResponseEntity.ok(favorites);
    }

}
