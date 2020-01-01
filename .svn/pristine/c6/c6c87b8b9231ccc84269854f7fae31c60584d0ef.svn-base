import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PutlatDetailPage } from './putlat-detail.page';
import { ShowImageMoudle } from '../../../components/show-image/show-image.module';
import { ShowImageComponent } from '../../../components/show-image/show-image.component';
const routes: Routes = [
  {
    path: '',
    component: PutlatDetailPage
  }
];

@NgModule({
  imports: [
    ShowImageMoudle,  // 点击图片实现方法的组件
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PutlatDetailPage],
  entryComponents: [ShowImageComponent]
})
export class PutlatDetailPageModule {}
