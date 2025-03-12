package com.example.hansei.mypage.dto;

import com.example.hansei.mypage.entity.ProFavorite;
import com.example.hansei.programs.Program.Category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProFavoriteResponseDto {
    private Long favoriteId;
    private Long userId;
    private Long programId;
    private String programName; // 프로그램 이름 포함
    private boolean favorite;
    private String endDate;
    private Category category;
    private int maxParticipants;   

    public static ProFavoriteResponseDto fromEntity(ProFavorite favorite) {
        return new ProFavoriteResponseDto(
            favorite.getFavId(),
            favorite.getUser().getUserId(),
            favorite.getProgram().getId(),
            favorite.getProgram().getName(), // 프로그램 이름 추가
            favorite.isFavorite(),
            favorite.getProgram().getEndDate(),
            favorite.getProgram().getCategory(),
            favorite.getProgram().getMaxParticipants()
        );
    }
}