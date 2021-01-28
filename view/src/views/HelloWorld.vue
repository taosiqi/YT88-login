<template>
  <div align="center">
    KeyID<input name="KeyID" type="text" id="KeyID" size="20" /> UserName<input name="UserName" type="text" id="UserName" size="20" /> Password<input
      name="Password"
      type="text"
      id="Password"
      size="20"
    />
    rnd<input name="rnd" type="text" id="rnd" v-model="myrnd" /> return_EncData<input
      name="return_EncData"
      type="text"
      id="return_EncData"
      value=""
    />
    <button v-on:click="login_onclick">提交</button>
    <br />
    <br />
    IDInfo<input name="IDInfo" type="text" id="IDInfo" v-model="IDInfo" /> <br />
    <br />
    UserNameInfo<input name="UserNameInfo" type="text" id="UserNameInfo" v-model="UserNameInfo" /> <br />
    <br />
    PasswordInfo<input name="PasswordInfo" type="text" id="PasswordInfo" v-model="PasswordInfo" /> <br />
    <br />
    strDataInfo<input name="strDataInfo" type="text" id="strDataInfo" v-model="strDataInfo" /> <br />
    <br />
    EncResultInfo<input name="EncResultInfo" type="text" id="EncResultInfo" v-model="EncResultInfo" /> <br />
    <br />
    Msg<input name="Msg" type="text" id="Msg" v-model="Msg" /> <br />
    <br />
  </div>
</template>

<script>
import SoftKey3W from '../components/Syunew3W.js'
import SoftKey from '../components/SoftKey.js'

let bConnect = 0

function GetRandomNum(Min, Max) {
  const Range = Max - Min
  const Rand = Math.random()
  return (Min + Math.round(Rand * Range)).toString()
}

function myonLoad() {
  try {
    const s_pnp = new SoftKey3W()
    s_pnp.Socket_UK.onopen = function() {
      bConnect = 1 //代表已经连接，用于判断是否安装了客户端服务
    }

    //在使用事件插拨时，注意，一定不要关掉Sockey，否则无法监测事件插拨
    s_pnp.Socket_UK.onmessage = function got_packet(Msg) {
      const PnpData = JSON.parse(Msg.data)
      if (PnpData.type == 'PnpEvent') {
        //如果是插拨事件处理消息
        if (PnpData.IsIn) {
          alert('UKEY已被插入，被插入的锁的路径是：' + PnpData.DevicePath)
        } else {
          alert('UKEY已被拨出，被拨出的锁的路径是：' + PnpData.DevicePath)
        }
      }
    }

    s_pnp.Socket_UK.onclose = function() {}
  } catch (e) {
    alert(e.name + ': ' + e.message)
    return false
  }
}

const digitArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

function toHex(n) {
  let result = ''
  let start = true

  for (let i = 32; i > 0; ) {
    i -= 4
    const digit = (n >> i) & 0xf

    if (!start || digit != 0) {
      start = false
      result += digitArray[digit]
    }
  }

  return result == '' ? '0' : result
}

