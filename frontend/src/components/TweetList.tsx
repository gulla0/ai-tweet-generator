// src/components/TweetList.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { Tweet } from '../types';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderSection = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: var(--color-text-light);
  margin: 0;
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const TweetCard = styled.div`
  background-color: white;
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 1rem;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TweetContent = styled.p`
  margin: 0 0 1rem 0;
  color: var(--color-text);
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CopyButton = styled.button`
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--color-border);
  }
`;

const EmptyState = styled.div`
  background-color: white;
  border-radius: var(--radius);
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--shadow);
`;

const EmptyStateText = styled.p`
  color: var(--color-text-light);
  margin: 0;
`;

const CopyMessage = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--color-success);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius);
  font-size: 0.75rem;
  animation: fadeOut 2s forwards;
  
  @keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

// TweetList component
const TweetList = () => {
  const { state } = useAppContext();
  const { tweets, selectedTranscript } = state;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Copy tweet to clipboard
  const handleCopyTweet = (tweet: Tweet) => {
    navigator.clipboard.writeText(tweet.content);
    setCopiedId(tweet.id);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  // Group tweets by category
  const groupTweetsByCategory = () => {
    const grouped: Record<string, Tweet[]> = {};
    
    tweets.forEach(tweet => {
      if (!grouped[tweet.category]) {
        grouped[tweet.category] = [];
      }
      grouped[tweet.category].push(tweet);
    });
    
    return grouped;
  };
  
  const tweetsByCategory = groupTweetsByCategory();
  const categories = Object.keys(tweetsByCategory);
  
  if (!selectedTranscript) {
    return null;
  }
  
  if (tweets.length === 0) {
    return (
      <Container>
        <HeaderSection>
          <Title>Generated Tweets</Title>
          <Subtitle>
            For: {selectedTranscript.title} ({selectedTranscript.date})
          </Subtitle>
        </HeaderSection>
        
        <EmptyState>
          <EmptyStateText>
            No tweets generated yet. Please wait a moment while we process the transcript.
          </EmptyStateText>
        </EmptyState>
      </Container>
    );
  }
  
  return (
    <Container>
      <HeaderSection>
        <Title>Generated Tweets</Title>
        <Subtitle>
          For: {selectedTranscript.title} ({selectedTranscript.date})
        </Subtitle>
      </HeaderSection>
      
      {categories.map(category => (
        <CategorySection key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          
          {tweetsByCategory[category].map(tweet => (
            <TweetCard key={tweet.id}>
              <TweetContent>{tweet.content}</TweetContent>
              
              <ButtonGroup>
                <CopyButton onClick={() => handleCopyTweet(tweet)}>
                  Copy to Clipboard
                </CopyButton>
              </ButtonGroup>
              
              {copiedId === tweet.id && (
                <CopyMessage>Copied!</CopyMessage>
              )}
            </TweetCard>
          ))}
        </CategorySection>
      ))}
    </Container>
  );
};

export default TweetList;