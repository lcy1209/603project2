package com.example.hansei.recruitment.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.hansei.board.common.service.FileService;
import com.example.hansei.entity.SuggestBoard; // 변경된 부분
import com.example.hansei.entity.SuggestBoardImg; // 변경된 부분
import com.example.hansei.recruitment.repository.SuggestBoardImgRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SuggestBoardImgService { // 변경된 부분

    private final SuggestBoardImgRepository suggestBoardImgRepository; // 변경된 부분
    private final FileService fileService;
    private static final Logger logger = LoggerFactory.getLogger(SuggestBoardImgService.class); // 변경된 부분

    // 📌 이미지 저장
    public void saveSuggestBoardImg(SuggestBoard suggestBoard, MultipartFile boardImgFile) { // 변경된 부분
        if (boardImgFile == null || boardImgFile.isEmpty()) {
            logger.warn("이미지 파일이 없습니다. SuggestBoard ID: {}", suggestBoard.getId());
            return;
        }

        try {
            Map<String, String> map = fileService.fileHandler(boardImgFile, "suggest_board", suggestBoard.getId()); // 변경된 부분
            SuggestBoardImg suggestBoardImg = SuggestBoardImg.builder() // 변경된 부분
                    .suggestBoard(suggestBoard) // 변경된 부분
                    .oriImgName(map.get("oriImgName"))
                    .imgName(map.get("imgName"))
                    .imgUrl(map.get("imgUrl"))
                    .isDeleted(false) // ✅ Soft Delete 적용
                    .build();
            suggestBoardImgRepository.save(suggestBoardImg); // 변경된 부분
        } catch (Exception e) {
            logger.error("이미지 저장 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 저장 중 오류가 발생했습니다.");
        }
    }

    // 📌 이미지 업데이트
    public void updateSuggestBoardImg(String id, MultipartFile boardImgFile, SuggestBoard suggestBoard) { // 변경된 부분
        if (boardImgFile == null || boardImgFile.isEmpty()) {
            logger.warn("업데이트할 이미지 파일이 없습니다.");
            return;
        }

        try {
            Long imgId = Long.parseLong(id);
            SuggestBoardImg suggestBoardImg = suggestBoardImgRepository.findById(imgId) // 변경된 부분
                    .orElseThrow(() -> new EntityNotFoundException("이미지를 찾을 수 없습니다. ID: " + imgId));

            // 기존 이미지 삭제 (Soft Delete 적용)
            if (StringUtils.hasText(suggestBoardImg.getImgName())) {
                fileService.deleteFile(suggestBoardImg.getImgUrl());
                suggestBoardImg.setDeleted(true); // ✅ Soft Delete
                suggestBoardImgRepository.save(suggestBoardImg); // ✅ 기존 이미지 삭제
            }

            // 새 이미지 등록
            Map<String, String> map = fileService.fileHandler(boardImgFile, "suggest_board", suggestBoard.getId()); // 변경된 부분
            SuggestBoardImg newSuggestBoardImg = SuggestBoardImg.builder() // 변경된 부분
                    .suggestBoard(suggestBoard) // 변경된 부분
                    .oriImgName(map.get("oriImgName"))
                    .imgName(map.get("imgName"))
                    .imgUrl(map.get("imgUrl"))
                    .isDeleted(false) // ✅ 새 이미지 활성화
                    .build();

            suggestBoardImgRepository.save(newSuggestBoardImg); // 변경된 부분

        } catch (NumberFormatException e) {
            logger.error("잘못된 이미지 ID 형식: {}", id, e);
            throw new IllegalArgumentException("유효하지 않은 이미지 ID입니다: " + id);
        } catch (Exception e) {
            logger.error("이미지 업데이트 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 업데이트 중 오류가 발생했습니다.");
        }
    }

    // 📌 이미지 삭제 (Soft Delete 적용)
    public void softDeleteSuggestBoardImg(Long id) { // 변경된 부분
        SuggestBoardImg suggestBoardImg = suggestBoardImgRepository.findById(id) // 변경된 부분
                .orElseThrow(() -> new EntityNotFoundException("이미지를 찾을 수 없습니다. ID: " + id));

        try {
            if (StringUtils.hasText(suggestBoardImg.getImgName())) {
                fileService.deleteFile(suggestBoardImg.getImgUrl());
            }

            suggestBoardImg.setDeleted(true); // ✅ Soft Delete 적용
            suggestBoardImgRepository.save(suggestBoardImg); // 변경된 부분

        } catch (Exception e) {
            logger.error("이미지 파일 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 파일 삭제 중 오류가 발생했습니다.");
        }
    }

    // 📌 특정 게시글의 모든 이미지 Soft Delete 적용
    @Transactional
    public void softDeleteImagesByBoardId(Long boardId) { 
        try {
            suggestBoardImgRepository.softDeleteByBoardId(boardId); // 변경된 부분
            logger.info("게시글 ID {}에 대한 모든 이미지 Soft Delete 완료.", boardId);
        } catch (Exception e) {
            logger.error("게시글의 이미지 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("게시글의 이미지 삭제 중 오류가 발생했습니다.");
        }
    }
}
