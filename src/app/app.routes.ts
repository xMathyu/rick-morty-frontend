import { Routes } from '@angular/router';
import { CharactersListComponent } from './pages/characters-list/characters-list.component';
import { CharacterFormComponent } from './pages/characters-form/characters-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { path: 'characters', component: CharactersListComponent },
  { path: 'characters/create', component: CharacterFormComponent },
  { path: 'characters/edit/:id', component: CharacterFormComponent },
];
