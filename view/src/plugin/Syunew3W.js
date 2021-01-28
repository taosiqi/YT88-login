/* eslint-disable */
export default class SoftKey3W {
  static Socket_UK
  constructor() {
    const isIE11 = navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf('rv:11.0') > -1
    const isEDGE = navigator.userAgent.indexOf('Edge') > -1
    const u = document.URL
    let url
    if (u.substring(0, 5) == 'https') {
      if (isIE11 || isEDGE) {
        if (isIE11) url = 'wss://127.0.0.1:4006/xxx'
        else url = 'ws://127.0.0.1:4006/xxx'
      } else {
        url = 'ws://localhost:4006/xxx'
      }
    } else {
      url = 'ws://127.0.0.1:4006/xxx'
    }

    if (typeof MozWebSocket != 'undefined') {
      this.Socket_UK = new MozWebSocket(url, 'usbkey-protocol')
    } else {
      this.Socket_UK = new WebSocket(url, 'usbkey-protocol')
    }
  }

  FindPort = function(start) {
    const msg = {
      FunName: 'FindPort',
      start: start
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  FindPort_2 = function(start, in_data, verf_data) {
    const msg = {
      FunName: 'FindPort_2',
      start: start,
      in_data: in_data,
      verf_data: verf_data
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  FindPort_3 = function(start, in_data, verf_data) {
    const msg = {
      FunName: 'FindPort_3',
      start: start,
      in_data: in_data,
      verf_data: verf_data
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetVersion = function(Path) {
    const msg = {
      FunName: 'GetVersion',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetVersionEx = function(Path) {
    const msg = {
      FunName: 'GetVersionEx',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetID_1 = function(Path) {
    const msg = {
      FunName: 'GetID_1',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetID_2 = function(Path) {
    const msg = {
      FunName: 'GetID_2',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  sRead = function(Path) {
    const msg = {
      FunName: 'sRead',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  sWrite = function(InData, Path) {
    const msg = {
      FunName: 'sWrite',
      InData: InData,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  sWrite_2 = function(InData, Path) {
    const msg = {
      FunName: 'sWrite_2',
      InData: InData,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  sWrite_2Ex = function(InData, Path) {
    const msg = {
      FunName: 'sWrite_2Ex',
      InData: InData,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  sWriteEx = function(InData, Path) {
    const msg = {
      FunName: 'sWriteEx',
      InData: InData,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  sWriteEx_New = function(InData, Path) {
    const msg = {
      FunName: 'sWriteEx_New',
      InData: InData,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  sWrite_2Ex_New = function(InData, Path) {
    const msg = {
      FunName: 'sWrite_2Ex_New',
      InData: InData,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetCal = function(Hkey, Lkey, new_Hkey, new_Lkey, Path) {
    const msg = {
      FunName: 'SetCal',
      Hkey: Hkey,
      Lkey: Lkey,
      new_Hkey: new_Hkey,
      new_Lkey: new_Lkey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetBuf = function(InData, pos) {
    const msg = {
      FunName: 'SetBuf',
      InData: InData,
      pos: pos
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetBuf = function(pos) {
    const msg = {
      FunName: 'GetBuf',
      pos: pos
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YRead = function(Address, HKey, LKey, Path) {
    const msg = {
      FunName: 'YRead',
      Address: Address,
      HKey: HKey,
      LKey: LKey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YWrite = function(InData, Address, HKey, LKey, Path) {
    const msg = {
      FunName: 'YWrite',
      InData: InData,
      Address: Address,
      HKey: HKey,
      LKey: LKey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YReadEx = function(Address, len, HKey, LKey, Path) {
    const msg = {
      FunName: 'YReadEx',
      Address: Address,
      len: len,
      HKey: HKey,
      LKey: LKey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YWriteEx = function(Address, len, HKey, LKey, Path) {
    const msg = {
      FunName: 'YWriteEx',
      Address: Address,
      len: len,
      HKey: HKey,
      LKey: LKey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YReadString = function(Address, len, HKey, LKey, Path) {
    const msg = {
      FunName: 'YReadString',
      Address: Address,
      len: len,
      HKey: HKey,
      LKey: LKey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YWriteString = function(InString, Address, HKey, LKey, Path) {
    const msg = {
      FunName: 'YWriteString',
      InString: InString,
      Address: Address,
      HKey: HKey,
      LKey: LKey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetWritePassword = function(W_Hkey, W_Lkey, new_Hkey, new_Lkey, Path) {
    const msg = {
      FunName: 'SetWritePassword',
      W_Hkey: W_Hkey,
      W_Lkey: W_Lkey,
      new_Hkey: new_Hkey,
      new_Lkey: new_Lkey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetReadPassword = function(W_Hkey, W_Lkey, new_Hkey, new_Lkey, Path) {
    const msg = {
      FunName: 'SetReadPassword',
      W_Hkey: W_Hkey,
      W_Lkey: W_Lkey,
      new_Hkey: new_Hkey,
      new_Lkey: new_Lkey,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  DecString = function(InString, Key) {
    const msg = {
      FunName: 'DecString',
      InString: InString,
      Key: Key
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  EncString = function(InString, Path) {
    const msg = {
      FunName: 'EncString',
      InString: InString,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  EncString_New = function(InString, Path) {
    const msg = {
      FunName: 'EncString_New',
      InString: InString,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  Cal = function(Path) {
    const msg = {
      FunName: 'Cal',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  Cal_New = function(Path) {
    const msg = {
      FunName: 'Cal_New',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetCal_2 = function(Key, Path) {
    const msg = {
      FunName: 'SetCal_2',
      Key: Key,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetCal_New = function(Key, Path) {
    const msg = {
      FunName: 'SetCal_New',
      Key: Key,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetEncBuf = function(InData, pos) {
    const msg = {
      FunName: 'SetEncBuf',
      InData: InData,
      pos: pos
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetEncBuf = function(pos) {
    const msg = {
      FunName: 'GetEncBuf',
      pos: pos
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  ReSet = function(Path) {
    const msg = {
      FunName: 'ReSet',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetID = function(Seed, Path) {
    const msg = {
      FunName: 'SetID',
      Seed: Seed,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetProduceDate = function(Path) {
    const msg = {
      FunName: 'GetProduceDate',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  MacAddr = function() {
    const msg = {
      FunName: 'MacAddr'
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetChipID = function(Path) {
    const msg = {
      FunName: 'GetChipID',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  StarGenKeyPair = function(Path) {
    const msg = {
      FunName: 'StarGenKeyPair',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GenPubKeyY = function() {
    const msg = {
      FunName: 'GenPubKeyY'
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GenPubKeyX = function() {
    const msg = {
      FunName: 'GenPubKeyX'
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GenPriKey = function() {
    const msg = {
      FunName: 'GenPriKey'
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetPubKeyY = function(Path) {
    const msg = {
      FunName: 'GetPubKeyY',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetPubKeyX = function(Path) {
    const msg = {
      FunName: 'GetPubKeyX',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  GetSm2UserName = function(Path) {
    const msg = {
      FunName: 'GetSm2UserName',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  Set_SM2_KeyPair = function(PriKey, PubKeyX, PubKeyY, sm2UserName, Path) {
    const msg = {
      FunName: 'Set_SM2_KeyPair',
      PriKey: PriKey,
      PubKeyX: PubKeyX,
      PubKeyY: PubKeyY,
      sm2UserName: sm2UserName,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YtSign = function(SignMsg, Pin, Path) {
    const msg = {
      FunName: 'YtSign',
      SignMsg: SignMsg,
      Pin: Pin,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YtSign_2 = function(SignMsg, Pin, Path) {
    const msg = {
      FunName: 'YtSign_2',
      SignMsg: SignMsg,
      Pin: Pin,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YtVerfiy = function(id, SignMsg, PubKeyX, PubKeyY, VerfiySign, Path) {
    const msg = {
      FunName: 'YtVerfiy',
      id: id,
      SignMsg: SignMsg,
      PubKeyX: PubKeyX,
      PubKeyY: PubKeyY,
      VerfiySign: VerfiySign,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SM2_DecString = function(InString, Pin, Path) {
    const msg = {
      FunName: 'SM2_DecString',
      InString: InString,
      Pin: Pin,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SM2_EncString = function(InString, Path) {
    const msg = {
      FunName: 'SM2_EncString',
      InString: InString,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  YtSetPin = function(OldPin, NewPin, Path) {
    const msg = {
      FunName: 'YtSetPin',
      OldPin: OldPin,
      NewPin: NewPin,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  FindU = function(start) {
    const msg = {
      FunName: 'FindU',
      start: start
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  FindU_2 = function(start, in_data, verf_data) {
    const msg = {
      FunName: 'FindU_2',
      start: start,
      in_data: in_data,
      verf_data: verf_data
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  FindU_3 = function(start, in_data, verf_data) {
    const msg = {
      FunName: 'FindU_3',
      start: start,
      in_data: in_data,
      verf_data: verf_data
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  IsUReadOnly = function(Path) {
    const msg = {
      FunName: 'IsUReadOnly',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetUReadOnly = function(Path) {
    const msg = {
      FunName: 'SetUReadOnly',
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  SetHidOnly = function(IsHidOnly, Path) {
    const msg = {
      FunName: 'SetHidOnly',
      IsHidOnly: IsHidOnly,
      Path: Path
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  ResetOrder = function() {
    const msg = {
      FunName: 'ResetOrder'
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }

  ContinueOrder = function() {
    const msg = {
      FunName: 'ContinueOrder'
    }
    this.Socket_UK.send(JSON.stringify(msg))
  }
}
