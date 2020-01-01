import { Injectable, Component } from '@angular/core';
import { loadModules } from 'esri-loader'; // 地图API装载器
/**
 * 地图服务类
 * @export
 */
@Injectable()
export class ThsMapService {
    constructor() {

    }
    /**
     * 通过经纬度以及缩放级别设置地图中心
     * @param map 地图对象
     * @param x  坐标 经度
     * @param y  坐标 经度
     * @param zoomLv 缩放级别
     * @param [wkid=4326] 地理坐标系中的GCS_WGS_1984
     * @memberOf MapService
     */
    setCenterAndZoom(map, x: number, y: number, zoomLv: number, wkid = 4326) {
        loadModules(['esri/geometry/Point']).then(([Point]) => {
            map.centerAndZoom(new Point({
                x,
                y,
                spatialReference: {
                    wkid
                }
            }), zoomLv);
        });
    }

    /**
     * 设置map显示范围
     * @param map map对象(必填)
     * @param minX(必填)
     * @param minY(必填)
     * @param maxX(必填)
     * @param maxY(必填)
     */
    setMapExtent(map, minX: number, minY: number, maxX: number, maxY: number) {

        loadModules(['esri/geometry/Extent', 'esri/SpatialReference']).then(([Extent, SpatialReference]) => {
            const extent = new Extent(minX, minY, maxX, maxY);
            map.setExtent(extent, true);

        });
    }

