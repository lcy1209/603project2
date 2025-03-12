package com.example.hansei.counsel.offline.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyCounselorStatsDto {
	
	private String month;
	private String counselor;
	private int count;
	
}
