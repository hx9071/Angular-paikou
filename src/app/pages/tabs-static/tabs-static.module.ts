import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {NgxEchartsModule} from 'ngx-echarts';

import {TabsStaticPage} from './tabs-static.page';
import {SearchModalModule} from '../../components/search-modal/search-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxEchartsModule,
    SearchModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: TabsStaticPage
      }
    ])
  ],
  declarations: [TabsStaticPage]
})
export class TabsStaticPageModule {
}
