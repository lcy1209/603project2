package com.example.hansei.recruitment.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.entity.SuggestBoard; // 변경된 부분

public interface SuggestBoardRepository extends JpaRepository<SuggestBoard, Long> { // 변경된 부분

    // ✅ Soft Delete가 적용된 게시글만 조회
    Page<SuggestBoard> findAllByIsDeletedFalseOrderByRegTimeDesc(Pageable pageable); // 변경된 부분

    @Query("SELECT b FROM SuggestBoard b WHERE b.isDeleted = false AND b.title LIKE CONCAT('%', :title, '%')") // 변경된 부분
    Page<SuggestBoard> searchByTitle(@Param("title") String title, Pageable pageable); // 변경된 부분

    @Query("SELECT b FROM SuggestBoard b WHERE b.isDeleted = false AND b.hanUser.loginid LIKE CONCAT('%', :userId, '%')") // 변경된 부분
    Page<SuggestBoard> searchByUserId(@Param("userId") String userId, Pageable pageable); // 변경된 부분

    @Query("SELECT b FROM SuggestBoard b " + // 변경된 부분
           "WHERE b.isDeleted = false AND " +
           "((:searchBy = 'title' AND b.title LIKE CONCAT('%', :searchQuery, '%')) " +
           " OR (:searchBy = 'userId' AND b.hanUser.loginid LIKE CONCAT('%', :searchQuery, '%')))")
    Page<SuggestBoard> searchDynamic( // 변경된 부분
        @Param("searchBy") String searchBy, 
        @Param("searchQuery") String searchQuery, 
        Pageable pageable
    );

    // ✅ Soft Delete 적용 (게시글 삭제 시 `isDeleted = true`로 변경)
    @Modifying
    @Transactional
    @Query("UPDATE SuggestBoard b SET b.isDeleted = true WHERE b.id = :id") // 변경된 부분
    void softDeleteBoardById(@Param("id") Long id); // 변경된 부분
}
