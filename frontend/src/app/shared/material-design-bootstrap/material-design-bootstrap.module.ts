import { NgModule } from '@angular/core';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

@NgModule({
  declarations: [],
  imports: [
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbFormsModule,
    MdbModalModule,
    MdbRippleModule,
    MdbValidationModule,
  ],
  exports: [
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbFormsModule,
    MdbModalModule,
    MdbRippleModule,
    MdbValidationModule,
  ],
})
export class MaterialDesignBootstrapModule {}
