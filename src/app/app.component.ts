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
  public secondGoal: IGoal = {
    placeName: '',
    progress: 0,
    coords: {
      lat: 0,
      long: 0,
      placeName: ''
    },
  }
  public thirdGoal: IGoal = {
    placeName: '',
    progress: 0,
    coords: {
      lat: 0,
      long: 0,
      placeName: ''
    },
  }
  public runningStats: IRunningStats = {
    totalDistanceRan: 0,
    numberOfRuns: 0
  }

  public newUser: boolean = false;
  public username: string = '';

  public locationSearch: string = '';
  public noResultsFound: boolean = false;

  public addingGoal: boolean = false;
  public addingRun: boolean = false;

  public apiResponse: any = [];
  public distanceToGoal: number = 0;
  public kilometers: boolean = true;

  public distanceRan: number = 1;

  ngOnInit(): void {
    //Todo: update type
    let storage: any;
    let userRunningStats: any;
    
    
    // Check if user exists in local storage
      try {
        storage = localStorage.getItem('userData');
        userRunningStats = localStorage.getItem('userRunningStats');
        
        // Checks if user has data in localStorage
        if(storage !== "" && storage ) {
          storage = JSON.parse(storage);
          this.user = storage;
        }

        this.setUserGoal()

        if(userRunningStats) {
          userRunningStats = JSON.parse(userRunningStats);
          this.runningStats = userRunningStats;
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

  public setUserGoal(): void {
    let userGoal: any;
    userGoal = localStorage.getItem('userGoal');
    const geo = new NodeGeolocation('MyApp')
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
  }

  // Makes a Get request from Geocode API
  public getQueryUrl(searchTerm: string): string {
    const formattedSearch: string = searchTerm.replaceAll(' ', '+')
    return `https://geocode.maps.co/search?q=${formattedSearch}&api_key=${environment.apiKey}`;
  }

  // Returns list of location based on user input
  public generateLocationList(): void {
    this.noResultsFound = false;
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
        if(this.apiResponse.length === 0) {
          this.noResultsFound = true;
        }
      });


    return valueToReturn
  } 

  public convertDistance(): void {
    this.kilometers = !this.kilometers;
    this.distanceConverter();
  }

  // Switch between Kilometers/Miles
  public distanceConverter():void {
    if(!this.kilometers) {
      this.distanceToGoal = Math.round(1.609344*this.distanceToGoal)
      let distance = 0;
      // Rounds totalDistanceRan to 2 decimal places
      distance = 1.609344*this.runningStats.totalDistanceRan
      this.runningStats.totalDistanceRan = Number(distance.toFixed(2))
    } 
    if(this.kilometers) {
      this.distanceToGoal = Math.round(0.621371*this.distanceToGoal)      
      let distance = 0;
      // Rounds totalDistanceRan to 2 decimal places
      distance = 0.621371*this.runningStats.totalDistanceRan
      this.runningStats.totalDistanceRan = Number(distance.toFixed(2))
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

    let goal = this.firstGoal;
    
    if(this.firstGoal.coords.lat !== 0 && this.firstGoal.coords.long !== 0) {
      goal = this.secondGoal
      console.log(goal)
      console.log(this.secondGoal)
    } else if (this.secondGoal.coords.lat !== 0 && this.secondGoal.coords.long !== 0) {
      console.log(3)
      goal = this.thirdGoal
      console.log(goal)
    }
    goal.coords.long = item.lon;
    goal.coords.lat = item.lat;
    goal.coords.placeName = item.display_name;
    goal.placeName = item.display_name;
    // Save IGoal instance to localStorage and hide Add a Goal component
    localStorage.setItem('userGoal', JSON.stringify(goal));
    this.addingGoal = false;
    this.setUserGoal();
  }
  
  public logRun(item: number): void {
    if (this.distanceRan > 0) {
      this.distanceRan = item;
      // Adds distanceRan to totalDistanceRan and rounds to 2 decimal places
      this.runningStats.totalDistanceRan = this.runningStats.totalDistanceRan + this.distanceRan
      this.runningStats.totalDistanceRan = Number(this.runningStats.totalDistanceRan.toFixed(2))
      this.runningStats.numberOfRuns++
      localStorage.setItem('userRunningStats', JSON.stringify(this.runningStats));
      // If in miles then change to kilometers before saving and then change it back
      if(!this.kilometers) {
        this.convertDistance()
        localStorage.setItem('userRunningStats', JSON.stringify(this.runningStats));
        this.convertDistance()
      }
      // Closes Log a Run component and resets distanceRan
      this.addingRun = !this.addingRun;
      this.distanceRan = 1;
    }
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

// Interfaces

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

export interface IRunningStats {
  totalDistanceRan: number;
  numberOfRuns:     number;
}
