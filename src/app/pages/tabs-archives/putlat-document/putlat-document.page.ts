import { Component, ViewChild, OnInit } from '@angular/core';
import { HomeService } from '../../../services/home-service/home.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { TrackService } from '../../../services/track-service/track.service';
import { ConfigService } from '../../../services/config-service/config.service';
import { PublicService } from '../../../services/public-service/public.service';
import { HttpService } from '../../../services/http-service/http.service'; // 引入接口方法
import { PickerService } from '../../../services/picker-service/picker.service';
import { SupervisionService } from '../../../services/Supervision-Service/supervision.service';
import { DeviceInfoService } from '../../../services/device-info-service/device-info.service';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Events , LoadingController} from '@ionic/angular';
import { from } from 'rxjs';

@Component({
  selector: 'app-putlat-document',
  templateUrl: './putlat-document.page.html',
  styleUrls: ['./putlat-document.page.scss']
})
export class PutlatDocumentPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public supervisionList: any = []; // 监督检查列表数据
  // 每页加载数据集合
  public incomelist: any[] = [];
  // 源数据集合
  public incomedata: any[] = [];
  // 有无数据显示
  incomeshow: boolean;
  // 上拉加载相关定义
  public incomepage = {
    pageSize: 5,
    currentpage: 1,
    maxsize: 0
  };
  // 加载内容显示或隐藏
  Isloadincome: boolean;
  // 加载内容完毕提示
  IsILastPage: boolean;
  public loader = null;
  public page = 1; // 当前页码
  public pageSize = 10; // 每页数据量
  public expression = false;
  public loadEvent;
  public searchname;
  public search = false;
  public searchOutletLists: any; // 搜索框内容
  public searchValLists: any; // 搜索出的内容
  public outletcategory: any; // 排口
  public PipeCode: any; // 排口ID
  public showSearch = false;
  public item;
  public SpecificList;
  public serchList;
  isOpenSearch = false; // 是否打开搜索窗口
  searchConfig: any = {}; // 搜索组件参数
  searchParams: any = {}; // 页面搜索参数
  /** -----------------------------  */
  constructor(
    // 添加服务
    public loadingController: LoadingController,
    public deviceInfoService: DeviceInfoService,
    public supervisionService: SupervisionService,
    public pickerService: PickerService,
    public router: Router, // 路由
    public navController: NavController,
    public homeservice: HomeService,
    public trackservice: TrackService,
    public publicservice: PublicService,
    public configservice: ConfigService,
    public httpservice: HttpService,
    public events: Events,
  ) { }

  ngOnInit() {
    this.getTrackReacord(1, 10);
    this.renderStaticView();
    this.events.subscribe('upDate', () => {
      this.getSupervisionList(true);
   //   this.getSupervisionListAgain(true);
    });
  //   this.events.subscribe('loadAgin', () => {
  //     this.getSupervisionList(true);
  //  //   this.getSupervisionListAgain(true);
  //   });
  }
  ionViewWillUnload() {
   this.events.unsubscribe('upDate');
  }
  /**
   * 渲染静态视图数据
   */
  private renderStaticView() {
    this.searchConfig = {
      // 搜索键名
      searchKey: 'pipeName',
      // placeholder
      searchPlaceholder: '请输入排口名称',
      // 结果列表键名
      resultListKey: 'data',
      // 接口地址
      interfaceUrl: this.configservice.PutletReacord,
      method: 'get',
      // 显示加载动画
      showLoading: true,
      // 搜索参数
      searchParams: {
        page: 1,
        pageSize: 10
      }
    };

    this.initModel();
  }

  private initModel() { }

  /**
   * 跳转到详情页面
   * @param id uuid
   */
  getdetaile(id) {
    this.router.navigate(['putlat-detail'], {
      queryParams: {
        uuid: id
      }
    });
    console.log(id);
  }
  /**
   * 跳转到修改页面
   * @param id uuid
   */
  getExchange(id) {
    this.router.navigate(['putlat-modification'], {
      queryParams: {
        uuid: id
      }
    });
  }
  /**
   * 跳转到新增页面
   */
  getAdd() {
    this.router.navigate(['putlat-add']);
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
    this.searchParams.pipeName  = event.searchText;
    console.log('event.searchText', event.searchText);
    // 排口名称
    // this.searchOutletLists = event.searchList;
    this.getSpecificList(event.searchText);
    console.log('in shouldSearch: event', event);
  }
  /**
   *
   * @param pipename 排口名称
   *  获取搜索得到的列表
   */
  getSpecificList(pipename) {
    const params = {
      pipeName: pipename
    };
    this.httpservice.getTrackReacord(params, true, res => {
      this.serchList = res.data;
      this.SpecificList = res.data;
      if (this.SpecificList) {
        this.showSearch = true;
        console.log('显示出搜索结果', this.showSearch);
        if (!params.pipeName) {
          console.log('搜索全部');
        } else {
          this.searchname = params.pipeName;
          this.expression = true;

        }
      }
      console.log(this.SpecificList, '返回数据');
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
  /**
   * 进入生命周期后 获取列表数据第一页，10条
   * @param pages 当前页
   * @param pagesizes 每页显示的数目
   */
  getTrackReacord(pages, pagesizes) {
    const params = {
      page: 1, // 起始页
      pageSize: 10 // 每页有多少条数据
    };
    this.httpservice.getTrackReacord(params, true, res => {
      this.outletcategory = res.data;
      console.log(this.outletcategory, '返回数据');
    });
  }
  /**
   * 获取监督检查列表数据
   * @param showLoading 是否显示弹出loading
   */
  getSupervisionList(showLoading: boolean) {
    const param = {
      page: this.page, // 起始页
      pageSize: this.pageSize // 每页有多少条数据
    };
    // this.presentLoadingUp();
    this.httpservice.getTrackReacord(param, showLoading, res => {
      if (res !== 'error') {
        if (this.loadEvent && this.loadEvent.type === 'ionInfinite') {
          // this.outletcategory = data.data;
          this.outletcategory.push(...res.data);
          console.log(res, '加载获取的数据');
          if (Number(res.head.total) <= this.outletcategory.length) {
            this.loadEvent.target.disabled = true;
            // this.hideLoading(this.loader);
          }
          // if (this.pageSize < res.head.pages) {
          //   this.loadEvent.target.disabled = false;
          // }
        } else {
          this.outletcategory = res.data || [];
          // this.hideLoading(this.loader);
        }
      } else {
        this.outletcategory = [];
        // this.hideLoading(this.loader);
        this.publicservice.thsToast('数据请求异常，请稍后重试！');
      }
      // 让上拉或者下拉事件中的loading状态完成
      if (this.loadEvent) {
        this.loadEvent.target.complete();
        // this.hideLoading(this.loader);
        this.loadEvent = null;
      }
    });
  }

  // getSupervisionListAgain(showLoading: boolean) {
  //   const param = {
  //     page: 1, // 起始页
  //     pageSize: 10 // 每页有多少条数据
  //   };
  //   this.presentLoadingUp();
  //   this.httpservice.getTrackReacord(param, showLoading, res => {
  //     if (res !== 'error') {
  //         if (Number(res.head.total) <= this.outletcategory.length) {
  //           this.loadEvent.target.disabled = true;
  //           this.hideLoading(this.loader);
  //         } else {
  //           this.outletcategory = res.data || [];
  //           this.hideLoading(this.loader);
  //       }
  //     } else {
  //       this.outletcategory = [];
  //       this.hideLoading(this.loader);
  //       this.publicservice.thsToast('数据请求异常，请稍后重试！');
  //     }
  //     // 让上拉或者下拉事件中的loading状态完成
  //     if (this.loadEvent) {
  //       this.loadEvent.target.complete();
  //       this.hideLoading(this.loader);
  //       this.loadEvent = null;
  //     }
  //   });
  // }

  /**
   * 页面交换
   */
  exchangepage() {
    this.searchParams.pipeName = null;
    this.expression = false;
    this.showSearch = false;
  }


  /**
   * 跳转到地图页面
   * @param item 点位信息
   */
  goMap(item) {
    // tslint:disable-next-line:no-string-literal
    item['type'] = 'document';
    this.navController.setDirection('root');
    this.router.navigate(['/tabs/track'], {
      queryParams: item
    });
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
