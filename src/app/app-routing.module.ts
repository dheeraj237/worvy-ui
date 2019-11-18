import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './guide/about/about.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guards/guard.guard';
import { HomeComponent } from './home/home.component';
import { AutoconnectComponent } from './guide/autoconnect/autoconnect.component';
import { DiscoverComponent } from './device/discover/discover.component';


const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    data: {
      animation: 'HomePage'
    }
  },
  { path: 'autoconnect', component: AutoconnectComponent, canActivate: [AuthGuard] },
  {
    path: 'about', component: AboutComponent,
    data: {
      animation: 'AboutPage'
    }
  },
  {
    path: 'discover-devices', component: DiscoverComponent,
    data: {
      animation: 'DiscoverPage'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
