
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: '4OIBZ-533HF-OVCJ2-JQ3KM-GN2RV-XDBYY' // 必填
});
import { TimePicker } from '../../utils/timePicker';


const params={
  dateArr:['今天','明天','后天']
}


const timePicker = new TimePicker(params);
const dateArr = timePicker.timePicker();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    aa: {
      "bg_color": "white",
      "color": "#000",
      "flag": 0,
      "name": "发布行程"
    },


    //顶部导航栏
    TabCur: 0,
    scrollLeft:0,


    //地图中心
    longitude:null,
    latitude:null,
    suggestion:[],

    //地图上的标记
    markers:[],

    onDepart:false,
    onDest:false,
    isTap:false,

    //出发地、目的地
    depart:null,
    dest:null,
    departureCoordinate:null,
    destinationCoordinate:null,
    distance:0,
    //乘车人数
    people: [1,2,3,4],
    peopleIndex:null,

    dateArray: null,//picker-rang的值
    dateIndex:null,//picker-value的值
    //出发时间
    dateVal:null,//显示的时间
    departTime:'', //出发时间戳
    //备注
    postscript:'',

    //按钮
    postBtn:true
  },


  onLoad(){
    this.set_date();
    
  },
  onShow(){
    this.getLocation(); 
  },
  //导航栏
  tabSelect(e) {
    //点击司机栏
    if(e.currentTarget.dataset.id==1){
      if(!app.checkDriverCancel()){
        return
      }
    }
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },



  getLocation(){
    var _this = this;
    console.log('hi');
    wx.getLocation({
      type: 'wgs84',
      altitude: false,
      success: (result)=>{
        console.log('初始longitude:'+result.longitude);
        console.log('初始latitude:'+result.latitude);

        _this.setData({
          longitude:result.longitude,
          latitude:result.latitude
        })
      },
      fail: (error)=>{console.error(error)},
      complete: (res)=>{console.log(res);}
    });
  },

  //赋值
  set_date(){
    
    this.setData({
      dateArray: dateArr.dateAll,
      dateIndex: dateArr.currentDateArr,
      //dateVal: datePicker.toDate(dateArr.dateAll,dateArr.currentDateArr)
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
    if(_this.data.dest!=null){
     _this.getPolyline();
     _this.setMarkers();
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
        
        dest: title,
        destinationCoordinate:latitude+','+longitude
      });
    }  
  }
  if(_this.data.depart!=null){
    _this.getPolyline();
    _this.setMarkers();
  }
},

