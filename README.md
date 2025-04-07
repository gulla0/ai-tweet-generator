# AI Tweet Generator

A minimal, modular application for converting meeting transcripts into engaging tweet suggestions and posting them directly to X (formerly Twitter) using Anthropic's Claude API.

## Overview

The AI Tweet Generator helps organizations communicate their governance activities to a wider audience. It automatically processes meeting transcripts and generates tweet-worthy content organized by categories like governance updates, treasury news, community initiatives, and more.

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
  - Send tweets directly to X (Twitter) or simulate sending
  - Delete draft tweets
  - Visual state indicators (draft, approved, edited, sent)
- X (Twitter) API integration with credential validation
- Simple local storage without requiring a database
- Basic authentication with configurable admin credentials
- Modern, responsive UI with copy-to-clipboard functionality for tweets

## Project Structure

```
ai-tweet-generator/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration and environment settings
│   │   ├── services/       # Core business logic
│   │   │   ├── authService.ts       # Authentication service
│   │   │   ├── transcriptService.ts # Transcript processing
│   │   │   └── tweetService.ts      # Tweet management with X API integration
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
│   │   │   ├── Dashboard.tsx         # Main dashboard
│   │   │   ├── TweetList.tsx         # Tweet display component
│   │   │   ├── TweetEditor.tsx       # Tweet editing modal
│   │   │   ├── XCredentialModal.tsx  # X API credential management
│   │   │   ├── XCredentialStatus.tsx # X credential validation status
│   │   │   └── ...                   # Other components
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
├── access-token-guide.md   # Guide for setting up X API credentials
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- Anthropic API key (Claude 3 Sonnet or higher)
- X (Twitter) API credentials (for posting tweets to X)

## Setting up X (Twitter) API Credentials

To post tweets directly to X (formerly Twitter), you'll need to set up an X app with OAuth 1.0a credentials. Follow these steps:

1. **Create a New App**
   - Go to [developer.twitter.com](https://developer.twitter.com/) and log in
   - Create a new project and then a new app
   - Copy the **API Key** and **API Key Secret**

2. **Set App Permissions**
   - In the app settings, go to **User authentication settings**
   - Set the following:
     - **App permissions:** `Read and write`
     - **Type of App:** `Web App, Automated App or Bot`
     - **Callback URI / Redirect URL:** `http://127.0.0.1:3000/callback`
     - **Website URL:** `https://example.com`
   - Save the settings

3. **Generate Access Token and Access Token Secret**
   - Go to the **Keys and Tokens** section of your app
   - Under **Access Token and Secret**, click **Generate**
   - Copy your **Access Token** and **Access Token Secret**

For more detailed instructions, see the `access-token-guide.md` file.

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-tweet-generator
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
   MODEL=claude-3-5-haiku-20241022
   CORS_ORIGIN=http://localhost:3000
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

4. On the entry page:
   - **X (Twitter) API Credentials** (all optional):
     - API Key
     - API Secret
     - Access Token
     - Access Token Secret
   - You can click "Test Credentials" to verify your X credentials before entering
   - Or simply click "Skip and enter without X credentials" to use the app in simulation mode
   - Without valid X credentials, tweets will be simulated instead of actually posted to X

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
   - **Send**: Send the tweet to X or mark as sent (based on X credential status)
   - **Delete**: Remove draft tweets from the list

9. Tweet states are color-coded for easy identification:
   - **Draft**: Default state for newly generated tweets
   - **Edited**: Tweets that have been modified
   - **Sent**: Tweets that have been marked as sent or actually posted to X

10. To set up X credentials for posting real tweets:
    - Click on the X icon in the header
    - Enter your API Key, API Secret, Access Token, and Access Token Secret
    - The status indicator will show green if your credentials are valid

## Understanding The Architecture

This application follows a clean architecture approach:

### Backend
- **Config Layer**: Environment variables and application settings
- **Services Layer**: Core business logic for transcript processing, tweet generation, and X integration
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
7. If X credentials are valid, tweets can be posted directly to X
8. State changes are persisted to the backend

## Customizing the Tweet Generation

You can customize how tweets are generated by modifying the system prompt in `src/services/transcriptService.ts`.

Look for the `generateTweets` function and edit the `systemPrompt` variable to tailor the instructions given to Claude.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.