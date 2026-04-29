package com.example.notification.controller;

import com.example.notification.model.NotificationMessage;
import com.example.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*") // Allow all origins for dev. restrict in prod!
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Endpoint to get past notifications for the logged in user
    @GetMapping("/history")
    public ResponseEntity<List<NotificationMessage>> getHistory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(notificationService.getNotificationHistory(username));
    }

    // REST endpoint to trigger a notification (useful for testing or external webhooks)
    @PostMapping("/send")
    public ResponseEntity<NotificationMessage> sendNotification(@RequestBody NotificationMessage notification) {
        NotificationMessage savedMessage = notificationService.sendNotification(notification);
        return ResponseEntity.ok(savedMessage);
    }
}
