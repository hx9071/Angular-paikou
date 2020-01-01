import { Injectable } from '@angular/core';
import { ConfigService } from '../config-service/config.service';
import { PublicService } from '../public-service/public.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  constructor(
    public configService: ConfigService,
    public publicService: PublicService
  ) { }
  getWeatherForcast(params, showloading, callback) {
    // 传pipeCode的参数来调用接口
    const param = {' pager ': { ' pageSize ': '10' , ' orderBy ': '' , 'page ': '1'}, ' params ': { ' pipeCode '  : ' pipeout ' }
    };
    // 这里有问题
    const paramss = {
      // 获取排口数据的接口
      interfaceId: this.configService.PutletDetail,
      token: this.configService.Token,
      params: JSON.stringify(param)
    };
    // this.configService.airHost 也是接口地址
    // 这个是请求专题数据的接口
    return this.publicService.airpost( 'this.configService.airHost', paramss, showloading, callback);
  }
}
