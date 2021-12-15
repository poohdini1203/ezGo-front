const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driverID:'',
    driverRequest:{},
    IDCardImg:[],
    drivingLicenceImg:[],
    vehicleLicenceImg:[],
    carImg:[],
  },

  onLoad(options){
    console.log(options);
    this.setData({
      driverID:options.driverID
    })
    this.getDriverRequest();

    
  },
  getDriverRequest(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/driver/getDriverInfoByID',
        data:{
          openID:that.data.driverID
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
        driverRequest:res.data.driverInfo,
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