import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { getArguments, getSummary } from './loader';

whenOdysseyLoaded.then(() => {
  const [el] = selectMounts('app');
  const args = getArguments();
  const summary = getSummary();

  if (!el || !args || !summary) {
    return;
  }

  render(<App args={args} summary={summary} />, el);
});
