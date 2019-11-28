import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';


//module
import { OverlayModule } from '@angular/cdk/overlay';
import { MaterialModule } from './core/modules';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressbarComponent } from './shared/components/progressbar/progressbar.component';
import { LoaderService } from './shared/services/loader.service';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import { DiscoverComponent } from './discover/discover.component';



@NgModule({
  declarations: [
    AppComponent,
    ProgressbarComponent,
    DiscoverComponent
  ],
  imports: [
    OverlayModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
