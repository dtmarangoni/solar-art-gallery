import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';

import { LoadingStateService } from '../services/loading-state/loading-state.service';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  /**
   * Constructs the Http Error Interceptor.
   * @param loadingState The Loading State service.
   * @param modalService The MDB angular modal service.
   * @param router The Angular router service.
   */
  constructor(
    private loadingState: LoadingStateService,
    private modalService: MdbModalService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Set the loading state as not loading in case of error
        this.loadingState.setLoadingState(false);

        // Create the error message
        const errorMessage = error?.error?.message
          ? error?.error?.message
          : 'An error happened, please try again later.';

        // Display it in error modal
        this.modalService
          .open(ErrorModalComponent, {
            modalClass: 'modal-dialog-centered',
            data: { errorMessage },
          })
          .onClose.subscribe(() => {
            // If the error is 404, navigate to page not found
            if (error.status === 404) this.router.navigate(['**']);
          });

        // Emits the error notification to observer
        return throwError(errorMessage);
      })
    );
  }
}
