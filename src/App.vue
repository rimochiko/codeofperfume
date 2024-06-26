<template>
  <div style="height: 100%; width: 100%; position: relative">
    <transition name="fadeloading">
      <div v-if="isLoading && isMobileRef" class="loading-panel">
        <div class="loading-blur"></div>
        <div class="loading-text">Perfume 加载中...</div>
      </div>
    </transition>
    <div v-if="isMobileRef">
      <transition name="fade">
        <MainPanel
          v-if="isShowMain"
          class="main-content" @custom-event="handleCustomEvent"/>
      </transition>
      <transition name="fade">
        <TestPanel
          v-if="isShowTest"
          @custom-event="handleCustomEvent"
        />
      </transition>
      <transition name="fade">    
        <InputPanel
          v-if="isShowInput"
          @custom-event="handleCustomEvent"
        />
      </transition>
      <transition name="fade">    
        <TestResult
          v-if="isShowResult"
          @custom-event="handleCustomEvent"
          :result="result"
          :name="name"
        />
      </transition>
      <div id="bottom-bg"></div>
      <div id="main-bg" ref="mainBg">
      </div>
    </div>
    <div v-else class="empty-container">
      <div class="empty-title">
        <img src="https://s21.ax1x.com/2024/06/21/pkDHX01.png" alt="">
      </div>
      <div class="empty-tips">个人粉丝制作，各位看官娱乐看待，使用手机进行扫码访问^-^</div>
      <div>
        <canvas ref="qrCodeRef" width="300" height="300"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import MainPanel from './components/MainPanel.vue';
import TestPanel from './components/TestPanel.vue';
import TestResult from './components/TestResult.vue';
import InputPanel from './components/InputPanel.vue';
import p5 from 'p5';
import Perlin from 'perlin.js';
import { onMounted, ref, Transition } from 'vue';
import { EVENT_NAME } from './assets/constant';
import { testResult } from './assets/question';
import { isMobile } from './libs/utils';
import QRCode from 'qrcode';

export default {
  name: 'App',
  components: {
    MainPanel,
    TestPanel,
    TestResult,
    Transition,
    InputPanel,
  },
  setup() {
    let mainBg = ref(null);
    let qrCodeRef = ref(null);
    const initBackground = (target) => {
      target.setup = () => {
        const cvs = target.createCanvas(target.windowWidth, target.windowHeight);
        cvs.parent(mainBg.value)
        target.noFill();
        target.strokeWeight(1);
        target.stroke('rgba(255, 255, 255, 0.3)');
      }
      var offset = -100;
      var d = 0.004;
      var c = 0.6;
      var blockWidth = 32;
      function getN(b, e) {
           
          var a = target.map(
            Perlin.simplex2(b * d + (target.millis() * 0.0001), e * d), 
            -1,
            1,
            1,
            0
          );
          a = target.constrain(a, 0.3, 0.6);
          a *= 60;
          return a
      }

      target.draw = () => {
        target.clear();
        target.background(0, 0, 255)
        for (var b = offset + blockWidth; b < target.width - offset - blockWidth; b += blockWidth) {
            target.beginShape();
            for (var e = offset; e < target.height - offset; e += blockWidth) {
                var a = getN(b, e);
                target.vertex(b + a, e + a - (offset / 2))
            }
            target.endShape()
        }
        for (var e = offset + 8; e < target.height - offset - blockWidth; e += blockWidth) {
            target.beginShape();
            for (var b = offset; b < target.width - offset; b += blockWidth) {
                var a = getN(b, e);
                target.vertex(b + a, e + a - (offset / 2))
            }
            target.endShape()
        }
      }

      target.windowResized = function () {
          target.resizeCanvas(target.windowWidth, target.windowHeight);
          target.draw()
      }

    }

    let isShowTest = ref(false);
    let isShowResult = ref(false);
    let isShowInput = ref(false);
    let isShowMain = ref(true);
    let answers = ref([]);
    let result = ref({});
    let name = ref('');
    let isMobileRef = ref(isMobile());
    let isLoading = ref(true);

    let calculateResult = () => {
      let currScore = {
        1:0,
        2:0,
        3:0,
        4:0,
        5:0,
        6:0
      };
      console.log(answers)
      answers.value.forEach(item => {
        if (!currScore[item]) {
          currScore[item] = 1;
        } else {
          currScore[item]++;
        }
      })
      console.log(currScore)
      let curResult = [
        currScore[1] > currScore[2] ? 1 : 2,
        currScore[3] > currScore[4] ? 3 : 4,
        currScore[5] > currScore[6] ? 5 : 6,
      ]
      const finalResult = testResult[curResult.join('')];
      // 计算歌曲
      const { songs } = finalResult;
      finalResult.song = songs[Math.floor(Math.random() * songs.length)];
      return finalResult;
    }

    function handleCustomEvent(payload) {
      switch (payload?.name) {
        case EVENT_NAME.SELECT_ITEM: 
          if (payload?.data) {
            answers.value.push(...((payload.data.score || '').split('').filter(item => item) || []));
          }
        break;
        case EVENT_NAME.SHOW_TEST_PANEL: 
          isShowTest.value = true;
          isShowResult.value = false;
          isShowMain.value = false;
          isShowInput.value = false;
        break;
        case EVENT_NAME.CLOSE_TEST_PANEL: 
          isShowTest.value = false;
          isShowResult.value = false;
          isShowMain.value = false;
          isShowInput.value = true;
        break;
        case EVENT_NAME.SHOW_RESULT:
          name.value = payload?.data?.name;
          isShowTest.value = false;
          isShowResult.value = true;
          isShowMain.value = false;
          isShowInput.value = false
          // 计算结果
          result.value = calculateResult();
          console.log('你的测试所结果是', result.value)
          isShowTest.value = false;
          isShowResult.value = true;
          break;      
        case EVENT_NAME.PLAY_AGAIN:
          answers.value = [];
          isShowTest.value = false;
          isShowResult.value = false;
          isShowMain.value = true;
        break;
      }
    }

    onMounted(() => {
      if (isMobileRef.value) {
        new p5(initBackground);
      } else {
        const ctx = qrCodeRef.value.getContext('2d');
        QRCode.toDataURL(window.location.href, function(err, url) {
          if (err) throw err;
          const img = new Image();
          img.onload = function() {
            ctx.drawImage(
              img,
              0,
              0,
              qrCodeRef.value.width,
              qrCodeRef.value.height
          );
          };
          img.src = url;
        });        
      }
      const timer = setTimeout(() => {
        clearTimeout(timer);
        console.log('test');
        isLoading.value = false;
      }, 4000);
    })

    return {
      mainBg,
      isShowTest,
      isShowResult,
      isShowMain,
      isShowInput,
      result,
      handleCustomEvent,
      name,
      isMobileRef,
      qrCodeRef,
      isLoading
    }
  }
}
</script>

