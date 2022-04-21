/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function checkEmail(str) {
  return /\w+@[a-z0-9]+\.[a-z]+/i.test(str)
}

export function checkPassWord(str) {
  if (str.length <= 0) {
    return false
  } else if (str.length < 8) {
    return false
  } else {
    let modes = 0
    // 正则表达式验证符合要求的
    // 数字
    if (/\d/.test(str)) {
      modes++
    }
    // 小写
    if (/[a-z]/.test(str)) {
      modes++
    }
    // 大写
    if (/[A-Z]/.test(str)) {
      modes++
    }
    // 特殊字符
    if (/\W/.test(str)) {
      modes++
    }
    return modes > 2;
  }
}

export function checkConfirmPassword(str1, str2) {
  return str1 === str2;
}

export function checkPhone(str) {
  return /^1[3456789]\d{9}$/.test(str)
}

export function checkIdCard(str) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)
}

export function checkBankCard(str) {
  return /^(\d{16}|\d{19})$/.test(str)
}
