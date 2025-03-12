package com.example.hansei.security.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.hansei.entity.HanUser;
import com.example.hansei.login.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginid) throws UsernameNotFoundException {
        log.info("🔍 Spring Security: 사용자 조회 시도 (loginid = {})", loginid);

        HanUser user = userRepository.findByLoginid(loginid)
                .orElseThrow(() -> new UsernameNotFoundException("❌ 사용자를 찾을 수 없습니다: " + loginid));

        log.info("✅ Spring Security: 사용자 조회 성공 (loginid = {}, 비밀번호 = {})", loginid, user.getPassword());

        return new CustomUser(user);
    }
}
