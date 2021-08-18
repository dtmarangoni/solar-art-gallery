import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { ViewModalComponent } from '../view-modal/view-modal.component';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import {
  AddModalTypes,
  EditModalTypes,
  ModalArtData,
} from '../../../models/ModalTypes';
import { Art } from '../../../models/database/Art';
import { Album } from '../../../models/database/Album';
import { readFileAsBase64 } from '../../utils/app-utils';

@Component({
  selector: 'app-user-arts',
  templateUrl: './user-arts.component.html',
  styleUrls: ['./user-arts.component.scss'],
})
export class UserArtsComponent implements OnInit {
  // Arts Album data
  album!: Album; // TODO implement album logic
  // The form group
  form!: FormGroup;
  // Art delete queue
  artsToDelete!: Art[];
  // The add modal reference
  private addModalRef!: MdbModalRef<AddModalComponent>;
  // The edit modal reference
  private editModalRef!: MdbModalRef<EditModalComponent>;

  @Input() matchSize: boolean = true;

  dummyArts = [
    {
      sequenceNum: 0,
      creationDate: '2021-01-01T08:10:20Z',
      artId: 'rj7239tr-e107-4e34-8057-4b42477a1259',
      description:
        'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Claude_Monet_033.jpg/800px-Claude_Monet_033.jpg',
      title: 'Cathedral in Rouen',
    },
    {
      sequenceNum: 1,
      creationDate: '2021-02-11T08:10:20Z',
      artId: 'yup23955-e107-4e34-8057-4b42477a1259',
      description:
        'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/5/5c/Claude_Monet%2C_Impression%2C_soleil_levant%2C_1872.jpg',
      title: 'Sunrise',
    },
    {
      sequenceNum: 2,
      creationDate: '2021-03-16T08:10:20Z',
      artId: 'gg0039rr-e107-4e34-8057-4b42477a1259',
      description:
        'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/La_Seine_%C3%A0_Asni%C3%A8re_-_Monet.jpg/1280px-La_Seine_%C3%A0_Asni%C3%A8re_-_Monet.jpg',
      title: 'La Seine à Asnières',
    },
    {
      sequenceNum: 3,
      creationDate: '2021-05-21T08:10:20Z',
      artId: 'dac239tr-e107-4e34-8259-4b42477a1259',
      description:
        'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/1/10/Eglise_de_V%C3%A9theuil.jpg',
      title: 'Eglise de Vétheuil',
    },
  ];

  /**
   * Constructs the User Arts from an album component.
   * @param modalService The MDB angular modal service.
   */
  constructor(private modalService: MdbModalService) {}

  /**
   * Initialize the form and component elements.
   */
  ngOnInit(): void {
    // Initialize the component elements
    this.initComponentElements();
    // Initialize the form
    this.initForm();
  }

  /**
   * Initialize the components elements.
   */
  private initComponentElements() {
    // Starts the arts delete queue as empty
    this.artsToDelete = [];
  }

  /**
   * Initialize the form.
   */
  private initForm() {
    this.form = new FormGroup({ arts: new FormArray([]) });
    // Add the initial art elements to form array
    this.dummyArts.forEach((art) => this.addArtToFormArray(art));
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
    formGroup.addControl('albumId', new FormControl('albumID - 12387921')); // TODO implement album logic
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
    // Remove the art group from old position
    this.artsFormArray.removeAt(currentIndex);
    // Add the art group to the new position
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
   * Opens the add modal and subscribe for on close event.
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
   * Opens the edit modal and subscribe for on close event.
   * @param artGroupIndex The art group index number from arts array.
   */
  onOpenEditModal(artGroupIndex: number) {
    // Open the edit modal
    this.editModalRef = this.modalService.open(EditModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        modalType: EditModalTypes.editArt,
        albumOrArt: (this.artsFormArray.at(artGroupIndex) as FormGroup).value,
      },
    });
    // Subscribe for on close event
    this.editModalRef.onClose.subscribe(async (artData: ModalArtData) => {
      if (artData) {
        // The group control of edited data
        const groupCtrl = this.artsFormArray.at(artGroupIndex) as FormGroup;
        // Patch the edited values
        groupCtrl.patchValue({
          title: artData.title,
          description: artData.description,
        });

        if (artData.imgFile) {
          // Art image was changed, thus generate the image preview
          const base64Img = await readFileAsBase64(artData.imgFile);
          groupCtrl.patchValue({ imgUrl: base64Img });
          // Add the image file to group controls
          groupCtrl.addControl('imgFile', new FormControl(artData.imgFile));
        }

        // Mark the form as dirty
        this.artsFormArray.markAsDirty();
      }
    });
  }

  /**
   * Toggles an art group as to be deleted and adds or removes the art
   * data to or from delete queue.
   * @param artGroupIndex The art group index number from arts array.
   */
  onDeleteArt(artGroupIndex: number) {
    // The deleted group control
    const groupCtrl = this.artsFormArray.at(artGroupIndex) as FormGroup;

    // Check whether this art group already has the delete control
    if (groupCtrl.get('delete')) {
      // Toggles its current state
      groupCtrl.patchValue({ delete: !groupCtrl.get('delete')?.value });
    } else {
      // Add the delete control for art group
      groupCtrl.addControl('delete', new FormControl(true));
    }

    // If necessary, add or remove art data from delete queue
    // Only add or remove from delete queue existing arts in backend
    if (groupCtrl.get('artId')) {
      if (groupCtrl.get('delete')?.value) {
        this.artsToDelete.push(groupCtrl.value);
      } else {
        this.artsToDelete = this.artsToDelete.filter(
          (art) => art.artId != groupCtrl.get('artId')?.value
        );
      }
    }

    // Mark the form as dirty
    this.artsFormArray.markAsDirty();
  }

  /**
   * Send the form values.
   */
  onSubmit() {
    console.log(this.form.value);
    console.log(this.artsToDelete);
  }
}
