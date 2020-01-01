import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {NgxAmapModule} from 'ngx-amap';

import {TabsTrackPage} from './tabs-track.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxAmapModule.forRoot({
      apiKey: '3f9327e9dd62e0358cba4992514bef7e'
    }),
    RouterModule.forChild([
      {
        path: '',
        component: TabsTrackPage
      }
    ])
  ],
  declarations: [TabsTrackPage],
  providers: []
})
export class TabsTrackPageModule {
}
