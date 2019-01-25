Page({
  onLoad() {
    let systemInfo = wx.getSystemInfoSync();
    console.log("systemInfo", systemInfo);
  },
  data: {
    text: "圆魄上寒空,皆言四海同. 安知千里外,不有雨兼风?绝代有佳人,幽居在空谷.自云良家女,零落依草木.关中昔丧乱,兄弟遭杀戮.官高何足论,不得收骨肉.世情恶衰歇,万事随转烛.夫婿轻薄儿,新人美如玉.合昏尚知时,鸳鸯不独宿.但见新人笑,那闻旧人哭.在山泉水清,出山泉水浊.侍婢卖珠回,牵萝补茅屋.摘花不插发,采柏动盈掬.天寒翠袖薄,日暮倚修竹.",
    fontSize: "64rpx"
  }
})