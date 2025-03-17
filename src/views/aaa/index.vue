<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
const stepList = [
  'Start(Vincy.Li1)',
  'Team Head(Rachel.Liu1)',

  // 'Function Head(Fanny.Zhang、Sarah.Xing1、amy.zhang11)',
  'Finance(Sylvia.Yuan、lina.zhuang)',
  'FPA Manager(Will.Jiang)',
  'PTP(leo.bao)',
  '结束',
]
</script>

<template>
  <div
    class="aaa"
  >
    <div
      v-for="(item, index) in stepList"
      :key="item"
      :class="index === 0 ? 'item_1' : 'item_2'"
    >
      <div
        class="a"
      />

      <div
        class="b"
      >
        {{ item }}
      </div>

      <div
        class="c"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aaa {
  width: 100%;
  display: flex;
  gap: 10px;

  .item_1 {
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #448ef7;

    .a {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 25px 0 25px 50px;
      border-color: transparent transparent transparent #f6f8f9;
    }
    .b {
      padding: 0 10px;
      height: 100%;
      min-width: 200px;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;

      // margin-left: -50px; /* 负 margin 抵消箭头的宽度 */
      border: none;

      color: #fff;
    }

    .c {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 25px 0 25px 50px; /* 左侧形成箭头 */
      border-color: #f6f8f9 #f6f8f9 #f6f8f9 #448ef7; /* 左侧箭头颜色 */
    }
  }
  .item_2 {
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #3e689b;

    .a {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 25px 0 25px 50px;
      border-color: transparent transparent transparent #f6f8f9;
    }
    .b {
      padding: 0 10px;
      height: 100%;
      min-width: 200px;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;

      // margin-left: -50px; /* 负 margin 抵消箭头的宽度 */
      border: none;

      color: #fff;
    }

    .c {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 25px 0 25px 50px; /* 左侧形成箭头 */
      border-color: #f6f8f9 #f6f8f9 #f6f8f9 #3e689b; /* 左侧箭头颜色 */
    }
  }
}
</style>
