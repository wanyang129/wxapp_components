Page({
  onLoad() {
    let systemInfo = wx.getSystemInfoSync();
    console.log("systemInfo", systemInfo);
  },
  data: {
    text: "圆魄上寒空,皆言四海同. 安知千里外,不有雨兼风?",
    fontSize: "64rpx"
  }
})