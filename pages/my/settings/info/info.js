const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      nickName:'',
      cellphone:'',
      name:'',
      IDCard:''
  },

  onShow(){
    if(!app.checkLogin()){
      return
    }
    if(!app.checkBind()){
      return
    }
    this.setData({
      nickName:app.globalData.userInfo.nickName,
      cellphone:app.globalData.userInfo.cellphone,
      name:app.globalData.userInfo.name,
      IDCard:app.globalData.userInfo.IDCard,
    })
  }
})