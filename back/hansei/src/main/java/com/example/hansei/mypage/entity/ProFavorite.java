package com.example.hansei.mypage.entity;

import com.example.hansei.entity.HanUser;
import com.example.hansei.programs.Program;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "program_favorites",
	    uniqueConstraints = { @UniqueConstraint(columnNames = {"user_id", "program_id"})})
public class ProFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long favId; // 즐겨찾기 ID

    @ManyToOne(fetch = FetchType.LAZY) // ✅ 유저 정보와 다대일 관계
    @JoinColumn(name = "user_id", nullable = false) // ✅ 외래 키 명확히 설정
    private HanUser user;

    @ManyToOne(fetch = FetchType.LAZY) // ✅ 프로그램과 다대일 관계
    @JoinColumn(name = "program_id", nullable = false) // ✅ 외래 키 명확히 설정
    private Program program;

    public ProFavorite(HanUser user, Program program) {
        this.user = user;
        this.program = program;
    }
    
    @Column(nullable = false)
    private boolean favorite = true;
    
    @PrePersist
    public void prePersist() {
        if (this.favorite == false) {
            this.favorite = true; // ✅ DB 저장 전 기본값 강제 적용
        }
    }


}
