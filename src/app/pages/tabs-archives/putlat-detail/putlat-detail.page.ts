import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http-service/http.service'; // 引入接口方法
import { Router, ActivatedRoute } from '@angular/router';
import { ShowImageComponent } from '../../../components/show-image/show-image.component';
// complonet
import { Location } from '@angular/common';
import { Events } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-putlat-detail',
  templateUrl: './putlat-detail.page.html',
  styleUrls: ['./putlat-detail.page.scss'],
})
export class PutlatDetailPage implements OnInit {
  public imgshow;
  public shoWaterquality = false;
  public pipeUuid;
  public PutletDetail; // 获取详细数据
  public WaterMonData; // 获得监测数据
  public waterFunctionNameOptions = [[], []]; // 储存名字和code
  public putlatOptions = [[], []];
  public pipeTypeOptions = [[], []];
  public waterQualityOptions = [[], []];
  public waterPhOption = [[], []];
  public waterPeriodOption = [[], []];
  public waterEnvDivision: ''; // 水环境区划
  public pipeMaterialAuality: '';  // 管道类型
  public waterQualitySense: ''; // 水质感官
  public pipeType: '';  //   排口类型
  public waterPeriod: '1'; // 水期
  public item;

  constructor(
    public modalCtrl: ModalController,
    public activeRoute: ActivatedRoute,
    public httpservice: HttpService,
    public router: Router,
    public events: Events,
    public location: Location,
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(data => {
      if (data) {
        this.pipeUuid = data.uuid;
        console.log(this.pipeUuid, '获取到了uuid');
      }
      this.getOption();
      this.getPutletDetail(true);
      this.getWaterMon();
    });
    this.events.subscribe ('toPublish' , data => {
      this.getPutletDetail(true);
      console.log('接受事件发布' );
    });
  }
 // 调用模态框
 async presentModal(pictures) {
  const modal = await this.modalCtrl.create({
    component: ShowImageComponent,
    componentProps: {
      photos : pictures,
      initialSlide: '',
    }
  });
  return await modal.present();
}
  // 获取详细的数据
  getPutletDetail(showLoading: boolean) {
    const params = {
      // pipeName : '',
      uuid: this.pipeUuid,
    };
    // console.log(this.pipeUuid, '获取到pipecode');
    this.httpservice.getPutletDetail(params, showLoading, res => {
      this.PutletDetail = res.data.map(item => {

        // if (item.imgList && item.imgList.indexOf(',') !== -1) {
        if (item.imgList) {
          item.imgList = item.imgList.split(',');
          this.imgshow =  item.imgList;
          console.log('123' , this.imgshow);
        }

        return item;
      });

      console.log(this.PutletDetail, '返回详细数据');
      // 展示选项类型的数据；
      this.waterEnvDivision = this.showOption(this.waterFunctionNameOptions, res.data[0].waterEnvDivision);
      this.pipeMaterialAuality = this.showOption(this.pipeTypeOptions, res.data[0].pipeMaterialAuality);
      this.pipeMaterialAuality = this.showOption(this.pipeTypeOptions, res.data[0].pipeMaterialAuality);
      this.pipeType = this.showOption(this.putlatOptions, res.data[0].pipeType);
      this.waterQualitySense = this.showOption(this.waterQualityOptions, res.data[0].waterQualitySense);
    });
  }

//  获取监测数据
  getWaterMon() {
    const params = {
     uuid: this.pipeUuid,
    };

    this.httpservice.getWaterMon(params, true, res => {
      this.WaterMonData = res.data;
      // console.log(res.data, '监测数据');
      if ( res.data.length === 0 ) {
        // console.log( '未获取到监测数据');
      } else {
        console.log( '成功获取到监测数据');
        this.shoWaterquality = true;
      }
    });
  }

/**
 * 将获取的code值展示为字段
 */
  showOption(arr, item) {
    let index;
    index = arr[1].indexOf(item);
    console.log('下标', index);
    console.log(arr[0][index]);
    return arr[0][index];
  }

  // 获取字典
  getOption() {
    const params = {
      // pipeName : '',
      // ' pipeCode' :  this.pipeCodeData,
    };
    this.httpservice.getOption(params, true, res => {
      // 水环境功能区划
      this.getArry(res.waterResourcesZoning, this.waterFunctionNameOptions);
      // 管道类型
      this.getArry(res.pipeMaterialAuality, this.pipeTypeOptions);
      // 水质
      this.getArry(res.waterQualitySense, this.waterQualityOptions);
      // 排口类型
      this.getArry(res.pipeType, this.putlatOptions);
      // 水期
      this.getArry(res.waterPhase, this.waterPeriodOption);
      console.log(res, '所有的选项');
    });
  }

  // 将服务器获得的选项名和code存入二维数组
  getArry(array, brry) {
    array.forEach(element => {
      brry[0].push(element.NAME);
      //  得到code值
      brry[1].push(element.CODE);
    });
  }
  /**
   * 跳转到修改页面
   */
  toModification() {
    this.router.navigate(['/putlat-modification'], {
      queryParams: {
        uuid: this.pipeUuid
      }
    });
  }
  // /**
  //  * 返回上一页面
  //  */
  // back() {
  //   console.log('返回上一页面');
  //   this.events.publish('loadAgin');
  //   this.location.back();
  // }
}
