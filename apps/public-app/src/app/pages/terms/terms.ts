import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms.html',
  styleUrl: './terms.scss',
})
export class Terms {
  effectiveDate = '23 February 2026';
}
