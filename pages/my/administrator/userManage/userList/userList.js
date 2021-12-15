const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[]
  },
  onShow(){
    this.getUserList()
  },
  getUserList(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/userInfo/getAllUserInfo',
        data:{
          
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      console.log(res);
      that.setData({
        userList:res.data.userInfoList
      })
    })
  },
  toUserDetail(e){
    let userID=e.currentTarget.dataset.userId
    wx.navigateTo({
      url: '../userDetail/userDetail?userID='+userID,

    });
  }
})