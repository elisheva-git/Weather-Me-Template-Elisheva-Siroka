import { Component, ChangeDetectionStrategy, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
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
//If the user does not confirm the Identify of the place or the Identify does not work 
//so it use the default
const DEFAULT_CITY_KEY = "215854"

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage implements OnInit,OnDestroy{
  myControl = new FormControl();
  options$: Observable<Location[]>;
  currentCity: Location=null
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
            this._locationService.getGeoposition(position.coords.latitude, position.coords.longitude)
            .subscribe(data => {
              this.selectedCity(data)
              return
            })
          }), (_err: any) => {
            this._locationService.getLocationByKey(DEFAULT_CITY_KEY).subscribe(city => {
              this.selectedCity(city)
              return
            })
          };
        }else{
          this._locationService.getLocationByKey(DEFAULT_CITY_KEY).subscribe(city => {
            this.selectedCity(city)
          })
        }
      }
    })
    //improve the serching with debounceTime
    this.myControl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => {
      this.options$ = this._locationService.getAutocompleteLocation(this.myControl.value).pipe(
        catchError(err => this.errorOnKeyPress)
      )
    }
    );
  }

  ngOnDestroy(): void {
    
  }

  displayCityName(location: Location): string {
    return location && location.LocalizedName ? location.LocalizedName : '';
  }

  errorOnKeyPress() {
    this.openDialogError("oops fault, please Enter data again")
  }


  selectedCity(cityChoose: Location) {
    console.log(cityChoose.LocalizedName)
    this.currentCity = cityChoose;
  }

  openDialogError(message: string, action: string = "x") {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}


