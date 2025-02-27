import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <mat-toolbar color="accent" class="app-footer">
      <span
        >&copy; {{ currentYear }} Rick & Morty App. All rights reserved.</span
      >
    </mat-toolbar>
  `,
  styles: [
    `
      .app-footer {
        justify-content: center;
        font-size: 0.9rem;
      }
    `,
  ],
  imports: [CommonModule, MatToolbarModule],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
