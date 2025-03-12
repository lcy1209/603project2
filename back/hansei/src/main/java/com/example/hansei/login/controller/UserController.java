package com.example.hansei.login.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.entity.HanUser;
import com.example.hansei.login.dto.PasswordUpdateRequest;
import com.example.hansei.login.dto.UserDto;
import com.example.hansei.login.service.UserService;
import com.example.hansei.security.user.CustomUser;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	/** 유저 정보 조회 */
	@GetMapping("/info")
	public ResponseEntity<?> userInfo(@AuthenticationPrincipal CustomUser customUser) {
		if (customUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
		}

		try {
			HanUser user = userService.findUserById(customUser.getUser().getUserId());
			UserDto userDto = UserDto.fromEntity(user);
			userDto.setPassword(null); // 비밀번호 필드 제거
			System.out.println("응답 데이터: " + userDto); // 디버깅용 로그
			return ResponseEntity.ok(userDto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
		}
	}

	/** 회원가입 */
	@PostMapping("")
	public ResponseEntity<?> join(@RequestBody UserDto userDto) {
		// 비밀번호 확인 검증
		if (!userDto.getPassword().equals(userDto.getPassword2())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호가 일치하지 않습니다.");
		}

		try {
			userService.join(userDto);
			return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다.");
		}
	}
	
	@PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto, HttpServletRequest request) {
        try {
            WebAuthenticationDetails details = new WebAuthenticationDetails(request);
            userService.login(userDto, details);
            return ResponseEntity.ok("로그인 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: " + e.getMessage());
        }
    }

	/** 회원탈퇴 */
	@Secured("ROLE_USER")
	@DeleteMapping
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal CustomUser customUser,
                                        @RequestBody Map<String, String> request) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
        }

        String inputPassword = request.get("password");
        if (inputPassword == null || inputPassword.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호를 입력해야 합니다.");
        }

        try {
            userService.deleteUserWithPasswordCheck(customUser.getUser().getUserId(), inputPassword);
            return ResponseEntity.ok("회원 탈퇴가 성공적으로 처리되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 처리 중 오류가 발생했습니다.");
        }
    }

	/** 중복 아이디 체크 */
	@PostMapping("/check/loginid")
	public ResponseEntity<?> checkId(@RequestBody UserDto userDto) {
		if (userService.isLoginIdTaken(userDto.getLoginid())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 아이디입니다.");
		}
		return ResponseEntity.ok("사용 가능한 아이디입니다.");
	}

	/** 중복 이메일 체크 */
	@PostMapping("/check/email")
	public ResponseEntity<?> checkEmail(@RequestBody UserDto userDto) {
		if (userService.isEmailTaken(userDto.getEmail())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 이메일입니다.");
		}
		return ResponseEntity.ok("사용 가능한 이메일입니다.");
	}

	/** 아이디 찾기 */
	@PostMapping("/findId")
	public ResponseEntity<?> findIdByEmail(@RequestBody UserDto userDto) {
		try {
			String loginId = userService.findLoginIdByEmailAndName(userDto.getEmail(), userDto.getName());
			return ResponseEntity.ok(loginId);
		} catch (EntityNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	/** 비밀번호 찾기 */
	@PostMapping("/findPw")
	public ResponseEntity<?> findPwSendEmail(@RequestBody UserDto userDto) {
		try {
			userService.resetPassword(userDto.getLoginid(), userDto.getEmail());
			return ResponseEntity.ok("임시 비밀번호가 이메일로 전송되었습니다.");
		} catch (EntityNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 찾기 중 오류가 발생했습니다.");
		}
	}

	/** 회원 정보 수정 */
	@PutMapping
    public ResponseEntity<?> updateUser(@AuthenticationPrincipal CustomUser customUser, @RequestBody UserDto userDto) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not Logged in.");
        }

        try {
            userService.updateUser(customUser.getUser().getUserId(), userDto);
            return ResponseEntity.ok("회원 정보가 성공적으로 업데이트되었습니다.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 업데이트 중 오류가 발생했습니다.");
        }
    }

	// 비밀번호 변경
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal CustomUser customUser,
                                            @RequestBody PasswordUpdateRequest request) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
        }

        try {
            userService.updatePassword(customUser.getUser().getUserId(),
                                       request.getCurrentPassword(),
                                       request.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경 중 오류 발생");
        }
    }
    
    /* 회원정보 수정시, 현재비밀번화와 새비밀번호 확인 */
    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@RequestBody Map<String, String> requestBody, 
                                            @AuthenticationPrincipal CustomUser customUser) {
        String inputPassword = requestBody.get("password");
        if (inputPassword == null || inputPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호를 입력해주세요.");
        }

        boolean isValid = userService.checkPassword(customUser.getUser().getUserId(), inputPassword);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 올바르지 않습니다.");
        }

        return ResponseEntity.ok("비밀번호가 확인되었습니다.");
    }

	/** 초기 데이터 생성 */
	@PostMapping("/initdata")
	public ResponseEntity<?> initdata() {
		userService.initData();
		return ResponseEntity.ok("데이터 초기화 성공.");
	}
}
