import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  TransferState,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { APP_VERSION, APP_VERSION_STATE_KEY } from './app-version';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    {
      provide: APP_VERSION,
      useFactory: (transferState: TransferState) =>
        transferState.get(APP_VERSION_STATE_KEY, 'dev'),
      deps: [TransferState],
    },
  ],
};
