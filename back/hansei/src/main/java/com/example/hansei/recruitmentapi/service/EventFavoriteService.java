package com.example.hansei.recruitmentapi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.hansei.entity.HanUser;
import com.example.hansei.login.repository.UserRepository;
import com.example.hansei.recruitmentapi.dto.EventDto;
import com.example.hansei.recruitmentapi.entity.EventFavorite;
import com.example.hansei.recruitmentapi.repository.EventFavoriteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventFavoriteService {

    private final EventFavoriteRepository eventFavoriteRepository;
    private final UserRepository userRepository;
    private final EventService eventService; // ✅ 추가

    // 📌 즐겨찾기 추가
    public void addFavorite(Long userId, String eventNo) {
        if (eventFavoriteRepository.findByUser_UserIdAndEventNo(userId, eventNo).isEmpty()) {
            HanUser user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            EventFavorite favorite = EventFavorite.builder()
                    .user(user)
                    .eventNo(eventNo)
                    .isDeleted(false)
                    .build();

            eventFavoriteRepository.save(favorite);
        }
    }

    // 📌 즐겨찾기 취소 (Soft Delete)
    public void removeFavorite(Long userId, String eventNo) {
        eventFavoriteRepository.findByUser_UserIdAndEventNo(userId, eventNo)
                .ifPresent(favorite -> {
                    favorite.setDeleted(true);
                    eventFavoriteRepository.save(favorite);
                });
    }

    // 📌 사용자의 즐겨찾기 목록 조회
    public List<EventDto> getUserFavorites(Long userId) {
        // 1️⃣ 사용자의 즐겨찾기한 이벤트 ID 목록 가져오기
        List<String> favoriteEventNos = eventFavoriteRepository.findByUser_UserIdAndIsDeletedFalse(userId)
                .stream()
                .map(EventFavorite::getEventNo)
                .collect(Collectors.toList());

        // 2️⃣ API에서 전체 이벤트 목록 가져오기
        List<EventDto> allEvents = eventService.getAllEvents();

        // 3️⃣ 즐겨찾기한 이벤트만 필터링하여 반환
        return allEvents.stream()
                .filter(event -> favoriteEventNos.contains(event.getEventNo())) // 즐겨찾기 ID와 매칭되는 데이터만 필터링
                .collect(Collectors.toList());
    }


}
