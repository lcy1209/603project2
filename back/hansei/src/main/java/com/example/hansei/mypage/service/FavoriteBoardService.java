package com.example.hansei.mypage.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.hansei.entity.HanUser;
import com.example.hansei.entity.SuggestBoard;
import com.example.hansei.login.repository.UserRepository;
import com.example.hansei.mypage.entity.FavoriteBoard;
import com.example.hansei.mypage.repository.FavoriteBoardRepository;
import com.example.hansei.recruitment.dto.SuggestBoardDto;
import com.example.hansei.recruitment.repository.SuggestBoardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteBoardService {

    private final FavoriteBoardRepository favoriteBoardRepository;
    private final SuggestBoardRepository suggestBoardRepository;
    private final UserRepository UserRepository;

    // 📌 즐겨찾기 추가
    public void addFavorite(Long userId, Long suggestBoardId) {
        if (favoriteBoardRepository.findByUser_UserIdAndSuggestBoard_Id(userId, suggestBoardId).isEmpty()) {
            HanUser user = UserRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            SuggestBoard board = suggestBoardRepository.findById(suggestBoardId)
                    .orElseThrow(() -> new RuntimeException("Board not found"));

            FavoriteBoard favorite = new FavoriteBoard();
            favorite.setUser(user);
            favorite.setSuggestBoard(board);
            favorite.setDeleted(false);
            favoriteBoardRepository.save(favorite);
        }
    }

    // 📌 즐겨찾기 취소 (Soft Delete 적용)
    public void removeFavorite(Long userId, Long suggestBoardId) {
        favoriteBoardRepository.findByUser_UserIdAndSuggestBoard_Id(userId, suggestBoardId)
                .ifPresent(favorite -> {
                    favorite.setDeleted(true);
                    favoriteBoardRepository.save(favorite);
                });
    }

    // 📌 사용자의 즐겨찾기한 게시글 목록 조회
    public List<SuggestBoardDto> getFavoriteBoards(Long userId) {
        List<FavoriteBoard> favorites = favoriteBoardRepository.findByUser_UserIdAndIsDeletedFalse(userId);

        return favorites.stream()
                .map(fav -> fav.getSuggestBoard() != null ? SuggestBoardDto.fromEntity(fav.getSuggestBoard()) : null)
                .filter(Objects::nonNull)  // ✅ Null 값 제거
                .collect(Collectors.toList());
    }

    
    public List<SuggestBoardDto> getUserFavoriteBoards(Long userId) {
        List<SuggestBoard> favoriteBoards = favoriteBoardRepository.findFavoritesByUserId(userId);
        return favoriteBoards.stream().map(SuggestBoardDto::fromEntity).collect(Collectors.toList());
    }
}
