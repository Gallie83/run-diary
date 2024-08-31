import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { environment } from '../environments/environment.development';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import { Injectable } from  '@angular/core';
import { AddressCardComponent, IAddressDetails } from './addressCard.component';

import NodeGeolocation from 'nodejs-geolocation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    NgIf,
    NgFor,
    RouterOutlet,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    AddressCardComponent
  ],
  providers: [  
    MatDatepickerModule,
    MatNativeDateModule  
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})


@Injectable({
  providedIn:  'root'
})
export class AppComponent implements OnInit, AfterViewInit{
  constructor(private https: HttpClient) { }
  
  title = 'run-diary';

  public user: IUserData  = {
    username: '', 
    totalDistance: 0, 
    startingLocation: {
      lat:        0, 
      long:       0, 
      placeName:  ''
    }};
  public firstGoal: IGoal = {
    placeName: '',
    progress: 0,
    coords: {
      lat: 0,
      long: 0,
      placeName: ''
    },
  }
  public newUser: boolean = false;
  public username: string = '';
  public locationSearch: string = '';

  public addingGoal: boolean = false;
  public addingRun: boolean = false;

  public apiResponse: any = [];
  public distanceToGoal: number = 0;
  public kilometers: boolean = true;

  public distanceRan: number = 0;

  public totalDistanceRan: number = 0;

  // Check if user exists in local storage
  ngOnInit(): void {
      //Todo: update type
      let storage: any;
      let userGoal: any;

      const geo = new NodeGeolocation('MyApp')

      try {
        storage = localStorage.getItem('userData');
        userGoal = localStorage.getItem('userGoal');
        
        // Checks if user has data in localStorage
        if(storage !== "" && storage ) {
          storage = JSON.parse(storage);
          this.user = storage;
        }

        // Retrieves users goal data from storage and sets to firstGoal instance
        if(userGoal) {
          userGoal = JSON.parse(userGoal)
          this.firstGoal = userGoal;

          // Calculates distance from startingLocation to firstGoal
          const startingPosition = {lat:this.user.startingLocation.lat, lon:this.user.startingLocation.long}
          const endPosition = {lat:this.firstGoal.coords.lat, lon:this.firstGoal.coords.long}
          const calculatedDistance = geo.calculateDistance(startingPosition,endPosition)

          // Converts distanceToGoal to a number before saving
            if (typeof calculatedDistance === 'string') {
              const parsedDistance = parseFloat(calculatedDistance);
              if (!isNaN(parsedDistance)) {
                this.distanceToGoal = parsedDistance;
              } else {
                console.error('Invalid number format');
              }
            } else {
              this.distanceToGoal = calculatedDistance;
            }

          
        }

      } catch (error) {
        console.log(error);
      }

      if (!storage) {
        this.newUser = true;
      }
  }

  ngAfterViewInit(): void {
    
  }

  // Makes a Get request from Geocode API
  public getQueryUrl(searchTerm: string): string {
    const formattedSearch: string = searchTerm.replaceAll(' ', '+')
    return `https://geocode.maps.co/search?q=${formattedSearch}&api_key=${environment.apiKey}`;
  }

  // Returns list of location based on user input
  public generateLocationList(): void {
    this.convertAddress(this.locationSearch);
  }

  public async convertAddress(address: string): Promise<ICoordinates> {

    const valueToReturn: ICoordinates = {
      lat:        0, 
      long:       0, 
      placeName:   address
    }

    this.https.get<IAddressDetails[]>(this.getQueryUrl(this.locationSearch)).subscribe(
      (response) => {
        console.log(this.apiResponse);
        this.apiResponse = response;
      });


    return valueToReturn
  } 

  // Distance numbers not changing when Km/Mi button is clicked
  public distanceConverter(item: number | string):void {
    if(!this.kilometers) {
      this.distanceRan = 1.609344*this.distanceRan
      this.distanceToGoal = 1.609344*this.distanceToGoal      
      this.totalDistanceRan = 1.609344*this.totalDistanceRan
    } 
    if(this.kilometers) {
      this.distanceRan = 1.609344*this.distanceRan
      this.distanceToGoal = 0.621371*this.distanceToGoal      
      this.totalDistanceRan = 0.621371*this.totalDistanceRan
    }
  }

  public setUsername(): void {
    if(this.username){
      this.user.username = this.username
    }
  }

  public setLocation(item: any): void {
    if(!item.lon || !item.lat || !item.display_name) {
      console.log("Oops somethings gone wrong ... aborting")
      return
    }
    this.user.startingLocation.long = item.lon;
    this.user.startingLocation.lat = item.lat;
    this.user.startingLocation.placeName = item.display_name;
  } 

  
  // User chosen location added as firstGoal 
  public setGoal(item: any): void {
    if(!item.lon || !item.lat || !item.display_name) {
      console.log("Oops somethings gone wrong ... aborting")
      return
    }
    this.firstGoal.coords.long = item.lon;
    this.firstGoal.coords.lat = item.lat;
    this.firstGoal.coords.placeName = item.display_name;
    this.firstGoal.placeName = item.display_name;
    // Save IGoal instance to localStorage and hide First Goal component
    localStorage.setItem('userGoal', JSON.stringify(this.firstGoal));
    this.addingGoal = false;
    // window.location.reload();
  }
  
  public logRun(item: number): void {
    this.distanceRan = item;
    this.totalDistanceRan = this.totalDistanceRan + this.distanceRan
    console.log(this.totalDistanceRan)
  }
  
  // Stops user from submitting initial form if missing required fields
  public get saveDisabled(): boolean {
    return this.user?.username === "" || 
      !this.user?.startingLocation.long || 
      !this.user?.startingLocation.lat || 
      !this.user?.startingLocation.placeName;
  }
  
  public saveForm(): void {
    // Save IUserData instance to localStorage then refresh page
    localStorage.setItem('userData', JSON.stringify(this.user));
    window.location.reload();
  }
  
}

export interface ICoordinates {
  lat:       number,
  long:      number,
  placeName: string
}

export interface IGoal {
  placeName: string,
  progress:  number | string,
  coords:    ICoordinates
}

export interface IUserData {
  username:         string,
  totalDistance:    number,
  startingLocation: ICoordinates,
  goals?:           IGoal[]
}
