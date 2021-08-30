import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Album, AlbumVisibility } from '../../../models/database/Album';
import { Art } from '../../../models/database/Art';
import { EditModalTypes } from '../../../models/ModalTypes';
import { readFileAsBase64 } from '../../utils/app-utils';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  // The album or art item that will be passed to modal
  albumOrArt!: Album | Art;
  // Edit modal type that will be passed to modal
  modalType!: EditModalTypes;
  // Modal Types Enum
  modalTypesEnum = EditModalTypes;
  // The edit form group
  editForm!: FormGroup;
  // The input file image preview element
  imgPreview: string | undefined;
  // The visibility toggle switch element
  visibilityToggle!: boolean;

  /**
   * Constructs the Edit modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<EditModalComponent>) {}

  /**
   * Initialize the edit form and HTML elements.
   */
  ngOnInit(): void {
    // Initialize the HTML elements
    this.initHTMLElements();
    // Initialize the edit form
    this.initForm();
  }

  /**
   * Initialize the edit form.
   */
  private initForm() {
    this.editForm = new FormGroup({
      imgFile: new FormControl(null),
      title: new FormControl(this.albumOrArt.title, {
        validators: Validators.required,
      }),
      description: new FormControl(this.albumOrArt.description, {
        validators: Validators.required,
      }),
    });

    // Visibility is only applicable for Albums
    if (this.modalType === EditModalTypes.editAlbum) {
      this.editForm.addControl(
        'visibility',
        new FormControl((this.albumOrArt as Album).visibility, {
          validators: Validators.required,
        })
      );
    }
  }

  /**
   * Initialize the HTML elements.
   */
  private initHTMLElements() {
    // Initialize the image preview element
    this.imgPreview =
      this.modalType === EditModalTypes.editAlbum
        ? (this.albumOrArt as Album).coverUrl
        : (this.albumOrArt as Art).imgUrl;
    // Initialize the HTML visibility toggle switch element
    if (this.modalType === EditModalTypes.editAlbum) {
      this.visibilityToggle =
        (this.albumOrArt as Album).visibility === AlbumVisibility.public
          ? true
          : false;
    }
  }

  /**
   * Getter to image file form control.
   */
  get imgFile() {
    return this.editForm.get('imgFile');
  }

  /**
   * Getter to visibility form control.
   */
  get visibility() {
    return this.editForm.get('visibility');
  }

  /**
   * Getter to title form control.
   */
  get title() {
    return this.editForm.get('title');
  }

  /**
   * Getter to description form control.
   */
  get description() {
    return this.editForm.get('description');
  }

  /**
   * On input file change, update the edit form and the HTML image
   * preview element.
   * @param event The HTMLInputElement event.
   */
  async onFileChange(event: Event) {
    const inputFileEvent = event.target as HTMLInputElement;
    if (inputFileEvent?.files && inputFileEvent?.files?.length) {
      // Path the image file form control from edit form
      this.editForm?.patchValue({ imgFile: inputFileEvent.files[0] });
      // Mark the image file form control as dirty after changes
      this.imgFile?.markAsDirty();
      // Update the HTML image preview element from input file
      this.imgPreview = await readFileAsBase64(inputFileEvent.files[0]);
    }
  }

  /**
   * Update the edit form on visibility toggle switch change.
   * @param event The HTMLInputElement event.
   */
  onToggleVisibility(event: Event) {
    const toggleSwitchEvent = event.target as HTMLInputElement;
    // Path the visibility form control from edit form
    this.editForm?.patchValue({
      visibility: toggleSwitchEvent.checked
        ? AlbumVisibility.public
        : AlbumVisibility.private,
    });
    // Mark the visibility toggle switch form control as dirty after
    // changes
    this.visibility?.markAsDirty();
  }

  /**
   * Close the modal and send back the form values.
   */
  onSubmit() {
    this.modalRef.close(this.editForm.value);
  }
}
