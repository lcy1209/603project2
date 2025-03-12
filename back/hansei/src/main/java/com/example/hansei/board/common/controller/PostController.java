package com.example.hansei.board.common.controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.board.common.dto.PostDto;
import com.example.hansei.board.common.service.FileService;
import com.example.hansei.board.common.service.PostService;

@RestController
@RequestMapping("/api/board")
public class PostController {
	
	@Value("${file.upload.path}")
	private String uploadPath;
    
    @Autowired
    private PostService postService;
    
    @Autowired
    private FileService fileService;
    
    @GetMapping("/{type}")
    public ResponseEntity<Page<PostDto>> getPosts(
            @PathVariable String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sort,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword) {
    	
    	if (keyword != null && !keyword.trim().isEmpty()) {
            return ResponseEntity.ok(postService.searchPosts(type, searchType, keyword, page, size, sort));
        } else {
            return ResponseEntity.ok(postService.getPosts(type, page, size, sort));
        }
    }
    
    @GetMapping("/{type}/{id}")
    public ResponseEntity<PostDto> getPost(
            @PathVariable String type,
            @PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(type, id));
    }
    
    @PostMapping("/{type}")
    public ResponseEntity<PostDto> createPost(
            @PathVariable String type,
            @ModelAttribute PostDto postDto) {
        return ResponseEntity.ok(postService.createPost(type, postDto));
    }
    
    @PutMapping("/{type}/{id}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable String type,
            @PathVariable Long id,
            @ModelAttribute PostDto postDto) {
    	try {
            // filesToDelete 처리
    		if (postDto.getFilesToDelete() != null && !postDto.getFilesToDelete().isEmpty()) {
                for (Long fileId : postDto.getFilesToDelete()) {
                    fileService.deleteFile(fileId);
                }
            }
            
            // 기존 업데이트 로직 실행
            return ResponseEntity.ok(postService.updatePost(type, id, postDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }
    
    @DeleteMapping("/{type}/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String type,
            @PathVariable Long id) {
        postService.deletePost(type, id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            // 파일명 디코딩 (URL 인코딩된 파일명 처리)
            String decodedFileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);
            Path filePath = Paths.get(uploadPath).resolve(decodedFileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + URLEncoder.encode(resource.getFilename(), StandardCharsets.UTF_8) + "\"")
                .body(resource);
        } catch (IOException e) {
            throw new RuntimeException("File download error", e);
        }
    }
    
    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId) {
        try {
            fileService.deleteFile(fileId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("File deletion failed: " + e.getMessage());
        }
    }

}

