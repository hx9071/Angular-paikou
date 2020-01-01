import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PutlatModificationPage } from './putlat-modification.page';
import {SearchModalModule} from '../../../components/search-modal/search-modal.module';
import { ShowImageMoudle } from '../../../components/show-image/show-image.module';
import { ShowImageComponent } from '../../../components/show-image/show-image.component';
const routes: Routes = [
  {
    path: '',
    component: PutlatModificationPage
  }
];

@NgModule({
  imports: [
    ShowImageMoudle,  // 点击图片实现方法的组件
    CommonModule,
    FormsModule,
    IonicModule,
    SearchModalModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PutlatModificationPage],
  entryComponents: [ShowImageComponent]
})
export class PutlatModificationPageModule {}
