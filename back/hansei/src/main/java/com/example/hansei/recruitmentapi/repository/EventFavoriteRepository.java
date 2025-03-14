package com.example.hansei.recruitmentapi.repository;

import com.example.hansei.recruitmentapi.entity.EventFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventFavoriteRepository extends JpaRepository<EventFavorite, Long> {
    Optional<EventFavorite> findByUser_UserIdAndEventNo(Long userId, String eventNo);
    List<EventFavorite> findByUser_UserIdAndIsDeletedFalse(Long userId);
}