    /**
     * 画辐射圈
     * @param locLayer 辐射圈图层
     * @param location 当前位置对象
     * @param distance 辐射圈半径
     */
    makeCircle(locLayer, location, distance) {
        console.log(locLayer, location, distance);
        locLayer.clear();
        loadModules(['esri/geometry/Point', 'esri/geometry/Circle', 'esri/symbols/SimpleFillSymbol',
            'esri/symbols/SimpleLineSymbol', 'esri/Color', 'esri/graphic', 'esri/layers/GraphicsLayer'])
            .then(([Point, Circle, SimpleFillSymbol, SimpleLineSymbol, Color, Graphic, GraphicsLayer]) => {
                const point = new Point(location.longitude, location.latitude);
                const circleGeometry = new Circle(point, {
                    radius: distance * 1000,
                    geodesic: true
                });
                const sms = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([142, 229, 238]), 1), new Color([174, 238, 238, 0.25]));
                const graphicPic = new Graphic(circleGeometry, sms);
                locLayer.add(graphicPic);
            });
    }
    /**
     * 创建图形图层
     * then返回graphicsLayer
     */
    public createGraphicsLayer(layerName, map): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            loadModules(['esri/layers/GraphicsLayer']).then(([GraphicsLayer]) => {
                const layer = map.getLayer(layerName);
                if (layer !== undefined) {
                    resolve(layer);
                } else {
                    // 创建图形图层
                    const option = {
                        id: layerName,
                        visible: true
                    };
                    const graphicsLayer = new GraphicsLayer(option);
                    map.addLayer(graphicsLayer);
                    resolve(graphicsLayer);
                }
            });
        });
    }
    /**
     * 创建模版
     * @param template 模版信息(必填)
     * then返回模版
     */
    public createInfoTemplate(template): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            loadModules(['esri/InfoTemplate']).then(([InfoTemplate]) => {
                const infoTemplate = new InfoTemplate(template);
                resolve(infoTemplate);
            });
        });
    }

    // 打点并且添加文字
    addPointAndText(data, graphicsLayer, type?) {
        graphicsLayer.clear();
        loadModules(['esri/geometry/Point', 'esri/layers/GraphicsLayer', 'esri/symbols/PictureMarkerSymbol',
            'esri/graphic', 'esri/InfoTemplate', 'esri/symbols/Font', 'esri/symbols/TextSymbol'])
            .then(([Point, GraphicsLayer, PictureMarkerSymbol, Graphic, InfoTemplate, Font, TextSymbol]) => {
                const template = {
                    content: '<div class="popup-menu">' +
                        '<div class="pop-title">' +
                        '<span class="map_direction">' +
                        '<img src="../assets/img/location_direction.png" alt=""></span>' +
                        '<div class="pop-title">当前位置</div></div>' +
                        '<div class="pop-lat" style="border-bottom:1px solid #dcdcdc;"><span>经度</span><span>${longitude}</span></div>' +
                        '<div class="pop-lat"><span>纬度</span><span>${latitude}</span></div>' +
                        '</div>'
                };
                const infoTemplate = new InfoTemplate(template);
                // 设置模版
                graphicsLayer.setInfoTemplate(infoTemplate);
                let img;
                if (type) {
                    img = 'assets/img/pullu_write.png';
                } else {
                    img = 'assets/img/dot_dongtu.gif';
                }
                // 以下是打点操作
                const pictureMarkerSymbol = new PictureMarkerSymbol(img, 20, 20);

                const point = new Point(data.longitude, data.latitude); // 39.9046716842,116.4071591969;
                const attrTemplate = {
                    latitude: data.latitude,
                    longitude: data.longitude
                };
                // 创建Graphic
                const graphicPic = new Graphic(point, pictureMarkerSymbol, attrTemplate, infoTemplate);
                // 图层增加图片点
                graphicsLayer.add(graphicPic);

            });
    }

    /**
     * 打点
     * @param data 用于打点的数据
     * @param graphicsLayer 图层
     * @param type 类型 1当前位置 2排口点位 3区域点位
     */
    addPoint(data, graphicsLayer, type?) {
        let pointArr = [];
        let imgWidth = 30;
        let imgHeight = 30;
        if (data instanceof Array) {
            pointArr = data;
        } else {
            pointArr.push(data);
        }
        // console.log('pointArr', pointArr);
        graphicsLayer.clear();
        loadModules(['esri/geometry/Point', 'esri/symbols/PictureMarkerSymbol', 'esri/graphic', 'esri/InfoTemplate'])
            .then(([Point, PictureMarkerSymbol, Graphic]) => {
                pointArr.forEach(item => {
                    if (type === 1) {
                        imgWidth = 24;
                        imgHeight = 30;
                    }
                    // 以下是打点操作
                    const pictureMarkerSymbol = new PictureMarkerSymbol(item.imgPath, imgWidth, imgHeight);
                    const point = new Point(item.lon, item.lat);
                    const attrTemplate = {
                        lat: Number(item.lat),
                        lon: Number(item.lon),
                        lakeName: item.lakeName || '',
                        pipeCode: item.pipeCode || '',
                        pipeLocation: item.pipeLocation || '',
                        pipeName: item.pipeName || '',
                        pipeType: item.pipeType || '',
                        pipeTypeName: item.pipeTypeName || '',
                        uuid: item.uuid || ''
                    };
                    // 创建Graphic
                    const graphicPic = new Graphic(point, pictureMarkerSymbol.setOffset(0, 0), attrTemplate);
                    // 图层增加图片点
                    graphicsLayer.add(graphicPic);
                });

            });
    }

    /**
     * 高亮选中点位
     * @param data 需要高亮显示的点位的数据
     * @param graphicsLayer 高亮图层
     */
    showHighlightPoint(data, graphicsLayer) {
        graphicsLayer.clear(); // 清除之前打的点
        loadModules(['esri/geometry/Point', 'esri/symbols/PictureMarkerSymbol', 'esri/graphic'])
            .then(([Point, PictureMarkerSymbol, Graphic]) => {
                const pictureMarkerSymbol = new PictureMarkerSymbol('../../../assets/images/gl.png', 35, 35);
                const point = new Point(data.lon, data.lat);
                // 创建Graphic
                const graphicPic = new Graphic(point, pictureMarkerSymbol.setOffset(0, 0));
                // 图层增加图片点
                graphicsLayer.add(graphicPic);
            });
    }

    /**
     * 获取地图中心点的经纬度
     */
    getCenter(map): { x: number, y: number } {
        return map.geographicExtent.getCenter();
    }

}


// npm install --save esri-loader
