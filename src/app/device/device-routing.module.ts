import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DiscoverComponent } from './discover/discover.component';
import { AuthGuard } from '../core/guards/guard.guard';


const routes: Routes = [
  {
    path: 'devices', component: ListComponent, canActivate: [AuthGuard], data: {
      animation: 'DevicePage'
    }
  },
  {
    path: 'devices/discover', component: DiscoverComponent, data: {
      animation: 'DiscoverPage'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }
