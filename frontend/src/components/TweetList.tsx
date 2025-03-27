// src/components/TweetList.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { Tweet, TweetState } from '../types';
import TweetEditor from './TweetEditor';

// Color mapping for tweet states
const getStateColor = (state: TweetState) => {
  switch (state) {
    case 'draft':
      return '#718096'; // Gray
    case 'approved':
      return '#3182ce'; // Blue
    case 'edited':
      return '#ed8936'; // Orange
    case 'sent':
      return '#38a169'; // Green
    default:
      return '#718096'; // Gray as default
  }
};

// Get human-readable state name
const getStateName = (state: TweetState) => {
  switch (state) {
    case 'draft':
      return 'Draft';
    case 'approved':
      return 'Approved';
    case 'edited':
      return 'Edited';
    case 'sent':
      return 'Sent';
    default:
      return 'Unknown';
  }
};

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

const TweetCard = styled.div<{ stateColor: string }>`
  background-color: white;
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 1rem;
  position: relative;
  border-left: 4px solid ${props => props.stateColor};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TweetContent = styled.p`
  margin: 0 0 1rem 0;
  color: var(--color-text);
  line-height: 1.5;
`;

const TweetState = styled.div<{ stateColor: string }>`
  display: inline-flex;
  align-items: center;
  background-color: ${props => `${props.stateColor}20`}; // 20% opacity
  color: ${props => props.stateColor};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
`;

const StateIndicator = styled.span<{ stateColor: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.stateColor};
  margin-right: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover:not(:disabled) {
    background-color: var(--color-border);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendButton = styled(ActionButton)`
  background-color: var(--color-primary);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
  }
`;

const EditButton = styled(ActionButton)`
  background-color: var(--color-background);
  color: var(--color-text);
`;

const DeleteButton = styled(ActionButton)`
  background-color: var(--color-background);
  color: var(--color-error);
  
  &:hover:not(:disabled) {
    background-color: #FED7D7;
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

const ConfirmDeleteOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ConfirmDeleteDialog = styled.div`
  background-color: white;
  border-radius: var(--radius);
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ConfirmDeleteTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: var(--color-text);
`;

const ConfirmDeleteMessage = styled.p`
  margin: 0 0 1.5rem 0;
  color: var(--color-text);
`;

const ConfirmDeleteButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const ConfirmDeleteButton = styled(ActionButton)`
  background-color: var(--color-error);
  color: white;
  border: none;
  
  &:hover {
    background-color: #C53030;
  }
`;

// TweetList component
const TweetList = () => {
  const { state, sendTweet, editTweet, deleteTweet } = useAppContext();
  const { tweets, selectedTranscript } = state;
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [deletingTweetId, setDeletingTweetId] = useState<string | null>(null);
  
  // Copy tweet to clipboard
  const handleCopyTweet = (tweet: Tweet) => {
    navigator.clipboard.writeText(tweet.content);
    setCopiedId(tweet.id);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  // Send tweet to X
  const handleSendTweet = async (tweet: Tweet) => {
    try {
      await sendTweet(tweet.id);
    } catch (error) {
      console.error('Failed to send tweet:', error);
    }
  };
  
  // Edit tweet
  const handleEditClick = (tweet: Tweet) => {
    setEditingTweet(tweet);
  };
  
  const handleEditSave = async (content: string) => {
    if (editingTweet) {
      try {
        await editTweet(editingTweet.id, content);
        setEditingTweet(null);
      } catch (error) {
        console.error('Failed to edit tweet:', error);
      }
    }
  };
  
  const handleEditCancel = () => {
    setEditingTweet(null);
  };
  
  // Delete tweet
  const handleDeleteClick = (tweetId: string) => {
    setDeletingTweetId(tweetId);
  };
  
  const handleConfirmDelete = async () => {
    if (deletingTweetId) {
      try {
        await deleteTweet(deletingTweetId);
        setDeletingTweetId(null);
      } catch (error) {
        console.error('Failed to delete tweet:', error);
      }
    }
  };
  
  const handleCancelDelete = () => {
    setDeletingTweetId(null);
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
          
          {tweetsByCategory[category].map(tweet => {
            const stateColor = getStateColor(tweet.state);
            
            return (
              <TweetCard key={tweet.id} stateColor={stateColor}>
                <TweetState stateColor={stateColor}>
                  <StateIndicator stateColor={stateColor} />
                  {getStateName(tweet.state)}
                </TweetState>
                
                <TweetContent>{tweet.content}</TweetContent>
                
                <ButtonGroup>
                  <ActionButton onClick={() => handleCopyTweet(tweet)}>
                    Copy to Clipboard
                  </ActionButton>
                  
                  {tweet.state !== 'sent' && (
                    <SendButton
                      onClick={() => handleSendTweet(tweet)}
                      disabled={state.isLoading}
                    >
                      Send
                    </SendButton>
                  )}
                  
                  {tweet.state !== 'sent' && (
                    <EditButton
                      onClick={() => handleEditClick(tweet)}
                      disabled={state.isLoading}
                    >
                      Edit
                    </EditButton>
                  )}
                  
                  {tweet.state !== 'sent' && (
                    <DeleteButton
                      onClick={() => handleDeleteClick(tweet.id)}
                      disabled={state.isLoading}
                    >
                      Delete
                    </DeleteButton>
                  )}
                </ButtonGroup>
                
                {copiedId === tweet.id && (
                  <CopyMessage>Copied!</CopyMessage>
                )}
              </TweetCard>
            );
          })}
        </CategorySection>
      ))}
      
      {/* Edit Tweet Modal */}
      {editingTweet && (
        <TweetEditor
          tweet={editingTweet}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
      
      {/* Confirm Delete Dialog */}
      {deletingTweetId && (
        <ConfirmDeleteOverlay>
          <ConfirmDeleteDialog>
            <ConfirmDeleteTitle>Delete Tweet</ConfirmDeleteTitle>
            <ConfirmDeleteMessage>
              Are you sure you want to delete this tweet? This action cannot be undone.
            </ConfirmDeleteMessage>
            <ConfirmDeleteButtons>
              <ActionButton onClick={handleCancelDelete}>
                Cancel
              </ActionButton>
              <ConfirmDeleteButton onClick={handleConfirmDelete}>
                Delete
              </ConfirmDeleteButton>
            </ConfirmDeleteButtons>
          </ConfirmDeleteDialog>
        </ConfirmDeleteOverlay>
      )}
    </Container>
  );
};

export default TweetList;