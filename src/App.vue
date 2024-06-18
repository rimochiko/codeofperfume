<template>
  <div>
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
      new p5(initBackground);
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
}

#app {
  font-family: 'siyuanheiti', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  letter-spacing: 0.03rem;
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

.bottom-bg {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: rgba(0, 0, 255, 0.932);
  background-image: 
    radial-gradient(closest-side, rgb(0, 0, 255), rgba(235, 105, 78, 0)),
    radial-gradient(closest-side, rgb(6, 55, 189), rgba(243, 11, 164, 0)),
    radial-gradient(closest-side, blue, rgba(254, 234, 131, 0)),
    radial-gradient(closest-side, rgb(36, 50, 207), rgba(170, 142, 245, 0)),
    radial-gradient(closest-side, rgb(238, 238, 238), rgba(248, 192, 147, 0));
  background-size: 
    150vmax 150vmax,
    80vmax 80vmax,
    90vmax 90vmax,
    110vmax 110vmax,
    90vmax 90vmax;
  background-position:
    -80vmax -80vmax,
    60vmax -30vmax,
    10vmax 10vmax,
    -30vmax -10vmax,
    50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 10s movement linear infinite;
  z-index: 0;
  position: relative;
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

@keyframes movement {
  0%, 100% {
    background-size: 
      150vmax 150vmax,
      80vmax 80vmax,
      90vmax 90vmax,
      120vmax 120vmax,
      100vmax 100vmax;
    background-position:
      -80vmax -80vmax,
      60vmax -30vmax,
      10vmax 10vmax,
      -30vmax -10vmax,
      50vmax 50vmax;
  }
  25% {
    background-size: 
      100vmax 100vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      60vmax 60vmax;
    background-position:
      -60vmax -90vmax,
      50vmax -40vmax,
      0vmax -20vmax,
      -40vmax -20vmax,
      40vmax 60vmax;
  }
  50% {
    background-size: 
      80vmax 80vmax,
      110vmax 110vmax,
      80vmax 80vmax,
      60vmax 60vmax,
      100vmax 100vmax;
    background-position:
      -50vmax -70vmax,
      40vmax -30vmax,
      10vmax 0vmax,
      20vmax 10vmax,
      30vmax 70vmax;
  }
  75% {
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
</style>
