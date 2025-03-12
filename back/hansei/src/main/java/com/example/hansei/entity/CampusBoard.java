package com.example.hansei.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.hansei.recruitment.dto.CampusBoardFormDto;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name="campus_board") // 캠퍼스 게시판 테이블 이름
public class CampusBoard {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="campus_board_id")
    private Long id;

    private String title; // 제목
    private String content; // 내용

    @Column(nullable = false)
    private int count = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime regTime; // 등록 시간

    @UpdateTimestamp
    private LocalDateTime updateTime; // 수정 시간

    @JsonManagedReference
    @OneToMany(mappedBy = "campusBoard", fetch=FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CampusBoardImg> campusBoardImgs = new ArrayList<>(); // 캠퍼스 게시글 이미지

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "user_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private HanUser hanUser;

    // ✅ Soft Delete 필드 추가
    @Column(nullable = false)
    private boolean isDeleted = false;

    // 📌 게시글 수정 (Soft Delete 포함)
    public void updateCampusBoard(CampusBoardFormDto campusBoardFormDto, HanUser hanUser) {
        this.title = campusBoardFormDto.getTitle();
        this.content = campusBoardFormDto.getContent();
        if (hanUser != null) {
            this.hanUser = hanUser;
        }
    }

    // 📌 게시글 삭제 (Soft Delete 적용)
    public void softDelete() {
        this.isDeleted = true;
    }

    // 📌 조회수 증가 (동시성 고려)
    @Version // ✅ 낙관적 락 적용
    private Long version;

    public void increaseCount() {
        this.count += 1;
    }

    @Builder
    public CampusBoard(String title, String content, HanUser hanUser, boolean isDeleted) {
        this.title = title;
        this.content = content;
        this.hanUser = hanUser;
        this.count = 0;
        this.isDeleted = isDeleted; // Soft Delete 기본값 false
    }
}
