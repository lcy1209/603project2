package com.example.hansei.entity;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.hansei.constant.Gender;
import com.example.hansei.constant.Role;
import com.example.hansei.login.dto.UserDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
@ToString
public class HanUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String loginid;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender = Gender.MALE;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;

    @Column(nullable = false)
    private boolean sms;

    @Column(nullable = false)
    private String depart;

    @Column(nullable = true)  // ✅ 카카오 로그인 유저 구분 (일반 로그인은 null)
    private String provider;

    @PrePersist
    public void prePersist() {
        if (this.role == null) {
            this.role = Role.ROLE_USER;
        }
        if (this.gender == null) {
            this.gender = Gender.MALE;
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (this.role == null) {
            this.role = Role.ROLE_USER;
        }
        if (this.gender == null) {
            this.gender = Gender.MALE;
        }
    }

    /**
     * ✅ 일반 회원가입 시 사용되는 메서드 (UserDto → HanUser 변환)
     */
    public HanUser bind(UserDto userDto, PasswordEncoder passwordEncoder) {
        if (userDto == null) {
            throw new IllegalArgumentException("UserDto cannot be null");
        }

        this.setLoginid(userDto.getLoginid());
        this.setPassword(passwordEncoder.encode(userDto.getPassword())); // 비밀번호 암호화 저장
        this.setName(userDto.getName());
        this.setEmail(userDto.getEmail());
        this.setPhone(userDto.getPhone());
        this.setSms(userDto.isSms());
        this.setDepart(userDto.getDepart());

        // ✅ 성별이 null이면 기본값으로 MALE 설정
        this.setGender("female".equalsIgnoreCase(userDto.getGender()) ? Gender.FEMALE : Gender.MALE);

        return this;
    }

    /**
     * ✅ 카카오 로그인 회원가입용 메서드
     */
    public static HanUser createKakaoUser(String email, String name) {
        return HanUser.builder()
                .loginid(email)
                .email(email)
                .password("") // ✅ 소셜 로그인은 비밀번호 필요 없음
                .name(name != null ? name : "카카오유저") // 기본값 설정
                .phone("010-0000-0000") // ✅ 기본 전화번호 설정
                .sms(false)
                .depart("소셜 로그인")
                .gender(Gender.MALE) // 기본값 설정
                .role(Role.ROLE_USER) // 기본 USER 역할
                .provider("kakao") // ✅ "kakao"로 저장
                .build();
    }
}
