import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxAmapModule } from 'ngx-amap';
import { PutlatMapPage } from './putlat-map.page';
import { ThsMapModule } from 'src/app/components/ths-map/ths-map.module';

const routes: Routes = [
  {
    path: '',
    component: PutlatMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // 引入高德地图
    NgxAmapModule.forRoot({
      apiKey: '3f9327e9dd62e0358cba4992514bef7e'
    }),
    ThsMapModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PutlatMapPage]
})
export class PutlatMapPageModule { }
