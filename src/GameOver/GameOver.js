import React from 'react';
import './GameOver.css';

function GameOver({ score }) {
    return (
        <div className="game-over">
            <h1>Game Over</h1>
            <h3>Your Score: {score}</h3>
        </div>
    )
}

export default GameOver;
