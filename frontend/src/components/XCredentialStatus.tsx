import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';

interface XCredentialStatusProps {
  onOpenSettings: () => void;
}

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const StatusDot = styled.div<{ status: 'null' | 'valid' | 'invalid' }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${props => 
    props.status === 'null' 
      ? 'var(--color-secondary, #9CA3AF)' 
      : props.status === 'valid' 
        ? 'var(--color-success, #10B981)' 
        : 'var(--color-error, #EF4444)'
  };
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Label = styled.span`
  margin-right: 0.25rem;
`;

export const XCredentialStatus: React.FC<XCredentialStatusProps> = ({ onOpenSettings }) => {
  const { state } = useAppContext();
  const { xCredentialsValid } = state;
  
  const status = xCredentialsValid === null 
    ? 'null' 
    : xCredentialsValid 
      ? 'valid' 
      : 'invalid';
  
  const title = xCredentialsValid === null
    ? 'X credentials not set'
    : xCredentialsValid
      ? 'X credentials valid'
      : 'X credentials invalid';
      
  const label = xCredentialsValid === null
    ? 'No X Credentials'
    : xCredentialsValid
      ? 'X Credentials: Valid'
      : 'X Credentials: Invalid';

  return (
    <StatusContainer>
      <StatusWrapper onClick={onOpenSettings} title="Click to update X credentials">
        <StatusDot status={status} title={title} />
        <Label>{label}</Label>
        <SettingsButton title="X API Settings">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </SettingsButton>
      </StatusWrapper>
    </StatusContainer>
  );
}; 