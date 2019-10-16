// 晓黑板打卡脚本
(() => {
  const backToMain = function() {
    // 返回到主页面
    // todo：如果在其他页面，一直摁返回，可能返回不到这个页面？
    const main = "org.xinkb.blackboard.android.ui.activity.MainActivity"
    let backLimit = 8 // 为了不要死循环
    while (currentActivity() !== main && backLimit !== 0) {
      back()
      backLimit--
      sleep(500)
    }
  }

  const endScript = function() {
    // 结束程序的时候运行这个
    sleep(1000)
    // 退出到桌面
    backToMain()
    home()
    console.log("=== end ===")
    // 结束脚本的运行
    exit()
  }

  const punch = function(name, needCheck) {
    let btn = text(name).findOne(3000)
    if (btn) {
      btn.click()
      console.log(name + " 已点击")
      sleep(1000)
      punch("确定", false)
      endScript()
    } else {
      console.log("找不到 " + name + " 按钮");
    }
  }

  const toXiaoMain = function() {
    const xiao = "org.xinkb.blackboard.android"
    if (currentPackage() !== xiao) {
      app.launchPackage(xiao)
      console.log("opened xiao");
    } else {
      backToMain()
    }
  }

  // 主函数从此处开始
  device.wakeUp() // 开启屏幕，不然看不到在做啥
  console.show() // 打开控制台的输出，到公司后可以看一下之前的打卡记录
  console.log("=== xiao start ===")
  // 为了避免被反作弊系统搞，等个0到2分钟的随机时间
  const sleepTime = random(0, 120000)
  // 写毫秒的话反应不过来要等多久。。
  console.log("random sleep " + Math.floor(sleepTime / 1000) + " s")
  device.keepScreenOn(sleepTime)
  sleep(sleepTime)
  device.wakeUp()
  console.log("random sleep end")
  // 1. 开启晓黑板
  toXiaoMain()

  // 2. 点击考勤打卡
  // 考勤打卡这个按钮幺蛾子很多，就单独拿出来写了
  let btn = text("考勤打卡").findOne(6000)
    .parent() // 等6秒，是为了防止冷启动需要等很久，超过6秒都打不开可以换手机了。。
  if (btn) {
    btn.click()
    console.log("考勤打卡 已点击")
  } else {
    console.log("找不到 考勤打卡 按钮");
    endScript() // 这里找不到就结束
  }

  let waitTime = 5
  while (text("定位中").findOne(1000) && waitTime !== 0) {
    console.log("-- 定位中 --")
    sleep(1000)
    waitTime -= 1
  }

  // 3. 上班打卡
  punch("上班打卡")

  // 4 下班打卡
  punch("下班打卡")

  // 5. 更新下班打卡
  punch("更新打卡")

  // 如果啥按钮都没有，就跑路
  endScript()
})()
