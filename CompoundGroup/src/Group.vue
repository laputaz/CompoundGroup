<template>
  <!-- 两种形式 : 1. 单选or多选选项(属性值),  2 freetext,不带勾选, 后续可能混杂 -->
  <div class="compound-select">
    <!-- 多选 -->
    <component :is="`${component}-group`" v-model="checkList" :max="max">
      <transition-group name="list">
        <slot :multi="multi" />
        <!-- 添加 -->
        <CompoundOption
          v-if="isAdding"
          key="compound-select-add-new"
          type="add"
          @confirm-add="confirmAdd"
          @cancel-add="isAdding = false"
        />
      </transition-group>
    </component>
    <p v-if="leftTimes > 0" class="compound-select__add-new" @click="addNew">
      {{ `+ Add New (${leftTimes} times left)` }}
    </p>
  </div>
</template>

<script>
import componentMixin from "../mixins";
import CompoundOption from "./Option";

export default {
  name: "CompoundGroup",
  // 勿删, 事件判断需要该名称
  componentName: "CompoundGroup",
  components: { CompoundOption },
  mixins: [componentMixin],
  props: {
    // 选中值
    value: {
      type: [Array],
      default: () => {}
    },
    // 配置
    options: {
      type: Object,
      default: () => {}
    },
    // 必填
    required: {
      type: Boolean,
      default: () => {}
    },
    // 最大勾选数量
    max: {
      type: Number,
      default: 1000
    },
    // 允许添加次数, 0, 不允许添加
    addTimes: {
      type: Number,
      default: 0
    },
    // 是否多选
    multi: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 剩余可添加次数
      leftTimes: this.addTimes,
      // 正在添加
      isAdding: false
    };
  },
  computed: {
    // 勾选项
    checkList: {
      get() {
        return this.multi ? this.value : this.value[0];
      },
      set(value) {
        this.$emit("input", this.multi ? value : [value]);
      }
    }
  },
  created() {},
  methods: {
    // 编辑
    addNew() {
      this.isAdding = true;
    },
    // 确认添加
    confirmAdd(value) {
      // 添加完需要执行回调以告知已添加
      this.$emit("add", value, () => {
        this.leftTimes--;
      });
      this.isAdding = false;
    }
  }
};
</script>

<style lang="scss">
$borderColor: #d0e6fe;
// 整体group
.compound-select {
  .el-radio-group,
  .el-checkbox-group {
    width: 100%;
  }
  &__add-new {
    color: #0f79fb;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.2s;
    &:hover {
      color: lighten(#0f79fb, 10%);
    }
  }
}
// animation
.list-enter-active {
  transition: all 0.3s;
}
/** 移除过程 **/
.list-leave-active {
  transition: all 0.3s;
}
/*** 开始插入、移除结束的位置变化 ***/
.list-enter,
.list-leave-to {
  max-height: 0;
  margin-bottom: 0;
  padding: 0 15px;
  // padding: 0;
  opacity: 0;
  transform: translateY(20px);
}
</style>
