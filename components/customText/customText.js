Component({
  properties: {
    text: {
      type: String,
      observer: function () {
        this.getTextOffset();
      }
    },
    // 文本是否可选
    selectable: {
      type: Boolean,
      value: false
    },
    fontSize: {
      type: String,
      value: "32rpx"
    }
  },
  data: {
    btns: [
      { id: "note", text: "笔记", done: false },
      { id: "line", text: "下划线", done: false },
      { id: "copy", text: "复制", done: false }
    ]
  },
  attached: function () {
    // 获取屏幕宽度
    this.screenWidth = wx.getSystemInfoSync().screenWidth;
    this.initLineHeight(this.screenWidth);
  },
  ready() {
    wx.createSelectorQuery().in(this).selectAll(".custom-text-wrapper").boundingClientRect().exec(res => {
      console.log("custom-text", res)
      console.log("custom-text context", res.context);
    });
  },
  methods: {
    // 长按事件
    textPress(e) {
      console.log("textPress", e);
    },
    // 获取文本的坐标位置
    getTextOffset: function () {
      setTimeout(() => {
        let text_data = [];
        wx.createSelectorQuery().in(this).selectAll(".custom-text-wrapper, .custom-text,.custom-text-slot").boundingClientRect().exec((res) => {
          console.log("custom-text", res);
          let text_arr = res[0];
          this.containerTop = text_arr[0].top;
          let j = -1;
          for (let i = 1, len = text_arr.length - 1; i < len; i++) {
            let num = (text_arr[i].top - this.containerTop) / this.data.lineHeight;
            if (num !== j) {
              j = num;
              text_data[j] = {
                top: text_arr[i].top - this.containerTop,
                bottom: text_arr[i].bottom - this.containerTop,
                left: text_arr[i].left,
                height: text_arr[i].height,
                count: j,
                data: [{
                  index: text_arr[i].dataset.index,
                  text: text_arr[i].dataset.text,
                  left: text_arr[i].left,
                  right: text_arr[i].right,
                  width: text_arr[i].width,
                }]
              };
            } else {
              text_data[j].data.push({
                index: text_arr[i].dataset.index,
                text: text_arr[i].dataset.text,
                left: text_arr[i].left,
                right: text_arr[i].right,
                width: text_arr[i].width,
              });
            }
          }
          this.textDatas = text_data;
          console.log("text_datas", this.textDatas);
        })
      }, 0);
    },
    // 初始化字体大小
    initFontSize: function (screen_width) {
      let font_size = this.properties.fontSize;
      if (font_size.indexOf("rpx") > -1) {
        // 以rpx为单位    
        font_size = parseInt(font_size.substring(0, font_size.length - 3));
        if (screen_width === 375) {
          font_size = Math.floor(font_size / 2);
        } else {
          font_size = Math.floor(font_size * screen_width / 750);
        }
      } else if (font_size.indexOf("px") > -1) {
        // 以px为单位
        font_size = parseInt(font_size.substring(0, font_size.length - 2));
      }
      return font_size;
    },
    // 初始化行高
    initLineHeight: function (screen_width) {
      let font_size = this.initFontSize(screen_width);
      let line_height = Math.floor(font_size * 1.6);
      this.setData({
        lineHeight: line_height,
        fontSize: font_size
      });
    },
    // 文本内容长按事件
    longPress: function (e) {
      console.log("longPress", e);
      this.touchType = e.type;
      if (this.properties.selectable) {
        // 支持长按事件
        let minIndex = -1, maxIndex = -1, minStyle = "", maxStyle = "", hights = [];
        let count = Math.floor(e.target.offsetTop / this.data.lineHeight);
        console.log("count", count);
        let row_data = this.textDatas[count];
        this.minCount = count;
        this.maxCount = count;
        for (let j = 0, colLen = row_data.data.length; j < colLen; j++) {
          if (e.detail.x >= row_data.data[j].left && e.detail.x <= row_data.data[j].right) {
            minIndex = row_data.data[j].index;
            maxIndex = row_data.data[j].index;
            this.minCountIndex = j;
            this.maxCountIndex = j;
            minStyle = "left:" + (row_data.data[j].left - 5) + "px;top:" + row_data.top + "px;";
            maxStyle = "left:" + (row_data.data[j].left + row_data.data[j].width - 5) + "px;top:" + row_data.top + "px;";
            hights.push({
              id: 0,
              left: row_data.data[j].left + "px",
              top: row_data.top + "px",
              width: row_data.data[j].width + "px"
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
    textTap: function (e) {
      this.touchType = e.type;
      if (this.data.selectModal) {
        this.closeSelectModal();
      }
    },
    textTouchEnd: function (e) {
      if (this.properties.selectable && this.touchType === "longpress") {
        this.showSelectModal();
      }
    },
    minTouchStart: function (e) {
      this.closeSelectModal();
    },
    minTouchMove: function (e) {
      console.log("minTouchMove", e);
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY - this.containerTop;
      let minIndex = -1, minStyle = "";
      let count = Math.floor(pageY / this.data.lineHeight);
      let text_datas = this.textDatas;
      if (count < 0) {
        count = 0;
      }
      let text_row = text_datas[count].data;
      this.minCount = count;
      let colLen = text_row.length;
      for (let j = 0; j < colLen; j++) {
        if (pageX >= text_row[j].left && pageX <= text_row[j].right) {
          minIndex = text_row[j].index;
          this.minCountIndex = j;
          minStyle = "left:" + (text_row[j].left - 5) + "px;top:" + text_datas[count].top + "px;";
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
    minTouchEnd: function (e) {
      this.showSelectModal();
    },
    maxTouchStart: function (e) {
      this.closeSelectModal();
    },
    maxTouchMove: function (e) {
      console.log("maxTouchMove", e);
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY - this.containerTop;
      let maxIndex = -1, maxStyle = "";
      let count = Math.floor(pageY / this.data.lineHeight);
      let text_datas = this.textDatas;


      if (count > text_datas.length - 1) {
        count = text_datas.length - 1;
      }
      let text_row = text_datas[count].data;
      this.maxCount = count;
      let colLen = text_row.length;
      if (pageX > text_row[colLen - 1].left + text_row[colLen - 1].width) {
        this.maxCountIndex = colLen - 1;
        maxIndex = text_row[colLen - 1].index;
        maxStyle = "left:" + (text_row[colLen - 1].left + text_row[colLen - 1].width) + "px;top:" + text_datas[count].top + "px;";
      } else {
        for (let j = 0; j < colLen; j++) {
          if (pageX >= text_row[j].left && pageX <= text_row[j].right) {
            maxIndex = text_row[j].index;
            this.maxCountIndex = j;
            maxStyle = "left:" + (text_row[j].left + text_row[j].width - 5) + "px;top:" + text_datas[count].top + "px;";
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
    maxTouchEnd: function (e) {
      this.showSelectModal();
    },
    // 获取选中行数及样式
    getHights: function () {
      let text_datas = this.textDatas;
      let hights = [];
      if (this.minCount === this.maxCount) {
        let width;
        if (this.maxCountIndex === text_datas[this.maxCount].data.length - 1) {
          width = (this.screenWidth - text_datas[this.minCount].data[this.minCountIndex].left) + "px";
        } else {
          width = (text_datas[this.maxCount].data[this.maxCountIndex].right - text_datas[this.minCount].data[this.minCountIndex].left) + "px";
        }
        hights.push({
          id: 0,
          left: text_datas[this.minCount].data[this.minCountIndex].left + "px",
          top: text_datas[this.minCount].top + "px",
          width: width
        });
      } else {
        let id = 0;
        hights.push({
          id: id++,
          left: text_datas[this.minCount].data[this.minCountIndex].left + "px",
          top: text_datas[this.minCount].top + "px",
          width: (this.screenWidth - text_datas[this.minCount].data[this.minCountIndex].left) + "px"
        });
        for (let i = this.minCount + 1; i < this.maxCount; i++) {
          hights.push({
            id: id++,
            left: text_datas[i].left + "px",
            top: text_datas[i].top + "px",
            width: (this.screenWidth - text_datas[i].left) + "px"
          });
        }
        let width = (text_datas[this.maxCount].data[this.maxCountIndex].right - text_datas[this.maxCount].left) + "px";
        hights.push({
          id: id++,
          left: text_datas[this.maxCount].left + "px",
          top: text_datas[this.maxCount].top + "px",
          width: width
        })
      }
      return hights;
    },
    // 显示操作按钮
    showSelectModal: function () {
      console.log(this.properties.text.substring(this.minIndex, this.maxIndex + 1));
      let direction = "down", modal_style, modal_left = "";
      if (this.textDatas[this.minCount].top + this.containerTop < 50) {
        direction = "up";
        modal_style = "top:" + (this.textDatas[this.maxCount].bottom + 18) + "px;left:" + (this.textDatas[this.maxCount].data[this.maxCountIndex].left - 200 / 2) + "px;";
      } else {
        modal_style = "top:" + (this.textDatas[this.minCount].top - 48) + "px;left:" + (this.textDatas[this.minCount].data[this.minCountIndex].left - 200 / 2) + "px;";
      }
      this.setData({
        modalStyle: modal_style,
        direction: direction,
        selectModal: true,
        selectText: this.properties.text.substring(this.minIndex, this.maxIndex + 1)
      }, () => {
        if (!this.data.modalWidth) {
          wx.createSelectorQuery().in(this).select(".btn-modals").boundingClientRect().exec(res => {
            console.log("res", res);
            let width = res[0].width;
            if (this.data.direction === "up") {
              modal_left = "left:" + (this.textDatas[this.maxCount].data[this.maxCountIndex].left - width / 2) + "px;";
            } else {
              modal_left = "left:" + (this.textDatas[this.minCount].data[this.minCountIndex].left - width / 2) + "px;";
            }
            this.setData({
              modalWidth: width,
              modalLeft: modal_left
            });
          })
        } else {
          if (this.data.direction === "up") {
            modal_left = "left:" + (this.textDatas[this.maxCount].data[this.maxCountIndex].left - this.data.modalWidth / 2) + "px;";
          } else {
            modal_left = "left:" + (this.textDatas[this.minCount].data[this.minCountIndex].left - this.data.modalWidth / 2) + "px;";
          }
          this.setData({
            modalLeft: modal_left
          });
        }
      });
    },
    // 隐藏操作按钮
    closeSelectModal: function () {
      this.setData({
        selectModal: false
      });
    },
    // 点击操作按钮
    btnTap: function (e) {
      let id = e.currentTarget.dataset.id;
      if (id === "copy") {
        // 复制
        wx.setClipboardData({
          data: this.data.selectText,
          success: () => {
            // 复制成功之后事件
          }
        });
      } else if (id === "line") {
        // 下划线
      } else if (id === "note") {
        // 笔记
        let btns = this.data.btns;
        // for (let i = 0, len = btns.length; i < len; i++) {
        //   if (btns[i].id === "note") {
        //     btns[i].text = btns[i].done ? "笔记" : "删除笔记"
        //     btns[i].done = !btns[i].done;
        //   }
        //   // if(btns[i].id==="line"){
        //   //   if(btns[i])
        //   // }
        // }
        // this.setData({
        //   btns: btns
        // });
      }
      // this.triggerEvent("btn", { index: index, selectText: this.data.selectText });
    }
  }
})