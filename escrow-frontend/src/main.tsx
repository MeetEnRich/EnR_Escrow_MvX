import { createRoot } from 'react-dom/client';
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import App from './App';
import './index.css';

const config = {
  storage: {
    getStorageCallback: () => sessionStorage
  },
  dAppConfig: {
    environment: EnvironmentsEnum.devnet,
    nativeAuth: {
      expirySeconds: 86400,
      tokenExpirationToastWarningSeconds: 300
    }
  }
};

initApp(config).then(() => {
  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);
});
