import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ThsMapService } from 'src/app/services/ths-map/ths-map.service';
import { DeviceInfoService } from 'src/app/services/device-info-service/device-info.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { PublicService } from 'src/app/services/public-service/public.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config-service/config.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-tab-investigation',
  templateUrl: './tab-investigation.page.html',
  styleUrls: ['./tab-investigation.page.scss'],
})
export class TabInvestigationPage implements OnInit {

  // 地图视图
  public mapView;

  // 当前位置信息
  public currentLocation = {
    lon: 114.266547,
    lat: 30.604097,
    addr: '武汉市生态环境局',
    imgPath: '../../../assets/images/tabs-track/position.png'
  };

  // 当前点位图层
  public curLoationLayer;
  // 排口点位图层
  public pipePointLayer;
  // 高亮点位图层
  public highlightLayer;
  // 城市区域图层
  public trackRegionLayer;

  // 高亮点
  public highlight = {
    lat: '',
    lon: '',
  };

  // 排口列表
  public pipeList: any = [];
  public trackRegionNumList: any = [];

  // 点击的点位信息
  public selectedMakerInfo: any = {};

  // 是否展示底部内容信息窗口
  public isShowFooterContent = false;

  // 是否显示图例模态框
  public isShowLegendModal = false;

  // 排口地图图标模型
  public PIPE_TYPE_MARKER_IMG_MODEL: any = {};

  // 图例弹框模型
  public LEGEND_MODAL_MODEL: any = [];

  public mapLevel = 14; // 地图当前缩放级别
  public pointHideLevel = 10; // 地图缩放小于此级别，点位隐藏
  constructor(
    public thsMapService: ThsMapService,
    public deviceInfoService: DeviceInfoService,
    private httpService: HttpService,
    private activeRoute: ActivatedRoute,
    public configService: ConfigService,
    private router: Router,
    public navigationService: NavigationService,
    private platform: Platform) {

  }

  ngOnInit() {

    this.activeRoute.queryParams.subscribe(data => {
      console.log(data, '从档案列表传过来的数据');

      // 从排口档案列表跳转过来时定位到排口位置,并将点位高亮
      if (JSON.stringify(data) !== '{}' && data.type === 'document') {
        this.selectedMakerInfo = data;
        // tslint:disable-next-line:max-line-length
        // const wgPointInfo = this.deviceInfoService.gcj_decrypt_exact(Number(this.selectedMakerInfo.lat), Number(this.selectedMakerInfo.lon));
        this.setCenter(this.selectedMakerInfo.lon, this.selectedMakerInfo.lat, 10);
        //  高亮
        this.highlightPipePoint(this.selectedMakerInfo);
      }
    });

    // 初始化数据模型
    this.initModel();
  }

  /**
   * 地图加载完毕
   * @param map 事件对象
   */
  onMapLoaded(map) {

    this.mapView = map;

    this.thsMapService.createGraphicsLayer('currentLocation', this.mapView).then((res) => {
      this.curLoationLayer = res;
      if (this.configService.curLocation.lon) {
        this.currentLocation.lon = this.configService.curLocation.lon;
        this.currentLocation.lat = this.configService.curLocation.lat;
        this.currentLocation.addr = this.configService.curLocation.addr;
      } else {
        this.getCurrentLocation();
      }

      this.setCenter(this.currentLocation.lon, this.currentLocation.lat);
      this.thsMapService.addPoint(this.currentLocation, this.curLoationLayer, 1);
    });

    this.thsMapService.createGraphicsLayer('pipePoint', this.mapView).then((res) => {
      this.pipePointLayer = res;
      // 获取排口档案列表数据
      this.getTrackReacord();
    });

    this.thsMapService.createGraphicsLayer('regionNumLayer', this.mapView).then((res) => {
      this.trackRegionLayer = res;
      this.getTrackRegionNum();
    });

    this.thsMapService.createGraphicsLayer('highlight', this.mapView).then((res) => {
      this.highlightLayer = res;
    });

    this.mapView.on('click', (e) => {
      if (e.graphic && e.graphic.attributes !== undefined && this.mapLevel > this.pointHideLevel) { // 判断点击的是不是点
        this.selectedMakerInfo = e.graphic.attributes; // 获取点的数据
        if (this.selectedMakerInfo.uuid) {
          this.highlightPipePoint(this.selectedMakerInfo);
        } else {
          this.clearHighlightPoint();
        }
      } else {
        this.clearHighlightPoint();

      }
    });
    this.mapView.on('zoom-end', (e) => {
      // this.mapLevel = e.level;
      if (e.level <= this.pointHideLevel) {
        this.trackRegionLayer.show();
        this.pipePointLayer.hide();
        this.highlightLayer.hide();
      } else {
        this.pipePointLayer.show();
        this.highlightLayer.show();
        this.trackRegionLayer.hide();
      }
    });
  }


  /**
   * 初始化数据模型
   */
  private initModel() {

    this.PIPE_TYPE_MARKER_IMG_MODEL = {
      1: 'assets/images/tabs-track/position_1.png',
      2: 'assets/images/tabs-track/position_2.png',
      3: 'assets/images/tabs-track/position_3.png'
    };

    this.LEGEND_MODAL_MODEL = [
      {
        name: '河沟和渠类',
        imgUrl: 'assets/images/tabs-track/legend_1.png'
      },
      {
        name: '管道类',
        imgUrl: 'assets/images/tabs-track/legend_2.png'
      },
      {
        name: '涵闸或泵站',
        imgUrl: 'assets/images/tabs-track/legend_3.png'
      }
    ];

  }

