/**
 * @param {*} id localStorage 都为 _seller_,id不同，需要传入商家 id
 * @param {*} key _seller_ 中 id 下的 key
 * @param {*} value _seller_ 中 id 下的 key 的 value
 */
export function _saveToLocal (id, key, value) {
  let seller = window.localStorage._seller_;
  if (!seller) { // 判断是否储存了seller,如果不存在，则设置他为空对象
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) { // 判断当前id下有没有值
      seller[id] = {};
    }
  }
  seller[id][key] = value; // 设置seller.id.key = value;
  window.localStorage._seller_ = JSON.stringify(seller);
}
/**
 * @param {*} id 根据id取 localStorage
 * @param {*} key id 下的 key
 * @param {*} def 返回的默认值
 */
export function _loadFromLocal (id, key, def) {
  let seller = window.localStorage._seller_;
  if (!seller) { // 如果不存在，则取默认值
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def; // 如果当前id下没有值，则取默认值
  }
  let ret = seller[key];
  return ret || def; // 返回取到的值或者默认值
}
