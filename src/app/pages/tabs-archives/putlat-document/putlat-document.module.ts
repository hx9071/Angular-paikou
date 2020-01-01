import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PutlatDocumentPage } from './putlat-document.page';
import {SearchModalModule} from '../../../components/search-modal/search-modal.module';

const routes: Routes = [
  {
    path: '',
    component: PutlatDocumentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchModalModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PutlatDocumentPage]
})
export class PutlatDocumentPageModule {}
