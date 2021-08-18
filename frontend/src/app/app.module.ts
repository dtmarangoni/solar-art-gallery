import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DelConfirmModalComponent } from './components/del-confirm-modal/del-confirm-modal.component';
import { AddModalComponent } from './components/add-modal/add-modal.component';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { MaterialDesignBootstrapModule } from './shared/material-design-bootstrap/material-design-bootstrap.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DelConfirmModalComponent,
    AddModalComponent,
    EditModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialDesignBootstrapModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
