import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowImageComponent } from './show-image.component';

@NgModule({
  declarations: [ShowImageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [ShowImageComponent]
})
export class ShowImageMoudle { }
