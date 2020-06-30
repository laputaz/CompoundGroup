<template>
  <div class="compose">
    <!-- <p>{{ curOption.value }}</p> -->
    <el-form :model="modelData" ref="form" :rules="comRules">
      <el-form-item v-for="row of rows" :key="row.key" :prop="row.key">
        <!-- 输入框 -->
        <el-input
          v-if="row.comtype === 'input'"
          :disabled="disabled"
          v-model="modelData[row.key]"
          :placeholder="`Please input [${row.key}]`"
        />
        <!-- 下拉单选 -->
        <el-select
          v-if="row.comtype === 'select'"
          :disabled="disabled"
          v-model="modelData[row.key]"
          clearable
          :multiple="isMulti(key)"
          :placeholder="`Please select [${row.key}]`"
        >
          <el-option
            v-for="item in row[1].values"
            :key="item.value"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
        <!-- 下拉多选 -->
        <el-select
          v-if="row.comtype === 'multiselect'"
          :disabled="disabled"
          v-model="modelData[row.key]"
          clearable
          collapse-tags
          multiple
          :placeholder="`Please select [${row.key}]`"
        >
          <el-option
            v-for="item in row.values"
            :key="item.value"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
        <!-- 日期 -->
        <el-date-picker
          v-if="row.comtype === 'date'"
          :disabled="disabled"
          v-model="modelData[row.key]"
          type="date"
          :placeholder="`Please select [${row.key}]`"
        />
        <!-- 时间 -->
        <el-date-picker
          v-if="row.comtype === 'datetime'"
          :disabled="disabled"
          v-model="modelData[row.key]"
          type="datetime"
          :placeholder="`Please select [${row.key}]`"
        />
        <!-- 链接 -->
        <Link
          v-if="row.comtype === 'link'"
          :disabled="disabled"
          v-model="modelData[row.key]"
          :placeholder-name="`Please input linkName for [${row.key}]`"
          :placeholder-url="`Please input URL for [${row.key}]`"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Link from "./Link";

export default {
  components: { Link },
  props: {
    // 数据
    model: {
      type: Object,
      default: () => {}
    },
    // 配置
    rows: {
      type: Array,
      default: () => []
    },
    // 校验
    rules: {
      type: Object,
      default: () => {}
    },
    // disabled
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modelData: {}
    };
  },
  computed: {
    // 清空规则
    comRules() {
      let rules = _.cloneDeep(this.rules);
      if (this.disabled) {
        // 清空校验规则, 错误信息以及重置初始值
        this.$refs.form && this.$refs.form.resetFields();
        for (let key in rules) {
          rules[key] = [];
        }
        return rules;
      }
      return this.rules;
    }
  },
  watch: {
    modelData: {
      deep: true,
      handler(next, old) {
        this.$emit("update:model", next);
      }
    }
  },
  created() {
    this.modelData = { ...this.model };
  },
  methods: {
    async validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid =>
          valid ? resolve() : reject("Verification failed")
        );
      });
    }
  }
};
</script>

<style lang="scss">
.compose {
  .el-form {
    margin-bottom: 20px;
    .el-form-item {
      margin-bottom: 8px;
    }
    .el-select,
    .el-input {
      max-width: 400px;
      margin-top: 10px;
      display: block;
    }
  }
}
.el-loading-mask.is-fullscreen {
  display: none;
}
</style>
