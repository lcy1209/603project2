package com.example.hansei.recruitment.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.entity.CampusBoard; // CampusBoard 엔티티를 import

public interface CampusBoardRepository extends JpaRepository<CampusBoard, Long> {

    // ✅ Soft Delete가 적용된 캠퍼스 게시글만 조회
    Page<CampusBoard> findAllByIsDeletedFalseOrderByRegTimeDesc(Pageable pageable);

    @Query("SELECT b FROM CampusBoard b WHERE b.isDeleted = false AND b.title LIKE CONCAT('%', :title, '%')")
    Page<CampusBoard> searchByTitle(@Param("title") String title, Pageable pageable);

    @Query("SELECT b FROM CampusBoard b WHERE b.isDeleted = false AND b.hanUser.loginid LIKE CONCAT('%', :userId, '%')")
    Page<CampusBoard> searchByUserId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT b FROM CampusBoard b " +
           "WHERE b.isDeleted = false AND " +
           "((:searchBy = 'title' AND b.title LIKE CONCAT('%', :searchQuery, '%')) " +
           " OR (:searchBy = 'userId' AND b.hanUser.loginid LIKE CONCAT('%', :searchQuery, '%')))")
    Page<CampusBoard> searchDynamic(
        @Param("searchBy") String searchBy, 
        @Param("searchQuery") String searchQuery, 
        Pageable pageable
    );

    // ✅ Soft Delete 적용 (캠퍼스 게시글 삭제 시 `isDeleted = true`로 변경)
    @Modifying
    @Transactional
    @Query("UPDATE CampusBoard b SET b.isDeleted = true WHERE b.id = :id")
    void softDeleteCampusBoardById(@Param("id") Long id);
}
