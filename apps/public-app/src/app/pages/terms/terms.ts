import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marked } from 'marked';
import { TERMS_MD } from './terms-content.md';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms.html',
  styleUrl: './terms.scss',
})
export class Terms {
  year = new Date().getFullYear();
  effectiveDate = '23 February 2026';
  body = marked.parse(TERMS_MD) as string;
}
