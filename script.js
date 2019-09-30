(() => {
  const backToMain = function () {
    const main = "org.xinkb.blackboard.android.ui.activity.MainActivity"
    let backLimit = 8
    while (currentActivity() !== main && backLimit !== 0) {
      back()
      backLimit--
      sleep(500)
    }
  }

  const endScript = function () {
    sleep(1000)
    backToMain()
    home()
    console.log("=== end ===")
    exit()
  }

  const punch = function (name, needCheck) {
    let btn = text(name).findOne(1000)
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

  const toXiaoMain = function () {
    const xiao = "org.xinkb.blackboard.android"
    if (currentPackage() !== xiao) {
      app.launchPackage(xiao)
      console.log("opened xiao");
    } else {
      backToMain()
    }
  }

  device.wakeUp()
  console.show()
  console.log("=== start ===")
  const sleepTime = random(0, 120000)
  console.log("random sleep " + Math.floor(sleepTime / 1000) + " s")
  device.keepScreenOn(sleepTime)
  sleep(sleepTime)
  console.log("random sleep end")
  toXiaoMain()

  // 2. 点击考勤打卡
  let btn = text("考勤打卡").findOne(6000).parent()
  if (btn) {
    btn.click()
    console.log("考勤打卡 已点击")
  } else {
    console.log("找不到 考勤打卡 按钮");
    endScript()
  }

  // 3. 上班打卡
  punch("上班打卡", false)

  // 4 下班打卡
  punch("下班打卡", false)

  // 5. 更新下班打卡
  punch("更新打卡", true)
  endScript()

})()
