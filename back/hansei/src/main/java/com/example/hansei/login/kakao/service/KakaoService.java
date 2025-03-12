package com.example.hansei.login.kakao.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.example.hansei.entity.HanUser;
import com.example.hansei.login.kakao.dto.KakaoUserDto;
import com.example.hansei.login.repository.UserRepository;
import com.example.hansei.security.jwt.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${kakao.client-id}")  // ✅ 올바르게 수정
    private String clientId;

    @Value("${kakao.redirect-uri}")  // ✅ 올바르게 수정
    private String redirectUri;

  
    public String getKakaoAccessToken(String code) throws JSONException {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&code=" + code;

        HttpEntity<String> request = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);
            System.out.println("카카오 응답: " + response.getBody()); // ✅ 응답 로그 추가
            JSONObject json = new JSONObject(response.getBody());
            return json.getString("access_token"); 
        } catch (Exception e) {
            System.err.println("카카오 토큰 요청 실패: " + e.getMessage()); // ✅ 오류 로그 추가
            throw new RuntimeException("카카오 토큰 요청 실패", e);
        }
    }

    /**
     * ✅ 카카오 사용자 정보 요청
     */
    public KakaoUserDto getKakaoUserInfo(String accessToken) throws JSONException {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, String.class);
            System.out.println("카카오 유저 정보 응답: " + response.getBody()); // ✅ 응답 로그 추가

            JSONObject json = new JSONObject(response.getBody());
            String id = json.get("id").toString();
            String email = json.getJSONObject("kakao_account").optString("email", id + "@kakao.com");
            String name = json.getJSONObject("properties").optString("nickname", "카카오유저");

            return new KakaoUserDto(id, email, name);
        } catch (Exception e) {
            System.err.println("카카오 유저 정보 요청 실패: " + e.getMessage()); // ✅ 오류 로그 추가
            throw new RuntimeException("카카오 유저 정보 요청 실패", e);
        }
    }

    /**
     * ✅ 카카오 로그인 & JWT 토큰 발급
     */
    @Transactional
    public ResponseEntity<Map<String, String>> kakaoLogin(String code) throws JSONException {
        String accessToken = getKakaoAccessToken(code);
        KakaoUserDto kakaoUserDto = getKakaoUserInfo(accessToken);

        Optional<HanUser> userOptional = userRepository.findByEmail(kakaoUserDto.getEmail());

        HanUser user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = HanUser.createKakaoUser(kakaoUserDto.getEmail(), kakaoUserDto.getName());
            userRepository.save(user);
        }

        // ✅ JWT 토큰 생성
        String jwtToken = jwtTokenProvider.createToken(
            user.getUserId(), 
            user.getLoginid(), 
            List.of(user.getRole().name())  
        );

        // ✅ JSON 형식으로 응답 반환
        Map<String, String> response = new HashMap<>();
        response.put("accessToken", jwtToken);

        return ResponseEntity.ok(response);
    }


}
