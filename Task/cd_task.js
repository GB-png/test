//以上是配置说明
const $iosrule = iosrule(); //声明必须
const cd_signckname="cd_signckname";
const cd_Token=$iosrule.read(cd_signckname);

const cd_tkname="cd_tkname";
const cd_tk=$iosrule.read(cd_tkname);

const cd_signbd="cd_signbd";
const cd_sign =$iosrule.read(cd_signbd);

const cd_videobd="cd_videobd";
const cd_video=$iosrule.read(cd_videobd);

const cd_roulettebd="cd_roulettebd";
const cd_roulette=$iosrule.read(cd_roulettebd);

const cd_timebd="cd_timebd";
const cd_time=$iosrule.read(cd_timebd);

const cd_svideobd="cd_svideobd";
const cd_svideo=$iosrule.read(cd_svideobd);
const moreurl = "https://api-ddvideo.1sapp.com/h5/task/submit";


var n = 0

//++++++++++++++++++++++++++++++++

//3.需要执行的函数都写这里
function main() {
  cd_coinall()
}

main()

//++++++++++++++++++++++++++++++++++++
//4.基础模板

function cd_sign1() {
  const llUrl1 = {
    url: moreurl,
    headers: {
      "Token": cd_Token,
      "TK": cd_tk,"Content-Type":"application/json"
    },
    body: cd_sign,
    body:JSON.stringify(cd_sign)
  }

  $iosrule.post(llUrl1, function(error, response, data) {
console.log(data)
      var obj = JSON.parse(data)
      if (obj.code == 0) {
        var res = "签到成功";
      } else {
        var res = "重复签到";
      }
    
        pushmsg( "[每日签到]"+"\n"+res);
      console.log(pushmsg)

  })

}

function cd_video1() {
  const llUrl1 = {
    url: "https://api-ddvideo.1sapp.com/task/timer_submit",
    headers: {
      "Token": cd_Token,
      "TK": cd_tk
    },
    body: cd_video,
    body:JSON.stringify(cd_video)
  }

  $iosrule.post(llUrl1, function(error, response, data) {
//      console.log(data)
      var obj = JSON.parse(data)
      var res = "获得金币" + obj.task.title;
    
        pushmsg("[视频奖励]"+"\n"+res);
      

  })

}

function cd_roulette1() {
  const llUrl1 = {
    url: "https://api-ddvideo.1sapp.com/h5/reward/prize",
    headers: {
      "Token": cd_Token,
      "TK": cd_tk
    },
    body: cd_roulette,
    body:JSON.stringify(cd_roulette)
  }

  $iosrule.post(llUrl1, function(error, response, data) {
//      console.log(data)
      var obj = JSON.parse(data)
      if(obj.code==0)
      {var res = "抽奖" + obj.data.chance.rest+"次";}
      else{
        res="抽完了"
      }
    
        pushmsg("[抽奖]"+"\n"+res);
      

  })

}

function cd_time1() {
  const llUrl1 = {
    url: moreurl,
    headers: {
      "Token": cd_Token,
      "TK": cd_tk
    },
    body: cd_time,
    body:JSON.stringify(cd_time)
  }

  $iosrule.post(llUrl1, function(error, response, data) {
//      console.log(data)
      var obj = JSON.parse(data)
      if(obj.code==0)
      {var res="获取金币💵"+obj.data.reward_value}
      else
      {var res="再试试"}
    
        pushmsg("[时段奖励]"+"\n"+res);
      

  })

}

function cd_svideo1() {
  const llUrl1 = {
    url: moreurl,
    headers: {
      "Token": cd_Token,
      "TK": cd_tk
    },
    body: cd_svideo,
    body:JSON.stringify(cd_svideo)
  }

  $iosrule.post(llUrl1, function(error, response, data) {
//      console.log(data)
      var obj = JSON.parse(data)
      if(obj.code==0)
{var res="获取金币💵"+obj.data.reward_value}
else
{var res="抽完了"}
    
        pushmsg( "[小视频]"+"\n"+res);
      

  })

}





function pushmsg(r) {
  n++;
  tx += r+"\n";
  console.log(r);
  console.log(n);
    if (n == 5) papa("彩蛋视频","",tx);
  
}

function cd_coinall()
 {

 setTimeout(function(){
  cd_sign1();
 }, 5* 100);

 setTimeout(function(){
  cd_video1();
   
 }, 5* 100);

 setTimeout(function(){
   
  cd_roulette1();
 }, 5* 100);

 setTimeout(function(){
  cd_time1();
 }, 5* 100);

setTimeout(function(){
  cd_svideo1();
 }, 5* 1000);

}

//以下不要改动圈叉固定函数
function papa(x, y, z) {

  $iosrule.notify(x, y, z);
}

function iosrule() {
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message)
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key)
    if (isSurge) return $persistentStore.write(value, key)
  }
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
  }
  const get = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = { url: options }
      options["method"] = "GET"
      $task.fetch(options).then(response => {
        response["status"] = response.statusCode
        callback(null, response, response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) $httpClient.get(options, callback)
  }
  const post = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = { url: options }
      options["method"] = "POST"
      $task.fetch(options).then(response => {
        response["status"] = response.statusCode
        callback(null, response, response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) $httpClient.post(options, callback)
  }
  const end = () => {
    if (isQuanX) isRequest ? $done({}) : ""
    if (isSurge) isRequest ? $done({}) : $done()
  }
  return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};
