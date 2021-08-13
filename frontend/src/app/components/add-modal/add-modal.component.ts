import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AddModalTypes } from '../../../models/ModalTypes';
import { Album, AlbumVisibility } from '../../../models/database/Album';
import { Art } from '../../../models/database/Art';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit {
  // Add modal type that will be passed to modal
  modalType!: AddModalTypes;
  // Modal Types Enum
  modalTypesEnum = AddModalTypes;
  // The add form group
  addForm!: FormGroup;
  // The input file image preview element
  imgPreview!: string;
  // The visibility toggle switch element
  visibilityToggle!: boolean;

  /**
   * Constructs the add modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<AddModalComponent>) {}

  /**
   * Initialize the add form and HTML elements.
   */
  ngOnInit(): void {
    // Initialize the HTML elements
    this.initHTMLElements();
    // Initialize the add form
    this.initForm();
  }

  /**
   * Initialize the add form.
   */
  private initForm() {
    this.addForm = new FormGroup({
      imgFile: new FormControl(null, { validators: Validators.required }),
      title: new FormControl(null, { validators: Validators.required }),
      description: new FormControl(null, { validators: Validators.required }),
    });

    // Visibility is only applicable for Albums
    if (this.modalType == AddModalTypes.addAlbum) {
      this.addForm.addControl(
        'visibility',
        new FormControl(AlbumVisibility.private, {
          validators: Validators.required,
        })
      );
    }
  }

  /**
   * Initialize the HTML elements.
   */
  private initHTMLElements() {
    // Initialize the HTML visibility toggle switch element
    this.visibilityToggle = false;
  }

  /**
   * Getter to image file form control.
   */
  get imgFile() {
    return this.addForm.get('imgFile');
  }

  /**
   * Getter to visibility form control.
   */
  get visibility() {
    return this.addForm.get('visibility');
  }

  /**
   * Getter to title form control.
   */
  get title() {
    return this.addForm.get('title');
  }

  /**
   * Getter to description form control.
   */
  get description() {
    return this.addForm.get('description');
  }

  /**
   * On input file change, update the add form and the HTML image
   * preview element.
   * @param event The HTMLInputElement event.
   */
  onFileChange(event: Event) {
    const inputFileEvent = event.target as HTMLInputElement;
    if (inputFileEvent?.files && inputFileEvent?.files?.length) {
      // Path the image file form control from add form
      this.addForm?.patchValue({ imgFile: inputFileEvent.files[0] });
      // Mark the image file form control as dirty after changes
      this.imgFile?.markAsDirty();
      // Update the HTML image preview element from input file
      this.updateImageFilePreview(inputFileEvent.files[0]);
    }
  }

  /**
   * Update the HTML element image preview from a file.
   * @param file The image file.
   */
  private updateImageFilePreview(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = () => (this.imgPreview = fileReader.result as string);
    fileReader.readAsDataURL(file);
  }

  /**
   * Update the add form on visibility toggle switch change.
   * @param event The HTMLInputElement event.
   */
  onToggleVisibility(event: Event) {
    const toggleSwitchEvent = event.target as HTMLInputElement;
    // Path the visibility form control from add form
    this.addForm?.patchValue({
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
    this.modalRef.close(this.addForm.value);
  }
}
