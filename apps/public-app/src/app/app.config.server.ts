import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { APP_VERSION } from './app-version';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: APP_VERSION, useValue: process.env['APP_VERSION'] || 'dev' },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
