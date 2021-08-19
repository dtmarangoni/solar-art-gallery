import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@auth0/auth0-spa-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // The Auth0 user profile information
  userProfile!: User;
  // The Auth0 user profile subscription
  private userProfileSubs!: Subscription;

  /**
   * Constructs the header component.
   * @param domDocument The DOM document.
   * @param auth The Auth0 service.
   */
  constructor(
    @Inject(DOCUMENT) private domDocument: Document,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userProfileSubs = this.auth.user$.subscribe(
      (profile) => (this.userProfile = profile as User)
    );
  }

  /**
   * Sign in users redirecting them to Auth0 login page.
   */
  signInWithRedirect(): void {
    this.auth.loginWithRedirect();
  }

  /**
   * Sign up users redirecting them to Auth0 login page.
   */
  signUpWithRedirect(): void {
    this.auth.loginWithRedirect({ screen_hint: 'signup' });
  }

  /**
   * Sign out users redirecting them to application starting page.
   */
  signOutWithRedirect(): void {
    this.auth.logout({ returnTo: this.domDocument.location.origin });
  }

  /**
   * Avoid memory leaks unsubscribing from all registered services.
   */
  ngOnDestroy(): void {
    this.userProfileSubs.unsubscribe();
  }
}