export default {
  data() {
    return {
      myrnd: '',
      Msg: '',
      UserName: '',
      Password: '',
      return_EncData: '',
      KeyID: '',
      myrnd: '',
      IDInfo: '',
      UserNameInfo: '',
      PasswordInfo: '',
      strDataInfo: '',
      Msg: '',
      EncResultInfo: '',
      strData: ''
    }
  },
  mounted() {
    this.myrnd = GetRandomNum(1, 65535) + GetRandomNum(1, 65535) //赋值随机数，以实现一次一密
    this.strData = this.myrnd
    myonLoad()
  },
  methods: {
    login_onclick: async function() {
      //这里使用了异步的方式，因为WEBSOCKET是异步的

      await this.mylogin_onclick(this) //这里等客户关提交结果，使用了await异步等的方式，因为WEBSOCKET是异步的

      //输出信息：
      this.IDInfo = 'UKEY的ID是：' + this.KeyID
      this.UserNameInfo = '从UKEY中获取到的用户名是：' + this.UserName
      this.PasswordInfo = '从UKEY中获取到的用户密码是：' + this.Password
      //以下是用增强算法（TEA）对随机数进行加密验证
      let Key
      //Key：即增强算法密钥，这个要与设置在加密锁中的密钥一致
      //增强算法密钥可以是每一把都不相同，也可以是都相同，如果是不相同的可以根据用户名在从数据库中获取对应的增强算法密钥，可以根据安全性及自身具体情况而定，这里使用了一个固定的值
      Key = 'A46A6B5148DF374B19384DFCAEA44E21'

      const mSoftKey = new SoftKey() //创建增强算法类
      //strData：要进行加密的数据,
      this.strDataInfo = '服务器运算的随机数是：' + this.strData
      //在服务器端对数据进行加密运算
      const m_StrEnc = mSoftKey.StrEnc(this.strData, Key) //注意， 这里不要对提交过来的随机数this.myrnd进行加密，因为提交的数据可能被非法更改

      this.EncResultInfo = '服务器运算的结果是：' + m_StrEnc
      //比较客户端加密锁返回的加密结果与服务端的加密结果是否相符，如果相符就认为是合法用户，由于使用了随机数，从而实现了一次一密的高安全性，可以用于高安全性的身份验证
      if (m_StrEnc.trim().toLocaleUpperCase == this.return_EncData.trim().toLocaleUpperCase) {
        this.Msg = '该用户是合法用户'
      } else {
        this.Msg = '该用户不是合法用户'
      }
    },
    mylogin_onclick: function(InThis: any) {
      //这里使用了异步的方式，因为WEBSOCKET是异步的
      return new Promise((resolve, reject) => {
        const that = InThis
        //判断是否安装了服务程序，如果没有安装提示用户安装
        if (bConnect == 0) {
          window.alert('未能连接服务程序，请确定服务程序是否安装。')
          return false
        }

        let DevicePath, ret, n, mylen, ID_1, ID_2, addr
        try {
          //由于是使用事件消息的方式与服务程序进行通讯，
          //好处是不用安装插件，不分系统及版本，控件也不会被拦截，同时安装服务程序后，可以立即使用，不用重启浏览器
          //不好的地方，就是但写代码会复杂一些
          const sSimnew1 = new SoftKey3W() //创建UK类

          sSimnew1.Socket_UK.onopen = function() {
            sSimnew1.ResetOrder() //这里调用ResetOrder将计数清零，这样，消息处理处就会收到0序号的消息，通过计数及序号的方式，从而生产流程
          }

          //写代码时一定要注意，每调用我们的一个UKEY函数，就会生产一个计数，即增加一个序号，较好的逻辑是一个序号的消息处理中，只调用我们一个UKEY的函数
          sSimnew1.Socket_UK.onmessage = function got_packet(Msg) {
            const UK_Data = JSON.parse(Msg.data)
            // alert(Msg.data);
            if (UK_Data.type != 'Process') return //如果不是流程处理消息，则跳过
            switch (UK_Data.order) {
              case 0:
                {
                  sSimnew1.FindPort(0) //发送命令取UK的路径
                }
                break //!!!!!重要提示，如果在调试中，发现代码不对，一定要注意，是不是少了break,这个少了是很常见的错误
              case 1:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('未发现加密锁，请插入加密锁')
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  DevicePath = UK_Data.return_value // 获得返回的UK的路径
                  sSimnew1.GetID_1(DevicePath) //发送命令取ID_1
                }
                break
              case 2:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('返回ID号错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  ID_1 = UK_Data.return_value //获得返回的UK的ID_1
                  sSimnew1.GetID_2(DevicePath) //发送命令取ID_2
                }
                break
              case 3:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('取得ID错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  ID_2 = UK_Data.return_value //获得返回的UK的ID_2

                  that.KeyID = toHex(ID_1) + toHex(ID_2)

                  sSimnew1.ContinueOrder() //为了方便阅读，这里调用了一句继续下一行的计算的命令，因为在这个消息中没有调用我们的函数，所以要调用这个
                }
                break
              case 4:
                {
                  //获取设置在锁中的用户名
                  //先从地址0读取字符串的长度,使用默认的读密码"FFFFFFFF","FFFFFFFF"
                  addr = 0
                  sSimnew1.YReadEx(addr, 1, '4F62601B', '0C385F47', DevicePath) //发送命令取UK地址0的数据
                }
                break
              case 5:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('读数据时错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  sSimnew1.GetBuf(0) //发送命令从数据缓冲区中数据
                }
                break
              case 6:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('调用GetBuf时错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  mylen = UK_Data.return_value //获得返回的数据缓冲区中数据

                  //再从地址1读取相应的长度的字符串，,使用默认的读密码"FFFFFFFF","FFFFFFFF"
                  addr = 1
                  sSimnew1.YReadString(addr, mylen, '4F62601B', '0C385F47', DevicePath) //发送命令从UK地址1中取字符串
                }
                break
              case 7:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('读取字符串时错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  console.log(UK_Data)
                  that.UserName = UK_Data.return_value //获得返回的UK地址1的字符串

                  //获到设置在锁中的用户密码,
                  //先从地址20读取字符串的长度,使用默认的读密码"FFFFFFFF","FFFFFFFF"
                  addr = 20
                  sSimnew1.YReadEx(addr, 1, '4F62601B', '0C385F47', DevicePath) //发送命令取UK地址20的数据
                }
                break
              case 8:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('读数据时错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  sSimnew1.GetBuf(0) //发送命令从数据缓冲区中数据
                }
                break
              case 9:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('调用GetBuf时错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  mylen = UK_Data.return_value //获得返回的数据缓冲区中数据

                  //再从地址21读取相应的长度的字符串，,使用默认的读密码"FFFFFFFF","FFFFFFFF"
                  addr = 21
                  sSimnew1.YReadString(addr, mylen, '4F62601B', '0C385F47', DevicePath) //发送命令从UK地址21中取字符串
                }
                break
              case 10:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('读取字符串时错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  that.Password = UK_Data.return_value //获得返回的UK中地址21的字符串

                  //这里返回对随机数的HASH结果
                  sSimnew1.EncString(that.myrnd, DevicePath) //发送命令让UK进行加密操作
                }
                break
              case 11:
                {
                  if (UK_Data.LastError != 0) {
                    window.alert('进行加密运行算时错误，错误码为：' + UK_Data.LastError.toString())
                    sSimnew1.Socket_UK.close()
                    return false
                  }
                  that.return_EncData = UK_Data.return_value //获得返回的加密后的字符串

                  //所有工作处理完成后，关掉Socket
                  sSimnew1.Socket_UK.close()
                  resolve(true)
                }
                break
            }
          }
          sSimnew1.Socket_UK.onclose = function() {}
        } catch (e) {
          alert(e.name + ': ' + e.message)
          resolve(false)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
