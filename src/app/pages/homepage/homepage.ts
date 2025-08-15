import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage implements OnInit, OnDestroy {
  numberOfBanks = 450; // Anzahl der Partnerbanken
  
  private jsonLdScript: HTMLScriptElement | undefined;

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {}

  ngOnInit() {
    // Meta Tags setzen
    this.title.setTitle('Deniz Tüzün - Baufinanzierung & Ratenkredite | Unabhängige Finanzberatung Celle');
    
    this.meta.updateTag({ 
      name: 'description', 
      content: 'Deniz Tüzün - Ihr unabhängiger Finanzberater für Baufinanzierung & Ratenkredite in Celle. ✓ Über 450 Banken im Vergleich ✓ Bundesweite Beratung ✓ Top-Konditionen' 
    });
    
    this.meta.updateTag({ 
      name: 'keywords', 
      content: 'Deniz Tüzün, Deniz Tuezuen, Baufinanzierung, Immobiliendarlehen, Ratenkredite, Finanzberatung, Finanzierung Celle, Darlehensvermittler' 
    });

    this.meta.updateTag({ 
      property: 'og:title', 
      content: 'Deniz Tüzün - Baufinanzierung & Ratenkredite | Unabhängige Finanzberatung' 
    });
    
    this.meta.updateTag({ 
      property: 'og:description', 
      content: 'Unabhängige Finanzberatung mit über 450 Banken im Vergleich. Kostenlose Erstberatung für Baufinanzierung und Ratenkredite bundesweit.' 
    });
    
    this.meta.updateTag({ 
      property: 'og:url', 
      content: 'https://www.baufi-tuezuen.de' 
    });

    // JSON-LD Strukturierte Daten hinzufügen
    this.addJsonLd();
  }

  ngOnDestroy() {
    // JSON-LD Script entfernen beim Verlassen der Seite
    if (this.jsonLdScript) {
      document.head.removeChild(this.jsonLdScript);
    }
  }

  private addJsonLd() {
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "Deniz Tüzün Finanzberatung",
      "alternateName": ["DTZ Finanzberatung", "Baufi Tüzün"],
      "description": "Unabhängige Finanzberatung für Baufinanzierung, Immobiliendarlehen und Ratenkredite",
      "url": "https://www.baufi-tuezuen.de",
      "logo": "https://www.baufi-tuezuen.de/assets/logo.png",
      "image": "https://www.baufi-tuezuen.de/assets/office.jpg",
      "telephone": "+49-152-52031092", 
      "email": "info@baufi-tuezuen.de", 
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Neuenkamp 16",
        "addressLocality": "Celle",
        "postalCode": "29229",
        "addressRegion": "Niedersachsen",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 52.6225,
        "longitude": 10.0805
      },
      "areaServed": {
        "@type": "Country",
        "name": "Deutschland"
      },
      "priceRange": "€€",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Finanzdienstleistungen",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Baufinanzierung",
              "description": `Maßgeschneiderte Baufinanzierung mit über ${this.numberOfBanks} Banken im Vergleich`
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Ratenkredite",
              "description": "Ratenkreditvergleich mit über 60 Banken"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Immobiliendarlehen",
              "description": "Individuelle Immobilienfinanzierung mit Top-Konditionen"
            }
          }
        ]
      },
    };

    this.jsonLdScript = document.createElement('script');
    this.jsonLdScript.type = 'application/ld+json';
    this.jsonLdScript.text = JSON.stringify(jsonLdData);
    document.head.appendChild(this.jsonLdScript);
  }
}