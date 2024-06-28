import * as maplibregl from "maplibre-gl";
import * as pmtiles from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import './style.css';

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles",protocol.tile);

const descriptionBox = document.getElementById('description');
let descriptionContent = '';
descriptionContent += '<h1>茨城県つくば市の建物+用途地域図</h1>';
descriptionContent += '<p class="tipstyle01">茨城県つくば市の3D都市モデルを使った建物と都市計画用途地域のマップです。</p>';
descriptionContent += '<p class="tipstyle01">下記に示すデータを参照し、当サイト作成者が独自に加工したものとなります。</p>';
descriptionContent += '<p class="tipstyle01">ご意見等は<a href="https://form.run/@party--1681740493" target="_blank">問い合わせフォーム（外部サービス）</a>からお知らせください。</p>';
descriptionContent += '<hr><p class="remarks">地図描画ライブラリ：<a href="https://maplibre.org/">MapLibre</a><br>ベースマップ：<a href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a><br>建物モデル・都市計画情報：<a href="https://www.geospatial.jp/ckan/dataset/plateau">G空間情報センター(国土交通省PLATEAU)</a><br>国勢調査区 : <a href="https://www.e-stat.go.jp/gis">政府統計の総合窓口(e-Stat)</a><br>View code on <a href="https://github.com/sanskruthiya/tsukuba-cityplan">Github</a></p>';
descriptionBox.innerHTML = descriptionContent;

function getDescription(d) {
    return d == '第一種低層住居専用地域' ? '低層住宅の良好な環境を守るための地域です。小規模な店舗や事務所をかねた住宅や小中学校などが建てられます。' :
        d == '第二種低層住居専用地域' ? '主に低層住宅の良好な環境を守るための地域です。小中学校などのほか、150平方メートルまでの一定のお店などが建てられます。' :
        d == '第一種中高層住居専用地域' ? '中高層住宅の良好な環境を守るための地域です。病院、大学、500平方メートルまでの一定のお店などが建てられます。' :
        d == '第二種中高層住居専用地域' ? '主に中高層住宅の良好な環境を守るための地域です。病院、大学などのほか、1,500平方メートルまでの一定のお店や事務所などが建てられます。' :
        d == '第一種住居地域' ? '住居の環境を守るための地域です。3,000平方メートルまでの店舗、事務所、ホテルなどは建てられます。' :
        d == '第二種住居地域' ? '主に住居の環境を守るための地域です。店舗、事務所、ホテル、ぱちんこ屋、カラオケボックスなどは建てられます。' :
        d == '準住居地域' ? '道路の沿道において、自動車関連施設などの立地と、これと調和した住居の環境を保護するための地域です。' :
        d == '近隣商業地域' ? '近隣の住民が日用品の買い物をする店舗等の業務の利便の増進を図る地域です。住宅や店舗のほかに小規模の工場も建てられます。' :
        d == '商業地域' ? '銀行、映画館、飲食店、百貨店、事務所などの商業等の業務の利便の増進を図る地域です。住宅や小規模の工場も建てられます。' :
        d == '準工業地域' ? '主に軽工業の工場等の環境悪化の恐れのない工業の業務の利便を図る地域です。危険性、環境悪化が大きい工場のほかは、ほとんど建てられます。' :
        d == '工業地域' ? '主として工業の業務の利便の増進を図る地域で、どんな工場でも建てられます。住宅やお店は建てられますが、学校、病院、ホテルなどは建てられません。' :
        d == '工業専用地域' ? '専ら工業の業務の利便の増進を図る地域です。どんな工場でも建てられますが、住宅、お店、学校、病院、ホテルなどは建てられません。' :
        '市街化調整区域です。市街化を抑制する区域で、新しい宅地・商業地の開発は原則的に認められません。';
}

function getColor(d) {
    return d == '第一種低層住居専用地域' ? '#00b285' :
           d == '第二種低層住居専用地域' ? '#7bd2b7' :
           d == '第一種中高層住居専用地域' ? '#78ce3f' :
           d == '第二種中高層住居専用地域' ? '#addf21' :
           d == '第一種住居地域' ? '#ebee5e' :
           d == '第二種住居地域' ? '#ffd2b6' :
           d == '準住居地域' ? '#ffa638' :
           d == '近隣商業地域' ? '#ffb0c3' :
           d == '商業地域' ? '#ff593d' :
           d == '準工業地域' ? '#a794c5' :
           d == '工業地域' ? '#b9eaff' :
           d == '工業専用地域' ? '#0ec7ff' :
           '#333';
}

