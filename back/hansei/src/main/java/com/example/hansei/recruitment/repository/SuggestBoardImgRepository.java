package com.example.hansei.recruitment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.entity.SuggestBoardImg; // 변경된 부분

public interface SuggestBoardImgRepository extends JpaRepository<SuggestBoardImg, Long> { // 변경된 부분

    // 📌 1. 특정 게시글에 속한 모든 이미지 조회 (ID 오름차순 정렬)
    List<SuggestBoardImg> findBySuggestBoard_IdOrderByIdAsc(Long boardId); // 변경된 부분

    // 📌 2. 특정 게시글 내 특정 이미지 조회 (Soft Delete 고려)
    Optional<SuggestBoardImg> findBySuggestBoard_IdAndId(Long boardId, Long id); // 변경된 부분

    // 📌 3. 특정 게시글의 모든 이미지 Soft Delete 적용 (Hard Delete 방지)
    @Modifying
    @Transactional
    @Query("UPDATE SuggestBoardImg bi SET bi.isDeleted = true WHERE bi.suggestBoard.id = :boardId") // 변경된 부분
    void softDeleteByBoardId(Long boardId); // 변경된 부분

    // 📌 4. 특정 게시글의 모든 이미지 Hard Delete (필요 시)
    @Modifying
    @Transactional
    @Query("DELETE FROM SuggestBoardImg bi WHERE bi.suggestBoard.id = :boardId") // 변경된 부분
    void hardDeleteByBoardId(Long boardId); // 변경된 부분
}
