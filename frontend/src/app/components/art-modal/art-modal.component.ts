import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-art-modal',
  templateUrl: './art-modal.component.html',
  styleUrls: ['./art-modal.component.scss'],
})
export class ArtModalComponent implements OnInit {
  dummyArts = [
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
   * Constructs the Art modal component.
   * @param modalRef The MDB angular modal reference.
   */
  constructor(public modalRef: MdbModalRef<ArtModalComponent>) {}

  ngOnInit(): void {}
}
