
const GG = init()
 const zdurl = { url: "http://api.turinglabs.net/api/v1/jd/bean/create/6wsk34xjsiwbwsukiyrer5dkaa5ac3f4ijdgqji/"}
 const ncurl = { url: "http://api.turinglabs.net/api/v1/jd/farm/create/d0dbcd0d7e6d40619c66c85b5807fdc8/"}
 const mcurl = { url: "http://api.turinglabs.net/api/v1/jd/pet/create/MTAxODcxOTI2NTAwMDAwMDAyOTE0MjU5OQ==/"}
 
sign()

function zd() {
  GG.get(zdurl, (error, response, data) => {
    const result = JSON.parse(data)
    const code = result.code
    let subTitle = ``
    let detail = ``
    if (code == 200) {      
      subTitle = `添加结果: ✅`
      detail = `互助码添加成功`
    } else if (code == 400) {
      subTitle = `添加结果: ✅`
      detail = `你似乎已经添加过了...`
    } 
    GG.msg("种豆互助码",subTitle,detail)

  })
}

function nc() {
  GG.get(ncurl, (error, response, data) => {
    const result = JSON.parse(data)
    const code = result.code
    let subTitle = ``
    let detail = ``
    if (code == 200) {      
      subTitle = `添加结果: ✅`
      detail = `互助码添加成功`
    } else if (code == 400) {
      subTitle = `添加结果: ✅`
      detail = `你似乎已经添加过了...`
    } 
    GG.msg("农场互助码",subTitle,detail)

  })
}

function mc() {
  GG.get(mcurl, (error, response, data) => {
    const result = JSON.parse(data)
    const code = result.code
    let subTitle = ``
    let detail = ``
    if (code == 200) {      
      subTitle = `添加结果: ✅`
      detail = `互助码添加成功`
    } else if (code == 400) {
      subTitle = `添加结果: ✅`
      detail = `你似乎已经添加过了...`
    } 
   GG.msg("萌宠互助码",subTitle,detail)

  })
}

function sign() {
zd()
nc() 
mc()
GG.done()
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
