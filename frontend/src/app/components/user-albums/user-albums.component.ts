import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';
import { Album } from '../../../models/database/Album';
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
export class UserAlbumsComponent implements OnInit, OnDestroy {
  // The albums emission subscription
  private albumsSubs!: Subscription;
  // The fetched albums list
  albums!: Album[];
  // The add modal reference
  private addModalRef!: MdbModalRef<AddModalComponent>;
  // The edit modal reference
  private editModalRef!: MdbModalRef<EditModalComponent>;
  // The delete confirm modal reference
  private delConfirmModalRef!: MdbModalRef<DelConfirmModalComponent>;

  /**
   * Constructs the User Albums component.
   * @param loadingState The Loading State service.
   * @param albumService The API Album service.
   * @param modalService The MDB angular modal service.
   */
  constructor(
    public loadingState: LoadingStateService,
    private albumService: AlbumService,
    private modalService: MdbModalService
  ) {}

  /**
   * Subscribe to albums list emissions and fetch all user albums.
   */
  ngOnInit(): void {
    // Subscribe for albums list emissions
    this.albumsSubs = this.albumService.albums.subscribe((response) => {
      this.albums = response.items;
      // Set the loading state as not loading
      this.loadingState.setLoadingState(false);
    });
  }

  /**
   * Opens the add album modal and subscribe for on close event.
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
        // Set the loading state as loading
        this.loadingState.setLoadingState(true);
        // Add a new album to user portfolio
        const { imgFile, ...data } = albumData;
        this.albumService.addAlbum({ ...data, coverImg: imgFile });
      }
    });
  }

  /**
   * Opens the edit album modal and subscribe for on close event.
   * @param album The album item from albums array.
   */
  onOpenEditModal(album: Album) {
    // Open the edit modal
    this.editModalRef = this.modalService.open(EditModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: { modalType: EditModalTypes.editAlbum, albumOrArt: album },
    });
    // Subscribe for on close event
    this.editModalRef.onClose.subscribe((albumData: ModalAlbumData) => {
      if (albumData) {
        // Set the loading state as loading
        this.loadingState.setLoadingState(true);
        // Edit the album from user portfolio
        const data = {
          albumId: album.albumId,
          title: albumData.title,
          description: albumData.description,
          visibility: albumData.visibility,
          coverImg: albumData.imgFile,
          genUploadUrl: !!albumData.imgFile,
        };
        this.albumService.editAlbum(data);
      }
    });
  }

  /**
   * Opens the delete album confirm modal and subscribe for on close
   * event.
   * @param album The album item from albums array.
   */
  onOpenDelConfirmModal(album: Album) {
    // Open the delete confirm modal
    this.delConfirmModalRef = this.modalService.open(DelConfirmModalComponent, {
      modalClass: 'modal-dialog-centered',
    });
    // Subscribe for on close event
    this.delConfirmModalRef.onClose.subscribe((deleteConfirm: boolean) => {
      if (deleteConfirm) {
        // Set the loading state as loading
        this.loadingState.setLoadingState(true);
        // Delete the album from user portfolio
        this.albumService.deleteAlbum({ albumId: album.albumId });
      }
    });
  }

  /**
   * Avoid memory leaks unsubscribing from all registered services.
   */
  ngOnDestroy(): void {
    this.albumsSubs.unsubscribe();
  }
}
