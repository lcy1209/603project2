package com.example.hansei.recruitmentapi.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDto {
    private String eventNo; // 채용행사번호
    private String title; // 행사명
    private String area; // 지역
    private String areaCd; // 지역 코드
    private String eventTerm; // 행사 기간
    private LocalDate startDate; // 시작일
    private LocalDate endDate; // 종료일
}
