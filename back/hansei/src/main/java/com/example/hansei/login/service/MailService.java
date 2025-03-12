package com.example.hansei.login.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailService {
	
    private final JavaMailSender javaMailSender; // 스프링에서 제공하는 JavaMailSender

    public void sendResetPassword(String recipientEmail, String temporaryPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("임시 비밀번호 발급 안내");
        message.setText("임시 비밀번호는 " + temporaryPassword + " 입니다.");

        javaMailSender.send(message);
    }
}
