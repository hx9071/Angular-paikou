import {Injectable} from '@angular/core';

import {PublicService} from '../public-service/public.service'; // 引入公共方法
import {ConfigService} from '../config-service/config.service';

@Injectable({
  providedIn: 'root'
})
export class StaticService {

  constructor(private publicService: PublicService,
              private configService: ConfigService) {
  }

  /**
   * 获取统计数据信息
   * @param params   请求参数 得到后台的接口
   * @param showloading  是否显示数据加载,false或不传参为显示，true不显示
   * @param callback  使用回调函数
   */
  getStatisticsData(params, showloading, callback) {
    return this.publicService.get(this.configService.getPutletStatisticsInterface, params, showloading, callback);
  }

  /**
   * 获取入湖和排口列表
   * @param params   请求参数 得到后台的接口
   * @param showloading  是否显示数据加载,false或不传参为显示，true不显示
   * @param callback  使用回调函数
   */
  getLakeAndOutputList(params, showloading, callback) {
    return this.publicService.get(this.configService.getLakeAndOutputInterface, params, showloading, callback);
  }

}
