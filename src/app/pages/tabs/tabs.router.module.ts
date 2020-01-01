import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // 统计
      {
        path: 'static',
        loadChildren: '../tabs-static/tabs-static.module#TabsStaticPageModule'
      },

      // 排口档案
      {
        path: 'archives',
        loadChildren: '../tabs-archives/putlat-document/putlat-document.module#PutlatDocumentPageModule'
      },

      // 跟踪调查
      {
        path: 'track',
        // loadChildren: '../tabs-track/tabs-track.module#TabsTrackPageModule'
        loadChildren: '../tab-investigation/tab-investigation.module#TabInvestigationPageModule'
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TabsPageRoutingModule {
}
