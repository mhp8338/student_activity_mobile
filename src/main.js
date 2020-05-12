import Vue from 'vue'
import App from './App.vue'

import router from "./router";
import axios from 'axios';
import './mock/mock.js'
import mock from 'mockjs'
import './assets/css/global.css'
import VueAMap from 'vue-amap';


import {Button} from 'vant';
import {Form} from 'vant';
import {Field} from 'vant';
import {Rate} from 'vant';
import {Toast} from 'vant';

Vue.use(Toast);
Vue.use(Rate);
Vue.use(Field);
Vue.use(Form);
Vue.use(Button);

Vue.config.productionTip = false


/*配置请求根路径*/
axios.defaults.baseURL = 'http://localhost:8082/test'
axios.interceptors.request.use(config => {
    console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios

Vue.use(mock)

Vue.filter('dataFormat', function (originVal) {
    const dt = new Date(originVal)
    const year = dt.getFullYear()
    const month = (dt.getMonth() + 1 + '').padStart(2, '0')
    const day = (dt.getDate() + '').padStart(2, '0')
    const hour = (dt.getHours() + '').padStart(2, '0')
    const minutes = (dt.getMinutes() + '').padStart(2, '0')
    const seconds = (dt.getSeconds() + '').padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
})

/*引入高德地图插件*/
Vue.use(VueAMap)

VueAMap.initAMapApiLoader({
    key: '08547378df03af7f3ed8c7360131b3b1',
    plugin: [
        'AMap.Autocomplete',
        'AMap.PlaceSearch', // POI搜索插件
        'AMap.Scale', // 右下角缩略图插件 比例尺
        'AMap.OverView',
        'AMap.ToolBar', // 地图工具条
        'AMap.MapType',
        'AMap.PolyEditor',
        'AMap.CircleEditor',// 圆形编辑器插件
        'AMap.Geolocation'// 定位控件，用来获取和展示用户主机所在的经纬度位置
    ],
    v: '1.4.4'
});


new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
