package com.example.hansei.mypage.entity;

import com.example.hansei.entity.HanUser;
import com.example.hansei.entity.SuggestBoard;

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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "favorite_board")
public class FavoriteBoard {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  // ✅ 사용자와 N:1 관계
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private HanUser user;

    @ManyToOne(fetch = FetchType.LAZY)  // ✅ 게시글과 N:1 관계
    @JoinColumn(name = "suggest_board_id", referencedColumnName = "suggest_board_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private SuggestBoard suggestBoard;

    @Column(nullable = false)
    private boolean isDeleted = false;  // Soft Delete 적용

    // 📌 즐겨찾기 취소 (Soft Delete)
    public void softDelete() {
        this.isDeleted = true;
    }
}
