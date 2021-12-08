import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FavoritesPage } from './pages/favorites/favorites.page';
import { SearchPage } from './pages/search/search.page';
import { WeatherRoutingModule } from './weather-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from 'src/app/core/services/location.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { FavoritesService } from 'src/app/core/services/favorites.service';



@NgModule({
  declarations: [
    SearchPage, 
    FavoritesPage
  ],
  imports: [
    CommonModule,
    WeatherRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers:[LocationService,WeatherService,FavoritesService]
})
export class WeatherModule { }
