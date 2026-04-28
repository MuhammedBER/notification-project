package com.example.notification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }

    public void sendVerificationEmail(String to, String token) {
        String subject = "Email Verification";
        String content = "Please verify your email by clicking the link: http://localhost:5173/verify?token=" + token;
        sendEmail(to, subject, content);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Password Reset";
        String content = "Please reset your password by clicking the link: http://localhost:5173/reset-password?token=" + token;
        sendEmail(to, subject, content);
    }

    public void sendNotificationEmail(String to, String title, String message) {
        String subject = "New Notification: " + title;
        String content = "You have received a new notification:\n\n" + message;
        sendEmail(to, subject, content);
    }
}
