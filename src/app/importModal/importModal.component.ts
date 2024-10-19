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
          this.errorMessage = null;
        } catch (error) {
          this.errorMessage = 'Invalid JSON format. Please try again.'
          this.fileData = null;
        }
      };
      reader.readAsText(file);
    }
  }

  public importData(): void {
    if (this.fileData) {
      for (const key in this.fileData) {
        if (this.fileData.hasOwnProperty(key)) {
          localStorage.setItem(key, JSON.stringify(this.fileData[key]));
        }
      }
      alert('Data successfully imported into localStorage');
      // Close the modal and indicate success
      this.dialogRef.close(true); 
    }
  }

    // Validate the structure of the JSON
    validateJson(json: any): boolean {
      if (
        json.hasOwnProperty('username') &&
        typeof json.username === 'string' &&
        json.hasOwnProperty('totalDistance') &&
        typeof json.totalDistance === 'number' &&
        json.hasOwnProperty('startingLocation') &&
        this.validateLocation(json.startingLocation) &&
        json.hasOwnProperty('goals') &&
        Array.isArray(json.goals) &&
        json.goals.every(this.validateGoal)
      ) {
        return true;
      }
      return false;
    }
  
    // Validate starting location structure
    validateLocation(location: any): boolean {
      return (
        location.hasOwnProperty('lat') &&
        typeof location.lat === 'number' &&
        location.hasOwnProperty('long') &&
        typeof location.long === 'number' &&
        location.hasOwnProperty('placeName') &&
        typeof location.placeName === 'string'
      );
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