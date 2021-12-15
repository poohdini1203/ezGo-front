const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellphone:'',
    verificationCode:"",
    codeButtonName:"获取验证码",
    codeButtonHide:true,
    codeButtonDisable:false,
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.setData({
        cellphone:app.globalData.userInfo.cellphone
      })
  },

  getCellphone(e){
    let p=e.detail.value;
    if(p.length==11){
      this.setData({
        cellphone:p,
        codeButtonHide:false
      })
    }
    else{
      this.setData({
        codeButtonHide:true
      })
    }
  },

  getVerificationCode(){
    let that=this
    let phone=this.data.cellphone
    let myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if(!myreg.test(phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        image: '',
        duration: 1500,
      });
    }else{
      wx.request({
        url: 'http://localhost:8080/verify/cellphone',
        header:{
          openID:app.globalData.userInfo.openID,
          token:app.globalData.token
       },
        data: {
          templateCode:'905725',
          cellphone:phone
        },
        success: (res)=>{
          this.setData({
            verificationCode:res.data.varificationCode
          })

        },
      });

      that.setData({
        codeButtonDisable:true
      })
      var num = 61;
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          that.setData({
            codeButtonName: '重新发送',
            codeButtonDisable: false
          })
        } else {
          that.setData({
            codeButtonName: num + "s",
          })
        }
      }, 1000)
    

    }
  },
  
  changeCellphone(){
    return new Promise((resolve,reject)=>{
      let openid=app.globalData.userInfo.openID;
      let phone=this.data.cellphone
      wx.request({
        url: 'http://localhost:8080/userInfo/changeCellphone',
        data: {
          "openID":openid,
          "cellphone":phone
        },
        success: (res)=>{
          resolve(res);
        },
      });
    })
  },
  formSubmit(e){
    let code=e.detail.value.code
    let phone=e.detail.value.cellphone
    if((phone.length==0)||(code.length==0)||(code!=this.data.verificationCode)||(phone!=this.data.cellphone)){
      wx.showToast({
        title: '手机验证码错误！',
        icon: 'none',
        image: '',
        duration: 3000,
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
          this.changeCellphone().then(res=>{
            //等待后台结果
            if(res.data.result=='0'){
             wx.showToast({
               title: '修改成功！',
               icon: 'none',
               image: '',
               duration: 1500,
              });
             
              //修改全局变量
              app.globalData.userInfo.cellphone=phone
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