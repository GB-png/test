/*
XiaoXiaoYingShi unlock Vip
QX:
https:\/\/.*\..*\.com\/(vod\/reqplay\/|ucp/index|getGlobalData) url script-response-body https://raw.githubusercontent.com/photonmang/quantumultX/master/xxys.js
Surge:
http-response https:\/\/.*\..*\.com\/(vod\/reqplay\/|ucp/index|getGlobalData) requires-body=1,max-size=0,script-path= https://raw.githubusercontent.com/photonmang/quantumultX/master/xxys.js
MITM = *.xxjjappss.com
*/

const path1 = "/ucp/index";
const path2 = "/vod/reqplay/";
const ad = 'getGlobalData';
let obj = JSON.parse($response.body);

if ($request.url.indexOf(path1) != -1){
	obj.data.uinfo["down_daily_remainders"] = "666";
	obj.data.uinfo["play_daily_remainders"] = "666";
	//obj.data.uinfo["curr_group"] = "5";
	obj.data.user["isvip"] = "1";
	//obj.data.user["goldcoin"] = "666";
}
/*if ($request.url.indexOf(path2) != -1){
	obj.retcode = "0";
	obj.data.lastplayindex = "0";
	if(obj.data.hasOwnProperty("httpurl_preview")){
		var playurl = obj.data["httpurl_preview"];
		obj.data["httpurl"] = playurl;
	};
} */

if ($request.url.indexOf(ad) != -1) {
delete obj.data.iOS_adgroups;
delete obj.data.sdkrows_iOS	
}
$done({body: JSON.stringify(obj)});
