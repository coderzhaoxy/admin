<template>
  <div class="items">
    <div class="item" v-for="(item,index) in matiInfo.list" :key="index">
      <a :href="item.link">
        <img class="item-img" :src="item.image" alt="">
        <span class="item-text">
          {{item.title}}
      </span>
      </a>

    </div>
  </div>
</template>

<script>
  export default {
    name: "CateScrollListItem",
    props: {
      matiInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    }

  }
</script>

<style scoped>
  .items {
    padding: 0 8px;
  }

  .item {

    font-size: 12px;
    width: 62px;
    margin-right: 6px;
    display: inline-block;
    text-align: center;

  }

  .item-img {
    display: block;
    width: 80%;
    margin: 12px auto;


  }

  .item-text {
    margin-top: 15px;

  }
</style>
