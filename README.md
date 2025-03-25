# AI Tweet Generator

This system converts organizational meeting transcripts into tweet suggestions using Anthropic's Claude API.

## Features

- Process meeting transcripts to extract important segments
- Generate tweet suggestions using Anthropic Claude
- Review generated tweets by category
- Simple local storage without requiring a database
- Basic authentication with hardcoded admin credentials
- User-friendly UI with copy-to-clipboard functionality for tweets

## Prerequisites

- Node.js (v16 or higher)
- Anthropic API key (Claude 3 Sonnet)

## Project Structure

```
ai-tweet-generator/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── src/
│       ├── config/
│       ├── core/
│       ├── routes/
│       ├── services/
│       └── server.ts
└── frontend/
    ├── package.json
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── utils/
        └── App.tsx
```

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
   cp .env.example .env  # Copy example env file and update with your values
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   - Backend `.env`:
     - Add your Anthropic API key
     - Adjust generation parameters if needed

5. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```

## Usage

1. Access the application at http://localhost:3000
2. Log in with the admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. You'll see a list of your previously uploaded transcripts, or a prompt to add your first one
4. Click the "+" button or "Upload Your First Transcript" to add a new transcript
5. Fill in the title, date, and paste your transcript content (or use the sample transcript)
6. Click "Generate Tweets" to process the transcript and generate tweet suggestions
7. View the generated tweets organized by category
8. Use the "Copy" button on any tweet to copy it to your clipboard

### Sample Transcript

A sample transcript file `sample-transcript.txt` is included in the repository for testing purposes. You can load it directly in the application by clicking "Load sample transcript" in the form.

## How It Works

1. **Transcript Processing**: The system analyzes transcripts to identify significant segments about governance and community collaboration
2. **AI Tweet Generation**: Anthropic Claude generates engaging tweet suggestions for each important segment
3. **Review**: View the generated tweets organized by category
4. **Local Storage**: All data is stored locally in JSON files in the data/ directory

## Development

### Backend

- Written in TypeScript
- Express.js for API
- Local file storage for data
- Anthropic Claude API integration

### Frontend

- React with TypeScript
- Styled Components for styling
- React Router for navigation
- Modern, responsive UI

## API Documentation

### Transcripts

- `GET /api/transcripts` - Get all transcripts
- `GET /api/transcripts/:id` - Get transcript by ID
- `POST /api/transcripts` - Create new transcript and generate tweets
- `GET /api/transcripts/:id/tweets` - Get tweets by transcript ID

## License

This project is licensed under the MIT License - see the LICENSE file for details. 