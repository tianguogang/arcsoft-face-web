<template>
  <div>
    <div style="display: flex; ">
      <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">新增字典数据</a-button>
      <a-select
          v-model:value="dictData.dictType"
          show-search
          allowClear
          placeholder="请选择主任务"
          style=" width: 150px;margin-left: 10px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="options"
          @change="handleChange"
      ></a-select>


    </div>
    <a-table
        rowKey="dictCode"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="formData"
    >
      <template #bodyCell="{ column, record ,index}">

        <template v-if="column.dataIndex === 'createTime'">

          <span>{{ filterTimeMonth(record.createTime) }} </span>

        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="getClolor(record.status)">{{ record.status == 0 ? '启用' : '停用' }}</a-tag>
        </template>

        <template v-if="column.key === 'action'">
        <span>
           <a @click="update(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="deleteData(record.dictCode)">删除</a>
        </span>
        </template>

      </template>
    </a-table>
  </div>
  <a-modal v-model:visible="visible" title="新增字典类型" @ok="handleOk">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="字典类型" :rules="[{ required: true, message: '请输入字典类型' }]">
        <a-select
            v-model:value="formState.dictType"
            show-search
            allowClear
            placeholder="请选择字典类型"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="options" disabled
        ></a-select>
      </a-form-item>
      <a-form-item label="字典标签" :rules="[{ required: true, message: '请输入字典标签' }]">
        <a-input v-model:value="formState.dictLabel"/>
      </a-form-item>
      <a-form-item label="字典键值" :rules="[{ required: true, message: '请输入字典键值' }]">
        <a-input v-model:value="formState.dictValue"/>
      </a-form-item>
      <a-form-item label="显示排序" :rules="[{ required: true, message: '请输入显示排序' }]">
        <a-input-number v-model:value="formState.dictSort"/>
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
import moment from "moment";
import {message} from "ant-design-vue";

type Key = string | number;

interface DataType {
  key: Key;
  name: string;
  age: number;
  address: string;
}

const columns = [
  {
    title: '字典编码',
    dataIndex: 'dictCode',
  },
  {
    title: '字典标签',
    dataIndex: 'dictLabel',
  },
  {
    title: '字典键值',
    dataIndex: 'dictValue',
  },
  {
    title: '字典排序',
    dataIndex: 'dictSort',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
  }, {
    title: '操作',
    key: 'action',
  },
];

const formData = ref()
const dictData = ref({})

export default defineComponent({
  setup() {
    const visible = ref<boolean>(false);
    const options = ref()
    const formState = ref({
      dictCode: '',
      dictType: '',
      dictLabel: '',
      dictValue: '',
      dictSort: '99',
      status: '0',
      remark: '',
    })
    const state = reactive<{
      selectedRowKeys: Key[];
      loading: boolean;
    }>({
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    });
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);

    const start = () => {
      state.loading = true;
      // ajax request after empty completing
      setTimeout(() => {
        state.loading = false;
        state.selectedRowKeys = [];
      }, 1000);
    };
    const onSelectChange = (selectedRowKeys: Key[]) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };

    onMounted(() => {
      init()
    })

    function init() {
      formState.value.dictType = localStorage.getItem("dict_type")||''
      _axios.post(dataUrl + "/sys-dict-data/get", {
        id: localStorage.getItem("dict_type")||''
      }).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          formData.value = res.data.data
          options.value = res.data.options
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

    const handleChange = (val: string) => {
      if (val != null) {
        init()
      }
      console.log(val)
    };
    // 确认新增
    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
      _axios.post(dataUrl + "/sys-dict-data/save", formState.value).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }
        init()
      }).catch((err) => {
        console.log(err)
        message.error('网络异常，请稍后再试')
      })
    };

    function update(e: any) {
      console.log(e)
      visible.value = true;

      formState.value.dictCode = e.dictCode
      formState.value.dictType = e.dictType
      formState.value.dictLabel = e.dictLabel
      formState.value.dictValue = e.dictValue
      formState.value.dictSort = e.dictSort
      formState.value.status = e.status
      formState.value.remark = e.remark
    }

    function deleteData(e: any) {
      _axios.post(dataUrl + "/sys-dict-data/delete", {id: e}).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }
        init()
      }).catch((err) => {
        console.log(err)
        message.error('网络异常，请稍后再试')
      })
    }

    function handleAdd() {
      visible.value = true
      formState.value.dictCode = ''
      formState.value.dictType = localStorage.getItem("dict_type")||''
      formState.value.dictLabel = ''
      formState.value.dictValue = ''
      formState.value.dictSort = '99'
      formState.value.status = '0'
      formState.value.remark = ''
    }

    return {
      dictData,
      formData,
      columns,
      hasSelected,
      ...toRefs(state), options, visible, formState, labelCol: {style: {width: '150px'}},
      wrapperCol: {span: 14},

      // func
      start,
      onSelectChange, init, filterTimeMonth, getClolor, handleChange, update, handleOk, deleteData, handleAdd
    };
  },
});
</script>

