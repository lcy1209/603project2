package com.example.hansei.programs;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String startDate;
    private String endDate;
    private int maxParticipants;
    private int currentParticipants = 0; // ✅ 현재 신청자 수 저장
    private String imageUrl;

    private String target;
    private String gradeGender;
    private String department;
    private String posterName;
    private String posterEmail;
    private String posterPhone;
    private String posterLocation;
    private String description;

    @ElementCollection
    private List<Schedule> schedules = new ArrayList<>(); // ✅ 일정 정보 저장

    // ✅ 신청자 목록을 `applications` 테이블에서 관리하므로 삭제됨
    
    // ✅ 카테고리 필드 추가
    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // DB에서 NULL 허용 안 함
    private Category category = Category.전체; // 기본값을 '전체'로 설정

    // ✅ 프로그램 상태 추가 (예: 모집중, 마감)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgramStatus status = ProgramStatus.모집중;

    public enum Category {
        전체, 취업, 창업, 진로
    }

    public enum ProgramStatus {
        모집중, 마감
    }

    // ✅ 신청자 목록을 관리하는 메서드 추가 (이제는 applications 테이블을 통해 관리)
    public void increaseCurrentParticipants() {
        this.currentParticipants += 1;
    }

    public void decreaseCurrentParticipants() {
        if (this.currentParticipants > 0) {
            this.currentParticipants -= 1;
        }
    }
} 

@Data
@Embeddable
class Schedule {
    private String scheduleName;
    private String date;
    private int maxApplicants;
    private String status;
}
