import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';
import { Location } from '@angular/common';
import { ThsMapService } from 'src/app/services/ths-map/ths-map.service';
import { DeviceInfoService } from 'src/app/services/device-info-service/device-info.service';
@Component({
  selector: 'app-putlat-map',
  templateUrl: './putlat-map.page.html',
  styleUrls: ['./putlat-map.page.scss'],
})
export class PutlatMapPage implements OnInit {
  @Input() scrollWheel: true;
  public location = {
    lon: 116.46,
    lat: 39.92
  };

  mapView;
  zoomLevel = 14; // 地图默认缩放级别
  constructor(
    public events: Events,
    public lonlocation: Location,
    public activeRoute: ActivatedRoute,
    public thsMapService: ThsMapService,
    public deviceInfoService: DeviceInfoService,
  ) {
    this.activeRoute.queryParams.subscribe(data => {
      if (data) {
        const loc = this.deviceInfoService.gcj_decrypt_exact(Number(data.lat), Number(data.lon));
        this.location.lon = Number(loc.lon.toFixed(6));
        this.location.lat = Number(loc.lat.toFixed(6));
        console.log(this.location, 'map获取到的当前定位');
      }
    });
  }
  ngOnInit() {

  }

  /**
   * 地图加载完毕
   * @param map 事件对象
   */
  onMapLoaded(map) {
    this.mapView = map;
    this.setCenter(this.location.lon, this.location.lat , event);
    map.on('extent-change', () => {
      const vlue = this.thsMapService.getCenter(map);
      const wgsVlue = this.deviceInfoService.gcj_encrypt(Number(vlue.y), Number(vlue.x));
      this.location.lat = Number(wgsVlue.lat.toFixed(6));
      this.location.lon = Number(wgsVlue.lon.toFixed(6));
      // loadModules(['esri/geometry/webMercatorUtils']).then(([webMercatorUtils]) => {
      //   var vlue = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
      //   this.loc.lat = vlue.y.toFixed(6);
      //   this.loc.lng = vlue.x.toFixed(6);
      //   this.getAddressName(vlue.y, vlue.x);
      // })
    });

  }

  /**
   * 设置中心点
   * @param lon 中心点经度
   * @param lat 中心点纬度
   * @param zoomLevel 缩放级别
   */
  setCenter(lon, lat, event, zoomLevel = 10) {
    console.log('传入的参数lon', lon , '传入的参数lat' , lat);
    this.thsMapService.setCenterAndZoom(this.mapView, lon, lat, this.zoomLevel);  //  设置当前中心点
  }
/**
 * 获取当前定位
 * @param event 事件
 */
  getmakerPosition(event) {
    console.log(event);
    this.location.lon = event.lnglat.lng;
    this.location.lat = event.lnglat.lat;
    console.log(this.location);
  }


  /**
   * 点击确定时，将选中的点位信息进行发布
   */
  save() {
    const param = {
      lont: this.location.lon,
      lat: this.location.lat
    };
    this.events.publish('locationInform', param);
    console.log(param, '获取的参数');
    this.lonlocation.back();
  }
}
