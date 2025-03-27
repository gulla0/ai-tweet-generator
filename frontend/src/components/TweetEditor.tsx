// src/components/TweetEditor.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Tweet } from '../types';

// Styled components
const Overlay = styled.div`
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

const EditorContainer = styled.div`
  background-color: white;
  border-radius: var(--radius);
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EditorHeader = styled.div`
  margin-bottom: 1rem;
`;

const EditorTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
`;

const EditorForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  min-height: 120px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  }
`;

const CharacterCount = styled.div<{ isExceeded: boolean }>`
  text-align: right;
  font-size: 0.875rem;
  color: ${props => props.isExceeded ? 'var(--color-error)' : 'var(--color-text-light)'};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
`;

const CancelButton = styled(Button)`
  background-color: white;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  
  &:hover {
    background-color: var(--color-background);
  }
`;

const SaveButton = styled(Button)<{ disabled: boolean }>`
  background-color: var(--color-primary);
  border: none;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: var(--color-text-light);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 0.875rem;
  margin: 0;
`;

// Props interface
interface TweetEditorProps {
  tweet: Tweet;
  onSave: (content: string) => void;
  onCancel: () => void;
}

// Component
const TweetEditor: React.FC<TweetEditorProps> = ({ tweet, onSave, onCancel }) => {
  const [content, setContent] = useState(tweet.content);
  const [error, setError] = useState('');
  
  // Twitter character limit
  const MAX_CHARACTERS = 280;
  const charactersRemaining = MAX_CHARACTERS - content.length;
  const isExceeded = charactersRemaining < 0;
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate content
    if (!content.trim()) {
      setError('Tweet content cannot be empty');
      return;
    }
    
    if (content.length > MAX_CHARACTERS) {
      setError(`Tweet exceeds maximum character limit of ${MAX_CHARACTERS}`);
      return;
    }
    
    onSave(content);
  };
  
  return (
    <Overlay onClick={onCancel}>
      <EditorContainer onClick={(e) => e.stopPropagation()}>
        <EditorHeader>
          <EditorTitle>Edit Tweet</EditorTitle>
        </EditorHeader>
        
        <EditorForm onSubmit={handleSubmit}>
          <TextArea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError('');
            }}
            autoFocus
          />
          
          <CharacterCount isExceeded={isExceeded}>
            {charactersRemaining} characters remaining
          </CharacterCount>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ButtonGroup>
            <CancelButton type="button" onClick={onCancel}>
              Cancel
            </CancelButton>
            <SaveButton type="submit" disabled={isExceeded || !content.trim()}>
              Save
            </SaveButton>
          </ButtonGroup>
        </EditorForm>
      </EditorContainer>
    </Overlay>
  );
};

export default TweetEditor;