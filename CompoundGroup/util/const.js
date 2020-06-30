// 基础组件类型
const baseComTypeMap = {
  1: "select",
  2: "input",
  3: "link",
  4: "date",
  5: "datetime",
  6: "multiselect"
};

// 选项类型
const optionTypeMap = {
  1: "text",
  2: "template",
  0: "freetext"
};
// 浮点数
const isDecimal = val =>
  val &&
  String(val).includes(".") &&
  isInteger(String(val).split(".")[0]) &&
  isInteger(String(val).split(".")[1]);
// 整数
const isInteger = val => /^\d+$/g.test(val);

export { optionTypeMap, baseComTypeMap, isDecimal, isInteger };
