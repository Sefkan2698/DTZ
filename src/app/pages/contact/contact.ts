import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  
  // EmailJS Konfiguration
  private SERVICE_ID = 'service_wc5i6g2';
  private TEMPLATE_ID = 'template_zm94brl';
  private AUTOREPLY_TEMPLATE_ID = 'template_gjt3vqk';
  private PUBLIC_KEY = 'VyRagT8GTpbw0SpBG';

  // Formular-Daten
  formData = {
    anrede: '',
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    anliegen: '',
    nachricht: '',
    datenschutz: false
  };

  // Status-Variablen - WICHTIG: Als public deklarieren für Template-Binding
  public isSubmitting: boolean = false;
  public isSubmitted: boolean = false;
  public submitError: string = '';
  public emailTouched: boolean = false;

  // Fehler-Nachrichten
  anredeError = '';
  vornameError = '';
  nachnameError = '';
  emailError = '';
  anliegenError = '';
  nachrichtError = '';
  datenschutzError = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone  // NgZone für bessere Change Detection
  ) {
    // EmailJS initialisieren
    emailjs.init(this.PUBLIC_KEY);
    console.log('ContactComponent initialisiert');
    console.log('Initial Status - isSubmitted:', this.isSubmitted);
  }

  // E-Mail Validierung
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ['.com', '.de', '.org', '.net', '.eu', '.info', '.biz', '.ch', '.at'];
    
    // Leere E-Mail
    if (!email || email.trim().length === 0) {
      this.emailError = 'Bitte geben Sie eine E-Mail-Adresse ein';
      return false;
    }
    
    // Basis-Validierung
    if (!emailRegex.test(email)) {
      this.emailError = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
      return false;
    }
    
    // Domain-Validierung
    const hasValidDomain = validDomains.some(domain => email.toLowerCase().endsWith(domain));
    if (!hasValidDomain) {
      this.emailError = 'Bitte verwenden Sie eine gültige Domain (.de, .com, etc.)';
      return false;
    }
    
    // Tippfehler-Check für häufige Anbieter
    const commonProviders: { [key: string]: string } = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmx.ed': 'gmx.de',
      'web.ed': 'web.de',
      'yahho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'outlook.ed': 'outlook.de'
    };
    
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (commonProviders[emailDomain]) {
      this.emailError = `Meinten Sie ${email.split('@')[0]}@${commonProviders[emailDomain]}?`;
      return false;
    }
    
    this.emailError = '';
    return true;
  }

  // E-Mail Events
  onEmailChange(): void {
    if (this.emailTouched && this.formData.email) {
      this.validateEmail(this.formData.email);
    }
  }

  onEmailBlur(): void {
    this.emailTouched = true;
    if (this.formData.email) {
      this.validateEmail(this.formData.email);
    }
  }

  // Formular-Validierung
  validateForm(): boolean {
    let isValid = true;
    
    // Alle vorherigen Fehler zurücksetzen
    this.anredeError = '';
    this.vornameError = '';
    this.nachnameError = '';
    this.emailError = '';
    this.anliegenError = '';
    this.nachrichtError = '';
    this.datenschutzError = '';

    // Anrede validieren
    if (!this.formData.anrede) {
      this.anredeError = 'Bitte wählen Sie eine Anrede';
      isValid = false;
    }

    // Vorname validieren
    if (!this.formData.vorname || this.formData.vorname.trim().length === 0) {
      this.vornameError = 'Bitte geben Sie Ihren Vornamen ein';
      isValid = false;
    } else if (this.formData.vorname.trim().length < 2) {
      this.vornameError = 'Der Vorname muss mindestens 2 Zeichen lang sein';
      isValid = false;
    }

    // Nachname validieren
    if (!this.formData.nachname || this.formData.nachname.trim().length === 0) {
      this.nachnameError = 'Bitte geben Sie Ihren Nachnamen ein';
      isValid = false;
    } else if (this.formData.nachname.trim().length < 2) {
      this.nachnameError = 'Der Nachname muss mindestens 2 Zeichen lang sein';
      isValid = false;
    }

    // E-Mail validieren
    if (!this.formData.email || this.formData.email.trim().length === 0) {
      this.emailError = 'Bitte geben Sie Ihre E-Mail-Adresse ein';
      isValid = false;
    } else if (!this.validateEmail(this.formData.email)) {
      isValid = false;
    }

    // Anliegen validieren
    if (!this.formData.anliegen) {
      this.anliegenError = 'Bitte wählen Sie Ihr Anliegen';
      isValid = false;
    }

    // Nachricht validieren
    if (!this.formData.nachricht || this.formData.nachricht.trim().length === 0) {
      this.nachrichtError = 'Bitte beschreiben Sie Ihr Anliegen';
      isValid = false;
    } else if (this.formData.nachricht.trim().length < 10) {
      this.nachrichtError = 'Die Nachricht muss mindestens 10 Zeichen lang sein';
      isValid = false;
    }

    // Datenschutz validieren
    if (!this.formData.datenschutz) {
      this.datenschutzError = 'Bitte stimmen Sie der Datenschutzerklärung zu';
      isValid = false;
    }

    return isValid;
  }

  // Anliegen-Labels für E-Mail
  getAnliegenLabel(value: string): string {
    const labels: { [key: string]: string } = {
      'baufinanzierung': 'Baufinanzierung',
      'ratenkredit': 'Ratenkredit',
      'bausparvertrag': 'Bausparvertrag',
      'Tipp': 'Tipp',
      'anderes': 'Anderes'
    };
    return labels[value] || value;
  }

  // Anrede-Labels für E-Mail
  getAnredeLabel(value: string): string {
    const labels: { [key: string]: string } = {
      'herr': 'Herr',
      'frau': 'Frau',
      'divers': 'Divers'
    };
    return labels[value] || value;
  }

  // ÜBERARBEITETE submitForm Methode mit besserer Change Detection
  async submitForm(): Promise<void> {
    console.log('=== SUBMIT FORM START ===');
    console.log('Component Instance:', this);
    console.log('isSubmitting vor Start:', this.isSubmitting);
    console.log('isSubmitted vor Start:', this.isSubmitted);
    
    // Bereits am Senden? Abbrechen.
    if (this.isSubmitting) {
      console.log('Bereits am Senden, abgebrochen');
      return;
    }

    // Validierung
    if (!this.validateForm()) {
      console.log('Validierung fehlgeschlagen');
      // Force Change Detection auch bei Validierungsfehler
      this.cdr.detectChanges();
      return;
    }

    // Status setzen
    this.isSubmitting = true;
    this.submitError = '';
    this.cdr.detectChanges(); // Sofort Change Detection für Loading-State
    
    console.log('Nach Start - isSubmitting:', this.isSubmitting);

    // Daten für E-Mail vorbereiten
    const emailData = {
      anrede: this.getAnredeLabel(this.formData.anrede),
      vorname: this.formData.vorname.trim(),
      nachname: this.formData.nachname.trim(),
      email: this.formData.email.trim(),
      telefon: this.formData.telefon.trim() || 'Nicht angegeben',
      anliegen: this.getAnliegenLabel(this.formData.anliegen),
      nachricht: this.formData.nachricht.trim(),
      datum: new Date().toLocaleDateString('de-DE'),
      uhrzeit: new Date().toLocaleTimeString('de-DE')
    };

    console.log('E-Mail-Daten:', emailData);

    try {
      // Admin-E-Mail senden
      console.log('Sende Admin-E-Mail...');
      const adminResponse = await emailjs.send(
        this.SERVICE_ID, 
        this.TEMPLATE_ID, 
        emailData
      );
      console.log('Admin-E-Mail erfolgreich:', adminResponse);

      // Autoresponder senden
      console.log('Sende Autoresponder...');
      const autoResponse = await emailjs.send(
        this.SERVICE_ID, 
        this.AUTOREPLY_TEMPLATE_ID, 
        emailData
      );
      console.log('Autoresponder erfolgreich:', autoResponse);

      // ERFOLG - Status in NgZone setzen für garantierte Change Detection
      console.log('=== ERFOLG - Setze Status ===');
      
      this.ngZone.run(() => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.submitError = '';
        
        console.log('Status nach Erfolg:');
        console.log('- isSubmitting:', this.isSubmitting);
        console.log('- isSubmitted:', this.isSubmitted);
        
        // Mehrfache Change Detection zur Sicherheit
        this.cdr.detectChanges();
        this.cdr.markForCheck();
        
        // Zusätzliche Überprüfung nach kurzer Verzögerung
        setTimeout(() => {
          console.log('Verzögerte Überprüfung:');
          console.log('- isSubmitted noch true?', this.isSubmitted);
          
          // Nochmals Change Detection
          this.cdr.detectChanges();
          
          // DOM Check
          const successElement = document.querySelector('.success-message');
          const formElement = document.querySelector('.contact-form');
          console.log('DOM Check:');
          console.log('- Success Message sichtbar?', !!successElement);
          console.log('- Form noch sichtbar?', !!formElement);
          
          // Wenn Success Message da ist, hinscollen
          if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            // Fallback: Nach oben scrollen
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      });

    } catch (error: any) {
      console.error('=== FEHLER BEIM SENDEN ===');
      console.error('Fehler Details:', error);
      
      // Fehler-Handling in NgZone
      this.ngZone.run(() => {
        this.isSubmitting = false;
        this.isSubmitted = false;
        
        // Spezifische Fehlermeldungen
        if (error?.text?.includes('invalid') || error?.text?.includes('email')) {
          this.submitError = 'Die eingegebene E-Mail-Adresse ist ungültig. Bitte überprüfen Sie Ihre Eingabe.';
        } else if (error?.status === 422) {
          this.submitError = 'Es gab ein Problem mit den übermittelten Daten. Bitte überprüfen Sie Ihre Eingaben.';
        } else if (error?.status === 429) {
          this.submitError = 'Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.';
        } else if (error?.status === 400) {
          this.submitError = 'Fehlende oder ungültige Konfiguration. Bitte kontaktieren Sie uns telefonisch.';
        } else {
          this.submitError = 'Es gab einen technischen Fehler beim Senden Ihrer Anfrage. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per Telefon.';
        }
        
        console.log('Fehler-Status gesetzt:');
        console.log('- isSubmitting:', this.isSubmitting);
        console.log('- isSubmitted:', this.isSubmitted);
        console.log('- submitError:', this.submitError);
        
        // Change Detection für Fehler
        this.cdr.detectChanges();
      });
    }
    
    console.log('=== SUBMIT FORM ENDE ===');
  }

  // Fehler zurücksetzen
  clearError(): void {
    this.submitError = '';
    this.cdr.detectChanges();
  }

  // Formular zurücksetzen - ÜBERARBEITET
  resetForm(): void {
    console.log('=== FORMULAR RESET START ===');
    
    this.ngZone.run(() => {
      // Status zuerst zurücksetzen
      this.isSubmitted = false;
      this.isSubmitting = false;
      this.emailTouched = false;
      
      // Formular-Daten zurücksetzen
      this.formData = {
        anrede: '',
        vorname: '',
        nachname: '',
        email: '',
        telefon: '',
        anliegen: '',
        nachricht: '',
        datenschutz: false
      };

      // Alle Fehler zurücksetzen
      this.anredeError = '';
      this.vornameError = '';
      this.nachnameError = '';
      this.emailError = '';
      this.anliegenError = '';
      this.nachrichtError = '';
      this.datenschutzError = '';
      this.submitError = '';
      
      console.log('Reset abgeschlossen:');
      console.log('- isSubmitted:', this.isSubmitted);
      console.log('- isSubmitting:', this.isSubmitting);
      
      // Mehrfache Change Detection
      this.cdr.detectChanges();
      this.cdr.markForCheck();
      
      // Nach oben scrollen
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
    
    console.log('=== FORMULAR RESET ENDE ===');
  }

  // Debug-Methode zum Testen
  debugStatus(): void {
    console.log('=== AKTUELLER STATUS ===');
    console.log('isSubmitted:', this.isSubmitted);
    console.log('isSubmitting:', this.isSubmitting);
    console.log('submitError:', this.submitError);
    console.log('Component:', this);
  }
}