const matchColor = ["match", ["get", "name"],"第一種低層住居専用地域","#00b285","第二種低層住居専用地域","#7bd2b7","第一種中高層住居専用地域","#78ce3f","第二種中高層住居専用地域","#addf21","第一種住居地域","#ebee5e","第二種住居地域","#ffd2b6","準住居地域","#ffa638","近隣商業地域","#ffb0c3","商業地域","#ff593d","準工業地域","#a794c5","工業地域","#b9eaff","工業専用地域","#0ec7ff","#333"];

const zoning_legend = document.getElementById('zoning-legend')
const zone_type = ['第一種低層住居専用地域', '第二種低層住居専用地域', '第一種中高層住居専用地域', '第二種中高層住居専用地域', '第一種住居地域', '第二種住居地域', '準住居地域', '近隣商業地域', '商業地域', '準工業地域', '工業地域', '工業専用地域']

for (let i = 0; i < zone_type.length; i++){
    zoning_legend.innerHTML += '<i style="background:' + getColor(zone_type[i]) + '"></i> ' + zone_type[i] + (zone_type[i + 1] ? '<br>' : '<hr>');
}
zoning_legend.innerHTML += '用途地域について：<a href="https://www.city.tsukuba.lg.jp/jigyosha/machinami/toshikeikaku/tsukuba/riyou/1002063.html" target="_blank">つくば市HP</a>'

const init_coord = [140.11157, 36.08279];
const init_zoom = 15;
const init_bearing = 0;
const init_pitch = 60;

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json',
    center: init_coord,
    interactive: true,
    zoom: init_zoom,
    minZoom: 5,
    maxZoom: 20,
    maxPitch: 85,
    maxBounds: [[110.0000, 25.0000],[170.0000, 50.0000]],
    bearing: init_bearing,
    pitch: init_pitch,
    attributionControl:true
});

map.on('load', function () {
    map.addSource('building-plateau', {
        'type': 'vector',
        'url': 'pmtiles://app/data/TsukubaPlateau_Building.pmtiles',
        "minzoom": 5,
        "maxzoom": 18,
    });
    map.addSource('zoning-plateau', {
        'type': 'vector',
        'url': 'pmtiles://app/data/TsukubaPlateau_Zoning.pmtiles',
        "minzoom": 5,
        "maxzoom": 18,
    });
    map.addSource('floodrisk-area', {
        'type': 'raster',
        'tiles': ['https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png'],
        'tileSize': 256,
        'minzoom': 0,
        'maxzoom': 17
    });
    map.addSource('hillshade-gsi', {
        'type': 'raster',
        'tiles': ['https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png'],
        'tileSize': 256,
        'minzoom': 5,
        'maxzoom': 16
    });
    map.addSource("gsidem-terrain-rgb", {
        type: 'raster-dem',
        tiles: [
            'https://xs489works.xsrv.jp/raster-tiles/gsi/gsi-dem-terrain-rgb/{z}/{x}/{y}.png', //Thanks to shi-works >> https://qiita.com/shi-works/items/2d712456ccc91320cd1d
        ],
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#dem" target="_blank">地理院タイル(標高タイル)</a>',
        tileSize: 256
    });
    map.setTerrain({ 'source': 'gsidem-terrain-rgb', 'exaggeration': 1 });

    map.addLayer({
        'id': 'hazard_flood',
        'type': 'raster',
        'source': 'floodrisk-area',
        'layout': {
            'visibility': 'none',
        },
        'minzoom': 5,
        'maxzoom': 17
    });
    map.addLayer({
        'id': 'elevation_layer',
        'type': 'raster',
        'source': 'hillshade-gsi',
        'layout': {
            'visibility': 'visible',
        },
        'minzoom': 5,
        'maxzoom': 20,
        'paint': {
            'raster-opacity':0.1
        }
    });
    map.addLayer({
        'id': 'building_3d',
        'source': 'building-plateau',
        'source-layer': 'TsukubaPlateauBuilding_4326',
        "minzoom": 5,
        "maxzoom": 21,
        'layout': {
            'visibility': 'visible',
        },
        'type': 'fill-extrusion',
        'paint': {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-opacity": 0.5,
            "fill-extrusion-height": ["get", "measuredHeight"]
        }
    });
    map.addLayer({
        'id': 'zoning_main',
        'source': 'zoning-plateau',
        'source-layer': 'TsukubaCityZoning_4326',
        'minzoom': 5,
        'maxzoom': 21,
        'type': 'fill',
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'fill-color': ["to-color", matchColor],
            'fill-opacity': 0.65,
        }
    });
    map.addLayer({
        'id': 'boundary_area',
        'source': 'zoning-plateau',
        'source-layer': 'TsukubaCityBoundary_4326',
        'minzoom': 5,
        'maxzoom': 21,
        'type': 'fill',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'fill-color': 'transparent',
            'fill-outline-color': '#333'
        }
    });
    map.addLayer({
        'id': 'census_area',
        'source': 'zoning-plateau',
        'source-layer': 'TsukubaCensusArea_4326',
        'minzoom': 5,
        'maxzoom': 21,
        'type': 'fill',
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'fill-color': 'transparent',
            'fill-outline-color': '#1e90ff',
        }
    });
    map.setSky({
        "sky-color": "#199EF3",
        "sky-horizon-blend": 0.7,
        "horizon-color": "#f0f8ff",
        "horizon-fog-blend": 0.8,
        "fog-color": "#2c7fb8",
        "fog-ground-blend": 0.9,
        "atmosphere-blend": ["interpolate",["linear"],["zoom"],0,1,12,0]
    });
});

