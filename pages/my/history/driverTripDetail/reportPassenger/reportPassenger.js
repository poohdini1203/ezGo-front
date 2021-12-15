const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiverID:'',
    receiverTripID:'',
    reporterID:'',
    reporterTripID:'',
    content:'',

    submited:false
  },

  onLoad(options){
    console.log(options);
    this.setData({
      receiverID:options.receiverID,
      receiverTripID:options.receiverTripID,
      reporterID:options.reporterID,
      reporterTripID:options.reporterTripID,
    })
  },
  textareaAInput(e){
    console.log(e);
    this.setData({
      content:e.detail.value
    })
  },
  tapReport(){
    let that=this 
    let content=that.data.content
    if(content==null||content.length==0){
      wx.showToast({
        title: '举报内容不能为空!',
        icon: 'none',
        duration: 1500,
      });
    }
    else{
      wx.showModal({
        title: '确认提交举报吗?',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
              that.submitReport()
          }
        },
      });
    }
   
  },
  submitReport(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/driverTrip/reportPassenger',
        data:{
          receiverID:that.data.receiverID,
          receiverTripID:that.data.receiverTripID,
          reporterID:that.data.reporterID,
          reporterTripID:that.data.reporterTripID,
          content:that.data.content
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
        if(res.data.result=='0'){
          wx.showToast({
            title: '提交举报成功！',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
        that.setData({
          submited:true
        })
    })
  }
})