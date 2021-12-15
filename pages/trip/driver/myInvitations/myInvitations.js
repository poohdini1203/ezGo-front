const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripInfo:{},//{"canceled":false,"createTime":1618298913000,"currentPeople":0,"departTime":1618374630000,"departure":"四川大学(江安校区)-南2门","departureCoordinate":"30.552619,103.999435","destination":"电子科技大学(沙河校区)","destinationCoordinate":"30.675678698,104.100265349","driverID":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","driverInfo":{"active":true,"carImgUrl":"---http://localhost:8080/driver/odmpK5FwPt_nPDE4XJpk2iU9j0tM/carImg/53dfc405b2e748abb1019824d4a201cc.jpeg","drivingLicenceUrl":"---http://localhost:8080/driver/odmpK5FwPt_nPDE4XJpk2iU9j0tM/drivingLicence/64e9a8bf701249dca7e1d2ec122a00e7.jpg","iDCardUrl":"---http://localhost:8080/driver/odmpK5FwPt_nPDE4XJpk2iU9j0tM/IDCard/efc2c3699aba4f62a8c091b9471c16de.jpeg","id":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","model":"保时捷","plateNumber":"川A123","userInfo":{"avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/ehLbSVp27w135rR6wa2hLicxJRSz5239bo6QLW9taa5AISOERr304p4EaicksDgjVdMicdViaibrx35ibWwwnfxFgdpg/132","cellphone":"18780075098","iDCard":"522724199812033152","id":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","name":"clx","nickName":"chillyP"},"vehicleLicenceUrl":"---http://localhost:8080/driver/odmpK5FwPt_nPDE4XJpk2iU9j0tM/vehicleLicence/58aa6d208fb8462e93b5e18098af7a4d.jpg","verified":false},"finished":false,"id":3,"postscript":"后备箱有东西","seatCapacity":4},
    invitations:[]//[{"canceled":false,"createTime":1618229541000,"departTime":1618233010000,"departure":"四川大学(江安校区)","departureCoordinate":"30.557546248,103.999150124","destination":"电子科技大学(沙河校区)","destinationCoordinate":"30.675678698,104.100265349","finished":false,"hasDriver":false,"howManyPeople":3,"id":10,"passengerID":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","pickedUp":false,"postscript":"","userInfo":{"avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/ehLbSVp27w135rR6wa2hLicxJRSz5239bo6QLW9taa5AISOERr304p4EaicksDgjVdMicdViaibrx35ibWwwnfxFgdpg/132","cellphone":"18780075098","iDCard":"522724199812033152","id":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","name":"clx","nickName":"chillyP"}},{"canceled":false,"createTime":1617699882000,"departTime":1617703440000,"departure":"四川大学(江安校区)","departureCoordinate":"30.557546248,103.999150124","destination":"四川大学(望江校区)","destinationCoordinate":"30.630319,104.083767","finished":false,"hasDriver":false,"howManyPeople":1,"id":4,"passengerID":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","pickedUp":true,"postscript":"大件行李","userInfo":{"avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/ehLbSVp27w135rR6wa2hLicxJRSz5239bo6QLW9taa5AISOERr304p4EaicksDgjVdMicdViaibrx35ibWwwnfxFgdpg/132","cellphone":"18780075098","iDCard":"522724199812033152","id":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","name":"clx","nickName":"chillyP"}},{"canceled":false,"createTime":1617700533000,"departTime":1617703440000,"departure":"四川大学(江安校区)","departureCoordinate":"30.557546248,103.999150124","destination":"四川大学(望江校区)","destinationCoordinate":"30.630319,104.083767","finished":false,"hasDriver":false,"howManyPeople":1,"id":5,"passengerID":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","pickedUp":false,"postscript":"大件行李","userInfo":{"avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/ehLbSVp27w135rR6wa2hLicxJRSz5239bo6QLW9taa5AISOERr304p4EaicksDgjVdMicdViaibrx35ibWwwnfxFgdpg/132","cellphone":"18780075098","iDCard":"522724199812033152","id":"odmpK5FwPt_nPDE4XJpk2iU9j0tM","name":"clx","nickName":"chillyP"}}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let str=options.tripInfoStr
    let tripInfo=JSON.parse(str)
    let that=this
    that.setData({
      tripInfo:tripInfo
    })
    that.getInvitations()
  },
  getInvitations(){
    let that=this
    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/mapping/getPassengerInvitations',
        data:{
          'driverTripID':that.data.tripInfo.id,
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      
      that.setData({
        invitations:res.data.invitations
      })
    })
  },
  accept(e){ 
    let that=this
    let passengerTripID=e.currentTarget.dataset.passengerTripId
    let tripInfo=that.data.tripInfo
    let invitations=that.data.invitations
    //检查坐得下吗
    let howManyPeople=0
    for(let i=0;i<invitations.length;i++){
      if(invitations[i].id==passengerTripID){
        howManyPeople=invitations[i].howManyPeople
      }
    }

    let avaliableSeat=tripInfo.seatCapacity-tripInfo.currentPeople
    if(avaliableSeat>=howManyPeople){
      tripInfo.currentPeople=tripInfo.currentPeople+howManyPeople
      that.setData({
        tripInfo:tripInfo
      })
      //request
      new Promise((resolve,reject)=>{
        wx.request({
          url:app.globalData.IP+'/mapping/driverAcceptInvitation',
          data:{
            driverTripID:that.data.tripInfo.id,
            passengerTripID:passengerTripID
          },
          success: (res)=>{
            resolve(res)
          },
        })
      }).then(res=>{
        if(res.data.result=="1"){
          that.remove(passengerTripID)
          wx.showToast({
            title: '乘客已经被接单!',
            icon: 'none',
            duration: 1500
          })
        }else{
        //从数组中删除并修改人数
         that.remove(passengerTripID)

          wx.showToast({
            title: '接受成功!',
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
    else{
      wx.showToast({
        title: '坐不下啦!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
  },
  refuse(e){
    let that=this
    console.log(e);
    let passengerTripID=e.currentTarget.dataset.passengerTripId

    new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/mapping/driverRefuseInvitation',
        data:{
          driverTripID:that.data.tripInfo.id,
          passengerTripID:passengerTripID
        },
        success: (res)=>{
          resolve(res)
        },
      })
    }).then(res=>{
      if(res.data.result=="0"){
        wx.showToast({
          title: '拒绝成功!',
          icon: 'none',
          duration: 1500
        })
      }
    })
    //request
    that.remove(passengerTripID)
  },

  remove(passengerTripID){
    let that=this
    let invitations=that.data.invitations
    let res=[]
    for(let i=0;i<invitations.length;i++){
       if(invitations[i].id!=passengerTripID){
         res.push(invitations[i])
       }
    }
    that.setData({
      invitations:res
    })
  }
})