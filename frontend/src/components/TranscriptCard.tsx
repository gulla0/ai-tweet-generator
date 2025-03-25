import styled from 'styled-components';
import { Transcript } from '../utils/types';

const Card = styled.div`
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h3`
  margin-bottom: 0.5rem;
  color: #2d3748;
`;

const Date = styled.p`
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const CreatedAt = styled.p`
  color: #a0aec0;
  font-size: 0.75rem;
`;

interface TranscriptCardProps {
  transcript: Transcript;
  onClick: (transcript: Transcript) => void;
}

const TranscriptCard = ({ transcript, onClick }: TranscriptCardProps) => {
  // Format the created at date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <Card onClick={() => onClick(transcript)}>
      <Title>{transcript.title}</Title>
      <Date>Meeting Date: {transcript.date}</Date>
      <CreatedAt>Created: {formatDate(transcript.createdAt)}</CreatedAt>
    </Card>
  );
};

export default TranscriptCard; 