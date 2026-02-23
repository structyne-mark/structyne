import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from './seo.service';
import { APP_VERSION } from './app-version';
import { NavBar } from './shared/nav-bar/nav-bar';
import { SiteFooter } from './shared/site-footer/site-footer';

@Component({
  imports: [RouterModule, NavBar, SiteFooter],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: { '[attr.app-version]': 'version' },
})
export class App {
  protected version = inject(APP_VERSION);

  constructor() {
    inject(SeoService).init();
  }
}
