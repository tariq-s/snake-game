import React, { useState } from "react";
import "./Board.css";
import LinkedList from "../utils/LinkedList";
import useInterval from "../utils/useInterval";
import GameOver from "../GameOver/GameOver";

const BOARD_SIZE = 25;

const createBoard = (size) => {
	const board = [];
	let count = 1;
	for (let row = 0; row < size; row++) {
		let currRow = [];
		for (let col = 0; col < size; col++) {
			currRow.push(count);
			count++;
		}
		board.push(currRow);
	}
	return board;
};


const Board = () => {
	const board = createBoard(BOARD_SIZE);
	const [score, setScore] = useState(1);
	const [snake, setSnake] = useState(
		new LinkedList(
			board[Math.round(BOARD_SIZE / 3)][Math.round(BOARD_SIZE / 3)]
		)
	);
	const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value]));
	const [direction, setDirection] = useState("ArrowRight");
	const [foodCell, setFoodCell] = useState(snake.head.value + 5);
	const [gameOver, setGameOver] = useState(false);

	const moveSnake = () => {
		let newHead;
		if (direction === "ArrowUp") newHead = snake.head.value - BOARD_SIZE;
		else if (direction === "ArrowDown") newHead = snake.head.value + BOARD_SIZE;
		else if (direction === "ArrowRight") newHead = snake.head.value + 1;
		else if (direction === "ArrowLeft") newHead = snake.head.value - 1;

		if (isOutofBound() || snakeCells.has(newHead)) {
			setGameOver(true);
			return;
		}

		const newSnakeCells = new Set(snakeCells);
		newSnakeCells.delete(snake.tail.value);
		newSnakeCells.add(newHead);
		setSnakeCells(newSnakeCells);

		snake.moveList(newHead);
		setSnake(snake);

		if (snake.head.value === foodCell) {
			const currentFoodCell = foodCell;
			setFoodCell(getNewFoodCell());

			growSnake(currentFoodCell);
			setScore(score + 1);
		}
	};

	const getNewFoodCell = () => {
		let randomNumber = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE) + 1;

		while (snakeCells.has(randomNumber) || (snake.last && randomNumber === snake.last))
			randomNumber = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE) + 1;

		return randomNumber;
	};

	const growSnake = (newValue) => {
		const newSnakeCells = new Set(snakeCells);
		newSnakeCells.add(newValue);
		setSnakeCells(newSnakeCells);

		snake.insertTail();
		setSnake(snake);
	};

	const handleKeydown = (key) => {
		const allowedDirections = [
			"ArrowUp",
			"ArrowDown",
			"ArrowRight",
			"ArrowLeft",
		];

		if (allowedDirections.includes(key)) setDirection(key);
	};

	const isOutofBound = () => {
		const currentPos = {
			row: Math.floor((snake.head.value - 1) / BOARD_SIZE),
			col: Math.floor((snake.head.value - 1) % BOARD_SIZE),
		};

		if (direction === "ArrowUp") return currentPos.row - 1 < 0;
		if (direction === "ArrowDown") return currentPos.row + 1 >= BOARD_SIZE;
		if (direction === "ArrowRight") return currentPos.col + 1 >= BOARD_SIZE;
		if (direction === "ArrowLeft") return currentPos.col - 1 < 0;
	};

	window.addEventListener("keydown", (event) => {
		handleKeydown(event.key);
	});

	useInterval(
		() => {
			moveSnake();
		},
		gameOver ? null : 150
	);

	return gameOver ? (
		<GameOver score={score} />
	) : (
		<div>
			<h1 className="score">Score: {score}</h1>
			<div className="board">
				{board.map((row, rowIdx) => (
					<div key={rowIdx} className="row">
						{row.map((cell, cellIdx) => {
							const cellClasses = ["cell"];
							if (snakeCells.has(cell)) cellClasses.push("snake-cell");
							else if (cell === foodCell) cellClasses.push("food-cell");
							return (
								<div key={cellIdx} className={cellClasses.join(" ")}></div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};

export default Board;
