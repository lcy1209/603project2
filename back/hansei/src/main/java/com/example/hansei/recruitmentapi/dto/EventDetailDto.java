package com.example.hansei.recruitmentapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventDetailDto {
    private String eventNo;             // 채용행사번호
    private String title;               // 행사명
    private String area;                // 지역
    private String areaCd;              // 지역 코드
    private String eventTerm;           // 행사 기간
    private String eventPlc;            // 행사 장소
    private String joinCoWantedInfo;    // 참여 기업 정보
    private String subMatter;           // 추가 사항
    private String inqTelNo;            // 문의 전화번호
    private String fax;                 // 팩스 번호
    private String charger;              // 담당자
    private String email;                // 이메일
    private String visitPath;           // 방문 경로
}
