
const app = getApp();
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: '4OIBZ-533HF-OVCJ2-JQ3KM-GN2RV-XDBYY' // 必填
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripID:'',
    tripInfo:{},
    driverInfo:{},
    driverTrip:{},
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
    
    driverOverallRating:{},
    rating:'',
    rated:false
  },

 
  onLoad: function (options) {
    //接收上一个页面的参数
    this.setData({
      tripID:options.tripID
    })
    this.loadData()
  },

  loadData(){
    let that=this
    that.getTripInfo().then(res=>{
      let tripInfo=res.data.passengerTrip
      console.log(tripInfo);
      //先lat后long
      let departureCoordinate=tripInfo.departureCoordinate.split(',');
      let destinationCoordinate=tripInfo.destinationCoordinate.split(',');

      that.setData({
        tripInfo:tripInfo,
        latitude:departureCoordinate[0],
        longitude:departureCoordinate[1],
        departureCoordinate:tripInfo.departureCoordinate,
        destinationCoordinate:tripInfo.destinationCoordinate,
        depart:tripInfo.departure,
        dest:tripInfo.destination,
        isPickedUp:tripInfo.pickedUp
      })
      if(tripInfo.hasDriver){
        that.getDriverInfo().then(res=>{
          console.log(res);
           that.setData({
            driverInfo:res.data.driverTrip.driverInfo,
            driverTrip:res.data.driverTrip,
            driverOverallRating:res.data.ratingOverall
           })
        })

      }
      that.getPolyline()
      that.setMarkers()
      that.getDistance()
    })
  },
  getTripInfo(tripID){
    return new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/passengerTrip/getTripByTripID',
        data:{
          'tripID':this.data.tripID,
        },
        success: (res)=>{
          resolve(res)
        },
      })
    })
  },
  getDriverInfo(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/mapping/getDriverTrip',
        data:{
          'passengerTripID':this.data.tripID,
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
        console.error(error);
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
          console.error(error);
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


    
    call(){
      wx.makePhoneCall({
        phoneNumber: '18780075098',
      });
    },
    
    report(){
      let that=this
      let receiverID=that.data.driverInfo.id
      let receiverTripID=that.data.driverTrip.id
      let reporterID=app.globalData.userInfo.openID
      let reporterTripID=that.data.tripID
      wx.navigateTo({
        url: 'reportDriver/reportDriver?receiverID='+receiverID+'&receiverTripID='+receiverTripID+'&reporterID='+reporterID+
        '&reporterTripID='+reporterTripID,
        success: (result)=>{
        },
      });
    },

    onStarNum(e){
      console.log(e);
      this.setData({
        rating:e.detail
      })
    },
    tapSubmit(){
      wx.showModal({
        title: '确认提交评价吗？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            this.submitRating()
          }
        },
      });
    },
    submitRating(){
      let that=this
      return new Promise((resolve,reject)=>{
        wx.request({
          url:app.globalData.IP+'/passengerTrip/rateDriver',
          data:{
            driverID:that.data.driverTrip.driverID,
            driverTripID:that.data.driverTrip.id,
            passengerID:app.globalData.userInfo.openID,
            passengerTripID:that.data.tripID,
            rating:that.data.rating,
          },
          success: (res)=>{
            resolve(res)
          },
        })
      }).then(res=>{
        if(res.data.result=='0'){
          wx.showToast({
            title: '评价成功，感谢您的评价！',
            icon: 'none',
            duration: 1500,
          });
          that.setData({
            rated:true
          })
        }
      })
    }

})