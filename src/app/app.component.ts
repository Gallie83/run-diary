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

  public user: IUserData  = {username: '', totalDistance: 0};
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

  public logUsername(): void {
    console.log(this.username);
    this.user.username = this.username;
    console.log(this.user);
    // Save IUserData instance to localStorage then refresh page
    localStorage.setItem('userData', JSON.stringify(this.user));
    window.location.reload();
  }
}

export interface ICoordinates {
  lat:  number,
  long: number
}

export interface IGoal {
  placeName: string,
  progress:  number,
  coords:    ICoordinates
}

export interface IUserData {
  username:      string,
  totalDistance: number,
  goals?:        IGoal[]
}
