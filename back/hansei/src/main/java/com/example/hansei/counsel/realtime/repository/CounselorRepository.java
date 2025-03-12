package com.example.hansei.counsel.realtime.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hansei.counsel.realtime.entity.Counselor;

@Repository
public interface CounselorRepository extends JpaRepository<Counselor, Long> {
	
}

