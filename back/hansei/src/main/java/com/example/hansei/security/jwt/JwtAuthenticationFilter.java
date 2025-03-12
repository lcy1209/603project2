package com.example.hansei.security.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.hansei.security.user.CustomUser;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        setFilterProcessesUrl("/login"); // 로그인 엔드포인트 설정
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        
        String loginid = request.getParameter("loginid");
        String password = request.getParameter("password");
        
        System.out.println("Login ID: " + loginid);
        System.out.println("Password: " + password);

        // 사용자 인증정보 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(loginid, password);

        // 사용자 인증 (로그인)
        authentication = authenticationManager.authenticate(authentication);

        // 인증 실패
        if( !authentication.isAuthenticated()) response.setStatus(401);

   
        return authentication;
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException {
        // CustomUser에서 사용자 정보 추출
        CustomUser customUser = (CustomUser) authResult.getPrincipal();
        Long userId = customUser.getUser().getUserId(); // 사용자 ID 추출
        String loginId = customUser.getUser().getLoginid(); // 사용자 로그인 ID 추출

        // 권한 정보를 List<String>으로 변환
        List<String> roles = authResult.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .toList();

        // JWT 생성
        String token = jwtTokenProvider.createToken(userId, loginId, roles);

        // Authorization 헤더에 추가
        response.addHeader("Authorization", "Bearer " + token);

        // 응답 바디에 토큰 추가 (선택 사항)
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(Map.of("token", token)));
    }




    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(Map.of("error", "Authentication failed")));
    }
}
