package com.example.notification.repository;

import com.example.notification.model.NotificationMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationMessage, Long> {
    
    @Query("SELECT n FROM NotificationMessage n WHERE (n.senderName IS NULL OR n.senderName != :username) AND (n.recipientUsername = :username OR n.recipientUsername IS NULL) ORDER BY n.timestamp DESC")
    List<NotificationMessage> findNotificationsForUser(@Param("username") String username);

}
