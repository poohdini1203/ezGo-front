const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:'',
    reportList:{}
  },

  onLoad(options){
    this.setData({
      openID:options.openID
    })
    this.getReportList()

  },
  getReportList(){
    let that=this 
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/admin/getReportByUser',
        data:{
          'openID':that.data.openID,
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      that.setData({
        reportList:res.data.reportList
      })
    })
  }
  
})