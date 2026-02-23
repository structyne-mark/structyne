import { InjectionToken, makeStateKey } from '@angular/core';

export const APP_VERSION = new InjectionToken<string>('APP_VERSION');
export const APP_VERSION_STATE_KEY = makeStateKey<string>('APP_VERSION');
