import './_styles.css';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

import { useSalteAuth } from '../utils/use-salte-auth';
import { ProviderInfo } from '../components/ProviderInfo';
import { RadioGroup, RadioGroupOptions } from '../components/RadioGroup';
import { Button } from '../components/Button';
import { OpenIDProvider } from '@salte-auth/salte-auth';

const PROVIDER_STORAGE = 'salte-auth.demo.provider';

export function App() {
  const auth = useSalteAuth();
  const [providerOptions, setProviderOptions] = useState<RadioGroupOptions>();
  const [provider, setProvider] = useState<string|null>();

  const updateProvider = (provider) => {
    if (provider) {
      localStorage.setItem(PROVIDER_STORAGE, provider);
    } else {
      localStorage.removeItem(PROVIDER_STORAGE);
    }

    setProvider(provider);
  };

  useEffect(() => {
    if (!auth) return;

    auth.on('login', (error, data) => {
      if (error) console.error(error);
      else console.log(data);
    });

    setProvider(localStorage.getItem(PROVIDER_STORAGE) || null);

    setProviderOptions(auth.config.providers.reduce((output, provider) => ({
      ...output,
      [provider.$name]: `${provider.constructor.name.replace(/\$\d+$/, '')} ${provider instanceof OpenIDProvider ? '(OpenID)' : '(OAuth2)'}`
    }), {}))
  }, [auth]);

  return (
    <div>
      <h1 className={styles.header}>Salte Auth Demo App</h1>
      <div className={styles.buttons}>
        <Button
          disabled={!auth || !provider}
          onClick={() => {
            if (!auth) return;

            auth.login(provider);
          }}
        >
          Login
        </Button>
        <Button
          disabled={!auth || !provider || !auth.provider(provider).logout}
          onClick={() => {
            if (!auth) return;

            auth.logout(provider);
          }}
        >
          Logout
        </Button>
      </div>
      <RadioGroup
        className={styles.providers}
        optionsClassName={styles.providersOptions}
        name="provider"
        options={providerOptions}
        value={provider}
        onChange={(value) => updateProvider(value)}
      />
      {auth && (
        <ProviderInfo
          className={styles.providerInfo}
          provider={provider && auth.provider(provider)}
        />
      )}
    </div>
  );
}

export default App;
