package com.example.hansei.login.dto;

import com.example.hansei.constant.Role;
import com.example.hansei.entity.HanUser;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDto {

    @NotBlank(message = "이름은 필수 항목입니다.")
    private String name;

    @NotBlank(message = "이메일은 필수 항목입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "로그인 ID는 필수 항목입니다.")
    private String loginid;

    private Long userId;

    @NotBlank(message = "비밀번호는 필수 항목입니다.")
    private String password;
    
    @NotBlank(message = "비밀번호 확인은 필수 항목입니다.")
    private String password2;

    private String phone;
    private String gender;
    private String depart;
    private Role role = Role.ROLE_USER;
    private boolean sms;

    public static UserDto fromEntity(HanUser user) {
        UserDto userDto = new UserDto();
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setLoginid(user.getLoginid());
        userDto.setUserId(user.getUserId());
        userDto.setPhone(user.getPhone());
        userDto.setGender(user.getGender().toString());
        userDto.setRole(user.getRole());
        userDto.setSms(user.isSms());
        userDto.setDepart(user.getDepart());
        return userDto;
    }
}
