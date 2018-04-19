/**
 * @param {*} date 时间戳
 * @param {*} fmt 将要转换的格式，例 'yyyy-MM-dd hh:mm'
 */
export function _formaDate (date, fmt) {
  if (/(y+)/.test(fmt)) { // 正则判断格式中是否存在连续的 y
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); // 将匹配到的多个 y 替换为年份，substr 是为了确保y是几位，如 yyyy-MM-dd 或 yy-MM-dd,将返回不同的内容
  }
  let time = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let i in time) {
    if (new RegExp(`(${i})`).test(fmt)) { // 正则匹配是否符合条件 key
      let str = time[i] + ''; // 获取匹配到的值 value
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str)); // 判断value值是否是1位 如时间小时为1位，如果为1位则调用padLeftZero方法添加0
    }
  }
  return fmt;
};
/**
 * @param {*} str 将要匹配的字符串
 */
function padLeftZero (str) {
  return ('00' + str).substr(str.length); // 按照字符串长度截取数据，前面匹配0
}
