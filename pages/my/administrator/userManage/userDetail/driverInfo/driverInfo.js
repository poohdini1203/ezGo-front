const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:'',
    driverInfo:{},
    IDCardImg:[],
    drivingLicenceImg:[],
    vehicleLicenceImg:[],
    carImg:[],
  },

  onLoad(options){
    this.setData({
      openID:options.openID
    })
    this.getDriverInfo()
  },

  getDriverInfo(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/driver/getDriverInfoByID',
        data:{
          openID:that.data.openID
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      console.log(res);
      let driverInfo=res.data.driverInfo
      let IDCardImg=''
      if(driverInfo.iDCardUrl!=null){
        IDCardImg=driverInfo.iDCardUrl.split("---")
      }
      let drivingLicenceImg=''
      if(driverInfo.drivingLicenceUrl!=null){
        drivingLicenceImg=driverInfo.drivingLicenceUrl.split("---")
      }
      let vehicleLicenceImg=''
      if(driverInfo.vehicleLicenceUrl!=null){
        vehicleLicenceImg=driverInfo.vehicleLicenceUrl.split("---")
      }
      let carImg=''
      if(driverInfo.carImgUrl!=null){
        carImg=driverInfo.carImgUrl.split("---")
      }
      that.setData({
        driverInfo:res.data.driverInfo,
        IDCardImg:IDCardImg,
        drivingLicenceImg:drivingLicenceImg,
        vehicleLicenceImg:vehicleLicenceImg,
        carImg:carImg
      })
    })
  },
  ViewIDCard(e) {
    wx.previewImage({
      urls: this.data.IDCardImg,
      current: e.currentTarget.dataset.url
    });
  },

  ViewDrivingLicence(e) {
    wx.previewImage({
      urls: this.data.drivingLicenceImg,
      current: e.currentTarget.dataset.url
    });
  },

  ViewVehicleLicence(e) {
    wx.previewImage({
      urls: this.data.vehicleLicenceImg,
      current: e.currentTarget.dataset.url
    });
  },

  ViewCar(e) {
    wx.previewImage({
      urls: this.data.carImg,
      current: e.currentTarget.dataset.url
    });
  },

})