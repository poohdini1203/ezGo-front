const app = getApp();

var QQMapWX = require('../../../../utils/qqmap-wx-jssdk');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: '' // 必填
});

import { DatePicker } from '../../../../utils/datePicker';
const params={
  dateArr:['今天','明天','后天']
}
const datePicker = new DatePicker(params);
const dateArr = datePicker.datePicker();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索用的
    dateArray:null,//picker-rang的值
    dateIndex:null,//picker-value的值
    dateVal:'',//显示的时间
    departTime:'',
    departure:'',
    destination:'',
    //乘车人数
    people: ['不限',1,2,3,4],
    peopleIndex:'',

    onDepart:false,
    onDest:false,
    isTap:false,

    driverTrips:[],

    //
    passengerTripID:'',
  },

  onLoad(option){
    console.log(option);
    let that=this
    that.setData({
      passengerTripID:option.passengerTripID
    })
    that.set_date();
    
  },
  onShow(){
    this.getDriverTripsByCondition().then(res=>{
      console.log(res);
       this.setData({
        driverTrips:res.data.driverTrips
       })
    })
  },
  
  //跳转到详情页面
  toDetail(e){
    let tripID=e.currentTarget.dataset.tripId
    console.log(tripID);
    wx.navigateTo({
      url: '../driverTripDetail/driverTripDetail?tripID='+tripID+'&passengerTripID='+this.data.passengerTripID,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  set_date(){
    this.setData({
      dateArray: dateArr.dateAll,
      dateIndex: dateArr.currentDateArr,
      //dateVal: datePicker.toDate(dateArr.dateAll,dateArr.currentDateArr)
    })
    
  },
  datePickerChange(e){
    let dateIndex=e.detail.value
    let dayAdd=dateIndex[0]
    console.log(dayAdd);
    let curDate=new Date();
    let departTime=new Date(curDate)
    departTime.setDate(departTime.getDate()+dayAdd);
    console.log(datePicker.dateToStr(departTime));
      console.log(datePicker.toDate(dateArr.dateAll ,dateIndex));
      this.setData({
        dateIndex,
        dateVal: datePicker.toDate(dateArr.dateAll ,dateIndex),
        departTime:datePicker.dateToStr(departTime)
      })
    
  },
  peoplePickerChange(e) {
    this.setData({
      peopleIndex: e.detail.value
    })
  },

   //数据回填方法
backfillDepart(e){
  var _this = this;

  _this.setData({
    isTap:true
  })

  var id = e.currentTarget.id;
  let latitude;
  let longitude;
  let title;
  for (var i = 0; i < _this.data.suggestion.length;i++){
    if(i == id){
      latitude=_this.data.suggestion[i].latitude;
      longitude=_this.data.suggestion[i].longitude
      title=_this.data.suggestion[i].title
      console.log('出发地');
      console.log(title);
      console.log(latitude+','+longitude);
      _this.setData({
        latitude:latitude,
        longitude:longitude,
        depart: title,
        departureCoordinate:latitude+','+longitude
      });
    }  
  }
    
},
backfillDest(e){
  var _this = this;

  _this.setData({
    isTap:true
  })

  var id = e.currentTarget.id;
  let latitude;
  let longitude;
  let title;
  for (var i = 0; i < _this.data.suggestion.length;i++){
    if(i == id){
      latitude=_this.data.suggestion[i].latitude;
      longitude=_this.data.suggestion[i].longitude
      title=_this.data.suggestion[i].title

      console.log('目的地');
      console.log(title);
      console.log(latitude+','+longitude);
      _this.setData({
        latitude:latitude,
        longitude:longitude,
        dest: title,
        destinationCoordinate:latitude+','+longitude
      });
    }  
  }
  
},

//触发关键词输入提示事件
getSuggestDepart(e) {
  var _this = this;
  console.log(e);
  let isEmpty=(e.detail.value.length==0?true:false)
  _this.setData({
    isTap:false,
    onDepart:!isEmpty,
    onDest:false
  })
  _this.suggestion(e.detail.value)

  // console.log('depart');
  // console.log(!this.data.isTap&&this.data.onDepart);
},
getSuggestDest(e){
  var _this = this;
  let isEmpty=(e.detail.value.length==0?true:false)
  _this.setData({
    isTap:false,
    onDepart:false,
    onDest:!isEmpty
  })
  _this.suggestion(e.detail.value)
  // console.log('dest');
  // console.log(!this.data.isTap&&this.data.onDest);
  
},

suggestion:function(keyword){
  var _this = this;
  //调用关键词提示接口
  qqmapsdk.getSuggestion({
    //获取输入框值并设置keyword参数
    keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
    //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
    success: function(res) {//搜索成功后的回调
     
      var sug = [];
      for (var i = 0; i < res.data.length; i++) {
        sug.push({ // 获取返回结果，放到sug数组中
          title: res.data[i].title,
          id: res.data[i].id,
          addr: res.data[i].address,
          city: res.data[i].city,
          district: res.data[i].district,
          latitude: res.data[i].location.lat,
          longitude: res.data[i].location.lng
        });
      }
      _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
        suggestion: sug
      });
    },
    fail: function(error) {
      console.error(error);
    },
    complete: function(res) {
      console.log(res);
    }
  });
},

  formsubmit(e){
    let that=this
    console.log(e);
    that.setData({
      departure:e.detail.value.departure,
      destination:e.detail.value.destination,
    })
    that.getDriverTripsByCondition().then(res=>{
      console.log(res);
      that.setData({
        driverTrips:res.data.driverTrips
      })
    })
  },
  getDriverTripsByCondition(){
    let that=this
    let peopleIndex=that.data.peopleIndex
    let howManyPeople='';
    let departTime=that.data.departTime
    let departure=that.data.departure
    let destination=that.data.destination

    console.log(peopleIndex);
    //指定了人数
    if(peopleIndex.length!=0&&peopleIndex!=0){
      howManyPeople=that.data.people[that.data.peopleIndex]
    }
    return new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/driverTrip/getTripsByCondition',
        data:{
          date:departTime,
          departure:departure,
          destination:destination,
          howManyPeople:howManyPeople
        },
        success: (res)=>{
          resolve(res)
        },
      })
    })
  }
})