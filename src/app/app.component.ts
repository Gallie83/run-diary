import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { environment } from '../environments/environment.development';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import { Injectable } from  '@angular/core';

// import  {geocoder} from 'geocoder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    NgIf,
    RouterOutlet,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule
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
  public newUser: boolean = false;
  public username: string = '';

  ngOnInit(): void {
      //Todo: update type
      let storage: any;
      try {
        storage = localStorage.getItem('userData');
      } catch (error) {
        console.log(error);
      }

      if (!storage) {
        this.newUser = true;
      }

    console.log(this.newUser)
  }

  ngAfterViewInit(): void {
    
  }

  public getQueryUrl(searchTerm: string): string {
    const formattedSearch: string = searchTerm.replaceAll(' ', '+')
    return `https://geocode.maps.co/search?q=${formattedSearch}&api_key=${environment.apiKey}`;
  }

  public saveUserDetails(): void {
    // console.log(this.username);
    // this.user.username = this.username;
    // console.log(this.user);
    // // Save IUserData instance to localStorage then refresh page
    // localStorage.setItem('userData', JSON.stringify(this.user));
    // window.location.reload();

    console.log(this.username)
    this.convertAddress(this.username);
  }

  public async convertAddress(address: string): Promise<ICoordinates> {

    const valueToReturn: ICoordinates = {
      lat:        0, 
      long:       0, 
      placeName:   address
    }

    let apiResponse: any[];
    this.https.get(this.getQueryUrl(this.username)).subscribe(
      (response) => {
        console.log(response);
      });


    return valueToReturn
  } 
}

export interface ICoordinates {
  lat:       number,
  long:      number,
  placeName: string
}

export interface IGoal {
  placeName: string,
  progress:  number,
  coords:    ICoordinates
}

export interface IUserData {
  username:         string,
  totalDistance:    number,
  startingLocation: ICoordinates,
  goals?:           IGoal[]
}