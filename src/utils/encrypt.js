import CryptoJS from "crypto-js"
import {getSecretKey} from "@/api/user"

export default {
  Crypto: CryptoJS,

  async encodePassword(email, password) {
    const secret = await this.getKey(email)
    const keyHex = CryptoJS.enc.Utf8.parse(secret[0])
    const iv = CryptoJS.enc.Utf8.parse(secret[1])
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.SHA256(password).toString(CryptoJS.enc.HEX), keyHex, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  },

  async getKey(email) {
    let secret
    const data = {
      email: email
    }
    await getSecretKey(data).then((res) => {
      if (res.success) {
        secret = res.data.split("-")
      }
    })

    return secret
  }
}
