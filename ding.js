// 钉钉打卡脚本
(() => {
  const backToMain = function () {
    // 返回到主页面
    const main = "com.alibaba.android.rimet.biz.LaunchHomeActivity"
    let backLimit = 8  // 为了不要死循环
    while (currentActivity() !== main && backLimit !== 0) {
      back()
      backLimit--
      sleep(800)
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
    let btn = desc(name).findOne(2000)
    if (btn) {
      btn.click()
      console.log(name + " 已点击")
      if (needCheck) {
        sleep(1000)
        punch("确定", false)
      }
      endScript()
    } else {
      console.log("找不到 " + name + " 按钮");
    }
  }

  const toDing = function () {
    const ding = "com.alibaba.android.rimet"
    if (currentPackage() !== ding) {
      app.launchPackage(ding)
      console.log("opened ding");
    } else {
      backToMain()
    }
  }

  // 主函数从此处开始
  device.wakeUp()   // 开启屏幕，不然看不到在做啥
  console.show()    // 打开控制台的输出，到公司后可以看一下之前的打卡记录
  console.log("=== start ===")
  // 为了避免被反作弊系统搞，等个0到2分钟的随机时间
  // const sleepTime = random(0, 120000)
  // // 写毫秒的话反应不过来要等多久。。
  // console.log("random sleep " + Math.floor(sleepTime / 1000) + " s")
  // device.keepScreenOn(sleepTime)
  // sleep(sleepTime)
  // console.log("random sleep end")
  // 1. 开启钉钉
  toDing()

  // 2. 点击工作
  let btn = text("工作").findOne(6000).parent()
  // 等6秒，是为了防止冷启动需要等很久
  if (btn) {
    btn.click()
    console.log("工作 已点击")
  } else {
    console.log("找不到 工作 按钮");
    endScript()       // 这里找不到就结束
  }

  // 3. 点击考勤打卡
  let btn2 = desc("考勤打卡").findOne(3000).parent()
  if (btn2) {
    btn2.click()
    console.log("考勤打卡 已点击")
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
