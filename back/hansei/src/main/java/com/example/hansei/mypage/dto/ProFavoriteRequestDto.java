package com.example.hansei.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProFavoriteRequestDto {

	private Long userId;
	private Long programId;
}	