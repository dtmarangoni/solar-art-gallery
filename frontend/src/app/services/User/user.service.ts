import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';

import { environment } from '../../../environments/environment';
import { PutUserResponse } from '../../../models/API/UserResponses';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // User API endpoints
  private endpoints = environment.apiHost.user;
  // User subject observable
  public user = new Subject<{ message: string }>();

  /**
   * Constructs the User service.
   * @param http The Angular HTTP client service.
   */
  constructor(private http: HttpClient) {}

  /**
   * Add or edit an user.
   */
  public putUser() {
    // Perform the add / edit request
    this.http
      .put<PutUserResponse>(this.endpoints.putUser, { responseType: 'json' })
      .subscribe((response) => {
        // Emit the put user API response
        this.user.next(cloneDeep(response));
      });
  }
}
