import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  /**
   * Constructs the Confirm modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<ConfirmModalComponent>) {}

  ngOnInit(): void {}

  /**
   * Send back the delete confirmation after user clicking in Yes
   * button.
   */
  onYesConfirm() {
    this.modalRef.close(true);
  }
}
