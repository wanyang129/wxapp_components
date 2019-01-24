const app = getApp();
Component({
  properties: {
    // 页面标题
    pageTitle: {
      type: String
    },
    // 是否自定义回退事件
    customBack: {
      type: Boolean,
      value: false
    }
  },
  attached() {
    let systemInfo = wx.getSystemInfoSync();
    let screenHeight = systemInfo.screenHeight;
    let windowHeight = systemInfo.windowHeight;
    let system = systemInfo.system.indexOf("Android") > -1 ? "android" : "ios";
    /**
     * navigationStyle:custom(自定义导航栏样式)
     *  screenHeight===windowHeight (无tabar配置)
     *  screenHeight-windowHeight===48 && system==="ios" 苹果手机(非iphoneX)有tabbar
     *  screenHeight-windowHeight===54 && system==="android" 安卓手机(有tabbar).
     *  screenHeight-windowHeight===82 && systemInfo.model.indexOf("iPhone X")>-1 iPhone X并且有tabbar
     */
    if (screenHeight === windowHeight || (system === "android" && screenHeight - windowHeight === 54) || (system === "ios" && screenHeight - windowHeight === 48) || (screenHeight - windowHeight === 82 && systemInfo.model.indexOf("iPhone X") > -1)) {
      let currentPages = getCurrentPages();
      this.setData({
        // 自定义导航栏是否渲染
        isCustom: true,
        showBack: currentPages.length > 1 ? true : false,
        system: system,
        statusBarHeight: systemInfo.statusBarHeight
      });
    }
  },
  methods: {
    routeBack() {
      if (this.properties.customBack) {
        this.triggerEvent("back");
      } else {
        wx.navigateBack();
      }
    }
  }
})