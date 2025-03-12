package com.example.hansei.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.example.hansei.constant.Gender;
import com.example.hansei.constant.Role;
import com.example.hansei.entity.HanUser;
import com.example.hansei.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByLoginid("admin").isEmpty()) { // 관리자가 없을 경우 추가
            HanUser admin = new HanUser();
            admin.setLoginid("admin"); // 기본 관리자 아이디
            admin.setPassword(passwordEncoder.encode("admin123")); // 기본 관리자 비밀번호
            admin.setRole(Role.ROLE_ADMIN); // ✅ Role Enum 사용 (ROLE_ADMIN)
            
            // 필수 정보 추가
            admin.setName("관리자");
            admin.setEmail("admin@example.com");
            admin.setPhone("010-1234-5678");
            admin.setGender(Gender.MALE); // 기본값 설정
            admin.setSms(true); // 문자 수신 동의
            admin.setDepart("관리부"); // 기본 학과 (필수 값)

            userRepository.save(admin);
            System.out.println("✅ 관리자 계정이 자동 생성되었습니다. (ID: admin / PW: admin123)");
        }
    }
}
