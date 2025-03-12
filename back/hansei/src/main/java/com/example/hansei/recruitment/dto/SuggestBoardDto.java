package com.example.hansei.recruitment.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.annotation.CreatedDate;

import com.example.hansei.entity.SuggestBoard; // 변경된 부분
import com.example.hansei.recruitment.dto.SuggestBoardImgDto;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SuggestBoardDto { // 변경된 부분
    
    private Long id;
    private String title;
    private String content;
    private int count;
    private String writerName;
    private int page = 0;
    private int size = 10;
    private String searchBy;
    private String searchQuery;
    
    @CreatedDate
	@Column(updatable=false)
    private LocalDateTime regTime; // 작성일 필드 추가

    private List<SuggestBoardImgDto> suggestBoardImgs; // 변경된 부분: 이미지 목록 포함
    
    @Builder
    public SuggestBoardDto(Long id, String title, String content, int count, String writerName, LocalDateTime regTime, int page, int size, String searchBy, String searchQuery, List<SuggestBoardImgDto> suggestBoardImgs) { // 변경된 부분
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
        this.suggestBoardImgs = suggestBoardImgs; // 변경된 부분
    }

    // Entity → DTO 변환 메서드 수정 (작성일 포함)
    public static SuggestBoardDto fromEntity(SuggestBoard suggestBoard) { // 변경된 부분
        return SuggestBoardDto.builder()
                .id(suggestBoard.getId())
                .title(suggestBoard.getTitle())
                .content(suggestBoard.getContent())
                .count(suggestBoard.getCount())
                .writerName(suggestBoard.getHanUser() != null ? suggestBoard.getHanUser().getName() : "알 수 없음")
                .regTime(suggestBoard.getRegTime()) // 작성일 설정
                .suggestBoardImgs(suggestBoard.getSuggestBoardImgs().stream().map(SuggestBoardImgDto::fromEntity).collect(Collectors.toList())) // 변경된 부분: 이미지 변환 추가
                .build();
    }
}
