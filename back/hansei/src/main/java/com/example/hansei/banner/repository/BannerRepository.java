package com.example.hansei.banner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hansei.banner.model.Banner;

public interface BannerRepository extends JpaRepository<Banner, Long> {
}