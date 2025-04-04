// src/components/LoginPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';

// Styled components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const EntryCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

const Button = styled.button`
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: var(--color-secondary);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 0.875rem;
`;

const Hint = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-light);
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OptionalTag = styled.span`
  font-size: 0.75rem;
  font-weight: normal;
  color: var(--color-text-light);
  background-color: var(--color-background, #F3F4F6);
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: var(--color-text-light);
`;

const ValidationButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: var(--color-secondary, #9CA3AF);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: var(--color-secondary-dark, #6B7280);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ValidationStatus = styled.div<{ status: 'success' | 'error' | 'neutral' }>`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background-color: ${props => 
    props.status === 'success' 
      ? '#D1FAE5' 
      : props.status === 'error' 
        ? '#FEE2E2' 
        : '#F3F4F6'
  };
  
  color: ${props => 
    props.status === 'success' 
      ? '#047857' 
      : props.status === 'error' 
        ? '#B91C1C' 
        : '#374151'
  };
`;

const StatusDot = styled.div<{ status: 'success' | 'error' | 'neutral' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => 
    props.status === 'success' 
      ? '#10B981' 
      : props.status === 'error' 
        ? '#EF4444' 
        : '#9CA3AF'
  };
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  padding: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  text-decoration: underline;
  
  &:hover {
    color: var(--color-primary-dark);
  }
`;

// Entry Page component (formerly LoginPage)
const EntryPage = () => {
  const { state, enterApp } = useAppContext();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [accessSecret, setAccessSecret] = useState('');
  const [error, setError] = useState('');
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | 'neutral'>('neutral');
  const [validationMessage, setValidationMessage] = useState('Credentials not validated');
  const [isValidating, setIsValidating] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Create X credentials object if all fields are filled
      const hasAllCredentials = apiKey && apiSecret && accessToken && accessSecret;
      
      const xCredentials = hasAllCredentials ? {
        apiKey,
        apiSecret,
        accessToken,
        accessSecret
      } : undefined;
      
      // Enter app with X credentials (or undefined if not all provided)
      await enterApp(xCredentials);
    } catch (err: any) {
      setError(err.message || 'Failed to enter app');
    }
  };
  
  const handleSkip = async () => {
    try {
      await enterApp();
    } catch (err: any) {
      setError(err.message || 'Failed to enter app');
    }
  };
  
  const validateCredentials = async () => {
    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      setValidationStatus('error');
      setValidationMessage('All credential fields must be filled');
      return;
    }
    
    setIsValidating(true);
    setValidationStatus('neutral');
    setValidationMessage('Validating...');
    
    try {
      const xCredentials = {
        apiKey,
        apiSecret,
        accessToken,
        accessSecret
      };
      
      const response = await api.validateXCreds(xCredentials);
      
      if (response.isValid) {
        setValidationStatus('success');
        setValidationMessage('Credentials are valid');
      } else {
        setValidationStatus('error');
        setValidationMessage('Credentials are invalid');
      }
    } catch (err: any) {
      setValidationStatus('error');
      setValidationMessage(err.message || 'Failed to validate credentials');
    } finally {
      setIsValidating(false);
    }
  };
  
  const hasCredentials = apiKey && apiSecret && accessToken && accessSecret;
  
  return (
    <Container>
      <EntryCard>
        <Title>DAO Tweet Generator</Title>
        <Form onSubmit={handleSubmit}>
          <SectionTitle>
            X (Twitter) Credentials
            <OptionalTag>Optional</OptionalTag>
          </SectionTitle>
          
          <SectionDescription>
            Enter your X API credentials to enable real tweet posting. You can also add or update these later.
          </SectionDescription>
          
          <FormGroup>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Optional X API Key"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Optional X API Secret"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              type="text"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Optional X Access Token"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="accessSecret">Access Token Secret</Label>
            <Input
              id="accessSecret"
              type="password"
              value={accessSecret}
              onChange={(e) => setAccessSecret(e.target.value)}
              placeholder="Optional X Access Token Secret"
            />
          </FormGroup>
          
          <ValidationButton 
            type="button" 
            onClick={validateCredentials} 
            disabled={!hasCredentials || isValidating}
          >
            {isValidating ? 'Validating...' : 'Test Credentials'}
          </ValidationButton>
          
          {validationStatus !== 'neutral' && (
            <ValidationStatus status={validationStatus}>
              <StatusDot status={validationStatus} />
              {validationMessage}
            </ValidationStatus>
          )}
          
          {(error || state.error) && (
            <ErrorMessage>{error || state.error}</ErrorMessage>
          )}
          
          <Button type="submit" disabled={state.isLoading}>
            {state.isLoading ? 'Entering...' : 'Enter with Credentials'}
          </Button>
          
          <SkipButton type="button" onClick={handleSkip}>
            Skip and enter without X credentials
          </SkipButton>
        </Form>
        
        <Hint>
          Without valid X credentials, tweets will be simulated instead of posted to X.
        </Hint>
      </EntryCard>
    </Container>
  );
};

export default EntryPage;