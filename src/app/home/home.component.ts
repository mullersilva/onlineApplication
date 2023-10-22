import { PokemonService } from './../services/pokemon.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WeatherService } from '../services/weather.service';
import { Pokemon } from '../models/pokemon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog , MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { PokemonInfoDialogComponent } from '../shared/pokemon-info-dialog/pokemon-info-dialog.component';
import { PokemonType } from '../enums/pokemon-type.enum';

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

  //Spinner control
  isLoading: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private PokemonService: PokemonService,
    private ref: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  searchWeatherMap(city: string) {
    this.showGrid = false;
    this.isLoading = true;

    this.weatherService.searchWeatherMap(city).subscribe((res) => {
      this.prepareData(res);

      if (!this.isRain) {
        this.pokemonDefinition();
      } else {
        this.pokemonType = 'electric';
        this.isLoading = false;
      }

      this.searchPokemonByType();
    },
    (error) => {
      console.error('Ocorreu um erro na requisição de clima:', error);
      this.isLoading = false;
      this.showMessage('Prepare-se para a encrenca, encrenca em dobro! Cidade não encontrada =(');
    }
    );
  }

  searchPokemonByType() {
    this.PokemonService.searchPokemonByType(this.pokemonType).subscribe(
      (res) => {
        this.pokemonNameSelected = res.id;
        const pokemonNames: Pokemon[] = [];

        for (let i = 0; i < res.pokemon.length; i++) {
          const name = res.pokemon[i].pokemon.name;
          pokemonNames.push(name);
        }

        this.randomlySelect(pokemonNames);
      },
    );
  }

  prepareData(data: any) {
    const temperatureKelvin = data.main.temp;

    this.kelvinConverter(temperatureKelvin);
    this.isRain = data.weather[0].main === 'Rain';
  }

  kelvinConverter(temperatureKelvin: number) {
    const absoluteZero = 273.15;
    this.temperatureCelsius = Math.round(temperatureKelvin - absoluteZero);
  }

  pokemonDefinition() {
    switch (true) {
      case this.temperatureCelsius < 5:
        this.pokemonType = PokemonType.Ice;
        break;
      case this.temperatureCelsius >= 5 && this.temperatureCelsius < 10:
        this.pokemonType = PokemonType.Water;
        break;
      case this.temperatureCelsius >= 12 && this.temperatureCelsius < 15:
        this.pokemonType = PokemonType.Grass;
        break;
      case this.temperatureCelsius >= 15 && this.temperatureCelsius < 21:
        this.pokemonType = PokemonType.Ground;
        break;
      case this.temperatureCelsius >= 23 && this.temperatureCelsius < 27:
        this.pokemonType = PokemonType.Bug;
        break;
      case this.temperatureCelsius >= 27 && this.temperatureCelsius < 33:
        this.pokemonType = PokemonType.Rock;
        break;
      case this.temperatureCelsius > 33:
        this.pokemonType = PokemonType.Fire;
        break;
      default:
        this.pokemonType = PokemonType.Normal;
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
    this.isLoading = false;
    this.ref.detectChanges();
    this.openPokemonView();
    this.showMessage('Pokemon localizado com sucesso!');
  }

  showMessage(mensagem: string) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 5000,
      verticalPosition: "top"
    });
  }

  openPokemonView() {
    this.dialog.open(PokemonInfoDialogComponent, {
      width: '450px',
      data: {
        temperature: this.temperatureCelsius,
        rain: this.isRain ,
        pokemonName: this.pokemonNameSelected ,
        type: this.pokemonType,
      },
    });

  }
}
