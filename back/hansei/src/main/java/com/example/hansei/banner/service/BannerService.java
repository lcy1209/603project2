package com.example.hansei.banner.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.hansei.banner.model.Banner;
import com.example.hansei.banner.repository.BannerRepository;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;
    private final String uploadDir = "front/public/images/banners/";	// 경로 조정 필요

    @Autowired
    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    public Banner addBanner(MultipartFile file, String linkUrl) throws IOException {
        // 타임스탬프 제거하고 원본 파일명만 사용
        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        
        // 같은 이름의 파일이 이미 존재하는 경우 처리
        if (Files.exists(filePath)) {
            // 파일이 이미 존재하면 덮어쓰기
            Files.delete(filePath);
        }
        
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        Banner banner = new Banner();
        banner.setImageUrl("/images/banners/" + fileName);
        banner.setLinkUrl(linkUrl);
        return bannerRepository.save(banner);
    }

    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));
        
        try {
            String imagePath = banner.getImageUrl().substring("/images/banners/".length());
            Files.deleteIfExists(Paths.get(uploadDir + imagePath));
        } catch (IOException e) {
            throw new RuntimeException("Error deleting banner image", e);
        }

        bannerRepository.deleteById(id);
    }
}

