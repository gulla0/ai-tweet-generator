// src/components/Header.tsx
import React from 'react';
import styled from 'styled-components';

// Styled components
const HeaderContainer = styled.header`
  background-color: var(--color-primary);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

// Header props
interface HeaderProps {
  onLogout: () => void;
}

// Header component
const Header = ({ onLogout }: HeaderProps) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>DAO Tweet Generator</Logo>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;