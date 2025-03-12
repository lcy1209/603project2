package com.example.hansei.programs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // ✅ 특정 사용자의 모든 신청 내역 조회
    List<Application> findByUserUserId(Long userId);

    // ✅ 특정 프로그램의 신청 내역 조회
    List<Application> findByProgramId(Long programId);

    // ✅ 특정 사용자가 특정 프로그램을 신청했는지 확인 (boolean 반환)
    boolean existsByUserUserIdAndProgramId(Long userId, Long programId);

    // ✅ 특정 사용자의 특정 프로그램 신청 내역 가져오기 (Optional 반환)
    Optional<Application> findByUserUserIdAndProgramId(Long userId, Long programId);
}