import { Component, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router, RouterEvent } from '@angular/router';
import { slideInAnimation } from './shared/route.animation';

import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSlideToggleChange, MatSidenav } from '@angular/material';

import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
})
export class AppComponent {
  title = 'Worvy';
  routerLoading = false;

  @ViewChild('sidenav', { static: true })
  public sidenav: MatSidenav;

  constructor(
    private overlayContainer: OverlayContainer,
    public afAuth: AngularFireAuth,
    public auth: AuthService,
    private router: Router,
    elementRef: ElementRef
  ) {
    const hammertime = new Hammer(elementRef.nativeElement, {});
    hammertime.on('panright', (ev) => {
      if (ev.center.x >= 1 && ev.center.x <= 70) {
        this.sidenav.open();
      }
    });
    hammertime.on('panleft', (ev) => {
      this.sidenav.close();
    });

    this.router.events.subscribe((event: RouterEvent) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.routerLoading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.routerLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  @HostBinding('class') componentCssClass;

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  onSetTheme(event: MatSlideToggleChange) {
    let theme = "default-theme";
    if (event.checked) {
      theme = "dark-theme";
    }
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
}
