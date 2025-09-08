import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsent {
  settings: CookieSettings;
  accepted: boolean;
  timestamp: string;
  version?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private readonly CONSENT_KEY = 'cookie-consent';
  private readonly CONSENT_VERSION = '1.0';
  private consentSubject = new BehaviorSubject<CookieConsent | null>(null);
  private platformId = inject(PLATFORM_ID);
  
  public consent$: Observable<CookieConsent | null> = this.consentSubject.asObservable();

  constructor() {
    // Nur im Browser initialisieren
    if (isPlatformBrowser(this.platformId)) {
      // Lade gespeicherten Consent beim Start
      this.loadConsent();
      
      // Lausche auf Storage-Events (für Tabs-Synchronisation)
      window.addEventListener('storage', (event) => {
        if (event.key === this.CONSENT_KEY) {
          this.loadConsent();
        }
      });
    }
  }

  /**
   * Lädt den gespeicherten Consent
   */
  private loadConsent(): void {
    const consent = this.getConsent();
    this.consentSubject.next(consent);
  }

  /**
   * Holt den gespeicherten Consent
   */
  getConsent(): CookieConsent | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // Server-Side: kein localStorage verfügbar
    }

    try {
      const consentString = localStorage.getItem(this.CONSENT_KEY);
      if (!consentString) {
        return null;
      }
      
      const consent = JSON.parse(consentString);
      
      // Prüfe Version - bei Änderungen muss Consent erneuert werden
      if (consent.version !== this.CONSENT_VERSION) {
        this.clearConsent();
        return null;
      }
      
      return consent;
    } catch (error) {
      console.error('Fehler beim Laden der Cookie-Einstellungen:', error);
      return null;
    }
  }

  /**
   * Speichert den Consent
   */
  setConsent(consent: Partial<CookieConsent>): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Server-Side: kein localStorage verfügbar
    }

    try {
      const fullConsent: CookieConsent = {
        settings: consent.settings || {
          necessary: true,
          analytics: false,
          marketing: false
        },
        accepted: consent.accepted || false,
        timestamp: consent.timestamp || new Date().toISOString(),
        version: this.CONSENT_VERSION
      };
      
      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(fullConsent));
      this.consentSubject.next(fullConsent);
      
      // Log für Debugging (kann in Produktion entfernt werden)
      console.log('Cookie-Einstellungen gespeichert:', fullConsent);
    } catch (error) {
      console.error('Fehler beim Speichern der Cookie-Einstellungen:', error);
    }
  }

  /**
   * Prüft ob ein Consent vorhanden ist
   */
  hasConsent(): boolean {
    const consent = this.getConsent();
    return consent !== null && consent.accepted === true;
  }

  /**
   * Prüft ob ein bestimmter Cookie-Typ erlaubt ist
   */
  isAllowed(type: 'necessary' | 'analytics' | 'marketing'): boolean {
    const consent = this.getConsent();
    if (!consent || !consent.accepted) {
      return type === 'necessary'; // Nur notwendige Cookies ohne Consent
    }
    return consent.settings[type] === true;
  }

  /**
   * Löscht den gespeicherten Consent
   */
  clearConsent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Server-Side: kein localStorage verfügbar
    }
    
    localStorage.removeItem(this.CONSENT_KEY);
    this.consentSubject.next(null);
  }

  /**
   * Aktualisiert einzelne Cookie-Kategorien
   */
  updateCategory(category: 'analytics' | 'marketing', enabled: boolean): void {
    const consent = this.getConsent();
    if (consent) {
      consent.settings[category] = enabled;
      consent.timestamp = new Date().toISOString();
      this.setConsent(consent);
    }
  }

  /**
   * Gibt die aktuellen Cookie-Einstellungen zurück
   */
  getCurrentSettings(): CookieSettings {
    const consent = this.getConsent();
    if (consent && consent.settings) {
      return consent.settings;
    }
    return {
      necessary: true,
      analytics: false,
      marketing: false
    };
  }

  /**
   * Prüft ob der Consent abgelaufen ist (älter als 365 Tage)
   */
  isConsentExpired(): boolean {
    const consent = this.getConsent();
    if (!consent) {
      return true;
    }
    
    const consentDate = new Date(consent.timestamp);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff > 365;
  }

  /**
   * Setzt alle Cookies auf Standard zurück
   */
  resetToDefault(): void {
    this.setConsent({
      settings: {
        necessary: true,
        analytics: false,
        marketing: false
      },
      accepted: false,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Export der Einstellungen (für DSGVO-Auskunft)
   */
  exportSettings(): string {
    const consent = this.getConsent();
    return JSON.stringify(consent, null, 2);
  }

  /**
   * Gibt eine lesbare Zusammenfassung der Einstellungen zurück
   */
  getSummary(): string {
    const consent = this.getConsent();
    if (!consent) {
      return 'Keine Cookie-Einstellungen gespeichert';
    }
    
    const settings = consent.settings;
    const enabled = [];
    
    if (settings.necessary) enabled.push('Notwendige');
    if (settings.analytics) enabled.push('Analyse');
    if (settings.marketing) enabled.push('Marketing');
    
    return `Aktive Cookie-Kategorien: ${enabled.join(', ')}. Zustimmung erteilt am: ${new Date(consent.timestamp).toLocaleDateString('de-DE')}`;
  }
}