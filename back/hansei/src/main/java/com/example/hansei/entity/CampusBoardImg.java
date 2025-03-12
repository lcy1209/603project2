package com.example.hansei.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name="campus_board_img") // 캠퍼스 게시판 이미지 테이블 이름
public class CampusBoardImg {
	
	@Id
	@Column(name = "campus_board_img_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String imgName; // 이미지 파일명

	@Column(nullable = false)
	private String oriImgName; // 원본 이미지 파일명

	@Column(nullable = false)
	private String imgUrl; // 이미지 조회 경로

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonBackReference
	@JoinColumn(name = "campus_board_id") // 캠퍼스 게시글과의 관계 설정
	private CampusBoard campusBoard;

	@Column(nullable = false)
	private boolean isDeleted = false; // ✅ Soft Delete를 위한 필드 추가

	public void updateCampusBoardImg(String oriImgName, String imgName, String imgUrl) {
		this.oriImgName = oriImgName;
		this.imgName = imgName;
		this.imgUrl = imgUrl;
	}

	// ✅ Soft Delete 적용
	public void softDelete() {
		this.isDeleted = true;
	}

	@Builder
	public CampusBoardImg(String oriImgName, String imgName, String imgUrl, CampusBoard campusBoard, boolean isDeleted) {
	    this.oriImgName = oriImgName;
	    this.imgName = imgName;
	    this.imgUrl = imgUrl;
	    this.campusBoard = campusBoard;
	    this.isDeleted = isDeleted; // ✅ Soft Delete 상태 반영
	}
}
