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

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
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
        } else {
            // Global broadcast
            messagingTemplate.convertAndSend("/topic/public", savedNotification);
        }
        
        return savedNotification;
    }

    public List<NotificationMessage> getNotificationHistory(String username) {
        return notificationRepository.findByRecipientUsernameOrRecipientUsernameIsNullOrderByTimestampDesc(username);
    }
}
