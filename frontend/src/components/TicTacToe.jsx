import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from './NotificationProvider';
import './TicTacToe.css';

export const TicTacToe = ({ gameId, onExit }) => {
    const { user } = useAuth();
    const { stompClient } = useNotifications();
    const [gameState, setGameState] = useState(null);

    useEffect(() => {
        if (!stompClient || !gameId) return;

        // Subscribing to the game channel
        const subscription = stompClient.subscribe(`/topic/game.${gameId}`, (message) => {
            if (message.body) {
                setGameState(JSON.parse(message.body));
            }
        });

        // Request initial state (we optionally might need it but joining already broadcasts to waiting clients)
        // A robust implementation would fetch initial game state via REST. For now, we rely on broadcost matching.
        // Actually, if we just challenged, we rely on the Join mechanism from the other user.
        
        // We will notify WS controller that we joined to sync state
        stompClient.publish({
            destination: '/app/game.join',
            body: JSON.stringify({ gameId, playerUsername: user.username })
        });

        return () => subscription.unsubscribe();
    }, [stompClient, gameId, user.username]);

    const handleCellClick = (index) => {
        if (!gameState || gameState.status !== 'IN_PROGRESS') return;
        
        stompClient.publish({
            destination: '/app/game.move',
            body: JSON.stringify({ gameId, cellIndex: index, playerUsername: user.username })
        });
    };

    if (!gameState) {
        return <div className="game-card glass loading">Connecting to Game {gameId}...</div>;
    }

    const { board, currentTurn, status, player1, player2 } = gameState;
    const isMyTurn = status === 'IN_PROGRESS' && (
        (currentTurn === 'X' && user.username === player1) ||
        (currentTurn === 'O' && user.username === player2)
    );

    const getStatusMessage = () => {
        if (status === 'WAITING') return `Waiting for ${player2 || 'opponent'} to join...`;
        if (status === 'IN_PROGRESS') return isMyTurn ? "Your Turn!" : "Waiting on opponent...";
        if (status === 'DRAW') return "It's a Draw!";
        
        // Win condition
        const winner = status === 'X_WON' ? player1 : player2;
        return winner === user.username ? "You Won! 🎉" : "You Lost! 💀";
    };

    return (
        <div className="game-card glass">
            <div className="game-header">
                <h3>Multiplayer Tic-Tac-Toe</h3>
                <button className="btn-exit" onClick={onExit}>Close</button>
            </div>
            
            <div className="players-info">
                <div className={`player ${currentTurn === 'X' ? 'active' : ''}`}>
                    <span className="piece x">X</span> {player1 || 'Waiting...'}
                </div>
                <div className="vs">VS</div>
                <div className={`player ${currentTurn === 'O' ? 'active' : ''}`}>
                    <span className="piece o">O</span> {player2 || 'Waiting...'}
                </div>
            </div>

            <div className={`status-banner status-${status.toLowerCase()}`}>
                {getStatusMessage()}
            </div>

            <div className={`board ${isMyTurn ? 'can-play' : 'locked'}`}>
                {board.map((cell, index) => (
                    <div 
                        key={index} 
                        className={`cell ${cell ? 'filled' : ''} ${cell === 'X' ? 'text-blue' : 'text-red'}`} 
                        onClick={() => handleCellClick(index)}
                    >
                        {cell}
                    </div>
                ))}
            </div>
        </div>
    );
};
