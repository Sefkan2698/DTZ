import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Baufinanzierung } from './pages/baufinanzierung/baufinanzierung';
import { RatenkreditComponent } from './pages/ratenkredit/ratenkredit';
import { ContactComponent } from './pages/contact/contact';
import { DatenschutzComponent } from './pages/datenschutz/datenschutz';
import { ImpressumComponent } from './pages/impressum/impressum';
import { Bausparvertrag } from './pages/bausparvertrag/bausparvertrag';
import { Tippgeber } from './pages/tippgeber/tippgeber';
import { Component } from '@angular/core';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'baufinanzierung', component: Baufinanzierung },
  { path: 'ratenkredit', component: RatenkreditComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'datenschutz', component: DatenschutzComponent},
  { path: 'impressum', component: ImpressumComponent},
  { path: 'tippgeber', component: Tippgeber},
  { path: 'bausparvertrag', component: Bausparvertrag},
  // Weitere Routen hier...
];
