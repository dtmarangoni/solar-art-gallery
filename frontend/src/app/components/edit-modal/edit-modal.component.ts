import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AlbumVisibility } from '../../../models/database/Album';
import { EditModalTypes } from '../../../models/ModalTypes';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  // Modal Types Enum
  modalTypesEnum = EditModalTypes;
  // Edit modal type
  modalType!: EditModalTypes;
  // The edit form group
  editForm!: FormGroup;
  // The input file image preview element
  imgPreview!: string;
  // The visibility toggle switch element
  visibilityToggle!: boolean;

  items = [
    {
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Claude_Monet_033.jpg/800px-Claude_Monet_033.jpg',
      visibility: 'public',
      creationDate: '2021-01-27T03:03:42Z',
      description:
        'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      title: 'Urban Places',
    },
    {
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vincent_Willem_van_Gogh_128.jpg/800px-Vincent_Willem_van_Gogh_128.jpg',
      visibility: 'public',
      creationDate: '2020-11-29T00:10:51Z',
      description: 'Sed ante. Vivamus tortor. Duis mattis egestas metus.',
      albumId: 'e6323b1c-038d-43de-a459-4fc78e9c296e',
      title: 'Flowers',
    },
    {
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Water-Lily_Pond_1900_Claude_Monet_Boston_MFA.jpg/1024px-Water-Lily_Pond_1900_Claude_Monet_Boston_MFA.jpg',
      visibility: 'public',
      creationDate: '2020-11-26T00:34:23Z',
      description:
        'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
      albumId: 'fbefab56-42e1-40af-9145-fbc34cc65f2f',
      title: 'Nature Scenery',
    },
    {
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Vincent_van_Gogh_-_Self-portrait_with_grey_felt_hat_-_Google_Art_Project.jpg/800px-Vincent_van_Gogh_-_Self-portrait_with_grey_felt_hat_-_Google_Art_Project.jpg',
      visibility: 'public',
      creationDate: '2020-08-10T19:50:02Z',
      description:
        'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
      albumId: '1efc348c-b3ad-4f03-a2ff-423f77444a30',
      title: 'Portraits',
    },
    {
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg/1920px-Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg',
      visibility: 'public',
      creationDate: '2020-07-20T00:00:51Z',
      description: 'Sed ante. Vivamus tortor. Duis mattis egestas metus.',
      albumId: 'f5553b1c-038d-43de-a459-4fc78e9c296e',
      title: 'Wheatfields',
    },
  ];

  /**
   * Constructs the Edit modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<EditModalComponent>) {}

  /**
   * Initialize the edit form and HTML elements.
   */
  ngOnInit(): void {
    // Initialize the modal type and HTML elements
    this.initModalElements();
    // Initialize the edit form
    this.initForm();
  }

  /**
   * Initialize the edit form.
   */
  private initForm() {
    this.editForm = new FormGroup({
      imgFile: new FormControl(null),
      title: new FormControl(this.items[0].title, {
        validators: Validators.required,
      }),
      description: new FormControl(this.items[0].description, {
        validators: Validators.required,
      }),
    });

    // Visibility is only applicable for Albums
    if (this.modalType == EditModalTypes.editAlbum) {
      this.editForm.addControl(
        'visibility',
        new FormControl(this.items[0].visibility, {
          validators: Validators.required,
        })
      );
    }
  }

  /**
   * Initialize the modal type and HTML elements.
   */
  private initModalElements() {
    // Initialize the modal type
    this.modalType = EditModalTypes.editArt;
    // Initialize the image preview element
    this.imgPreview = this.items[4].imgUrl;
    // Initialize the HTML visibility toggle switch element
    this.visibilityToggle =
      this.items[0].visibility == AlbumVisibility.public ? true : false;
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
   * On input file change update the edit form and the HTML image
   * preview element.
   * @param event The HTMLInputElement event.
   */
  onFileChange(event: Event) {
    const inputFileEvent = event.target as HTMLInputElement;
    if (inputFileEvent?.files && inputFileEvent?.files?.length) {
      // Path the image file form control from edit form
      this.editForm?.patchValue({ imgFile: inputFileEvent.files[0] });
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
   * Close the modal and send the form values.
   */
  onSubmit() {
    console.log(this.editForm.value);
  }
}
