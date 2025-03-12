package com.example.hansei;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.hansei.entity.HanUser;
import com.example.hansei.login.dto.UserDto;

@SpringBootTest
public class SecurityTest {

	@Test
	void testBindUserDto() {
	    UserDto userDto = new UserDto();
	    userDto.setLoginid("testuser");
	    userDto.setPassword("password123");
	    userDto.setName("Test User");
	    userDto.setEmail("test@example.com");
	    userDto.setPhone("010-1234-5678");
	    userDto.setSms(true);
	    userDto.setGender("male");

	    HanUser user = new HanUser();
	    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	    user.bind(userDto, passwordEncoder);

	    assertNotNull(user.getPassword());
	    assertTrue(passwordEncoder.matches("password123", user.getPassword()));
	}

}
