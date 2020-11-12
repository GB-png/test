const GG = init()
const jsname ='京东互助码'
const notifyInterval=1//0为关闭通知，1为开启
 const zdurl = { url: "http://api.turinglabs.net/api/v1/jd/bean/create/6wsk34xjsiwbwsukiyrer5dkaa5ac3f4ijdgqji/"}
 const ncurl = { url: "http://api.turinglabs.net/api/v1/jd/farm/create/d0dbcd0d7e6d40619c66c85b5807fdc8/"}
 const mcurl = { url: "http://api.turinglabs.net/api/v1/jd/pet/create/MTAxODcxOTI2NTAwMDAwMDAyOTE0MjU5OQ==/"}
 var tz=''
all()

 function all()

 {

   for(var i=0;i<4;i++)
 { (function(i) {
            setTimeout(function() {
    
     if(i==0) zd(i);

else if(i==1) nc(i);

else if(i==2) mc(i);


else if(i==3) showmsg(i);
}, (i + 1) *1000);
                })(i)


}}



function zd()  {
return new Promise((resolve, reject) => {

   GG.get(zdurl, (error, response, data) => {
    const result = JSON.parse(data)
    const code = result.code  
if (code == 200) {      
      tz+='种豆互助码添加成功: ✅'+'\n'
    } else if (code == 400) {
      tz+='种豆互助码你似乎已经添加过了...'+'\n'
    } else{
      tz+='种豆互助码添加异常'+'\n'
    } 
    resolve()
    })
   })
  }  


function nc()  {
return new Promise((resolve, reject) => {

   GG.get(ncurl, (error, response, data) => {
    const result = JSON.parse(data)
    const code = result.code  
if (code == 200) {      
      tz+='农场互助码添加成功: ✅'+'\n'
    } else if (code == 400) {
      tz+='农场互助码你似乎已经添加过了...'+'\n'
    } else{
      tz+='农场互助码添加异常'+'\n'
    } 
    resolve()
    })
   })
  }  
  
function mc()  {
return new Promise((resolve, reject) => {

   GG.get(mcurl, (error, response, data) => {
    const result = JSON.parse(data)
    const code = result.code  
if (code == 200) {      
      tz+='萌宠互助码添加成功: ✅'+'\n'
    } else if (code == 400) {
      tz+='萌宠互助码你似乎已经添加过了...'+'\n'
    } else{
      tz+='萌宠互助码添加异常'+'\n'
    } 
    resolve()
    })
   })
  }  

function showmsg() {

console.log(tz)

if (notifyInterval==1)
GG.msg(jsname,'',tz)
}




function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}