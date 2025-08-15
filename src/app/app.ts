import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { CookieBannerComponent } from './shared/components/cookie-banner/cookie-banner';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
import { WhatsappButton } from './shared/components/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CookieBannerComponent, HeaderComponent, FooterComponent, WhatsappButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'DTZ';
  @ViewChild(CookieBannerComponent) cookieBanner!: CookieBannerComponent;

  constructor(
    private router: Router,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit() {
    // Setze Default Meta-Tags
    this.setDefaultMetaTags();

    // Lausche auf Route-Änderungen und update Meta-Tags
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateMetaTagsBasedOnRoute(event.url);
      
      // Scroll to top bei Route-Wechsel
      window.scrollTo(0, 0);
    });
  }

  private setDefaultMetaTags(): void {
    // Standard Meta-Tags die auf allen Seiten gelten
    this.meta.addTag({ name: 'author', content: 'Deniz Tüzün' });
    this.meta.addTag({ name: 'robots', content: 'index, follow' });
    this.meta.addTag({ name: 'language', content: 'de' });
    this.meta.addTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
    
    // Open Graph Defaults
    this.meta.addTag({ property: 'og:type', content: 'website' });
    this.meta.addTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.addTag({ property: 'og:site_name', content: 'Deniz Tüzün Finanzberatung' });
    this.meta.addTag({ property: 'og:image', content: 'https://www.baufi-tuezuen.de/logo.png' });
    

    
    // Geo Tags für lokale SEO
    this.meta.addTag({ name: 'geo.region', content: 'DE-NI' });
    this.meta.addTag({ name: 'geo.placename', content: 'Celle' });
    this.meta.addTag({ name: 'geo.position', content: '52.6225;10.0805' });
    this.meta.addTag({ name: 'ICBM', content: '52.6225, 10.0805' });
  }

  private updateMetaTagsBasedOnRoute(url: string): void {
    // Entferne Query-Parameter und Fragmente
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Update Meta-Tags basierend auf der Route
    switch(cleanUrl) {
      case '/':
        this.titleService.setTitle('Deniz Tüzün - Baufinanzierung & Ratenkredite | Unabhängige Finanzberatung Celle');
        this.meta.updateTag({ 
          name: 'description', 
          content: 'Deniz Tüzün - Ihr unabhängiger Finanzberater für Baufinanzierung & Ratenkredite in Celle. ✓ Über 450 Banken im Vergleich ✓ Bundesweite Beratung ✓ Top-Konditionen' 
        });
        this.meta.updateTag({ 
          name: 'keywords', 
          content: 'Deniz Tüzün, Deniz Tuezuen, Baufinanzierung, Immobiliendarlehen, Ratenkredite, Finanzberatung, Finanzierung Celle, Darlehensvermittler' 
        });
        this.meta.updateTag({ property: 'og:title', content: 'Deniz Tüzün - Baufinanzierung & Ratenkredite | Unabhängige Finanzberatung' });
        this.meta.updateTag({ property: 'og:url', content: 'https://www.baufi-tuezuen.de' });
        this.updateCanonicalUrl('https://www.baufi-tuezuen.de');
        break;
        
      case '/baufinanzierung':
        this.titleService.setTitle('Baufinanzierung Celle - Immobiliendarlehen | Deniz Tüzün Finanzberatung');
        this.meta.updateTag({ 
          name: 'description', 
          content: 'Baufinanzierung mit Top-Konditionen von Deniz Tüzün. ✓ Über 800 Banken ✓ Zinsbindung bis 40 Jahre ✓ Kostenlose Beratung ✓ Bundesweit. Jetzt Angebot anfordern!' 
        });
        this.meta.updateTag({ 
          name: 'keywords', 
          content: 'Baufinanzierung, Immobiliendarlehen, Immobilienfinanzierung, Baukredit, Hausfinanzierung, Deniz Tüzün, Celle, Zinsbindung' 
        });
        this.meta.updateTag({ property: 'og:title', content: 'Baufinanzierung mit Top-Konditionen | Deniz Tüzün' });
        this.meta.updateTag({ property: 'og:url', content: 'https://www.baufi-tuezuen.de/baufinanzierung' });
        this.updateCanonicalUrl('https://www.baufi-tuezuen.de/baufinanzierung');
        break;
        
      case '/ratenkredite':
        this.titleService.setTitle('Ratenkredite im Vergleich - Über 60 Banken | Deniz Tüzün');
        this.meta.updateTag({ 
          name: 'description', 
          content: 'Ratenkreditvergleich mit über 60 Banken. ✓ Kleine Raten ✓ Flexible Laufzeiten ✓ Top-Zinsen ✓ 24-48h Bearbeitung. Kostenlose Beratung von Deniz Tüzün.' 
        });
        this.meta.updateTag({ 
          name: 'keywords', 
          content: 'Ratenkredite, Konsumentenkredit, Privatkredit, Kreditvergleich, Deniz Tüzün, Celle, günstige Kredite, Sofortkredit' 
        });
        this.meta.updateTag({ property: 'og:title', content: 'Ratenkredite im Vergleich | Deniz Tüzün' });
        this.meta.updateTag({ property: 'og:url', content: 'https://www.baufi-tuezuen.de/ratenkredit' });
        this.updateCanonicalUrl('https://www.baufi-tuezuen.de/ratenkredit');
        break;
        
      case '/contact':
      case '/kontakt':
        this.titleService.setTitle('Kontakt - Deniz Tüzün Finanzberatung Celle');
        this.meta.updateTag({ 
          name: 'description', 
          content: 'Kontaktieren Sie Deniz Tüzün für eine kostenlose Finanzberatung. ✓ Baufinanzierung ✓ Ratenkredite ✓ Standort Celle ✓ Bundesweite Beratung' 
        });
        this.meta.updateTag({ property: 'og:title', content: 'Kontakt | Deniz Tüzün Finanzberatung' });
        this.meta.updateTag({ property: 'og:url', content: 'https://www.baufi-tuezuen.de/contact' });
        this.updateCanonicalUrl('https://www.baufi-tuezuen.de/contact');
        break;
        
      case '/impressum':
        this.titleService.setTitle('Impressum - Deniz Tüzün Finanzberatung');
        this.meta.updateTag({ name: 'robots', content: 'noindex, follow' }); // Impressum nicht indexieren
        this.updateCanonicalUrl('https://www.baufi-tuezuen.de/impressum');
        break;
        
      case '/datenschutz':
        this.titleService.setTitle('Datenschutz - Deniz Tüzün Finanzberatung');
        this.meta.updateTag({ name: 'robots', content: 'noindex, follow' }); // Datenschutz nicht indexieren
        this.updateCanonicalUrl('https://www.baufi-tuezuen.de/datenschutz');
        break;
        
      default:
        // Fallback für nicht definierte Routen
        this.titleService.setTitle('Deniz Tüzün Finanzberatung - Baufinanzierung & Ratenkredite');
        this.meta.updateTag({ 
          name: 'description', 
          content: 'Unabhängige Finanzberatung von Deniz Tüzün. Baufinanzierung und Ratenkredite mit Top-Konditionen.' 
        });
    }
  }

  private updateCanonicalUrl(url: string): void {
    // Entferne existierende canonical tags
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Füge neuen canonical tag hinzu
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  openCookieSettings(): void {
    if (this.cookieBanner) {
      this.cookieBanner.showBanner = true;
      this.cookieBanner.showDetails = true;
    }
  }
}