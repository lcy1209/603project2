package com.example.hansei.board.common.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.hansei.board.common.dto.FileDto;
import com.example.hansei.board.common.dto.PostDto;
import com.example.hansei.board.common.entity.Post;
import com.example.hansei.board.common.entity.PostFile;
import com.example.hansei.board.common.repository.PostRepository;

import jakarta.transaction.Transactional;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private FileService fileService;

    // 게시글 목록 조회
    public Page<PostDto> getPosts(String type, int page, int size, String sort) {
    	
    	Sort.Direction direction = sort.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
    	
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdDate"));
        
        Page<Post> posts = postRepository.findByType(type, pageable);
        return posts.map(this::convertToDto);
    }
    
    public Page<PostDto> searchPosts(String type, String searchType, String keyword, int page, int size, String sort) {
    	Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
    	Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdDate"));
    	
    	Page<Post> posts;
    	if ("author".equalsIgnoreCase(searchType)) {
    	    posts = postRepository.findByTypeAndAuthorContaining(type, keyword, pageable);
    	} else { // 기본값은 제목 검색 처리
    	    posts = postRepository.findByTypeAndTitleContaining(type, keyword, pageable);
    	}

    	return posts.map(this::convertToDto);
    }

    // 게시글 상세 조회
    public PostDto getPost(String type, Long id) {
        Post post = postRepository.findByTypeAndId(type, id)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return convertToDto(post);
    }

    // 게시글 생성
    @Transactional
    public PostDto createPost(String type, PostDto postDto) {
        Post post = new Post();
        post.setType(type);
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setAuthor(postDto.getAuthor());
        post.setCreatedDate(LocalDateTime.now());
        
        // 첨부파일 처리
        if (postDto.getAttachments() != null) {
            List<PostFile> files = fileService.saveFiles(postDto.getAttachments());
            post.setAttachments(files);
        }
        
        Post savedPost = postRepository.save(post);
        return convertToDto(savedPost);
    }

    // 게시글 수정
    @Transactional
    public PostDto updatePost(String type, Long id, PostDto postDto) {
        Post post = postRepository.findByTypeAndId(type, id)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        
     // filesToDelete 처리
        if (postDto.getFilesToDelete() != null && !postDto.getFilesToDelete().isEmpty()) {            
        	for (Long fileId : postDto.getFilesToDelete()) {
                // 기존 파일 삭제
                PostFile fileToDelete = post.getAttachments().stream()
                    .filter(file -> file.getId().equals(fileId))  // Long 타입으로 직접 비교 가능
                    .findFirst()
                    .orElse(null);
                if (fileToDelete != null) {
                    post.getAttachments().remove(fileToDelete);
                }
            }
        }
        
     // 새로운 첨부파일 처리
        if (postDto.getAttachments() != null && !postDto.getAttachments().isEmpty()) {
            List<PostFile> newFiles = fileService.saveFiles(postDto.getAttachments());
            // 기존 파일 리스트에 새 파일들을 추가
            post.getAttachments().addAll(newFiles);
        }
        
        Post updatedPost = postRepository.save(post);
        return convertToDto(updatedPost);
    }

    // 게시글 삭제
    @Transactional
    public void deletePost(String type, Long id) {
        Post post = postRepository.findByTypeAndId(type, id)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
     // 첨부파일이 있는 경우 각각의 파일에 대해 deleteFile 메소드 호출
        if (post.getAttachments() != null && !post.getAttachments().isEmpty()) {
            List<PostFile> files = new ArrayList<>(post.getAttachments());
            for (PostFile file : files) {
                fileService.deleteFile(file.getId());
            }
        }
        
        postRepository.delete(post);
    }

    // Post 엔티티를 DTO로 변환
    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthor(post.getAuthor());
        dto.setCreatedDate(post.getCreatedDate());
        
        if (post.getAttachments() != null) {
            dto.setFileList(post.getAttachments().stream()
                .map(this::convertToFileDto)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    // File 엔티티를 DTO로 변환
    private FileDto convertToFileDto(PostFile file) {
        FileDto dto = new FileDto();
        dto.setId(file.getId());
        dto.setName(file.getName());
        dto.setUrl(file.getUrl());
        return dto;
    }
}
