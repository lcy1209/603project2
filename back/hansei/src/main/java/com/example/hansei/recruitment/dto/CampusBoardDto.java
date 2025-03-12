package com.example.hansei.recruitment.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.hansei.entity.CampusBoard;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CampusBoardDto {

    private Long id;
    private String title;
    private String content;
    private int count;
    private String writerName;
    private int page = 0;
    private int size = 10;
    private String searchBy;
    private String searchQuery;
    private LocalDateTime regTime; // 작성일 필드 추가

    private List<CampusBoardImgDto> campusBoardImgs; // 캠퍼스 이미지 목록 포함

    @Builder
    public CampusBoardDto(Long id, String title, String content, int count, String writerName,
                          LocalDateTime regTime, int page, int size, String searchBy, String searchQuery,
                          List<CampusBoardImgDto> campusBoardImgs) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.count = count;
        this.writerName = writerName;
        this.regTime = regTime; // 작성일 설정
        this.page = page;
        this.size = size;
        this.searchBy = searchBy != null ? searchBy : "title";
        this.searchQuery = searchQuery != null ? searchQuery : "";
        this.campusBoardImgs = campusBoardImgs;
    }

    // Entity → DTO 변환 메서드 수정 (작성일 포함)
    public static CampusBoardDto fromEntity(CampusBoard campusBoard) {
        return CampusBoardDto.builder()
                .id(campusBoard.getId())
                .title(campusBoard.getTitle())
                .content(campusBoard.getContent())
                .count(campusBoard.getCount())
                .writerName(campusBoard.getHanUser() != null ? campusBoard.getHanUser().getName() : "알 수 없음")
                .regTime(campusBoard.getRegTime()) // 작성일 설정
                .campusBoardImgs(campusBoard.getCampusBoardImgs().stream()
                        .map(CampusBoardImgDto::fromEntity)
                        .collect(Collectors.toList())) // 캠퍼스 이미지 변환 추가
                .build();
    }
}
