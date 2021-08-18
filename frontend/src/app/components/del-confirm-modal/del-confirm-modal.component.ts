import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-del-confirm-modal',
  templateUrl: './del-confirm-modal.component.html',
  styleUrls: ['./del-confirm-modal.component.scss'],
})
export class DelConfirmModalComponent implements OnInit {
  /**
   * Constructs the Confirm modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<DelConfirmModalComponent>) {}

  ngOnInit(): void {}

  /**
   * Send back the delete confirmation after user clicking in Yes
   * button.
   */
  onYesConfirm() {
    this.modalRef.close(true);
  }
}
