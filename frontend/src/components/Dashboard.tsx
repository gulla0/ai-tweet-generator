// src/components/Dashboard.tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import Header from './Header';
import TranscriptList from './TranscriptList';
import TranscriptForm from './TranscriptForm';
import TweetList from './TweetList';

// Styled components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 0.875rem;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: var(--color-primary);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: var(--color-text-light);
  font-size: 1.125rem;
`;

const ErrorDisplay = styled.div`
  background-color: #FED7D7;
  border: 1px solid #F56565;
  color: #C53030;
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
`;

// Dashboard component
const Dashboard = () => {
  const { state, fetchTranscripts, setView, exitApp } = useAppContext();
  
  // Fetch transcripts on mount
  useEffect(() => {
    fetchTranscripts().catch(console.error);
  }, []);
  
  // Handle back button click
  const handleBack = () => {
    setView('list');
  };
  
  // Render content based on current view
  const renderContent = () => {
    if (state.isLoading) {
      return <LoadingIndicator>Loading...</LoadingIndicator>;
    }
    
    if (state.error) {
      return <ErrorDisplay>{state.error}</ErrorDisplay>;
    }
    
    switch (state.view) {
      case 'list':
        return <TranscriptList />;
      case 'form':
        return (
          <>
            <BackButton onClick={handleBack}>
              ← Back to transcripts
            </BackButton>
            <TranscriptForm />
          </>
        );
      case 'tweets':
        return (
          <>
            <BackButton onClick={handleBack}>
              ← Back to transcripts
            </BackButton>
            {state.selectedTranscript && <TweetList />}
          </>
        );
      default:
        return <TranscriptList />;
    }
  };
  
  return (
    <Container>
      <Header onReset={exitApp} />
      <Content>{renderContent()}</Content>
    </Container>
  );
};

export default Dashboard;