package com.example.notification.controller;

import com.example.notification.model.GameSession;
import com.example.notification.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameRestController {

    @Autowired
    private GameService gameService;

    public record ChallengeRequest(String targetUsername) {}

    @PostMapping("/challenge")
    public ResponseEntity<GameSession> challengePlayer(@RequestBody ChallengeRequest request) {
        String initiator = SecurityContextHolder.getContext().getAuthentication().getName();
        GameSession newGame = gameService.createGame(initiator, request.targetUsername());
        return ResponseEntity.ok(newGame);
    }
}
