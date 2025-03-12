package com.example.hansei.login.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Data
public class LoginRequest {
	private String loginid;
    private String password;
}
