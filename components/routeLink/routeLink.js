Component({
  properties: {
    // 跳转路由地址
    url: {
      type: String
    },
    // 打开方式
    openType: {
      type: String,
      value: "navigate"
    },
    delta: {
      type: Number,
      value: 1
    },
    // 点击时添加自定义事件
    isCustom: {
      type: Object
    },
    // 在哪个目标上发生跳转
    target: {
      type: String,
      value: "self"
    },
    appId: {
      type: String
    }
  },
  attached() {
    this.page_flag = true;
  },
  methods: {
    initFlag() {
      if (!this.page_flag) {
        this.page_flag = true;
      }
    },
    // 路由跳转
    pageRoute() {
      if (this.page_flag) {
        this.page_flag = false;
        if (this.properties.isCustom && this.properties.isCustom.event) {
          this.properties.isCustom.event();
        }
        // 小程序内部跳转
        if (this.properties.target === "self") {
          switch (this.properties.openType) {
            case 'navigate':
              wx.navigateTo({
                url: this.properties.url,
                success: () => {
                  this.initFlag();
                }
              });
              break;
            case 'redirect':
              wx.redirectTo({
                url: this.properties.url
              });
              break;
            case 'switchTab':
              wx.switchTab({
                url: this.properties.url,
                success: () => {
                  this.initFlag();
                }
              });
              break;
            case 'reLaunch':
              wx.reLaunch({
                url: this.properties.url
              });
              break;
            case 'navigateBack':
              wx.navigateBack({
                delta: this.properties.delta
              });
              break;
          }
        } else if (this.properties.target === "miniProgram") {
          wx.navigateToMiniProgram({
            appId: this.properties.appId,
            path: this.properties.url,
            success: () => {
              this.initFlag();
            }
          })
        }
      }
    }
  }
})