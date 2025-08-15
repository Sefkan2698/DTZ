import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-whatsapp-button',
  imports: [CommonModule],
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.css'
})
export class WhatsappButton {
  whatsappNumber = '4915252031092'; 
  
  // Vordefinierte Nachricht
  defaultMessage = 'Hallo! Ich interessiere mich für Ihre Finanzberatung.';
  
  // Tooltip anzeigen
  showTooltip = false;
  
  openWhatsApp(): void {
    const message = encodeURIComponent(this.defaultMessage);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
