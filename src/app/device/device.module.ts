import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';

import { MaterialModule } from '../core/modules/material-module/material-module.module'

import { TimeagoPipe } from '../core/pipes/timeago.pipe';


@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ]
})
export class DeviceModule { }
