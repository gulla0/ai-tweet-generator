// src/components/TranscriptList.tsx
import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { Transcript } from '../types';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0;
`;

const AddButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
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
  margin-bottom: 1.5rem;
`;

const EmptyStateButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const TranscriptCard = styled.div`
  background-color: white;
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
  }
`;

const TranscriptTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
`;

const TranscriptDate = styled.p`
  margin: 0 0 0.5rem 0;
  color: var(--color-text-light);
  font-size: 0.875rem;
`;

const TranscriptCreatedAt = styled.p`
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.75rem;
`;

const FloatingAddButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  font-size: 1.5rem;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

// TranscriptList component
const TranscriptList = () => {
  const { state, setView, selectTranscript } = useAppContext();
  const { transcripts } = state;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Handle add transcript button click
  const handleAddTranscript = () => {
    setView('form');
  };
  
  // Handle transcript card click
  const handleTranscriptClick = (transcript: Transcript) => {
    selectTranscript(transcript);
  };
  
  return (
    <Container>
      <TitleSection>
        <Title>DAO Meeting Transcripts</Title>
        <AddButton onClick={handleAddTranscript}>
          Add New Transcript
        </AddButton>
      </TitleSection>
      
      {transcripts.length === 0 ? (
        <EmptyState>
          <EmptyStateText>
            You haven't uploaded any meeting transcripts yet.
          </EmptyStateText>
          <EmptyStateButton onClick={handleAddTranscript}>
            Upload Your First Transcript
          </EmptyStateButton>
        </EmptyState>
      ) : (
        <>
          {transcripts.map((transcript) => (
            <TranscriptCard
              key={transcript.id}
              onClick={() => handleTranscriptClick(transcript)}
            >
              <TranscriptTitle>{transcript.title}</TranscriptTitle>
              <TranscriptDate>Meeting Date: {transcript.date}</TranscriptDate>
              <TranscriptCreatedAt>
                Added: {formatDate(transcript.createdAt)}
              </TranscriptCreatedAt>
            </TranscriptCard>
          ))}
          
          <FloatingAddButton onClick={handleAddTranscript}>+</FloatingAddButton>
        </>
      )}
    </Container>
  );
};

export default TranscriptList;