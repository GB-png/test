const cookieName = '海底捞'
const signurlKey = 'signurl_hdl'
const signheaderKey = 'signheader_hdl'
const signbodyKey = 'signbody_hdl'
const hdl = nobyda()

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
   getcookie()
} else {
   sign()
}

function getcookie() {
  if ($request && $request.method == 'POST') {
      const signurlVal = $request.url
      const signheaderVal = JSON.stringify($request.headers)
      const signbodyVal = $request.body
  
      if (signurlVal) hdl.setdata(signurlVal, signurlKey)
      if (signheaderVal) hdl.setdata(signheaderVal, signheaderKey)
      if (signbodyVal) hdl.setdata(signbodyVal, signbodyKey)
       hdl.notify(cookieName, `获取Cookie: 成功, 请禁用该脚本`, ``)
   }
   hdl.done()
}
   
function sign() {
  const signurlVal = "https://activity-1.m.duiba.com.cn/signactivity/doSign"
  const signheaderVal = {"Cookie":"acw_tc=76b20ffa15935955115121295e4f827dc9c8c6b709f175d4dbc5c6b81ff481; _ac=eyJhaWQiOjQ3NjYzLCJjaWQiOjMxODE1NjY4OTl9; createdAtToday=false; dcustom=avatar%3D%2Fapp%2Fuser%2Fheader%2F6654F258E19F4EB182AC7DADD4294A58-1242-1242.jpg%26nickname%3D0000df; isNotLoginUser=false; tokenId=35f4743429c6f2b1afdcfca756a8cd6d; w_ts=1593595510852; wdata3=6S11GWi9qThCGUqZfhd7EGDChc4rASwJLfVm3r24C8jT34xHxVx5vMVKVuqf4WmkUAHtTYXyEZeBqBsPm4zcoFgdq312u5tgTeLRbL9eeR4KB3FTV6ZkGCSpKRXA2MKBioMJQ; wdata4=ORzZOo8tJmnC1sl3bbPnxZ5D8lnFpMCO3tKZlRL3DddQeyg7hcbE1d1AoWeY9u+gLw7666eUa9cS27DlcQJR6GvYENxUsk3jF9/km5nydLfVvw8BI01nP9QwGtsJo1PNsySAgaAa4wTZmzFMvmNw/A=="}
  const signbodyVal = "id=524&signActType=2"
  const url = { url: signurlVal, headers: signheaderVal, body: signbodyVal }
  hdl.post(url, (error, response, data) => {
    hdl.log(`${cookieName}, data: ${data}`)
    const title = `${cookieName}`
    let subTitle = ''
    let detail = ''
    const result = JSON.parse(data)
    if (result.success == true && result.signInfoVO.todaySigned == true) {
      subTitle = `签到结果: 成功`
      detail = `签到奖励: ${result.customInfo.foodNum}火柴, 连签: ${result.signInfoVO.continueDay}天`
    } else if (result.success == false && result.signInfoVO.todaySigned == true) {
      subTitle = `签到结果: 成功 (重复签到)`
      detail = `连签: ${result.signInfoVO.continueDay}天`
    } else {
      subTitle = `签到结果: 失败`
      detail = `说明: ${result.message}, 请重新获取`
    }
    hdl.notify(title, subTitle, detail)
    hdl.done()
  })
}

