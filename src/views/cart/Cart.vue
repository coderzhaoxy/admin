<template>
  <div class="cart">
    <nav-bar class="cart-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <scroll class="content" ref="scroll">
      <cart-list></cart-list>
    </scroll>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from "../../components/content/navbar/NavBar";
  import CartList from "./childcomps/CartList";
  import CartBottomBar from "./childcomps/CartBottomBar";

  import {mapGetters} from 'vuex'
  import Scroll from "../../components/common/bscroll/Scroll";

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      Scroll,
      CartBottomBar
    },
    computed: {
      ...mapGetters([
        'cartLength'
      ])
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart {
    height: calc(100vh - 49px - 44px - 42px);

  }

  .content {
    height: 100%;
    overflow: hidden;
  }

  .cart-bar {
    background-color: var(--color-high-text);
    color: #fff;
  }
</style>
