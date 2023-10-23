import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokemonService } from './../../services/pokemon.service';


@Component({
  selector: 'app-pokemon-info-dialog',
  templateUrl: './pokemon-info-dialog.component.html',
  styleUrls: ['./pokemon-info-dialog.component.scss']
})
export class PokemonInfoDialogComponent {

  //Pokemon info
  pokemonImg: any;

  //Spinner control
  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private PokemonService: PokemonService,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit(){
    this.searchPokemonImg(this.data.pokemonName)
  }

  searchPokemonImg(pokemonName: string) {
    this.isLoading = true;
    this.PokemonService.searchPokemonById(pokemonName).subscribe(res =>{
      this.pokemonImg = res.sprites.front_default;
      this.isLoading = false;
      this.ref.detectChanges();
    })
  }

}
