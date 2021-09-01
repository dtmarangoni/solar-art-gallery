import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingStateService {
  // Loading state observable
  public isLoading = new BehaviorSubject<boolean>(false);

  /**
   * Sets the loading state.
   * @param state The loading state.
   */
  public setLoadingState(state: boolean) {
    // Emit the loading state
    this.isLoading.next(state);
  }
}
