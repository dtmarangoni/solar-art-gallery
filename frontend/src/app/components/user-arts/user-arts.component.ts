import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';
import { ArtService } from '../../services/art/art.service';
import { Album } from '../../../models/database/Album';
import { Art } from '../../../models/database/Art';
import { ViewModalComponent } from '../view-modal/view-modal.component';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import {
  AddModalTypes,
  EditModalTypes,
  ModalArtData,
} from '../../../models/ModalTypes';
import { readFileAsBase64 } from '../../utils/app-utils';

@Component({
  selector: 'app-user-arts',
  templateUrl: './user-arts.component.html',
  styleUrls: ['./user-arts.component.scss'],
})
export class UserArtsComponent implements OnInit, OnDestroy {
  // The albums emission subscription
  private albumsSubs!: Subscription;
  // The arts emission subscription
  private artsSubs!: Subscription;
  // The arts album
  album!: Album;
  // The fetched album arts
  arts!: Art[];
  // The form group
  form!: FormGroup;
  // The add modal reference
  private addModalRef!: MdbModalRef<AddModalComponent>;
  // The edit modal reference
  private editModalRef!: MdbModalRef<EditModalComponent>;

  /**
   * Constructs the User Arts from an album component.
   * @param modalService The MDB angular modal service.
   * @param loadingState The Loading State service.
   * @param albumService The API Album service.
   * @param artService The API Art service.
   */
  constructor(
    private modalService: MdbModalService,
    public loadingState: LoadingStateService,
    private albumService: AlbumService,
    private artService: ArtService
  ) {}

  /**
   * Init services subscriptions.
   */
  ngOnInit(): void {
    // Subscribe for albums list emissions
    this.albumsSubs = this.albumService.albums.subscribe((response) => {
      // Get the arts album
      this.album = response.items[0];
    });

    // Subscribe for arts list emissions
    this.artsSubs = this.artService.arts.subscribe((response) => {
      this.arts = response.items;
      // Initialize the form
      this.initForm();
      // Set the loading state as not loading
      this.loadingState.setLoadingState(false);
    });
  }

  /**
   * Initialize the form with fetched user arts.
   */
  private initForm() {
    this.form = new FormGroup({ arts: new FormArray([]) });
    // Add the fetched art elements to form array
    this.arts.forEach((art) => this.addArtToFormArray(art));
  }

  /**
   * Getter to arts form array form control.
   */
  get artsFormArray() {
    return this.form.controls['arts'] as FormArray;
  }

  /**
   * Add an art item or new art data to form array control.
   * @param artData The art item or new art data from add modal.
   */
  private async addArtToFormArray(artData: Art | ModalArtData) {
    // Create the art form group
    const formGroup = new FormGroup({
      title: new FormControl(artData.title),
      description: new FormControl(artData.description),
    });

    if ((artData as Art)?.artId) {
      // Existing art item
      this.existArtToFmCtrls(artData as Art, formGroup);
    } else {
      // New art item was added
      await this.newArtToFmCtrls(artData as ModalArtData, formGroup);
    }

    // Add the form group to form array
    this.artsFormArray.push(formGroup);
  }

  /**
   * Spread each field of an existing art item to form group controls.
   * @param art The existing art item data.
   * @param formGroup The form group.
   */
  private existArtToFmCtrls(art: Art, formGroup: FormGroup) {
    formGroup.addControl('artId', new FormControl(art.artId));
    formGroup.addControl('albumId', new FormControl(art.albumId));
    formGroup.addControl('creationDate', new FormControl(art.creationDate));
    formGroup.addControl('imgUrl', new FormControl(art.imgUrl));
    formGroup.addControl('sequenceNum', new FormControl(art.sequenceNum));
  }

  /**
   * Spread each field of a new art data from modal to form group
   * controls.
   * @param art The new art data.
   * @param formGroup The form group.
   */
  private async newArtToFmCtrls(artData: ModalArtData, formGroup: FormGroup) {
    // Image file preview as base64 to HTML page element
    const base64Img = await readFileAsBase64(artData.imgFile);
    formGroup.addControl('albumId', new FormControl(this.album.albumId));
    formGroup.addControl('imgFile', new FormControl(artData.imgFile));
    formGroup.addControl('imgUrl', new FormControl(base64Img));
  }

  /**
   * Shift an art group control inside the form array a number of
   * positions to right or left.
   * @param shift How many positions to shift to right or left inside
   * the form array.
   * @param currentIndex
   */
  shift(shift: number, currentIndex: number) {
    // The new index position after shifting
    let newIndex = currentIndex + shift;

    // Avoid overlap
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= this.artsFormArray.length) {
      newIndex = this.artsFormArray.length - 1;
    }

