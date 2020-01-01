import { Component, ViewChild, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomeService } from '../../../services/home-service/home.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { TrackService } from '../../../services/track-service/track.service';
import { ConfigService } from '../../../services/config-service/config.service';
import { PublicService } from '../../../services/public-service/public.service';
import { HttpService } from '../../../services/http-service/http.service'; // 引入接口方法
import { PickerService } from '../../../services/picker-service/picker.service';
import { ActionSheetController , LoadingController} from '@ionic/angular';
import { SupervisionService } from '../../../services/Supervision-Service/supervision.service';
import { DeviceInfoService } from '../../../services/device-info-service/device-info.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Events } from '@ionic/angular';
import { Location } from '@angular/common';
import { FiletransferService } from '../../../services/filetransfer-service/filetransfer.service';
import { ShowImageComponent } from '../../../components/show-image/show-image.component';
// complonet
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-putlat-modification',
  templateUrl: './putlat-modification.page.html',
  styleUrls: ['./putlat-modification.page.scss']
})
export class PutlatModificationPage implements OnInit {
  isOpenSearch = false; // 是否打开搜索窗口
  searchConfig: any = {}; // 搜索组件参数
  searchParams: any = {}; // 页面搜索参数
  shoWaterquality = false;
  public imgshow = [];
  public num = 3;
  // 图片张数
  public imgNum = this.num;
  public searchname;
  public showSearch;
  public uid;
  public recordIndex = 0;
  // 一共上传的图片
  public uploadpicture = [];
  // 从手机储存选择的图片
  public uploadimg = [];
  public maxLength;
  public max = 450;
  public textLength = '';
  // 选择的照片
  public uploadphoto = [];
  public pipeUuid;
  public PutletDetail; // 获取详细数据
  public putletOption = {
    pipeMaterialAualityName: '',
    waterQualitySenseName: '',
    pipeTypeName: '',
    waterEnvDivisionName: ''
  };
  public WaterMonData; // 获得监测数据
  // 排口详情档案
  public PutletDetailInfo = {
    type: '2',
    uuid: '',
    pipeCode: '',
    waterEnvDivision: '', // 水环境功能区划
    waterEnvDivisionCode: '',

    pipeButtomElevation: '', // 管底绝对高程
    lon: '', // 经度
    lat: '', // 维度

    pipeMaterialAuality: '',
    pipeMaterialAualityCode: '',

    pipeName: '', // 排口名称

    lakeName: '', // 湖泊名称
    lakeCode: '',

    location: '', // 所在地  城市+区+镇+街道

    city: '', // 城市
    district: '', // 区
    town: '', // 镇
    street: '', // 街道

    pipeSize: '', // 排口尺寸
    pipeLocation: '', // 排口位置
    remarks: '',

    waterQualitySense: '', // 管道材质
    waterQualitySenseCode: '',

    pipeType: '', // 排口类型
    pipeTypeCode: ''
  };
  // 检测数据
  public WaterMon = {
    type: 2,
    monitoringTime: '', // 检测时间
    PH: '',
    waterYield: '', // 水量
    waterPeriod: '', // 水期
    cod: ''
  };
  public curLocation;
  public modieLocation = {
    lon: '',
    lat: ''
  };
  public loader = null;
  public showtitle = true;
  public showpic = false;
  public showph = false;
  public picture = []; // 获取的照片
  public imge = []; // 从手机上获取的文件
  public supervisionList = []; // 监督检查列表数据
  public page = 1; // 当前页码
  public pageSize = 20; // 每页数据量
  public loadEvent;
  public item;
  public waterFunctionNameOptions = [[], []];
  public putlatOptions = [[], []];
  public pipeTypeOptions = [[], []];
  public waterQualityOptions = [[], []];
  public waterPhOption;
  constructor(
    public router: Router, // 路由
    public modalCtrl: ModalController,
    private domSanitizer: DomSanitizer,
    public activeRoute: ActivatedRoute,
    public httpservice: HttpService,
    public deviceinfo: DeviceInfoService,
    private transfer: FileTransfer,
    public events: Events,
    private webview: WebView,
    public location: Location,
    private imagePicker: ImagePicker,
    public loadingController: LoadingController,
    private camera: Camera,
    public filetransferservice: FiletransferService,
    public pickerService: PickerService,
    public homeservice: HomeService,
    public trackservice: TrackService,
    public publicservice: PublicService,
    public configservice: ConfigService,
    public actionSheetController: ActionSheetController,
    public deviceInfoService: DeviceInfoService,
    public supervisionService: SupervisionService
  ) {}
  ngOnInit() {
    this.activeRoute.queryParams.subscribe(data => {
      if (data) {
        this.pipeUuid = data.uuid;
        console.log(this.pipeUuid, '获取到了pipecode');
        // 渲染静态视图数据
        this.renderStaticView();
        this.getPutletDetail();
        this.getWaterMon();
        // 获取定位信息
        this.getOption();
      }
    });
    // 回显得到的参数 从map页面获取事件发布的参数以后事件发布还会进行
    // 路由跳转
    this.events.subscribe('locationInform', data => {
      console.log('修改页面获取到了参数', data);
      // this.PutletDetailInfo.lon = param.lont;
      this.modieLocation.lon = data.lont;
      this.modieLocation.lat = data.lat;
      this.getpipeLocation(data.lont, data.lat);
      console.log('修改的信息', this.PutletDetailInfo);
    });
  }
  ngOnDestory() {
    this.events.unsubscribe('locationInform');
  }