//触发关键词输入提示事件
getSuggestDepart(e) {
  var _this = this;
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

getPolyline:function(){
  var _this = this;
  //调用距离计算接口
  qqmapsdk.direction({
    mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
    //from参数不填默认当前地址
    from: this.data.departureCoordinate,
    to: this.data.destinationCoordinate,
    success: function (res) {
      console.log(res);
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
      console.log(pl)
      //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
      _this.setData({
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
      console.log(res);
    }
  });
},

getDistance(){
  var _this = this;
  
  return new Promise((resolve,reject)=>{
      //调用距离计算接口
      qqmapsdk.calculateDistance({
        //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
        //from参数不填默认当前地址
        //获取表单提交的经纬度并设置from和to参数（示例为string格式）
        from: _this.data.departureCoordinate || '', //若起点有数据则采用起点坐标，若为空默认当前地址
        to: _this.data.destinationCoordinate, //终点坐标
        success: function(res) {//成功后的回调
          console.log(res);
          var res = res.result;
          var dis = [];
          for (var i = 0; i < res.elements.length; i++) {
            dis.push(res.elements[i].distance); //将返回数据存入dis数组，
          }
          _this.setData({ //设置并更新distance数据
            distance: dis[0]
          });
          resolve(dis[0])
        },
        fail: function(error) {
          console.error(error);
        },
        complete: function(res) {
          console.log(res);
        }
    })
  })
   
},

  setMarkers(){
    let _this=this
  _this.getDistance().then(res=>{
    let distance=(res/1000).toFixed(1)
    let from=this.data.departureCoordinate.split(',') 
    let to=this.data.destinationCoordinate.split(',')
    let departMarker={
      id: 0,
      latitude: from[0],
      longitude: from[1],
      alpha:0,
      callout:{
        //content: "出发地",
        // padding:10,
        // display:'ALWAYS',
        // textAlign:'center',
        // borderRadius: 10,
        // borderColor:'#ff0000',
        // borderWidth: 2,
    }
  }
    let destMarker={
      id: 1,
      latitude: to[0],
      longitude: to[1],
      
    }
    console.log(res);
    let distanceMarker={
      id: 2,
      latitude: from[0],
      longitude: from[1],
      alpha:1,
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
    _this.setData({
      markers:marker
    });
  })
  
  },

 peoplePickerChange(e) {
    this.setData({
      peopleIndex: e.detail.value
    })
  },

  datePickerChange(e){
    let dateIndex=e.detail.value;
    console.log('dateIndex');
    console.log(dateIndex);

    var curDate=new Date();     //1. js获取当前时间
    var min=curDate.getMinutes();  //2. 获取当前分钟
    let validDate=new Date(curDate); 
    validDate.setMinutes(min+20)                       //3. 设置当前时间+20分钟：把当前分钟数+20后的值重新设置为date对象的分钟数
    let validHour=validDate.getHours()
    let validMinute=validDate.getMinutes()


    //如果合法的分钟<10，添0
    if(validMinute<10){
      validMinute='0'+validMinute
    }

    //判断选择的时间是否合法
    let isValid=true
    //选择的是今天
    if(dateIndex[0]==0){

      let pickedHour=dateIndex[1]
      let pickedMinute=dateIndex[2]

      if(pickedHour>validHour){

      }
      else if(pickedHour==validHour&&pickedMinute>=validMinute){

      }
      //选择的时间不合法
      else{
        isValid=false
        wx.showToast({
          title: '请选'+validHour+':'+validMinute+'之后!',
          icon: 'error',
          duration: 2000
        })
      }
    }
    if(isValid){
      let dayAdd=dateIndex[0]
      let hour=dateIndex[1]
      let minute=dateIndex[2]
      //出发时间
      let departTime=new Date(curDate)
      departTime.setMinutes(minute)
      departTime.setHours(hour)
      departTime.setDate(curDate.getDate()+dayAdd)
      console.log(timePicker.toDate(dateArr.dateAll ,dateIndex));
      console.log(timePicker.dateToStr(departTime));
      this.setData({
        dateIndex,
        dateVal: timePicker.toDate(dateArr.dateAll ,dateIndex),
        departTime:timePicker.dateToStr(departTime)
      })
    }
  },

  addTrip(){
    return new Promise((resolve,reject)=>{
      let that=this
      let depart=that.data.depart
      let dest=that.data.dest
      let departureCoordinate=that.data.departureCoordinate
      let destinationCoordinate=that.data.destinationCoordinate
      let peopleIndex=that.data.peopleIndex
      let howManyPeople=that.data.people[peopleIndex]
      let departureTime=that.data.departTime
      let postscript=that.data.postscript 
      let distance=that.data.distance 
      //发乘客行程还是司机行程
      let mapping=''
      if(that.data.TabCur==0){
        mapping='/passengerTrip/add'
      }else{
        mapping='/driverTrip/add'
      }
      wx.request({
        url:app.globalData.IP+mapping,
        data:{
          'openID':app.globalData.userInfo.openID,
          'departure':depart,
          'destination':dest,
          'departureCoordinate':departureCoordinate,
          'destinationCoordinate':destinationCoordinate,
          'howManyPeople':howManyPeople,
          'departTime':departureTime,
          'postscript':postscript,
          'distance':distance
        },
        success: (res)=>{
          resolve(res)
        },
      })
    })
  },
  formSubmit(e){
    if(!app.checkLoginCancel()){
      return
    }
    if(!app.checkBindCancel()){
      return
    }

    let that=this
    //判断出发地和目的地是否填写
    if(that.data.TabCur==0)
    console.log('passenger');
    else console.log('driver');
    console.log(e);
   

    let postscript=e.detail.value.postscript
    that.setData({
      postscript:postscript
    })

      let depart=that.data.depart
      let dest=that.data.dest
      let departureCoordinate=that.data.departureCoordinate
      let destinationCoordinate=that.data.destinationCoordinate
      let peopleIndex=that.data.peopleIndex
      let howManyPeople=that.data.people[peopleIndex]
      let departureTime=that.data.departTime
    //备注赋值
    
    console.log(depart);
    console.log(dest);
    console.log(departureCoordinate);
    console.log(destinationCoordinate);
    console.log(howManyPeople);
    console.log(departureTime);
    console.log(postscript);
  
    if(depart==null){
      wx.showToast({
        title: '出发地不能为空',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if(dest==null){
      wx.showToast({
        title: '目的地不能为空',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if(peopleIndex==null){
      wx.showToast({
        title: '请选择乘车人数',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if(departureTime==null){
      wx.showToast({
        title: '请选择出发时间',
        icon: 'error',
        duration: 2000
      })
      return
    }
    wx.showModal({
      title: '确认发布吗？',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          that.addTrip().then(res=>{
            that.setData({
              depart:null,
              dest:null,
              peopleIndex:null,
              dateVal:null,
              postscript:null,
              postBtn:true,
              polyline:null,
              markers:null,
              postscript:null
              
            })
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 2000
            })
          })
        }
      },
      
    });
    
    

    // console.log(departure)
    // console.log(destination)
    // console.log(people[peopleIndex])
    // console.log(departureTime)
    // console.log(postscript)

  },
  
})