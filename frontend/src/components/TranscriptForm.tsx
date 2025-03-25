import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createTranscript, getSampleTranscript } from '../services/api';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 300px;
  font-family: inherit;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4299e1;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #3182ce;
  }
`;

const SampleButton = styled(Button)`
  background-color: #edf2f7;
  color: #4a5568;
  
  &:hover:not(:disabled) {
    background-color: #e2e8f0;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  margin-top: 0.5rem;
`;

interface TranscriptFormProps {
  onSubmitSuccess: () => void;
}

const TranscriptForm = ({ onSubmitSuccess }: TranscriptFormProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !content) {
      setError('All fields are required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await createTranscript({ title, date, content });
      onSubmitSuccess();
    } catch (err) {
      setError('Failed to create transcript. Please try again.');
      console.error('Error creating transcript:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSampleTranscript = async () => {
    setIsLoading(true);
    
    try {
      const data = await getSampleTranscript();
      setContent(data.content);
      if (!title) {
        setTitle('Sample Community Meeting');
      }
    } catch (err) {
      setError('Failed to load sample transcript');
      console.error('Error loading sample:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Title>Upload Transcript</Title>
      
      <FormGroup>
        <Label htmlFor="title">Meeting Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Monthly Community Governance Meeting"
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="date">Meeting Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="content">Transcript Content</Label>
        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          required
        />
      </FormGroup>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <ButtonGroup>
        <SampleButton
          type="button"
          onClick={loadSampleTranscript}
          disabled={isLoading}
        >
          Load sample transcript
        </SampleButton>
        
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Generate Tweets'}
        </SubmitButton>
      </ButtonGroup>
    </Form>
  );
};

export default TranscriptForm; 