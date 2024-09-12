import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule, MatStartDate} from '@angular/material/datepicker';
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
    MatTabsModule,
    MatSlideToggleModule,
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
    MatSlideToggleModule,
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
    },
    goals: []
  };
  public currentGoal: IGoal = {
    placeName: '',
    progress: 0,
    coords: {
      lat: 0,
      long: 0,
      placeName: ''
    },
    completed: false,
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

        if(userRunningStats) {
          userRunningStats = JSON.parse(userRunningStats);
          this.runningStats = userRunningStats;
        }

        this.hydrateUserGoals()
      } catch (error) {
        console.log(error);
      }

      if (!storage) {
        this.newUser = true;
      }
  }

  ngAfterViewInit(): void {
    
  }

  public hydrateUserGoals(): void {
    if(this.user.goals.length === 0) {
      return
    }
    const geo = new NodeGeolocation('MyApp');
    this.user.goals.forEach( (goal: IGoal) => {
      // Calculate user progress for each goal
      goal.progress = this.getUserGoalProgress(goal.distance, this.runningStats.totalDistanceRan);
      if(goal.distance) {
        return
      }
      const startingPosition = {lat:this.user.startingLocation.lat, lon:this.user.startingLocation.long}
      const endPosition = {lat:goal.coords.lat, lon:goal.coords.long}
      const calculatedDistance = geo.calculateDistance(startingPosition,endPosition)
      console.log('hello')
        // Converts distanceToGoal to a number before saving
        if (typeof calculatedDistance === 'string') {
          const parsedDistance = parseFloat(calculatedDistance);
          if (!isNaN(parsedDistance)) {
            goal.distance = parsedDistance;
          } else {
            console.error('Invalid number format');
          }
        } else {
          goal.distance = calculatedDistance;
        }
      }
    )
    console.log(this.user.goals)
  }

  // Returns percentage of progress user has made to a goal 
  public getUserGoalProgress(goalDistance:number | undefined, totalDistance: number): number {
    console.log(goalDistance,totalDistance)
    if(goalDistance === undefined) {
      goalDistance = 0;
    }
    const progress = Number(((totalDistance/goalDistance)*100).toFixed(2))
    return Math.min(progress, 100);
  }

  // When user clicks that the goal is completed, it saves item to localStorage
  public setGoalCompleted(goal: IGoal): void {
    goal.completed = true;
    localStorage.setItem('userData', JSON.stringify(this.user))
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
  }

  // Returns string to display distance value either in Km or Miles 
  public getDisplayDistance(distanceInKm: number | undefined): string {
    if(distanceInKm === 0 || distanceInKm === undefined) {
      return this.kilometers ? '0Km' : '0 Miles'
    }

    return  this.kilometers ? distanceInKm.toString()+'Km' : (0.621371*distanceInKm).toFixed(2)+' Miles'
  } 

  public setGoal(item: any): void {
    if(!item.lon || !item.lat || !item.display_name) {
      console.log("Oops somethings gone wrong ... aborting")
      return
    }
    // Sets item as currentGoal and adds to user.goals array
    this._setCurrentGoal(item);
    this.user.goals.push(this.currentGoal);
    
    this.addingGoal = false;
    // Resets currentGoal and saves user.goals array to localStorage
    this._resetCurrentGoal();
    this.hydrateUserGoals();
    this._updateUserData();
  }
  
  private _updateUserData(): void {
    localStorage.setItem('userData', JSON.stringify(this.user))
  }
  
  private _setCurrentGoal(item: any): void {
    this.currentGoal.coords.long = item.lon;
    this.currentGoal.coords.lat = item.lat;
    this.currentGoal.coords.placeName = item.display_name;
    this.currentGoal.placeName = item.display_name;
  } 
  
  private _resetCurrentGoal(): void {
    this.currentGoal = {
      placeName: '',
      progress: 0,
      coords: {
        lat: 0,
        long: 0,
        placeName: ''
      },
      completed: false
    }
  }
  
  public logRun(item: number): void {
    if (this.distanceRan > 0) {
      this.distanceRan = item;
      // console.log(this.distanceRan + ' 1st')
      // If in miles then calculate value before adding to totalDistanceRan
      if(!this.kilometers) {
        this.distanceRan = Number((item*1.60934).toFixed(2))
        console.log(this.distanceRan)
      }
      // Adds distanceRan to totalDistanceRan and rounds to 2 decimal places
      this.runningStats.totalDistanceRan = this.runningStats.totalDistanceRan + this.distanceRan
      this.runningStats.totalDistanceRan = Number(this.runningStats.totalDistanceRan.toFixed(2))
      this.runningStats.numberOfRuns++
      localStorage.setItem('userRunningStats', JSON.stringify(this.runningStats));

      // Closes Log a Run component and resets distanceRan
      this.addingRun = !this.addingRun;
      this.distanceRan = 1;
    }
  }
  
  // Initial User info form logic

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
  progress:  number,
  coords:    ICoordinates,
  completed: boolean,
  // Measured in Km
  distance?: number
}

export interface IUserData {
  username:         string,
  totalDistance:    number,
  startingLocation: ICoordinates,
  goals:           IGoal[],
}

export interface IRunningStats {
  totalDistanceRan: number;
  numberOfRuns:     number;
}
