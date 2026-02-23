import { Component, inject, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from './seo.service';
import { APP_VERSION } from './app-version';

@Component({
  imports: [RouterModule],
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
