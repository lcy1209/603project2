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

import com.example.hansei.recruitment.dto.CampusBoardDto;
import com.example.hansei.recruitment.dto.CampusBoardFormDto;
import com.example.hansei.recruitment.service.CampusBoardImgService;
import com.example.hansei.recruitment.service.CampusBoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/campus/board")
@RequiredArgsConstructor
public class CampusBoardController {

    private final CampusBoardService campusBoardService;
    private final CampusBoardImgService campusBoardImgService;
    private static final Logger logger = LoggerFactory.getLogger(CampusBoardController.class);

    // 📌 캠퍼스 게시글 생성 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @PostMapping("/admin/new")
    public ResponseEntity<String> createCampusBoard(
            @RequestPart("campusBoardFormDto") CampusBoardFormDto campusBoardFormDto,
            @RequestPart(value = "campusBoardImgFile", required = false) List<MultipartFile> campusBoardImgFile) {
        try {
            Long campusBoardId = campusBoardService.createCampusBoard(campusBoardFormDto, campusBoardImgFile);
            return ResponseEntity.ok("캠퍼스 게시글 저장 완료 (ID: " + campusBoardId + ")");
        } catch (Exception e) {
            logger.error("캠퍼스 게시글 등록 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("캠퍼스 게시글 등록 중 오류가 발생하였습니다.");
        }
    }


    // 📌 캠퍼스 게시글 수정 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @PutMapping("/admin/update")
    public ResponseEntity<String> updateCampusBoard(
            @RequestPart("campusBoardFormDto") CampusBoardFormDto campusBoardFormDto,
            @RequestPart(required = false) List<MultipartFile> campusImgFile,
            @RequestPart(required = false) List<String> campusImgFileId,
            @RequestPart(required = false) List<String> delImg) {
        try {
            campusBoardService.updateCampusBoard(campusBoardFormDto, campusImgFile, campusImgFileId, delImg);
            return ResponseEntity.ok("캠퍼스 게시글 수정 완료");
        } catch (Exception e) {
            logger.error("캠퍼스 게시글 수정 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("캠퍼스 게시글 수정 중 오류가 발생하였습니다.");
        }
    }
    
    

    // 📌 캠퍼스 게시글 삭제 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/admin/delete")
    public ResponseEntity<String> deleteCampusBoard(@RequestBody CampusBoardFormDto campusBoardFormDto) {
        try {
            if (campusBoardFormDto.getIdList() != null && !campusBoardFormDto.getIdList().isEmpty()) {
                campusBoardFormDto.getIdList().forEach(campusBoardService::deleteCampusBoard);
            } else if (campusBoardFormDto.getId() != null) {
                campusBoardService.deleteCampusBoard(campusBoardFormDto.getId());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("삭제할 캠퍼스 게시글 ID가 없습니다.");
            }
            return ResponseEntity.ok("캠퍼스 게시글 삭제 완료");
        } catch (Exception e) {
            logger.error("캠퍼스 게시글 삭제 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("캠퍼스 게시글 삭제 중 오류가 발생하였습니다.");
        }
    }

    // 📌 캠퍼스 게시글 검색
    @GetMapping("/search")
    public ResponseEntity<Page<CampusBoardDto>> searchCampusBoards(
            @RequestParam(required = false, defaultValue = "title") String searchBy,
            @RequestParam(required = false, defaultValue = "") String searchQuery,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<CampusBoardDto> campusBoardDtoPage = campusBoardService.listCampusBoard(
                CampusBoardDto.builder()
                        .searchBy(searchBy)
                        .searchQuery(searchQuery)
                        .page(page)
                        .size(size)
                        .build()
        );

        return ResponseEntity.ok(campusBoardDtoPage);
    }

    // 📌 캠퍼스 게시글 상세 조회
    @GetMapping("/{campusBoardId}")
    public ResponseEntity<CampusBoardDto> getCampusBoardDetail(@PathVariable Long campusBoardId) {
        try {
            return ResponseEntity.ok(campusBoardService.getDetail(campusBoardId));
        } catch (Exception e) {
            logger.error("캠퍼스 게시글 상세 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
 // 📌 캠퍼스 게시글 조회수 증가
    @PutMapping("/{campusBoardId}/count")
    public ResponseEntity<CampusBoardDto> increaseCampusBoardViewCount(@PathVariable Long campusBoardId) {
        try {
            CampusBoardDto updatedBoard = campusBoardService.increaseViewCount(campusBoardId); // 기존 메서드 호출
            return ResponseEntity.ok(updatedBoard); // 업데이트된 게시글 반환
        } catch (Exception e) {
            logger.error("캠퍼스 게시글 조회수 증가 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 리소스를 찾을 수 없는 경우
        }
    }



    // 📌 캠퍼스 이미지 삭제 (관리자 전용)
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/admin/imgDelete")
    public ResponseEntity<String> deleteCampusImg(@RequestBody CampusBoardFormDto campusBoardFormDto) {
        try {
            if (campusBoardFormDto.getIdList() != null && !campusBoardFormDto.getIdList().isEmpty()) {
                campusBoardFormDto.getIdList().forEach(campusBoardImgService::softDeleteCampusBoardImg);
            } else if (campusBoardFormDto.getId() != null) {
                campusBoardImgService.softDeleteCampusBoardImg(campusBoardFormDto.getId());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("삭제할 이미지 ID가 없습니다.");
            }
            return ResponseEntity.ok("캠퍼스 이미지 삭제(Soft Delete) 완료");
        } catch (Exception e) {
            logger.error("캠퍼스 이미지 삭제 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("캠퍼스 이미지 삭제 중 오류가 발생하였습니다.");
        }
    }
    
    @Secured("ROLE_ADMIN")
    @PostMapping("/admin/write")
    public ResponseEntity<String> createBoard(@RequestBody CampusBoardFormDto campusBoardFormDto) {
        try {
            Long boardId = campusBoardService.createCampusBoard(campusBoardFormDto, null); // 이미지 파일은 선택적으로 받을 수 있습니다.
            return ResponseEntity.ok("게시글 저장 완료 (ID: " + boardId + ")");
        } catch (Exception e) {
            logger.error("게시글 등록 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게시글 등록 중 오류가 발생하였습니다.");
        }
    }
}
