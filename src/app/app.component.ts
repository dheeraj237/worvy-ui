import { Component, HostBinding } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './shared/route.animation';

import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSlideToggleChange } from '@angular/material';

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

  constructor(
    public overlayContainer: OverlayContainer,
    public afAuth: AngularFireAuth,
    public auth: AuthService
  ) { }

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
