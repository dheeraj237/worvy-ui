import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './shared/route.animation';

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
    public afAuth: AngularFireAuth,
    public auth: AuthService
  ) { }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
