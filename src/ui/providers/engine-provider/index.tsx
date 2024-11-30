import React, { FC } from 'react';
import type { UiInitFnOptions } from 'remiz';

interface EngineProviderProps {
  context: UiInitFnOptions
  children: JSX.Element | Array<JSX.Element>
}

export const EngineContext = React.createContext<UiInitFnOptions>({} as UiInitFnOptions);

export const EngineProvider: FC<EngineProviderProps> = ({ context, children }): JSX.Element => (
  <EngineContext.Provider value={context}>
    {children}
  </EngineContext.Provider>
);
