package com.example.hansei.recruitment.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.hansei.entity.CampusBoard; // CampusBoard import
import com.example.hansei.entity.HanUser; // HanUser import
import com.example.hansei.login.repository.UserRepository; // UserRepository import
import com.example.hansei.recruitment.dto.CampusBoardDto;
import com.example.hansei.recruitment.dto.CampusBoardFormDto;
import com.example.hansei.recruitment.repository.CampusBoardRepository;
import com.example.hansei.security.user.CustomUser; // CustomUser import

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CampusBoardService {

    private final CampusBoardRepository campusBoardRepository;
    private final UserRepository userRepository;
    private final CampusBoardImgService campusBoardImgService; // 캠퍼스 게시판 이미지 서비스
    private static final Logger logger = LoggerFactory.getLogger(CampusBoardService.class);

    // 📌 캠퍼스 게시글 생성 (이미지 포함)
    public Long createCampusBoard(CampusBoardFormDto campusBoardFormDto, List<MultipartFile> campusBoardImgFile) {
        // 현재 로그인한 사용자 정보 가져오기
        String loginId = ((CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        HanUser writer = userRepository.findByLoginid(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        // `CampusBoard` 엔티티 생성 (작성자 정보 추가)
        CampusBoard campusBoard = CampusBoard.builder()
                .title(campusBoardFormDto.getTitle())
                .content(campusBoardFormDto.getContent())
                .hanUser(writer)
                .build();

        campusBoardRepository.save(campusBoard);

        if (campusBoardImgFile != null && !campusBoardImgFile.isEmpty()) {
            for (MultipartFile file : campusBoardImgFile) {
                try {
                    // 파일 저장 처리
                    campusBoardImgService.saveCampusBoardImg(campusBoard, file);
                } catch (Exception e) {
                    throw new RuntimeException("파일 저장 중 오류 발생", e);
                }
            }
        }
        return campusBoard.getId();
    }

    // 📌 캠퍼스 게시글 수정 (이미지 포함, 작성자 변경 가능)
    public Long updateCampusBoard(CampusBoardFormDto campusBoardFormDto, List<MultipartFile> campusBoardImgFile, List<String> campusBoardImgFileId, List<String> delImg) {
        CampusBoard campusBoard = campusBoardRepository.findById(campusBoardFormDto.getId())
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        String loginId = ((CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        HanUser writer = userRepository.findByLoginid(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        campusBoard.updateCampusBoard(campusBoardFormDto, writer);

        // ✅ 이미지 삭제 시 null 체크 추가
        if (delImg != null && !delImg.isEmpty()) {
            delImg.forEach(imgId -> campusBoardImgService.softDeleteCampusBoardImg(Long.parseLong(imgId)));
        }

        // ✅ 이미지 업데이트 시 null 체크 추가
        if (campusBoardImgFile != null && campusBoardImgFileId != null && campusBoardImgFile.size() == campusBoardImgFileId.size()) {
            for (int i = 0; i < campusBoardImgFile.size(); i++) {
                campusBoardImgService.updateCampusBoardImg(campusBoardImgFileId.get(i), campusBoardImgFile.get(i), campusBoard);
            }
        }

        return campusBoard.getId();
    }

    // 📌 캠퍼스 게시글 삭제 (Soft Delete 적용)
    public void deleteCampusBoard(Long id) {
        CampusBoard campusBoard = campusBoardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("삭제할 게시글이 존재하지 않습니다."));

        try {
            // 게시글과 연결된 모든 이미지 Soft Delete
            campusBoardImgService.softDeleteImagesByCampusBoardId(id);

            // 게시글 Soft Delete 적용
            campusBoardRepository.softDeleteCampusBoardById(id);

            logger.info("캠퍼스 게시글 ID {} 삭제(Soft Delete) 완료.", id);
        } catch (Exception e) {
            logger.error("캠퍼스 게시글 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("캠퍼스 게시글 삭제 중 오류가 발생하였습니다.");
        }
    }

    // 📌 상세정보 조회
    public CampusBoardDto getDetail(Long campusBoardId) {
        CampusBoard campusBoard = campusBoardRepository.findById(campusBoardId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        
        return CampusBoardDto.fromEntity(campusBoard); // 작성일 포함된 DTO 반환
    }

    // 📌 조회수 증가 (낙관적 락 `@Version` 적용)
    @Transactional
    public CampusBoardDto increaseViewCount(Long campusBoardId) {
        CampusBoard campusBoard = campusBoardRepository.findById(campusBoardId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        campusBoard.increaseCount(); // ✅ `@Version` 적용된 메서드
        return CampusBoardDto.fromEntity(campusBoard);
    }

    // 📌 캠퍼스 게시글 검색 및 페이징 (최적화 적용)
    public Page<CampusBoardDto> listCampusBoard(CampusBoardDto campusBoardDto) {
        Pageable pageable = PageRequest.of(campusBoardDto.getPage(), campusBoardDto.getSize(), Sort.by(Sort.Order.desc("regTime")));
        Page<CampusBoard> campusBoardPage = campusBoardRepository.searchDynamic(campusBoardDto.getSearchBy(), campusBoardDto.getSearchQuery(), pageable);

        // ✅ `Page.map()`을 사용하여 변환 최적화
        return campusBoardPage.map(CampusBoardDto::fromEntity);
    }
}
