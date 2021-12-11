import { Injectable } from '@angular/core';
import { Location } from 'src/app/shared/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: Location[] = [];

  //saving list of favorites in LocalStorage 
  //So that after refresh the page the data will be saved
  getFavoritesFromLocalStorage(){
    this.favorites=JSON.parse(localStorage.getItem("favoritesLocations")) 
    if(this.favorites==null){
      this.favorites=[]
    }
  }

  addToFavorites(location: Location): void {
    this.getFavoritesFromLocalStorage()
    this.favorites.push(location);
    localStorage.setItem("favoritesLocations",JSON.stringify(this.favorites))
  }

  removeFromFavorites(locationKey: string): void {
    this.getFavoritesFromLocalStorage()
    debugger
    const cityToRemoveIndex = this.favorites.findIndex((favorite) => favorite.Key === locationKey);
    this.favorites.splice(cityToRemoveIndex, 1);
    localStorage.setItem("favoritesLocations",JSON.stringify(this.favorites))
  }

  getFavorites(): Location[] {
    this.getFavoritesFromLocalStorage()
    return this.favorites;
  }

  isInFavorite(locationKey: string):boolean{
    this.getFavoritesFromLocalStorage()
    if(this.favorites.find(f=>f.Key==locationKey)!=undefined){
      return true
    }
    return false
  }
}
