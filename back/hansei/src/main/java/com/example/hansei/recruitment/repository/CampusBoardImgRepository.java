package com.example.hansei.recruitment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.entity.CampusBoardImg; // CampusBoardImg 엔티티를 import

public interface CampusBoardImgRepository extends JpaRepository<CampusBoardImg, Long> {

    // 📌 1. 특정 캠퍼스 게시글에 속한 모든 이미지 조회 (ID 오름차순 정렬)
    List<CampusBoardImg> findByCampusBoard_IdOrderByIdAsc(Long campusBoardId);

    // 📌 2. 특정 캠퍼스 게시글 내 특정 이미지 조회 (Soft Delete 고려)
    Optional<CampusBoardImg> findByCampusBoard_IdAndId(Long campusBoardId, Long id);

    // 📌 3. 특정 캠퍼스 게시글의 모든 이미지 Soft Delete 적용 (Hard Delete 방지)
    @Modifying
    @Transactional
    @Query("UPDATE CampusBoardImg cbi SET cbi.isDeleted = true WHERE cbi.campusBoard.id = :campusBoardId")
    void softDeleteByCampusBoardId(Long campusBoardId);

    // 📌 4. 특정 캠퍼스 게시글의 모든 이미지 Hard Delete (필요 시)
    @Modifying
    @Transactional
    @Query("DELETE FROM CampusBoardImg cbi WHERE cbi.campusBoard.id = :campusBoardId")
    void hardDeleteByCampusBoardId(Long campusBoardId);
}
