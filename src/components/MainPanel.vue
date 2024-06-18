<template>
  <div class="home-container">
    <div class="home-content">
      <div class="home-title">
        <img src="../assets/title.png" />
      </div>
      <div class="home-button">
        <div class="home-button-img" @click="startTest">[ 开始测试 ]</div>
      </div>
    </div>
    <div class="background-block">
      <div class="background-block-s1"></div>
      <div class="background-block-s2"></div>
      <div class="background-block-s3"></div>
      <div class="background-block-s4"></div>
      <div class="background-block-s5"></div>
    </div>
  </div>
</template>

<script>
import TestPanel from './TestPanel.vue'
import { ref } from 'vue';
import { EVENT_NAME } from '@/assets/constant';
export default {
  setup(props, context) {
    let startTest = () => {
      context.emit('custom-event', {
          name: EVENT_NAME.SHOW_TEST_PANEL,
      });
    }

    return {
      startTest,
    }
  },
  components: {
    TestPanel
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home-container {
  position: absolute;
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.home-content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
}
.home-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-top: 1.5rem;
}
.home-title img {
  width: 8rem;
}
.home-button {
  position: absolute;
  bottom: 2rem;
  left: 0;
  font-size: 2rem;
  color: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  height: 2.2rem;
  background-image: url('../assets/s1.png');
  background-size: 100% auto;
  position: absolute;
  right: -0.5rem;
  bottom: 0;
  z-index: 111;
  animation: floating 3s infinite ease-in-out;
}
.background-block-s2 {
  width: 20vh;
  height: 20vh;
  background-image: url('../assets/s2.png');
  background-size: 100% 100%;
  position: absolute;
  left: -0.5rem;
  bottom: 1rem;
  z-index: 111;
  animation: floating 2.5s infinite ease-in-out; 
}
.background-block-s3 {
  width: 50vh;
  height: 50vh;
  background-image: url('../assets/s3.png');
  background-size: 100% 100%;
  position: absolute;
  left: 1rem;
  top: 7.2rem;
  z-index: 100;
  animation: floating 1.5s infinite ease-in-out;
}
.background-block-s4 {
  width: 20vh;
  height: 20vh;
  background-image: url('../assets/s4.png');
  background-size: 100% 100%;
  position: absolute;
  left: -0.6rem;
  top: 4.3rem;
  z-index: 100;
  animation: floating 2s infinite ease-in-out;
}
.background-block-s5 {
  width: 20vh;
  height: 20vh;
  background-image: url('../assets/s5.png');
  background-size: 100% 100%;
  position: absolute;
  right: -0.3rem;
  bottom: 2.5rem;
  z-index: 100;
  z-index: 99;
  animation: floating 3.2s infinite ease-in-out;
}
.home-button-img {
  margin: 0 auto;
  font-size: 0.65rem;
  font-style: italic;;
  animation: heartbeat 1.5s ease-in-out infinite both;
}

@keyframes heartbeat {
  from {
    transform: scale(1);
    transform-origin: center center;
    animation-timing-function: ease-out;
  }
  10% {
    transform: scale(0.91);
    animation-timing-function: ease-in;
  }
  17% {
    transform: scale(0.98);
    animation-timing-function: ease-out;
  }
  33% {
    transform: scale(0.87);
    animation-timing-function: ease-in;
  }
  45% {
      transform: scale(1);
      animation-timing-function: ease-out;
  }
}

@keyframes floating {
  50% {
      transform: translateY(10px);
  }
}
</style>
