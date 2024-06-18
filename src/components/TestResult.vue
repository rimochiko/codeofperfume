<template>
    <div class="test-result-container">
        <div class="result-guide-text">{{name}}的测试结果：</div>
        <div class="result-main-text">
            {{`[ ${result?.title}香民 ]`}}
        </div>
        <div class="result-cover">
          <div id="result-cover-main" ref="coverRef">
          </div>
        </div>
        <div class="result-desc-text">
            {{ result?.desc }}
        </div>
        <div v-if="result?.song" class="result-song-block">
            <div class="result-song-text">正缘歌曲：</div>
            <div class="result-song-cover">
                <img :src="result.song?.cover" alt="">
            </div>
            <div class="result-song-title">《{{ result.song.title }}》</div>
            <div class="result-song-desc">“{{ result.song.desc }}”</div>
        </div>
        <div class="result-buttons">
          <div @click="playAgain" class="result-opt-button">[ 再测一次 ]</div>
          <div @click="share" class="result-opt-button">[ 分享结果 ]</div>
        </div>
    </div>
  </template>
  
  <script>
  import { EVENT_NAME } from '../assets/constant';
  import { datas } from '../assets/question';
  import { onMounted, ref  } from 'vue';
  import p5 from 'p5';

  export default {
    props: {
      result: {
        type: Object,
        default: () => ({})
      },
      name: {
        type: String,
        default: '404香民'
      }
    },
    setup (props, context) {
      const coverRef = ref(null);
      const initResultCover = (target) => {
        target.setup = function() {
          const cvs = target.createCanvas(300, 300, target.WEBGL);
          cvs.parent(coverRef.value)
        }

        target.draw = () => {
          // target.background('rgb(0, 0, 255)');
          target.clear();
          target.normalMaterial();
          target.noFill();
          target.push();
          target.fill(255);
          target.translate(0, 0);
          target.rotateZ(target.frameCount * 0.01);
          target.rotateX(target.frameCount * 0.01);
          target.rotateY(target.frameCount * 0.01);
          target.ambientLight(50);
          target.directionalLight(255, 0, 0, 0.25, 0.25, 0);
          target.pointLight(0, 0, 255, 0, 0, 250);

          target.pointLight(250, 150, 250, 20, 0, 500);
          if (props.result.title === '圆锥') {
            target.cone(70, 160);
          } else if (props.result.title === '圆柱体') {
            target.cylinder(80, 180);
          } else if (props.result.title === '球体') {
            target.sphere(120);
          } else if (props.result.title === '正方体') {
            target.box(150, 150, 150);
          } else if (props.result.title === '三角锥') {
            target.cone(100, 100, 5);
          } else if (props.result.title === '多面体') {
            target.ellipsoid(120, 120, 120, 6, 3);
          } else if (props.result.title === '环体') {
            target.torus(80, 40, 5);
          } else {
            target.plane(120, 120);
          }
          target.pop();
        }
        
      }

      const playAgain = () => {
        context.emit('custom-event', {
            name: EVENT_NAME.PLAY_AGAIN,
        });
      }

      const share = () => {
      }

      onMounted(() => {
        new p5(initResultCover);
      })
      return {
        result: props.result,
        name: props.name,
        playAgain,
        coverRef,
        share,
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .result-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    /*position: fixed;*/
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4.5rem;
    background-image: linear-gradient(transparent, #01cdbb);
  }
  .test-result-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 88;
    color: #fff;
    height: 100vh;
    width: 100vw;
    overflow-y: scroll;
  }
  
  .result-guide-text {
    margin: 1rem 0.8rem 0;
    font-size: 0.68rem;
    font-style: italic;
  }

  .result-main-text {
    margin: 0 0.8rem 0rem;
    font-size: 1rem;
    font-weight: bold;
  }

  .result-desc-text {
    margin: -0.2rem 0.8rem 0.4rem;
    font-size: 0.48rem;
    letter-spacing: 0.06rem;
    line-height: 1.8;
  }

  .result-song-block {
    margin: 0 0.8rem 0.2rem;
    flex-grow: 1;
  }

  #result-cover-main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .result-song-text {
    font-style: italic;
    font-size: 0.58rem;
    margin-bottom: 0.4rem;
  }
  .result-song-title {
    font-size: 0.58rem;
    text-align: center;
    font-weight: bold;
    margin-bottom: 0.4rem;
  }
  .result-song-desc {
    font-size: 0.48rem;
    text-align: center;
  }

  .result-cover {
    width: 100%;
    margin: 0;
  }
  .result-opt-button {
    color: #fff;
    font-style: italic;
    margin: 1rem 0.8rem;
    padding: 0.1rem 0.5rem;
    font-size: 0.56rem;
    border-radius: 1rem;
  }

  .background-block {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    left: 0;
    top: 0;
  }

  @keyframes floating {
    50% {
        transform: translateY(10px);
    }
  }
  </style>
  