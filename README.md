# 公共组件项目
## 自定义导航栏组件        components/navigationBar/navigationBar
### 文档说明
|  属性名        |     类型      |   默认值   |                                      说明     |
|:-------------:|--------------:|-----------:|---------------------------------------------:|
|  page-title   |  String       |            |       页面标题                                |
|  custom-back  |  Boolean      | false      |       是否自定义回退事件                       |
|  bindback     |  EventHandle  |            |       自定义回退事件,需要和custom-back结合使用  | 

## 自定义页面导航组件      components/routeLink/routeLink
### 文档说明
|  属性名     |   类型      |   默认值     |     说明                                                       |
|:----------:|------------:|-------------:|--------------------------------------------------------------:|
|  url        |   String    |              |    当前小程序内的跳转链接                                      |
|  open-type  |   String    |  navigate    |    跳转方式                                                   |
|  target     |   String    |  self        |    在哪个目标上发生跳转，默认当前小程序，可选值self/miniProgram  |
|  app-id     |   String    |              |    当target="miniProgram"时有效，要打开的小程序 appId           |            
|  is-custom  |   Object    |              |   页面跳转时是否有自定义事件(对象里面需包含event事件)             |
|  delta      |   Number    |  1           |   当 open-type 为 'navigateBack' 时有效，表示回退的层数          |


## 试卷自定义tab切换组件   components/swiperTab/swiperTab
### 文档说明
|  属性名          |  类型         |  默认值 |   说明                                                            |
|:---------------:|--------------:|--------:|------------------------------------------------------------------:|
|  tabs            |  Number      |         |   切换栏个数                                                       |
|  tab-name        |  String      |  材料   |   切换栏标题名称                                                    |
|  padding-bottom  |  Number      |  0      |   切换栏距页面底部的高度                                             |
|  tab-index       |  Number      |  0      |   当前所在切换栏的下标                                               |
|  bindswiperend   |  EventHandle |         |   切换到最后一个tab时的事件                                          |
|  bindtabIndexFn  |  EventHandle |         |   tab切换时的触发事件event.detail={tabIndex},tabIndex为当前tab的下标  |




## 自定义模态框组件        components/modal/modal
### 文档说明
|  属性名        | 类型        |   默认值   |     说明                                                          |
|:-------------:|------------:|----------:|------------------------------------------------------------------:|
|  show-modal    | Boolean     |            |    是否显示模态框                                                 |
|  change-times  | Number      |            |    模态框显示触发次数(当modal-type为continuetips时有效)            |
|  modal-type    | String      |            |    模态框类型(有效值有:tips,continuetips,confirm,alert)           |
|  modal-tips    | String      |            |    模态框提示信息,当modal-type为tips或continuetips时有效           |
|  tips-duration | Number      |  2000      |    模态框显示时间,当modal-type为tips或continuetips时有效(单位为ms)  |
|  cancel-text   | String      |  取消      |    模态框取消按钮文字(当modal-type为confirm时有效)                  |
|  confirm-text  | String      |  确定      |    模态框确认按钮文字(档modal-type为confirm时有效)                  |
|  alert-text    | String      |  确定      |    模态框确定按钮文字(档modal-type为alert时有效)                    |
|  bindconfirm   | EventHandle |            |   点击确认按钮时的触发事件(档modal-type为confirm时有效)             |
|  bindalert     | EventHandle |            |   点击确定按钮时的触发事件(档modal-type为alert时有效)               |



## 自定义文本框组件        components/customTextarea/customTextarea
### 文档说明
|  属性名           |    类型        |  默认值   |    说明                                                    |
|:----------------:|---------------:|---------:|-----------------------------------------------------------:|
|  value           |    String      |           |    输入框内容                                              |
|  placeholder     |    String      |           |    输入框为空时占位符                                       |
|  disabled        |    Boolean     |  false    |    是否禁用                                                |
|  maxlength       |    Number      |  140      |    最大输入长度,设置为-1的时候不限制最大长度                  |
|  focus           |    Boolean     |  false    |    获取焦点                                                 |
|  area-height     |    Number      |  200      |    文本框的高度                                             |
|  place-height    |    Number      |  200      |    文本框替换容器的高度                                      |
|  bindfocus       |    EventHandle |           |    输入框聚集时触发,event.detail={height},height为键盘的高度  |
|  bindblur        |    EventHandle |           |    输入框失去焦点时触发                                      |
|  bindinput       |    EventHandle |           |    键盘输入时,触发input事件,event.detail={value}             | 


## 自定义文本组件         components/customText/customText
### 文档说明
|  属性名           |    类型       |  默认值   |    说明                        |
|:----------------:|--------------:|----------:|-------------------------------:|
|  text           |    String      |           |    需要渲染的文本内容            |
|  selectable     |    Boolean     |  false    |    文本是否可选                 |
|  font-size      |    String      |  32rpx    |    文本字体大小                 |