import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { UiInitFnOptions } from 'remiz';

import { EngineProvider } from './providers';
import { App } from './app';

let root: Root | undefined;

export function onInit(options: UiInitFnOptions): void {
  const rootNode = document.getElementById('ui-root');
  if (!rootNode) {
    return;
  }

  root = createRoot(rootNode);
  root.render(
    <EngineProvider context={options}>
      <App />
    </EngineProvider>,
  );
}

export function onDestroy(): void {
  if (root) {
    root.unmount();
    root = undefined;
  }
}
