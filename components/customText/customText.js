Component({
  properties: {
    text: {
      type: String,
      observer() {
        this.getTextOffset();
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
    // 获取屏幕宽度
    this.screenWidth = wx.getSystemInfoSync().screenWidth;
    this.initLineHeight(this.screenWidth);
  },
  detached() {
    // 将选中文本进行缓存
  },
  methods: {
    // 获取文本的坐标位置
    getTextOffset() {
      setTimeout(() => {
        let textData = [];
        wx.createSelectorQuery().in(this).selectAll(".custom-text-wrapper, .custom-text").boundingClientRect().exec((res) => {
          console.log("custom-text", res);
          let textArr = res[0];
          this.containerTop = textArr[0].top;
          let j = -1;
          for (let i = 1, len = textArr.length - 1; i < len; i++) {
            // 文字处于第几行
            let lineCount = (textArr[i].top - this.containerTop) / this.data.lineHeight;
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
          console.log("textDatas", this.textDatas);
        })
      }, 0);
    },
    // 将字体大小转成以px为单位的值
    initFontSize(screenWidth) {
      let fontSize = this.properties.fontSize;
      if (fontSize.indexOf("rpx") > -1) {
        // 以rpx为单位(转换的时候进行下舍入)
        fontSize = parseInt(fontSize.substring(0, fontSize.length - 3));
        if (screenWidth === 375) {
          fontSize = Math.floor(fontSize / 2);
        } else {
          fontSize = Math.floor(fontSize * screenWidth / 750);
        }
      } else if (fontSize.indexOf("px") > -1) {
        // 以px为单位
        fontSize = parseInt(fontSize.substring(0, fontSize.length - 2));
      } else {
        fontSize = 16;
      }
      return fontSize;
    },
    // 根据字体大小计算行高
    initLineHeight(screenWidth) {
      let fontSize = this.initFontSize(screenWidth);
      let lineHeight = Math.floor(fontSize * 1.6);
      this.setData({
        // 行高
        lineHeight: lineHeight,
        // 字体大小
        fontSize: fontSize
      });
    },
    // 文本内容长按事件
    longPress(e) {
      console.log("longPress", e);
      this.touch = 1;
      if (this.properties.selectable) {
        // 支持长按事件
        let minIndex = -1, maxIndex = -1, minStyle = "", maxStyle = "", hights = [];
        let count = Math.floor(e.target.offsetTop / this.data.lineHeight);
        console.log("count", count);
        let rowData = this.textDatas[count];
        this.minCount = count;
        this.maxCount = count;
        for (let j = 0, colLen = rowData.data.length; j < colLen; j++) {
          if (e.detail.x >= rowData.data[j].left && e.detail.x <= rowData.data[j].right) {
            minIndex = rowData.data[j].index;
            maxIndex = rowData.data[j].index;
            this.minCountIndex = j;
            this.maxCountIndex = j;
            minStyle = "left:" + (rowData.data[j].left - 5) + "px;top:" + rowData.top + "px;";
            maxStyle = "left:" + (rowData.data[j].left + rowData.data[j].width - 5) + "px;top:" + rowData.top + "px;";
            hights.push({
              minIndex: this.minIndex,
              maxIndex: this.maxIndex,
              count: 0,
              left: rowData.data[j].left + "px",
              top: rowData.top + "px",
              width: rowData.data[j].width + "px"
            })
            break;
          }
        }
        this.minIndex = minIndex;
        this.maxIndex = maxIndex;
        this.setData({
          hights: hights,
          showHighlight: true,
          minStyle: minStyle,
          maxStyle: maxStyle
        });
      }
    },
    textTap(e) {
      console.log("textTap", e);
      if (this.data.selectModal) {
        this.closeSelectModal();
      }
    },
    textTouchEnd(e) {
      if (this.properties.selectable && this.touch === 1) {
        this.showSelectModal(-1);
      }
      this.touch = -1;
    },
    minTouchStart(e) {
      this.closeSelectModal();
    },
    minTouchMove(e) {
      console.log("minTouchMove", e);
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY - this.containerTop;
      let minIndex = -1, minStyle = "";
      let count = Math.floor(pageY / this.data.lineHeight);
      let textDatas = this.textDatas;
      if (count < 0) {
        count = 0;
      }
      let textRow = textDatas[count].data;
      this.minCount = count;
      let colLen = textRow.length;
      for (let j = 0; j < colLen; j++) {
        if (pageX >= textRow[j].left && pageX <= textRow[j].right) {
          minIndex = textRow[j].index;
          this.minCountIndex = j;
          minStyle = "left:" + (textRow[j].left - 5) + "px;top:" + textDatas[count].top + "px;";
          break;
        }
      }

      this.minIndex = minIndex;
      let hights = this.getHights();
      this.setData({
        hights: hights,
        minStyle: minStyle
      });
    },
    minTouchEnd(e) {
      this.showSelectModal(-1);
    },
    maxTouchStart(e) {
      this.closeSelectModal();
    },
    maxTouchMove(e) {
      console.log("maxTouchMove", e);
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY - this.containerTop;
      let maxIndex = -1, maxStyle = "";
      let count = Math.floor(pageY / this.data.lineHeight);
      let textDatas = this.textDatas;


      if (count > textDatas.length - 1) {
        count = textDatas.length - 1;
      }
      let textRow = textDatas[count].data;
      this.maxCount = count;
      let colLen = textRow.length;
      if (pageX > textRow[colLen - 1].left + textRow[colLen - 1].width) {
        this.maxCountIndex = colLen - 1;
        maxIndex = textRow[colLen - 1].index;
        maxStyle = "left:" + (textRow[colLen - 1].left + textRow[colLen - 1].width) + "px;top:" + textDatas[count].top + "px;";
      } else {
        for (let j = 0; j < colLen; j++) {
          if (pageX >= textRow[j].left && pageX <= textRow[j].right) {
            maxIndex = textRow[j].index;
            this.maxCountIndex = j;
            maxStyle = "left:" + (textRow[j].left + textRow[j].width - 5) + "px;top:" + textDatas[count].top + "px;";
            break;
          }
        }
      }

      this.maxIndex = maxIndex;
      let hights = this.getHights();
      this.setData({
        hights: hights,
        maxStyle: maxStyle
      });
    },
    maxTouchEnd(e) {
      this.showSelectModal(-1);
    },
    // 获取选中行数及样式
    getHights() {
      let textDatas = this.textDatas;
      let hights = [];
      if (this.minCount === this.maxCount) {
        let width;
        if (this.maxCountIndex === textDatas[this.maxCount].data.length - 1) {
          width = (this.screenWidth - textDatas[this.minCount].data[this.minCountIndex].left) + "px";
        } else {
          width = (textDatas[this.maxCount].data[this.maxCountIndex].right - textDatas[this.minCount].data[this.minCountIndex].left) + "px";
        }
        hights.push({
          minIndex: this.minIndex,
          maxIndex: this.maxIndex,
          count: 0,
          left: textDatas[this.minCount].data[this.minCountIndex].left + "px",
          top: textDatas[this.minCount].top + "px",
          width: width
        });
      } else {
        let count = 0;
        hights.push({
          count: count++,
          left: textDatas[this.minCount].data[this.minCountIndex].left + "px",
          top: textDatas[this.minCount].top + "px",
          width: (this.screenWidth - textDatas[this.minCount].data[this.minCountIndex].left) + "px"
        });
        for (let i = this.minCount + 1; i < this.maxCount; i++) {
          hights.push({
            count: count++,
            left: textDatas[i].left + "px",
            top: textDatas[i].top + "px",
            width: (this.screenWidth - textDatas[i].left) + "px"
          });
        }
        let width = (textDatas[this.maxCount].data[this.maxCountIndex].right - textDatas[this.maxCount].left) + "px";
        hights.push({
          count: count++,
          left: textDatas[this.maxCount].left + "px",
          top: textDatas[this.maxCount].top + "px",
          width: width
        })
      }
      return hights;
    },
    // 显示操作按钮
    showSelectModal(selectIndex) {
      console.log(this.properties.text.substring(this.minIndex, this.maxIndex + 1));
      let direction = "down", modalStyle, modalLeft = "";
      if (this.textDatas[this.minCount].top + this.containerTop < 50) {
        direction = "up";
        modalStyle = "top:" + (this.textDatas[this.maxCount].bottom + 18) + "px;left:" + (this.textDatas[this.maxCount].data[this.maxCountIndex].left - 200 / 2) + "px;";
      } else {
        modalStyle = "top:" + (this.textDatas[this.minCount].top - 48) + "px;left:" + (this.textDatas[this.minCount].data[this.minCountIndex].left - 200 / 2) + "px;";
      }
      this.setData({
        modalStyle: modalStyle,
        direction: direction,
        selectModal: true,
        selectText: this.properties.text.substring(this.minIndex, this.maxIndex + 1)
      }, () => {
        if (!this.data.modalWidth) {
          wx.createSelectorQuery().in(this).select(".btn-modals").boundingClientRect().exec(res => {
            console.log("res", res);
            let width = res[0].width;
            if (this.data.direction === "up") {
              modalLeft = "left:" + (this.textDatas[this.maxCount].data[this.maxCountIndex].left - width / 2) + "px;";
            } else {
              modalLeft = "left:" + (this.textDatas[this.minCount].data[this.minCountIndex].left - width / 2) + "px;";
            }
            this.setData({
              modalWidth: width,
              modalLeft: modalLeft
            });
          })
        } else {
          if (this.data.direction === "up") {
            modalLeft = "left:" + (this.textDatas[this.maxCount].data[this.maxCountIndex].left - this.data.modalWidth / 2) + "px;";
          } else {
            modalLeft = "left:" + (this.textDatas[this.minCount].data[this.minCountIndex].left - this.data.modalWidth / 2) + "px;";
          }
          this.setData({
            modalLeft: modalLeft
          });
        }
      });
    },
    // 隐藏操作按钮
    closeSelectModal() {
      this.setData({
        selectModal: false,
      });
    },
    // 点击操作按钮
    btnTap(e) {
      console.log("btntap", e);
      let dataset = e.currentTarget.dataset;
      let selectIndex = dataset.selectIndex;
      let id = dataset.id;


      if (id === "copy") {
        // 复制
        wx.setClipboardData({
          data: this.data.selectText,
          success: () => {
            // 复制成功之后事件
            this.setData({
              showHighlight: false,
              hights: [],
              selectModal: false,
              selectIndex: -1
            });
          }
        });
      } else if (id === "line") {
        // 下划线
        if (selectIndex === -1) {
          // 高亮选中
          let selects = this.data.selects;
          let len = selects.length;
          selects.push({
            id: len,
            hights: this.data.hights,
            line: true
          });
          this.setData({
            showHighlight: false,
            hights: [],
            selectModal: false,
            selectIndex: -1,
            selects: selects
          });
          console.log("selects", this.data.selects);
        } else {
          let selects = this.data.selects;
          selects.splice(selectIndex, 1);
          this.setData({
            selectModal: false,
            selectIndex: -1,
            selects: selects
          });
        }
      } else if (id === "note") {
        // 笔记
        if (selectIndex === -1) {
          // 高亮选中
          let selects = this.data.selects;
          let len = selects.length;
          selects.push({
            id: len,
            hights: this.data.hights,
            note: true
          });
          this.setData({
            showHighlight: false,
            hights: [],
            selectModal: false,
            selectIndex: -1,
            selects: selects
          });
          console.log("selects", this.data.selects);
        } else {
          let selects = this.data.selects;
          selects.splice(selectIndex, 1);
          this.setData({
            selectModal: false,
            selectIndex: -1,
            selects: selects
          });
        }
      }
    },
    selctTap(e) {
      console.log("selctTap", e);
      let index = e.currentTarget.dataset.index;
      // this.showSelectModal(index);
      let selects = this.data.selects;
      let btns = [];
      if (selects[index].note || selects[index].line) {
        if (selects[index].note) {
          btns.push({
            id: "note", text: "删除笔记"
          });
        }
        if (selects[index].line) {
          btns.push({
            id: "line", text: "删除下划线"
          });
        }
      } else {
        btns.push({
          id: "note", text: selects[index].note ? "删除笔记" : "笔记"
        });
        btns.push({
          id: "line", text: selects[index].line ? "删除下划线" : "下划线"
        });
      }
      btns.push({
        id: "copy", text: "复制"
      });
      this.setData({
        selectIndex: index,
        btns: btns,
        selectModal: true
      })
    }
  }
})