function nobyda() {
  const start = Date.now()
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const isLoon = typeof $loon != "undefined"
  const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
  const isNode = typeof require == "function" && !isJSBox;
  const NodeSet = 'CookieSet.json'
  const node = (() => {
    if (isNode) {
      const request = require('request');
      const fs = require("fs");
      return ({
        request,
        fs
      })
    } else {
      return (null)
    }
  })()
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message)
    if (isNode) console.log(`${title}\n${subtitle}\n${message}`)
    if (isJSBox) $push.schedule({
      title: title,
      body: subtitle ? subtitle + "\n" + message : message
    })
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key)
    if (isSurge) return $persistentStore.write(value, key)
    if (isNode) {
      try {
        if (!node.fs.existsSync(NodeSet)) node.fs.writeFileSync(NodeSet, JSON.stringify({}));
        const dataValue = JSON.parse(node.fs.readFileSync(NodeSet));
        if (value) dataValue[key] = value;
        if (!value) delete dataValue[key];
        return node.fs.writeFileSync(NodeSet, JSON.stringify(dataValue));
      } catch (er) {
        return AnError('Node.js持久化写入', null, er);
      }
    }
    if (isJSBox) {
      if (!value) return $file.delete(`shared://${key}.txt`);
      return $file.write({
        data: $data({
          string: value
        }),
        path: `shared://${key}.txt`
      })
    }
  }
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
    if (isNode) {
      try {
        if (!node.fs.existsSync(NodeSet)) return null;
        const dataValue = JSON.parse(node.fs.readFileSync(NodeSet))
        return dataValue[key]
      } catch (er) {
        return AnError('Node.js持久化读取', null, er)
      }
    }
    if (isJSBox) {
      if (!$file.exists(`shared://${key}.txt`)) return null;
      return $file.read(`shared://${key}.txt`).string
    }
  }
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
    options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone; iOS 13.4.1; Scale/3.00)'
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "GET"
      //options["opts"] = {
      //  "hints": false
      //}
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) {
      options.headers['X-Surge-Skip-Scripting'] = false
      $httpClient.get(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isNode) {
      node.request(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isJSBox) {
      if (typeof options == "string") options = {
        url: options
      }
      options["header"] = options["headers"]
      options["handler"] = function(resp) {
        let error = resp.error;
        if (error) error = JSON.stringify(resp.error)
        let body = resp.data;
        if (typeof body == "object") body = JSON.stringify(resp.data);
        callback(error, adapterStatus(resp.response), body)
      };
      $http.get(options);
    }
  }
  const post = (options, callback) => {
    options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone; iOS 13.4.1; Scale/3.00)'
    if (options.body) options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "POST"
      //options["opts"] = {
      //  "hints": false
      //}
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) {
      options.headers['X-Surge-Skip-Scripting'] = false
      $httpClient.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isNode) {
      node.request.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isJSBox) {
      if (typeof options == "string") options = {
        url: options
      }
      options["header"] = options["headers"]
      options["handler"] = function(resp) {
        let error = resp.error;
        if (error) error = JSON.stringify(resp.error)
        let body = resp.data;
        if (typeof body == "object") body = JSON.stringify(resp.data)
        callback(error, adapterStatus(resp.response), body)
      }
      $http.post(options);
    }
  }
  const AnError = (name, keyname, er, resp, body) => {
    if (typeof(merge) != "undefined" && keyname) {
      if (!merge[keyname].notify) {
        merge[keyname].notify = `${name}: 异常, 已输出日志 ‼️`
      } else {
        merge[keyname].notify += `\n${name}: 异常, 已输出日志 ‼️ (2)`
      }
      merge[keyname].error = 1
    }
    return console.log(`\n‼️${name}发生错误\n‼️名称: ${er.name}\n‼️描述: ${er.message}${JSON.stringify(er).match(/\"line\"/)?`\n‼️行列: ${JSON.stringify(er)}`:``}${resp&&resp.status?`\n‼️状态: ${resp.status}`:``}${body?`\n‼️响应: ${body}`:``}`)
  }
  const time = () => {
    const end = ((Date.now() - start) / 1000).toFixed(2)
    return console.log('\n签到用时: ' + end + ' 秒')
  }
  const done = (value = {}) => {
    if (isQuanX) return $done(value)
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    AnError,
    isRequest,
    isJSBox,
    isSurge,
    isQuanX,
    isLoon,
    isNode,
    notify,
    write,
    read,
    get,
    post,
    time,
    done
  }
};