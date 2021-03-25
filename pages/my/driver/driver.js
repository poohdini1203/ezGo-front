// pages/my/driver/driver.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
  },

  formSubmit() {
    this.uploadFile(0)
  },
  //上传图片
  uploadFile: function (index) {
    var that = this
    //如果所有图片都已经上传完，就不再往下执行
    if (index >= that.data.imgList.length) {
      return
    }
    wx.uploadFile({
      url: 'http://localhost:8080/upload/picture', //自己的Java后台接口地址
      filePath: that.data.imgList[index],
      name: 'content',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
        
      },
      formData: ({ //上传图片所要携带的参数
        username: "编程小石头",
        password: '2501902696'
      }),
      success: function (res) {
        console.log(`第${index+1}张上传成功`, res)
        index++
        that.uploadFile(index)
      },
      fail(res) {
        console.log(`第${index+1}张上传失败`, res)
      }
    })
  },


  ChooseImage() {
    if(this.data.imgList.length<2){
      wx.chooseImage({
        count: 2, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFilePaths)
            })
          } else {
            this.setData({
              imgList: res.tempFilePaths
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
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
})