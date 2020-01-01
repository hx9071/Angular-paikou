import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import {StaticService} from '../../services/static-service/static.service';
import {StaticConfigService} from '../../services/static-service/config.service';
import {ConfigService} from '../../services/config-service/config.service';
import {LoginService} from '../../services/login-service/login.service';

@Component({
  selector: 'app-tabs-static',
  templateUrl: 'tabs-static.page.html',
  styleUrls: ['tabs-static.page.scss'],
})
export class TabsStaticPage implements OnInit, OnDestroy {

  // 管道类型饼图表参数
  pipeTypeChartOptions;

  // 管道材质饼图表参数
  pipeMaterialAualityChartOptions;

  // 管道标准饼图表参数
  pipeStandardChartOptions;

  // 管道类型饼图实例
  pipeTypeChart;

  // 管道材质饼图表参数
  pipeMaterialAualityChart;

  // 管道标准饼图表参数
  pipeStandardChart;

  // 是否打开搜索窗口
  isOpenSearch = false;

  // 是否显示图表内容
  isShowChartCardContent = false;

  // 湖泊和入湖排口列表
  lakeAndOutputList: any = [];

  // 湖泊和入湖排口信息
  lakeAndOutputInfo: any = {};

  // 搜索组件参数
  searchConfig: any = {};

  // 页面搜索参数
  searchParams: any = {};

  // 排口类型模型
  PIPE_TYPE_MODEL: any = {};

  // 图表名字数组模型
  CHART_NAMES_MODEL: any = [];

