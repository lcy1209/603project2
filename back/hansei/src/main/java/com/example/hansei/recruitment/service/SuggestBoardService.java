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

import com.example.hansei.entity.HanUser;
import com.example.hansei.entity.SuggestBoard;
import com.example.hansei.login.repository.UserRepository;
import com.example.hansei.recruitment.dto.SuggestBoardDto;
import com.example.hansei.recruitment.dto.SuggestBoardFormDto;
import com.example.hansei.recruitment.repository.SuggestBoardRepository;
import com.example.hansei.security.user.CustomUser;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SuggestBoardService { 

    private final SuggestBoardRepository suggestBoardRepository; 
    private final UserRepository userRepository;
    private final SuggestBoardImgService suggestBoardImgService; 
    private static final Logger logger = LoggerFactory.getLogger(SuggestBoardService.class); 

    // 📌 게시글 생성 (이미지 포함)
    public Long createBoard(SuggestBoardFormDto boardFormDto, List<MultipartFile> boardImgFile) {
        // 현재 로그인한 사용자 정보 가져오기
        String loginId = ((CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        HanUser writer = userRepository.findByLoginid(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        // `SuggestBoard` 엔티티 생성 (작성자 정보 추가)
        SuggestBoard suggestBoard = SuggestBoard.builder() 
                .title(boardFormDto.getTitle())
                .content(boardFormDto.getContent())
                .hanUser(writer)
                .build();

        suggestBoardRepository.save(suggestBoard); 

        if (boardImgFile != null && !boardImgFile.isEmpty()) {
            for (MultipartFile file : boardImgFile) {
                try {
                    // 파일 저장 처리
                    suggestBoardImgService.saveSuggestBoardImg(suggestBoard, file); 
                } catch (Exception e) {
                    throw new RuntimeException("파일 저장 중 오류 발생", e);
                }
            }
        }
        return suggestBoard.getId(); 
    }

    // 📌 게시글 수정 (이미지 포함, 작성자 변경 가능)
    public Long updateBoard(SuggestBoardFormDto boardFormDto, List<MultipartFile> boardImgFile, List<String> boardImgFileId, List<String> delImg) {
        SuggestBoard suggestBoard = suggestBoardRepository.findById(boardFormDto.getId()) 
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        String loginId = ((CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        HanUser writer = userRepository.findByLoginid(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        suggestBoard.updateSuggestBoard(boardFormDto, writer); 

        // ✅ 이미지 삭제 시 null 체크 추가
        if (delImg != null && !delImg.isEmpty()) {
            delImg.forEach(imgId -> suggestBoardImgService.softDeleteSuggestBoardImg(Long.parseLong(imgId))); 
        }

        // ✅ 이미지 업데이트 시 null 체크 추가
        if (boardImgFile != null && boardImgFileId != null && boardImgFile.size() == boardImgFileId.size()) {
            for (int i = 0; i < boardImgFile.size(); i++) {
                suggestBoardImgService.updateSuggestBoardImg(boardImgFileId.get(i), boardImgFile.get(i), suggestBoard); 
            }
        }

        return suggestBoard.getId(); 
    }

    // 📌 게시글 삭제 (Soft Delete 적용)
    public void deleteBoard(Long id) {
        SuggestBoard suggestBoard = suggestBoardRepository.findById(id) 
                .orElseThrow(() -> new EntityNotFoundException("삭제할 게시글이 존재하지 않습니다."));

        try {
            // 게시글과 연결된 모든 이미지 Soft Delete
            suggestBoardImgService.softDeleteImagesByBoardId(id); 

            // 게시글 Soft Delete 적용
            suggestBoardRepository.softDeleteBoardById(id); 

            logger.info("게시글 ID {} 삭제(Soft Delete) 완료.", id);
        } catch (Exception e) {
            logger.error("게시글 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("게시글 삭제 중 오류가 발생하였습니다.");
        }
    }

    // 📌 상세정보 조회
    public SuggestBoardDto getDetail(Long boardId) { // 변경된 부분
        SuggestBoard suggestBoard = suggestBoardRepository.findById(boardId) 
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        
        return SuggestBoardDto.fromEntity(suggestBoard); // 변경된 부분
    }

    // 📌 조회수 증가 (낙관적 락 `@Version` 적용)
    @Transactional
    public SuggestBoardDto increaseViewCount(Long boardId) { // 변경된 부분
        SuggestBoard suggestBoard = suggestBoardRepository.findById(boardId) 
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        suggestBoard.increaseCount(); 
        return SuggestBoardDto.fromEntity(suggestBoard); // 변경된 부분
    }

    // 📌 게시글 검색 및 페이징 (최적화 적용)
    public Page<SuggestBoardDto> listBoard(SuggestBoardDto boardDto) { // 변경된 부분
        Pageable pageable = PageRequest.of(boardDto.getPage(), boardDto.getSize(), Sort.by(Sort.Order.desc("regTime")));
        Page<SuggestBoard> suggestBoardPage = suggestBoardRepository.searchDynamic(boardDto.getSearchBy(), boardDto.getSearchQuery(), pageable); 

        // ✅ `Page.map()`을 사용하여 변환 최적화
        return suggestBoardPage.map(SuggestBoardDto::fromEntity); // 변경된 부분
    }
}
