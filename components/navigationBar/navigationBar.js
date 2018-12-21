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
    if (screenHeight === windowHeight || (system === "android" && screenHeight - windowHeight === 54) || (system === "ios" && screenHeight - windowHeight === 48)) {
      let currentPages = getCurrentPages();
      this.setData({
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