import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #4299e1;
  color: white;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: white;
  border: 1px solid white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  return (
    <HeaderContainer>
      <Logo>AI Tweet Generator</Logo>
      <LogoutButton onClick={onLogout}>Logout</LogoutButton>
    </HeaderContainer>
  );
};

export default Header; 