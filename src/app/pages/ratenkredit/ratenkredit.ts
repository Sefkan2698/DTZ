import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ratenkredit',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ratenkredit.html',
  styleUrl: './ratenkredit.css'
})
export class RatenkreditComponent {
  companyName = 'DTZ';

  constructor() {
    // Komponente initialisiert - bereit für zukünftige Erweiterungen
  }

  scrollToCalculator(): void {
    document.getElementById('calculator')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
}