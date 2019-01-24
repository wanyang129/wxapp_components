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
  data: {
    selectIndex: -1,
    selects: [],
    btns: [
      { id: "note", text: "笔记" },
      { id: "line", text: "下划线" },
      { id: "copy", text: "复制" }
    ]
  },
  attached() {
    let systemInfo = wx.getSystemInfoSync();
    console.log("systemInfo", systemInfo);
    this.setData({
      screenWidth: systemInfo.screenWidth
    });
  },
  methods: {
    // 获取每个字符的位置
    getTextOffset() {
      let textData = [];
      wx.createSelectorQuery().in(this).selectAll(".custom-text-wrapper, .custom-text").boundingClientRect().exec(res => {
        // console.log("custom-text all", res);
        // console.log("custom-text", res[0]);
        let textArr = res[0];
        // 文本容器具页面顶部的高度
        this.containerTop = textArr[0].top;
        let lineHeight = textArr[1].height;
        let j = -1;
        for (let i = 1, len = textArr.length; i < len; i++) {
          // console.log(textArr[i]);
          // 文字处于第几行
          let lineCount = (textArr[i].top - this.containerTop) / lineHeight;
          if (lineCount !== j) {
            j = lineCount;
            textData[j] = {
              // 文本行的top距离
              top: textArr[i].top - this.containerTop,
              // 文本行的bottom距离
              bottom: textArr[i].bottom - this.containerTop,
              // 文本行的左边距
              left: textArr[i].left,
              // 文本行的高度
              height: textArr[i].height,
              // 文本行的行数(从0开始)
              count: j,
              // 文本行中的文字(数组)
              data: [{
                // 在整个文本中的下标(从0开始)
                index: textArr[i].dataset.index,
                // 文本内容
                text: textArr[i].dataset.text,
                // 左边距
                left: textArr[i].left,
                // 右边距
                right: textArr[i].right,
                // 宽度=右边距-左边距
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
      console.log("longPress", e);
      this.touch = 1;
      if (this.properties.selectable) {
        // 支持长按事件
        let minIndex = -1, maxIndex = -1, minStyle = "", maxStyle = "", highlights = [];
        let count = Math.floor((e.detail.y - this.containerTop) / this.data.lineHeight);
        console.log("count", count);
        console.log(this.textDatas[count]);
        let rowData = this.textDatas[count];
        // 选中文本最小行标
        this.minCount = count;
        // 选中文本最大行标
        this.maxCount = count;
        for (let j = 0, colLen = rowData.data.length; j < colLen; j++) {
          if (e.detail.x >= rowData.data[j].left && e.detail.x <= rowData.data[j].right) {
            // 选中文本最小下标
            minIndex = rowData.data[j].index;
            // 选中文本最大下标
            maxIndex = rowData.data[j].index;
            // 最小行标
            this.minCountIndex = j;
            // 最大行标
            this.maxCountIndex = j;
            // 前游标的位置样式
            minStyle = "left:" + (rowData.data[j].left - 5) + "px;top:" + rowData.top + "px;";
            // 后游标的位置样式
            maxStyle = "left:" + (rowData.data[j].right - 5) + "px;top:" + rowData.top + "px;";
            highlights.push({
              id: 0,
              style: "left:" + rowData.data[j].left + "px;top:" + rowData.top + "px;width:" + rowData.data[j].width + "px;",
            });
            break;
          }
        }
        this.minIndex = minIndex;
        this.maxIndex = maxIndex;
        this.setData({
          // 覆盖在文本上的透明层
          highlights: highlights,
          // 是否展示高亮选中
          showHighlight: true,
          minStyle: minStyle,
          maxStyle: maxStyle
        })
      }
    },
    // 点击事件
    textTap(e) {
      if (this.data.selectModal) {
        this.closeSelectModal();
      }
    },
    // 长按结束事件
    textTouchEnd(e) {
      if (this.properties.selectable && this.touch === 1) {
        this.showSelectModal();
      }
      this.touch = -1;
    },
    // 前游标触摸开始事件
    minTouchStart(e) {
      this.closeSelectModal();
    },
    // 前游标触摸移动事件
    minTouchMove(e) {
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY;
      let minStyle = "";
      let count = Math.floor((pageY - this.containerTop) / this.data.lineHeight);
      let textDatas = this.textDatas;
      if (count < 0) {
        // 前游标移动到文本第一行上面
        this.minCount = 0;
        this.minIndex = 0;
        this.minCountIndex = 0;
        minStyle = "left:" + (textDatas[0].left - 5) + "px;top:" + textDatas[0].top + "px;";
      } else if (count >= 0 && count <= this.maxCount) {
        // 前游标在第一行和后游标所在行之间移动
        this.minCount = count;
        // 前游标所在行的数据
        let textRow = textDatas[count].data;
        // 前游标所在行的数据的长度
        let colLen = textRow.length;
        for (let j = 0; j < colLen; j++) {
          if (pageX >= textRow[j].left && pageX <= textRow[j].right) {
            if (count === this.maxCount && j > this.maxCountIndex) {
              this.minIndex = this.maxIndex;
              this.minCountIndex = this.maxCountIndex;
              minStyle = "left:" + (textRow[this.minCountIndex].left - 5) + "px;top:" + textDatas[count].top + "px;";
            } else {
              this.minIndex = textRow[j].index;
              // 选中的最小行
              this.minCountIndex = j;
              minStyle = "left:" + (textRow[j].left - 5) + "px;top:" + textDatas[count].top + "px;";
            }
            break;
          }
        }
      } else if (count > this.maxCount) {
        // 前游标移动到后游标所在行的下面
        this.minCount = this.maxCount;
        this.minIndex = this.maxIndex;
        this.minCountIndex = this.maxCountIndex;
        minStyle = "left:" + (textDatas[this.minCount].data[this.minCountIndex].left - 5) + "px;top:" + textDatas[this.maxCount].top + "px;";
      }
      let highlights = this.getHighlights();
      this.setData({
        highlights: highlights,
        minStyle: minStyle
      })
    },
    // 前游标触摸结束事件
    minTouchEnd(e) {
      this.showSelectModal();
    },
    // 后游标触摸开始事件
    maxTouchStart(e) {
      this.closeSelectModal();
    },
    // 后游标触摸移动事件
    maxTouchMove(e) {
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY;
      let maxStyle = "";
      let count = Math.floor((pageY - this.containerTop) / this.data.lineHeight);
      let textDatas = this.textDatas;
      let tlen = textDatas.length;
      if (count > tlen - 1) {
        // 后游标移动到文本最后一行的下面
        this.maxCount = tlen - 1;
        let dlen = textDatas[tlen - 1].data.length;
        this.maxIndex = textDatas[tlen - 1].data[dlen - 1].index;
        this.maxCountIndex = dlen - 1;
        maxStyle = "left:" + (textDatas[tlen - 1].data[dlen - 1].right - 5) + "px;top:" + textDatas[tlen - 1].top + "px;";
      } else if (count <= tlen - 1 && count >= this.minCount) {
        // 后游标在文本最后一行和前游标所在行之间移动
        let textRow = textDatas[count].data;
        this.maxCount = count;
        let colLen = textRow.length;
        let j = 0;
        for (; j < colLen; j++) {
          if (pageX >= textRow[j].left && pageX <= textRow[j].right) {
            if (count === this.minCount && j < this.minCountIndex) {
              console.log("移到前游标前面了");
              this.maxIndex = this.minIndex;
              this.maxCountIndex = this.minCountIndex;
              maxStyle = "left:" + (textRow[this.maxCountIndex].right - 5) + "px;top:" + textDatas[count].top + "px;";
            } else {
              console.log("在前游标后面");
              this.maxIndex = textRow[j].index;
              this.maxCountIndex = j;
              maxStyle = "left:" + (textRow[j].right - 5) + "px;top:" + textDatas[count].top + "px";
            }
            break;
          }
        }
        if (j >= colLen) {
          this.maxIndex = textRow[j - 1].index;
          this.maxCountIndex = j - 1;
          maxStyle = "left:" + (textRow[j - 1].right - 5) + "px;top:" + textDatas[count].top + "px";
        } else if (j <= 0) {
          this.maxCount = count - 1;
          let len = textDatas[count - 1].data.length;
          this.maxIndex = textDatas[count - 1].data[len - 1].index;
          this.maxCountIndex = len - 1;
          maxStyle = "left:" + (textDatas[count - 1].data[len - 1].right - 5) + "px;top:" + textDatas[count - 1].top + "px";
        }
      } else if (count < this.minCount) {
        // 后游标移动到前游标所在行的上面
        this.maxCount = this.minCount;
        this.maxIndex = this.minIndex;
        this.maxCountIndex = this.minCountIndex;
        maxStyle = "left:" + (textDatas[this.maxCount].data[this.maxCountIndex].right - 5) + "px;top:" + textDatas[this.maxCount].top + "px;";
      }
      let highlights = this.getHighlights();
      this.setData({
        highlights: highlights,
        maxStyle: maxStyle
      });
    },
    // 后游标触摸结束事件
    maxTouchEnd(e) {
      this.showSelectModal();
    },
    // 关闭操作按钮
    closeSelectModal() {
      this.setData({
        selectModal: false
      })
    },
    // 显示操作按钮
    showSelectModal() {
      let direction, modalStyle = "", textDatas = this.textDatas;
      if (textDatas[this.minCount].top + this.containerTop < 50) {

        // 选中文本的第一行距顶部距离小于50,按钮层箭头朝上
        direction = "up";
        modalStyle += "top:" + (textDatas[this.maxCount].bottom + 18) + "px;";
      } else {
        // 箭头朝下
        direction = "down";
        modalStyle += "top:" + (textDatas[this.minCount].top - 48) + "px;";
      }
      // 后游标的水平位置在前游标水平位置的后面
      let left = 0, min, max;
      if (this.maxCountIndex > this.minCountIndex) {
        max = textDatas[this.maxCount].data[this.maxCountIndex].right;
        min = textDatas[this.minCount].data[this.minCountIndex].left;
      } else {
        // 后游标的水平位置在前游标的水平位置的前面
        max = textDatas[this.minCount].data[this.minCountIndex].right;
        min = textDatas[this.maxCount].data[this.minCountIndex].left;
      }
      console.log("min", min, "max", max);
      left = (max + min - 200) / 2;
      // 获取按钮层的水平位置
      if (left < 0) {
        left = 0;
      } else if (left + 200 > this.data.screenWidth) {
        left = this.data.screenWidth - 200;
      }
      modalStyle += "left:" + left + "px;";
      this.setData({
        selectModal: true,
        direction: direction,
        modalStyle: modalStyle
      });
    },
    // 获取高亮层
    getHighlights() {
      let textDatas = this.textDatas;
      let highlights = [];
      // 最大行和最小行是同一行(即只有一行的情况)
      if (this.minCount === this.maxCount) {
        let left = textDatas[this.minCount].data[this.minCountIndex].left;
        let width = (textDatas[this.maxCount].data[this.maxCountIndex].right - left);
        highlights.push({
          id: 0,
          style: "left:" + left + "px;top:" + textDatas[this.minCount].top + "px;width:" + width + "px;"
        });
      } else {
        // 多行的情况
        let id = 0;
        for (let i = this.minCount; i <= this.maxCount; i++) {
          let left, width, len = textDatas[i].data.length;
          if (i === this.minCount) {
            left = textDatas[i].data[this.minCountIndex].left;
            width = textDatas[i].data[len - 1].right - left;
          } else {
            left = textDatas[i].left;
            if (i === this.maxCount) {
              width = textDatas[i].data[this.maxCountIndex].right - left;
            } else {
              width = textDatas[i].data[len - 1].right - left;
            }
          }
          highlights.push({
            id: id++,
            style: "left:" + left + "px;width:" + width + "px;top:" + textDatas[i].top + "px;"
          })
        }
      }
      return highlights;
    },
    // 按钮层点击事件
    btnTap(e) {
      console.log("btnTap", e);
      let curObj = e.currentTarget.dataset;
      console.log("curObj", curObj);
      if (curObj.id === "note") {
        // 笔记
        let selects = this.data.selects;
        let len = selects.length;
        selects.push({
          id: len,
          highlights: highlights,
          note: true
        });
      } else if (curObj.id === "line") {
        // 下划线
      } else if (curObj.id === "copy") {
        // 复制
      }
    }
  }
})