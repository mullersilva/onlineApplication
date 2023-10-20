import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule  } from '@angular/material/dialog';
import { PokemonService } from './../../services/pokemon.service';


@Component({
  selector: 'app-pokemon-info-dialog',
  templateUrl: './pokemon-info-dialog.component.html',
  styleUrls: ['./pokemon-info-dialog.component.scss']
})
export class PokemonInfoDialogComponent {

  //Pokemon info
  pokemonImg: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private PokemonService: PokemonService,
  ) {}

  ngOnInit(){
    this.searchPokemonImg(this.data.pokemonName)
  }

  searchPokemonImg(pokemonName: string) {
    this.PokemonService.searchPokemonById(pokemonName).subscribe(res =>{
      this.pokemonImg = res.sprites.front_default;
    })
  }

}
