package com.example.hansei.counsel.offline.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfflineCounselDto {
	
	private Long id;
	private String counselor;
	private String counselorId;
	private String client;
	private LocalDate counsel_date;
	private String counsel_time;
	private boolean reserve_status;

}