  // 图表卡片集模型
  CHART_CARDS_MODEL: any = [];
  public allColor = {
    colorOne: ['#1598FF', '#60C862', '#F76866', '#FBE557', '#AAA557'],
    colorTwo: ['#1598FF', '#FBE557', '#60C862'],
    colorThree: ['#F76866', '#60C862'],
  };
  constructor(
    private router: Router,
    private staticService: StaticService,
    private configService: ConfigService,
    private staticConfigService: StaticConfigService,
    private loginService: LoginService,
    private zone: NgZone
  ) {

    // 路由监听
    router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        if (event.urlAfterRedirects !== '/tabs/static') {
          return;
        }

        this.highLightCharts();
        console.log('in NavigationEnd');
      }

    });

  }

  ngOnInit() {

    // 渲染静态视图数据
    this.renderStaticView();

    // 渲染异步数据
    this.renderAsyncView();

    console.log('in onInit');
  }

  ngOnDestroy() {
    console.log('in ngOnDestroy');
  }

  /**
   * 渲染静态视图数据
   */
  private renderStaticView() {

    this.searchParams.lakeName = '';

    this.searchConfig = {

      // 搜索键名
      searchKey: 'lakeName',

      // placeholder
      searchPlaceholder: '请输入湖泊名称',

      // 结果列表键名
      resultListKey: 'data',

      // 接口地址
      interfaceUrl: this.configService.getLakeAndOutputInterface,

      method: 'get',

      // 显示加载动画
      showLoading: false,

      // 该属性为真的时候，当搜索结果列表中搜索字段对应值包含搜索字段值的时候才能进行搜索
      openSearchExp: true,

      // 搜索参数
      searchParams: {
        page: 1,
        pageSize: 3000
      }

    };

    this.initModel();
  }

  /**
   * 渲染异步视图数据
   */
  private renderAsyncView() {

    this.getStatisticsData();

    this.getLakeAndOutputList();

  }

  /**
   * 默认获取所有湖泊和排口列表
   * @param type 搜索方式 'strict':精确搜索, '':模糊搜索
   */
  private getLakeAndOutputList(type = '') {

    this.staticService.getLakeAndOutputList({
      lakeName: this.searchParams.lakeName,
      searchType: this.searchParams.lakeName ? type : ''
    }, false, res => {

      console.log('in getLakeAndOutputList: res', res);

      if (!res.data || !res.data.length) {
        this.lakeAndOutputList = [];
        return;
      }

      this.lakeAndOutputList = res.data;

      this.setLakeAndOutputInfo();

    });

  }

  /**
   * 获取统计图表数据
   */
  private getStatisticsData() {

    this.staticService

      .getStatisticsData(this.searchParams, false, res => {

      console.log('in getStatisticsData: res', res);

      if (!res || !res.data || res.data.length === 0) {
        return;
      }

      this.showChartCardContent(true);

      const result = res.data[0];

      this.pipeTypeChartOptions = this.setPipeChartOptions({
        pipeNum: result.pipeNum || 0,
        riverOrCanalNum: result.riverOrCanalNum || 0,
        culvertGateOrPumpingStationNum: result.culvertGateOrPumpingStationNum || 0,
        color: this.allColor.colorTwo
      });

      this.pipeMaterialAualityChartOptions = this.setPipeChartOptions({
        concretePipeNum: result.concretePipeNum || 0,
        brickworkPipeNum: result.brickworkPipeNum || 0,
        pvcPipeNum: result.pvcPipeNum || 0,
        pePipeNum: result.pePipeNum || 0,
        steelPipeNum: result.steelPipeNum || 0,
        color: this.allColor.colorOne
      });
      this.pipeStandardChartOptions = this.setPipeChartOptions({
        overStandardPipeNum: result.overStandardPipeNum || 0,
        standardPipeNum: result.standardPipeNum || 0,
        color: this.allColor.colorThree
      });

      this.highLightCharts();

      this.initChartCardsModel();

    });

  }

  /**
   * 设置管道图表参数
   * @param onf 参数
   * @param onf[key] 值
   * @param onf.concretePipeNum 砼管数量
   * @param onf.brickworkPipeNum 砖砌口数量
   * @param onf.pvcPipeNum PVC管道数量
   * @param onf.pePipeNum PE管道数量
   * @param onf.overStandardPipeNum 超标管道数量
   * @param onf.standardPipeNum 标准管道数量
   * @param onf.pipeNum 管道数量
   * @param onf.riverOrCanalNum 河道或渠数量
   * @param onf.culvertGateOrPumpingStationNum 涵闸或泵站数量
   */
  private setPipeChartOptions(onf: any = {}) {

    const renderChartsParams = {
      legendList: [],
      seriesDataList: []
    };

    Object.keys(onf)

      .map(key => {

        renderChartsParams.legendList.push(this.PIPE_TYPE_MODEL[key]);

        renderChartsParams.seriesDataList.push({
          name: this.PIPE_TYPE_MODEL[key],
          value: onf[key]
        });
      });
    return this.combineChartOptions(renderChartsParams, onf.color);

  }

  /**
   * 初始化图表卡片集模型
   */
  private initChartCardsModel() {

    this.CHART_CARDS_MODEL = [{
      title: '排口类型统计',
      chartType: 'pipeType',
      options: this.pipeTypeChartOptions,
    }, {
      title: '管道材质统计',
      chartType: 'pipeMaterialAuality',
      options: this.pipeMaterialAualityChartOptions,
    }, {
      title: '排口监测值超标统计',
      chartType: 'pipeStandard',
      options: this.pipeStandardChartOptions,
    }];

  }

  /**
   * 初始化模型
   */
  private initModel() {

    this.CHART_NAMES_MODEL = ['pipeTypeChart', 'pipeMaterialAualityChart', 'pipeStandardChart'];

    this.PIPE_TYPE_MODEL = {
      overStandardPipeNum: '超标',
      pvcPipeNum: 'PVC道',
      concretePipeNum: '砼管',
      riverOrCanalNum: '河沟或渠',
      pipeNum: '管道',
      culvertGateOrPumpingStationNum: '涵闸或泵站',
      brickworkPipeNum: '砖砌口',
      pePipeNum: 'PE道',
      standardPipeNum: '达标',
      steelPipeNum: '钢管',
    };

  }

  /**
   * 组装图表参数
   * @param onf 参数
   * @param onf.legendList legendList
   * @param onf.seriesDataList seriesDataList
   * @returns object options
   */
  private combineChartOptions(onf: any, color) {

    const {legendList = [], seriesDataList = []} = onf;
    const options = {
      color:color,
      legend: {
        orient: '',
        icon: 'circle',
        left: '57%',
        y: 'center',
        textStyle: {
          fontSize: 16
        },
        data: legendList
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['27%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
              formatter: '{c}\n{b}'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '18'
              }
            }
          },
          // 间隙留白
          itemStyle: {
            normal: {
              borderWidth: 4,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: seriesDataList
        }
      ]
    };

    return options;

  }

  /**
   * 打开搜索窗口
   * @param isOpen 是否显示
   */
  openSearchModal(isOpen) {
    this.isOpenSearch = isOpen;
  }

  /**
   * 显示图表内容
   * @param isShow 是否显示
   */
  private showChartCardContent(isShow) {
    this.isShowChartCardContent = isShow;
  }

  /**
   * 开始搜索
   * @param object event
   * @param string event.searchText 搜索字段
   */
  shouldSearch(event) {

    this.showChartCardContent(false);
    this.openSearchModal(false);

    this.searchParams.lakeName = event.searchText;

    // 重置数据
    this.lakeAndOutputInfo = {};

    this.getStatisticsData();
    this.getLakeAndOutputList('strict');

    console.log('in shouldSearch: event', event);

  }

  /**
   * 设置湖泊和排口信息
   */
  private setLakeAndOutputInfo() {

    if (this.lakeAndOutputList.length > 1) {

      this.lakeAndOutputInfo.lakeNum = this.lakeAndOutputList.length;

      this.lakeAndOutputInfo.lakePipeNum = this.lakeAndOutputList.reduce((prev, next) => {
        return (prev.lakePipeNum || prev) + next.lakePipeNum;
      }, 0);

    }

    else if (this.lakeAndOutputList.length === 1) {
      this.lakeAndOutputInfo.lakeName = this.lakeAndOutputList[0].lakeName;
      this.lakeAndOutputInfo.lakePipeNum = this.lakeAndOutputList[0].lakePipeNum;
      this.lakeAndOutputInfo.lakeNum = 1;
    }

  }

  /**
   * 图表初始化
   * @param event event
   * @param name 图表名称
   */
  onChartInit(event: any, name: string) {

    console.log('on chart init:', event);

    this[`${name}Chart`] = event;

    this.staticConfigService.setStore(`${name}Chart`, event);

    this.highLightCharts();

  }

  /**
   * 高亮一个图表第一项
   * @param chartName 图表名称
   */
  private highLightChart(chartName) {

    this[chartName] = this.staticConfigService.getStore(chartName) ?
      this.staticConfigService.getStore(chartName) :
      this[chartName];

    if (this[chartName]) {

      // 异步方式保证视图加载完成后执行DOM操作
      this.zone.run(() => {
        setTimeout(() => {
          this[chartName].dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 0
          });
        }, 200);
      });

    }
  }

  /**
   * 高亮所有图表第一项
   */
  private highLightCharts() {

    const chartNames = this.CHART_NAMES_MODEL;

    chartNames.forEach(chartNameItem => {
      this.highLightChart(chartNameItem);
    });

  }

  /**
   * 图表事件监听
   * @param object event 图表事件
   * @param string type 事件类型
   * @param string name 图表名称
   */
  onChartEvent(event: any, type: string, name: string) {
    console.log('chart event:', type, event);

    switch (type) {
      // 手指移入高亮点到的区域
      case 'chartMouseOver':
        if (event.dataIndex !== 0) {
          this[`${name}Chart`].dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: 0
          });
        }

        break;

      // 手指移开默认高亮第一个
      case 'chartMouseOut':
        this[`${name}Chart`].dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
        });

        break;
      default:
        break;
    }

  }

  /**
   * 注销
   */
  logout() {
    this.loginService.logout();
  }

}
