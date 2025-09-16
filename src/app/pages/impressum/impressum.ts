import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './impressum.html',
  styleUrls: ['./impressum.css']
})
export class ImpressumComponent implements OnInit, OnDestroy {
  
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
    taxId: '17/144/0778'
  };

  // Aufsichtsbehörde und Registrierung
  regulatoryData = {
    authority: 'Ombudsleute / Schlichtungsstelle',
    authorityAddress: 'Glockengießerwall 2, 20095 Hamburg',
    authorityWebsite: 'https://www.schlichtung-finanzberatung.de',
    permitType: '§ 34c GewO (Immobiliardarlehensvermittler) und § 34i GewO (Finanzanlagenvermittler)',
    permitNumber: 'XXXX-XXXX-XXXX',
    registerName: 'Vermittlerregister',
    registerNumber: 'D-W-151-1HHR-44',
    registerWebsite: 'https://www.vermittlerregister.info',
    chamber: 'Industrie- und Handelskammer'
  };

  // Berufshaftpflichtversicherung
  insuranceData = {
    company: 'VHV Versicherungen',
    address: 'VHV-Platz 1, 30177 Hannover',
    scope: 'Bundesrepublik Deutschland und EU',
    coverageAmount: 'gemäß gesetzlichen Vorgaben'
  };

  // Streitschlichtung
  disputeResolution = {
    platform: 'https://www.schlichtung-finanzberatung.de/',
    willingToParticipate: false,
    email: 'info@baufi-tuezuen.de'
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
    // Initialization
  }

  ngOnDestroy(): void {
    // Cleanup
  }

  // Scroll zu Section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      this.activeSection = sectionId;
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
    this.copyToClipboard(this.companyData.email, 'E-Mail kopiert!');
  }

  // Telefonnummer kopieren
  copyPhone(): void {
    this.copyToClipboard(this.companyData.phone, 'Telefonnummer kopiert!');
  }

  // Universelle Copy-Funktion
  private copyToClipboard(text: string, message: string): void {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        this.showNotification(message);
      }).catch(() => {
        this.fallbackCopy(text, message);
      });
    } else {
      this.fallbackCopy(text, message);
    }
  }

  // Fallback Copy-Methode
  private fallbackCopy(text: string, message: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showNotification(message);
      } else {
        alert('Kopieren fehlgeschlagen. Text: ' + text);
      }
    } catch (err) {
      alert('Kopieren fehlgeschlagen. Bitte manuell kopieren: ' + text);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  // Notification anzeigen
  private showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-weight: 600;
      font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // vCard Download
  downloadVCard(): void {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${this.companyData.name}
ORG:${this.companyData.name} Darlehensvermittlung
TITLE:${this.companyData.title}
TEL:${this.companyData.phone}
EMAIL:${this.companyData.email}
ADR:;;${this.companyData.street};${this.companyData.city};;${this.companyData.zipCode};${this.companyData.country}
URL:${this.companyData.website}
END:VCARD`;

    try {
      const blob = new Blob([vcard], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = 'deniz-tuezuen.vcf';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      this.showNotification('vCard wurde heruntergeladen!');
    } catch (error) {
      alert('vCard Download fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  }

  // Drucken
  printDocument(): void {
    window.print();
  }

  // Scroll Event Handler
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Scroll to top button visibility
    const scrollBtn = document.querySelector('.scroll-top-btn') as HTMLElement;
    if (scrollBtn) {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }

    // Update active section
    const scrollPosition = window.pageYOffset + 150;
    
    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        
        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }
}