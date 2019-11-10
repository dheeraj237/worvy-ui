import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-progressbar',
  template: `
    <div *ngIf="loaderService.isLoading | async" >
      <mat-progress-bar [color]="color" [mode]="mode" [value]="value"></mat-progress-bar>
    </div>
  `,
  styles: []
})
export class ProgressbarComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  // isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
  }

}
