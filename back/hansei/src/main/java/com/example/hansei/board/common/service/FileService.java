package com.example.hansei.board.common.service;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.hansei.board.common.entity.Post;
import com.example.hansei.board.common.entity.PostFile;
import com.example.hansei.board.common.repository.FileRepository;
import com.example.hansei.board.common.repository.PostRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class FileService {
    
    @Value("${file.upload.path}")
    private String uploadPath;
    
    @Autowired
    private FileRepository fileRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    
    
    // 파일 업로드
    public List<PostFile> saveFiles(List<MultipartFile> files) {
    	
    	File chkDir = new File(uploadPath);
    	
    	// 폴더가 없으면 생성
    	if(!chkDir.exists()) {
    		try {
    			chkDir.mkdirs();
    		} catch (Exception e) {
    			System.out.println("폴더 생성 에러");
    		}
    	}
    	
        List<PostFile> savedFiles = new ArrayList<>();
        
        for (MultipartFile multipartFile : files) {
            if (!multipartFile.isEmpty()) {
                try {
                	// 원본 파일명 (디코딩)
                    String originalFilename = URLDecoder.decode(multipartFile.getOriginalFilename(), StandardCharsets.UTF_8.toString());
                    
                    // UUID 생성
                    String uuid = UUID.randomUUID().toString();
                    
                    // 파일 확장자 추출
                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    
                    // 저장할 파일명 생성 (UUID + 확장자) - 중복된 이름을 가진 파일도 저장가능
                    String storedFileName = uuid + extension;
                    
                    // 파일 저장 경로 생성
                    String filePath = uploadPath + storedFileName;
                    
                    // 파일 저장
                    multipartFile.transferTo(new File(filePath));
                    
                    // 파일 정보 생성
                    PostFile file = new PostFile();
                    
                    file.setName(originalFilename);
                    file.setStoredName(storedFileName);
                    file.setUrl("/files/" + URLEncoder.encode(storedFileName, StandardCharsets.UTF_8.toString()));
                    file.setContentType(multipartFile.getContentType());
                    file.setSize(multipartFile.getSize());
                    
                    savedFiles.add(file);
                    
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save file", e);
                }
            }
        }
        
        return savedFiles;
    }
    
    
    public void deleteFile(Long fileId) {
        try {
            // 1. DB에서 파일 정보 조회
            PostFile postFile = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
                
            // 2. 실제 파일 삭제
            File fileToDelete = new File(uploadPath + postFile.getStoredName());
            if (fileToDelete.exists()) {
                if (!fileToDelete.delete()) {
                    throw new RuntimeException("Physical file deletion failed");
                }
            }

            // 3. Post 엔티티에서 파일 제거
            // post_attachments 테이블의 데이터도 자동으로 삭제됨
            Post post = postRepository.findByAttachmentsContaining(postFile)
                .orElse(null);
            if (post != null) {
                post.getAttachments().remove(postFile);
                postRepository.save(post);
            }
            
            // 4. PostFile 엔티티 삭제
            fileRepository.delete(postFile);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }
    }
    
    
    
    
    //
    
    
    public Map<String, String> fileHandler(MultipartFile file, String foldername, Long id) throws Exception {

		// 현재 작업경로의 절대경로
		// File.separator (/)
		String absolutePath = new File("").getAbsolutePath() + File.separator;

		// 파일 저장 위치
		String path = "src" + File.separator + "main" + File.separator + "resources" + File.separator + "static"
				+ File.separator + "images" + File.separator + foldername;
		if (id != null) {
			path += File.separator + id.toString();
		}

		File userImg = new File(path);

		if (!userImg.exists()) {
			// 폴더없으면 생성
			userImg.mkdirs();
		}

		if (!file.isEmpty()) {
			// 파일이 비어있지 않으면
			String contentType = file.getContentType();
			String originalFileExtension;

			// 타입에 따른 확장자 결정
			if (ObjectUtils.isEmpty(contentType)) {
				// 타입 없으면 null
				return null;
			} else {
				if (contentType.contains("image/jpeg")) {
					originalFileExtension = ".jpg";
				} else if (contentType.contains("image/png")) {
					originalFileExtension = ".png";
				} else {
					return null;
				}
			}

			// 파일저장 이름
			String originalFileName = file.getOriginalFilename();
			// 확장자를 제외한 파일 이름과 확장자 추출
			int lastIndex = originalFileName.lastIndexOf('.');
			String fileName = originalFileName.substring(0, lastIndex);

			String userImgName = fileName + System.nanoTime() + originalFileExtension;

			// 파일 저장
			userImg = new File(absolutePath + path + File.separator + userImgName);
			file.transferTo(userImg);

			// 파일 경로 전달 (db 저장에 사용)
			String imgUrl = path + File.separator + userImgName;

			Map<String, String> map = new HashMap<>();
			map.put("imgName", userImgName);
			map.put("imgUrl", imgUrl);
			map.put("oriImgName", originalFileName);

			return map;

		}
		return null;
	}

	// 해당 경로의 파일 바이트형으로 가져오기 (이미지경로)
	public byte[] getImgByte(String imgPath) throws IOException {

		Path imagePath = Paths.get(imgPath);

		if (Files.exists(imagePath)) {
			// 파일이 존재하는 경우에만 읽어옴
			return Files.readAllBytes(imagePath);
		} else {
			System.out.println("파일이 존재하지 않습니다.");
		}

		// 만약 프로필 이미지를 찾을 수 없는 경우 빈 바이트 배열 반환
		return new byte[0];
	}

	// 해당 경로의 파일 지우기
	public void deleteFile(String filePath) throws Exception {

		File deleteFile = new File(filePath);
		if (deleteFile.exists()) {
			deleteFile.delete();
			System.out.println("파일을 삭제하였습니다.");
			File parentDir = deleteFile.getParentFile();
			if (parentDir.isDirectory() && parentDir.list().length == 0) {
				if (parentDir.delete()) {
					System.out.println("비어있는 폴더를 삭제하였습니다.");
				} else {
					System.out.println("폴더를 삭제하지 못했습니다.");
				}
			}
		} else {
			System.out.println("파일이 존재하지 않습니다.");
		}
	}
	
	// 삭제 글 id에 해당하는 이미지 폴더 삭제
	public void deleteFolder(Long id, String folderName) throws Exception{
		String absolutePath = new File("").getAbsolutePath() + File.separator;
		 String Fpath = "src" + File.separator + "main" + File.separator + "resources" + File.separator + "static"
	                + File.separator + "images" + File.separator + folderName + File.separator + id;
		 
		File delFolder = new File(absolutePath + File.separator + Fpath);
		delFolder.delete();
	}
}

