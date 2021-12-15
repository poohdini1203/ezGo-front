Component({
  data: {
    fullStarUrl: '../../images/star_full.png', //满星图片（ps:这里的图片你们自己引入）
    nullStarUrl: '../../images/star_empty.png', //空星图片
    callStarUrl: '../../images/star_half.png', //半星图片
    scoreArray: [1, 2, 3, 4, 5], //分为1-5个评分层次
  },
  properties: {
    score: {  //评价分数
      type: Number, 
      value:0
    },
  },

  methods:{
    changeScore: function (e) {
        var that = this;
        var num = 0; //临时数字,动态确定要传入的分数
        var touchX = e.touches[0].pageX - e.currentTarget.offsetLeft; //获取当前触摸点X坐标
        console.log(touchX)
        var starMinX = 0; //最左边第一颗星的X坐标,假设距离页面距离为0
        var starWidth = 30; //星星图标的宽度,假设30(已在wxss文件中设置".star")
        var starLen = 10; //星星之间的距离假设为10(已在wxss文件中设置".starLen")
        var starMaxX = starWidth * 5 + starLen * 4; //最右侧星星最右侧的X坐标,需要加上5个星星的宽度和4个星星间距

        if (touchX > starMinX && touchX < starMaxX) { //点击及触摸的初始位置在星星所在空间之内

          num = (touchX - starMinX) / (starWidth + starLen);

          if (num != that.data.score) { //如果当前得分不等于刚设置的值,才赋值,因为touchmove方法刷新率很高,这样做可以节省点资源
            //半棵星 （这里为了更加清晰使用了if else 不然你可以用三目压缩 或者其他办法 只要你能看得懂 这里主要能实现）
            if (num < 0.5 && num > 0) { // .5
              num = 0.5
            } else if (num < 1 && num > 0.5) { // 1
              num = 1
            } else if (num < 1.5 && num > 1) { // 1.5
              num = 1.5
            } else if (num < 2 && num > 1.5) { // 2
              num = 2
            } else if (num < 2.5 && num > 2) { // 2.5
              num = 2.5
            } else if (num < 3 && num > 2.5) { // 3
              num = 3
            } else if (num < 3.5 && num > 3) { // 3.5
              num = 3.5
            } else if (num < 4 && num > 3.5) { // 4
              num = 4
            } else if (num < 4.5 && num > 4) { // 4.5
              num = 4.5
            } else if (num < 5 && num > 4.5) { // 5
              num = 5
            }
            that.setData({
              score: num,
            })
            // 传递星级过去
            this.triggerEvent('starNum', num)
          }
        } else if (touchX < starMinX) { //如果点击或触摸位置在第一颗星星左边,则恢复默认值,否则第一颗星星会一直存在
          that.setData({
            score: 0,
          })
        }
      }
    },
  
})
