import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { Art } from '../../../models/database/Art';

@Component({
  selector: 'app-art-modal',
  templateUrl: './art-modal.component.html',
  styleUrls: ['./art-modal.component.scss'],
})
export class ArtModalComponent implements OnInit {
  // The art item that will be passed to modal
  art!: Art;

  /**
   * Constructs the Art modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<ArtModalComponent>) {}

  ngOnInit(): void {}
}
