const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID:'',
    userInfo:[],
    driverInfo:[],
    isDriver:false,
    isForbidden:false
  },
  onShow(){
    this.getUserInfo();
    this.getDriverInfo();
  },
  onLoad(options){
    console.log(options);
    this.setData({
      userID:options.userID
    })

  },
  getUserInfo(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/userInfo/getUserInfoByID',
        header:{
          openID:app.globalData.userInfo.openID,
          token:app.globalData.token
        },
        data:{
          'openID':that.data.userID
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      console.log(res);
      that.setData({
        userInfo:res.data.userInfo,
        isForbidden:res.data.userInfo.forbidden
      })
    })
  },
  getDriverInfo(){
    let that=this
    return new Promise((resolve,reject)=>{
          wx.request({
            url:app.globalData.IP+'/driver/getDriverInfoByID',
            data:{
              'openID':that.data.userID
            },
            success: (res)=>{
              resolve(res)
            },
          })
    }).then(res=>{
      let driverInfo=res.data.driverInfo
      if(driverInfo!=null){
          that.setData({
            isDriver:true
          })
      }
    })
  },
  forbidUser(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/admin/forbidUser',
        data:{
          'openID':that.data.userID
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      if(res.data.result=="0"){
        wx.showToast({
          title: '拉入黑名单成功!',             
          duration: 1500,               
        });
        that.setData({
          isForbidden:true
        })
      }
    })
  },
  activeUser(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/admin/activeUser',
        data:{
          'openID':that.data.userID
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      if(res.data.result=="0"){
        wx.showToast({
          title: '解除黑名单成功!',             
          duration: 1500,               
        });
        that.setData({
          isForbidden:false
        })
      }
    })
  }

})