/*
******************************************************************************
感谢LXK9301、ziye、Zzpiglet大佬，排名不分先后

nodejs云端专用。可N个账号。by；GG
 一个账号需三个环境变量/secret
 分别为 HDL_BODY_VAL    HDL_COIN_VAL   HDL_SIGN_VAL
 多个账号  对应三个环境变量/secret 使用@符号或者换行隔开
 环境变量对应关系
 HDL_BODY_VAL  ------》   LVbody
 HDL_COIN_VAL  ------》   coincookie
 HDL_SIGN_VAL  ------》   signcookie



hostname = superapp.kiwa-tech.com, activity-1.m.duiba.com.cn,

 Quantumult X
[task_local]
1 7 * * * https://raw.githubusercontent.com/GB-png/test/master/Task/haidilao.js

[rewrite_local]

^https:\/\/superapp\.kiwa-tech\.com\/app\/coupon\/customerLevelShow url script-request-body https://raw.githubusercontent.com/GB-png/test/master/Task/haidilao.js
^https:\/\/activity-1\.m\.duiba\.com\.cn\/signactivity\/getSignInfo url script-request-header https://raw.githubusercontent.com/GB-png/test/master/Task/haidilao.js


1月19日 云函数、AC使用版本改写完成，增加自动收获锅底、自动添加锅底功能，集齐后可用于兑换 捞派滑牛（半份）

 *****************************************************************************************************************

*/
const cookieName = '海底捞'
const $ = Env(cookieName)
const notify = $.isNode() ? require("./sendNotify") : ``;
const CoinURL = 'https://superapp.kiwa-tech.com/app/coinCommodity/getCoin'
const CheckinURL = 'https://activity-1.m.duiba.com.cn/signactivity/doSign'
const LevelURL = `https://superapp.kiwa-tech.com/app/coupon/customerLevelShow`
const ResultURL = 'https://activity-1.m.duiba.com.cn/signpet/getPetsInfo?activityId=27'
const feedURL ='https://activity-1.m.duiba.com.cn/customActivity/haidilao/signpet/feed'
const prizeURL ='https://activity-1.m.duiba.com.cn/customActivity/haidilao/signpet/takePrize'
const adURL ='https://activity-1.m.duiba.com.cn/customActivity/haidilao/signpet/adopte'
let message = ''
let i, ID, petNO
console.log(`\n========= 脚本执行时间(TM)：${new Date(new Date().getTime() + 0 * 60 * 60 * 1000).toLocaleString('zh', {hour12: false})} =========\n`)


//云函数使用在下面填写
let HDL_COOKIES = [
  {
    "coincookie": ``,
    "signcookie": ``,
    "LVbody": ``
  }
]
function getNodeCookie() {
  if ($.isNode()) {
    let HDL_BODY_VAL = [], HDL_COIN_VAL = [], HDL_SIGN_VAL = [];
    if (process.env.HDL_BODY_VAL) {
      if (process.env.HDL_BODY_VAL.indexOf('@') > -1) {
        console.log(`您的HDL_BODY_VAL选择的是用@隔开\n`)
        HDL_BODY_VAL = process.env.HDL_BODY_VAL.split('@');
      } else if (process.env.HDL_BODY_VAL.indexOf('\n') > -1) {
        console.log(`您的HDL_BODY_VAL选择的是用换行隔开\n`)
        HDL_BODY_VAL = process.env.HDL_BODY_VAL.split('\n');
      } else {
        HDL_BODY_VAL = [process.env.HDL_BODY_VAL];
      }
    }
    if (process.env.HDL_COIN_VAL) {
      if (process.env.HDL_COIN_VAL.indexOf('@') > -1) {
        console.log(`您的HDL_COIN_VAL选择的是用@隔开\n`)
        HDL_COIN_VAL = process.env.HDL_COIN_VAL.split('@');
      } else if (process.env.HDL_BODY_VAL.indexOf('\n') > -1) {
        console.log(`您的HDL_COIN_VAL选择的是用换行隔开\n`)
        HDL_COIN_VAL = process.env.HDL_COIN_VAL.split('\n');
      } else {
        HDL_COIN_VAL = [process.env.HDL_COIN_VAL];
      }
    }
    if (process.env.HDL_SIGN_VAL) {
      if (process.env.HDL_SIGN_VAL.indexOf('@') > -1) {
        console.log(`您的HDL_SIGN_VAL选择的是用@隔开\n`)
        HDL_SIGN_VAL = process.env.HDL_SIGN_VAL.split('@');
      } else if (process.env.HDL_SIGN_VAL.indexOf('\n') > -1) {
        console.log(`您的HDL_SIGN_VAL选择的是用换行隔开\n`)
        HDL_SIGN_VAL = process.env.HDL_SIGN_VAL.split('\n');
      } else {
        HDL_SIGN_VAL = [process.env.HDL_SIGN_VAL];
      }
    }
    if (HDL_BODY_VAL && HDL_BODY_VAL.length > 0) HDL_COOKIES = [];
    for (let i = 0; i < HDL_BODY_VAL.length; i ++) {
      HDL_COOKIES.push({
        "LVbody": HDL_BODY_VAL[i] || "",
        "coincookie": HDL_COIN_VAL[i] || "",
        "signcookie": HDL_SIGN_VAL[i] || ""
      })
    }
  }
}




