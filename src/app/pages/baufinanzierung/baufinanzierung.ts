import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-baufinanzierung',
  imports: [CommonModule, RouterModule],
  templateUrl: './baufinanzierung.html',
  styleUrl: './baufinanzierung.css'
})
export class Baufinanzierung implements OnInit, OnDestroy {
  numberOfBanks = 450;
  private jsonLdScript: HTMLScriptElement | undefined;
  
  faqs = [
    {
      question: 'Welche monatliche Rate kann ich mir leisten?',
      answer: 'Als Faustregel gilt: Ihre monatliche Rate sollte maximal 35-40% Ihres Nettoeinkommens betragen. Diese Grenze stellt sicher, dass Sie neben der Finanzierung noch ausreichend Budget für Ihre Lebenshaltungskosten wie Energie, Lebensmittel, Mobilität und Freizeit haben. Eine individuelle Haushaltsrechnung verschafft Ihnen Klarheit über Ihre finanziellen Möglichkeiten.',
      isOpen: false
    },
    {
      question: 'Welche Zinsbindungsfristen stehen zur Verfügung?',
      answer: 'Die Zinsbindung bestimmt, wie lange Ihr Zinssatz festgeschrieben wird. Gängige Laufzeiten sind 5, 10, 15, 20, 25 oder 30 Jahre. Bei kurzen Laufzeiten bleiben Sie flexibel und können bei sinkenden Zinsen schnell reagieren, tragen aber das Risiko steigender Zinsen. Lange Zinsbindungen sichern Ihnen den aktuellen Zins für viele Jahre - ideal bei niedrigen Zinsen. Beachten Sie: Nach 10 Jahren haben Sie ein gesetzliches Sonderkündigungsrecht mit 6 Monaten Vorlauf.',
      isOpen: false
    },
    {
      question: 'Wie hoch sollte meine Tilgung sein?',
      answer: 'In Niedrigzinsphasen empfiehlt sich eine Tilgung von mindestens 2-3% pro Jahr. Eine höhere Tilgung bedeutet zwar eine höhere Monatsrate, führt aber zu einer schnelleren Entschuldung und geringeren Zinskosten über die Gesamtlaufzeit. Die optimale Tilgungshöhe richtet sich nach Ihrer persönlichen Finanzsituation - wichtig ist, dass die Gesamtbelastung aus Zins und Tilgung langfristig tragbar bleibt.',
      isOpen: false
    },
    {
      question: 'Wie viele Banken vergleicht Deniz Tüzün für meine Baufinanzierung?',
      answer: `Wir arbeiten mit über ${this.numberOfBanks} Banken und Finanzierungspartnern zusammen. Dieser umfangreiche Marktvergleich ermöglicht es uns, die optimalen Konditionen für Ihre individuelle Situation zu finden. Als unabhängiger Finanzberater sind wir nicht an einzelne Banken gebunden und können objektiv die besten Angebote für Sie auswählen.`,
      isOpen: false
    },
    {
      question: 'Welche Unterlagen benötige ich für eine Baufinanzierung?',
      answer: 'Für eine Baufinanzierung benötigen Sie in der Regel: Einkommensnachweise der letzten 3 Monate, aktuelle Vermögensaufstellung, Objektunterlagen (Exposé, Grundriss, Lageplan), bei Bestandsimmobilien zusätzlich den Kaufvertragsentwurf, bei Neubauten die Baubeschreibung und Kostenaufstellung. Selbstständige benötigen zusätzlich die letzten zwei Jahresabschlüsse oder Einnahmen-Überschuss-Rechnungen sowie aktuelle BWA.',
      isOpen: false
    },
    {
      question: 'Was kostet die Beratung bei Deniz Tüzün?',
      answer: 'Unsere Beratung ist für Sie komplett kostenlos und unverbindlich. Wir erhalten unsere Vergütung direkt von der finanzierenden Bank in Form einer Vermittlungsprovision. Diese ist bereits in den Konditionen der Bank einkalkuliert - Sie zahlen also keinen Cent extra für unsere professionelle Beratung und Begleitung während des gesamten Finanzierungsprozesses.',
      isOpen: false
    }
  ];

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    // Meta Tags für Baufinanzierung setzen
    this.title.setTitle('Baufinanzierung Celle - Immobiliardarlehen | Deniz Tüzün Finanzberatung');
    
    this.meta.updateTag({ 
      name: 'description', 
      content: `Baufinanzierung mit Top-Konditionen von Deniz Tüzün. ✓ Über ${this.numberOfBanks} Banken im Vergleich ✓ Zinsbindung bis 40 Jahre ✓ Kostenlose Beratung ✓ Bundesweit. Jetzt Angebot anfordern!` 
    });
    
    this.meta.updateTag({ 
      name: 'keywords', 
      content: 'Baufinanzierung, Immobiliardarlehen, Immobilienfinanzierung, Baukredit, Hausfinanzierung, Deniz Tüzün, Celle, Zinsbindung, Tilgung, Finanzierungsberatung' 
    });

    this.meta.updateTag({ 
      property: 'og:title', 
      content: 'Baufinanzierung mit Top-Konditionen | Deniz Tüzün' 
    });
    
    this.meta.updateTag({ 
      property: 'og:description', 
      content: `Maßgeschneiderte Baufinanzierung mit über ${this.numberOfBanks} Banken im Vergleich. Kostenlose Beratung von Deniz Tüzün.` 
    });
    
    this.meta.updateTag({ 
      property: 'og:url', 
      content: 'https://www.baufi-tuezuen.de/baufinanzierung' 
    });

    this.meta.updateTag({ 
      property: 'og:type', 
      content: 'website' 
    });

    // Canonical URL setzen
    this.setCanonicalURL();

    // JSON-LD Strukturierte Daten hinzufügen
    this.addJsonLd();
  }

  ngOnDestroy() {
    // JSON-LD Script entfernen beim Verlassen der Seite
    if (this.jsonLdScript) {
      document.head.removeChild(this.jsonLdScript);
    }
  }

  private setCanonicalURL() {
    // Entferne existierende canonical tags
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Füge neuen canonical tag hinzu
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', 'https://www.baufi-tuezuen.de/baufinanzierung');
    document.head.appendChild(link);
  }

  private addJsonLd() {
    // Kombiniertes Schema: Service + FAQPage
    const jsonLdData = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Baufinanzierung",
        "description": `Maßgeschneiderte Baufinanzierungslösungen mit über ${this.numberOfBanks} Banken im Vergleich`,
        "provider": {
          "@type": "FinancialService",
          "name": "Deniz Tüzün Finanzberatung",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Neuenkamp 16",
            "addressLocality": "Celle",
            "postalCode": "29229",
            "addressRegion": "Niedersachsen",
            "addressCountry": "DE"
          }
        },
        "areaServed": {
          "@type": "Country",
          "name": "Deutschland"
        },
        "serviceType": ["Baufinanzierung", "Immobiliardarlehen", "Anschlussfinanzierung", "Umschuldung"],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "Kostenlose Beratung und Vermittlung"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": this.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Startseite",
            "item": "https://www.baufi-tuezuen.de"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Baufinanzierung",
            "item": "https://www.baufi-tuezuen.de/baufinanzierung"
          }
        ]
      }
    ];

    this.jsonLdScript = document.createElement('script');
    this.jsonLdScript.type = 'application/ld+json';
    this.jsonLdScript.text = JSON.stringify(jsonLdData);
    document.head.appendChild(this.jsonLdScript);
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}