map.on('click', 'boundary_area', function (e) {
    map.panTo(e.lngLat,{duration:1000});
    
    let fquery_01 = map.queryRenderedFeatures(e.point, { layers: ['census_area'] })[0] !== undefined ? map.queryRenderedFeatures(e.point, { layers: ['census_area'] })[0].properties : "no-layer";
    let fquery_02 = map.queryRenderedFeatures(e.point, { layers: ['zoning_main'] })[0] !== undefined ? map.queryRenderedFeatures(e.point, { layers: ['zoning_main'] })[0].properties : "no-layer";
    let fquery_03 = map.queryRenderedFeatures(e.point, { layers: ['building_3d'] })[0] !== undefined ? (map.queryRenderedFeatures(e.point, { layers: ['building_3d'] })[0].properties.name !== undefined ? map.queryRenderedFeatures(e.point, { layers: ['building_3d'] })[0].properties.name : "no-layer") : "no-layer";
    
    //3D建物属性：class, usage, measureHeight, storeysAboveGround, storeysBelowGround
    //ゾーニング属性：name, buildingCoverageRate（建蔽率）, buildingHeightLimits（高さ制限）, floorAreaRate（容積率）
    //国勢調査界属性：S_NAME, AREA, JINKO, SETAI
    let popupContent = '<p class="tipstyle02">地域名：' + (fquery_01 !== "no-layer" ? fquery_01["S_NAME"] : '区域外') + '</p><p class="tipstyle02">' + 
    (fquery_03 !== "no-layer" ? (fquery_03 !== '' ? 'この建物は<span class="style01">' + fquery_03 + '</span>です。<br>' : '' ) : '' ) + 'この場所は、<span class="style01">' +
    (fquery_02 !== "no-layer" ? '市街化区域（市街化を推進する区域）' : '市街化調整区域（原則的に宅地や商業地の開発を制限する区域）') + '</span>に区分されています。' + 
    (fquery_02 !== "no-layer" ? '<br><span class="style01">' + fquery_02["name"]+'</span>の用途地域に該当し、建ぺい率：' + Number(fquery_02["buildingCoverageRate"])*100 + '%、容積率：' + Number(fquery_02["floorAreaRate"])*100 + '%、<span class="style01">'+ getDescription(fquery_02["name"]) +'</span>（ただし、さらに詳細な<a href="https://www.city.tsukuba.lg.jp/material/files/group/118/chikukeikaku20231220.pdf" target="_blank">地区計画</a>による規制が設定されている場合もあります。）' : '') +
    '</p><hr>'+'<p class="remarks"><a href="https://www.google.com/maps/@?api=1&map_action=map&center='+e.lngLat.wrap().lat.toFixed(5)+','+e.lngLat.wrap().lng.toFixed(5)+'&zoom=18" target="_blank">この地点のGoogleマップへのリンク</a></p>'
    
    new maplibregl.Popup({closeButton:true, focusAfterOpen:false, className:'t-popup', maxWidth:'360px', anchor:'top'})
    .setLngLat(e.lngLat)
    .setHTML(popupContent)
    .addTo(map);
});
map.on('mouseenter', 'boundary_area', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'boundary_area', function () {
    map.getCanvas().style.cursor = '';
});

