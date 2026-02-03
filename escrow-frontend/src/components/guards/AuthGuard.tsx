import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isLoggedIn) {
        navigate('/');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate]);

  if (isChecking) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Loading...</div>;
  }

  return isLoggedIn ? <>{children}</> : null;
}
