const app = getApp();

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    IDCard:"",

    phone:"",
    verificationCode:"",
    codeButtonName:"获取验证码",
    codeButtonHide:true,
    codeButtonDisable:false,

    
  },

  onShow(){
    if(!app.checkLogin()){
      return
    }
    else if(app.globalData.hasUserInfo){
      wx.showModal({
        title: '您已经绑定过个人信息',
        content: '',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              
              url: '../../index/index',
              success: (result)=>{
                
              },
              fail: ()=>{},
              complete: ()=>{}
            }); 
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
  getPhone(e){
    let p=e.detail.value;
    if(p.length==11){
      this.setData({
        phone:p,
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
    let _this=this
    let phone=this.data.phone
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
        url: app.globalData.IP+'/verify/cellphone',
        header:{
          openID:app.globalData.userInfo.openID,
          token:app.globalData.token
       },
        data: {
          templateCode:'905725',
          cellphone:phone
        },
        success: (res)=>{
          if(res.data.code=='1'){
            console.log('token失效');
            return ;
          }
          if(res.data.code=='0'){
            this.setData({
              verificationCode:res.data.varificationCode
            })
          }
        },
      });

      _this.setData({
        codeButtonDisable:true
      })
      var num = 61;
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          _this.setData({
            codeButtonName: '重新发送',
            codeButtonDisable: false
          })
        } else {
          _this.setData({
            codeButtonName: num + "s",
          })
        }
      }, 1000)
    

    }
  },

  verifyIDCard(e){
    console.log('ID');
    let _this=this
    let name=this.data.name
    let card=this.data.IDCard
    let myreg=/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    
    if(name.length==0){
      wx.showToast({
        title: '请输入正确的姓名',
        icon: 'none',
        image: '',
        duration: 1500,
      });
     
      return ;
    }
    else if(!myreg.test(card)){
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none',
        image: '',
        duration: 1500,
      });
     
      return ;
    }
    else{
      //等待请求结束
      return new Promise((resolve,reject)=>{
        wx.request({
          url:app.globalData.IP+'/verify/IDCard',
          header:{
            openID:app.globalData.userInfo.openID,
            token:app.globalData.token
         },
          data:{
            'name':name,
            'IDCard':card
          },
          success: (res)=>{
            resolve(res)
          },
          
        })
      }
      )     
    }
  },

  submitUserInfo(){
    return new Promise((resolve,reject)=>{
      let userInfo=app.globalData.userInfo
      wx.request({
        url:app.globalData.IP+'/userInfo/addUserInfo',
        data:{
          'userInfo':userInfo
        },
        success: (res)=>{
          resolve(res)
        },
        
      })
    })
  },

  formSubmit(e){
    wx.showModal({
      title: '确认提交？',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let _this=this
          let n=e.detail.value.name
          let ID=e.detail.value.IDCard
          let code=e.detail.value.code
          let phone=e.detail.value.cellphone
          _this.setData({
            name:n,
            IDCard:ID,
            
          })
      
          //等待实名验证请求结束
          _this.verifyIDCard().then(res=>{
           
            if(res.data.code=='1'){
              console.log('token失效');
              return;
            }
            let result=res.data.IDResult
            console.log(result);  
            if(result!='0'){
              wx.showToast({
                title: '实名验证失败!',
                icon: 'none',
                image: '',
                duration: 3000,
              });
              
              return ;
            }
            console.log(code);
            let verificationCode=_this.data.verificationCode
            if(code==null||phone==null||code.length==0||phone.length==0){
              wx.showToast({
                title: '请先进行手机验证！',
                icon: 'none',
                image: '',
                duration: 3000,
             });
            
             return 
            }
            if((code!=verificationCode)||(phone!=_this.data.phone)){
             wx.showToast({
                title: '手机验证码错误！',
                icon: 'none',
                image: '',
                duration: 3000,
             });
            
             return 
           }
            //准备好发给后台的数据
            if(app.globalData.isLogin){
               app.globalData.userInfo.name=n
               app.globalData.userInfo.IDCard=ID
               app.globalData.userInfo.cellphone=phone        
      
            //发送数据
            _this.submitUserInfo().then(res=>{
                console.log(res);
                if(res.data.result=="0"){
                  app.globalData.hasUserInfo=true
                  wx.showToast({
                    title: '绑定成功！',
                    icon: 'none',
                    image: '',
                    duration: 1500,
                 });
                 setTimeout(() => {
                  wx.navigateBack({
                    delta: 2
                  });
                 }, 1500);
                }else{
                  wx.showToast({
                    title: '绑定失败！',
                    icon: 'none',
                    image: '',
                    duration: 1500,
                 });
                }
            })
            }
            
      
          })
        }
      },
      
    });

  }

})