import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './guards/auth/auth.guard';

const routes: Routes = [
  // 首页
  {
    path: '',
    canActivate: [AuthGuard],
    redirectTo: '/tabs/track',
    pathMatch: 'full'
  },

  // 首页
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: './pages/tabs/tabs.module#TabsPageModule'
  },

  // 登录
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  // 新增页面
  {
    path: 'putlat-add',
    loadChildren: './pages/tabs-archives/putlat-add/putlat-add.module#PutlatAddPageModule'
  },
  // 详情页面
  {
    path: 'putlat-detail',
    loadChildren: './pages/tabs-archives/putlat-detail/putlat-detail.module#PutlatDetailPageModule'
  },
  // 排口档案列表
  {
    path: 'putlat-document',
    loadChildren: './pages/tabs-archives/putlat-document/putlat-document.module#PutlatDocumentPageModule'
  },
  // 修改页面
  {
    path: 'putlat-modification',
    loadChildren: './pages/tabs-archives/putlat-modification/putlat-modification.module#PutlatModificationPageModule'
  },
  // 地图页面
  {
    path: 'putlat-map',
    loadChildren: './pages/tabs-archives/putlat-map/putlat-map.module#PutlatMapPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
