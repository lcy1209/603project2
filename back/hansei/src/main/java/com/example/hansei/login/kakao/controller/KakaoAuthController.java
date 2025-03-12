package com.example.hansei.login.kakao.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.login.kakao.service.KakaoService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/oauth/kakao")
@RequiredArgsConstructor
public class KakaoAuthController {
	
	@Autowired
	private final KakaoService kakaoService;
	
	@GetMapping("/callback")
	public ResponseEntity<Map<String, String>> kakaoLogin(@RequestParam("code") String code) throws JSONException {
	    return kakaoService.kakaoLogin(code); // ✅ Service에서 반환하는 ResponseEntity를 그대로 반환!
	}


//	@PostMapping
//	public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> payload) {
//	    String kakaoToken = payload.get("token");
//	    System.out.println("🚀 백엔드에서 받은 카카오 토큰: " + kakaoToken);
//
//	    if (kakaoToken == null || kakaoToken.isEmpty()) {
//	        System.out.println("❌ 카카오 토큰이 전달되지 않았습니다.");
//	        return ResponseEntity.status(400).body(Map.of("error", "카카오 토큰이 없습니다."));
//	    }
//
//	    // 카카오에서 사용자 정보 가져오기
//	    KakaoUserDto kakaoUser = kakaoService.getUserInfo(kakaoToken);
//	    System.out.println("🔍 Kakao User Info: " + kakaoUser);
//
//	    // 기존 회원 찾기
//	    HanUser user = userRepository.findByEmail(kakaoUser.getEmail())
//	            .orElseGet(() -> registerNewKakaoUser(kakaoUser));
//
//	    // JWT 생성
//	    String jwtToken = jwtTokenProvider.createToken(user.getUserId(), user.getLoginid(), List.of(user.getRole().name()));
//	    System.out.println("✅ JWT Token 생성 완료: " + jwtToken);
//
//	    return ResponseEntity.ok(Map.of("token", jwtToken));
//	}
//
//
//
//	// ✅ 신규 카카오 유저 회원가입
//	private HanUser registerNewKakaoUser(KakaoUserDto kakaoUser) {
//        HanUser newUser = HanUser.createKakaoUser(kakaoUser.getEmail(), kakaoUser.getName());
//        return userRepository.save(newUser);
//    }

}