  /**
   * 获取当前位置
   */
  getCurrentLocation() {
    if (this.highlight.lon !== '') {
      this.setCenterAgain(this.highlight.lon, this.highlight.lat);
      //  this.thsMapService.setCenterAndZoom(this.mapView, this.highlight.Lon , this.highlight.Lat, this.mapLevel);  //  设置当前中心点
      this.highlightPipePoint(this.highlight);
    } else {
      this.deviceInfoService.startLocation().then((res) => {
        this.currentLocation.lon = res.longitude;
        this.currentLocation.lat = res.latitude;
        this.currentLocation.addr = res.address;
        this.setCenter(this.currentLocation.lon, this.currentLocation.lat);
        this.thsMapService.addPoint(this.currentLocation, this.curLoationLayer, 1);
      });
    }
  }

  /**
   * 设置中心点
   * @param lon 中心点经度
   * @param lat 中心点纬度
   * @param zoomLevel 缩放级别
   */
  setCenter(lon, lat, zoomLevel = 10) {
    this.clearHighlightPoint();
    this.thsMapService.setCenterAndZoom(this.mapView, lon, lat, this.mapLevel);  //  设置当前中心点
  }

  setCenterAgain(lon, lat, zoomLevel = 10) {
    this.thsMapService.setCenterAndZoom(this.mapView, lon, lat, this.mapLevel);  //  设置当前中心点
  }
  /**
   * 获取排口档案列表数据
   */
  private getTrackReacord() {

    const params = {
      pipeName: '',
    };

    this.httpService.getTrackReacord(params, false, res => {

      if (!res || res === 'error' || !res.data || !res.data.length) {
        return;
      }

      this.pipeList = this.combinePipeList(res.data);
      console.log('in getTrackReacord: pipeList', this.pipeList);
      this.thsMapService.addPoint(this.pipeList, this.pipePointLayer, 2);
    });
  }

  /**
   * 根据区域获取排口数量
   */
  private getTrackRegionNum() {

    const params = {
      pipeName: '',
    };

    this.httpService.getTrackRegionNum(params, false, res => {

      if (!res || res === 'error' || !res.data || !res.data.length) {
        return;
      }
      console.log('trackRegionNum', this.trackRegionNumList);
      this.trackRegionNumList.forEach(item => {
        // tslint:disable-next-line:no-string-literal
        item['imgPath'] = '../../../assets/images/huang_1.png';
      });
      this.thsMapService.addPoint(this.trackRegionNumList, this.trackRegionLayer, 3);
    });
  }

  /**
   * 组装管道列表
   * @param list 管道列表
   */
  private combinePipeList(list: any = []) {

    return list.filter(item => item.lon && item.lat && item.pipeType).map(filteredItem => {

      const newItem: any = {};

      for (const key in filteredItem) {
        if (key) {
          newItem[key] = filteredItem[key] || '暂无信息';
        }
      }

      // tslint:disable-next-line:no-string-literal
      newItem['imgPath'] = this.PIPE_TYPE_MARKER_IMG_MODEL[filteredItem.pipeType];

      // gcj02坐标系转换成wgs84
      // newItem.lon = this.deviceInfoService.gcj_decrypt_exact(Number(filteredItem.lat), Number(filteredItem.lon)).lon;
      // newItem.lat = this.deviceInfoService.gcj_decrypt_exact(Number(filteredItem.lat), Number(filteredItem.lon)).lat;

      // const lon = this.deviceInfoService.gcj_decrypt_exact(Number(filteredItem.lat), Number(filteredItem.lon)).lon;
      // const lat = this.deviceInfoService.gcj_decrypt_exact(Number(filteredItem.lat), Number(filteredItem.lon)).lat;
      // newItem.lon = this.deviceInfoService.gcj_decrypt_exact(Number(lat), Number(lon)).lon;
      // newItem.lat = this.deviceInfoService.gcj_decrypt_exact(Number(lat), Number(lon)).lat;
      return newItem;

    });

  }


  /**
   * 高亮排口点位，并显示排口档案信息
   * @param pointInfo 排口点位信息
   */
  highlightPipePoint(pointInfo) {
    if (JSON.stringify(pointInfo) !== '{}') {
      this.thsMapService.showHighlightPoint(pointInfo, this.highlightLayer); // 高亮点位
      this.isShowFooterContent = true;
    }
  }
  /**
   * 点击展示
   */
  showButtom() {
    if (JSON.stringify(this.selectedMakerInfo) !== '{}' && !this.isShowFooterContent) {
      this.isShowFooterContent = true;
      return;
    }
    if (this.isShowFooterContent) {
      this.isShowFooterContent = false;
      return;
    }
  }
  /**
   * 取消排口点位的高亮，并关闭排口档案信息的显示
   */
  clearHighlightPoint() {
    console.log('关闭排口档案信息');
    this.isShowFooterContent = false;
    if (this.highlightLayer) {
      this.highlightLayer.clear(); // 清除之前打的点
    }

  }

  /**
   * 打开/关闭 图例模态框
   */
  toggleLegendDialog() {
    this.isShowLegendModal = !this.isShowLegendModal;
  }

  /**
   * 导航到排口位置
   */
  navigate() {
    console.log(this.selectedMakerInfo);
    const dLocation: any = {
      dLat: this.selectedMakerInfo.lat,
      dLon: this.selectedMakerInfo.lon,
      dName: this.selectedMakerInfo.lakeName
    };

    console.log(dLocation);
    this.navigationService.beginNav(dLocation);
  }
}
