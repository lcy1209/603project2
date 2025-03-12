package com.example.hansei.recruitment.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.hansei.recruitment.dto.SuggestBoardDto;
import com.example.hansei.recruitment.dto.SuggestBoardFormDto;
import com.example.hansei.recruitment.service.SuggestBoardImgService;
import com.example.hansei.recruitment.service.SuggestBoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/suggest/board") // 변경된 부분
@RequiredArgsConstructor
public class SuggestBoardController { // 변경된 부분

    private final SuggestBoardService suggestBoardService; // 변경된 부분
    private final SuggestBoardImgService suggestBoardImgService; // 변경된 부분
    private static final Logger logger = LoggerFactory.getLogger(SuggestBoardController.class); // 변경된 부분

    // 📌 게시글 생성 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @PostMapping("/admin/new")
    public ResponseEntity<String> createBoard(
            @RequestPart("boardFormDto") SuggestBoardFormDto boardFormDto, // 변경된 부분
            @RequestPart(value = "boardImgFile", required = false) List<MultipartFile> boardImgFile) {
        try {
            Long boardId = suggestBoardService.createBoard(boardFormDto, boardImgFile); // 변경된 부분
            return ResponseEntity.ok("게시글 저장 완료 (ID: " + boardId + ")");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게시글 등록 중 오류가 발생하였습니다.");
        }
    }

    // 📌 게시글 수정 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @PutMapping("/admin/update")
    public ResponseEntity<String> updateBoard(
            @RequestPart("boardFormDto") SuggestBoardFormDto boardFormDto, // @RequestBody를 @RequestPart로 변경
            @RequestPart(required = false) List<MultipartFile> boardImgFile,
            @RequestPart(required = false) List<String> boardImgFileId,
            @RequestPart(required = false) List<String> delImg) {
        try {
            suggestBoardService.updateBoard(boardFormDto, boardImgFile, boardImgFileId, delImg);
            return ResponseEntity.ok("게시글 수정 완료");
        } catch (Exception e) {
            logger.error("게시글 수정 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게시글 수정 중 오류가 발생하였습니다.");
        }
    }


    // 📌 게시글 삭제 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/admin/delete")
    public ResponseEntity<String> deleteBoard(@RequestBody SuggestBoardFormDto boardFormDto) { // 변경된 부분
        try {
            if (boardFormDto.getIdList() != null && !boardFormDto.getIdList().isEmpty()) {
                boardFormDto.getIdList().forEach(suggestBoardService::deleteBoard); // 변경된 부분
            } else if (boardFormDto.getId() != null) {
                suggestBoardService.deleteBoard(boardFormDto.getId()); // 변경된 부분
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("삭제할 게시글 ID가 없습니다.");
            }
            return ResponseEntity.ok("게시글 삭제 완료");
        } catch (Exception e) {
            logger.error("게시글 삭제 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게시글 삭제 중 오류가 발생하였습니다.");
        }
    }

    // 📌 게시글 검색
    @GetMapping("/search")
    public ResponseEntity<Page<SuggestBoardDto>> searchBoards( // 변경된 부분
            @RequestParam(required = false, defaultValue = "title") String searchBy,
            @RequestParam(required = false, defaultValue = "") String searchQuery,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<SuggestBoardDto> suggestBoardDtoPage = suggestBoardService.listBoard( // 변경된 부분
                SuggestBoardDto.builder()
                        .searchBy(searchBy)
                        .searchQuery(searchQuery)
                        .page(page)
                        .size(size)
                        .build()
        );

        return ResponseEntity.ok(suggestBoardDtoPage);
    }

    // 📌 게시글 상세 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<SuggestBoardDto> getBoardDetail(@PathVariable Long boardId) { // 변경된 부분
        try {
            return ResponseEntity.ok(suggestBoardService.getDetail(boardId)); // 변경된 부분
        } catch (Exception e) {
            logger.error("게시글 상세 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 📌 조회수 증가
    @PutMapping("/{boardId}/count")
    public ResponseEntity<SuggestBoardDto> increaseBoardViewCount(@PathVariable Long boardId) { // 변경된 부분
        try {
            return ResponseEntity.ok(suggestBoardService.increaseViewCount(boardId)); // 변경된 부분
        } catch (Exception e) {
            logger.error("게시글 조회수 증가 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 📌 이미지 삭제 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/admin/imgDelete")
    public ResponseEntity<String> deleteImg(@RequestBody SuggestBoardFormDto boardFormDto) { // 변경된 부분
        try {
            if (boardFormDto.getIdList() != null && !boardFormDto.getIdList().isEmpty()) {
                boardFormDto.getIdList().forEach(suggestBoardImgService::softDeleteSuggestBoardImg); // 변경된 부분
            } else if (boardFormDto.getId() != null) {
                suggestBoardImgService.softDeleteSuggestBoardImg(boardFormDto.getId()); // 변경된 부분
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("삭제할 이미지 ID가 없습니다.");
            }
            return ResponseEntity.ok("이미지 삭제(Soft Delete) 완료");
        } catch (Exception e) {
            logger.error("이미지 삭제 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미지 삭제 중 오류가 발생하였습니다.");
        }
    }

    // 📌 게시글 작성 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @PostMapping("/write")
    public ResponseEntity<String> createBoard(@RequestBody SuggestBoardFormDto boardFormDto) { // 변경된 부분
        try {
            Long boardId = suggestBoardService.createBoard(boardFormDto, null); // 이미지 파일은 선택적으로 받을 수 있습니다.
            return ResponseEntity.ok("게시글 저장 완료 (ID: " + boardId + ")");
        } catch (Exception e) {
            logger.error("게시글 등록 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게시글 등록 중 오류가 발생하였습니다.");
        }
    }
}
