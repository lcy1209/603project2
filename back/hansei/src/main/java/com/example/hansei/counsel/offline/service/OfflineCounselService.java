package com.example.hansei.counsel.offline.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.counsel.offline.dto.OfflineCounselDto;
import com.example.hansei.counsel.offline.entity.OfflineCounsel;
import com.example.hansei.counsel.offline.repository.OfflineCounselRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OfflineCounselService {

    private final OfflineCounselRepository offlineCounselRepository;
    private final ModelMapper modelMapper;

    // 일정 등록
    @Transactional
    public void createSchedule(OfflineCounselDto dto) {
        OfflineCounsel counsel = modelMapper.map(dto, OfflineCounsel.class);
        counsel.setReserve_status(false); // 기본값 설정
        offlineCounselRepository.save(counsel);
    }
    
    // 일정 조회
    public List<OfflineCounselDto> getSchedules() {
        List<OfflineCounsel> schedules = offlineCounselRepository.findAll(); // 모든 일정 조회
        return schedules.stream()
                .map(schedule -> modelMapper.map(schedule, OfflineCounselDto.class)) // DTO 변환
                .collect(Collectors.toList());
    }

    // 본인의 일정 조회
    @Transactional(readOnly = true)
    public List<OfflineCounselDto> getSchedulesByCounselor(String counselor) {
        return offlineCounselRepository.findByCounselor(counselor).stream()
                .map(schedule -> modelMapper.map(schedule, OfflineCounselDto.class))
                .collect(Collectors.toList());
    }

    // 일정 삭제
    @Transactional
    public void deleteSchedule(Long id, String counselor) {
        OfflineCounsel counsel = offlineCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다."));

        // 본인의 일정인지 확인
        if (!counsel.getCounselor().equals(counselor)) {
            throw new IllegalArgumentException("본인이 등록한 일정만 삭제 가능합니다.");
        }

        offlineCounselRepository.delete(counsel);
    }
    
    // 일정 예약
    @Transactional
    public void reserveSchedule(Long id, String client) {
        OfflineCounsel counsel = offlineCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 일정을 찾을 수 없습니다."));
        
        if (counsel.isReserve_status()) {
            throw new IllegalStateException("이미 예약된 일정입니다.");
        }

        counsel.setClient(client); // 예약자 이름 설정
        counsel.setReserve_status(true); // 상태를 예약됨으로 변경
        offlineCounselRepository.save(counsel);
    }
}

