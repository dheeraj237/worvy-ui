import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MatProgressBarModule, MatMenuModule, MatSlideToggleModule, MatDividerModule, MatGridListModule, MatTabsModule, MatStepperModule, MatProgressSpinnerModule } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

import {
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatBadgeModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({

  imports: [
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatGridListModule,
    MatTabsModule,
    MatStepperModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatGridListModule,
    MatTabsModule,
    MatStepperModule,
    MatDialogModule,
    MatProgressSpinnerModule

  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class MaterialModule { }