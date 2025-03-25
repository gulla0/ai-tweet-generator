import styled from 'styled-components';
import LoginForm from '../components/LoginForm';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7fafc;
`;

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  return (
    <Container>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </Container>
  );
};

export default LoginPage; 