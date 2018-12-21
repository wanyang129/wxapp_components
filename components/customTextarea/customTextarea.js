Component({
  properties: {
    disabled: {
      type: Boolean,
      value: false
    },
    // 文本框替换容器的高度
    placeHeight: {
      type: Number,
      value: 200
    },
    // 文本框高度
    areaHeight: {
      type: Number,
      value: 200
    },
    // 获取焦点(切换成文本框)
    focus: {
      type: Boolean,
      value: false,
      observer() {
        if (this.properties.focus && !this.data.showText) {
          this.enableTextarea();
        } else if (!this.properties.focus && this.data.showText) {
          this.disableTextarea();
        }
      }
    },
    value: {
      type: String,
      value: "",
      observer() {
        if (!this.data.showText) {
          this.initPlaceText();
        }
      }
    },
    placeholder: {
      type: String,
      value: ""
    },
    maxlength: {
      type: Number,
      value: 140
    }
  },
  data: {
    showText: false
  },
  attached() {
    this.initPlaceText();
  },
  methods: {
    initPlaceText() {
      this.value = this.properties.value;
      if (this.value) {
        this.setData({
          isplaceholder: false,
          textplace: this.value
        });
      } else {
        this.setData({
          isplaceholder: true,
          textplace: this.properties.placeholder
        });
      }
    },

    textFocus(e) {
      this.triggerEvent("focus", { height: e.detail.height });
    },
    textBlur(e) {
      if (this.value) {
        this.setData({
          showText: false,
          textplace: this.value,
          isplaceholder: false
        });
      } else {
        this.setData({
          showText: false,
          textplace: this.properties.placeholder,
          isplaceholder: true
        });
      }
      this.triggerEvent("blur");
    },
    textInput(e) {
      this.value = e.detail.value;
      this.cursor = e.detail.cursor;
      this.setData({
        value: e.detail.value
      });
      this.triggerEvent("input", { value: e.detail.value });
    },
    enableTextarea() {
      this.setData({
        showText: true,
        cursor: this.properties.value.length
      });
    },
    disableTextarea() {
      this.setData({
        showText: false
      });
    }
  }
})