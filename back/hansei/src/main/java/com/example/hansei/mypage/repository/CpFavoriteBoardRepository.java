package com.example.hansei.mypage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.hansei.entity.CampusBoard;
import com.example.hansei.mypage.entity.CpFavoriteBoard;

@Repository
public interface CpFavoriteBoardRepository extends JpaRepository<CpFavoriteBoard, Long> {
    
    // ✅ 특정 사용자가 특정 캠퍼스 게시글을 즐겨찾기했는지 확인
    Optional<CpFavoriteBoard> findByUser_UserIdAndCampusBoard_Id(Long userId, Long campusBoardId);

    // ✅ 특정 사용자의 즐겨찾기한 캠퍼스 게시글 목록 조회 (Soft Delete 적용되지 않은 것만)
    List<CpFavoriteBoard> findByUser_UserIdAndIsDeletedFalse(Long userId);

    // ✅ 사용자의 즐겨찾기한 캠퍼스 게시글 목록을 `CampusBoard` 엔티티로 조회
    @Query("SELECT f.campusBoard FROM CpFavoriteBoard f JOIN f.user u WHERE u.userId = :userId")
    List<CampusBoard> findFavoritesByUserId(@Param("userId") Long userId);
}
