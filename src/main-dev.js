import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from "vue-quill-editor/src";
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
