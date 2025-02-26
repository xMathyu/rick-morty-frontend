import { Component, OnInit, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../services/characters.service';

@Component({
  standalone: true,
  selector: 'app-character-form',
  templateUrl: './characters-form.component.html',
  styleUrls: ['./characters-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class CharacterFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  charId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(CharactersService) private charactersService: CharactersService
  ) {}

  ngOnInit() {
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
      origin: this.fb.group({
        name: [''],
        url: [''],
      }),
      location: this.fb.group({
        name: [''],
        url: [''],
      }),
      image: [''],
      episode: [[]],
    });

    if (this.isEdit) {
      this.charactersService.getCharacterById(this.charId).subscribe((char) => {
        this.form.patchValue(char);
      });
    }
  }

  onSubmit() {
    if (this.isEdit) {
      this.charactersService
        .updateCharacter(this.charId, this.form.value)
        .subscribe(() => {
          alert('Character updated');
          this.router.navigate(['/characters']);
        });
    } else {
      this.form.patchValue({ created: new Date().toISOString() });
      this.charactersService.createCharacter(this.form.value).subscribe(() => {
        alert('Character created');
        this.router.navigate(['/characters']);
      });
    }
  }
}
