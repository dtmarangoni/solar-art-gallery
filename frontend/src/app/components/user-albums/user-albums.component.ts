import { Component, OnInit } from '@angular/core';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { AddModalComponent } from '../add-modal/add-modal.component';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { DelConfirmModalComponent } from '../del-confirm-modal/del-confirm-modal.component';
import {
  AddModalTypes,
  EditModalTypes,
  ModalAlbumData,
} from '../../../models/ModalTypes';

@Component({
  selector: 'app-user-albums',
  templateUrl: './user-albums.component.html',
  styleUrls: ['./user-albums.component.scss'],
})
export class UserAlbumsComponent implements OnInit {
  // The add modal reference
  private addModalRef!: MdbModalRef<AddModalComponent>;
  // The edit modal reference
  private editModalRef!: MdbModalRef<EditModalComponent>;
  // The delete confirm modal reference
  private delConfirmModalRef!: MdbModalRef<DelConfirmModalComponent>;

  dummyAlbums = [
    {
      coverUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Claude_Monet_033.jpg/800px-Claude_Monet_033.jpg',
      visibility: 'private',
      creationDate: '2021-01-27T03:03:42Z',
      description:
        'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      title: 'Urban Places',
    },
    {
      coverUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vincent_Willem_van_Gogh_128.jpg/800px-Vincent_Willem_van_Gogh_128.jpg',
      visibility: 'public',
      creationDate: '2020-11-29T00:10:51Z',
      description: 'Sed ante. Vivamus tortor. Duis mattis egestas metus.',
      albumId: 'e6323b1c-038d-43de-a459-4fc78e9c296e',
      title: 'Flowers',
    },
    {
      coverUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Water-Lily_Pond_1900_Claude_Monet_Boston_MFA.jpg/1024px-Water-Lily_Pond_1900_Claude_Monet_Boston_MFA.jpg',
      visibility: 'public',
      creationDate: '2020-11-26T00:34:23Z',
      description:
        'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
      albumId: 'fbefab56-42e1-40af-9145-fbc34cc65f2f',
      title: 'Nature Scenery',
    },
    {
      coverUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Vincent_van_Gogh_-_Self-portrait_with_grey_felt_hat_-_Google_Art_Project.jpg/800px-Vincent_van_Gogh_-_Self-portrait_with_grey_felt_hat_-_Google_Art_Project.jpg',
      visibility: 'public',
      creationDate: '2020-08-10T19:50:02Z',
      description:
        'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
      albumId: '1efc348c-b3ad-4f03-a2ff-423f77444a30',
      title: 'Portraits',
    },
    {
      coverUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg/1920px-Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg',
      visibility: 'public',
      creationDate: '2020-07-20T00:00:51Z',
      description: 'Sed ante. Vivamus tortor. Duis mattis egestas metus.',
      albumId: 'f5553b1c-038d-43de-a459-4fc78e9c296e',
      title: 'Wheatfields',
    },
  ];

  /**
   * Constructs the User Albums component.
   * @param modalService The MDB angular modal service.
   */
  constructor(private modalService: MdbModalService) {}

  ngOnInit(): void {}

  /**
   * Opens the add modal and subscribe for on close event.
   */
  onOpenAddModal() {
    // Open the add modal
    this.addModalRef = this.modalService.open(AddModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: { modalType: AddModalTypes.addAlbum },
    });
    // Subscribe for on close event
    this.addModalRef.onClose.subscribe((albumData: ModalAlbumData) => {
      if (albumData) {
        console.log(albumData);
      }
    });
  }

  /**
   * Opens the edit modal and subscribe for on close event.
   * @param albumIndex The album index number from albums array.
   */
  onOpenEditModal(albumIndex: number) {
    // Open the edit modal
    this.editModalRef = this.modalService.open(EditModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        modalType: EditModalTypes.editAlbum,
        albumOrArt: this.dummyAlbums[albumIndex],
      },
    });
    // Subscribe for on close event
    this.editModalRef.onClose.subscribe((albumData: ModalAlbumData) => {
      if (albumData) {
        console.log(albumData);
      }
    });
  }

  /**
   * Opens the delete confirm modal and subscribe for on close event.
   * @param albumId The ID of the album to be deleted.
   */
  onOpenDelConfirmModal(albumId: string) {
    // Open the delete confirm modal
    this.delConfirmModalRef = this.modalService.open(DelConfirmModalComponent, {
      modalClass: 'modal-dialog-centered',
    });
    // Subscribe for on close event
    this.delConfirmModalRef.onClose.subscribe((deleteConfirm: boolean) => {
      if (deleteConfirm) {
        console.log(`Delete albumId - ${albumId}`, deleteConfirm);
      }
    });
  }
}
