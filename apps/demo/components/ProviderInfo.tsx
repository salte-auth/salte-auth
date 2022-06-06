import { OAuth2Provider, OpenIDProvider, Provider } from '@salte-auth/salte-auth';
import classNames from 'classnames';
import { Fragment } from 'react';
import styles from './ProviderInfo.module.scss';

type ProviderInfoProps = {
  className?: string;
  provider: Provider;
};

const row = (header, info) => {
  return (
    <Fragment key={header}>
      <b>{header}</b>
      <code className={styles.code}>
        {info}
      </code>
    </Fragment>
  );
}

export function ProviderInfo({
  className,
  provider,
}: ProviderInfoProps) {
  if (!provider || !(provider instanceof Provider)) return null;

  const rows = [
    row('Name', provider.$name)
  ];

  if (provider instanceof OpenIDProvider) {
    rows.push(row('ID Token', JSON.stringify(provider.idToken, null, 2)));
    rows.push(row('Access Token', JSON.stringify(provider.accessToken, null, 2)));
  } else if (provider instanceof OAuth2Provider) {
    rows.push(row('Code', provider.code || 'N/A'));
    rows.push(row('Access Token', JSON.stringify(provider.accessToken, null, 2)));
  }

  return (
    <div className={classNames(
      styles.providerInfo,
      className,
    )}>
      <h2 className={styles.header}>{provider.constructor.name} Provider Info</h2>
      {rows}
    </div>
  )
}
