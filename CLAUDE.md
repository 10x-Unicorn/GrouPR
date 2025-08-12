# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GrouPR is a React Native Expo application for group fitness and workout tracking. The app includes team/group management with real-time chat, user authentication, and workout features.

## Tech Stack

- **Framework**: React Native with Expo (SDK 53)
- **Navigation**: React Navigation v6 (Bottom Tabs + Native Stack)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Appwrite (self-hosted, running on Docker)
- **Real-time**: Appwrite's real-time subscriptions
- **State Management**: React hooks and context (no Redux/Zustand)
- **Icons**: react-native-vector-icons (MaterialCommunityIcons)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Start Appwrite backend (from appwrite/ directory)
cd appwrite && docker compose up -d --remove-orphans

# Stop Appwrite
cd appwrite && docker compose stop

# Setup Appwrite CLI and push config
npm install -g appwrite-cli
appwrite login --endpoint http://localhost/v1
./appwrite-run.sh push all
```

## Architecture Overview

### Core App Structure
- **App.js**: Main app component handling authentication, navigation, deep linking, and theme management
- **Navigation**: Tab-based navigation with stack navigators for complex flows
- **Authentication**: Appwrite account management with session-based auth
- **Theme**: Dynamic light/dark mode using React Native's useColorScheme

### Key Components
- **CustomTabBar**: Custom tab bar implementation with theme support
- **ProfileModal**: User profile management with action sheets
- **ChatHeader/ChatMessage/MessageInput**: Chat system components
- **CreateGroupForm**: Team/group creation interface
- **WorkoutStack/GroupsStack**: Navigation stacks for major features

### Services Layer
- **chatService.js**: Manages real-time chat functionality, message CRUD, and subscriptions cleanup
- **teamService.js**: Handles team operations (create, invite, join, leave, delete)
- **appwrite.js**: Appwrite client configuration and exports

### Data Architecture
- **Appwrite Database**: `groupr_db` database with collections for chat messages
- **Teams**: Appwrite's built-in teams feature for group management
- **Permissions**: Role-based access control (team members, message authors)
- **Real-time**: WebSocket subscriptions for live chat updates

### Screen Organization
```
screens/
├── Auth: LoginScreen, SignUpScreen, AcceptInviteScreen
├── Main: HomeScreen, AboutScreen
├── Groups: GroupsScreen (with nested chat)
├── Workouts: WorkoutScreen, ExercisesScreen, NewWorkoutScreen, NewExerciseScreen
└── ChatScreen: Standalone chat interface
```

### Styling Approach
- **NativeWind**: Tailwind classes directly in JSX (`className` prop)
- **Theme System**: Use `lib/theme.js` for all color definitions - this file contains the complete color palette for both light and dark modes
- **Color Usage**: Always use colors from `lib/theme.js` instead of hardcoded hex values - import and use the colors object for consistency
- **Theme Hook**: Use the `useTheme()` hook to access current theme colors in components
- **Safe Areas**: React Native Safe Area Context for proper spacing
- **Custom Themes**: Navigation themes that adapt to system dark mode

## Deep Linking
The app supports deep linking for team invitations:
- URL pattern: `http://192.168.1.167:8081/accept-invite?teamId=...&membershipId=...`
- Handles both cold starts and warm app states
- Automatically navigates to AcceptInviteScreen when invitation links are opened

## Environment Setup
- **Appwrite Endpoint**: Configured for local development (localhost for iOS, 10.0.2.2 for Android)
- **Environment Variables**: Uses `@env` for IP_ADDRESS and APPWRITE_PROJECT_ID
- **Docker**: Appwrite runs in Docker containers for backend services

## Database Schema
- **chat_messages collection**: 
  - teamId (string) - links to Appwrite team
  - userId (string) - message author
  - userName (string) - display name
  - message (string) - message content
  - Permissions: team read, author update/delete

## State Management Patterns
- **Custom Hooks**: useChat.js, useTeams.js for state logic
- **Service Singletons**: chatService and teamService maintain state
- **Real-time Subscriptions**: Automatic cleanup on component unmount
- **User Session**: Global authentication state with session checking

## Theme System

### Color Management
- **Central Theme File**: All colors are defined in `lib/theme.js` with complete light/dark mode support
- **Consistent Palette**: Use the predefined color scales (primary, gray, background, text, etc.) instead of custom colors
- **Theme Hook**: Import `useTheme()` from `hooks/useTheme` to access current theme colors in components
- **Color Categories**:
  - Primary: brand colors (blue/sky)
  - Background: surface and background colors
  - Text: text hierarchy colors
  - Gray scale: utility colors
  - Status: success, warning, error, info colors
  - Border: consistent border colors

### Usage Examples
```javascript
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Primary text</Text>
      <Text style={{ color: theme.colors.textSecondary }}>Secondary text</Text>
    </View>
  );
};
```

### Important Rules
- NEVER use hardcoded hex colors like '#3b82f6' - use `theme.colors.primary` instead
- ALWAYS import colors from `lib/theme.js` when defining navigation themes
- USE the theme hook in all components that need colors
- MAINTAIN color consistency across light and dark modes

## Development Notes
- **Platform Differences**: Android emulator uses different IP (10.0.2.2) than iOS
- **Hot Reload**: Expo development client supports fast refresh
- **Debugging**: Appwrite console available at http://localhost for database inspection
- **Team Invitations**: Email-based invitations with URL generation for acceptance flow