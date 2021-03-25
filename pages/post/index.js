var QQMapWX = require('../../utils/qqmap-wx-jssdk');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: '4OIBZ-533HF-OVCJ2-JQ3KM-GN2RV-XDBYY' // 必填
});
import { DatePicker } from '../../utils/timePicker';


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

    depart:null,
    dest:null,
    from:null,
    to:null,
    distance:0,




    people: [1,2,3,4],
    peopleIndex:null,
    dateArray: null,//picker-rang的值
    dateIndex:null,//picker-value的值
    dateVal:null,//显示的时间
  },


  onLoad(){
    this.getLocation();
    this.set_date();
  },

  //导航栏
  tabSelect(e) {
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
      console.log(title);
      console.log(latitude+','+longitude);
      _this.setData({
        latitude:latitude,
        longitude:longitude,
        depart: title,
        from:latitude+','+longitude
      });
    }  
  }
    if(_this.data.dest!=null){
     _this.getPolyline();
     _this.getDistance();
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

      console.log(title);
      console.log(latitude+','+longitude);
      _this.setData({
        latitude:latitude,
        longitude:longitude,
        dest: title,
        to:latitude+','+longitude
      });
    }  
  }
  if(_this.data.depart!=null){
    _this.getPolyline();
    _this.getDistance();
    _this.setMarkers();
  }
},

//触发关键词输入提示事件
getSuggestDepart(e) {
  var _this = this;

  _this.setData({
    isTap:false,
    onDepart:true,
    onDest:false
  })
  _this.suggestion(e.detail.value)

  // console.log('depart');
  // console.log(!this.data.isTap&&this.data.onDepart);
},
getSuggestDest(e){
  var _this = this;

  _this.setData({
    isTap:false,
    onDepart:false,
    onDest:true
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
    from: this.data.from,
    to: this.data.to,
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
    console.log(_this.data.from);
  //调用距离计算接口
  qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: _this.data.from || '', //若起点有数据则采用起点坐标，若为空默认当前地址
      to: _this.data.to, //终点坐标
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
        console.log('distance');
        console.log(dis[0])
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
  })
   
},

  setMarkers(){
    let _this=this
    let from=this.data.from.split(',') 
    let to=this.data.to.split(',')
    let departMarker={
      id: 0,
      latitude: from[0],
      longitude: from[1],
      // alpha:0,
    //   callout:{
    //     content: "出发地",
    //     padding:10,
    //     display:'ALWAYS',
    //     textAlign:'center',
    //     borderRadius: 10,
    //     borderColor:'#ff0000',
    //     borderWidth: 2,
    // }
  }
  let destMarker={
    id: 1,
    latitude: to[0],
    longitude: to[1],
    // alpha:0,
  //   callout:{
  //     content: "目的地",
  //     padding:10,
  //     display:'ALWAYS',
  //     textAlign:'center',
  //     borderRadius: 10,
  //     borderColor:'#ff0000',
  //     borderWidth: 2,
  // }
}
  let marker=[]
  marker.push(departMarker)
  marker.push(destMarker)
  _this.setData({
    markers:marker
  });

  console.log(this.data.markers);
  },

 peoplePickerChange(e) {
    this.setData({
      peopleIndex: e.detail.value
    })
  },

  datePickerChange(e){
    let dateIndex=e.detail.value;

    var date=new Date();     //1. js获取当前时间
    var min=date.getMinutes();  //2. 获取当前分钟
    date.setMinutes(min+20);  //3. 设置当前时间+20分钟：把当前分钟数+20后的值重新设置为date对象的分钟数
    let validHour=date.getHours()
    let validMinute=date.getMinutes()

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
      this.setData({
        dateIndex,
        dateVal: datePicker.toDate(dateArr.dateAll,dateIndex),
      })
    }
  },


  formSubmit(e){
    //判断出发地和目的地是否填写
    if(this.data.TabCur==0)
    console.log('passenger');
    else console.log('driver');
    console.log(e);

    // let departure=e.detail.value.departure;
    // let destination=e.detail.value.destination;
    // let people=this.data.people;
    // let peopleIndex=this.data.peopleIndex;
    // let departureTime=this.data.dateVal
    // let postscript=e.detail.value.postscript

    

    
    // if(departureTime==null){
    //   wx.showToast({
    //     title: '请选择出发时间',
    //     icon: 'error',
    //     duration: 2000
    //   })
    // }
    // if(peopleIndex==null){
    //   wx.showToast({
    //     title: '请选择乘车人数',
    //     icon: 'error',
    //     duration: 2000
    //   })
    // }
    // if(destination==''){
    //   wx.showToast({
    //     title: '目的地不能为空',
    //     icon: 'error',
    //     duration: 2000
    //   })
    // }
    // if(departure==''){
    //   wx.showToast({
    //     title: '出发地不能为空',
    //     icon: 'error',
    //     duration: 2000
    //   })
    // }

    // console.log(departure)
    // console.log(destination)
    // console.log(people[peopleIndex])
    // console.log(departureTime)
    // console.log(postscript)

  },
  
})