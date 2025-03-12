package com.example.hansei.counsel.offline.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.counsel.offline.dto.MonthlyCounselorStatsDto;
import com.example.hansei.counsel.offline.dto.MonthlyStatsDto;
import com.example.hansei.counsel.offline.dto.OfflineCounselDto;
import com.example.hansei.counsel.offline.service.OfflineCounselService;
import com.example.hansei.counsel.offline.service.StatisticsService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/counsel")
public class OfflineCounselController {

    private final OfflineCounselService offlineCounselService;
    private final StatisticsService statisticsService;

    // 일정 등록
    @PostMapping("/schedule")
    public ResponseEntity<String> createSchedule(@RequestBody OfflineCounselDto dto) {
        offlineCounselService.createSchedule(dto);
        return ResponseEntity.ok("일정이 등록되었습니다.");
    }
    
    // 일정 조회
    @GetMapping("/schedule")
    public List<OfflineCounselDto> getSchedules() {
        return offlineCounselService.getSchedules();
    }

    // 본인의 일정 조회
    @GetMapping("/schedule/manage")
    public List<OfflineCounselDto> getMySchedules(@RequestParam String counselor) {
        return offlineCounselService.getSchedulesByCounselor(counselor);
    }

    // 일정 삭제
    @DeleteMapping("/schedule/{id}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Long id, @RequestParam String counselor) {
        offlineCounselService.deleteSchedule(id, counselor);
        return ResponseEntity.ok("일정이 삭제되었습니다.");
    }
    
    @PatchMapping("/schedule/{id}/reserve")
    public ResponseEntity<String> reserveSchedule(@PathVariable Long id, @RequestBody String client) {
        offlineCounselService.reserveSchedule(id, client);
        return ResponseEntity.ok("일정이 예약되었습니다.");
    }
    
    /***************************** 통계 ***********************************/
    
    // 월별 상담 통계 조회
    @GetMapping("/stats/monthly")
    public List<MonthlyStatsDto> getMonthlyStats() {
        return statisticsService.getMonthlyStats();
    }
    
    // 월별 상담 통계 조회
    @GetMapping("/stats/monthlyCounselor")
    public List<MonthlyCounselorStatsDto> getMonthlyCounselorStats() {
        return statisticsService.getMonthlyCounselorStats();
    }
    
    // 즉시 갱신
    @PostMapping("/stats/refresh")
    public void forceRefreshStats() {
    	statisticsService.updateMonthlyStatsCache();
    	statisticsService.updateMonthlyCounselorStatsCache();
    }
}

