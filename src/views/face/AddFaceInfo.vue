<template>
  <div>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">录入员工信息</a-button>

    <a-table rowKey="dictId"
             :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
             :columns="columns"
             :data-source="formData"
    >
      <template #bodyCell="{ column, record ,index}">
        <template v-if="column.dataIndex === 'createTime'">

          <span>{{ filterTimeMonth(record.createTime) }} </span>

        </template>
        <template v-if="column.dataIndex === 'dictType'">
          <router-link to="/dictData" @click="changeDict(record.dictType)"> {{ record.dictType }}</router-link>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="getClolor(record.status)">{{ record.status == 0 ? '启用' : '停用' }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
        <span>

          <a @click="deleteData(record.id)">删除</a>
        </span>
        </template>

      </template>
    </a-table>
  </div>

  <a-modal v-model:visible="visible" title="新增员工信息" @ok="handleOk">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="姓名" :rules="[{ required: true, message: '请输入员工姓名' }]">
        <a-input v-model:value="formState.name" placeholder="请输入员工姓名"/>
      </a-form-item>
      <a-form-item label="面部信息" :rules="[{ required: true, message: '请输入员工照片' }]">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove"
                  :max-count="1"
        >

          <a-button>
            <cloud-upload-outlined/>
            选择文件

          </a-button>
        </a-upload>


      </a-form-item>

      <a-form-item label="备注">
        <a-textarea v-model:value="formState.remark"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import {computed, defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import _axios, {dataUrl} from "../../http/request";
import moment from "moment/moment";
import {message, type UploadProps} from "ant-design-vue";

interface DataType {
  key: string | number;
  name: string;
  age: number;
  address: string;
}

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  }, {
    title: '操作',
    key: 'action',
  },
];

const formData = ref()

export default defineComponent({
  setup() {
    const formState = ref({
      id: '',
      name: '',
      remark: ""

    } || null);
    const visible = ref<boolean>(false);
    const state = reactive<{
      selectedRowKeys: string | number[];
      loading: boolean;
    }>({
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    });
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);
    const fileList = ref([]);
    const uploading = ref<boolean>(false);

    const onSelectChange = (selectedRowKeys: string | number[]) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };

    onMounted(() => {
      init()
    })

    function init() {
      _axios.post(dataUrl + "/fact-info/get", {}).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          formData.value = res.data.data
        }
      })
    }

    function filterTimeMonth(time: any) {
      return moment(time).format("YYYY年MM月DD日 hh:mm:ss");
    }

    function getClolor(e: any) {
      if (e == 0) {
        return "success";
      } else {
        return "default";
      }
    }



    // 新增字典类型
    function handleAdd() {
      visible.value = true;
      formState.value.id = ''
      formState.value.name = ''
      formState.value.remark = ''
    }

    // 确认新增
    const handleOk = (e: MouseEvent) => {
      console.log(e);
      const formData = new FormData();
      fileList.value.forEach((file: UploadProps['fileList'][number]) => {
        formData.append('files', file as any);
        formData.append("name",formState.value.name)
        formData.append("remark",formState.value.remark)
      });

      visible.value = false;
      _axios.post(dataUrl + "/fact-info/save", formData).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        message.error('录入失败')
      }).finally(() => {
        init()
        fileList.value=[]

      })
    };



    function deleteData(e: any) {
      _axios.post(dataUrl + "/fact-info/delete", {id: e}).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        message.error('网络异常，请稍后再试')
      }).finally(() => {
        init()

      })
    }
    const handleRemove: UploadProps['onRemove'] = file => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };
    // 上传之前
    const beforeUpload: UploadProps['beforeUpload'] = file => {
      fileList.value = [...fileList.value, file];
      return false;
    };

    return {
      formData,
      fileList,
      uploading,
      columns,
      hasSelected,
      ...toRefs(state),
      visible,
      formState,
      labelCol: {style: {width: '150px'}},
      wrapperCol: {span: 14},

      // func
      onSelectChange,
      init,
      filterTimeMonth,
      getClolor,
      handleAdd,
      handleOk,
      deleteData,
      beforeUpload,handleRemove
    };
  },
});
</script>

