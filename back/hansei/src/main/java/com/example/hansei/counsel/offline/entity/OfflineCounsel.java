package com.example.hansei.counsel.offline.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OfflineCounsel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String counselor;
	
	@Column(nullable = false)
	private String counselorId;
	
	@Column(nullable = true)
	private String client;
	
	@Column(nullable = false)
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate counsel_date;
	
	@Column(nullable = false)
	private String counsel_time;
	
	@Column(name = "status")
	private boolean reserve_status;

}
