package com.example.hansei.recruitment.dto;

import com.example.hansei.entity.SuggestBoardImg; // 변경된 부분

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SuggestBoardImgDto { // 변경된 부분
    private Long id;
    private String imgName;
    private String oriImgName;
    private String imgUrl;

    @Builder
    public SuggestBoardImgDto(Long id, String imgName, String oriImgName, String imgUrl) { // 변경된 부분
        this.id = id;
        this.imgName = imgName;
        this.oriImgName = oriImgName;
        this.imgUrl = convertToWebPath(imgUrl); // ✅ 이미지 경로 변환
    }

    // ✅ "src/main/resources/static/images/board/1/base1.png" → "/images/board/1/base1.png"
    private String convertToWebPath(String originalPath) {
        if (originalPath == null) return null;
        return originalPath.replace("src\\main\\resources\\static\\", "/")
                           .replace("src/main/resources/static/", "/") // ✅ 경로 정리
                           .replace("\\", "/"); // ✅ 역슬래시 제거
    }

    public static SuggestBoardImgDto fromEntity(SuggestBoardImg suggestBoardImg) { // 변경된 부분
        return SuggestBoardImgDto.builder()
                .id(suggestBoardImg.getId())
                .imgName(suggestBoardImg.getImgName())
                .oriImgName(suggestBoardImg.getOriImgName())
                .imgUrl(suggestBoardImg.getImgUrl()) // ✅ 변환된 imgUrl 사용
                .build();
    }
}
