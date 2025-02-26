import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { Character, Info, CharacterFilter } from '../models/character.model';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  // We use the apiUrl variable from the environment to point to our backend
  private baseUrl = `${environment.apiUrl}/characters`;

  constructor(private http: HttpClient) {}

  /**
   * Calls the /characters/external endpoint in the backend to fetch data from the external Rick & Morty API.
   * Filters (such as name, status, species, type, gender, page) can be sent as query params.
   */
  getExternal(filter: CharacterFilter = {}): Observable<Info<Character[]>> {
    let url = `${this.baseUrl}/external?`;
    if (filter.name) {
      url += `name=${encodeURIComponent(filter.name)}&`;
    }
    if (filter.page) {
      url += `page=${filter.page}&`;
    }
    if (filter.status) {
      url += `status=${encodeURIComponent(filter.status)}&`;
    }
    if (filter.species) {
      url += `species=${encodeURIComponent(filter.species)}&`;
    }
    if (filter.type) {
      url += `type=${encodeURIComponent(filter.type)}&`;
    }
    if (filter.gender) {
      url += `gender=${encodeURIComponent(filter.gender)}&`;
    }
    // Remove the trailing "&" or "?" if necessary
    url = url.endsWith('&') || url.endsWith('?') ? url.slice(0, -1) : url;
    return this.http.get<Info<Character[]>>(url);
  }

  /**
   * Creates a new character in Firestore using POST /characters.
   */
  createCharacter(data: Partial<Character>): Observable<Character> {
    return this.http.post<Character>(this.baseUrl, data);
  }

  /**
   * Retrieves the list of characters stored in Firestore using GET /characters.
   */
  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(this.baseUrl);
  }

  /**
   * Retrieves a specific character using GET /characters/:id.
   */
  getCharacterById(id: string): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/${id}`);
  }

  /**
   * Updates a character in Firestore using PATCH /characters/:id.
   */
  updateCharacter(id: string, data: Partial<Character>): Observable<Character> {
    return this.http.patch<Character>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Deletes a character in Firestore using DELETE /characters/:id.
   */
  deleteCharacter(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
  }
}
