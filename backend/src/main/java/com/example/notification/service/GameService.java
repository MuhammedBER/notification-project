package com.example.notification.service;

import com.example.notification.model.GameSession;
import com.example.notification.model.NotificationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final Map<String, GameSession> activeGames = new ConcurrentHashMap<>();

    @Autowired
    public GameService(SimpMessagingTemplate messagingTemplate, NotificationService notificationService) {
        this.messagingTemplate = messagingTemplate;
        this.notificationService = notificationService;
    }

    public GameSession createGame(String player1, String player2) {
        String gameId = UUID.randomUUID().toString().substring(0, 8);
        GameSession game = new GameSession(gameId, player1);
        activeGames.put(gameId, game);

        // Send challenge notification via REST/WebSocket
        NotificationMessage invite = new NotificationMessage(
            "Game Challenge!", 
            player1 + " challenged you to XO! Game ID: " + gameId, 
            "INFO", 
            player2
        );
        notificationService.sendNotification(invite);

        return game;
    }

    public GameSession joinGame(String gameId, String player2) {
        GameSession game = activeGames.get(gameId);
        if (game != null && game.getStatus().equals("WAITING")) {
            game.setPlayer2(player2);
            game.setStatus("IN_PROGRESS");
            broadcastGameState(game);
        }
        return game;
    }

    public GameSession processMove(String gameId, String playerUsername, int cellIndex) {
        GameSession game = activeGames.get(gameId);
        if (game != null) {
            boolean valid = game.makeMove(cellIndex, playerUsername);
            if (valid) {
                broadcastGameState(game);
                
                if (!game.getStatus().equals("IN_PROGRESS")) {
                    // Clean up game after a short delay or just let it linger in memory for a bit
                    // For simplicity, we just leave it in the map, but in prod you'd remove it later.
                }
            }
        }
        return game;
    }

    public GameSession resign(String gameId, String playerUsername) {
        GameSession game = activeGames.get(gameId);
        if (game != null && game.getStatus().equals("IN_PROGRESS")) {
            if (playerUsername.equals(game.getPlayer1())) {
                game.setStatus("O_WON");
            } else if (playerUsername.equals(game.getPlayer2())) {
                game.setStatus("X_WON");
            }
            broadcastGameState(game);
        }
        return game;
    }

    private void broadcastGameState(GameSession game) {
        messagingTemplate.convertAndSend("/topic/game." + game.getGameId(), game);
    }
}
