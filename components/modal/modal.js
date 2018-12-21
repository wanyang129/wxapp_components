Component({
  properties: {
    // 是否展示模态框
    showModal: {
      type: Boolean,
      observer() {
        if (this.properties.modalType === "tips") {
          if (this.timeout) {
            clearInterval(this.timeout);
            this.timeout = null;
          }
          this.timeout = setTimeout(() => {
            this.setData({
              showModal: false
            });
          }, this.properties.tipsDuration);
        }
      }
    },
    // 当modalType为continuetips时有效
    changeTimes: {
      type: Number,
      observer() {
        if (this.properties.modalType === "continuetips") {
          if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
          }
          this.timeout = setTimeout(() => {
            this.setData({
              showModal: false
            });
          }, this.properties.tipsDuration);
        }
      }
    },
    // modal类型(包含tips,continuetips,confirm,alert)
    modalType: {
      type: String
    },
    // 模态框提示信息(当modalType为tips和continuetips时有效)
    modalTips: {
      type: String
    },
    // 多长时间后tips和continuetips模态框会消失
    tipsDuration: {
      type: Number,
      value: 2000
    },
    cancelText: {
      type: String,
      value: "取消"
    },
    confirmText: {
      type: String,
      value: "确定"
    },
    alertText: {
      type: String,
      value: "确定"
    }
  },
  methods: {
    // 点击取消按钮
    cancelModal() {
      this.setData({
        showModal: false
      })
    },
    confirmModal() {
      // 点击确定按钮
      this.setData({
        showModal: false
      });
      this.triggerEvent("confirm");
    },
    alertModal() {
      this.setData({
        showModal: false
      });
      this.triggerEvent("alert")
    }
  }
})