package com.example.notification.model;

import java.util.Arrays;

public class GameSession {
    private String gameId;
    private String player1; // X
    private String player2; // O
    private String[] board; // Length 9
    private String currentTurn; // "X" or "O"
    private String status; // "WAITING", "IN_PROGRESS", "X_WON", "O_WON", "DRAW"

    public GameSession() {}

    public GameSession(String gameId, String player1) {
        this.gameId = gameId;
        this.player1 = player1;
        this.board = new String[9];
        Arrays.fill(this.board, "");
        this.currentTurn = "X";
        this.status = "WAITING";
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getPlayer1() {
        return player1;
    }

    public void setPlayer1(String player1) {
        this.player1 = player1;
    }

    public String getPlayer2() {
        return player2;
    }

    public void setPlayer2(String player2) {
        this.player2 = player2;
    }

    public String[] getBoard() {
        return board;
    }

    public void setBoard(String[] board) {
        this.board = board;
    }

    public String getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(String currentTurn) {
        this.currentTurn = currentTurn;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean makeMove(int index, String playerUsername) {
        if (!status.equals("IN_PROGRESS")) return false;
        
        String piece = playerUsername.equals(player1) ? "X" : (playerUsername.equals(player2) ? "O" : null);
        if (piece == null || !piece.equals(currentTurn)) return false;

        if (index < 0 || index > 8 || !board[index].equals("")) return false;

        board[index] = piece;
        checkWinCondition();
        
        if (status.equals("IN_PROGRESS")) {
            currentTurn = currentTurn.equals("X") ? "O" : "X";
        }
        return true;
    }

    private void checkWinCondition() {
        int[][] winLines = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // rows
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // cols
            {0, 4, 8}, {2, 4, 6}             // diagonals
        };

        for (int[] line : winLines) {
            String a = board[line[0]];
            String b = board[line[1]];
            String c = board[line[2]];
            
            if (!a.equals("") && a.equals(b) && a.equals(c)) {
                status = a + "_WON";
                return;
            }
        }

        // Check draw
        boolean full = true;
        for (String cell : board) {
            if (cell.equals("")) {
                full = false;
                break;
            }
        }
        if (full) {
            status = "DRAW";
        }
    }
}
