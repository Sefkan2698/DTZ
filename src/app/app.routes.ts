import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';

export const routes: Routes = [
  // Homepage sofort laden - kritisch für LCP
  { path: '', component: Homepage },
  
  // Sekundäre Seiten lazy laden
  { 
    path: 'baufinanzierung', 
    loadComponent: () => import('./pages/baufinanzierung/baufinanzierung').then(m => m.Baufinanzierung)
  },
  { 
    path: 'ratenkredit', 
    loadComponent: () => import('./pages/ratenkredit/ratenkredit').then(m => m.RatenkreditComponent)
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent)
  },
  { 
    path: 'bausparvertrag', 
    loadComponent: () => import('./pages/bausparvertrag/bausparvertrag').then(m => m.Bausparvertrag)
  },
  { 
    path: 'tippgeber', 
    loadComponent: () => import('./pages/tippgeber/tippgeber').then(m => m.Tippgeber)
  },
  
  // Legal Pages - sehr selten besucht, definitiv lazy laden
  { 
    path: 'datenschutz', 
    loadComponent: () => import('./pages/datenschutz/datenschutz').then(m => m.DatenschutzComponent)
  },
  { 
    path: 'impressum', 
    loadComponent: () => import('./pages/impressum/impressum').then(m => m.ImpressumComponent)
  }
];