/*
XiaoXiaoYingShi unlock Vip
QX:
https:\/\/.*\..*\.com\/(ssp-svr\/ssp\/|ucp/index) url script-response-body https://raw.githubusercontent.com/GB-png/test/master/Task/xxys.js
Surge:
http-response https:\/\/.*\..*\.com\/(ssp-svr\/ssp\/|ucp/index) requires-body=1,max-size=0,script-path= https://raw.githubusercontent.com/GB-png/test/master/Task/xxys.js
MITM = *.xxjjappss.com,acf.huaerdadi.com
*/

const path1 = "/ucp/index";
const ad = 'list3';
let obj = JSON.parse($response.body);

if ($request.url.indexOf(path1) != -1){
	obj.data.uinfo["down_daily_remainders"] = "666";
	obj.data.uinfo["play_daily_remainders"] = "666";
	obj.data.uinfo["curr_group"] = "5";
	obj.data.user["isvip"] = "1";
	obj.data.user["goldcoin"] = "666";
}
/*if ($request.url.indexOf(path2) != -1){
	obj.retcode = "0";
	obj.data.lastplayindex = "0";
	if(obj.data.hasOwnProperty("plt3erl")){
		var playurl = obj.data["plt3erl"];
		obj.data["httpurl"] = playurl;
	};
} */
if ($request.url.indexOf(ad) != -1) {
delete obj.data.pmap
}
$done({body: JSON.stringify(obj)});
