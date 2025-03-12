package com.example.hansei.mypage.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.entity.CampusBoard;
import com.example.hansei.entity.HanUser;
import com.example.hansei.login.repository.UserRepository;
import com.example.hansei.mypage.entity.CpFavoriteBoard;
import com.example.hansei.mypage.entity.FavoriteBoard;
import com.example.hansei.mypage.repository.CpFavoriteBoardRepository;
import com.example.hansei.recruitment.dto.CampusBoardDto;
import com.example.hansei.recruitment.dto.SuggestBoardDto;
import com.example.hansei.recruitment.repository.CampusBoardRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CpFavoriteBoardService {

    private final CpFavoriteBoardRepository cpFavoriteBoardRepository;
    private final CampusBoardRepository campusBoardRepository;
    private final UserRepository userRepository;

    // 📌 즐겨찾기 추가
    @Transactional
    public void addFavorite(Long userId, Long campusBoardId) {
        if (cpFavoriteBoardRepository.findByUser_UserIdAndCampusBoard_Id(userId, campusBoardId).isEmpty()) {
            HanUser user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            CampusBoard board = campusBoardRepository.findById(campusBoardId)
                    .orElseThrow(() -> new RuntimeException("Board not found"));

            CpFavoriteBoard favorite = new CpFavoriteBoard();
            favorite.setUser(user);
            favorite.setCampusBoard(board);
            favorite.setDeleted(false);
            cpFavoriteBoardRepository.save(favorite);
        }
    }

    // 📌 즐겨찾기 취소 (Soft Delete 적용)
    @Transactional
    public void removeFavorite(Long userId, Long campusBoardId) {
        cpFavoriteBoardRepository.findByUser_UserIdAndCampusBoard_Id(userId, campusBoardId)
                .ifPresent(favorite -> {
                    favorite.setDeleted(true);
                    cpFavoriteBoardRepository.save(favorite);
                });
    }

    // 📌 사용자의 즐겨찾기한 캠퍼스 게시글 목록 조회
    public List<CampusBoardDto> getFavoriteBoards(Long userId) {
        List<CpFavoriteBoard> favorites = cpFavoriteBoardRepository.findByUser_UserIdAndIsDeletedFalse(userId);

        return favorites.stream()
                .map(fav -> fav.getCampusBoard() != null ? CampusBoardDto.fromEntity(fav.getCampusBoard()) : null)
                .filter(Objects::nonNull)  // ✅ Null 값 제거
                .collect(Collectors.toList());
    }
    
    public List<CampusBoardDto> getUserFavoriteBoards(Long userId) {
        List<CampusBoard> favoriteBoards = cpFavoriteBoardRepository.findFavoritesByUserId(userId);
        return favoriteBoards.stream().map(CampusBoardDto::fromEntity).collect(Collectors.toList());
    }

}
