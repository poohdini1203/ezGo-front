// app.js
App({
  onLaunch() {
      // setInterval(() => {
        
      //   var curPages =  getCurrentPages();
        
      //   if(!this.globalData.isLogin&&curPages[0].route!="pages/my/index/index"){
      //     wx.showModal({
      //       title: '请先登录！',
      //       content: '',
      //       showCancel: false,
      //       cancelText: '取消',
      //       cancelColor: '#000000',
      //       confirmText: '去登录',
      //       confirmColor: '#3CC51F',
      //       success: (result) => {
      //         if(result.confirm){
      //           wx.switchTab({
                  
      //             url: '/pages/my/index/index',
      //             success: (result)=>{
                    
      //             },
      //             fail: ()=>{},
      //             complete: ()=>{}
      //           }); 
      //         }
      //       },
      //       fail: ()=>{},
      //       complete: ()=>{}
      //     });
      //   }
      // }, 300);
    
  },
  checkLogin(){
    let that=this
    if(!that.globalData.isLogin){
      wx.showModal({
        title: '请先登录!',
        content: '',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              url: '/pages/my/index/index',
              success: (result)=>{
                
              },
            }); 
          }
        },
       
      });
      return false
    }
    return true
  },
  checkLoginCancel(){
    let that=this
    if(!that.globalData.isLogin){
      wx.showModal({
        title: '请先登录!',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              url: '/pages/my/index/index',
              success: (result)=>{
                
              },
            }); 
          }
        },
       
      });
      return false
    }
    return true
  },
  checkBind(){
    let that=this
    if(!that.globalData.hasUserInfo){
      wx.showModal({
        title: '请在设置中绑定个人信息!',
        content: '',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              url: '/pages/my/index/index',
              success: (result)=>{
                
              },
            }); 
          }
        },        
      });
      return false
    }
    return true
  },
  checkBindCancel(){
    let that=this
    if(!that.globalData.hasUserInfo){
      wx.showModal({
        title: '请在设置中绑定个人信息!',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              url: '/pages/my/index/index',
              success: (result)=>{
                
              },
            }); 
          }
        },        
      });
      return false
    }
    return true
  },
  checkDriver(){
    let that=this
      if(!that.globalData.isDriver){
        wx.showModal({
          title: '请先完成车主认证！!',
          content: '',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              wx.switchTab({
                url: '/pages/my/index/index',
                success: (result)=>{
                  
                },
              }); 
            }
          },        
        });
        return false
      }
    return true
  },
  checkDriverCancel(){
    let that=this
      if(!that.globalData.isDriver){
        wx.showModal({
          title: '请先完成车主认证！!',
          content: '',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              wx.switchTab({
                url: '/pages/my/index/index',
                success: (result)=>{
                  
                },
              }); 
            }
          },        
        });
        return false
      }
    return true
  },
  globalData: {
    IP:'http://192.168.1.224:8080',
    userInfo: {
      openID:"",
      avatarUrl:"",
      nickName:'',
      name:'',
      IDCard:'',
      cellphone:'',
    },
    token:'',
    isLogin:false,
    isAdmin:false,
    hasUserInfo:false,
    
    //读driver表看审核有没有通过
    isDriver:false,
    
  }
})
