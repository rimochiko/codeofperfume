<template>
    <div class="test-container">
      <div class="test-main">
        <div class="test-index">{{currentIndex + 1}} / {{ totalNum }}</div>
        <div class="test-title">{{content.text}}</div>
        <div class="test-answers">
          <div class="test-answer"
            v-for="(item, index) in content.options"
            :key="item.id"
            @click="clickItem(item)"
          >
            {{`${OPTIONS[index]}. ${item.text}`}}
          </div>
        </div>
      </div>
      <div class="background-block">
        <div class="background-block-s1"></div>
        <div class="background-block-s2"></div>
        <div class="background-block-s4"></div>
        <div class="background-block-s5"></div>
      </div>
    </div>
  </template>
  
  <script>
  import { EVENT_NAME } from '../assets/constant';
  import { datas } from '../assets/question';
  import { ref  } from 'vue';
  export default {
    setup (props, context) {
      const OPTIONS = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D'
      }
      let currentIndex = ref(0);
      let content = ref(datas[currentIndex.value])
      let clickItem = (item) => {
        context.emit('custom-event', {
            name: EVENT_NAME.SELECT_ITEM,
            data: item,
        });
        currentIndex.value++;
        if (currentIndex.value >= datas.length) {
          context.emit('custom-event', {
            name: EVENT_NAME.CLOSE_TEST_PANEL,
          });
          return;
        }
        content.value = datas[currentIndex.value]
      }

      return {
        content,
        clickItem,
        OPTIONS,
        currentIndex,
        totalNum: datas.length,
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .test-index {
    font-size: 0.7rem;
    font-style: italic;
    margin: 0rem 0.8rem 0;
  }
  .test-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 88;
    color: #fff;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .test-main {
    position: relative;
    z-index: 2;
  }
  
  .test-title {
    font-size: 0.68rem;
    font-weight: bold;
    margin: 0.5rem 0.8rem 1.5rem;
    line-height: 1.8;
    letter-spacing: 0.05rem;
  }
  
  .test-answers {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0 1rem;
  }
  
  .test-answer {
    font-size: 0.52rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    width: 100%;
  }
  

  .background-block {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    left: 0;
    top: 0;
  }
  .background-block-s1 {
    width: 6rem;
    height: 3rem;
    background-image: url('../assets/s1.png');
    background-size: 100% auto;
    position: absolute;
    left: -0.5rem;
    bottom: 0;
    z-index: 111;
    animation: floating 3s infinite ease-in-out;
  }
  .background-block-s2 {
    width: 4.5rem;
    height: 4.5rem;
    background-image: url('../assets/s2.png');
    background-size: 100% 100%;
    position: absolute;
    right: -0.5rem;
    bottom: 1rem;
    z-index: 111;
    animation: floating 2.5s infinite ease-in-out; 
  }
  .background-block-s4 {
    width: 4.5rem;
    height: 4.5rem;
    background-image: url('../assets/s4.png');
    background-size: 100% 100%;
    position: absolute;
    left: -0.6rem;
    top: 4.5rem;
    z-index: 100;
    animation: floating 2s infinite ease-in-out;
  }
  .background-block-s5 {
    width: 4.5rem;
    height: 4.5rem;
    background-image: url('../assets/s5.png');
    background-size: 100% 100%;
    position: absolute;
    right: -0.3rem;
    top: 1rem;
    z-index: 100;
    z-index: 99;
    animation: floating 3.2s infinite ease-in-out;
  }

  @keyframes floating {
    50% {
        transform: translateY(10px);
    }
  }
</style>
  