<style>
@font-face {
  font-family: 'siyuanheiti';
  src: url(./assets/SourceHanSansCN-Normal.otf);
}
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 10px;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  font-family: 'siyuanheiti';
  background-color: blue;
}

#app {
  font-family: 'siyuanheiti', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  letter-spacing: 0.03rem;
}

.empty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.empty-title img {
  width: 6rem;
  margin-bottom: 0.4rem;
}

.empty-tips {
  text-align: center;
  font-size: 0.42rem;
  color: #fff;
  padding: 0 1rem;
  margin-bottom: 0.4rem;
}

.main-bg {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
}

.main-content {
  position: relative;
  z-index: 10;
}

.loading-text {
  animation: blink1 0.6s both infinite;
}

.bottom-bg::after {
  content: '';
  display: block;
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

span {
  position: relative;
  z-index: 10;
  display: flex;
  min-height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  color: transparent;
  text-shadow:
    0px 0px 1px rgba(255, 255, 255, .6),
    0px 4px 4px rgba(0, 0, 0, .05);
  letter-spacing: .2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fadeloading-enter-active,
.fadeloading-leave-active {
  transition: opacity 0.5s ease;
}

.fadeloading-enter-from,
.fadeloading-leave-to {
  opacity: 0;
  pointer-events: none;
}

.loading-panel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 100;
  background-color: rgb(142, 172, 255);
  background-image: 
    radial-gradient(closest-side, rgb(0, 0, 255), rgba(235, 105, 78, 0)),
    radial-gradient(closest-side, #105fe7, rgba(243, 11, 164, 0)),
    radial-gradient(closest-side, rgb(20, 20, 224), rgba(254, 234, 131, 0)),
    radial-gradient(closest-side, rgb(30, 68, 175), rgba(170, 142, 245, 0)),
    radial-gradient(closest-side, rgb(36, 83, 214), rgba(248, 192, 147, 0));
    background-size: 
      90vmax 90vmax,
      120vmax 120vmax,
      100vmax 100vmax,
      100vmax 100vmax,
      80vmax 80vmax;
    background-position:
      -20vmax -30vmax,
      50vmax -30vmax,
      20vmax 0vmax,
      -10vmax 10vmax,
      -40vmax 60vmax;
  background-repeat: no-repeat;
  animation: 5s movement linear infinite;
  color: #fff;
  font-size: 0.42rem;
  font-style: italic;
}

.loading-blur {
  content: '';
  display: block;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@keyframes movement {
  0% {
    background-size: 
      90vmax 90vmax,
      120vmax 120vmax,
      100vmax 100vmax,
      100vmax 100vmax,
      80vmax 80vmax;
    background-position:
      -20vmax -30vmax,
      50vmax -30vmax,
      20vmax 0vmax,
      -10vmax 10vmax,
      -40vmax 60vmax;
  }
  100% {
    background-size: 
      90vmax 90vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      70vmax 70vmax;
    background-position:
      -50vmax -40vmax,
      50vmax -30vmax,
      20vmax 0vmax,
      -10vmax 10vmax,
      40vmax 60vmax;
  }
}

@keyframes blink1 {
  0%,
  50%,
  100% {
    opacity: 1;
  }
  25%,
  75% {
    opacity: 0;
  }
}
</style>
