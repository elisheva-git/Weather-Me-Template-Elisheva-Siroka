import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import { Location } from 'src/app/shared/models/location.model';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, tap } from 'rxjs/operators';

//the default - Tel Aviv key
const DEFAULT_CITY_KEY = "215854"

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage {
  myControl = new FormControl();
  options$: Observable<Location[]>;
  currentCity: Location
  forecast: Forecast
  isInFavorite: boolean

  constructor(private _favoriteService: FavoritesService, private _locationService: LocationService,
    private _acr: ActivatedRoute, private _weatherService: WeatherService, private _snackBar: MatSnackBar) {

  }
  ngOnInit() {
    this._acr.paramMap.subscribe(params => {
      if (params.has("locationKey")) {
        this._locationService.getLocationByKey(params.get("locationKey")).subscribe(city => {
          this.selectedCity(city)
        })
      }
      else {
        //Initializes the location to the user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this._locationService.getGeoposition(position.coords.latitude, position.coords.longitude).subscribe(data => {
              this.selectedCity(data)
              return
            })
          }), (_err: any) => {
            this._locationService.getLocationByKey(DEFAULT_CITY_KEY).subscribe(city => {
              this.selectedCity(city)
            })
          };
        }
        this._locationService.getLocationByKey(DEFAULT_CITY_KEY).subscribe(city => {
          this.selectedCity(city)
        })
      }
    })
    //improve the serching with debounceTime
    this.myControl.valueChanges.pipe(
      debounceTime(500),
      tap(val => console.log(val))
    ).subscribe(data => {
      this.options$ = this._locationService.getAutocompleteLocation(this.myControl.value).pipe(
        catchError(err => this.errorOnKeyPress)
      )
    }
    );
  }

  displayCityName(location: Location): string {
    return location && location.LocalizedName ? location.LocalizedName : '';
  }

  errorOnKeyPress() {
    this.openDialogError("oops fault, please Enter data again")
  }

  selectedCity(cityChoose: Location) {
    this.currentCity = cityChoose;
    this._weatherService.getForecast(cityChoose.Key).subscribe(forecast_ => {
      this.forecast = forecast_
    }, err => {
      this.openDialogError("Oops, fault please try again")
    })
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


