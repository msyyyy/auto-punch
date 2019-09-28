# autojs的开发

## 开发环境

[参考这篇](https://blog.csdn.net/QiHsMing/article/details/86762007)

### 手机

开悬浮窗、音量上停止脚本。

### 电脑

用vsc，下autojs插件

shift+cmd+p，输入auto js，可以看到一堆操作。

开启服务用start server

![image-20190923163337048](https://tva1.sinaimg.cn/large/006y8mN6gy1g79jbql7qrj30c20223yj.jpg)

在手机的autojs，点击连接电脑，输入电脑ip地址

![image-20190923163714071](https://tva1.sinaimg.cn/large/006y8mN6gy1g79jffw6cxj30au00tt8l.jpg)

要在同一个局域网才能连上

写了脚本可以f5运行，写完了可以调命令`Auto.js:SaveToDevice`来保存到手机

保存的目录为`/storage/emulated/0/脚本/<文件名>`

## js脚本

### api的调用

这需要[直接找文档](https://hyb1996.github.io/AutoJs-Docs/#/widgetsBasedAutomation)，搜索很难搜索到。

### 包名、应用名

每个app都有个名字，叫包名package

每个页面也有个名字，叫应用名activity

查询的方法，是在手机上点开相应的应用和页面，然后在命令行输入：

```shell
adb shell dumpsys window | grep mCurrentFocus
```

如果是在设置界面，就会发现命令行的输出中有：

> mCurrentFocus=Window{9a30490 u0 com.android.settings/com.android.settings.Settings}

斜杠前的就是包名，之后的就是应用名

当然，这需要电脑装adb，并且手机开usb调试才能看到。

### 控件

安卓应用是一个个控件构成的，有点像前端的h5页面。

可以在悬浮窗中点击查看：

![image-20190928154419818](https://tva1.sinaimg.cn/large/006y8mN6gy1g7f9zz2jpvj30cz0e9whp.jpg)

一般是点击中间这个3，点击布局范围分析，点击对应控件，就能看到

这可比uiautomatorviewer方便多了，初看到的时候都惊呆了😂

总之可以通过calssname、id、text等等内容找到对应的控件，进行点击等操作。

## 详细备注版

```js
(() => {
  const backToMain = function () {
    // 返回到主页面
    // todo：如果在其他页面，一直摁返回，可能返回不到这个页面？
    const main = "org.xinkb.blackboard.android.ui.activity.MainActivity"
    const backLimit = 8  // 为了不要死循环
    while (currentActivity() !== main && backLimit !== 0) {
      back()
      backLimit--
      sleep(500)
    }
  }

  const endScript = function () {
    // 结束程序的时候运行这个
    sleep(1000)
    // 退出到桌面
    backToMain()
    home()
    console.log("=== end ===")
    // 结束脚本的运行
    exit()
  }

  const punch = function (name, needCheck) {
    // 打卡，要用到三个地方我就抽象出来了
    let btn = text(name).findOne(1000)  // 最多等1000ms，再找不到就放弃
    if (btn) {
      btn.click()
      console.log(name + " 已点击")
      if (needCheck) {
        sleep(1000)     // 不停一下再打卡，有时候会出现问题，反正我停了
        punch("确定", false)
      }
      endScript()
    } else {
      console.log("找不到 " + name + " 按钮");
    }
  }

  const toXiaoMain = function () {
    const xiao = "org.xinkb.blackboard.android"
    if (currentPackage() !== xiao) {
      app.launchPackage(xiao)
      console.log("opened xiao");
    } else {
      backToMain()
    }
  }

  // 主函数从此处开始
  device.wakeUp()   // 开启屏幕，不然看不到在做啥
  console.show()    // 打开控制台的输出，到公司后可以看一下之前的打卡记录
  console.log("=== start ===")
  // 为了避免被反作弊系统搞，等个0到2分钟的随机时间
  const sleepTime = random(0, 120000)
  // 写毫秒的话反应不过来要等多久。。
  console.log("random sleep " + Math.floor(sleepTime / 1000) + " s")
  device.keepScreenOn(sleepTime)
  sleep(sleepTime)
  console.log("random sleep end")
  // 1. 开启晓黑板
  toXiaoMain()

  // 2. 点击考勤打卡
  // 考勤打卡这个按钮幺蛾子很多，就单独拿出来写了
  let btn = text("考勤打卡").findOne(6000).parent()  // 等6秒，是为了防止冷启动需要等很久，超过6秒都打不开可以换手机了。。
  if (btn) {
    btn.click()
    console.log("考勤打卡 已点击")
    // 这里不能结束程序，还要打卡呢
  } else {
    console.log("找不到 考勤打卡 按钮");
    endScript()       // 这里找不到就结束
  }

  // 3. 上班打卡
  punch("上班打卡", false)

  // 4 下班打卡
  punch("下班打卡", false)

  // 5. 更新下班打卡
  punch("更新打卡", true)

  // 如果啥按钮都没有，就跑路
  endScript()
})()

```

