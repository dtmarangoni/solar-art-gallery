import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  /**
   * Constructs the Http Error Interceptor.
   * @param modalService The MDB angular modal service.
   */
  constructor(private modalService: MdbModalService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Create the error message
        const errorMessage = error?.error?.message
          ? error?.error?.message
          : 'An error happened, please try again later.';

        // Display it in error modal
        this.modalService.open(ErrorModalComponent, {
          modalClass: 'modal-dialog-centered',
          data: { errorMessage },
        });

        // Emits the error notification to observer
        return throwError(errorMessage);
      })
    );
  }
}
