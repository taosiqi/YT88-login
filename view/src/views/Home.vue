<template>
  <div class="main">
    <el-button type="primary" @click="submitLogin">登录</el-button>
    <div class="home">{{ msg }}</div>
  </div>
</template>

<script lang="ts">
import SoftKey3W from '../plugin/Syunew3W.js'
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { login, loginVerify } from '@/api/test'
import { toHex } from '../utils/utils'
interface UserInfo {
  passWord: string
  userName: string
}

export default defineComponent({
  name: 'Home',
  setup() {
    const form = reactive<UserInfo>({
      passWord: '',
      userName: ''
    })
    const submitLogin = async () => {
      const res: any = await login(form)
      randomNum.value = res.data.myriad
      await startSetup()
    }
    //设备连接状态
    const driveConnect = ref<boolean>(false)
    //设备id
    const KeyID = ref<string>('')
    //随机数
    const randomNum = ref<string>('')
    //加密后密钥
    const returnEncData = ref<string>('')
    //页面显示信息
    const msg = ref<string>('加载中')
    const timer = (second: number) => {
      return new Promise((resolve, reject) => {
        const t = setTimeout(() => {
          resolve()
          clearTimeout(t)
        }, second * 1000)
      })
    }

    const init = async () => {
      return new Promise((resolve, reject) => {
        //如果是IE10及以下浏览器，则跳过不处理
        msg.value = '开始检测设备状态'
        timer(2)
        if (navigator.userAgent.indexOf('MSIE') > 0 && navigator.userAgent.indexOf('opera') === -1) {
          msg.value = '您的浏览器不支持uKey登录'
        }
        try {
          const sPnp = new SoftKey3W()
          // 驱动 连接上了
          sPnp.Socket_UK.onopen = () => {
            driveConnect.value = true //代表已经连接，用于判断是否安装了客户端服务
            resolve(true)
            sPnp.Socket_UK.close()
          }
          // 驱动 无法连接上
          sPnp.Socket_UK.onerror = () => {
            resolve(false)
            sPnp.Socket_UK.close()
          }
        } catch (e) {
          msg.value = e.name + ': ' + e.message
          return false
        }
      })
    }

    const startSetup = async () => {
      await timer(2) //避免过程太快
      const result = await init()
      if (!result) {
        return false
      }
      //设备路径
      let DevicePath: string
      //合并解析后拿到uKey设备id
      let ID_1: number, ID_2: number
      try {
        const softKey = new SoftKey3W()
        softKey.Socket_UK.onopen = function() {
          softKey.ResetOrder()
        }
        softKey.Socket_UK.onmessage = async (Msg: any) => {
          const UKData = JSON.parse(Msg.data)
          if (UKData.type != 'Process') return
          switch (UKData.order) {
            case 0:
              {
                //查找第一个加密锁
                await timer(2) //避免过程太快
                softKey.FindPort(0)
              }
              break
            case 1:
              {
                await timer(2) //避免过程太快
                if (UKData.LastError != 0) {
                  msg.value = '未发现加密锁，请插入加密锁'
                  softKey.Socket_UK.close()
                  return false
                }
                DevicePath = UKData.return_value // 获得返回的UK的路径
                msg.value = 'UK的路径:' + DevicePath
                softKey.GetID_1(DevicePath) //发送命令取ID_1
              }
              break
            case 2:
              {
                await timer(2) //避免过程太快

                if (UKData.LastError != 0) {
                  msg.value = '返回ID号错误，错误码为：' + UKData.LastError.toString()
                  softKey.Socket_UK.close()
                  return false
                }
                ID_1 = UKData.return_value //获得返回的UK的ID_1
                msg.value = 'ID_1：' + ID_1
                softKey.GetID_2(DevicePath) //发送命令取ID_2
              }
              break
            case 3:
              {
                await timer(2) //避免过程太快
                if (UKData.LastError != 0) {
                  msg.value = '返回ID号错误，错误码为：' + UKData.LastError.toString()
                  window.alert('取得ID错误，错误码为：' + UKData.LastError.toString())
                  softKey.Socket_UK.close()
                  return false
                }
                ID_2 = UKData.return_value //获得返回的UK的ID_2
                msg.value = 'ID_2：' + ID_2
                KeyID.value = toHex(ID_1) + toHex(ID_2)
                msg.value = 'KeyID：' + KeyID.value
                softKey.ContinueOrder()
              }
              break
            case 4:
              {
                await timer(2) //避免过程太快

                if (UKData.LastError != 0) {
                  msg.value = '读取字符串时错误，错误码为：' + UKData.LastError.toString()
                  softKey.Socket_UK.close()
                  return false
                }
                //这里返回对随机数的HASH结果
                softKey.EncString(randomNum.value, DevicePath)
              }
              break
            case 5:
              {
                await timer(2) //避免过程太快
                if (UKData.LastError != 0) {
                  msg.value = '进行加密运行算时错误，错误码为：' + UKData.LastError.toString()
                  softKey.Socket_UK.close()
                  return false
                }
                returnEncData.value = UKData.return_value
                msg.value = '123456加密之后的结果：' + returnEncData.value
                await loginVerify({
                  returnEncData: returnEncData.value,
                  KeyID: KeyID.value
                })
                softKey.Socket_UK.close()
              }
              break
          }
        }
        softKey.Socket_UK.onclose = function() {}
      } catch (e) {
        alert(e.name + ': ' + e.message)
        return false
      }
    }
    return {
      init,
      startSetup,
      msg,
      timer,
      driveConnect,
      KeyID,
      returnEncData,
      form,
      submitLogin,
      randomNum
    }
  },
  methods: {}
})
</script>

<style scoped>
.main {
  width: 250px;
  margin: 100px auto;
}
</style>
