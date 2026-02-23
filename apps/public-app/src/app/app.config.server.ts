import {
  mergeApplicationConfig,
  ApplicationConfig,
  makeStateKey,
  TransferState,
} from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { APP_VERSION, APP_VERSION_STATE_KEY } from './app-version';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: APP_VERSION,
      useFactory: (transferState: TransferState) => {
        const version = process.env['APP_VERSION'] || 'dev';
        transferState.set(APP_VERSION_STATE_KEY, version);
        return version;
      },
      deps: [TransferState],
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
