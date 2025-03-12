package com.example.hansei.security.jwt;

import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.hansei.constant.Role;
import com.example.hansei.entity.HanUser;
import com.example.hansei.login.repository.UserRepository;
import com.example.hansei.security.user.CustomUser;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final UserRepository userRepository;

    private final String secretKey = "|+<T%0h;[G97|I$5Lr?h]}`8rUX.7;0gw@bFr<R/|-U0n:_6j={'.T'GHs~<AxU9";
    private static final long EXPIRATION_TIME = 864000000L; // 10일 (밀리초)

    /**
     * JWT 토큰 생성
     */
    public String createToken(Long userId, String loginId, List<String> roles) {
        Claims claims = Jwts.claims();
        claims.setSubject(loginId); // 사용자 식별자
        claims.put("userId", userId); // 사용자 ID 추가
        claims.put("roles", roles.stream().map(String::valueOf).toList()); // 역할을 명시적으로 문자열로 변환

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date()) // 생성 시간
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 만료 시간
                .signWith(getShaKey(), SignatureAlgorithm.HS512) // 서명 키와 알고리즘 설정
                .compact();
    }



    /**
     * JWT로부터 인증 정보 가져오기
     */
    public Authentication getAuthentication(String authHeader) {
        if (authHeader == null || !authHeader.startsWith(JwtConstants.TOKEN_PREFIX)) {
            return null;
        }

        String token = authHeader.replace(JwtConstants.TOKEN_PREFIX, "");
        try {
            Claims claims = parseToken(token);

            Long userId = claims.get("userId", Long.class);
            String loginId = claims.getSubject();
            List<String> roles = claims.get("roles", List.class);

            // 문자열 역할 목록을 Enum으로 변환
            List<Role> roleEnums = roles.stream().map(Role::valueOf).toList();

            HanUser user = fetchUserDetails(userId, loginId, roleEnums);
            UserDetails userDetails = new CustomUser(user);

            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
        } catch (JwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        }
        return null;
    }


    /**
     * JWT 토큰 유효성 검사
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = parseToken(token);
            return !claims.getExpiration().before(new Date()); // 만료되지 않은 경우 true 반환
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
            throw new JwtException("Token expired", e); // 명확한 예외 전달
        } catch (JwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            throw e;
        }
    }



    /**
     * JWT 파싱
     */
    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getShaKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 사용자 추가 정보 조회
     */
    private HanUser fetchUserDetails(Long userId, String loginId, List<Role> roles) {
        return userRepository.findById(userId).map(userInfo -> {
            userInfo.setRole(roles.get(0)); // 첫 번째 역할 설정
            return userInfo;
        }).orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
    }



    /**
     * SecretKey 생성
     */
    private SecretKey getShaKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
}
