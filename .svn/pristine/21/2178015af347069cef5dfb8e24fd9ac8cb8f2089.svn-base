import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // 业务接口地址
  public URL = {
    GETSUPVERVISIONLIST: '../../../assets/data/supervisionList.json'
  };

  public tabsRoute; // tabs页面路由
  public curLocation: any = {
    lon: 114.266547,
    lat: 30.604097,
    addr: '武汉市生态环境局'
  };
  /**
   * 保存共用配置
   */

  // 存储用户信息
  public userInfo = {
    loginName: '',
    password: '',
    userName: ''
  };

  public Token;

  // 排口相关接口前缀 外网

  public putletInterfacePrefix = 'http://59.173.11.84:8090/output/api/inter/outputinter/';
  // public putletInterfacePrefix = 'http://223.223.179.204:9090/output/api/inter/outputinter/';

  // 获取app版本信息接口
  public getVersionInfoInterface = this.setInterfaceUrl('getVersionInfo.vm');

  // 排口统计图表数据接口
  public getPutletStatisticsInterface = this.setInterfaceUrl('getPointCollect.vm');

  // 湖泊和入湖排口数据列表
  public getLakeAndOutputInterface = this.setInterfaceUrl('getLakeAndOutput.vm');

  public getOutletSearchData = '';   // 排口搜索框的接口

  // 排口档案列表
  public PutletReacord = this.setInterfaceUrl('getoutputArchives.vm');

  // 区域排口数量
  public regionOutput = this.setInterfaceUrl('getRegionOutput.vm');

  // 排口排口档案详情
  public PutletDetail = this.setInterfaceUrl('getoutputArchivesInfo.vm');

  // 新建排口档案的接口
  public putletInput = this.setInterfaceUrl('outputEdit.vm');

  // 新建入湖排口水质的接口
  public waterMonInput = this.setInterfaceUrl('monitorEdit.vm');

  // 上传图片的接口
  public imgInput = this.setInterfaceUrl('fileEdit.vm');

  // 入湖排口水质监测数据列表
  public WaterMon = this.setInterfaceUrl('getMonitorContent.vm');

  // 字典接口
  public Option = this.setInterfaceUrl('getDictionary.vm');

  // 百度web服务AK值
  public baiduWebAk = 'AwnpnCwixW7NlNlL6gg4xspehPwoXQNf';
  // 百度定位key值
  public baiduKey = 'jQSy1BMDIZyUErIKGQGvOE6lkumZjgEG';

  // 百度web服务的url
  public baiduWebUrL = 'http://api.map.baidu.com/reverse_geocoding/v3/';
  public appApplicationUpDate = [];
  public hostLogin = 'http://182.148.109.15:8289/service/serviceinterface/search/run.action';

  // 登陆模板id
  public loginId = '75AE2090A8EE4F788230D792101D5EF4';

  // 登录接口
  public loginInterface = this.setInterfaceUrl('login.vm');

  // 获取app版本信息
  public appVersionId = 'B367C6B48EF84094A9B3A8E2601B0F40';

  // 服务平台地址配置token
  public token = 'dzzw';

  constructor() {
  }

  /**
   * 设置排口接口完整地址
   * @param interfaceName 接口名称
   */
  private setInterfaceUrl(interfaceName) {
    return `${this.putletInterfacePrefix}${interfaceName}`;
  }
}
