import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { Location } from 'src/app/shared/models/location.model';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { WeatherService } from 'src/app/core/services/weather.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit{
  favorites:Location[]
  //list of current weather to each favorite according to favorites list
  currentWeatherFavorites:CurrentWeather[]=[]

  constructor(private _favoritesService:FavoritesService,private _weatherService:WeatherService){
  }

  ngOnInit(): void {
    this.favorites=this._favoritesService.getFavorites()
    this.favorites.forEach(f=>{
      this._weatherService.getCurrentWeather(f.Key).subscribe(weather=>{
        this.currentWeatherFavorites.push(weather[0])
      })
    })
  }

  deleteFavorite(favorite:Location){
    this._favoritesService.removeFromFavorites(favorite.Key)
  }

}
