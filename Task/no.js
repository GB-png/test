//以上是配置说明
const $iosrule = iosrule(); //声明必须

//const zdurl = "http://api.turinglabs.net/api/v1/jd/bean/create/6wsk34xjsiwbwsukiyrer5dkaa5ac3f4ijdgqji/";
const ncurl = "http://api.turinglabs.net/api/v1/jd/farm/create/d0dbcd0d7e6d40619c66c85b5807fdc8/";
const mcurl = "http://api.turinglabs.net/api/v1/jd/pet/create/MTAxODcxOTI2NTAwMDAwMDAyOTE0MjU5OQ==/";

var n = 0

//++++++++++++++++++++++++++++++++

//3.需要执行的函数都写这里
//function main() {
  //no_all()
//}

zd_sign()

//++++++++++++++++++++++++++++++++++++
//4.基础模板

function zd_sign() {
  const llUrl1 = {
    url: "http://api.turinglabs.net/api/v1/jd/bean/create/6wsk34xjsiwbwsukiyrer5dkaa5ac3f4ijdgqji/"
  }

  $iosrule.get(llUrl1, function(error, response, data) {
//console.log(data)
    var obj=JSON.parse(data)
      if (obj.code == 200) {
        var res = "添加成功";
      } else {
        var res = "重复添加";
      }
    
        papa( "[种豆互助码]"+"\n"+res);
      console.log(papa)

  })

}






//function pushmsg(r) {
//  n++;
//  tx += r+"\n";
//  console.log(r);
 // console.log(n);
 //   if (n == 5) papa("彩蛋视频","",tx);}
  


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
