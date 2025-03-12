package com.example.hansei.board.common.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hansei.board.common.entity.Post;
import com.example.hansei.board.common.entity.PostFile;

@Repository
public interface FileRepository extends JpaRepository<PostFile, Long> {
    List<PostFile> findByPost(Post post);
}

