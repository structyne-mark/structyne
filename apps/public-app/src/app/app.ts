import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from './seo.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    inject(SeoService).init();
  }
}
