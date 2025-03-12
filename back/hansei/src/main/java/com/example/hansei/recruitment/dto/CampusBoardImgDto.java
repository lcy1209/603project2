package com.example.hansei.recruitment.dto;

import com.example.hansei.entity.CampusBoardImg; // CampusBoardImg 엔티티를 import

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CampusBoardImgDto {
    private Long id;
    private String imgName;
    private String oriImgName;
    private String imgUrl;

    @Builder
    public CampusBoardImgDto(Long id, String imgName, String oriImgName, String imgUrl) {
        this.id = id;
        this.imgName = imgName;
        this.oriImgName = oriImgName;
        this.imgUrl = convertToWebPath(imgUrl); // ✅ 이미지 경로 변환
    }

    // ✅ "src/main/resources/static/images/campus/1/base1.png" → "/images/campus/1/base1.png"
    private String convertToWebPath(String originalPath) {
        if (originalPath == null) return null;
        return originalPath.replace("src\\main\\resources\\static\\", "/")
                           .replace("src/main/resources/static/", "/") // ✅ 경로 정리
                           .replace("\\", "/"); // ✅ 역슬래시 제거
    }

    public static CampusBoardImgDto fromEntity(CampusBoardImg campusBoardImg) {
        return CampusBoardImgDto.builder()
                .id(campusBoardImg.getId())
                .imgName(campusBoardImg.getImgName())
                .oriImgName(campusBoardImg.getOriImgName())
                .imgUrl(campusBoardImg.getImgUrl()) // ✅ 변환된 imgUrl 사용
                .build();
    }
}
