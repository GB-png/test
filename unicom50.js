/*
中国联通 · 50话费任务

【作者信息】
yaohuo：Brian
ID: 10103
tips: 本脚本仅供学习与交流，请勿用于商业用途，违者后果自负！
代码搬运、修改等均不需要经过本人同意，但请保留此信息和本人作者信息。
Time:2025-12-25 11:52:00

配置说明:
变量名: UNICOM_ACCOUNTS_PWD
填账号密码 (新方式 - 推荐):
   export UNICOM_ACCOUNTS_PWD="18600000000#123456"
   (多账号用 @ 隔开)

活动每天10点开始，建议定时任务时间设置为 9:58、就开始执行 重复执行

*/

const got = require("got");
const crypto = require("crypto");

// ===== 配置 =====
const ENV_KEY = "UNICOM_ACCOUNTS_PWD";
const ACCOUNTS = process.env[ENV_KEY]?.split(/[\n&@]/).filter(Boolean) || [];
const TASK_ID = "42e1f82aaf1b4fd4946070db81e658e6";
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) unicom{version:iphone_c@12.0801}";

// ===== 登录公钥 =====
const LOGIN_PUB_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDc+CZK9bBA9IU+gZUOc6FUGu7yO9Wp
TNB0PzmgFBh96Mg1WrovD1oqZ+eIF4LjvxKXGOdI79JRdve9NPhQo07+uqGQgE4imwNn
Rx7PFtCRryiIEcUoavuNtuRVoBAm6qdB0SrctgaqGfLgKvZHOnwTjyNqjBUxzMeQlEC2
czEMSwIDAQAB
-----END PUBLIC KEY-----`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ===== 联通类 =====
class Unicom {
  constructor(input) {
    this.mobile = "";
    this.password = "";
    this.ecs_token = "";
    this.notifyLogs = [];
    this.stopped = false;

    if (input.includes("#") && input.length < 60) {
      [this.mobile, this.password] = input.split("#");
    } else {
      this.ecs_token = input;
    }

    this.client = got.extend({
      timeout: 20000,
      headers: { "User-Agent": UA },
    });
  }

  rsa(val) {
    const buf = Buffer.from(val + Math.random().toString().slice(2, 8));
    return crypto.publicEncrypt(
      { key: LOGIN_PUB_KEY, padding: crypto.constants.RSA_PKCS1_PADDING },
      buf
    ).toString("base64");
  }

  async login() {
    if (!this.mobile) return true;
    console.log(`📱 ${this.mobile || "token账号"} ▶️ 开始任务`);

    const res = await this.client.post(
      "https://m.client.10010.com/mobileService/login.htm",
      {
        form: {
          version: "iphone_c@12.0100",
          mobile: this.rsa(this.mobile),
          password: this.rsa(this.password),
          deviceModel: "iPhone",
          reqtime: new Date().toISOString().replace("T", " ").slice(0, 19),
        },
      }
    ).json();

    if (res?.token_online) {
      this.token_online = res.token_online;
      return true;
    }

    this.notifyLogs.push("❌ 登录失败");
    return false;
  }

  async online() {
    if (!this.ecs_token) {
      const res = await this.client.post(
        "https://m.client.10010.com/mobileService/onLine.htm",
        {
          form: {
            token_online: this.token_online,
            version: "android@11.0000",
            netWay: "Wifi",
            step: "dingshi",
          },
        }
      ).json();

      this.ecs_token = res?.ecs_token;
    }

    if (!this.ecs_token) {
      this.notifyLogs.push("❌ 获取 ecs_token 失败");
    }

    return !!this.ecs_token;
  }

  get authHeaders() {
    return {
      Cookie: `ecs_token=${this.ecs_token}`,
      Origin: "https://activity.10010.com",
      Referer: "https://activity.10010.com/",
    };
  }

  async getTaskUrlOnce() {
    const res = await this.client.get(
      "https://activity.10010.com/activityRecharge/task/flowManagement",
      { headers: this.authHeaders }
    ).json();

    const task = res?.data?.urlList?.find(v => v.taskId === TASK_ID);
    return task?.url || null;
  }

  async doTask(url) {
    const res = await this.client.get(url, {
      searchParams: { taskId: TASK_ID },
      headers: this.authHeaders,
    }).json();

    console.log(`📱 ${this.mobile || "token账号"} ⏳ 正在抢50话费券中...`);

    if (res?.code === "0108") {
      return { status: "NO_STOCK" };
    }

    if (res?.code === "0109") {
      return { status: "LIMITING" };
    }

    if (res?.code === "0000" && res?.data?.uuid) {
      return { status: "SUCCESS", uuid: res.data.uuid };
    }

    return { status: "ERROR", msg: res?.desc || res?.message };
  }

  async queryWinning(uuid) {
    return await this.client.get(
      "https://activity.10010.com/activityRecharge/task/winningRecord",
      {
        searchParams: { uuid },
        headers: this.authHeaders,
      }
    ).json();
  }

  async runLoop() {
    let count = 0;

    const taskUrl = await this.getTaskUrlOnce();
    if (!taskUrl) {
      this.notifyLogs.push("❌ 未获取任务 URL");
      return;
    }

    console.log(`📱 ${this.mobile || "token账号"} ✅ 已获取活动接口 URL`);

    while (!this.stopped) {
      try {
        const res = await this.doTask(taskUrl);
        count++;

        // ❌ 库存不足 → 立刻停止
        if (res.status === "NO_STOCK") {
          console.log(`📱 ${this.mobile || "token账号"} ❌ 库存不足（0108），停止`);
          this.notifyLogs.push(
            `📱 ${this.mobile || "token账号"}\n🚫 库存不足（0108），已停止`
          );
          this.stopped = true;
          break;
        }

        // ❌ 接口限流 → 立刻停止
        if (res.status === "LIMITING") {
          console.log(`📱 ${this.mobile || "token账号"} ❌ 接口限流（0109），停止`);
          this.notifyLogs.push(
            `📱 ${this.mobile || "token账号"}\n🚫 接口限流（0109），已停止`
          );
          this.stopped = true;
          break;
        }

        // ✅ 成功
        if (res.status === "SUCCESS") {
          const win = await this.queryWinning(res.uuid);
          console.log(`🎉 ${this.mobile || "token账号"} 成功一次`);
          this.notifyLogs.push(
            `📱 ${this.mobile || "token账号"}\n🎉 成功一次\n${JSON.stringify(win?.data || win)}`
          );
        }
      } catch (e) {
        console.log(`❌ ${this.mobile || "token账号"} 异常：${e.message}`);
      }

      await sleep(150 + Math.random() * 200);
    }

    this.notifyLogs.push(
      `📱 ${this.mobile || "token账号"}\n⏱️ 结束，请求 ${count} 次`
    );
  }

  async run() {
    if (!(await this.login())) return;
    if (!(await this.online())) return;
    await this.runLoop();
  }
}

// ===== 主流程（多账号并发）=====
(async () => {
  const users = ACCOUNTS.map(v => new Unicom(v.trim()));

  await Promise.all(
    users.map(u =>
      u.run().catch(e => u.notifyLogs.push(`❌ 异常：${e.message}`))
    )
  );

  let content = "";
  users.forEach(u => {
    if (u.notifyLogs.length) {
      content += u.notifyLogs.join("\n\n") + "\n\n";
    }
  });

  if (content) {
    await QLAPI.systemNotify({
      title: "中国联通 50话费任务",
      content,
    });
  }
})();
