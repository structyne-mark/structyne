import { Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { DOCUMENT } from '@angular/common';

const BASE_URL = 'https://structyne.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);

  init(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => this.updateTags(data));
  }

  private updateTags(data: Record<string, string>): void {
    const description = data['description'];
    const ogTitle = data['ogTitle'];
    const canonicalPath = data['canonicalPath'];

    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({
        property: 'og:description',
        content: description,
      });
      this.meta.updateTag({
        name: 'twitter:description',
        content: description,
      });
    }

    if (ogTitle) {
      this.meta.updateTag({ property: 'og:title', content: ogTitle });
      this.meta.updateTag({ name: 'twitter:title', content: ogTitle });
    }

    if (canonicalPath != null) {
      const fullUrl = `${BASE_URL}${canonicalPath}`;
      this.meta.updateTag({ property: 'og:url', content: fullUrl });

      const link = this.document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      if (link) {
        link.href = fullUrl;
      }
    }
  }
}
