package com.example.hansei.board.common.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDto {
	
    private Long id;
    private String title;
    private String content;
    private String author;
    private LocalDateTime createdDate;
    private List<MultipartFile> attachments;	// 파일 업로드용
    private List<FileDto> fileList;				// 파일 조회용
    private List<Long> filesToDelete; // 삭제할 파일 ID 목록을 담을 필드 추가
}
