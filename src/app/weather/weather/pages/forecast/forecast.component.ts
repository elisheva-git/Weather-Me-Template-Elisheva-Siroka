import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { Location } from 'src/app/shared/models/location.model';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { LocationService } from 'src/app/core/services/location.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit,OnChanges {
  constructor(private _favoriteService: FavoritesService, private _locationService: LocationService,
    private _acr: ActivatedRoute, private _weatherService: WeatherService, private _snackBar: MatSnackBar) {

  }
  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentCity && changes.currentCity.currentValue!=changes.currentCity.previousValue) {
      console.log("yes")
      this.selectedCity(changes.currentCity.currentValue)
    }
  }

  // This variable contains the current location
  // It receives it as input from the search component
  // And changes are absorbed (selected diffrent location) in ngOnChanges
  @Input()
  currentCity: Location
  forecast: Forecast
  isInFavorite: boolean

  selectedCity(cityChoose: Location) {
    this.currentCity = cityChoose;
    this._weatherService.getForecast(cityChoose.Key).subscribe(forecast_ => 
      this.forecast = forecast_
    , err => 
      this.openDialogError("Oops, fault please try again")
    )
    this.isInFavorite = this._favoriteService.isInFavorite(this.currentCity.Key)
  }

  addOrDeleteFavorite() {
    if (this.isInFavorite) {
      this._favoriteService.removeFromFavorites(this.currentCity.Key)
    }
    else {
      this._favoriteService.addToFavorites(this.currentCity)
    }
    this.isInFavorite = !this.isInFavorite
  }

  //change the temperature from Celsius/Fahrenheit
  unitTempChange() {
    this._weatherService.isMetric = !this._weatherService.isMetric
    this._weatherService.getForecast(this.currentCity.Key).subscribe(forecast_ => {
      this.forecast = forecast_
    }, err => {
      this.openDialogError("Oops, fault please try again")
    })
  }

  openDialogError(message: string, action: string = "x") {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}
