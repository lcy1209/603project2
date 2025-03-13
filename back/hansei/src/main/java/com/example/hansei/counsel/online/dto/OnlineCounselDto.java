package com.example.hansei.counsel.online.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OnlineCounselDto {
	
	private Long id;
    private String title;
    private String content;
    private String author;
    private String authorId;
    private LocalDateTime createdDate;
    private String answer;
    private String answerer;
    private LocalDateTime answerDate;

}
