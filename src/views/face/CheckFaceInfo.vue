<template>
  <div style="display:flex;justify-content: center">
   <div >
     <video style="width: 90vh"   ref="video" autoplay></video><br/>
  <div style="display:flex;justify-content: center">    <a-radio-button  @click="takePicture">身份鉴定</a-radio-button> </div>
   </div>
   <div style="display: flex;">
     <canvas ref="canvas" style="display:none;"></canvas>
<!--     <img style="margin-left: 30px" :src="photo" v-if="photo"/>-->
     <a-card hoverable style="width: 90vh;margin-left: 30px" v-if="photo">
       <template #cover>
         <img alt="example"   :src="photo"   />
       </template>
       <a-card-meta :title="userInfo.message"  >
       </a-card-meta>
       <hr/>
        <p v-if="userInfo.data">年龄： {{userInfo.data.age}} &nbsp;&nbsp;&nbsp;&nbsp 性别：{{ getGender(userInfo.data.gender) }}   <span v-if="userInfo.data">&nbsp;&nbsp;&nbsp;&nbsp 活体检测： {{getLive(userInfo.data.liveness) }}</span></p>


     </a-card>
   </div>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import _axios, {dataUrl} from "@/http/request";

export default {
  setup() {
    const video = ref(null);
    const canvas = ref(null);
    const photo = ref(null);
    const userInfo = ref({});

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        video.value.srcObject = stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    const takePicture = () => {
      canvas.value.width = video.value.videoWidth;
      canvas.value.height = video.value.videoHeight;
      canvas.value.getContext('2d').drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
      const imageData = canvas.value.toDataURL('image/png');
      photo.value = imageData;



      _axios.post(dataUrl + "/fact-info/check ", {imageData:imageData}).then((res) => {
        console.log(res)
       userInfo.value=res.data
      })
    };

    const detectFace = () => {
      // 使用人脸识别API检测图像中是否有人脸
      // 如果有人脸，自动拍照
      // 可以使用第三方库，例如face-api.js
    };

    onMounted(() => {
      startCamera();
      setInterval(detectFace, 1000);
    });
function getGender(e){
  if (e==0){
    return '男'
  }else {
    return '女'
  }
}
function getLive(e){
  if (e==1){
    return '正常'
  }else {
    return  '照片嫌疑'
  }
}
    return {
      video,
      canvas,
      photo,userInfo,
      takePicture,getGender,getLive
    };
  },
};
</script>
