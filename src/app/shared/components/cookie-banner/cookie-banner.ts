import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CookieConsentService } from '../../services/cookie-consent';

// Declare gtag for TypeScript
declare let gtag: Function;

// Window-Type Definition für GA Opt-Out
declare global {
  interface Window {
    [key: string]: any;
  }
}


@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cookie-banner.html',
  styleUrls: ['./cookie-banner.css'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class CookieBannerComponent implements OnInit {
  // Inject ChangeDetectorRef für Zoneless Mode
  private cdr = inject(ChangeDetectorRef);
  private cookieConsentService = inject(CookieConsentService);
  
  showBanner = false;
  showDetails = false;
  hasConsent = false;
  
  // Cookie Einstellungen
  cookieSettings = {
    necessary: true,
    analytics: false,
    marketing: false
  };
  
  // Kategorie Info Toggle States
  categoryInfo = {
    necessary: false,
    analytics: false,
    marketing: false
  };

  // Cookie Details - AKTUALISIERT MIT G-QKNYC81HJ6
  cookieDetails = {
    necessary: [
      { name: 'cookie-consent', duration: '1 Jahr', description: 'Speichert Ihre Cookie-Einstellungen' },
      { name: 'session-id', duration: 'Sitzung', description: 'Technisch notwendig für die Website-Funktionalität' }
    ],
    analytics: [
      { name: '_ga', duration: '2 Jahre', description: 'Google Analytics (G-QKNYC81HJ6) - Unterscheidet Nutzer' },
      { name: '_ga_QKNYC81HJ6', duration: '2 Jahre', description: 'Google Analytics 4 - Session-Tracking' },
      { name: '_gid', duration: '24 Stunden', description: 'Google Analytics - Unterscheidet Nutzer' },
      { name: '_gat', duration: '1 Minute', description: 'Google Analytics - Drosselung der Anfragerate' }
    ],
    marketing: [
      { name: '_fbp', duration: '3 Monate', description: 'Facebook Pixel - Tracking und Werbung' },
      { name: 'ads/ga-audiences', duration: 'Sitzung', description: 'Google Ads - Remarketing' }
    ]
  };

  ngOnInit(): void {
    console.log('Cookie Banner Component initialisiert');
    
    // WICHTIG: Setze Google Analytics Default Consent BEVOR gtag config läuft
    this.setInitialGoogleConsent();
    
    // Prüfe ob bereits eine Einwilligung existiert
    this.hasConsent = this.cookieConsentService.hasConsent();
    console.log('Hat Consent:', this.hasConsent);
    
    // Lade gespeicherte Einstellungen falls vorhanden
    const savedConsent = this.cookieConsentService.getConsent();
    if (savedConsent && savedConsent.settings) {
      this.cookieSettings = { 
        ...this.cookieSettings, 
        ...savedConsent.settings 
      };
      
      // Wende gespeicherte Einstellungen an
      if (this.hasConsent) {
        this.applyCookieSettings();
      }
    }
    
    // Zeige Banner nur wenn keine Einwilligung vorhanden oder abgelaufen
    if (!this.hasConsent) {
      console.log('Kein Consent vorhanden - zeige Banner');
      // Kleine Verzögerung für bessere UX
      setTimeout(() => {
        this.showBanner = true;
        this.cdr.markForCheck();
        console.log('Banner wird angezeigt');
      }, 1500);
    }
    
    // Prüfe ob Consent älter als 365 Tage ist
    if (savedConsent && this.isConsentExpired(savedConsent.timestamp)) {
      this.showBanner = true;
      this.hasConsent = false;
      this.cdr.markForCheck();
    }
  }

  // NEUE METHODE: Initiale Google Consent Einstellungen
  private setInitialGoogleConsent(): void {
    // Prüfe ob gtag verfügbar ist
    if (typeof gtag !== 'undefined') {
      // Setze Default Consent Mode
      gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'granted',
        'personalization_storage': 'denied',
        'security_storage': 'granted',
        'wait_for_update': 500
      });
      
      // Wenn bereits Consent vorhanden, update entsprechend
      const savedConsent = this.cookieConsentService.getConsent();
      if (savedConsent && savedConsent.settings && savedConsent.accepted) {
        if (savedConsent.settings.analytics) {
          gtag('consent', 'update', {
            'analytics_storage': 'granted'
          });
        }
        if (savedConsent.settings.marketing) {
          gtag('consent', 'update', {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
          });
        }
      }
    }
  }

  // Alle Cookies akzeptieren
  acceptAll(): void {
    this.cookieSettings = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    this.saveAndClose();
    this.trackConsent('accept_all');
  }

  // Ausgewählte Cookies akzeptieren
  acceptSelected(): void {
    this.saveAndClose();
    this.trackConsent('accept_selected');
  }

  // Nur notwendige Cookies
  rejectAll(): void {
    this.cookieSettings = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    this.saveAndClose();
    this.trackConsent('reject_all');
  }

  // Speichern und schließen
  private saveAndClose(): void {
    // Speichere Einstellungen
    this.cookieConsentService.setConsent({
      settings: this.cookieSettings,
      accepted: true,
      timestamp: new Date().toISOString()
    });
    
    // Aktiviere/Deaktiviere Cookies basierend auf Einstellungen
    this.applyCookieSettings();
    
    // Schließe Banner
    this.showBanner = false;
    this.showDetails = false;
    this.hasConsent = true;
    
    // Trigger Change Detection
    this.cdr.markForCheck();
    
    // Event für andere Komponenten
    this.emitConsentEvent();
  }

  // Cookie-Einstellungen anwenden
  private applyCookieSettings(): void {
    // Google Analytics aktivieren/deaktivieren
    if (this.cookieSettings.analytics) {
      this.enableGoogleAnalytics();
    } else {
      this.disableGoogleAnalytics();
    }
    
    // Marketing Cookies aktivieren/deaktivieren
    if (this.cookieSettings.marketing) {
      this.enableMarketingCookies();
    } else {
      this.disableMarketingCookies();
    }
  }

  // Google Analytics aktivieren
  private enableGoogleAnalytics(): void {
    // Nur wenn gtag verfügbar ist
    if (typeof gtag !== 'undefined') {
      console.log('Aktiviere Google Analytics');
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
      
      // Sende Page View nach Consent
      gtag('event', 'page_view', {
        'send_to': 'G-QKNYC81HJ6'
      });
    }
  }

  // Google Analytics deaktivieren
  private disableGoogleAnalytics(): void {
    console.log('Deaktiviere Google Analytics');
    
    // GA4 Cookies löschen (mit deiner Measurement ID)
    this.deleteCookie('_ga');
    this.deleteCookie('_ga_QKNYC81HJ6');
    this.deleteCookie('_gid');
    this.deleteCookie('_gat');
    this.deleteCookie('_gat_gtag_G_QKNYC81HJ6');
    
    // Consent Update
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
      
      // Setze Opt-Out Cookie für GA
      window['ga-disable-G-QKNYC81HJ6'] = true;
    }
  }

  // Marketing Cookies aktivieren
  private enableMarketingCookies(): void {
    if (typeof gtag !== 'undefined') {
      console.log('Aktiviere Marketing Cookies');
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  }

  // Marketing Cookies deaktivieren
  private disableMarketingCookies(): void {
    console.log('Deaktiviere Marketing Cookies');
    
    // Facebook Pixel Cookies löschen
    this.deleteCookie('_fbp');
    this.deleteCookie('_fbc');
    
    // Google Ads Cookies löschen
    this.deleteCookie('_gcl_au');
    this.deleteCookie('_gcl_aw');
    this.deleteCookie('_gcl_dc');
    
    // Consent Update
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  }

  // Cookie löschen
  private deleteCookie(name: string): void {
    // Lösche für verschiedene Pfade
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    
    // Für Subdomain (falls vorhanden)
    const domain = window.location.hostname.split('.').slice(-2).join('.');
    if (domain !== window.location.hostname) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
    }
  }

  // Details anzeigen/verbergen
  toggleDetails(): void {
    this.showDetails = !this.showDetails;
    this.cdr.markForCheck();
  }

  // Kategorie Info anzeigen/verbergen
  toggleCategoryInfo(category: 'necessary' | 'analytics' | 'marketing'): void {
    this.categoryInfo[category] = !this.categoryInfo[category];
    this.cdr.markForCheck();
  }

  // Cookie-Einstellungen öffnen (wenn Banner geschlossen)
  showCookieSettings(): void {
    this.showBanner = true;
    this.showDetails = true;
    this.cdr.markForCheck();
    
    // Lade aktuelle Einstellungen
    const savedConsent = this.cookieConsentService.getConsent();
    if (savedConsent && savedConsent.settings) {
      this.cookieSettings = { 
        ...this.cookieSettings, 
        ...savedConsent.settings 
      };
      this.cdr.markForCheck();
    }
  }

  // Banner verstecken für Navigation
  hideForLink(): void {
    this.showBanner = false;
    this.cdr.markForCheck();
  }

  // Prüfe ob Consent abgelaufen ist (365 Tage)
  private isConsentExpired(timestamp: string): boolean {
    const consentDate = new Date(timestamp);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 365;
  }

  // Event für andere Komponenten
  private emitConsentEvent(): void {
    const event = new CustomEvent('cookieConsentUpdated', {
      detail: {
        settings: this.cookieSettings,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  }

  // Tracking der Consent-Entscheidung (nur wenn Analytics aktiviert)
  private trackConsent(action: string): void {
    if (this.cookieSettings.analytics && typeof gtag !== 'undefined') {
      gtag('event', 'cookie_consent', {
        'consent_action': action,
        'analytics_enabled': this.cookieSettings.analytics,
        'marketing_enabled': this.cookieSettings.marketing
      });
    }
  }
}