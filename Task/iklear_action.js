const cookieName = 'IKlear微商城'
const $ = Env(cookieName)
const notify = require('./sendNotify');
let result = ''
var tz = ''
console.log(`\n========= 脚本执行时间(TM)：${new Date(new Date().getTime() + 0 * 60 * 60 * 1000).toLocaleString('zh', {hour12: false})} =========\n`)


//云函数使用在下面填写
let IKLEAR_COOKIES = [
  {
    "signurlVal": "",
    "signheaderVal": "",
  }
]
function getNodeCookie() {
  if ($.isNode()) {
    let IKLEAR_HEADER_VAL = [];
    if (process.env.IKLEAR_HEADER_VAL) {
      if (process.env.IKLEAR_HEADER_VAL.indexOf('@') > -1) {
        console.log(`您的IKLEAR_HEADER_VAL选择的是用@隔开\n`)
        IKLEAR_HEADER_VAL = process.env.IKLEAR_HEADER_VAL.split('@');
      } else if (process.env.IKLEAR_HEADER_VAL.indexOf('\n') > -1) {
        console.log(`您的IKLEAR_HEADER_VAL选择的是用换行隔开\n`)
        IKLEAR_HEADER_VAL = process.env.IKLEAR_HEADER_VAL.split('\n');
      } else {
        IKLEAR_HEADER_VAL = [process.env.IKLEAR_HEADER_VAL];
      }
    }	
	  if (process.env.IKLEAR_URL_VAL) {
      if (process.env.IKLEAR_URL_VAL.indexOf('@') > -1) {
        console.log(`您的IKLEAR_URL_VAL选择的是用@隔开\n`)
        IKLEAR_URL_VAL = process.env.IKLEAR_URL_VAL.split('@');
      } else if (process.env.IKLEAR_URL_VAL.indexOf('\n') > -1) {
        console.log(`您的IKLEAR_URL_VAL选择的是用换行隔开\n`)
        IKLEAR_URL_VAL = process.env.IKLEAR_URL_VAL.split('\n');
      } else {
        IKLEAR_URL_VAL = [process.env.IKLEAR_URL_VAL];
      }
      // IKLEAR_HEADER_VAL = [...new Set(IKLEAR_HEADER_VAL)]
      // $.log(IKLEAR_HEADER_VAL)
    }
    
    
    if (IKLEAR_HEADER_VAL && IKLEAR_HEADER_VAL.length > 0) IKLEAR_COOKIES = [];
    for (let i = 0; i < IKLEAR_HEADER_VAL.length; i ++) {
      IKLEAR_COOKIES.push({
        "signurlVal": IKLEAR_URL_VAL[i] || "",
        "signheaderVal": IKLEAR_HEADER_VAL[i] || "",
      })
    }
    // console.log(`${JSON.stringify(IKLEAR_COOKIES)}`)
  }
}

  !(async () => {
    await getNodeCookie();
    await IKLEARsign();
  })()
      .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
      })
      .finally(() => {
        $.done();
      })
//}

async function IKLEARsign() {
  for (let i = 0; i < IKLEAR_COOKIES.length; i++) {
    $.log(`\n*************开始账号${i + 1}**************\n`);
    tz = '';
    if (!IKLEAR_COOKIES[i]["signheaderVal"]) {
      $.log(`账号${i + 1}暂未提供脚本执行所需的cookie`);
      continue
    }
    signheaderVal = IKLEAR_COOKIES[i]['signheaderVal'];
signurlVal = IKLEAR_COOKIES[i]['signurlVal'];

   
    await sign();//签到
    await getPoints();//查询积分
    await showmsg();//通知
  }
}

function sign() {
  return new Promise((resolve, reject) => {
  const iklearurl = { url: "https://shop42867343.youzan.com/wscump/checkin/checkin.json?checkin_id=7713&kdt_id=42675175", 
    headers:{
      "Accept-Encoding": "gzip, deflate, br",
      "Cookie": signheaderVal,
      "Connection": "keep-alive",
      "Referer": "https://shop42867343.youzan.com/wscump/checkin/result?kdt_id=42675175",
      "Accept": "application/json, text/plain, */*",
      "Host": "shop42867343.youzan.com",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.17(0x17001124) NetType/4G Language/zh_CN",
      "Accept-Language": "zh-cn"
    } 
  }
    $.get(iklearurl, (error, response, data) => {
//    $.log(`${cookieName}, 用户名: ${data}`)

      const result = JSON.parse(data)
      console.log(result)
if (result.code == 0 && result.msg == "ok") {
      const times = result.data.times
      const points = result.data.prizes[0].points
       tz +=
            `签到结果: ✅\n获得${points}积分，连续签到${times}天`
    } else if (result.code == 160540409 || result.msg == "你今天已经签到过啦") {
       tz +=
            '签到结果: ❌\n你似乎已经签过到了...'
    } else if (result.code == 160540414) {
       tz +=
            '签到结果: ❌\nCookie失效，请重新获取Cookie'
    } else {
       tz +=
            '签到结果: ❌\n请查看日志提交反馈'
      $.log(data)
    }

      resolve()
    })
  })
}

function getPoints() {
  return new Promise((resolve, reject) => {
  const getPointsurl = { url: 'https://shop42867343.youzan.com/wscump/pointstore/getCustomerPoints.json', 
    headers:{
      "Accept-Encoding": "gzip, deflate, br",
      "Cookie": signheaderVal,
      "Connection": "keep-alive",
      "Referer": "https://shop42867343.youzan.com/wscump/checkin/result?kdt_id=42675175",
      "Accept": "application/json, text/plain, */*",
      "Host": "shop42867343.youzan.com",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.17(0x17001124) NetType/4G Language/zh_CN",
      "Accept-Language": "zh-cn"
    } 
  }
    $.get(getPointsurl, (error, response, data) => {
//    $.log(`${cookieName}, 用户名: ${data}`)
      const result = JSON.parse(data)
      tz +=`您共有${result.data.currentAmount}积分`
      resolve()
    })
  })
}

function showmsg() {
  return new Promise(async resolve => {
    $.log(`${cookieName}, 签到结果: ${tz}`)
	notify.sendNotify(cookieName, tz)
    resolve()
  })
}


// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
