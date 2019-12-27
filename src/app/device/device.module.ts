import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';

import { DeviceRoutingModule } from './device-routing.module';

import { MaterialModule } from '../core/modules/material-module/material-module.module'

import { TimeagoPipe } from '../core/pipes/timeago.pipe';
import { DiscoverComponent } from './discover/discover.component';


@NgModule({
  declarations: [
    ListComponent,
    DiscoverComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DeviceRoutingModule
  ],
  exports: [
    ListComponent,
    DiscoverComponent
  ]
})
export class DeviceModule { }

