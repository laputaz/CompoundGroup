// 根据选中值和选项生成指定格式
const getVariableValue = (
  value = "",
  option = {},
  key,
  dataOption = { values: [] }
) => {
  let obj = {
    attr_item_id: dataOption.attr_item_id,
    key
  };
  switch (option.comtype) {
    case "select":
      obj.values = [
        {
          id: option.values[0].id
        }
      ];
      break;
    case "multiselect":
      // 根据id 找到选中的项, 并排序
      obj.values = value.map(v => option.values.find(item => item.id === v));
      obj.values.forEach((v, i) => (v.order = i + 1));
      break;
    case "date":
    case "datetime":
      obj.values = [
        {
          value: +value
        }
      ];
      break;
    case "input":
      // 是否新建
      if (!dataOption.values[0]) {
        obj.values = [
          {
            create: true,
            id: 0,
            value: value
          }
        ];
      } else {
        obj.values = [
          {
            id: dataOption.values[0].id
          }
        ];
      }
      break;
    case "link":
      obj.values = [
        {
          value
        }
      ];
      break;
    default:
      break;
  }
  return obj;
};

// 根据选中值生成接口需要的格式
const transformVariableData = (variables = {}, model = {}, dataMap = {}) => {
  let obj = {};
  for (let key in model) {
    if (model[key]) {
      obj[key] = getVariableValue(
        model[key],
        variables[key],
        key,
        dataMap[key]
      );
    }
  }
  return obj;
};

// 获取生成的数据
const generatorPostData = (list = []) => {
  let arr = list.map(v => {
    let obj = _.cloneDeep(v);
    if (v.create) {
      delete obj.id;
    } else {
      delete obj.value;
    }
    delete obj.mark;
    delete obj.dup_limit;
    // template
    if (v.type === 2) {
      obj.variable_map = transformVariableData(
        obj.variable_map,
        obj.model,
        obj.dataMap
      );
    }
    delete obj.rules;
    delete obj.model;
    delete obj.dataMap;
    delete obj.rows;
    return obj;
  });
  return arr;
};

export { generatorPostData };
