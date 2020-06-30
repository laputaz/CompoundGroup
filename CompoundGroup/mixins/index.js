export default {
  computed: {
    // 组件标签
    component() {
      return this.multi ? "el-checkbox" : "el-radio";
    }
  },
  methods: {
    // 找到指定的父级进行emit
    dispatch(componentName, eventName, params) {
      let parent = this || this.$root;
      let name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.call(parent, eventName, params);
      }
    }
  }
};
