package com.example.hansei.recruitment.dto;

import java.util.List;

import com.example.hansei.entity.CampusBoard; // CampusBoard 엔티티를 import

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class CampusBoardFormDto {

    private Long id;

    @NotBlank(message = "제목은 필수 입력 값입니다.")
    private String title;

    @NotBlank(message = "내용은 필수 입력 값입니다.")
    private String content;

    private List<Long> idList; // 📌 여러 개의 ID를 처리할 경우 사용

    @Builder
    public CampusBoardFormDto(Long id, String title, String content, List<Long> idList) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.idList = idList;
    }

    // 📌 DTO → Entity 변환 메서드 (Builder 사용)
    public CampusBoard toEntity() {
        return CampusBoard.builder()
            .title(this.title)
            .content(this.content)
            .build();
    }
}
