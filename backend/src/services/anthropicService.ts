import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/config';
import { Tweet } from '../core/types';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey,
});

export const generateTweets = async (transcript: string, transcriptId: string): Promise<Tweet[]> => {
  const systemPrompt = `You are an expert at converting organizational meeting transcripts into engaging tweet suggestions.
Your task is to analyze the provided meeting transcript and generate tweet suggestions for the organization to post.
Focus on key governance updates, community initiatives, and collaborative projects discussed in the meeting.

Please extract 5-10 tweet-worthy segments from the transcript and convert them into engaging, informative tweets.
Each tweet should:
- Be 280 characters or less
- Be written in a professional but conversational tone
- Include relevant hashtags
- Highlight one specific update or announcement

Format your response as a JSON array where each item has the following structure:
{
  "category": "The category of the tweet (e.g., 'Governance', 'Community', 'Growth', 'Announcement')",
  "content": "The actual tweet text"
}

DO NOT include any explanations or commentary. Return ONLY valid JSON.`;

  const userPrompt = `Here is the meeting transcript to analyze and convert into tweet suggestions:\n\n${transcript}`;

  try {
    const response = await anthropic.messages.create({
      model: config.model,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 2000,
    });

    const content = response.content[0].text;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\[\s*{.*}\s*\]/s);
    if (!jsonMatch) {
      throw new Error('Failed to extract valid JSON from the API response');
    }
    
    const tweetData = JSON.parse(jsonMatch[0]);
    
    // Format the tweets with the transcript ID
    return tweetData.map((tweet: { category: string; content: string }) => ({
      transcriptId,
      category: tweet.category,
      content: tweet.content,
    }));
  } catch (error) {
    console.error('Error generating tweets:', error);
    throw error;
  }
}; 