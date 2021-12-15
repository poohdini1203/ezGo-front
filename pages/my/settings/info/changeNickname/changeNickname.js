const app = getApp();
Page({

  
  data: {
    nickName:''
  },

  
  onShow: function () {
    this.setData({
      nickName:app.globalData.userInfo.nickName
    })
  },

  changeNickname(){
    return new Promise((resolve,reject)=>{
      let openid=app.globalData.userInfo.openID
      let nick=this.data.nickName
      wx.request({
        url: 'http://localhost:8080/userInfo/changeNickname',
        data: {
          "openID":openid,
          "nickName":nick
        },
        success: (res)=>{
          resolve(res);
        },
      });
    })
  },

  formSubmit(e){
      let nick=e.detail.value.nickName
      if(nick==null){
        wx.showToast({
          title: '昵称不能为空！',
          icon: 'none',
          image: '',
          duration: 1500,
        });
        return
      }
      wx.showModal({
        title: '确认修改吗？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            this.setData({
              nickName:nick
            })
            this.changeNickname().then(res=>{
              if(res.data.result=='0'){
                wx.showToast({
                  title: '修改成功！',
                  icon: 'none',
                  image: '',
                  duration: 1500,
                 });
                
                 //修改全局变量
                 app.globalData.userInfo.nickName=nick
                //返回上一页
                 setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                 }, 1500);
              }else{
                wx.showToast({
                  title: '修改失败！',
                  icon: 'none',
                  image: '',
                  duration: 3000,
                 });
              }
            })
          }
        },
      });
  }
})