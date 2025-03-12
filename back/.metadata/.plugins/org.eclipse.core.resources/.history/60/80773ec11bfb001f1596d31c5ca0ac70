package com.example.hansei.programs;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    
    // ✅ 특정 카테고리의 프로그램 조회 기능 유지
    List<Program> findByCategory(Program.Category category);
    
    // ❌ 기존 applicants 기반 조회 삭제 (Application 테이블을 사용하여 조회하도록 변경)
}
