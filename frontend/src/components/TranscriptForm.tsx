// src/components/TranscriptForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';

// Styled components
const Container = styled.div`
  background-color: white;
  border-radius: var(--radius);
  padding: 2rem;
  box-shadow: var(--shadow);
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: var(--color-text);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-text);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 1rem;
  min-height: 300px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  
  &:hover:not(:disabled) {
    background-color: var(--color-background);
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

// TranscriptForm component
const TranscriptForm = () => {
  const { state, createTranscript, getSampleTranscript } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  
  // Set default date to today on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter transcript content');
      return;
    }
    
    setError('');
    
    try {
      await createTranscript({
        title: title.trim(),
        date,
        content: content.trim()
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create transcript');
    }
  };
  
  // Load sample transcript
  const handleLoadSample = async () => {
    try {
      const sampleContent = await getSampleTranscript();
      setContent(sampleContent);
      
      if (!title) {
        setTitle('Sample DAO Governance Meeting');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load sample transcript');
    }
  };
  
  return (
    <Container>
      <Title>Create New Transcript</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Meeting Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Monthly DAO Governance Call"
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
        
        {(error || state.error) && (
          <ErrorMessage>{error || state.error}</ErrorMessage>
        )}
        
        <ButtonGroup>
          <SecondaryButton
            type="button"
            onClick={handleLoadSample}
            disabled={state.isLoading}
          >
            Load Sample Transcript
          </SecondaryButton>
          
          <PrimaryButton
            type="submit"
            disabled={state.isLoading}
          >
            {state.isLoading ? 'Processing...' : 'Generate Tweets'}
          </PrimaryButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default TranscriptForm;