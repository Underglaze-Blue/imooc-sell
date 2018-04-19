/**
 * 解析 url 参数
 * @example ?id=123456
 * @return {id:123456}
 */

export function _urlParse () {
  let url = window.location.search; // 获取url参数
  let obj = {};
  /**
   * [?&] 匹配包含？&
   * [^?&] 匹配不包含？&
   * 以下正则为 匹配以 ? 或 & 开头，后不包含这两个，并且有=连接，结尾中没有? 或 &的值
   */
  let reg = /[?&][^?&]+=[^?&]+/g; // 全局匹配包含的字符
  // 存放匹配结果的数组。该数组的内容依赖于 regexp 是否具有全局标志 g。
  let arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('='); // substring 去除匹配到的元素前面的 ? 或 =,以=分割为一个新数组
      let key = decodeURIComponent(tempArr[0]); // 拿到参数 key 值
      let value = decodeURIComponent(tempArr[1]);// 拿到参数 value 值
      obj[key] = value; // 对象赋值
    });
  }
  return obj;
}
