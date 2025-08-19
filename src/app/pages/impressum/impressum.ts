import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './impressum.html',
  styleUrls: ['./impressum.css']
})
export class ImpressumComponent implements OnInit {
  
  // Firmendaten
  companyData = {
    name: 'Deniz Tüzün',
    title: 'Immobiliardarlehensvertreter und Darlehensvertreter',
    street: 'Neuenkamp 16',
    zipCode: '29229',
    city: 'Celle',
    country: 'Deutschland',
    phone: '+49 152 52031092',
    email: 'info@baufi-tuezuen.de',
    website: 'https://www.baufi-tuezuen.de',
    taxId: '17/144/0778', // Steuernummer
  };

  // Aufsichtsbehörde und Registrierung
  regulatoryData = {
    // IHK / Gewerbeaufsicht
    authority: 'Ombudsleute / Schlichtungsstelle', // BITTE ANPASSEN
    authorityAddress: 'Glockengießerwall 2, 20095 Hamburg', // BITTE ANPASSEN
    authorityWebsite: 'https://www.schlichtung-finanzberatung.de', // BITTE ANPASSEN
    
    // Erlaubnis nach § 34c/34i GewO
    permitType: '§ 34c GewO (Immobiliardarlehensvermittler) und § 34i GewO (Finanzanlagenvermittler)',
    permitNumber: 'XXXX-XXXX-XXXX', // BITTE EINTRAGEN
    
    // Vermittlerregister
    registerName: 'Vermittlerregister',
    registerNumber: 'D-W-151-1HHR-44', // BITTE EINTRAGEN
    registerWebsite: 'https://www.vermittlerregister.info',
    
    // Berufskammer
    chamber: 'Industrie- und Handelskammer'
  };

  // Berufshaftpflichtversicherung
  insuranceData = {
    company: 'VHV Versicherungen', // BITTE EINTRAGEN
    address: 'VHV-Platz 1, 30177 Hannover', // BITTE EINTRAGEN
    scope: 'Bundesrepublik Deutschland und EU',
    coverageAmount: 'gemäß gesetzlichen Vorgaben'
  };

  // Streitschlichtung
  disputeResolution = {
    platform: 'https://www.schlichtung-finanzberatung.de/',
    willingToParticipate: false,
    email: 'info@baufi-tuezuen.de'
  };

  // Social Media (falls vorhanden)
  socialMedia = {
    facebook: '',
    linkedin: '',
    xing: ''
  };

  // Sections für Navigation
  sections = [
    { id: 'angaben', title: 'Angaben gemäß § 5 TMG', icon: '📋' },
    { id: 'kontakt', title: 'Kontakt', icon: '📞' },
    { id: 'aufsicht', title: 'Aufsichtsbehörde', icon: '🏛️' },
    { id: 'berufsrecht', title: 'Berufsrechtliche Regelungen', icon: '⚖️' },
    { id: 'haftpflicht', title: 'BHV', icon: '🛡️' },
    { id: 'streitschlichtung', title: 'Streitschlichtung', icon: '🤝' },
    { id: 'haftung', title: 'Haftungsausschluss', icon: '⚠️' },
    { id: 'urheberrecht', title: 'Urheberrecht', icon: '©' }
  ];

  activeSection: string = '';
  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
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
      const offset = 100;
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

  // E-Mail kopieren
  copyEmail(): void {
    navigator.clipboard.writeText(this.companyData.email).then(() => {
      // Optional: Feedback anzeigen
      const button = document.querySelector('.copy-btn');
      if (button) {
        button.textContent = 'Kopiert!';
        setTimeout(() => {
          button.textContent = 'E-Mail kopieren';
        }, 2000);
      }
    });
  }

  // Telefonnummer kopieren
  copyPhone(): void {
    navigator.clipboard.writeText(this.companyData.phone).then(() => {
      // Optional: Feedback anzeigen
      const button = document.querySelector('.copy-phone-btn');
      if (button) {
        button.textContent = 'Kopiert!';
        setTimeout(() => {
          button.textContent = 'Nummer kopieren';
        }, 2000);
      }
    });
  }

  // Drucken
  printDocument(): void {
    window.print();
  }

  // vCard Download (Kontakt speichern)
  downloadVCard(): void {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${this.companyData.name}
ORG:Baufi Tüzün
TITLE:${this.companyData.title}
TEL;TYPE=WORK:${this.companyData.phone}
EMAIL:${this.companyData.email}
ADR;TYPE=WORK:;;${this.companyData.street};${this.companyData.city};;${this.companyData.zipCode};${this.companyData.country}
URL:${this.companyData.website}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deniz-tuezuen.vcf';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}