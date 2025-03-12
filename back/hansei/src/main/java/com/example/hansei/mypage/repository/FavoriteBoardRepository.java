package com.example.hansei.mypage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.hansei.entity.SuggestBoard;
import com.example.hansei.mypage.entity.FavoriteBoard;

@Repository
public interface FavoriteBoardRepository extends JpaRepository<FavoriteBoard, Long> {
	
	Optional<FavoriteBoard> findByUser_UserIdAndSuggestBoard_Id(Long userId, Long suggestBoardId);
    
    List<FavoriteBoard> findByUser_UserIdAndIsDeletedFalse(Long userId);
    
    @Query("SELECT f.suggestBoard FROM FavoriteBoard f JOIN f.user u WHERE u.userId = :userId")
    List<SuggestBoard> findFavoritesByUserId(@Param("userId") Long userId);

}
