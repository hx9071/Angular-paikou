import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabInvestigationPage } from './tab-investigation.page';
import { ThsMapModule } from 'src/app/components/ths-map/ths-map.module';
const routes: Routes = [
  {
    path: '',
    component: TabInvestigationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThsMapModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabInvestigationPage]
})
export class TabInvestigationPageModule { }
