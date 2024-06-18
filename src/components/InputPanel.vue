<template>
    <div class="input-container">
      <div class="input-main">
        <div class="input-title">请输入你的昵称：</div>
        <div class="input-box">
            <input class="input-item" v-model="name"/>
            <div v-show="isShowTip" class="input-tip">该项为必填项哦~</div>
        </div>
        <div class="input-footer">
          <div class="input-submit" @click="submit">[ 查看结果 ]</div>
        </div>
      </div>
      <div class="background-block">
        <div class="background-block-s1"></div>
        <div class="background-block-s2"></div>
        <div class="background-block-s4"></div>
      </div>
    </div>
  </template>
  
  <script>
  import { EVENT_NAME } from '../assets/constant';
  import { datas } from '../assets/question';
  import { ref  } from 'vue';
  export default {
    setup (props, context) {

      let name = ref('');
      let isShowTip = ref(false);
      
      let submit = () => {
        if (!name.value) {
            isShowTip.value = true;
            return;
        }
        isShowTip.value = false;
        context.emit('custom-event', {
            name: EVENT_NAME.SHOW_RESULT,
            data: {
                name: name.value,
            },
        });
      }

      return {
        name,
        submit,
        isShowTip
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .input-container {
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

  .input-main {
    position: relative;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  .input-title {
    font-size: 0.68rem;
    font-weight: bold;
    margin: 0.5rem 0.8rem 0.5rem;
    line-height: 1.8;
    letter-spacing: 0.05rem;
  }

  .input-item {
    font-size: 0.58rem;
    height: 1.8rem;
    padding: 0 0.8rem;
    margin-bottom: 0.4rem;
    outline: none;
    background-color: rgba(32, 230, 244, 0.3);
    border: none;
    border-radius: 1.5rem;
    color: #fff;
    width: 6rem;
    text-align: center;
  }

  .input-box {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .input-footer {
  }

  .input-tip {
    font-size: 0.48rem;
    color: rgba(255, 255, 255, .7);
    text-align: left;
    height: 1rem;
  }

  .input-box {
    display: flex;
    flex-direction: column;
  }

  .input-submit {
    margin-top: 1rem;
    font-size: 0.68rem;
    font-style: italic;
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
    width: 5rem;
    height: 5rem;
    background-image: url('../assets/s5.png');
    background-size: 100% auto;
    position: absolute;
    left: -0.5rem;
    bottom: 0;
    z-index: 111;
    animation: floating 3s infinite ease-in-out;
  }
  .background-block-s2 {
    width: 4rem;
    height: 4rem;
    background-image: url('../assets/s2.png');
    background-size: 100% 100%;
    position: absolute;
    right: -1rem;
    bottom: 2rem;
    z-index: 111;
    animation: floating 2.5s infinite ease-in-out; 
  }
  .background-block-s4 {
    width: 6rem;
    height: 6rem;
    background-image: url('../assets/s6.png');
    background-size: 100% 100%;
    position: absolute;
    left: 0.5rem;
    top: 1.5rem;
    z-index: 100;
    animation: floating 2s infinite ease-in-out;
  }
  .background-block-s5 {
    width: 4.5rem;
    height: 4.5rem;
    background-image: url('../assets/s8.png');
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
  