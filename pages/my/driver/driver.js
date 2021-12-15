const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plateNumber:'',
    model:'',
    IDCard: [],
    drivingLicence:[],
    vehicleLicence:[],
    carImg:[],

    
  },

  onShow(){
    if(!app.globalData.isLogin){
      wx.showModal({
        title: '请先登录！',
        content: '',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '去登录',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              
              url: '../index/index',
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
    else if(!app.globalData.hasUserInfo){
      wx.showModal({
        title: '请在先在设置中绑定个人信息！',
        content: '',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '去绑定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              
              url: '../index/index',
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
    else if(app.globalData.isDriver){
      wx.showModal({
        title: '您已完成司机认证！',
        content: '',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              
              url: '../index/index',
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
  addDriver(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url:app.globalData.IP+'/driver/addDriver',
        data:{
          'openID':app.globalData.userInfo.openID,
          'plateNumber':this.data.plateNumber,
          'model':this.data.model,
          'color':this.data.color
        },
        success: (res)=>{
          console.log('success');
          resolve(res)
        },
      })
    })
  },
  formSubmit(e) {
    let that=this
    
    let plate=e.detail.value.plateNumber
    let model=e.detail.value.model
    let color=e.detail.value.color
    if(plate.length==0){
      wx.showToast({
        title: '请输入正确车牌号！',
        icon: 'none',
        image: '',
        duration: 3000,
     });
     
     return 
    }
    if(model.length==0){
      wx.showToast({
        title: '请输入正确车型！',
        icon: 'none',
        image: '',
        duration: 3000,
     });
     
     return 
    }
    if(color.length==0){
      wx.showToast({
        title: '请输入正确颜色！',
        icon: 'none',
        image: '',
        duration: 3000,
     });
     
     return 
    }

    that.setData({
      plateNumber:plate,
      model:model,
      color:color,
    })
    wx.showModal({
      title: '确认提交申请吗？',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          that.addDriver().then(res=>{
            console.log(res);
            if(res.data.result=='0'){
              that.uploadFile(0,"IDCard",that.data.IDCard)
              that.uploadFile(0,"drivingLicence",that.data.drivingLicence)
              that.uploadFile(0,"vehicleLicence",that.data.vehicleLicence)
              that.uploadFile(0,"carImg",that.data.carImg)
      
              wx.showToast({
                title: '提交成功！',
                icon: 'none',
                image: '',
                duration: 3000,
             });
             setTimeout(() => {
               wx.navigateBack({
                 delta: 1
               });
             }, 1500);
            }else{
              wx.showToast({
                title: '您已提交过申请！',
                icon: 'none',
                image: '',
                duration: 3000,
             });
             setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
            }
          })
        }
      },
    });    
  },

  // uploadID(){
  //   return new Promise((resolve,reject)=>{
  //     this.uploadFile(0,"IDCard",this.data.IDCard)
  //     resolve();
  //   })
  // },

  // uploadDrivingLicence(){
  //   return new Promise((resolve,reject)=>{
  //     this.uploadFile(0,"drivingLicence",this.data.drivingLicence)
  //     resolve();
  //   })
  // },
  // uploadvehicleLicence(){
  //   return new Promise((resolve,reject)=>{
  //     this.uploadFile(0,"vehicleLicence",this.data.vehicleLicence)
  //     resolve();
  //   })
  // },
  // uploadCarImg(){
  //   return new Promise((resolve,reject)=>{
  //     this.uploadFile(0,"carImg",this.data.carImg)
  //     resolve();
  //   })
  // },




  //上传图片
  uploadFile: function (index,category,imageList) {
    var that = this
    //如果所有图片都已经上传完，就不再往下执行
    
    if (index >= imageList.length) {
      return
    }
    wx.uploadFile({
      url: app.globalData.IP+'/driver/uploadPicture', //自己的Java后台接口地址
      filePath: imageList[index],
      name: 'content',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
        
      },
      formData: ({ //上传图片所要携带的参数
        cat:category,
        openID: app.globalData.userInfo.openID,   
      }),
      success: function (res) {
        console.log(category+`第${index+1}张上传成功`, res)
        index++
        that.uploadFile(index,category,imageList)
      },
      fail(res) {
        console.log(category+`第${index+1}张上传失败`, res)
      }
    })
  },


  ChooseIDCard() {
    if(this.data.IDCard.length<2){
      wx.chooseImage({
        count: 2, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.data.IDCard.length != 0) {
            this.setData({
              IDCard: this.data.IDCard.concat(res.tempFilePaths)
            })
          } else {
            this.setData({
              IDCard: res.tempFilePaths
            })
          }
        }
      });
    }else {
      wx.showToast({
        title: '最多上传2张图片',
        icon: 'loading',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },
  ViewIDCard(e) {
    wx.previewImage({
      urls: this.data.IDCard,
      current: e.currentTarget.dataset.url
    });
  },
  DelIDCard(e) {
    wx.showModal({
      
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.IDCard.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            IDCard: this.data.IDCard
          })
        }
      }
    })
  },

  ChooseDriverLicence() {
    if(this.data.drivingLicence.length<2){
      wx.chooseImage({
        count: 2, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.data.drivingLicence.length != 0) {
            this.setData({
              drivingLicence: this.data.drivingLicence.concat(res.tempFilePaths)
            })
          } else {
            this.setData({
              drivingLicence: res.tempFilePaths
            })
          }
        }
      });
    }else {
      wx.showToast({
        title: '最多上传2张图片',
        icon: 'loading',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },
  ViewDriverLicence(e) {
    wx.previewImage({
      urls: this.data.drivingLicence,
      current: e.currentTarget.dataset.url
    });
  },
  DelDriverLicence(e) {
    wx.showModal({
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.drivingLicence.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            drivingLicence: this.data.drivingLicence
          })
        }
      }
    })
  },

  ChooseVehicleLicence() {
    if(this.data.vehicleLicence.length<2){
      wx.chooseImage({
        count: 2, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.data.vehicleLicence.length != 0) {
            this.setData({
              vehicleLicence: this.data.vehicleLicence.concat(res.tempFilePaths)
            })
          } else {
            this.setData({
              vehicleLicence: res.tempFilePaths
            })
          }
        }
      });
    }else {
      wx.showToast({
        title: '最多上传2张图片',
        icon: 'loading',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },
  ViewVehicleLicence(e) {
    wx.previewImage({
      urls: this.data.vehicleLicence,
      current: e.currentTarget.dataset.url
    });
  },
  DelVehicleLicence(e) {
    wx.showModal({
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.vehicleLicence.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            vehicleLicence: this.data.vehicleLicence
          })
        }
      }
    })
  },

  ChooseCarImg() {
    if(this.data.carImg.length<2){
      wx.chooseImage({
        count: 2, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.data.carImg.length != 0) {
            this.setData({
              carImg: this.data.carImg.concat(res.tempFilePaths)
            })
          } else {
            this.setData({
              carImg: res.tempFilePaths
            })
          }
        }
      });
    }else {
      wx.showToast({
        title: '最多上传2张图片',
        icon: 'loading',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },
  ViewCarImg(e) {
    wx.previewImage({
      urls: this.data.carImg,
      current: e.currentTarget.dataset.url
    });
  },
  DelCarImg(e) {
    wx.showModal({
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.carImg.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            carImg: this.data.carImg
          })
        }
      }
    })
  },

})