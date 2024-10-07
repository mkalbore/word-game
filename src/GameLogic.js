import React, { useState, useEffect } from "react";

import confetti from "canvas-confetti";
import AlertModal from "./AlertModal"; // Import the Modal component

function randomInRange(min, max) {
	return Math.random() * (max - min) + min;
}

// Helper functions for game logic
const getRandomLetter = () => {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return alphabet[Math.floor(Math.random() * alphabet.length)];
};

// Points calculation logic based on word length and letter rarity
const calculatePoints = word => {
	const letterScores = {
		A: 1,
		B: 3,
		C: 3,
		D: 2,
		E: 1,
		F: 4,
		G: 2,
		H: 4,
		I: 1,
		J: 8,
		K: 5,
		L: 1,
		M: 3,
		N: 1,
		O: 1,
		P: 3,
		Q: 10,
		R: 1,
		S: 1,
		T: 1,
		U: 1,
		V: 4,
		W: 4,
		X: 8,
		Y: 4,
		Z: 10,
	};
	return word
		.split("")
		.reduce((acc, letter) => acc + letterScores[letter.toUpperCase()], 0);
};

const GameLogic = () => {
	const [randomLetters, setRandomLetters] = useState(
		Array(24)
			.fill(null)
			.map(() => getRandomLetter())
	);
	const [selectedLetters, setSelectedLetters] = useState([]);
	const [points, setPoints] = useState(0);
	const [validWords, setValidWords] = useState([]);
	const [modalMessage, setModalMessage] = useState(""); // State for modal message
	const [showModal, setShowModal] = useState(false); // State to control modal visibility

	// Fetch the valid words from the english.txt file on component mount
	useEffect(() => {
		fetch("/english.txt")
			.then(response => response.text())
			.then(text => {
				const wordsArray = text
					.split("\n")
					.map(word => word.trim().toUpperCase());
				setValidWords(wordsArray);
			})
			.catch(err => console.error("Error loading words:", err));
	}, []);

	// Handle letter click to build a word
	const handleLetterClick = (letter, index) => {
		setSelectedLetters([...selectedLetters, letter]);

		// Remove the letter only from the specific index (not all occurrences)
		const newRandomLetters = [...randomLetters];
		newRandomLetters.splice(index, 1); // Remove the letter at the clicked index
		setRandomLetters(newRandomLetters);
	};

	// Handle "Add more letters" functionality
	const addMoreLetters = () => {
		const totalLetters = selectedLetters.length + randomLetters.length;

		if (totalLetters < 24) {
			const lettersToAdd = totalLetters <= 22 ? 2 : 1; // Add 2 if we are at or below 22, else add 1
			const newLetters = Array.from({ length: lettersToAdd }, getRandomLetter);
			setRandomLetters([...randomLetters, ...newLetters]);
		}
	};

	// Handle "Submit Word" to check if valid and calculate points
	const submitWord = () => {
		const word = selectedLetters.join("").toUpperCase();

		if (validWords.includes(word) && word.length >= 3) {
			// If the word is valid, calculate points and clear selected letters
			const wordPoints = calculatePoints(word);
			setPoints(points + wordPoints);

			// Play confetti animation only when word is valid
			confetti({
				angle: randomInRange(55, 125),
				spread: randomInRange(50, 70),
				particleCount: randomInRange(50, 100),
				origin: { y: 0.6 },
			});
		} else if (word.length > 0) {
			setModalMessage(
				"There is no word: " + word + ". Returning letters to the pool."
			);
			setShowModal(true); // Show modal
			setRandomLetters([...randomLetters, ...selectedLetters]); // Return selected letters back to the pool
		} else {
			return;
		}

		// Clear the selected letters after submitting
		setSelectedLetters([]);
	};

	// Function to close the modal
	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<div className='min-h-screen flex flex-col justify-center p-4 '>
			{/* Points Display */}
			<div className='bg-blue-50 flex flex-col items-center justify-center p-4 rounded-md shadow-md'>
				<div className='text-2xl font-bold mb-4'>Points: {points}</div>

				{/* Selected Letters Display */}
				<div className='flex flex-wrap gap-2 my-6 max-w-screen-sm justify-center'>
					{selectedLetters.length > 0 ? (
						selectedLetters.map((letter, index) => (
							<div
								key={index}
								className='flex justify-center bg-green-300 p-4 min-w-11 rounded-md text-lg font-bold '>
								{letter}
							</div>
						))
					) : (
						<div className='bg-gray-200 p-4 rounded-md text-lg font-bold text-gray-500'>
							Select letters to form a word...
						</div>
					)}
				</div>

				{/* Random Letters Pool */}
				<div className='grid grid-cols-6 gap-2 justify-center align-middle items-center justify-items-center content-center my-6'>
					{randomLetters.map((letter, index) => (
						<button
							key={index}
							onClick={() => handleLetterClick(letter, index)} // Pass both the letter and its index
							className='flex justify-center bg-gray-300 p-4 min-w-11 rounded-md text-lg font-bold hover:bg-gray-400'>
							{letter}
						</button>
					))}
				</div>

				{/* Actions: Submit Word and Add More Letters */}
				<div className='flex space-x-4'>
					<button
						onClick={submitWord}
						className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${
							selectedLetters.length < 2 ? "opacity-50 cursor-not-allowed" : ""
						}`}>
						Submit Word
					</button>
					<button
						onClick={addMoreLetters}
						disabled={randomLetters.length >= 24}
						className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
							randomLetters.length >= 24 ||
							selectedLetters.length + randomLetters.length >= 24
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}>
						Add More Letters
					</button>
				</div>
			</div>
			{/* Render the modal if showModal is true */}
			{showModal && (
				<AlertModal message={modalMessage} onClose={handleCloseModal} />
			)}
		</div>
	);
};

export default GameLogic;
