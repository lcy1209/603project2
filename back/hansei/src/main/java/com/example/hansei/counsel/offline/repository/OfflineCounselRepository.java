package com.example.hansei.counsel.offline.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.hansei.counsel.offline.entity.OfflineCounsel;

public interface OfflineCounselRepository extends JpaRepository<OfflineCounsel, Long>{

	List<OfflineCounsel> findByCounselorId(String counselorId);
	
	// 월 별 상담 횟수
	@Query(value = """
	        SELECT DATE_FORMAT(counsel_date, '%Y-%m') AS month, COUNT(*) AS count
	        FROM offline_counsel
	        WHERE status = 1
	        AND counsel_date BETWEEN :startDate AND :endDate
	        GROUP BY DATE_FORMAT(counsel_date, '%Y-%m')
	        ORDER BY month
	    """, nativeQuery = true)
	List<Object[]> findMonthlyStats(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
	
	// 상담사 별 상담 횟수
	@Query(value = """
		    SELECT DATE_FORMAT(counsel_date, '%Y-%m') AS month, counselor, COUNT(*) AS count
		    FROM offline_counsel
		    WHERE status = 1
		    AND counsel_date BETWEEN :startDate AND :endDate
		    GROUP BY counselor
		    ORDER BY counselor
	    """, nativeQuery = true)
	List<Object[]> findMonthlyCounselorStats(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
	
}
