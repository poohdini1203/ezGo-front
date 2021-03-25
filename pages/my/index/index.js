// pages/my/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: {},
    hasUserInfo: false,
    miles:160,
    NPO:12,
    NDO:0
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  wxLogin(){
    let that=this
    let hasUserInfo=that.data.hasUserInfo
    if(!hasUserInfo){
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写,
        success: (res) => {
          console.log(res);
          console.log(res)
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          
        },
        fail:(err)=>{
          console.log(err);
        }
      })
    }
  }
  
})