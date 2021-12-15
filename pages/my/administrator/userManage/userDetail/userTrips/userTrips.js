const app = getApp();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    //顶部导航栏
    TabCur: 0,
    scrollLeft:0,
    openID:'',
    isDriver:'',
    //list:[{"canceled":false,"createTime":1617560185000,"departTime":1617562260000,"departure":"四川大学锦城学院","departureCoordinate":"30.725528207,103.949974255","destination":"四川大学(江安校区)","destinationCoordinate":"30.557546248,103.999150124","finished":false,"hasDriver":true,"howManyPeople":1,"id":"3","passengerID":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","pickedUp":false,"postscript":"大件","userInfo":{"avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/ehLbSVp27w135rR6wa2hLicxJRSz5239bo6QLW9taa5AISOERr304p4EaicksDgjVdMicdViaibrx35ibWwwnfxFgdpg/132","cellphone":"18780075098","iDCard":"522724199812033152","id":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","name":"clx","nickName":"chillyP"}},{"canceled":false,"createTime":1617699882000,"departTime":1617703440000,"departure":"四川大学(江安校区)","departureCoordinate":"30.557546248,103.999150124","destination":"四川大学(望江校区)","destinationCoordinate":"30.630319,104.083767","finished":false,"hasDriver":false,"howManyPeople":1,"id":"4","passengerID":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","pickedUp":false,"postscript":"大件行李","userInfo":{"$ref":"$.tripList[0].userInfo"}},{"canceled":false,"createTime":1617700533000,"departTime":1617703440000,"departure":"四川大学(江安校区)","departureCoordinate":"30.557546248,103.999150124","destination":"四川大学(望江校区)","destinationCoordinate":"30.630319,104.083767","finished":false,"hasDriver":false,"howManyPeople":1,"id":"5","passengerID":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","pickedUp":false,"postscript":"大件行李","userInfo":{"$ref":"$.tripList[0].userInfo"}},{"canceled":false,"createTime":1617701229000,"departTime":1617703440000,"departure":"四川大学(江安校区)","departureCoordinate":"30.557546248,103.999150124","destination":"四川大学(望江校区)","destinationCoordinate":"30.630319,104.083767","finished":false,"hasDriver":false,"howManyPeople":1,"id":"6","passengerID":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","pickedUp":false,"postscript":"大件行李","userInfo":{"$ref":"$.tripList[0].userInfo"}}],
    userPassengerTrips:[],
    userDriverTrips:[],
  },
  //导航栏
  tabSelect(e) {
    let that=this
    //点击乘客页面
    if(e.currentTarget.dataset.id==0){
      that.getUserPassengerTrips()
    }
    //点击司机页面
    else{
      if(!that.data.isDriver){
        wx.showModal({
          title: '用户还没有成为车主！',
          content: '',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
            }
          },
        });
        return
      }
      else{
        that.getUserDriverTrips()
      }
    }
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },

  onLoad(options){
    console.log(options);
    this.setData({
      openID:options.openID,
      isDriver:options.isDriver=="true"?true:false
    })
  },
  onShow(){
      let that=this
      //页面显示时请求数据
      //乘客页面
      if(that.data.TabCur==0){
        this.getUserPassengerTrips()
      }
      //司机页面
      else{
        this.getUserDriverTrips()
      }
  },
  getUserPassengerTrips(){
    let that=this 
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/passengerTrip/getHistoryByPassengerID',
        data:{
          'openID':that.data.openID,
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      that.setData({
        userPassengerTrips:res.data.passengerTrips
      })
    })
  },
  //跳转到详情页面
  toPassengerTripDetail(e){
    let tripID=e.currentTarget.dataset.tripId
    console.log(tripID);
    wx.navigateTo({
      url: 'passenger/myTripDetail/myTripDetail?tripID='+tripID,
      success: (result)=>{
      },
    });
  },
  toDriverTripDetail(e){
    let tripID=e.currentTarget.dataset.tripId
    console.log(tripID);
    wx.navigateTo({
      url: 'driver/myTripDetail/myTripDetail?tripID='+tripID,
      success: (result)=>{
      },
    });
  },

  getUserDriverTrips(){
    let that=this 
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/driverTrip/getHistoryByDriverID',
        data:{
          'driverID':that.data.openID,
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
        that.setData({
          userDriverTrips:res.data.driverTrips
        })
    })
  },
  //跳转到乘客详情页面
  toPassengerTripDetail(e){
    let tripID=e.currentTarget.dataset.tripId
    console.log(tripID);
    wx.navigateTo({
      url: 'myTripDetail/myTripDetail?tripID='+tripID,
      success: (result)=>{
      },
    });
  },
  //跳转到车主详情页面
  toDriverTripDetail(e){
    let tripID=e.currentTarget.dataset.tripId
    console.log(tripID);
    wx.navigateTo({
      url: 'driverTripDetail/driverTripDetail?tripID='+tripID,
      success: (result)=>{
      },
    });
  },
})