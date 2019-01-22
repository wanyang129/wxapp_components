Component({
  properties: {
    // 需要传入的文本
    text: {
      type: String,
      observer() {
        if (this.properties.selectable) {
          this.setData({
            // 任何定义了遍历器(Iterator)接口的对象都可以用扩展运算符转为真正的数组
            renderText: [...this.properties.text]
          }, () => {
            console.log(this.data.renderText);
            this.getTextOffset();
          })
        }
      }
    },
    // 文本是否可选
    selectable: {
      type: Boolean,
      value: false
    },
    // 是否显示连续空格
    space: {
      type: String,
      value: "false"
    },
    // 是否解码
    decode: {
      type: Boolean,
      value: false
    },
    // 文本字体大小
    fontSize: {
      type: String,
      value: "32rpx"
    }
  },
  methods: {
    // 获取每个字符的位置
    getTextOffset() {
      let textData = [];
      wx.createSelectorQuery().in(this).selectAll(".custom-text-wrapper, .custom-text").boundingClientRect().exec(res => {
        console.log("custom-text all", res);
        console.log("custom-text", res[0]);
        let textArr = res[0];
        this.containerTop = textArr[0].top;
        let lineHeight = textArr[1].height;
        let j = -1;
        for (let i = 1, len = textArr.length; i < len; i++) {
          console.log(textArr[i]);
          // 文字处于第几行
          let lineCount = (textArr[i].top - this.containerTop) / lineHeight;
          if (lineCount !== j) {
            j = lineCount;
            textData[j] = {
              top: textArr[i].top - this.containerTop,
              bottom: textArr[i].bottom - this.containerTop,
              left: textArr[i].left,
              height: textArr[i].height,
              count: j,
              data: [{
                index: textArr[i].dataset.index,
                text: textArr[i].dataset.text,
                left: textArr[i].left,
                right: textArr[i].right,
                width: textArr[i].width,
              }]
            };
          } else {
            textData[j].data.push({
              index: textArr[i].dataset.index,
              text: textArr[i].dataset.text,
              left: textArr[i].left,
              right: textArr[i].right,
              width: textArr[i].width,
            });
          }
        }
        this.textDatas = textData;
        this.setData({
          lineHeight: lineHeight
        });
        console.log("textDatas", this.textDatas);
      })
    },
    // 长按事件
    longPress(e) {

    }
  }
})