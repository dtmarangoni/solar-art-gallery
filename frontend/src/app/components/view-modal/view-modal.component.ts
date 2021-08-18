import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { Art } from '../../../models/database/Art';

@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.component.html',
  styleUrls: ['./view-modal.component.scss'],
})
export class ViewModalComponent implements OnInit {
  // The art item that will be passed to modal
  art!: Art;

  /**
   * Constructs the View modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<ViewModalComponent>) {}

  ngOnInit(): void {}
}
