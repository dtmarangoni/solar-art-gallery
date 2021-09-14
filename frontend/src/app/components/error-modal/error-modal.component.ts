import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
})
export class ErrorModalComponent implements OnInit {
  // The error message that will be passed to modal
  errorMessage!: string;

  /**
   * Constructs the Error modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<ErrorModalComponent>) {}

  ngOnInit(): void {}
}