  /**
   * 获取排口位置
   */
  getpipeLocation(lon, lat) {
    let vm;
    vm = this;
    const index = { lat: '', lng: '' };
    index.lat = lat;
    index.lng = lon;
    console.log('定位信息', index);
    this.httpservice.getJsonp(index, true, res => {
      if (!res || !res.result || !res.result.addressComponent) {
        return;
      }
      console.log('位置信息', res);
      this.PutletDetail.pipeLocation = res.result.addressComponent.town || '';
    });
  }
  /**
   * 点击图片跳出模态框实现放大
   * @param pictures 点击放大的图片
   */
  async presentModal(pictures) {
    const modal = await this.modalCtrl.create({
      component: ShowImageComponent,
      componentProps: {
        photos: pictures,
        initialSlide: ''
      }
    });
    return await modal.present();
  }
  /**
   * 点加号，出现选项拍照和手机储存的选项
   */
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: '选择',
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          icon: 'reverse-camera',
          handler: () => {
            console.log('点击拍照 clicked');
            this.getCamera();
            if (this.picture.length !== 0) {
              this.showpic = true;
              this.showtitle = false;
            }
            // 添加图片到数组
          }
        },
        {
          text: '手机储存',
          icon: 'photos',
          handler: () => {
            console.log('点击手机储存 clicked');
            this.getPhoto();
            if (this.imge.length !== 0) {
              this.showph = true;
              this.showtitle = false;
            }
          }
        },
        {
          text: '取消',
          icon: 'close',
          handler: () => {
            console.log('Share clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }
  /**
   * 跳转到地图以获取精确的定位
   */
  toMap() {
    this.router.navigate(['putlat-map'], {
      queryParams: {
        lat: this.PutletDetailInfo.lat,
        lon: this.PutletDetailInfo.lon
      }
    });
  }
  /**
   * 获取档案详情
   */
  getPutletDetail() {
    const params = {
      uuid: this.pipeUuid
    };

    this.httpservice.getPutletDetail(params, true, res => {
      this.PutletDetail = res.data.map(item => {
        if (item.imgList ) {
          item.imgList = item.imgList.split(',');
          this.imgshow = item.imgList;
        }

        return item;
      });
      this.PutletDetailInfo.waterEnvDivisionCode = res.data[0].waterEnvDivision;
      this.PutletDetailInfo.waterEnvDivision = res.data[0].waterEnvDivisionName;

      this.PutletDetailInfo.pipeButtomElevation =
        res.data[0].pipeButtomElevation;
      // 如果这个对象为空则直接复制
      if (!this.modieLocation.lon) {
        this.PutletDetailInfo.lon = res.data[0].lon;
        this.PutletDetailInfo.lat = res.data[0].lat;
        this.PutletDetailInfo.pipeLocation = res.data[0].pipeLocation;
      } else {
        this.PutletDetailInfo.lon = this.modieLocation.lon;
        this.PutletDetailInfo.lat = this.modieLocation.lat;
        // 重新获取位置
        let vm;
        vm = this;
        vm.getAddressDetail({
          lat: this.modieLocation.lat,
          lng: this.modieLocation.lon
        }).then(() => {
          console.log('in getAddressDetail: res, resp', res);

          vm.curLocation = res;
          console.log('当前定位', vm.curLocation);
          vm.PutletDetailInfo.pipeLocation =
            res.locationdescribe || vm.PutletDetailInfo.street || '';
          console.log('从地图获取新的定位的位置', res);
        });
      }
      this.PutletDetailInfo.pipeMaterialAuality =
        res.data[0].pipeMaterialAualityName;
      this.PutletDetailInfo.pipeMaterialAualityCode =
        res.data[0].pipeMaterialAuality;

      this.PutletDetailInfo.pipeTypeCode = res.data[0].pipeTypeName;
      this.PutletDetailInfo.pipeCode = res.data[0].pipeCode;

      this.PutletDetailInfo.pipeName = res.data[0].pipeName;

      this.PutletDetailInfo.lakeName = res.data[0].lakeName;
      this.PutletDetailInfo.lakeCode = res.data[0].lakeCode;

      this.PutletDetailInfo.location = res.data[0].location;
      this.PutletDetailInfo.pipeSize = res.data[0].pipeSize;

      this.PutletDetailInfo.remarks = res.data[0].remarks;

      this.PutletDetailInfo.pipeType = res.data[0].pipeTypeName;
      this.PutletDetailInfo.pipeTypeCode = res.data[0].pipeType;

      this.PutletDetailInfo.uuid = res.data[0].uuid;

      this.PutletDetailInfo.waterQualitySense =
        res.data[0].waterQualitySenseName;
      this.PutletDetailInfo.waterQualitySenseCode =
        res.data[0].waterQualitySense;
      console.log(this.PutletDetailInfo.remarks , '重新获取到数据 ------------------------   备注');
      console.log(this.PutletDetailInfo, '从修改界面获取到的获取的详情档案');
    });
  }
  /**
   * 获取入湖监测数据，存在就显示，不存在就隐藏
   */
  getWaterMon() {
    const params = {
      uuid: this.pipeUuid
    };

    this.httpservice.getWaterMon(params, true, res => {
      this.WaterMonData = res.data;
      console.log(res.data, '监测数据');
      if (res.data.length === 0) {
        console.log('未获取到监测数据');
      } else {
        console.log('成功获取到监测数据');
        this.shoWaterquality = true;
      }
    });
  }
  /**
   * 下拉框
   * @param start 起始长度
   * @param length 数组长度
   * @param option 数组
   * @param type 判断字段
   */
  pickerFn(start, length, option, type) {
    let that;
    that = this;
    this.pickerService.openPicker(start, length, option, result => {
      let vals;
      vals = JSON.parse(result)['col-0'].text;
      switch (type) {
        case 'pipeType':
          that.PutletDetailInfo.pipeMaterialAuality = vals;

          this.PutletDetailInfo.pipeMaterialAualityCode = this.homeservice.getindex(
            this.pipeTypeOptions,
            vals
          );
          break;
        case 'waterQuality':
          that.PutletDetailInfo.waterQualitySense = vals;
          this.PutletDetailInfo.waterQualitySenseCode = this.homeservice.getindex(
            this.waterQualityOptions,
            vals
          );
          break;
        case 'putlat':
          that.PutletDetailInfo.pipeType = vals;
          this.PutletDetailInfo.pipeTypeCode = this.homeservice.getindex(
            this.putlatOptions,
            vals
          );
          console.log('排口类型的编码', this.PutletDetailInfo.pipeTypeCode);
          break;
        case 'waterFunction':
          that.PutletDetailInfo.waterEnvDivision = vals;
          this.PutletDetailInfo.waterEnvDivisionCode = this.homeservice.getindex(
            this.waterFunctionNameOptions,
            vals
          );
          break;
        default:
          break;
      }
    });
  }
  /**
   * 获取字典
   */
  getOption() {
    const params = {};
    this.httpservice.getOption(params, true, res => {
      this.homeservice.getArry(
        res.waterResourcesZoning,
        this.waterFunctionNameOptions
      );
      this.homeservice.getArry(res.pipeMaterialAuality, this.pipeTypeOptions);
      this.homeservice.getArry(res.waterQualitySense, this.waterQualityOptions);
      this.homeservice.getArry(res.pipeType, this.putlatOptions);
      console.log(res, 'res');
    });
  }

  // 拍照
  // 获取的照片 public picture = [];
  // 从手机上获取的文件 public imge = [];
    // 一共上传的图片
    // public uploadpicture = [];
    // // 从手机储存选择的图片
    // public uploadimg = [];
    // // 选择的照片
    // public uploadphoto = [];
  getCamera() {
    if ( this.imgshow.length >= this.num  ) {
      this.publicservice.thsToast('已有' + this.num + '张图片');
      return ;
    } else {
      // this.uploadphoto.length + this.uploadimg.length
      if ( this.uploadphoto.length + this.imgshow.length + this.uploadimg.length >= this.num ) {
        this.publicservice.thsToast('已有' + this.num + '张图片');
        return ;
      } else {
        let pictureIndex;
        let options: CameraOptions;
        options = {
          quality: 50,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        };
        // 得到照片
        pictureIndex = this.camera.getPicture(options).then(
          imageData => {
            let pictureTest: SafeResourceUrl;
            // 照片
            this.uploadphoto.push(imageData);
            pictureTest = this.domSanitizer.bypassSecurityTrustResourceUrl(
              this.webview.convertFileSrc(imageData)
            );

            this.picture.push(pictureTest);
            if (this.picture.length !== 0) {
              this.showpic = true;
              this.showtitle = false;
            }
            return pictureTest;
          },
          err => {
            console.log('Error: ' + err);
          }
        );
      }
    }
  }
  /**
   * 手机储存选择图片
   */
  getPhoto() {
    let options;
    if ( this.imgshow.length >= this.num ) {
      this.imgNum = 0;
      this.publicservice.thsToast('已有' + this.num + '张图片');
      return ;
    } else {
      //  this.uploadpicture = this.uploadimg.concat(this.uploadphoto);
      if (this.imgshow.length + this.uploadphoto.length + this.uploadimg.length >= this.num ) {
        this.imgNum = 0 ;
        this.publicservice.thsToast('已有' + this.num + '张图片');
        return ;
      } else {
        this.imgNum = this.num - this.imgshow.length - this.uploadphoto.length;
        console.log('this.imgNum');
        options = {
          maximumImagesCount: this.imgNum ,
          width: 800,
          quality: 50
        };
        this.imagePicker.getPictures(options).then(
          results => {
            let phothtest: SafeResourceUrl;
            let i;
            for (i = 0; i < results.length; i++) {
              this.uploadimg.push(results[i]);

              phothtest = this.domSanitizer.bypassSecurityTrustResourceUrl(
                this.webview.convertFileSrc(results[i])
              );

              this.imge.push(phothtest);
              console.log(this.imge[i]);
              if (this.imge.length !== 0) {
                this.showph = true;
                this.showtitle = false;
              }
            }
          },
          err => {
            console.log('Error: ' + err);
          }
        );
      }
      }
  }
  /**
   * 处理输入的数字
   * @param type 类型
   * @param obj 对象
   */
  toNotice(type, obj) {
    switch (type) {
      // 判断是否是整数
      case 0:
        if (this.homeservice.isInt(obj) === false) {
          //  this.publicservice.thsToast('请输入整数');
        }
        return this.homeservice.isInt(obj);
      // break;
      // 判断是都精确到后两位
      case 2:
        if (this.homeservice.isFloat(2, obj) === false) {
          //  this.publicservice.thsToast('请输入整数');
        }
        return this.homeservice.isFloat(2, obj);
      // break;
      // 判断是都精确到后三位
      case 3:
        if (this.homeservice.isFloat(3, obj) === false) {
          // this.publicservice.thsToast('请输入整数');
        }
        return this.homeservice.isFloat(3, obj);
      // break;
      default:
        break;
    }
  }
/**
 * 处理传入的路径
 * @param item 路径
 */
  doSlice(item) {
    let arr;
    let index;
    arr = item.split('/');
    index = arr.length - 1;
    console.log(arr, 'arr');
    console.log(index, 'index');
    console.log(arr[index], 'arr[index]');
    return arr[index];
  }
/**
 * 上传表单
 */
  upLoadForm() {
    // 获取接口地址  不为空 返回true 这是非整数
  let urlDetail;
  urlDetail = this.configservice.putletInput; // 接口
  this.publicservice.post(urlDetail, this.PutletDetailInfo, true, res => {
      if (res !== 'error') {
        console.log('上传表单失败');
      } else {
        console.log('上传表单成功');
      }
    });
}
/**
 * 上传图片
 */
upLoadImg() {
  let urlImg;
  urlImg = this.configservice.imgInput; // 上传图片接口
  // 全部图片
  const options = {
    fileKey: 'file',
    fileName: '',
    mimeType: '',
    params: {
      uuid: this.pipeUuid,
      fileKey: 'detail',
      fileName: ''
    }
  };
  this.uploadpicture = this.uploadimg.concat(this.uploadphoto);

  this.recordIndex = 0;

  this.presentLoadingUp();
  this.uploadpicture.forEach(element => {
  options.fileName = this.homeservice.doSlice(element);
  options.params.fileName = this.homeservice.doSlice(element);
  options.mimeType = this.homeservice.getmimeType(options.fileName);

  this.filetransferservice.fileUpload(urlImg,  element, options,  res => {
  console.log('上传图片的返回值', res);
  console.log('2222');
  if ( res.response === 'sucess') {
        console.log('333');
        console.log('上传图片成功');
        this.recordIndex++;
        console.log( this.recordIndex , '**');
        if ( this.uploadpicture.length === this.recordIndex ) {
            // 修改成功以后，
            const param = {
                uuid: this.PutletDetailInfo.uuid
              };
            this.events.publish('params', param);
            this.hideLoading(this.loader);
            this.toback(true);
        }
      } else {
        console.log('本次上传图片失败');
        this.hideLoading(this.loader);
        this.publicservice.thsToast('上传失败');
        this.toback(true);
          }
        });
      });

}
/**
 * 上传
 * @param showloading 是否显示加载
 */
upload( showloading ) {
  if (
    !this.homeservice.isEmpty(this.PutletDetailInfo.pipeName) ||
    !this.homeservice.isEmpty(this.PutletDetailInfo.lon) ||
    !this.homeservice.isEmpty(this.PutletDetailInfo.lat) ||
    !this.homeservice.isEmpty(this.PutletDetailInfo.pipeCode) ||
    !this.homeservice.isEmpty(this.PutletDetailInfo.pipeType) ||
    !this.homeservice.isEmpty(this.PutletDetailInfo.lakeName)
  ) {
    this.publicservice.thsToast('请完成必填项');
  } else {
    if (
      !this.homeservice.isEmpty(this.PutletDetailInfo.pipeButtomElevation)
    ) {
      console.log('管底绝对高程没有值');
    } else {
      let index;
      index = this.publicservice.handlefigure(
        this.PutletDetailInfo.pipeButtomElevation,
        3
      );
      if (index !== false) {
        this.PutletDetailInfo.pipeButtomElevation = index;
      } else {
        // this.PutletDetailInfo.pipeButtomElevation = '请输入三位小数';
        // this.PutletDetailInfo.pipeButtomElevation = index;
        this.publicservice.thsToast('请输入三位小数');
        return;
      }
    }
    // if ( showloading) {
    //   this.publicservice.presentLoadingUp();
    // }

    this.uploadpicture = this.uploadimg.concat(this.uploadphoto);
    if ( this.uploadpicture.length === 0 ) {
      this.publicservice.presentLoadingUp( );
      this.upLoadForm( );
      this.toback(true);
    } else {

      this.upLoadForm( );
      this.upLoadImg();
    }
}
}
 toback(showloading) {
  // if (showloading && this.publicservice.loader) {
  //   this.publicservice.hideLoading( this.publicservice.loader);
  // }
  this.publicservice.thsToast('修改成功');
  this.location.back();
  // this.returnBack();
 }
  /**
   * 获取当前定位
   */
  getLocation() {
    // 视图模型别名
    let vm;
    vm = this;

    this.deviceinfo.startLocation().then(res => {
      vm.getAddressDetail({
        lat: res.latitude,
        lng: res.longitude
      }).then(() => {
        console.log('in getAddressDetail: res, resp', res);

        vm.curLocation = res;
        console.log('当前定位', vm.curLocation);
        vm.PutletDetailInfo.lat = res.latitude;
        vm.PutletDetailInfo.lon = res.longitude;
        vm.PutletDetailInfo.pipeLocation =
          res.locationdescribe || vm.PutletDetailInfo.street || '';
        console.log('当前位置', res);
      });
    });
  }
  /**
   * 获取详细定位地址
   * @param location 地理位置信息
   * @param location.lat 纬度
   * @param location.lon 经度
   */
  private getAddressDetail(location: any = {}) {
    const promise = new Promise((resolve, reject) => {
      // 视图模型别名
      let vm;
      vm = this;

      this.httpservice.getJsonp(location, true, res => {
        if (!res || !res.result || !res.result.addressComponent) {
          return;
        }

        // vm.PutletDetailInfo.street = res.result.addressComponent.street || '';
        // vm.PutletDetailInfo.city = res.result.addressComponent.city || '';
        // vm.PutletDetailInfo.district =
        //   res.result.addressComponent.district || '';

        resolve();

        console.log('in getAddressDetail: addressDetail', res.result);
      });
    });

    return promise;
  }

  /**
   * 渲染静态视图数据
   */
  private renderStaticView() {
    this.searchConfig = {
      // 搜索键名
      searchKey: 'lakeName',
      // placeholder
      searchPlaceholder: '请输入湖泊',
      // 结果列表键名
      resultListKey: 'data',
      // 接口地址
      interfaceUrl: this.configservice.getLakeAndOutputInterface,
      method: 'get',
      // 显示加载动画
      showLoading: true,
      // 该属性为真的时候，当搜索结果列表中搜索字段对应值包含搜索字段值的时候才能进行搜索
      openSearchExp: true,
      // 搜索参数
      searchParams: {
        page: 1,
        pageSize: 3000
      }
    };
  }

  /**
   * 打开搜索窗口
   */
  openSearchModal(isOpen) {
    this.isOpenSearch = isOpen;
  }

  /**
   * 开始搜索
   */
  shouldSearch(event) {
    this.openSearchModal(false);
    this.searchParams.searchText = event.searchText;
    console.log('event.searchText', event.searchText);

    this.getSpecificList(event.searchText);
    console.log('in shouldSearch: event', event);
  }
  /**
   * @param lakeName  搜索后得到的列表
   */
  getSpecificList(lakename) {
    const params = {
      lakeName: lakename
    };

    this.httpservice.getlakeReacord(params, true, res => {
      console.log('搜索得到湖泊的相关信息', res.data);
      if (res.data) {
        this.searchname = res.data[0].lakeName;
        this.PutletDetailInfo.lakeName = res.data[0].lakeName;
        this.PutletDetailInfo.lakeCode = res.data[0].lakeCode;
        console.log('显示出搜索结果', this.showSearch);
      }
    });
  }
  /**
   * 输入内容限制
   */
  TextOnChange() {
    this.textLength = this.PutletDetailInfo.remarks ;
    const regexp = /[^\x00-\xff]/g; // 正在表达式匹配中文
    if (this.textLength.match(regexp)) {
      const chinese = this.textLength.match(regexp).length * 3;
      const english = this.textLength.replace(regexp, '').length;
      const allLength = chinese + english;
      if (allLength > this.max) {
        this.maxLength = this.max - chinese - english + (this.max - chinese / 3) + english;
        this.publicservice.thsToast('最多输入450个字符(一个中文为3个字符)');
      }
    } else {
      const english = this.textLength.replace(regexp, '').length;
      const allLength = english;
      if (allLength > this.max) {
        this.maxLength = this.max;
        this.publicservice.thsToast('最多输入450个字符(一个中文为3个字符)');
      }
    }
  }
  // }
  /**
   * 出现加载框
   */
  async presentLoadingUp() {
    // if (this.loader) {
    //   return;
    // }
    this.loader = await this.loadingController.create({
      // message: template ? `<p>${template}</p>` : '',
      // mode: 'ios',
      spinner: 'circles',
      // duration: 6000
    });
    await this.loader.present();
  }
  /**
   * 关闭加载框
   */
  hideLoading(loader) {
    loader.dismiss();
  }
}
