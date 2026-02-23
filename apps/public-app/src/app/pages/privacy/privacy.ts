import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marked } from 'marked';
import { PRIVACY_MD } from './privacy-content.md';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy {
  year = new Date().getFullYear();
  effectiveDate = '23 February 2026';
  body = marked.parse(PRIVACY_MD) as string;
}
