Page({
  data: {
    count: 1
  },
  onLoad() {
    let systemInfo = wx.getSystemInfoSync();
    console.log("systemInfo", systemInfo);
    let screenHeight = systemInfo.screenHeight;
    console.log("screenHeight", screenHeight);
    let windowHeight = systemInfo.windowHeight;
    console.log("windowHeight", windowHeight);
    let topHeight = screenHeight - windowHeight;
    console.log("topHeight", topHeight);
    let statusBarHeight = systemInfo.statusBarHeight;
    console.log("statusBarHeight", statusBarHeight);
    console.log("navigationHeight", topHeight - statusBarHeight);
    this.startStamp = new Date().getTime();
  },
  onReady() {
    console.log(new Date().getTime() - this.startStamp);
  }
})