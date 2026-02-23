import { Route } from '@angular/router';
import { Home } from './pages/home/home';
import { Terms } from './pages/terms/terms';
import { Privacy } from './pages/privacy/privacy';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
    title: 'Structyne — We build software people love to use',
    data: {
      description:
        'Structyne builds SaaS products from concept to launch. Design, engineering, and delivery — all in one studio.',
      ogTitle: 'Structyne — We build software people love to use',
      canonicalPath: '/',
    },
  },
  {
    path: 'terms',
    component: Terms,
    title: 'Terms of Service — Structyne',
    data: {
      description:
        'Terms governing access to and use of Structyne services and products.',
      ogTitle: 'Terms of Service — Structyne',
      canonicalPath: '/terms',
    },
  },
  {
    path: 'privacy',
    component: Privacy,
    title: 'Privacy Policy — Structyne',
    data: {
      description:
        'How Structyne Inc. collects, uses, and protects your personal information.',
      ogTitle: 'Privacy Policy — Structyne',
      canonicalPath: '/privacy',
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
