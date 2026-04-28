package com.example.notification.repository;

import com.example.notification.model.NotificationMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationMessage, Long> {
    
    // Fetch notifications ordered by newest first: either global or targeted to this user
    List<NotificationMessage> findByRecipientUsernameOrRecipientUsernameIsNullOrderByTimestampDesc(String username);
}
