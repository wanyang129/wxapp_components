const app = getApp();
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    tabs: {
      type: Number,
      observer: function () {
        this.init();
      }
    },
    // tab栏的标题名
    tabName: {
      type: String,
      value: "材料"
    },
    paddingBottom: {
      type: Number,
      value: 0
    },
    tabIndex: {
      type: Number,
      value: 0
    }
  },
  data: {
    viewIndex: 0,
    animationData: {},
  },
  methods: {
    init: function () {
      let tabs = this.properties.tabs;
      let extra = app.globalData.system === "android" ? 48 : 44;
      // 一页显示几个标签
      let showNum = Math.min(tabs, 5);
      let tabSpacing = 750 / showNum;
      this.lastIndex = this.properties.tabIndex;
      this.setData({
        tabIndex: this.properties.tabIndex,
        tabSpacing: tabSpacing,
        left: this.data.tabIndex * tabSpacing + (tabSpacing - 110) / 2 + "rpx",
        tabWidth: tabs * 750 / showNum + "rpx",
        swiperHeight: app.globalData.screenHeight - app.globalData.statusBarHeight - 30 - extra
      });
    },
    tabClick: function (e) {
      this.lastIndex = this.properties.tabIndex;
      let index = e.currentTarget.dataset.index;
      this.setAnimation(index);
    },
    // 轮播图滑动
    swiperChange: function (e) {
      this.lastIndex = this.properties.tabIndex;
      let current = e.detail.current;
      this.setAnimation(current, "swiper");
    },
    // 轮播图动画结束时触发事件
    swiperAnimation: function (e) {
      if (e.detail.current === this.properties.tabs - 1) {
        if (e.detail.current === this.lastIndex) {
          this.triggerEvent("swiperend");
        } else {
          this.lastIndex = e.detail.current;
        }
      }
    },
    // 绿条动画效果
    setAnimation: function (index, type) {
      if (this.data.tabIndex !== index || type === "swiper") {
        let tabs = this.properties.tabs;
        let viewIndex = 0;
        // tab标题大于5
        if (tabs > 5) {
          if (index <= 1) {
            viewIndex = 0;
          } else if (index > 1 && index < tabs - 2) {
            viewIndex = index - 2;
          } else {
            viewIndex = tabs - 4
          }
        }
        let left = index * this.data.tabSpacing + (this.data.tabSpacing - 110) / 2;
        // 绿条动画
        let animation = wx.createAnimation({
          duration: 500
        });
        animation.left(left + "rpx").step();
        this.setData({
          viewIndex: viewIndex,
          tabIndex: index,
          left: left + "rpx",
          animationData: animation.export()
        });
        this.triggerEvent("tabIndexFn", { tabIndex: this.data.tabIndex });
      }
    }
  }
})
