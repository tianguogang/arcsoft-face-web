<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" style="margin-top: 30px"></div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">

        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>数据字典</span>
            </span>
          </template>
          <a-menu-item key="3"><router-link to="dictType">字典类型</router-link></a-menu-item>
          <a-menu-item key="4"><router-link to="dictData">字典数据</router-link></a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>人脸识别</span>
            </span>
          </template>
          <a-menu-item key="7"><router-link to="addFaceInfo">新增人脸</router-link></a-menu-item>
          <a-menu-item key="8"><router-link to="checkFaceInfo">人脸比对</router-link></a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <file-outlined />
          <span>File</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '80vh' ,}">
        <router-view ></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: {
    PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
    TeamOutlined,
    FileOutlined,
  },
  data() {
    return {
      collapsed: ref<boolean>(false),
      selectedKeys: ref<string[]>(['1']),
    };
  },
});
</script>
<style>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
