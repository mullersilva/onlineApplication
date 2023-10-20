import { PokemonService } from './../services/pokemon.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WeatherService } from '../services/weather.service';
import { Pokemon } from '../models/pokemon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  //Form
  cityFormControl = new FormControl('', [Validators.required]);

  //weather info
  temperatureCelsius: number = 0;
  isRain: boolean = false;

  //Pokemon info
  pokemonType: string = '';
  pokemonNameSelected: string = '';

  //Grid control
  showGrid: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private PokemonService: PokemonService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  searchWeatherMap(city: string) {
    this.showGrid = false;

    this.weatherService.searchWeatherMap(city).subscribe((res) => {
      this.prepareData(res);

      if (!this.isRain) {
        this.pokemonDefinition();
      } else {
        this.pokemonType = 'electric';
      }

      this.searchPokemonByType();
    });
  }

  searchPokemonByType() {
    this.PokemonService.searchPokemonByType(this.pokemonType).subscribe(
      (res) => {
        const pokemonNames: Pokemon[] = [];

        for (let i = 0; i < res.pokemon.length; i++) {
          const name = res.pokemon[i].pokemon.name;
          pokemonNames.push(name);
        }

        this.randomlySelect(pokemonNames);
      }
    );
  }

  prepareData(data: any) {
    const temperatureFahrenheit = data.main.temp;

    this.fahrenheitConverter(temperatureFahrenheit);
    this.isRain = data.weather[0].main === 'Rain';
  }

  fahrenheitConverter(temperatureFahrenheit: number) {
    const absoluteZero = 273.15;
    this.temperatureCelsius = Math.round(temperatureFahrenheit - absoluteZero);
  }

  pokemonDefinition() {
    switch (true) {
      case this.temperatureCelsius < 5:
        this.pokemonType = 'ice';
        break;
      case this.temperatureCelsius >= 5 && this.temperatureCelsius < 10:
        this.pokemonType = 'water';
        break;
      case this.temperatureCelsius >= 12 && this.temperatureCelsius < 15:
        this.pokemonType = 'grass';
        break;
      case this.temperatureCelsius >= 15 && this.temperatureCelsius < 21:
        this.pokemonType = 'ground';
        break;
      case this.temperatureCelsius >= 23 && this.temperatureCelsius < 27:
        this.pokemonType = 'bug';
        break;
      case this.temperatureCelsius >= 27 && this.temperatureCelsius < 33:
        this.pokemonType = 'rock';
        break;
      case this.temperatureCelsius > 33:
        this.pokemonType = 'fire';
        break;
      default:
        this.pokemonType = 'normal';
    }
  }

  randomlySelect(pokemonNames: any) {
    const currentName = this.pokemonNameSelected;
    let randomPokemonName = currentName;

    if (currentName) {
      while (randomPokemonName === currentName) {
        const randomIndex = Math.floor(Math.random() * pokemonNames.length);
        randomPokemonName = pokemonNames[randomIndex];
      }

      this.pokemonNameSelected = randomPokemonName;
    } else {
      const randomIndex = Math.floor(Math.random() * pokemonNames.length);
      this.pokemonNameSelected = pokemonNames[randomIndex];
    }

    this.showGrid = true;
    this.ref.detectChanges();
  }
}
