import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar) { }

  toast(message: string, duration: number = 2000, action: string = 'Dismiss') {
    this._snackBar.open(message, action, {
      duration: duration,
    });
  }
}
