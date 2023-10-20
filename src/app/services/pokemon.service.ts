import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(
    private httpClient: HttpClient
  ) { }

  searchPokemonByType(pokemonType: string) {
    return this.httpClient.get<any>('https://pokeapi.co/api/v2/type/' + pokemonType)
  }
}
