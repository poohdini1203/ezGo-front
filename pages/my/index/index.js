const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    isLogin:false,
    isAdmin:false,
    avatarUrl:'',
    nickName:'',
    miles:0.0,
    NPO:0,
    NDO:0
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.setData({
      avatarUrl:app.globalData.userInfo.avatarUrl,
      nickName:app.globalData.userInfo.nickName,
    })
  },
  // getOpenId(){
  //   return new Promise((resolve,reject)=>{
  //     wx.login({
  //       //获取code
  //       success: function (res) {
  //         var code = res.code; //返回code
  //         var appId = 'wxe986290470a50e70';
  //         var secret = '33e212107a66ff87a3fa0ccb67ad5dff';
  //         wx.request({
  //           url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
  //           data: {},
  //           header: {
  //             'content-type': 'json'
  //           },
  //           success: function (res) {
  //             resolve(res)
  //           }
  //         })
  //       }
  //     })
  //    })
  // },
  getUserSecret(){
    return new Promise((resolve,reject)=>{
          wx.login({
            //获取code
            success: function (res) {
              var code = res.code; //返回code
              wx.request({
                url: app.globalData.IP+'/login/getUserSecret',
                data: {
                  code:code
                },
                header: {
                  'content-type': 'json'
                },
                success: function (res) {
                  resolve(res)
                }
              })
            }
          })
         })
  },
  getWXUserProfile(){
   return new Promise((resolve,reject)=>{
    let that=this
    let isLogin=app.globalData.isLogin
    if(!isLogin){
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写,
        success: (res) => {

          resolve(res);
        },
        fail:(err)=>{
          console.log(err);
        }
      })
    }
   })
  },

  //获得userInfo
  getUserInfo(id){
    return new Promise((resolve,reject)=>{
      let that=this
      let openID=id
      if(openID!=null){
          wx.request({
            url:app.globalData.IP+'/userInfo/getUserInfoByID',
            header:{
               openID:app.globalData.userInfo.openID,
               token:app.globalData.token
            },
            data:{
              'openID':openID
            },
            success: (res)=>{
              resolve(res)
            },
          })
      }
    })
  },
  //获得司机信息
  getDriverInfo(id){
    return new Promise((resolve,reject)=>{
      let that=this
      let openID=id
      if(openID!=null){
          wx.request({
            url:app.globalData.IP+'/driver/getDriverInfoByID',
            data:{
              'openID':openID
            },
            success: (res)=>{
              resolve(res)
            },
          })
      }
    })
  },
  verifyAdmin(id){
    return new Promise((resolve,reject)=>{
      let that=this
      let openID=id
      if(openID!=null){
          wx.request({
            url:app.globalData.IP+'/admin/verifyAdmin',
            data:{
              'openID':openID
            },
            success: (res)=>{
              resolve(res)
            },
          })
      }
    })
  },

  //获得微信头像、昵称
  //获得openid
  //用openid获得后台用户信息
  wxLogin(){
    let that=this
    console.log('tap');
    that.getWXUserProfile().then(userProfileRes=>{
        that.getUserSecret().then(res=>{
            console.log(res);
            console.log(new Date().toLocaleTimeString());
            //设置openid
            let openid=res.data.openid
            let token=res.data.token
            app.globalData.userInfo.openID=openid
            app.globalData.token=token
            //验证是否是管理员
            that.verifyAdmin(openid).then(res=>{
              if(res.data.result=='0'){
                app.globalData.isAdmin=true
                that.setData({
                  isAdmin:true
                })
              }
            })
            //获取用户数据
            that.getUserInfo(openid).then(res=>{
              //token错误
              if(res.data.code=='1')
                return;
              
              let userInfo=res.data.userInfo
              //被拉入黑名单了
              if(userInfo!=null&&userInfo.forbidden){
                wx.showToast({
                  title: '登录失败!账号已被拉入黑名单',
                  icon: 'none',
                  image: '',
                  duration: 3000,
               });
                return
              }
              //没有用户数据,头像和昵称默认用微信的
              if(userInfo==null){
                wx.showToast({
                  title: '请在设置中绑定个人信息!',
                  icon: 'none',
                  image: '',
                  duration: 3000,
               });
               app.globalData.userInfo.avatarUrl=userProfileRes.userInfo.avatarUrl
               app.globalData.userInfo.nickName=userProfileRes.userInfo.nickName
              }
              //获得用户数据
              //还需获得里程信息
              else{
                 app.globalData.hasUserInfo=true
                 app.globalData.userInfo.cellphone=userInfo.cellphone
                 app.globalData.userInfo.name=userInfo.name
                 app.globalData.userInfo.IDCard=userInfo.iDCard
                 app.globalData.userInfo.avatarUrl=userInfo.avatarUrl
                 app.globalData.userInfo.nickName=userInfo.nickName

                 //获得司机信息
                that.getDriverInfo(openid).then(res=>{
                   let driverInfo=res.data.driverInfo
                   if(driverInfo!=null&&driverInfo.verified==true&&driverInfo.active==true){
                    app.globalData.isDriver=res.data.driverInfo.active
                   }
                })
              }
              app.globalData.isLogin=true
              that.setData({
                isLogin:true,
                avatarUrl:app.globalData.userInfo.avatarUrl,
                nickName:app.globalData.userInfo.nickName,
              })
            })

        })
        console.log('global:');
        console.log(app.globalData);
    })
  }
  
})