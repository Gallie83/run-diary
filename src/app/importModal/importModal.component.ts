import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-modal',
  template: `
  <div class="import-modal">
      <h2 mat-dialog-title>Import JSON Data</h2>
      <div>
        <input type="file" (change)="onFileSelected($event)" accept=".json" />
        <button (click)="importData()" [disabled]="!fileData">Import</button>
      </div>
    </div>
`,
styleUrls: ['importModal.component.less']
})
export class ImportModalComponent {
  fileData: any = null;
  errorMessage: string | null = null;
  
  constructor(public dialogRef: MatDialogRef<ImportModalComponent>) {}

  // User chooses file ot import which is then checked for structure validation 
  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if( target.files && target.files.length) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.fileData = JSON.parse(e.target?.result as string);
          // Ensure JSON structure is in expected format
          const isValid = this.validateJson(this.fileData);
          if(!isValid) {
            alert('Invalid JSON structure. Please try again')
            console.log(this.fileData)
            this.fileData = null;
          }
          this.errorMessage = null;
        } catch (error) {
          this.errorMessage = 'Invalid JSON format. Please try again.'
          this.fileData = null;
        }
      };
      reader.readAsText(file);
    }
  }

  // Clears localStorage and sets with validated JSON
  public importData(): void {
    if (this.fileData) {
      localStorage.clear()

      // Store validated userData and runningStats separately in localStorage
      if (this.fileData.userData) {
        localStorage.setItem('userData', JSON.stringify(this.fileData.userData));
      }
      if (this.fileData.runningStats) {
        localStorage.setItem('userRunningStats', JSON.stringify(this.fileData.runningStats));
      }

      alert('Data successfully imported into localStorage');
      // Close the modal and indicate success
      this.dialogRef.close(true); 
      window.location.reload()
    }
  }

    // Validate the structure of the JSON
    validateJson(json: any): boolean {
      const hasValidUserData =
        json.hasOwnProperty('userData') &&
        json.userData.hasOwnProperty('username') &&
        typeof json.userData.username === 'string' &&
        json.userData.hasOwnProperty('totalDistance') &&
        typeof json.userData.totalDistance === 'number' &&
        json.userData.hasOwnProperty('startingLocation') &&
        this.validateLocation(json.userData.startingLocation) &&
        json.userData.hasOwnProperty('goals') &&
        Array.isArray(json.userData.goals) &&
        json.userData.goals.every(this.validateGoal);
    
      const hasValidRunningStats =
        json.hasOwnProperty('runningStats') &&
        typeof json.runningStats.totalDistanceRan === 'number' &&
        typeof json.runningStats.numberOfRuns === 'number';
    
      return hasValidUserData && hasValidRunningStats;
    }
  
    // Validate starting location structure
    validateLocation(location: any): boolean {
      if (
        location.hasOwnProperty('lat') &&
        (typeof location.lat === 'number' || !isNaN(Number(location.lat))) &&
        location.hasOwnProperty('long') &&
        (typeof location.long === 'number' || !isNaN(Number(location.long))) &&
        location.hasOwnProperty('placeName') &&
        typeof location.placeName === 'string'
      ) {
        // Convert lat and long to numbers if they are strings
        location.lat = Number(location.lat);
        location.long = Number(location.long);
        return true;
      } else {
        console.log('loc')
        return false
      }
    }
  
    // Validate goals structure
    validateGoal(goal: any): boolean {
      return (
        goal.hasOwnProperty('placeName') &&
        typeof goal.placeName === 'string' &&
        goal.hasOwnProperty('completed') &&
        typeof goal.completed === 'boolean'
      );
    }

}