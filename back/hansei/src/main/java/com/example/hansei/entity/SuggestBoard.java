package com.example.hansei.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.hansei.recruitment.dto.SuggestBoardFormDto;
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
@Table(name="suggest_board")
public class SuggestBoard {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="suggest_board_id")
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
    @OneToMany(mappedBy = "suggestBoard", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = false)
    private List<SuggestBoardImg> suggestBoardImgs = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "user_id", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private HanUser hanUser;

    // ✅ Soft Delete 필드 추가
    @Column(nullable = false)
    private boolean isDeleted = false;

    // 📌 게시글 수정 (Soft Delete 포함)
    public void updateSuggestBoard(SuggestBoardFormDto boardFormDto, HanUser hanUser) {
        this.title = boardFormDto.getTitle();
        this.content = boardFormDto.getContent();
        if (hanUser != null) {
            this.hanUser = hanUser;
        }
    }

    // 📌 게시글 삭제 (Soft Delete 적용)
    public void softDelete() {
        this.isDeleted = true;
    }

    // 📌 조회수 증가 (동시성 고려)
    @Version  // ✅ 낙관적 락 적용
    private Long version;

    public void increaseCount() {
        this.count += 1;
    }

    @Builder
    public SuggestBoard(String title, String content, HanUser hanUser, boolean isDeleted) {
        this.title = title;
        this.content = content;
        this.hanUser = hanUser;
        this.count = 0;
        this.isDeleted = isDeleted; // Soft Delete 기본값 false
    }
}
