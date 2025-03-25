import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTranscriptTweets } from '../services/api';
import { Tweet } from '../utils/types';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const TweetSection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h3`
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

const TweetCard = styled.div`
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-bottom: 1rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const TweetContent = styled.p`
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const CopyButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.125rem;
  color: #4a5568;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #e53e3e;
  font-size: 1.125rem;
`;

const EmptyMessage = styled.p`
  text-align: center;
  font-size: 1.125rem;
  color: #4a5568;
  padding: 2rem;
  background-color: #f7fafc;
  border-radius: 8px;
`;

interface TweetListProps {
  transcriptId: string;
  transcriptTitle: string;
}

const TweetList = ({ transcriptId, transcriptTitle }: TweetListProps) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');
  
  useEffect(() => {
    const fetchTweets = async () => {
      setIsLoading(true);
      
      try {
        const tweetsData = await getTranscriptTweets(transcriptId);
        setTweets(tweetsData);
      } catch (err) {
        setError('Failed to load tweets');
        console.error('Error loading tweets:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTweets();
  }, [transcriptId]);
  
  const handleCopyTweet = (tweet: Tweet) => {
    navigator.clipboard.writeText(tweet.content);
    setCopiedId(tweet.id);
    
    setTimeout(() => {
      setCopiedId('');
    }, 2000);
  };
  
  // Group tweets by category
  const tweetsByCategory: Record<string, Tweet[]> = {};
  tweets.forEach((tweet) => {
    if (!tweetsByCategory[tweet.category]) {
      tweetsByCategory[tweet.category] = [];
    }
    tweetsByCategory[tweet.category].push(tweet);
  });
  
  if (isLoading) {
    return <LoadingMessage>Loading tweets...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  if (tweets.length === 0) {
    return <EmptyMessage>No tweets generated yet</EmptyMessage>;
  }
  
  return (
    <Container>
      <Title>Generated Tweets for "{transcriptTitle}"</Title>
      
      {Object.entries(tweetsByCategory).map(([category, categoryTweets]) => (
        <TweetSection key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          
          {categoryTweets.map((tweet) => (
            <TweetCard key={tweet.id}>
              <TweetContent>{tweet.content}</TweetContent>
              <CopyButton onClick={() => handleCopyTweet(tweet)}>
                {copiedId === tweet.id ? 'Copied!' : 'Copy'}
              </CopyButton>
            </TweetCard>
          ))}
        </TweetSection>
      ))}
    </Container>
  );
};

export default TweetList; 