document.getElementById('b_description').style.backgroundColor = "#fff";
document.getElementById('b_description').style.color = "#333";
document.getElementById('description').style.display ="none";

document.getElementById('b_legend').style.backgroundColor = "#fff";
document.getElementById('b_legend').style.color = "#555";

document.getElementById('b_location').style.backgroundColor = "#fff";
document.getElementById('b_location').style.color = "#333";

document.getElementById('b_description').addEventListener('click', function () {
    const visibility = document.getElementById('description');
    if (visibility.style.display == 'block') {
        visibility.style.display = 'none';
        this.style.backgroundColor = "#fff";
        this.style.color = "#555"
    }
    else {
        visibility.style.display = 'block';
        this.style.backgroundColor = "#2c7fb8";
        this.style.color = "#fff";
    }
});

document.getElementById('zoning-legend').style.display ="none";

document.getElementById('b_legend').addEventListener('click', function () {
    const visibility = document.getElementById('zoning-legend');
    if (visibility.style.display == 'block') {
        visibility.style.display = 'none';
        this.style.backgroundColor = "#fff";
        this.style.color = "#555"
    }
    else {
        visibility.style.display = 'block';
        this.style.backgroundColor = "#2c7fb8";
        this.style.color = "#fff";
    }
});

const loc_options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
};

document.getElementById('icon-loader').style.display = 'none';

let popup_loc = new maplibregl.Popup({anchor:"top", focusAfterOpen:false});
let marker_loc = new maplibregl.Marker({draggable: true});
let flag_loc = 0;

document.getElementById('b_location').addEventListener('click', function () {
    this.setAttribute("disabled", true);
    if (flag_loc > 0) {
        marker_loc.remove();
        popup_loc.remove();
        this.style.backgroundColor = "#fff";
        this.style.color = "#333";
        flag_loc = 0;
        this.removeAttribute("disabled");
    }
    else {
        document.getElementById('icon-loader').style.display = 'block';
        this.style.backgroundColor = "#87cefa";
        this.style.color = "#fff";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                marker_loc.remove();
                popup_loc.remove();

                document.getElementById('icon-loader').style.display = 'none';
                this.style.backgroundColor = "#2c7fb8";
                this.style.color = "#fff";

                let c_lat = position.coords.latitude;
                let c_lng = position.coords.longitude;
            
                map.jumpTo({
                    center: [c_lng, c_lat],
                    zoom: init_zoom + 1,
                });

                const popupContent = "現在地";;

                popup_loc.setLngLat([c_lng, c_lat]).setHTML(popupContent).addTo(map);
                marker_loc.setLngLat([c_lng, c_lat]).addTo(map);
                flag_loc = 1;
                this.removeAttribute("disabled");
            },
            (error) => {
                popup_loc.remove();
                document.getElementById('icon-loader').style.display = 'none';
                this.style.backgroundColor = "#999";
                this.style.color = "#fff";
                console.warn(`ERROR(${error.code}): ${error.message}`)
                map.flyTo({
                    center: init_coord,
                    zoom: init_zoom,
                    speed: 1,
                });
                popup_loc.setLngLat(init_coord).setHTML('現在地が取得できませんでした').addTo(map);
                flag_loc = 2;
                this.removeAttribute("disabled");
            },
            loc_options
        );
    }
});

const geocoderApi = {
    forwardGeocode: async (config) => {
        const features = [];
        try {
            const request =
        `https://nominatim.openstreetmap.org/search?q=${
            config.query
        }&format=geojson&polygon_geojson=1&addressdetails=1`;
            const response = await fetch(request);
            const geojson = await response.json();
            for (const feature of geojson.features) {
                const center = [
                    feature.bbox[0] +
                (feature.bbox[2] - feature.bbox[0]) / 2,
                    feature.bbox[1] +
                (feature.bbox[3] - feature.bbox[1]) / 2
                ];
                const point = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: center
                    },
                    place_name: feature.properties.display_name,
                    properties: feature.properties,
                    text: feature.properties.display_name,
                    place_type: ['place'],
                    center
                };
                features.push(point);
            }
        } catch (e) {
            console.error(`Failed to forwardGeocode with error: ${e}`);
        }

        return {
            features
        };
    }
};

const geocoder = new MaplibreGeocoder(geocoderApi, {
    maplibregl,
    zoom: 12,
    placeholder: '場所を検索',
    collapsed: true,
    //bbox:[122.94, 24.04, 153.99, 45.56],
    countries:'ja',
    language:'ja'
}
);
map.addControl(geocoder, 'top-left');
