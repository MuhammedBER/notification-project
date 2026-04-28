package com.example.notification.service;

import com.example.notification.model.NotificationMessage;
import com.example.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final MailService mailService;
    private final com.example.notification.repository.UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, 
                               SimpMessagingTemplate messagingTemplate,
                               MailService mailService,
                               com.example.notification.repository.UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.mailService = mailService;
        this.userRepository = userRepository;
    }

    public NotificationMessage sendNotification(NotificationMessage notification) {
        // Ensure timestamp is set
        if (notification.getTimestamp() == null) {
            notification.setTimestamp(LocalDateTime.now());
        }
        
        // Save to database
        NotificationMessage savedNotification = notificationRepository.save(notification);
        
        // Broadcast conditionally
        if (savedNotification.getRecipientUsername() != null && !savedNotification.getRecipientUsername().isEmpty()) {
            // Private message
            messagingTemplate.convertAndSend("/topic/user." + savedNotification.getRecipientUsername(), savedNotification);
            
            // Send email to the recipient
            userRepository.findByUsername(savedNotification.getRecipientUsername()).ifPresent(user -> {
                mailService.sendNotificationEmail(user.getEmail(), savedNotification.getTitle(), savedNotification.getMessage());
            });
        } else {
            // Global broadcast
            messagingTemplate.convertAndSend("/topic/public", savedNotification);
            
            // Send email to all users (optional, but requested: "if somen send a notification to him to send email to hiom")
            // The request says "if somen send a notification to him to send email to hiom", 
            // which implies personal notifications. For global, it might be too much, but let's stick to personal for now.
            // If it's global, maybe we don't send email to everyone unless requested.
        }
        
        return savedNotification;
    }

    public List<NotificationMessage> getNotificationHistory(String username) {
        return notificationRepository.findByRecipientUsernameOrRecipientUsernameIsNullOrderByTimestampDesc(username);
    }
}
