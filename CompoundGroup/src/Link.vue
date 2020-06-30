<template>
  <div>
    <el-input
      v-model="linkName"
      :placeholder="placeholderName"
      :disabled="disabled"
    />
    <el-input
      v-model="linkUrl"
      :placeholder="placeholderUrl"
      :disabled="disabled"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "[]()"
    },
    placeholderName: {
      type: String,
      default: ""
    },
    placeholderUrl: {
      type: String,
      default: ""
    },
    // disabled
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    linkName: {
      get() {
        return this.value ? this.value.split("]")[0].replace("[", "") : "";
      },
      set(val) {
        if (!val && !this.linkUrl) {
          this.$emit("input", "");
          return;
        }
        this.$emit("input", `[${val}](${this.linkUrl})`);
      }
    },
    linkUrl: {
      get() {
        return this.value ? this.value.split("(")[1].replace(")", "") : "";
      },
      set(val) {
        if (!val && !this.linkName) {
          this.$emit("input", "");
          return;
        }
        this.$emit("input", `[${this.linkName}](${val})`);
      }
    }
  }
};
</script>

<style></style>
