
const app = getApp();
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: '' // 必填
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripID:'',
    tripInfo:{},
    tripInfoStr:'',
    passengerTrips:[],
    //地图中心
    longitude:null,
    latitude:null,
    //地图上的标记
    markers:[],
    //出发地、目的地
    depart:null,
    dest:null,
    departureCoordinate:null,
    destinationCoordinate:null,
    distance:0,
    //出发时间
    departTime:'',
    
  },

 
  onLoad: function (options) {
    //接收上一个页面的参数
    this.setData({
      tripID:options.tripID
    })
    this.loadData()
    
  },
  onShow(){
    let that=this
    that.getPassengerTrips().then(res=>{
      that.setData({
         passengerTrips:res.data.passengerTrips,
      })
    })
  },
  loadData(){
    let that=this
    that.getTripInfo().then(res=>{
      let tripInfo=res.data.driverTrip
      let str=JSON.stringify(tripInfo)
      console.log(tripInfo);
      //先lat后long
      let departureCoordinate=tripInfo.departureCoordinate.split(',');
      let destinationCoordinate=tripInfo.destinationCoordinate.split(',');

      that.setData({
        tripInfo:res.data.driverTrip,
        tripInfoStr:str,
        latitude:departureCoordinate[0],
        longitude:departureCoordinate[1],
        departureCoordinate:tripInfo.departureCoordinate,
        destinationCoordinate:tripInfo.destinationCoordinate,
        depart:tripInfo.departure,
        dest:tripInfo.destination,
      })
      that.getPolyline()
      that.setMarkers()
      that.getDistance()
      
    })
  },
  getTripInfo(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/driverTrip/getTripByTripID',
        data:{
          'tripID':this.data.tripID,
        },
        success: (res)=>{
          resolve(res)
        },
      })
    })
  },
  getPassengerTrips(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/mapping/getPassengersOfDriverTrip',
        data:{
          'driverTripID':this.data.tripID,
        },
        success: (res)=>{
          resolve(res)
        },
      })
    })
  },
  getPolyline:function(){
    var that = this;
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: that.data.departureCoordinate,
      to: that.data.destinationCoordinate,
      success: function (res) {
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        that.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {
      },
      complete: function (res) {
      }
    });
  },
  
  getDistance(){
    var that = this;
    //调用距离计算接口
    qqmapsdk.calculateDistance({
        //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
        //from参数不填默认当前地址
        //获取表单提交的经纬度并设置from和to参数（示例为string格式）
        from: that.data.departureCoordinate || '', //若起点有数据则采用起点坐标，若为空默认当前地址
        to: that.data.destinationCoordinate, //终点坐标
        success: function(res) {//成功后的回调
          
          var res = res.result;
          var dis = [];
          for (var i = 0; i < res.elements.length; i++) {
            dis.push(res.elements[i].distance); //将返回数据存入dis数组，
          }
          that.setData({ //设置并更新distance数据
            distance: dis[0]
          });
          
        },
        fail: function(error) {
          
        },
        complete: function(res) {
          
        }
    })
     
  },
  
    setMarkers(){
      let that=this
      let from=that.data.departureCoordinate.split(',') 
      let to=that.data.destinationCoordinate.split(',')
      let distance=(that.data.tripInfo.distance/1000).toFixed(1)
      let departMarker={
        id: 0,
        latitude: from[0],
        longitude: from[1],
        }
      let destMarker={
        id: 1,
        latitude: to[0],
        longitude: to[1],
      }
      let distanceMarker={
        id: 2,
        latitude: from[0],
        longitude: from[1],
        alpha:0,
        callout:{
          content: distance+"公里",
          padding:10,
          display:'ALWAYS',
          textAlign:'center',
          borderRadius: 10,
          borderColor:'#ff0000',
          borderWidth: 2,
        }
      }
      let marker=[]
      marker.push(departMarker)
      marker.push(destMarker)
      marker.push(distanceMarker)
      that.setData({
        markers:marker
      });
    },


    



  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  report(e){
    let that=this
    let receiverID=e.currentTarget.dataset.receiverId
    let receiverTripID=e.currentTarget.dataset.tripId
    let reporterID=app.globalData.userInfo.openID
    let reporterTripID=that.data.tripID
    wx.navigateTo({
      url: 'reportPassenger/reportPassenger?receiverID='+receiverID+'&receiverTripID='+receiverTripID+'&reporterID='+reporterID+
      '&reporterTripID='+reporterTripID,
      success: (result)=>{
      },
    });
  }
})