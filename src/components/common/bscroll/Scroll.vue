<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    data() {
      return {
        scroll: null
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        observeDOM: true,
        observeImage: true,
        click: true,
        pullUpLoad: true,
        keepAlive:true
      }),
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        }),
        //监听滚动的位置
        this.scroll.on('scroll',(position)=>{
          // console.log(position);
          this.$emit('scroll',position)
        })
    },
    methods: {
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      },
      refresh(){
        this.scroll&&this.scroll.refresh()
      }
    }

  }

</script>

<style scoped>

</style>
