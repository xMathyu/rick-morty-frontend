import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CharactersService } from '../../services/characters.service';
import { Character, CharacterFilter, Info } from '../../models/character.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class CharactersListComponent implements OnInit {
  firestoreCharacters: Character[] = [];
  externalCharacters: Character[] = [];
  searchName = '';
  page = 1;
  loading = false;
  // Almacenamos la info de paginación (si existe) de la API externa
  paginationInfo: Info<Character[]>['info'] | null = null;

  constructor(
    private charactersService: CharactersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFirestoreCharacters();
    this.loadExternalCharacters();
  }

  loadFirestoreCharacters(): void {
    this.charactersService.getCharacters().subscribe({
      next: (chars) => {
        this.firestoreCharacters = chars;
      },
      error: (err) => {
        console.error('Error loading Firestore characters:', err);
        this.snackBar.open('Error loading characters from Firestore', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  loadExternalCharacters(): void {
    this.loading = true;
    const filter: CharacterFilter = { name: this.searchName, page: this.page };
    this.charactersService.getExternal(filter).subscribe({
      next: (res) => {
        this.externalCharacters = res.results || [];
        this.paginationInfo = res.info || null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading external characters:', err);
        this.loading = false;
        this.snackBar.open('Error loading external characters', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  createCharacter(): void {
    this.router.navigate(['/characters/create']);
  }

  editCharacter(char: Character): void {
    this.router.navigate(['/characters', 'edit', char.id]);
  }

  deleteCharacter(char: Character): void {
    if (confirm(`Are you sure you want to delete ${char.name}?`)) {
      this.charactersService.deleteCharacter(String(char.id)).subscribe({
        next: () => {
          this.snackBar.open('Character deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadFirestoreCharacters();
        },
        error: (err) => {
          console.error('Error deleting character:', err);
          this.snackBar.open('Error deleting character', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  nextPage(): void {
    if (this.paginationInfo && this.paginationInfo.next) {
      this.page++;
      this.loadExternalCharacters();
    }
  }

  prevPage(): void {
    if (this.paginationInfo && this.paginationInfo.prev && this.page > 1) {
      this.page--;
      this.loadExternalCharacters();
    }
  }
}
