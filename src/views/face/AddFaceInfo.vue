<template>
  <div>
    <video ref="video" autoplay></video>
    <button @click="takePicture">Take Picture</button>
    <canvas ref="canvas" style="display:none;"></canvas>
    <img :src="photo" v-if="photo"/>
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
      console.log(imageData)



      _axios.post(dataUrl + "/fact-info/check ", {imageData:imageData}).then((res) => {
        console.log(res)
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

    return {
      video,
      canvas,
      photo,
      takePicture,
    };
  },
};
</script>
