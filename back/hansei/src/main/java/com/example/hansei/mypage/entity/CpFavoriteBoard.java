package com.example.hansei.mypage.entity;

import com.example.hansei.entity.CampusBoard;
import com.example.hansei.entity.HanUser;

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
@Table(name = "cpfavorite_board")
public class CpFavoriteBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private HanUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_board_id", referencedColumnName = "campus_board_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private CampusBoard campusBoard;

    @Column(nullable = false)
    private boolean isDeleted = false;

    // 📌 즐겨찾기 취소 (Soft Delete)
    public void softDelete() {
        this.isDeleted = true;
    }
}
