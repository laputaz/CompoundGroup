<template>
  <component
    :is="component"
    class="compound-option"
    :class="{ [`is-${type}`]: true }"
    :label="label"
    :disabled="isFreetext"
  >
    <!-- text -->
    <div class="compound-option__content">
      <p v-if="!isAdd">{{ option.value }}</p>
      <slot v-if="isTemplate">Template Here</slot>
      <el-input
        v-else-if="isAdd"
        v-model="addValue"
        @keyup.enter.native="confirmAdd"
      />
    </div>
    <!-- icons -->
    <div class="compound-option__icons" v-if="!isAdd">
      <el-tooltip content="Duplicate" placement="top">
        <i
          v-if="isText && leftCopyTimes"
          class="el-icon-document"
          @click.stop.prevent="copyItem"
        />
      </el-tooltip>
      <el-tooltip content="Delete" placement="top">
        <el-popover
          v-if="isFreetext"
          placement="top"
          width="160"
          trigger="click"
        >
          <p>Are you sure to delete thiss content ?</p>
          <div style="text-align: right; margin: 0">
            <el-button type="primary" size="mini" @click="removeItem"
              >确定</el-button
            >
          </div>
          <el-button
            class="el-icon-delete2"
            type="text"
            slot="reference"
          ></el-button>
        </el-popover>
      </el-tooltip>
    </div>
    <!-- 添加时的保存按钮 -->
    <div v-if="isAdd" class="compound-option__btns">
      <el-button
        type="primary"
        :disabled="!addValue"
        @click.stop.prevent="confirmAdd"
        >保存</el-button
      >
      <el-button @click.stop.prevent="cancelAdd">取消</el-button>
    </div>
  </component>
</template>

<script>
/**
 * 属性值 - 即单选 or 多选选项
 * 当前属性值只可以复制, 不可以删除 or 编辑
 */
import Compose from "./Compose";
import componentMixin from "../mixins";

export default {
  name: "CompoundOption",
  components: { Compose },
  componentName: "CompoundOption",
  mixins: [componentMixin],
  props: {
    // 类型, 三种
    type: {
      type: String,
      default: "text" // freetext or text or template or add
    },
    // 复杂类型配置
    option: {
      type: Object,
      default: () => {}
    },
    // 多选 or 单选
    multi: {
      type: Boolean,
      default: false
    },
    // 值
    label: {
      type: [String, Number],
      default: () => {}
    },
    // 复制次数
    copyTimes: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      addValue: "",
      leftCopyTimes: this.copyTimes
    };
  },
  computed: {
    // add
    isAdd() {
      return this.type === "add";
    },
    // template or text
    isText() {
      return this.type === "text";
    },
    // isFreetext
    isFreetext() {
      return this.type === "freetext";
    },
    // isTemplate
    isTemplate() {
      return this.type === "template";
    }
  },
  created() {},
  methods: {
    // 拷贝
    copyItem() {
      this.dispatch("CompoundGroup", "copy", this.option);
      this.leftCopyTimes--;
    },
    // 删除
    removeItem() {
      this.dispatch("CompoundGroup", "remove", this.option);
    },
    // 确认添加
    confirmAdd() {
      this.$emit("confirm-add", this.addValue);
    },
    // 取消添加
    cancelAdd() {
      this.$emit("cancel-add");
    }
  }
};
</script>

<style lang="scss">
// 选项边框
$optionBorderColor: #d0e6fe;
// 内容lineheight
$contentHeight: 25px;
// 操作按钮宽度
$handlerBtnWidth: 60px;
// 操作按钮颜色
$handlerBtnColor: #107afbb7;

// 外层
.compound-option {
  display: block;
  padding: 15px 0 15px 15px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid $optionBorderColor;
  transition: all 0.2s;
  max-height: 1000px;
  &:hover {
    border-color: darken($optionBorderColor, 10%);
    box-shadow: 0px 0px 6px 0px rgba(148, 191, 255, 0.41);
  }
  // 勾选框
  .el-radio__input,
  .el-checkbox__input {
    vertical-align: middle;
    margin-right: 10px;
  }
  // 内容
  .el-radio__label,
  .el-checkbox__label {
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    width: calc(99% - 28px);
    font-weight: 400;
    font-size: 13px;
  }

  // freetext和添加时候的样式
  &.is-freetext,
  &.is-add {
    .el-radio__input,
    .el-checkbox__input {
      display: none;
    }
    .el-radio__label,
    .el-checkbox__label {
      width: 100%;
    }
    .el-radio__input.is-disabled + .el-radio__label {
      color: inherit;
      cursor: inherit;
      user-select: text;
    }
    .el-checkbox__input.is-disabled + .el-checkbox__label {
      color: inherit;
      cursor: inherit;
      user-select: text;
    }
  }
  // 添加输入框撑满
  &.is-add {
    padding: 15px;
    .compound-option__content {
      width: 100%;
    }
  }

  //  ?Template图标不居中, 居上显示
  &.is-template {
    .el-radio__input,
    .el-checkbox__input,
    .compound-option__icons {
      margin-top: 6px;
      vertical-align: top;
    }
  }

  // 文字
  &__content {
    // 内容
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - #{$handlerBtnWidth});
    p {
      line-height: $contentHeight;
      min-height: $contentHeight;
      white-space: normal;
      word-break: break-all;
      margin: 0;
    }
  }

  // 操作按钮样式
  &__icons {
    display: inline-block;
    vertical-align: middle;
    width: $handlerBtnWidth;
    opacity: 0;
    text-align: center;
    position: relative;
    left: 3px;
    transition: all 0.2s;
    color: $handlerBtnColor;
    cursor: pointer;
    font-size: 15px;
    font-weight: 400;
  }
  // 覆盖
  &:hover {
    .compound-option__icons {
      opacity: 1;
      left: 0;
      transition: all 0.3s;
      & > i:hover {
        cursor: pointer;
        color: lighten($handlerBtnColor, 10%);
      }
      & > i.el-icon-delete {
        &:hover {
          color: rgba(255, 0, 0, 0.555);
        }
      }
    }
  }
  // 保存按钮
  &__btns {
    margin-top: 10px;
    float: right;
  }
}
</style>
