package com.example.hansei.recruitmentapi.entity;

import com.example.hansei.entity.HanUser;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "event_favorite")
public class EventFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private HanUser user;

    @Column(nullable = false)
    private String eventNo; // 🔥 API의 고유 ID 저장

    @Column(nullable = false)
    private boolean isDeleted = false;  // Soft Delete 적용

    // 📌 즐겨찾기 취소 (Soft Delete)
    public void softDelete() {
        this.isDeleted = true;
    }
}
