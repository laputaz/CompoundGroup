import { baseComTypeMap, isDecimal, isInteger } from "./const";

// 获取变量对饮的值
const getBaseValue = (op = {}, data = {}) => {
  switch (op.comtype) {
    case "select":
      return data.values ? data.values[0].id : "";
    case "multiselect":
      return data.values ? data.values.map(v => v.id) : [];
    case "date":
    case "datetime":
      return data.values ? new Date(+data.values[0].value) : "";
    case "input":
      return data.values ? data.values[0].value : "";
    case "link":
      return data.values ? data.values[0].value : "[]()";
    default:
      return "";
  }
};

// 基础组件生成model
const generatorModel = (variables = {}, valueMaps = {}) => {
  let model = {};
  for (let key in variables) {
    if (variables[key].type === 1) {
      let validation = JSON.parse(variables[key].validation);
      validation.select_max > 1 && (variables[key].type = 6);
    }
    // 判断基础组件类型
    variables[key].comtype = baseComTypeMap[variables[key].type];
    // 获取基础组件数据
    model[key] = getBaseValue(variables[key], valueMaps[key] || {});
  }
  return model;
};

// 生成校验规则
const generatorRules = (variables = {}) => {
  let rules = {};
  for (let key in variables) {
    rules[key] = [];
    if (variables[key].required) {
      rules[key].push({ required: true, message: `${key} can't be empty` });
    }
    // 下拉框
    if (variables[key].type === 1) {
      let selectLimit = 1;
      try {
        let obj = JSON.parse(variables[key].validation);
        selectLimit = obj.select_max;
      } catch (e) {
        console.log(e);
      }
      if (selectLimit > 1) {
        rules[key].push({
          trigger: "blur,change",
          validator(rule, value, callback) {
            return value.length <= selectLimit
              ? callback()
              : callback(new Error("max limit"));
          }
        });
      }
      // 输入框
    } else if (variables[key].type === 2) {
      let inputType = "int";
      try {
        let obj = JSON.parse(variables[key].validation);
        inputType = obj.input_type;
      } catch (e) {
        console.log(e);
      }
      if (inputType === "int") {
        rules[key].push({
          trigger: "blur,change",
          validator(rule, value, callback) {
            return isInteger(value) ? callback() : callback("not integer");
          }
        });
      } else {
        rules[key].push({
          trigger: "blur,change",
          validator(rule, value, callback) {
            return isDecimal(value) ? callback() : callback("not decimal");
          }
        });
      }
    }
  }
  return rules;
};

// 生成列表
const generatorList = (uilist = [], datalist = [], isAllFreetext = false) => {
  let handleList = uilist || [];
  if (isAllFreetext) {
    handleList = uilist.concat(datalist);
  }
  return handleList.map(v => {
    // 生成唯一标识
    !v.mark && (v.mark = _.uniqueId("mark_"));
    // 根据找到对应的数据
    let data = datalist.find(item => item.id === v.id) || {};
    // 数据是freetext那么该条记录是 free_text
    (data.is_free_text || isAllFreetext) && (v.type = 0);
    // type 2 为template
    if (v.type === 2) {
      // 生成 model
      v.rules = generatorRules(v.variable_map);
      v.model = generatorModel(v.variable_map, data.variable_map);
      v.dataMap = _.cloneDeep(data.variable_map);
      v.rows = Object.entries(v.variable_map).map(v => {
        v[1].key = v[0];
        return v[1];
      });
      // freetext 展示的不是ui接口拿到的数据, 而是, 数据接口拿到的数据
    } else if (v.type === 0) {
      // 根据找到对应的数据, 非新建的freetext从数据接口拿数据, 否则是手动填写的
      if (!v.create) {
        v.value = data.value;
      }
    }
    return { ...v };
  });
};

export { generatorList };
