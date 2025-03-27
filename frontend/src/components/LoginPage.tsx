// src/components/LoginPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';

// Styled components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const LoginCard = styled.div`
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

// Login Page component
const LoginPage = () => {
  const { state, login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };
  
  return (
    <Container>
      <LoginCard>
        <Title>DAO Tweet Generator</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          {(error || state.error) && (
            <ErrorMessage>{error || state.error}</ErrorMessage>
          )}
          
          <Button type="submit" disabled={state.isLoading}>
            {state.isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        
        <Hint>
          Default credentials: admin@example.com / admin123
        </Hint>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;