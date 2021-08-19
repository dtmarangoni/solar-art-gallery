import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * Constructs the App component.
   * @param auth The Auth0 service.
   */
  constructor(public auth: AuthService) {}
}
