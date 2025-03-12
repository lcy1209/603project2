package com.example.hansei.recruitment.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.hansei.board.common.service.FileService;
import com.example.hansei.entity.CampusBoard; // CampusBoard import
import com.example.hansei.entity.CampusBoardImg; // CampusBoardImg import
import com.example.hansei.recruitment.repository.CampusBoardImgRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CampusBoardImgService {

    private final CampusBoardImgRepository campusBoardImgRepository;
    private final FileService fileService;
    private static final Logger logger = LoggerFactory.getLogger(CampusBoardImgService.class);

    // 📌 이미지 저장
    public void saveCampusBoardImg(CampusBoard campusBoard, MultipartFile campusBoardImgFile) {
        if (campusBoardImgFile == null || campusBoardImgFile.isEmpty()) {
            logger.warn("이미지 파일이 없습니다. Campus Board ID: {}", campusBoard.getId());
            return;
        }

        try {
            Map<String, String> map = fileService.fileHandler(campusBoardImgFile, "campus", campusBoard.getId());
            CampusBoardImg campusBoardImg = CampusBoardImg.builder()
                    .campusBoard(campusBoard)
                    .oriImgName(map.get("oriImgName"))
                    .imgName(map.get("imgName"))
                    .imgUrl(map.get("imgUrl"))
                    .isDeleted(false) // ✅ Soft Delete 적용
                    .build();
            campusBoardImgRepository.save(campusBoardImg);
        } catch (Exception e) {
            logger.error("이미지 저장 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 저장 중 오류가 발생했습니다.");
        }
    }

    // 📌 이미지 업데이트
    public void updateCampusBoardImg(String id, MultipartFile campusBoardImgFile, CampusBoard campusBoard) {
        if (campusBoardImgFile == null || campusBoardImgFile.isEmpty()) {
            logger.warn("업데이트할 이미지 파일이 없습니다.");
            return;
        }

        try {
            Long imgId = Long.parseLong(id);
            CampusBoardImg campusBoardImg = campusBoardImgRepository.findById(imgId)
                    .orElseThrow(() -> new EntityNotFoundException("이미지를 찾을 수 없습니다. ID: " + imgId));

            // 기존 이미지 삭제 (Soft Delete 적용)
            if (StringUtils.hasText(campusBoardImg.getImgName())) {
                fileService.deleteFile(campusBoardImg.getImgUrl());
                campusBoardImg.setDeleted(true); // ✅ Soft Delete
                campusBoardImgRepository.save(campusBoardImg); // ✅ 기존 이미지 삭제
            }

            // 새 이미지 등록
            Map<String, String> map = fileService.fileHandler(campusBoardImgFile, "campus", campusBoard.getId());
            CampusBoardImg newCampusBoardImg = CampusBoardImg.builder()
                    .campusBoard(campusBoard)
                    .oriImgName(map.get("oriImgName"))
                    .imgName(map.get("imgName"))
                    .imgUrl(map.get("imgUrl"))
                    .isDeleted(false) // ✅ 새 이미지 활성화
                    .build();

            campusBoardImgRepository.save(newCampusBoardImg);

        } catch (NumberFormatException e) {
            logger.error("잘못된 이미지 ID 형식: {}", id, e);
            throw new IllegalArgumentException("유효하지 않은 이미지 ID입니다: " + id);
        } catch (Exception e) {
            logger.error("이미지 업데이트 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 업데이트 중 오류가 발생했습니다.");
        }
    }

    // 📌 이미지 삭제 (Soft Delete 적용)
    public void softDeleteCampusBoardImg(Long id) {
        CampusBoardImg campusBoardImg = campusBoardImgRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("이미지를 찾을 수 없습니다. ID: " + id));

        try {
            if (StringUtils.hasText(campusBoardImg.getImgName())) {
                fileService.deleteFile(campusBoardImg.getImgUrl());
            }

            campusBoardImg.setDeleted(true); // ✅ Soft Delete 적용
            campusBoardImgRepository.save(campusBoardImg);

        } catch (Exception e) {
            logger.error("이미지 파일 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 파일 삭제 중 오류가 발생했습니다.");
        }
    }

    // 📌 특정 캠퍼스 게시글의 모든 이미지 Soft Delete 적용
    @Transactional
    public void softDeleteImagesByCampusBoardId(Long campusBoardId) {
        try {
            campusBoardImgRepository.softDeleteByCampusBoardId(campusBoardId); // ✅ Soft Delete 적용
            logger.info("캠퍼스 게시글 ID {}에 대한 모든 이미지 Soft Delete 완료.", campusBoardId);
        } catch (Exception e) {
            logger.error("캠퍼스 게시글의 이미지 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("캠퍼스 게시글의 이미지 삭제 중 오류가 발생했습니다.");
        }
    }
}
