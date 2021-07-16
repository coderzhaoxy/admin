import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from "vue-quill-editor/src";

Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
