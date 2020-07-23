import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueCoreVideoPlayer from 'vue-core-video-player';
import ScrollLoader from 'vue-scroll-loader'

Vue.use(ScrollLoader);
Vue.component('VPip', require('v-pip'));
Vue.config.productionTip = false;
new Vue({
    vuetify,
    VueCoreVideoPlayer,
    render: h => h(App)
}).$mount('#app')
