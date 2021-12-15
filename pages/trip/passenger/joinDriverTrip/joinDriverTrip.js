const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    driverTrip:{},
    //乘车人数
    people: [],
    peopleIndex:null,

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tripInfo=JSON.parse(options.str)
    
    let avaliableSeat=tripInfo.seatCapacity-tripInfo.currentPeople
    //设置人数选择数组
    let people=[];
    for(let i=1;i<=avaliableSeat;i++){
      people[i-1]=i;
    }
    this.setData({
      driverTrip:tripInfo,
      people:people
    })
    
  },

  peoplePickerChange(e) {
    this.setData({
      peopleIndex: e.detail.value
    })
  },
  formSubmit(e){
    let that=this
    
    let peopleIndex=that.data.peopleIndex
    let howManyPeople=that.data.people[peopleIndex]
    let postscript=e.detail.value.postscript
    if(peopleIndex==null){
      wx.showToast({
        title: '请选择乘车人数！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.showModal({
      title: '确认加入行程吗？',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确认',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          new Promise((resolve,reject)=>{
            wx.request({
              url:app.globalData.IP+'/mapping/passengerJoinDrvier',
              data:{
                'passengerID':"odmpK5FwPt_nPDE4XJpk2iU9j0tM",
                'driverTrip':that.data.driverTrip,
                'howManyPeople':howManyPeople,
                'postscript':postscript
              },
              success: (res)=>{
                resolve(res)
              },
            })
          }).then(res=>{
              if(res.data.result=='0'){
                wx.showToast({
                  title: '加入成功！',
                  icon: 'none',
                  duration: 1500
                })
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 3
                  })
                },1500)
              }
          })
        }
      },
     
    });
    
  }
})