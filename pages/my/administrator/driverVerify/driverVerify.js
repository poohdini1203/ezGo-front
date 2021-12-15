const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driverRequests:[],
  },
  onShow(){
    this.getDriverRequests();
  },
  getDriverRequests(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/admin/getDriverRequests',
        data:{
          
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      that.setData({
        driverRequests:res.data.driverRequests
      })
    })
  },
  toDetail(e){
    console.log(e);
    let driverID=e.currentTarget.dataset.driverId
    wx.navigateTo({
      url: 'driverDetail/driverDetail?driverID='+driverID,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  pass(e){
    let driverID=e.currentTarget.dataset.driverId
    let that=this
    wx.showModal({
      title: '确认通过吗?',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确认',
      confirmColor: '#3CC51F',
      success: (result) => {
        //点确认
        if(result.confirm){
          new Promise((resolve,reject)=>{
            wx.request({
              url:app.globalData.IP+'/admin/passRequest',
              data:{
                driverID:driverID
              },
              success: (res)=>{
                resolve(res)
              },
            })
          }).then(res=>{
            that.remove(driverID)
            wx.showToast({
              title: '通过成功！',
              icon: 'none',
              image: '',
              duration: 1500,
            });
          })
        }
      },
    });
  },
  reject(e){
    let driverID=e.currentTarget.dataset.driverId
    let that=this
    wx.showModal({
      title: '确认拒绝吗?',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确认',
      confirmColor: '#3CC51F',
      success: (result) => {
        //点确认
        if(result.confirm){
          new Promise((resolve,reject)=>{
            wx.request({
              url:app.globalData.IP+'/admin/rejectRequest',
              data:{
                driverID:driverID
              },
              success: (res)=>{
                resolve(res)
              },
            })
          }).then(res=>{
            that.remove(driverID)
            wx.showToast({
              title: '拒绝成功！',
              icon: 'none',
              image: '',
              duration: 1500,
            });
          })
        }
      },
    });
  },
  remove(driverID){
    let that=this
    let Requests=that.data.driverRequests
    let res=[]
    for(let i=0;i<Requests.length;i++){
       if(Requests[i].id!=driverID){
         res.push(Requests[i])
       }
    }
    that.setData({
      driverRequests:res
    })
  }
})