<template>
  <div class="outer">
    <transition name="fade">
      <div
        v-if="showError"
        class="error-message"
      >
        {{ validateMessage }}
      </div>
    </transition>
    <p class="header">
      <span class="header__text">{{ options.name || "Others" }}</span>
      <i
        class="header__btn el-icon-document"
        @click="copyTitle"
      />
    </p>
    <p>{{ `Select Limit - ${options.select_limit}` }}</p>
    <CompoundGroup
      ref="group"
      v-model="checkList"
      :required="options.required"
      :max="options.select_limit"
      :multi="isMulti"
      :add-times="options.freetext_limit"
      #default="{multi}"
      @add="addItem"
      @remove="removeItem"
      @copy="copyItem"
    >
      <CompoundOption
        v-for="(op, i) in list"
        :key="i"
        :multi="multi"
        :label="op.mark"
        :option="op"
        :copy-times="op.dup_limit"
        :type="optionTypeMap[op.type]"
      >
        <Compose
          ref="composes"
          :model.sync="op.model"
          :rows="op.rows"
          :rules="op.rules"
          :disabled="isTemplateDisabled(op)"
        />
      </CompoundOption>
    </CompoundGroup>
  </div>
</template>

<script>
import { CompoundGroup, CompoundOption, Compose } from "../index";
import { generatorList } from "../util/generatorUIData";
import { generatorPostData } from "../util/generatorPostData";
import { optionTypeMap } from "../util/const";

export default {
  components: { CompoundGroup, CompoundOption, Compose },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      optionTypeMap,
      checkList: [],
      showError: false,
      validateMessage: ""
    };
  },
  computed: {
    // isAllFreetext
    isAllFreetext() {
      return (
        !this.options.attr_value_list.length && this.options.freetext_limit > 0
      );
    },
    // 展示
    list: {
      get() {
        return generatorList(
          this.options.attr_value_list,
          this.data.attr_values,
          this.isAllFreetext
        );
      },
      set(val) {
        console.log("------------set");
      }
    },
    // 多选
    isMulti() {
      return this.options.select_limit > 1;
    }
  },
  created() {
    if (!this.data.attr_values) {
      this.checkList = [];
      return;
    }
    let checks = this.data.attr_values.map(v => v.id);
    let marks = this.list
      .filter(v => {
        return checks.includes(v.id) && v.type !== 0;
      })
      .map(v => v.mark);
    if (!marks.length) {
      this.checkList = [];
    }
    this.checkList = this.isMulti ? marks : [marks[0]];
  },
  methods: {
    // Template 是否允许编辑, 未勾选该选项, 则该template不用编辑
    isTemplateDisabled(op) {
      return !this.checkList.includes(op.mark);
    },
    // 新增
    addItem(value, callback) {
      console.log("-----add");
      console.log(value);
      callback();
      this.list.push({
        create: true,
        is_free_text: true,
        id: 100, // 属性值ID,
        type: 0, // 属性值类型：1-text、2-template,
        mark: _.uniqueId("mark_"),
        value
      });
    },
    // 删除
    removeItem(option) {
      console.log("----delete");
      console.log(option);
      let index = -1;
      this.list.find((v, i) => {
        if (v.mark === option.mark) {
          index = i;
          return true;
        }
      });
      this.list.splice(index, 1);
      this.$refs.group.$forceUpdate();
    },
    // 复制属性值(选项)
    copyItem(option) {
      console.log("----copy");
      console.log(option);
      let op = { ...option };
      op.mark = _.uniqueId("mark_");
      let index = -1;
      op.value = option.value;
      op.dup_limit = 0;
      this.list.find((v, i) => {
        if (v.mark === option.mark) {
          index = i;
          return true;
        }
      });
      this.list.splice(index + 1, 0, op);
      this.$refs.group.$forceUpdate();
    },
    // 获取数据
    async getData() {
      let composes = this.$refs.composes.filter(v => !v.disabled);
      console.log(this.$refs.composes);
      let valid = true;
      let err = "";
      try {
        for (let key in composes) {
          await composes[key].validate();
        }
      } catch (e) {
        err = e;
        this.validateMessage = e;
        valid = false;
      }
      // 校验失败
      if (!valid) {
        this.showValidateMessage(5000);
        return {
          message: err,
          data: [],
          error: true
        };
      }
      let arr = this.list.filter(
        v => this.checkList.includes(v.mark) || v.type === 0
      );
      return { message: "success", data: generatorPostData(arr) };
    },
    // 复制属性项
    copyTitle() {
      this.$emit("copy");
    },
    // 展示错误信息
    showValidateMessage(seconds) {
      this.showError = true;
      setTimeout(_ => {
        this.showError = false;
      }, seconds);
    }
  }
};
</script>
<style lang="scss" scoped>
$headerHeight: 40px;
$copyBtnColor: #4d99f7;
.outer {
  position: relative;
  // width: 600px;
  width: 100%;
  .error-message {
    position: absolute;
    width: 300px;
    line-height: 30px;
    backdrop-filter: blur(5px);
    text-align: center;
    background-color: #e445458a;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    border-radius: 3px;
  }
  .header {
    font-size: 16px;
    display: flex;
    &__text {
      width: 100%;
      line-height: $headerHeight;
    }
    &__btn {
      cursor: pointer;
      line-height: $headerHeight;
      color: $copyBtnColor;
      &:hover {
        color: lighten($copyBtnColor, 10%);
      }
    }
  }
}
</style>
