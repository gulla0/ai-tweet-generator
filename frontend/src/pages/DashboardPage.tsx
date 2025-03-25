import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import TranscriptCard from '../components/TranscriptCard';
import TranscriptForm from '../components/TranscriptForm';
import TweetList from '../components/TweetList';
import { getTranscripts } from '../services/api';
import { Transcript } from '../utils/types';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f7fafc;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #2d3748;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AddButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: #4299e1;
  color: white;
  font-size: 1.5rem;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3182ce;
  }
`;

const BackButton = styled.button`
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage = ({ onLogout }: DashboardPageProps) => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'form' | 'tweets'>('list');
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  
  const fetchTranscripts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getTranscripts();
      setTranscripts(data);
    } catch (err) {
      setError('Failed to load transcripts');
      console.error('Error loading transcripts:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTranscripts();
  }, []);
  
  const handleAddTranscript = () => {
    setView('form');
  };
  
  const handleTranscriptClick = (transcript: Transcript) => {
    setSelectedTranscript(transcript);
    setView('tweets');
  };
  
  const handleFormSubmitSuccess = () => {
    setView('list');
    fetchTranscripts();
  };
  
  const handleBackClick = () => {
    setView('list');
    setSelectedTranscript(null);
  };
  
  return (
    <Container>
      <Header onLogout={onLogout} />
      
      <Content>
        {view === 'list' && (
          <>
            <Title>Your Transcripts</Title>
            
            {isLoading ? (
              <p>Loading transcripts...</p>
            ) : error ? (
              <p>{error}</p>
            ) : transcripts.length === 0 ? (
              <EmptyState>
                <p>You haven't uploaded any transcripts yet.</p>
                <button onClick={handleAddTranscript}>Upload Your First Transcript</button>
              </EmptyState>
            ) : (
              transcripts.map((transcript) => (
                <TranscriptCard
                  key={transcript.id}
                  transcript={transcript}
                  onClick={handleTranscriptClick}
                />
              ))
            )}
            
            <AddButton onClick={handleAddTranscript}>+</AddButton>
          </>
        )}
        
        {view === 'form' && (
          <>
            <BackButton onClick={handleBackClick}>
              ← Back to Transcripts
            </BackButton>
            
            <TranscriptForm onSubmitSuccess={handleFormSubmitSuccess} />
          </>
        )}
        
        {view === 'tweets' && selectedTranscript && (
          <>
            <BackButton onClick={handleBackClick}>
              ← Back to Transcripts
            </BackButton>
            
            <TweetList
              transcriptId={selectedTranscript.id}
              transcriptTitle={selectedTranscript.title}
            />
          </>
        )}
      </Content>
    </Container>
  );
};

export default DashboardPage; 