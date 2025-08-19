import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  provisions?: {
    category: string;
    items: string[];
  }[];
}

@Component({
  selector: 'app-tippgeber',
  imports: [RouterLink],
  templateUrl: './tippgeber.html',
  styleUrl: './tippgeber.css'
})
export class Tippgeber {
  activeFAQ: number | null = null;

  faqs: FAQ[] = [
    {
      id: 1,
      question: 'Wie gebe ich erfolgreich einen Tipp ab?',
      answer: 'Nutzen Sie unser Kontaktformular und teilen Sie uns Ihre Daten sowie einen Hinweis mit, dass Sie eine Empfehlung abgeben möchten. Alternativ kann Ihre Empfehlung bei der Kontaktaufnahme einfach erwähnen, dass sie durch Sie vermittelt wurde. Wir kümmern uns um den Rest!'
    },
    {
      id: 2,
      question: 'Was passiert nach der Tipp-Abgabe?',
      answer: 'Nach Ihrer Tipp-Abgabe prüfen wir, ob der Interessent bereits bei uns bekannt ist. Ist Ihr Tipp berechtigt, wird er nicht berücksichtigt, wenn bereits ein Beratungsprozess läuft. Bei berechtigten Tipps kontaktieren wir den Interessenten und vereinbaren einen Beratungstermin. Nach erfolgreichem Vertragsabschluss erhalten Sie Ihre Tippgeber-Provision.'
    },
    {
      id: 3,
      question: 'Wie hoch ist die Provision?',
      answer: 'Die Provisionshöhe richtet sich nach der Art und dem Volumen des Darlehens. Da wir aus datenschutzrechtlichen Gründen keine konkreten Darlehenssummen nennen dürfen, werden diese Informationen als Spannen ausgewiesen:',
      provisions: [
        {
          category: 'Immobiliardarlehen',
          items: [
            'bis 249.999€ = 200€ Provision',
            '250.000€ bis 499.999€ = 400€ Provision',
            '500.000€ bis 749.999€ = 600€ Provision',
            '750.000€ bis 999.999€ = 800€ Provision',
            'ab 1 Mio€ = 1.000€ Provision'
          ]
        },
        {
          category: 'Konsumentendarlehen',
          items: [
            '10.000€ bis 29.999€ = 20€ Provision',
            '30.000€ bis 49.999€ = 40€ Provision',
            'ab 50.000€ = 60€ Provision'
          ]
        },
        {
          category: 'Immobilienvermittlung',
          items: [
            'Ausschließlich nach vorheriger Absprache'
          ]
        }
      ]
    },
    {
      id: 4,
      question: 'Wann wird die Provision fällig?',
      answer: 'Die Provision wird 14 Tage nach Vertragsunterzeichnung und erfolgter Darlehenszusage ausgezahlt. Sie erhalten von uns eine entsprechende Benachrichtigung über die Auszahlung.'
    },
    {
      id: 5,
      question: 'Können auch Makler und Versicherungsvermittler Tipps abgeben?',
      answer: 'Für gewerbliche Vermittler bieten wir ein zusätzliches, speziell angepasstes Provisionsmodell an. Melden Sie sich hierzu direkt bei unserem Ansprechpartner und wir besprechen die individuellen Konditionen für eine Zusammenarbeit.'
    },
    {
      id: 6,
      question: 'Gibt es eine Mindestablaufzeit oder Kündigungsfrist?',
      answer: 'Nein, es gibt keine Mindestablaufzeit oder Kündigungsfristen. Jeder Tipp wird einzeln bewertet und vergütet. Sie können jederzeit Empfehlungen abgeben oder das Programm pausieren - ganz wie es für Sie am besten passt.'
    }
  ];

  toggleFAQ(faqId: number): void {
    if (this.activeFAQ === faqId) {
      this.activeFAQ = null;
    } else {
      this.activeFAQ = faqId;
    }
  }
}