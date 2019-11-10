import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

//module
import { MaterialModule } from './core/modules';
import { AboutComponent } from './shared/components/about/about.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    SidenavComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
