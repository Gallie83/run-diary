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
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
// @ts-ignore
import  openGeocoder from 'node-open-geocoder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
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



export class AppComponent implements OnInit, AfterViewInit{

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

  public saveUserDetails(): void {
    // console.log(this.username);
    // this.user.username = this.username;
    // console.log(this.user);
    // // Save IUserData instance to localStorage then refresh page
    // localStorage.setItem('userData', JSON.stringify(this.user));
    // window.location.reload();

    console.log(this.username)
    this.convertAddress(this.username).then(() => console.log('done'));
  }

  public async convertAddress(address: string): Promise<ICoordinates> {

    const valueToReturn: ICoordinates = {
      lat:        0, 
      long:       0, 
      placeName:   address
    }
    await openGeocoder()
      .geocode(address)
      .end((err: any, res: any) => {
        console.log(err)
        console.log(res)
      })

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
