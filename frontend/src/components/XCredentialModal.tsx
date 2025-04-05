import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { XCredentialType } from '../types';

interface XCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: var(--radius, 0.25rem);
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text, #1F2937);
`;

const ModalDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-light, #6B7280);
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: #FEE2E2;
  border: 1px solid #F87171;
  color: #B91C1C;
  padding: 0.75rem 1rem;
  border-radius: var(--radius, 0.25rem);
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text, #1F2937);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border, #D1D5DB);
  border-radius: var(--radius, 0.25rem);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary, #3B82F6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--radius, 0.25rem);
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #E5E7EB;
  color: #374151;
  border: none;
  
  &:hover {
    background-color: #D1D5DB;
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--color-primary, #3B82F6);
  color: white;
  border: none;
  
  &:hover {
    background-color: #2563EB;
  }
`;

const StatusNote = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-light, #6B7280);
  background-color: #F3F4F6;
  padding: 0.75rem;
  border-radius: var(--radius, 0.25rem);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-left: 3px solid var(--color-primary, #3B82F6);
`;

export const XCredentialModal: React.FC<XCredentialModalProps> = ({ isOpen, onClose }) => {
  const { state, updateXCredentials } = useAppContext();
  const [credentials, setCredentials] = useState<XCredentialType>({
    apiKey: state.xCredentials?.apiKey || '',
    apiSecret: state.xCredentials?.apiSecret || '',
    accessToken: state.xCredentials?.accessToken || '',
    accessSecret: state.xCredentials?.accessSecret || ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await updateXCredentials(credentials);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to update X credentials');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>X API Credentials</ModalTitle>
        <ModalDescription>
          Update your X API credentials to enable sending real tweets. 
          You can get these from the X Developer Portal.
        </ModalDescription>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>API Key</Label>
            <Input
              type="text"
              value={credentials.apiKey}
              onChange={e => setCredentials({ ...credentials, apiKey: e.target.value })}
              required
              placeholder="Enter X API Key"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>API Secret</Label>
            <Input
              type="password"
              value={credentials.apiSecret}
              onChange={e => setCredentials({ ...credentials, apiSecret: e.target.value })}
              required
              placeholder="Enter X API Secret"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Access Token</Label>
            <Input
              type="text"
              value={credentials.accessToken}
              onChange={e => setCredentials({ ...credentials, accessToken: e.target.value })}
              required
              placeholder="Enter X Access Token"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Access Token Secret</Label>
            <Input
              type="password"
              value={credentials.accessSecret}
              onChange={e => setCredentials({ ...credentials, accessSecret: e.target.value })}
              required
              placeholder="Enter X Access Token Secret"
            />
          </FormGroup>
          
          <StatusNote>
            The color indicator in the header will show green if your credentials are valid, 
            or red if they're invalid. <strong>Valid X credentials are now required to post tweets.
            You will not be able to send tweets without providing valid credentials.</strong>
          </StatusNote>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SaveButton type="submit">
              Save & Validate
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
}; 