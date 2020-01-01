import { Component, ViewChild, OnInit, Input  } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomeService } from '../../../services/home-service/home.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { TrackService } from '../../../services/track-service/track.service';
import { ConfigService } from '../../../services/config-service/config.service';
import { PublicService } from '../../../services/public-service/public.service';
import { HttpService } from '../../../services/http-service/http.service'; // 引入接口方法
import { PickerService } from '../../../services/picker-service/picker.service';
import { ActionSheetController } from '@ionic/angular';
import { IonInfiniteScroll , LoadingController} from '@ionic/angular';
import { SupervisionService } from '../../../services/Supervision-Service/supervision.service';
import { DeviceInfoService } from '../../../services/device-info-service/device-info.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ModalController } from '@ionic/angular';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { ShowImageComponent } from '../../../components/show-image/show-image.component';
// complonet
import { Events } from '@ionic/angular';
import { Location } from '@angular/common';
import { FiletransferService } from '../../../services/filetransfer-service/filetransfer.service';
import { HttpClient } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-putlat-add',
  templateUrl: './putlat-add.page.html',
  styleUrls: ['./putlat-add.page.scss']
})
export class PutlatAddPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public resultList;
  public expression = false;
  public num = 3;
  public imgNum = this.num;
  public recordIndex = 0;
  public maxLength;
  public max = 450;
  public loader = null;
  // 排口详情档案
  public PutletDetail = {
    type: '1',
    uuid: '',
    pipeCode: '',
    // 水环境功能区划
    // waterEnvDivision: '',
    // waterEnvDivisionCode: '',

    pipeButtomElevation: '', // 管底绝对高程
    lon: null, // 经度
    lat: null, // 维度

    pipeMaterialAuality: '',
    pipeMaterialAualityCode: '',

    pipeName: '', // 排口名称

    lakeName: '', // 湖泊名称
    lakeCode: '', // 湖泊编号

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
  // public WaterMon = {
  //   type: '1',
  //   uuid: '',
  //   // monitoringTime: '', // 检测时间
  //   ph: '',
  //   waterYield: '', // 水量
  //   waterPeriod: '', // 水期
  //   waterPeriodCode: '',
  //   cod: ''
  // };
  public uid;
  public searchname;
  public showSearch;
  isOpenSearch = false; // 是否打开搜索窗口
  searchConfig: any = {}; // 搜索组件参数
  searchParams: any = {}; // 页面搜索参数
  public SpecificList;
  public serchList;
  public lakeInform; // 湖泊的信息
  public curLocation; // 当前定位
  // public showtitle = true;
  public showpic = false;
  public showph = false;
  public picture = []; // 获取的照片 转码后存储
  public imge = []; // 从手机上获取的文件
  public supervisionList = []; // 监督检查列表数据
  public page = 1; // 当前页码
  public pageSize = 20; // 每页数据量
  public loadEvent;
  public item;
  public waterFunctionNameOptions = [[], []]; // 储存名字和code
  public lakeOptions = [[], []];
  public putlatOptions = [[], []];
  public pipeTypeOptions = [[], []];
  public waterQualityOptions = [[], []];
  public waterPhOption = [[], []];
  public waterPeriodOption = [[], []];
  public uploadphoto = []; // 不转码存储的照片
  public uploadimg = [];
  public uploadpicture = [];
  public textLength = '';

  constructor(
    public events: Events,
    public modalCtrl: ModalController,
    // private nativeStorage: NativeStorage
    public httpclient: HttpClient,
    private domSanitizer: DomSanitizer,
    public deviceinfo: DeviceInfoService,
    private transfer: FileTransfer,
    private webview: WebView,
    public location: Location,
    private imagePicker: ImagePicker,
    private camera: Camera,
    public filetransferservice: FiletransferService,
    public pickerService: PickerService,
    public router: Router, // 路由
    public homeservice: HomeService,
    public publicservice: PublicService,
    public configservice: ConfigService,
    public httpservice: HttpService,
    public actionSheetController: ActionSheetController,
    public deviceInfoService: DeviceInfoService,
    public supervisionService: SupervisionService,
    public loadingController: LoadingController,
  ) { }

  // 调用模态框
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
              // this.showtitle = false;
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
              // this.showtitle = false;
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

  // 获取的
  ngOnInit() {
    // 渲染静态视图数据
    this.renderStaticView();
    this.getOption();
    // 获取定位信息
    this.getCurlocation();
    // 回显得到的参数
    this.events.subscribe('locationInform', data => {
      this.PutletDetail.lon = data.lont;
      this.PutletDetail.lat = data.lat;
      this.getpipeLocation(data.lont, data.lat);
    });
  }
  ngOnDestory() {
    this.events.unsubscribe('locationInform');
  }

  /**
   * 一进入就获取经纬度
   */
  getCurlocation() {
    this.PutletDetail.lon = this.deviceInfoService.locData.longitude;
    this.PutletDetail.lat = this.deviceInfoService.locData.latitude;
    this.getpipeLocation(this.PutletDetail.lon, this.PutletDetail.lat);
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
   *  跳转到map界面
   */
  toMap() {
    this.router.navigate(['putlat-map'], {
      queryParams: {
        lat: this.PutletDetail.lat,
        lon: this.PutletDetail.lon
      }
    });
  }
  /**
   * 获取监督检查列表数据
   * @param showLoading 是否显示弹出loading
   */
  getSupervisionList(showLoading: boolean) {
    const param = {
      page: this.page,
      pageSize: this.pageSize
    };
    this.supervisionService.getSupervisionList(param, showLoading, data => {
      if (data !== 'error' && data.status === '1') {
        if (this.loadEvent && this.loadEvent.type === 'ionInfinite') {
          this.supervisionList.push(...data.data);
          // 列表数据全部加载完成后，禁止上拉加载更多事件
          if (Number(data.total) <= this.supervisionList.length) {
            this.loadEvent.target.disabled = true;
          }
        } else {
          this.supervisionList = data.data || [];
        }
      } else {
        this.supervisionList = [];
        this.httpservice.thsToast('数据请求异常，请稍后重试！');
      }
      // 让上拉或者下拉事件中的loading状态完成
      if (this.loadEvent) {
        this.loadEvent.target.complete();
        this.loadEvent = null;
      }
    });
  }

  /**
   * 下拉刷新列表数据
   * @param event 下拉事件
   */
  refreshList(event) {
    this.loadEvent = event;
    this.page = 1;
    this.infiniteScroll.disabled = false;
    this.getSupervisionList(false);
  }

  /**
   * 上拉加载更多
   * @param event 上拉事件
   */
  loadMoreData(event) {
    this.loadEvent = event;
    this.page++;
    this.getSupervisionList(false);
  }

  openDetail(item: {}) {
    console.log(item);
  }

  pickerFn(start, length, option, type) {
    let that;
    that = this;
    this.pickerService.openPicker(start, length, option, result => {
      let vals;
      vals = JSON.parse(result)['col-0'].text;
      switch (type) {
        case 'pipeType':
          // 管道材质
          that.PutletDetail.pipeMaterialAuality = vals;
          this.PutletDetail.pipeMaterialAualityCode = this.getindex(
            this.pipeTypeOptions,
            vals
          );
          break;
        case 'waterQuality':
          // 水质
          that.PutletDetail.waterQualitySense = vals;
          this.PutletDetail.waterQualitySenseCode = this.getindex(
            this.waterQualityOptions,
            vals
          );
          break;
        case 'putlat':
          // 排口类型
          that.PutletDetail.pipeType = vals;
          this.PutletDetail.pipeTypeCode = this.getindex(
            this.putlatOptions,
            vals
          );
          break;
        // 水功能区划
        // case 'waterFunction':
        //   that.PutletDetail.waterEnvDivision = vals;
        //   this.PutletDetail.waterEnvDivisionCode = this.getindex(
        //     this.waterFunctionNameOptions, vals  );
        //   break;
        // case 'waterPeriod':
        //   that.WaterMon.waterPeriod = vals;
        //   this.WaterMon.waterPeriodCode = this.getindex(
        //     this.waterPeriodOption,
        //     this.WaterMon.waterPeriod
        //   );
        //   break;
        default:
          break;
      }
    });
    console.log(
      this.PutletDetail.pipeMaterialAualityCode,
      'this.PutletDetail.pipeMaterialAualityCode'
    );
  }

  getOption() {
    const params = {
      // pipeName : '',
      // ' pipeCode' :  this.pipeCodeData,
    };
    this.httpservice.getOption(params, true, res => {
      this.getArry(res.waterResourcesZoning, this.waterFunctionNameOptions);
      this.getArry(res.pipeMaterialAuality, this.pipeTypeOptions);
      this.getArry(res.waterQualitySense, this.waterQualityOptions);
      this.getArry(res.pipeType, this.putlatOptions);
      this.getArry(res.waterPhase, this.waterPhOption);
      this.getArry(res.waterPhase, this.waterPeriodOption);
      console.log(res, '所有的选项');
    });
  }

  // 得到 code
  getindex(arr, item) {
    let index;
    index = arr[0].indexOf(item);
    console.log('index', index);
    let text;
    text = arr[1][index];
    console.log(' text', text);
    return text;
  }

  getArry(array, brry) {
    array.forEach(element => {
      brry[0].push(element.NAME);
      //  得到code值
      brry[1].push(element.CODE);
    });
  }
  // 拍照
  // 获取的照片 public picture = [];
  // 从手机上获取的文件 public imge = [];
  getCamera() {
    if (this.uploadphoto.length + this.uploadimg.length >= this.num) {
      this.publicservice.thsToast('只能上传' + 'this.num' + '张图片');
      return;
    } else {
      let pictureIndex;
      let options: CameraOptions;
      options = {
        targetWidth: 800,
        targetHeight: 800,
        quality: 50,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      // 得到照片
      pictureIndex = this.camera.getPicture(options).then(
        imageData => {
          let pictureTest: SafeResourceUrl;
          this.uploadphoto.push(imageData);
          // 将照片转换成可以显示出来的模式
          // pictureTest = this.webview.convertFileSrc('base64Image');

          pictureTest = this.domSanitizer.bypassSecurityTrustResourceUrl(
            this.webview.convertFileSrc(imageData)
          );

          this.picture.push(pictureTest);
          if (this.picture.length !== 0) {
            this.showpic = true;
            // this.showtitle = false;
          }
          return pictureTest;
        },
        err => {
          console.log('Error: ' + err);
        }
      );
    }
  }

  // 获取的照片 public picture: [];
  // 从手机上获取的文件 public imge: [];
  // 获取手机储存上的文件
  getPhoto() {
    // this.uploadpicture = this.uploadimg.concat(this.uploadphoto);
    if (this.uploadphoto.length >= this.num) {
      this.imgNum = 0;
      this.publicservice.thsToast('只能上传' + 'this.num' + '张图片');
      return;
    } else {
      this.imgNum = this.num - this.uploadphoto.length;
      let options;
      options = {
        maximumImagesCount: this.imgNum,
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
              // this.showtitle = false;
            }
          }
        },
        err => {
          console.log('Error: ' + err);
        }
      );
    }
  }

  toNotice(type, obj) {
    switch (type) {
      // 判断是否是整数
      case 0:
        if (this.homeservice.isInt(obj) === false) {
          this.publicservice.thsToast('请输入整数');
        }
        return this.homeservice.isInt(obj);
      // break;
      // 判断是都精确到后两位
      case 2:
        if (this.homeservice.isFloat(2, obj) === false) {
          this.publicservice.thsToast('请输入整数');
        }
        return this.homeservice.isFloat(2, obj);
      // break;
      // 判断是都精确到后三位
      case 3:
        if (this.homeservice.isFloat(3, obj) === false) {
          this.publicservice.thsToast('请输入整数');
        }
        return this.homeservice.isFloat(3, obj);
      // break;
      default:
        break;
    }
  }
  // 上传

  upload(showloading) {
    // 获取接口地址
    console.log(this.PutletDetail);
    if (
      !this.homeservice.isEmpty(this.PutletDetail.pipeName) ||
      !this.homeservice.isEmpty(this.PutletDetail.lon) ||
      !this.homeservice.isEmpty(this.PutletDetail.lat) ||
      !this.homeservice.isEmpty(this.PutletDetail.pipeCode) ||
      !this.homeservice.isEmpty(this.PutletDetail.pipeType) ||
      !this.homeservice.isEmpty(this.PutletDetail.lakeName)
    ) {
      this.publicservice.thsToast('请完成必填项');
    } else {
      if (!this.homeservice.isEmpty(this.PutletDetail.pipeButtomElevation)) {
        console.log('管底绝对高程没有值');
      } else {
        let index;
        index = this.publicservice.handlefigure(
          this.PutletDetail.pipeButtomElevation,
          3
        );
        if (index) {
          this.PutletDetail.pipeButtomElevation = index;
        } else {
          this.publicservice.thsToast('请输入三位小数');
          return;
        }
      }

      this.uploadpicture = this.uploadimg.concat(this.uploadphoto);
      if (this.uploadpicture.length === 0) {
        this.publicservice.presentLoadingUp( );
        this.uploadForm();
        this.toback(true);
        this.events.publish('upDate');
      } else {
        this.uploadForm();
        this.upLoadImg();
      }
    }
  }
  // 上传表单
  uploadForm() {
    let urlDetail;
    urlDetail = this.configservice.putletInput; // 接口
    this.PutletDetail.uuid = this.deviceInfoService.getUuid(); // 获取uuid

    console.log(this.PutletDetail.uuid, 'this.WaterMon.uuid');
    console.log('PutletDetail', this.PutletDetail);
    this.publicservice.post(urlDetail, this.PutletDetail, true, res => {
      if (res !== 'error') {
        console.log('上传表单失败');
      } else {
        console.log('上传表单成功');
      }
    });
  }
  // 上传图片
  upLoadImg() {
    let urlImg;
    urlImg = this.configservice.imgInput; // 上传图片接口
    const options = {
      fileKey: 'file',

      fileName: '',

      mimeType: '',

      params: {
        uuid: this.PutletDetail.uuid,
        fileKey: 'detail',
        fileName: ''
      }
    };
    this.recordIndex = 0;

    this.presentLoadingUp();
    console.log('照片的数组' , this.uploadphoto);
    this.uploadpicture = this.uploadimg.concat(this.uploadphoto);

    this.uploadpicture.forEach(element => {
      options.fileName = this.homeservice.doSlice(element);
      options.params.fileName = this.homeservice.doSlice(element);
      options.mimeType = this.homeservice.getmimeType(options.fileName);

      this.filetransferservice.fileUpload(urlImg, element, options, res => {
        console.log('2222');

        if (res && res.response === 'sucess') {
          console.log('上传图片成功');
          console.log('3333');
          this.recordIndex++;
          // console.log( this.recordIndex , '**');
          // console.log('上传次数', this.recordIndex);
          if (this.uploadpicture.length === this.recordIndex) {
            // 修改成功以后，
            this.hideLoading(this.loader);
            this.toback(true);
          }
        } else {
          this.hideLoading(this.loader);
          console.log('上传图片失败');
        }
      });
    });
  }
  toback(showloading) {
    // if (showloading && this.publicservice.loader) {
    //   this.publicservice.hideLoading(this.publicservice.loader);
    // }
    this.publicservice.thsToast('上传成功');
    this.location.back();
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
        vm.PutletDetail.lat = res.latitude;
        vm.PutletDetail.lon = res.longitude;

        vm.PutletDetail.street = res.street || vm.PutletDetail.street;
        vm.PutletDetail.city = res.city || vm.PutletDetail.city;
        vm.PutletDetail.district = res.district || vm.PutletDetail.district;
        vm.PutletDetail.town = vm.getTown(res.longitude, res.latitude);

        // vm.PutletDetail.location = `${vm.PutletDetail.city}${vm.PutletDetail.district}
        // ${vm.PutletDetail.town}${vm.PutletDetail.street}`;

        vm.PutletDetail.pipeLocation =
          res.locationdescribe || vm.PutletDetail.street || '';

        // vm.PutletDetail.location = vm.PutletDetail.location || '';

        // console.log('乡镇', vm.PutletDetail.town);
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

        vm.PutletDetail.street = res.result.addressComponent.street || '';
        vm.PutletDetail.city = res.result.addressComponent.city || '';
        vm.PutletDetail.district = res.result.addressComponent.district || '';

        resolve();

        console.log('in getAddressDetail: addressDetail', res.result);
      });
    });

    return promise;
  }
  /**
   *  逆地址编码获取 镇
   */
  getTown(lon, lat) {
    let town;
    const location = { lat: '', lng: '' };

    location.lat = lat;
    location.lng = lon;

    console.log('传入的经纬度', location);

    this.httpservice.getJsonp(location, true, res => {
      town = res.result.addressComponent.town;
      console.log(res, '返回值');
      console.log(res.result.addressComponent.town, '小镇');
      console.log(typeof res.result.addressComponent.town, '小镇返回的类型 ');
      console.log(res.result.addressComponent.town === '', '小镇的布尔值');
    });
    if (town === undefined) {
      return '';
    } else {
      return town;
    }
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
   * @param lakeName
   *  搜索后得到的列表
   */
  getSpecificList(lakename) {
    const params = {
      lakeName: lakename
    };

    this.httpservice.getlakeReacord(params, true, res => {
      console.log('搜索得到湖泊的相关信息', res.data);
      if (res.data) {
        this.searchname = res.data[0].lakeName;
        this.PutletDetail.lakeName = res.data[0].lakeName;
        this.PutletDetail.lakeCode = res.data[0].lakeCode;
        console.log('显示出搜索结果', this.searchname);
      }
    });
  }
  TextOnChange() {
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
