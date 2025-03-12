package com.example.hansei.board.common.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.hansei.board.common.entity.Post;
import com.example.hansei.board.common.entity.PostFile;
import com.example.hansei.counsel.online.entity.OnlineCounsel;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByType(String type, Pageable pageable);

    Optional<Post> findByTypeAndId(String type, Long id);

    Optional<Post> findByAttachmentsContaining(PostFile postFile);

    // 제목으로 검색
    @Query("SELECT p FROM Post p WHERE p.type = :type AND p.title LIKE %:keyword%")
    Page<Post> findByTypeAndTitleContaining(
        @Param("type") String type,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    // 작성자로 검색
    @Query("SELECT p FROM Post p WHERE p.type = :type AND p.author LIKE %:keyword%")
    Page<Post> findByTypeAndAuthorContaining(
        @Param("type") String type,
        @Param("keyword") String keyword,
        Pageable pageable
    );
}


