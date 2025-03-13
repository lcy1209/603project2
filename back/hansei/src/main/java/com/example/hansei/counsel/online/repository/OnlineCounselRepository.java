package com.example.hansei.counsel.online.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.hansei.counsel.online.entity.OnlineCounsel;

public interface OnlineCounselRepository extends JpaRepository<OnlineCounsel, Long>{
	
	Page<OnlineCounsel> findAll(Pageable pageable);
	
	// 제목으로 검색
	@Query("SELECT o FROM OnlineCounsel o WHERE o.title LIKE %:keyword%")
    Page<OnlineCounsel> findByTitleContaining(
    	@Param("keyword") String keyword, 
        Pageable pageable
    );

    // 작성자로 검색
	@Query("SELECT o FROM OnlineCounsel o WHERE o.author LIKE %:keyword%")
    Page<OnlineCounsel> findByAuthorContaining(
    	@Param("keyword") String keyword, 
        Pageable pageable
    );
	
	List<OnlineCounsel> findByAuthorId(String authorId);

}
