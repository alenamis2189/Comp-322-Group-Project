# Comp-322-Group-Project

TSA Luggage Check

## YouTube Overview

[![TSA Luggage Check Demo](https://img.youtube.com/vi/wJu0AM3-YLw/0.jpg)](https://www.youtube.com/shorts/wJu0AM3-YLw "TSA Luggage Check Demo")

https://youtube.com/shorts/wJu0AM3-YLw?feature=share
## Overview

TSA Luggage Check is a mini-game where players act as TSA officers reviewing luggage.
Tap prohibited items to earn points, avoid safe items, and race against the clock.
The game updates score immediately, tracks multiple rounds, and saves high scores to Supabase.

## Features
	•	3×3 grid of randomized luggage items
	•	Difficulty levels: Easy, Medium, Hard
	•	Per-round timer (15s / 10s / 5s)
	•	Immediate scoring feedback (+1 / –1)
	•	Multi-round game flow
	•	Results screen with final score
	•	High Scores screen (connected to Supabase)
	•	Dark/light theme support


## Tech Stack
	•	Expo + React Native (UI, navigation, game loop)
	•	Expo Router (navigation between screens)
	•	TypeScript (strict typing)
	•	Supabase (cloud high score storage)

## Project Structure

app/
  index.tsx            → Start screen
  difficulty.tsx       → Difficulty selection
  playScreen.tsx       → Game logic + grid
  scoreScreen.tsx      → Results & round transitions
  highScores.tsx       → Supabase leaderboard
lib/
  game/items.ts        → Luggage item data
  game/rules.ts        → Difficulty timing & round rules
  storage/highscores.ts→ Save/load score logic
  supabaseClient.ts    → Supabase config
assets/
  images/              → Luggage item images
  icon.png
  splash.png

## Team Roles

Francisco
	•	Navigation flow (Start → Difficulty → Play → Score → HighScores)
	•	Multi-round logic and timer logic
	•	Difficulty system integration
	•	Supabase setup + leaderboard storage
	•	Debugging and edge-case handling

Gianna
	•	3×3 grid implementation
	•	Tap logic (+1 prohibited, –1 safe)
	•	Prevent double taps
	•	Round scoring logic

Izzy
	•	UI layout, spacing, and color themes
	•	Button styling & tap feedback
	•	Start screen aesthetics

Alena
	•	Item dataset creation (safe vs prohibited)
	•	Image organization
	•	Early results screen and testing


## Installation

git clone https://github.com/alenamis2189/TSA-Luggage-Check.git
cd TSA-Luggage-Check
npm install
npx expo start

Open in:
	•	iOS Simulator
	•	Android Emulator
	•	Expo Go App


## High Scores (Supabase)

The app sends scores to a hosted Supabase table:

saveHighScore(score: number, difficulty: string)
fetchTopHighScores(limit = 10)

If no scores exist, the UI shows a placeholder.


## Future Improvements
	•	Progress bar timer
	•	Sound effects (correct / incorrect / round complete)
	•	Haptics
	•	Accuracy & streak calculations
	•	Better animations & transitions
	•	Randomized item difficulty mixing
