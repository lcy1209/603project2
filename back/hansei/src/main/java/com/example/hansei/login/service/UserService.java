package com.example.hansei.login.service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hansei.constant.Gender;
import com.example.hansei.constant.Role;
import com.example.hansei.entity.HanUser;
import com.example.hansei.login.dto.UserDto;
import com.example.hansei.login.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private static final Logger logger = LoggerFactory.getLogger(UserService.class);
	
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final MailService mailService;

    private static final String LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL_CHARS = "!@~";
    private static final int MIN_LENGTH = 8;

    /** 회원가입 */
    public void join(UserDto userDto) {
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        System.out.println("회원가입 시 암호화된 비밀번호: " + encodedPassword);

        // HanUser 엔티티로 변환 및 저장
        HanUser user = new HanUser().bind(userDto, passwordEncoder);
        userRepository.save(user);

        // 회원가입 후 저장된 비밀번호가 암호화되었는지 직접 비교
        HanUser savedUser = userRepository.findByLoginid(userDto.getLoginid())
                .orElseThrow(() -> new RuntimeException("회원가입 후 사용자 조회 실패"));

        System.out.println("DB 저장된 비밀번호: " + savedUser.getPassword());
        System.out.println("입력된 비밀번호와 일치 여부: " + passwordEncoder.matches(userDto.getPassword(), savedUser.getPassword()));
    }



    /** 회원 조회 */
    @Transactional(readOnly = true)
    public HanUser findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
    }

    /** 로그인 */
    public void login(UserDto userDto, WebAuthenticationDetails details) {
        HanUser user = userRepository.findByLoginid(userDto.getLoginid())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        System.out.println("DB 비밀번호: " + user.getPassword());
        System.out.println("입력된 비밀번호: " + userDto.getPassword());
        System.out.println("비밀번호 검증 결과: " + passwordEncoder.matches(userDto.getPassword(), user.getPassword()));

        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.getLoginid(), userDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    
    @Transactional(readOnly = true)
    public boolean verifyPassword(Long userId, String password) {
        HanUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        return passwordEncoder.matches(password, user.getPassword());
    }

    /** 회원 삭제 */
    @Transactional
    public void deleteUser(Long userId) {
        HanUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        userRepository.delete(user);
    }

    /** 회원 정보 수정 */
    @Transactional
    public void updateUser(Long userId, UserDto userDto) {
        HanUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        user.setName(userDto.getName());
        user.setPhone(userDto.getPhone());
        user.setEmail(userDto.getEmail());
        user.setSms(userDto.isSms());

        userRepository.save(user);
    }

    /** 아이디 중복검사 */
    public boolean isLoginIdTaken(String loginid) {
        return userRepository.findByLoginid(loginid).isPresent();
    }

    /** 이메일 중복검사 */
    public boolean isEmailTaken(String email) {
        boolean exists = userRepository.findByEmail(email).isPresent();
        System.out.println("Email checked: " + email + " -> Exists: " + exists);
        return exists;
    }


    /** 아이디 찾기 */
    public String findLoginIdByEmailAndName(String email, String name) {
        HanUser user = userRepository.findByEmailAndName(email, name)
                .orElseThrow(() -> new EntityNotFoundException("일치하는 사용자가 없습니다."));
        return user.getLoginid();
    }

    /** 비밀번호 재설정 */
    @Transactional
    public void resetPassword(String loginid, String email) {
        HanUser user = userRepository.findByLoginidAndEmail(loginid, email)
                .orElseThrow(() -> new EntityNotFoundException("일치하는 사용자가 없습니다."));

        String temporaryPassword = createTempPassword();
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);

        mailService.sendResetPassword(email, temporaryPassword);
    }

    /** 임시 비밀번호 생성 */
    private String createTempPassword() {
        SecureRandom random = new SecureRandom();
        List<Character> passwordChars = new ArrayList<>();

        includeRandomChars(passwordChars, LOWERCASE_CHARS, 1, random);
        includeRandomChars(passwordChars, UPPERCASE_CHARS, 1, random);
        includeRandomChars(passwordChars, DIGITS, 1, random);
        includeRandomChars(passwordChars, SPECIAL_CHARS, 1, random);

        int remainingLength = MIN_LENGTH - passwordChars.size();
        includeRandomChars(passwordChars, LOWERCASE_CHARS + UPPERCASE_CHARS + DIGITS + SPECIAL_CHARS, remainingLength, random);

        Collections.shuffle(passwordChars);
        StringBuilder password = new StringBuilder();
        passwordChars.forEach(password::append);
        return password.toString();
    }

    private void includeRandomChars(List<Character> list, String characters, int count, SecureRandom random) {
        for (int i = 0; i < count; i++) {
            list.add(characters.charAt(random.nextInt(characters.length())));
        }
    }
    
    // 비밀번호 변경 로직 
    @Transactional
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        System.out.println("사용자 ID: " + userId);
        System.out.println("입력받은 현재 비밀번호: " + currentPassword);
        System.out.println("입력받은 새 비밀번호: " + newPassword);

        HanUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        System.out.println("DB에서 조회한 사용자 비밀번호: " + user.getPassword());

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            System.out.println("현재 비밀번호 검증 실패");
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        String encodedNewPassword = passwordEncoder.encode(newPassword);
        System.out.println("암호화된 새 비밀번호: " + encodedNewPassword);

        user.setPassword(encodedNewPassword);
        userRepository.save(user);
        System.out.println("비밀번호 변경 성공");
    }
    
    /* 비밀번호 확인 */
    public boolean checkPassword(Long userId, String inputPassword) {
        HanUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return passwordEncoder.matches(inputPassword, user.getPassword());
    }
    
    // 회원 탈퇴 
    @Transactional
    public void deleteUserWithPasswordCheck(Long userId, String inputPassword) {
        // 사용자 조회
        HanUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        System.out.println("DB 비밀번호: " + user.getPassword());
        System.out.println("입력된 비밀번호: " + inputPassword);

        // 비밀번호 검증
        if (!passwordEncoder.matches(inputPassword, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 사용자 삭제
        userRepository.delete(user);
        System.out.println("회원탈퇴 처리 완료");
    }

    /** 초기 데이터 생성 */
    public void initData() {
        HanUser user = new HanUser();
        user.setLoginid("admin");
        user.setPassword(passwordEncoder.encode("1234"));
        user.setName("관리자");
        user.setEmail("admin@example.com");
        user.setPhone("010-0000-0000");
        user.setGender(Gender.MALE);
        user.setRole(Role.ROLE_ADMIN);
        user.setSms(true);
        userRepository.save(user);
    }
}
