<template>
  <div>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">新增字典类型</a-button>

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
          <a @click="update(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="deleteData(record.dictId)">删除</a>
        </span>
        </template>

      </template>
    </a-table>
  </div>

  <a-modal v-model:visible="visible" title="新增字典类型" @ok="handleOk">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="字典名称" :rules="[{ required: true, message: '请输入字典名称' }]">
        <a-input v-model:value="formState.dictName" placeholder="请输入字典名称"/>
      </a-form-item>
      <a-form-item label="字典类型" :rules="[{ required: true, message: '请输入字典类型' }]">
        <a-input v-model:value="formState.dictType" placeholder="请输入唯一的字典类型"/>
      </a-form-item>
      <a-form-item label="状态">
        <a-radio-group v-model:value="formState.status">
          <a-radio value="0">启用</a-radio>
          <a-radio value="1">停用</a-radio>
        </a-radio-group>
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

import {message} from "ant-design-vue";

interface DataType {
  key: string | number;
  name: string;
  age: number;
  address: string;
}

const columns = [
  {
    title: '字典编号',
    dataIndex: 'dictId',
  },
  {
    title: '字典名称',
    dataIndex: 'dictName',
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
  },
  {
    title: '状态',
    dataIndex: 'status',
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
      dictId:'',
      dictName: '',
      dictType: '',
      status: '0',
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


    const onSelectChange = (selectedRowKeys: string | number[]) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };

    onMounted(() => {
      init()
    })

    function init() {
      _axios.post(dataUrl + "/sys-dict-type/get", {}).then((res) => {
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

    function changeDict(e: any) {
      localStorage.setItem("dict_type",e)
    }

    // 新增字典类型
    function handleAdd() {
      visible.value = true;
      formState.value.dictId = ''
      formState.value.dictName = ''
      formState.value.dictType = ''
      formState.value.remark = ''
      formState.value.status = '0'
    }

    // 确认新增
    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
      _axios.post(dataUrl + "/sys-dict-type/save", formState.value).then((res) => {
        console.log(res)
        if (res.data.code==200){
          message.success(res.data.message)
        }else {
          message.error(res.data.message)
        }
        init()
      }).catch((err) => {
        console.log(err)
        message.error('操作失败，请检查字典类型是否唯一')
      })
    };

    function update(e: any) {
      console.log(e)
      visible.value = true;
      formState.value.dictId   = e.dictId
      formState.value.dictName = e.dictName
      formState.value.dictType = e.dictType
      formState.value.remark   = e.remark
      formState.value.status   = e.status
    }
    function deleteData(e:any){
      _axios.post(dataUrl + "/sys-dict-type/delete", {id:e}).then((res) => {
        console.log(res)
        if (res.data.code==200){
          message.success(res.data.message)
        }else {
          message.error(res.data.message)
        }
        init()
      }).catch((err) => {
        console.log(err)
        message.error('网络异常，请稍后再试')
      })
    }

    return {
      formData,
      columns,
      hasSelected,
      ...toRefs(state), visible, formState, labelCol: {style: {width: '150px'}},
      wrapperCol: {span: 14},

      // func
      onSelectChange, init, filterTimeMonth, getClolor, changeDict, handleAdd, handleOk, update,deleteData
    };
  },
});
</script>

