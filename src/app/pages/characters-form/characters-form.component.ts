import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../services/characters.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { startWith, map, Observable } from 'rxjs';

@Component({
  selector: 'app-character-form',
  standalone: true,
  templateUrl: './characters-form.component.html',
  styleUrls: ['./characters-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatOptionModule,
  ],
})
export class CharacterFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  charId!: string;
  // Lista de locations para autocompletar
  locations: any[] = [];
  filteredOriginOptions!: Observable<any[]>;
  filteredLocationOptions!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(CharactersService) private charactersService: CharactersService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.charId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.charId;

    this.form = this.fb.group({
      name: [''],
      status: ['unknown'],
      species: [''],
      gender: ['unknown'],
      type: [''],
      url: [''],
      created: [''],
      image: [''],
      episode: [[]],
      originName: [''],
      locationName: [''],
      origin: this.fb.group({
        name: [''],
        url: [''],
      }),
      location: this.fb.group({
        name: [''],
        url: [''],
      }),
    });

    if (this.isEdit) {
      this.charactersService.getCharacterById(this.charId).subscribe({
        next: (char) => {
          this.form.patchValue({
            ...char,
            originName: char.origin?.name,
            locationName: char.location?.name,
          });
        },
        error: () =>
          this.snackBar.open('Error loading character', 'Close', {
            duration: 3000,
          }),
      });
    }
    this.loadLocations();

    this.filteredOriginOptions = this.originNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterLocations(value))
    );
    this.filteredLocationOptions = this.locationNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterLocations(value))
    );
  }

  get originNameControl(): FormControl {
    return this.form.get('originName') as FormControl;
  }
  get locationNameControl(): FormControl {
    return this.form.get('locationName') as FormControl;
  }

  private _filterLocations(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter((loc) =>
      loc.name.toLowerCase().includes(filterValue)
    );
  }

  loadLocations(): void {
    this.charactersService.getLocations().subscribe({
      next: (res) => {
        this.locations = res.results || [];
      },
      error: (err) => {
        console.error('Error loading locations:', err);
        this.snackBar.open('Error loading locations', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onSubmit(): void {
    const originName = this.form.value.originName;
    const selectedOrigin = this.locations.find(
      (loc) => loc.name === originName
    ) || { name: originName, url: '' };

    const locationName = this.form.value.locationName;
    const selectedLocation = this.locations.find(
      (loc) => loc.name === locationName
    ) || { name: locationName, url: '' };

    this.form.patchValue({
      origin: selectedOrigin,
      location: selectedLocation,
    });

    if (this.isEdit) {
      this.charactersService
        .updateCharacter(this.charId, this.form.value)
        .subscribe({
          next: () => {
            this.snackBar.open('Character updated successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/characters']);
          },
          error: () =>
            this.snackBar.open('Error updating character', 'Close', {
              duration: 3000,
            }),
        });
    } else {
      this.form.patchValue({ created: new Date().toISOString() });
      this.charactersService.createCharacter(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Character created successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/characters']);
        },
        error: () =>
          this.snackBar.open('Error creating character', 'Close', {
            duration: 3000,
          }),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/characters']);
  }
}