    // Get the current art group being shifted
    const currentArtGroup = this.artsFormArray.at(currentIndex);
    // Remove the art group from old position and add to new position
    this.artsFormArray.removeAt(currentIndex);
    this.artsFormArray.insert(newIndex, currentArtGroup);

    // Mark the form as dirty
    this.artsFormArray.markAsDirty();
  }

  /**
   * Opens the view modal to visualize the art painting.
   * @param art The art clicked item.
   */
  onOpenViewModal(art: Art) {
    this.modalService.open(ViewModalComponent, {
      modalClass: 'art-modal-dialog',
      data: { art },
    });
  }

  /**
   * Opens the add art modal and subscribe for on close event.
   */
  onOpenAddModal() {
    // Open the add modal
    this.addModalRef = this.modalService.open(AddModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: { modalType: AddModalTypes.addArt },
    });
    // Subscribe for on close event
    this.addModalRef.onClose.subscribe((artData: ModalArtData) => {
      if (artData) {
        this.addArtToFormArray(artData);
        // Mark the form as dirty
        this.artsFormArray.markAsDirty();
      }
    });
  }

  /**
   * Opens the edit art modal and subscribe for on close event.
   * @param artGroup The art group from arts array.
   */
  onOpenEditModal(artGroup: AbstractControl) {
    // Open the edit modal
    this.editModalRef = this.modalService.open(EditModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: { modalType: EditModalTypes.editArt, albumOrArt: artGroup.value },
    });
    // Subscribe for on close event
    this.editModalRef.onClose.subscribe(async (artData: ModalArtData) => {
      if (artData) {
        // Patch the edited values
        await this.patchArtGroupCtrl(artGroup, artData);
        // Mark the form as dirty
        this.artsFormArray.markAsDirty();
      }
    });
  }

  /**
   * After user edition, patches the art group form control.
   * @param artGroup The art form group control.
   * @param artData The patch art data.
   */
  private async patchArtGroupCtrl(
    artGroup: AbstractControl,
    artData: ModalArtData
  ) {
    // Patch the edited values
    artGroup.patchValue({
      title: artData.title,
      description: artData.description,
    });

    if (artData.imgFile) {
      // Art image was changed, thus generate the image preview
      const base64Img = await readFileAsBase64(artData.imgFile);
      artGroup.patchValue({ imgUrl: base64Img });
      // Add or update the image file to group control
      const artFormGroup = artGroup as FormGroup;
      const imgCtrl = artFormGroup.get('imgFile');
      if (imgCtrl) imgCtrl.setValue(artData.imgFile);
      else artFormGroup.addControl('imgFile', new FormControl(artData.imgFile));
    }
  }

  /**
   * Toggles an art group as to be deleted.
   * @param artGroup The art group from arts array.
   */
  onDeleteArt(artGroup: AbstractControl) {
    // Check whether this art group already has the delete control
    if (artGroup.get('delete')) {
      // Toggles its current state
      artGroup.patchValue({ delete: !artGroup.get('delete')?.value });
    } else {
      // Add the delete control for art group
      (artGroup as FormGroup).addControl('delete', new FormControl(true));
    }

    // Mark the form as dirty
    this.artsFormArray.markAsDirty();
  }

  /**
   * Add and, update or delete user album arts.
   */
  onSubmit() {
    // Set the loading state as loading
    this.loadingState.setLoadingState(true);

    // Split the put and delete arts
    const { deleteData, putData } = this.splitPutDeleteArts();
    // Performs a delete and put operation sequentially
    this.artService.deletePutArts(deleteData, putData);

    if (deleteData.length === 0 && putData.length === 0)
      // Delete if only local existing arts
      // If no server site API call is required, refresh the data to previous state
      this.artService.fetchCachedArts();
  }

  /**
   * Split the user album arts to be added or edited from the ones to
   * be deleted.
   */
  private splitPutDeleteArts(): { putData: []; deleteData: [] } {
    return (this.form.value.arts as []).reduce(
      (acc, art: any) => {
        if (!art?.delete)
          // To be added or edited in backend
          acc.putData.push({
            albumId: art.albumId,
            artId: art?.artId,
            title: art?.title,
            description: art?.description,
            artImg: art?.imgFile,
            genUploadUrl: !!(art?.artId && art?.imgFile),
          });
        else if (art?.artId)
          // To be deleted in backend
          acc.deleteData.push({ albumId: art.albumId, artId: art.artId });

        return acc;
      },
      { putData: [], deleteData: [] } as any
    );
  }

  /**
   * Avoid memory leaks unsubscribing from all registered services.
   */
  ngOnDestroy() {
    this.artsSubs.unsubscribe();
    this.albumsSubs.unsubscribe();
  }
}
