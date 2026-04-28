package com.example.notification.controller;

import com.example.notification.model.GameSession;
import com.example.notification.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
public class GameWebSocketController {

    @Autowired
    private GameService gameService;

    // We can also let the AdminPanel start a game via REST, but having it on WebSocket is fine, 
    // or we define a simple Request object.

    static class GameMoveRequest {
        public String gameId;
        public int cellIndex;
        public String playerUsername;
    }

    @MessageMapping("/game.move")
    public void makeMove(@Payload GameMoveRequest request) {
        gameService.processMove(request.gameId, request.playerUsername, request.cellIndex);
    }

    @MessageMapping("/game.join")
    public void joinGame(@Payload Map<String, String> payload) {
        String gameId = payload.get("gameId");
        String playerUsername = payload.get("playerUsername");
        gameService.joinGame(gameId, playerUsername);
    }
}
