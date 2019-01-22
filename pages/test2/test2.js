Page({
  data: {
    text1: "圆魄上寒空,皆言四海同.安知千里外,不有雨兼风.",
    text2: "圆魄上寒空,皆言四海同.",
    space: "emsp",
    text3: "圆   魄上寒空,皆言四海同.安知千里外,不有雨兼风.",
  },
  onLoad() {
    let textArr = [...this.data.text3];
    console.log(textArr);
    this.setData({
      textArr: textArr
    });
    // let doubleArr1000 = [168, 171, 169, 165, 198, 165, 167, 173, 168, 172, 166, 173, 166, 169, 164, 165, 169, 171, 162, 167];
    // let singleArr1000 = [191, 166, 167, 180, 172, 162, 172, 187, 178, 182, 159, 179, 171, 159, 165, 177, 172, 167, 171, 162];
    // let doubleArr10000 = [1613, 1503, 1530, 1482, 1623, 1503, 1533, 1567, 1494, 1547, 1503, 1539, 1575, 1633, 1473, 1655];
    // let singleArr10000 = [1428, 1484, 1488, 1599, 1599, 1603, 1553, 1476, 1568, 1525, 1444, 1460, 1524, 1468, 1496, 1592];
    // console.log("doubleArr1000", this.avgArr(doubleArr1000));
    // console.log("singleArr1000", this.avgArr(singleArr1000));
    // console.log("doubleArr10000", this.avgArr(doubleArr10000));
    // console.log("singleArr1000", this.avgArr(singleArr10000));
  },
  onReady() {
    console.log("onReady");
    // const query = wx.createSelectorQuery();
    // query.selectAll("#test1,#test2").boundingClientRect();
    // query.selectViewport().scrollOffset();
    // query.exec(function (res) {
    //   console.log(res);
    // });

    // const query = wx.createSelectorQuery();
    // query.selectAll("#test1,#test2,#test3,#test4").boundingClientRect(function (res) {
    //   console.log(res);
    // }).exec();

    const queryArr = wx.createSelectorQuery();
    queryArr.selectAll(".arr-text,.arr-view").boundingClientRect(function (res) {
      console.log("arr", res);
    }).exec();
  },
  avgArr(arr) {
    let sum = 0, len = arr.length;
    for (let i = 0; i < len; i++) {
      sum += arr[i];
    }
    return sum / len;
  }
})