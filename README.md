# DAO Tweet Generator

A minimal, modular application for converting DAO governance meeting transcripts into engaging tweet suggestions using Anthropic's Claude API.

## Overview

The DAO Tweet Generator helps decentralized organizations communicate their governance activities to a wider audience. It automatically processes meeting transcripts and generates tweet-worthy content organized by categories like governance updates, treasury news, community initiatives, and more.

## Philosophy

This application is built with these principles in mind:

- **Sovereignty**: All data is stored locally, giving you complete control
- **Modularity**: Clean separation of concerns for maintainability and extensibility
- **Minimalism**: Focus on core functionality without unnecessary complexity
- **Transparency**: Clear architecture and data flow throughout the application

## Features

- Process meeting transcripts to extract important segments
- Generate tweet suggestions using Anthropic Claude
- Review generated tweets by category
- Complete tweet lifecycle management:
  - Edit tweet content
  - Send tweets (simulated)
  - Delete draft tweets
  - Visual state indicators (draft, approved, edited, sent)
- Simple local storage without requiring a database
- Basic authentication with configurable admin credentials
- Modern, responsive UI with copy-to-clipboard functionality for tweets

## Project Structure

```
dao-tweet-generator/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration and environment settings
│   │   ├── services/       # Core business logic
│   │   │   ├── authService.ts       # Authentication service
│   │   │   ├── transcriptService.ts # Transcript processing
│   │   │   └── tweetService.ts      # Tweet management
│   │   ├── routes/         # API endpoints
│   │   │   ├── auth.ts            # Authentication routes
│   │   │   ├── transcripts.ts     # Transcript management routes
│   │   │   └── tweets.ts          # Tweet lifecycle routes
│   │   ├── types.ts        # Type definitions
│   │   └── server.ts       # Entry point
│   ├── data/               # Local storage directory
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── Dashboard.tsx       # Main dashboard
│   │   │   ├── TweetList.tsx       # Tweet display component
│   │   │   ├── TweetEditor.tsx     # Tweet editing modal
│   │   │   └── ...                 # Other components
│   │   ├── context/        # State management
│   │   │   └── AppContext.tsx      # Application state and actions
│   │   ├── services/       # API client
│   │   ├── types.ts        # Type definitions
│   │   ├── App.tsx         # Main component
│   │   └── main.tsx        # Entry point
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── sample-transcript.txt   # Example meeting transcript
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- Anthropic API key (Claude 3 Sonnet or higher)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dao-tweet-generator
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Edit .env to add your Anthropic API key
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   Update the `.env` file in the backend directory with your Anthropic API key and other settings:
   ```
   PORT=4000
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   MODEL=claude-3-sonnet-20240229
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

## Running the Application

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at http://localhost:3000

4. Log in with the admin credentials:
   - Email: `admin@example.com` (or as configured in your .env)
   - Password: `admin123` (or as configured in your .env)

## Usage

1. After logging in, you'll see the dashboard showing your transcripts (or an empty state if you haven't created any yet).

2. Click "Add New Transcript" or the floating "+" button to create a new transcript.

3. Fill in the meeting details:
   - **Title**: Name of the meeting
   - **Date**: When the meeting occurred
   - **Content**: The full meeting transcript

4. You can click "Load Sample Transcript" to populate the form with an example for testing.

5. Click "Generate Tweets" to process the transcript.

6. Once processing is complete, you'll be redirected to the transcript list. Click on a transcript to view the generated tweets.

7. Tweets will be organized by category (Governance, Treasury, Community, etc.)

8. For each tweet, you can:
   - **Copy to Clipboard**: Quickly copy the tweet text
   - **Edit**: Modify the tweet content (opens the editor)
   - **Send**: Mark the tweet as sent (simulated)
   - **Delete**: Remove draft tweets from the list

9. Tweet states are color-coded for easy identification:
   - **Draft**: Default state for newly generated tweets
   - **Edited**: Tweets that have been modified
   - **Sent**: Tweets that have been marked as sent

## Understanding The Architecture

This application follows a clean architecture approach:

### Backend
- **Config Layer**: Environment variables and application settings
- **Services Layer**: Core business logic for transcript processing and tweet generation 
- **Routes Layer**: API endpoints for the frontend to interact with
- **Data Storage**: Simple file-based storage using JSON files

### Frontend
- **Context API**: State management using React Context
- **Services**: API client for interacting with the backend
- **Components**: UI elements with minimal business logic
- **Types**: Shared type definitions for type safety

### Data Flow
1. User submits a transcript via the UI
2. Backend receives transcript and stores it
3. Backend processes transcript with Claude API in the background
4. Generated tweets are stored in the local file system
5. Frontend fetches and displays the generated tweets
6. User can edit, send, or delete tweets as needed
7. State changes are persisted to the backend

## Customizing the Tweet Generation

You can customize how tweets are generated by modifying the system prompt in `src/services/transcriptService.ts`.

Look for the `generateTweets` function and edit the `systemPrompt` variable to tailor the instructions given to Claude.

## Deploying to Production

For a production environment:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

3. Start the production server:
   ```bash
   cd backend
   npm start
   ```

The production build serves the frontend static files from the backend, so you only need to run the backend server.

## Security Considerations

This application uses a simple authentication system suitable for prototyping but not for production use with sensitive data. For a production environment, consider:

- Implementing proper JWT authentication
- Setting up HTTPS
- Adding rate limiting
- Properly hashing passwords
- Using a secure database instead of file storage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.