if ((isGetCookie = typeof $request !== "undefined")) {
  GetCookie();
  $.done();
}

function GetCookie() {
  if ($request && $request.method == "POST" && $request.url.indexOf('Level') >= 0) {
      var TokenValue = $request.headers['Cookie']
      var BodyValue = $request.body
      $.log(`[${cookieName}] 获取查询CK: 成功,coincookie: ${TokenValue}\n`);
      $.msg(cookieName, `获取查询CK: 成功🎉`, ``)
      $.log(`[${cookieName}] 获取查询BD: 成功,LVbody: ${BodyValue}\n`);
      $.msg(cookieName, `获取查询BD: 成功🎉`, ``)
  } else if ($request && $request.method == "POST" && $request.url.indexOf('getSignInfo') >= 0) {
      var CookieValue = $request.headers['Cookie']
      $.log(`[${cookieName}] 获取签到ck: 成功,signcookie: ${CookieValue}\n`);
      $.msg(cookieName, `获取签到ck: 成功🎉`, ``)
  } else {
      $.log("写入" + TokenName + " Token 及 " + CookieName + " Cookie 失败‼️", "", "配置错误, 无法读取请求头, ")
  }
}




!(async () => {
  await getNodeCookie();
  await all();

})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })




  async function all() {
    for (let t = 0; t < HDL_COOKIES.length; t++) {
      $.log(`\n*************开始海底捞账号${t + 1}**************\n`);
      if (!HDL_COOKIES[t]["LVbody"] || !HDL_COOKIES[t]['coincookie'] || !HDL_COOKIES[t]['signcookie']) {
        $.log(`账号${t + 1}暂未提供脚本执行所需的cookie`);
        continue
      }
      LVbody = HDL_COOKIES[t]['LVbody'];
      coincookie = HDL_COOKIES[t]['coincookie'];
      signcookie = HDL_COOKIES[t]['signcookie'];

    await GetLevel();
    await Checkin();
    await GetCoin();
    await GetData();
      for(i=0;i<$.obj4.data.pets.length;i++){
        ID =$.obj4.data.pets[i].id
        petNO =$.obj4.data.pets[i].identifier
        if ($.obj4.data.foodNum-(i+1)*25>= 0 && $.obj4.data.pets[i].feedCount == 0){
          await Getfeed()
          await $.wait(2000)
        }else if($.obj4.data.pets[i].petExp == 100){
          await Getprize()
          await $.wait(2000)
          await Getopte()
          await $.wait(2000)
        }

      }
    }
    await showmsg(); 
  }

  //海底捞等级
  function GetLevel() {
    return new Promise((resolve, reject) => {
      let HiLevel = {
        url: LevelURL,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Cookie": coincookie,
        },
        body: LVbody
    }
      $.post(HiLevel, (error, response, data) => {
        $.obj = JSON.parse(data)
        const customerlevel = ["红海会员", "银海会员",  "金海会员", "黑海会员"]
        var hdllevel = customerlevel[$.obj.data.level - 1]
        message+=`尊敬的${hdllevel}\n`
        resolve()
      })
    })
  }
  //捞币数量
  function GetCoin() {
    return new Promise(resolve => {
        let HiCoin = {
            url: CoinURL,
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Cookie": coincookie,
          },
          body: LVbody
        }
        $.post(HiCoin, function (error, response, data) {
            try {
                const obj2 = JSON.parse(data)
                message+=`【财富信息】您有`+obj2.data+`捞币,`
                resolve ('done')
            } catch (e) {
                $.log("海底捞捞币"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
  }
//每日签到
  function Checkin() {
    return new Promise((resolve) => {
      let HiCheckin = {
        url: CheckinURL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": signcookie,
            "Referer": "https://activity-1.m.duiba.com.cn/signpet/index?activityId=27&from=login&spm=47663.1.1.1",
        },
        body: "id=524&signActType=2"
    }
      $.post(HiCheckin, (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            $.obj3 = JSON.parse(data)
            if($.obj3.success == false){
              message+=`【签到信息】您重复签到❌❌❌,`+`连续签到`+$.obj3.signInfoVO.continueDay+`天\n`
             }else if($.obj3.success == true){
              message+=`【签到信息】签到成功✅✅✅\n`+`获得`+$.obj3.customInfo.foodNum+`柴火,连续签到`+$.obj3.signInfoVO.continueDay+`天\n`
             } 
            resolve ()
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
//获取锅底信息
  function GetData() {
    return new Promise((resolve) => {
      let HiData = {
        url: ResultURL,
        headers: {
          "Cookie":signcookie
      }
      }
      
      $.get(HiData, async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            $.obj4 = JSON.parse(data);
            message+=$.obj4.data.foodNum+$.obj4.data.foodName
            }
          }
         catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }

//锅底添加柴火  
  function Getfeed() {
    return new Promise((resolve) => {
      let getfeed = {
        url: feedURL,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": signcookie,
          "Referer": "https://activity-1.m.duiba.com.cn/signpet/index?activityId=27&from=login&spm=47663.1.1.1",
      },
      body: `petId=${ID}&activityId=27`
                }
      $.post(getfeed, async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`);
          } else {
            $.obj5 = JSON.parse(data);
            if($.obj5.success == true ){
              message+=`\n【自动添柴】【锅底${i+1}】:添柴成功`
            }else{
              message+=`\n【自动添柴】【锅底${i+1}】:${$.obj5.desc}`
            }

          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }

//收获锅底 
function Getprize() {
  return new Promise((resolve) => {
    let petprize = {
      url: prizeURL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": signcookie,
    },
    body: `petId=${ID}&activityId=27`
              }
    $.post(petprize, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          $.obj6 = JSON.parse(data);
          if($.obj6.success == true ){
            message+=`\n【收获锅底】【锅底${i+1}】:收获成功`
          }else{
            message+=`\n【收获锅底】【锅底${i+1}】:${$.obj6.desc}`
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}


//坑位添锅底
function Getopte() {
  return new Promise((resolve) => {
    var arr = ["清油麻辣锅","菌菇锅"]; 
    var ad = Math.floor((Math.random()*arr.length)); 
    let adfood = {
    url: adURL,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": signcookie,
  },
   body:`activityId=27&petName=${ad}&petIdentifier=${petNO}&petConfigId=2`
}  
    $.post(adfood, async (err, resp, data) => {    
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          $.obj7 = JSON.parse(data);
          if($.obj7.success == true ){
            message+=`\n【添加锅底】【坑位${i+1}】:锅底添加成功`
          }else{
            message+=`\n【添加锅底】【坑位${i+1}】:${$.obj7.desc}`
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

 


function showmsg() {
    return new Promise(async resolve => {
     console.log(message)
     notify.sendNotify(cookieName, message)
      resolve()
    })
  }




// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
