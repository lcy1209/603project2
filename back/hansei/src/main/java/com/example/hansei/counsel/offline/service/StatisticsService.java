package com.example.hansei.counsel.offline.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.hansei.counsel.offline.dto.MonthlyCounselorStatsDto;
import com.example.hansei.counsel.offline.dto.MonthlyStatsDto;
import com.example.hansei.counsel.offline.repository.OfflineCounselRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StatisticsService {
	
	private final OfflineCounselRepository offlineCounselRepository;
	
	// 캐싱된 월별 상담 통계 조회 (사용자 호출)
    @Cacheable("monthlyStats")
    public List<MonthlyStatsDto> getMonthlyStats() {
        return monthlyStats();
    }

    // 캐싱 데이터 갱신 (스케줄러에서 호출)
    @CachePut("monthlyStats")
    public List<MonthlyStatsDto> updateMonthlyStatsCache() {
        return monthlyStats();
    }
    
    // 캐싱된 사용자별 상담 통계 조회 (사용자 호출)
    @Cacheable("monthlyCounselorStats")
    public List<MonthlyCounselorStatsDto> getMonthlyCounselorStats() {
        return monthlyCounselorStats();
    }

    // 캐싱 데이터 갱신 (스케줄러에서 호출)
    @CachePut("monthlyCounselorStats")
    public List<MonthlyCounselorStatsDto> updateMonthlyCounselorStatsCache() {
        return monthlyCounselorStats();
    }

    // 통계 데이터를 생성하는 실제 로직 (캐시와 독립적으로 사용 가능)
    private List<MonthlyStatsDto> monthlyStats() {
        LocalDate endDate = LocalDate.now().withDayOfMonth(1).minusDays(1);
        LocalDate startDate = endDate.minusMonths(5).withDayOfMonth(1);

        List<Object[]> results = offlineCounselRepository.findMonthlyStats(startDate, endDate);

        return results.stream()
            .map(result -> new MonthlyStatsDto((String) result[0], ((Number) result[1]).intValue()))
            .collect(Collectors.toList());
    }
    
    private List<MonthlyCounselorStatsDto> monthlyCounselorStats() {
        LocalDate endDate = LocalDate.now().withDayOfMonth(1).minusDays(1);
        LocalDate startDate = endDate.minusMonths(5).withDayOfMonth(1);

        List<Object[]> results = offlineCounselRepository.findMonthlyCounselorStats(startDate, endDate);

        return results.stream()
            .map(result -> new MonthlyCounselorStatsDto(
            		(String) result[0], 
            		(String) result[1], 
            		((Number) result[2]).intValue())
            	)
            .collect(Collectors.toList());
    }

}
