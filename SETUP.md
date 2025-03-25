# AI Tweet Generator Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- Anthropic API key for Claude 3.5 Sonnet

## Setting Up the Application

1. **Configure your Anthropic API key**:
   
   Edit the `backend/.env` file and replace `your_anthropic_api_key_here` with your actual Anthropic API key:
   
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

2. **Start the application**:
   
   Run the startup script:
   
   ```bash
   ./start.sh
   ```
   
   This will start both the backend and frontend servers. The application will be available at http://localhost:3000.

3. **Login credentials**:
   
   Use the following default credentials to login:
   
   - Email: `admin@example.com`
   - Password: `admin123`

## Using the Application

1. After logging in, you'll see your transcript list (empty at first)
2. Click the "+" button or "Upload Your First Transcript" to add a new transcript
3. Fill in the meeting title, date, and paste your transcript content
4. Alternatively, click "Load sample transcript" to use the provided sample
5. Click "Generate Tweets" to process the transcript
6. View the generated tweets organized by category
7. Use the "Copy" button on any tweet to copy it to your clipboard

## Stopping the Application

Press `Ctrl+C` in the terminal where you started the application to stop both the backend and frontend servers.

## Troubleshooting

- If you see authentication errors when generating tweets, check that your Anthropic API key is correctly set in the `.env` file
- If the frontend cannot connect to the backend, make sure the backend server is running on port 4000
- Check the terminal output for any error messages 