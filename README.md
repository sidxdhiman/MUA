# DayStack (Multi-Utility Daily Assistant)

DayStack is a comprehensive React Native + TypeScript application designed to be a personal daily assistant. It combines multiple utility modules into one smooth, modern, and cohesive interface.

## Modules Included:
1. **Home Dashboard**: A smart daily snapshot aggregating all modules.
2. **Finance Tracker**: Manage daily expenses, income, and track balances.
3. **Tasks & Reminders**: High/medium/low prioritized task manager.
4. **Health & Wellness**: Hydration, sleep tracking, steps, and mood check-in.
5. **Outfit Decider**: A smart wardrobe and outfit suggestion generator.
6. **Voice to Notes**: Record voice memos with smart tagging.
7. **Attendance Tracker**: Location & schedule-aware attendance management for students.
8. **Diet Planner**: Meal tracking and preparation reminders.

## Tech Stack:
- React Native + TypeScript
- Expo framework
- React Navigation (Bottom Tabs + Native Stack)
- Zustand (with AsyncStorage persistence)
- React Hook Form + Zod (prepared for expanded forms)
- Lucide React Native (icons)

## Project Structure:
- `/src/components`: Reusable UI elements (AppText, Button, Card, Input, Screen, SummaryCard).
- `/src/navigation`: App routing configuration.
- `/src/screens`: Organized by module (Home, Finance, Reminders, Health, Diet, Outfit, Attendance, VoiceNotes, Onboarding, Settings).
- `/src/store`: Zustand stores for global state (`useAppStore`, `useFinanceStore`, `useTasksStore`).
- `/src/theme`: Centralized design system (colors, spacing, typography).

## Getting Started:
1. `npm install`
2. `npx expo start`
3. Press `a` to open in Android emulator, `i` to open in iOS simulator, or scan QR code with Expo Go.
