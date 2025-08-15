import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './datenschutz.html',
  styleUrls: ['./datenschutz.css']
})
export class DatenschutzComponent implements OnInit {
  
  // Datum der letzten Aktualisierung
  lastUpdated: string = '13. August 2025';
  
  // Kontaktdaten
  companyData = {
    name: 'Deniz Tüzün',
    title: 'Immobiliendarlehensvertreter und Darlehensvertreter',
    street: 'Neuenkamp 16',
    zipCode: '29229',
    city: 'Celle',
    email: 'info@baufi-tuezuen.de',
    phone: '+49 152 52031092',
    website: 'https://www.baufi-tuezuen.de'
  };

  // Navigation Sections
  sections = [
    { id: 'verantwortlicher', title: 'Verantwortlicher' },
    { id: 'uebersicht', title: 'Übersicht der Verarbeitungen' },
    { id: 'rechtsgrundlagen', title: 'Maßgebliche Rechtsgrundlagen' },
    { id: 'sicherheit', title: 'Sicherheitsmaßnahmen' },
    { id: 'datenarten', title: 'Verarbeitete Datenarten' },
    { id: 'betroffene', title: 'Kategorien betroffener Personen' },
    { id: 'zwecke', title: 'Zwecke der Verarbeitung' },
    { id: 'empfaenger', title: 'Empfänger' },
    { id: 'hosting', title: 'Hosting und Content-Delivery' },
    { id: 'kontakt', title: 'Kontaktaufnahme' },
    { id: 'webanalyse', title: 'Webanalyse und Optimierung' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'rechte', title: 'Rechte der betroffenen Personen' },
    { id: 'begriffe', title: 'Begriffsdefinitionen' }
  ];

  // Aktiver Abschnitt für Navigation
  activeSection: string = '';

  constructor() { }

  ngOnInit(): void {
    // Scroll-Listener für aktive Section
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', () => this.handleScroll());
  }

  // Scroll zu Section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset für Fixed Header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Handle Scroll für aktive Section
  private handleScroll(): void {
    const scrollPosition = window.pageYOffset + 150;
    
    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const { top, bottom } = element.getBoundingClientRect();
        const elementTop = top + window.pageYOffset;
        const elementBottom = bottom + window.pageYOffset;
        
        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  // Nach oben scrollen
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // E-Mail verschleiern (Anti-Spam)
  getEmail(): string {
    return this.companyData.email;
  }

  // Drucken
  printDocument(): void {
    window.print();
  }
}