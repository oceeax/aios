// auch-check.js 新加坡稳定版 + 管理员免锁
async function checkLogin() {
  try {
    // 获取当前登录用户
    const user = await window.appwriteClient.account.get();

    // ========== 管理员白名单（填你自己的注册邮箱）==========
    const adminMail = "oevcax@163.com";
    if(user.email === adminMail){
      // 你自己直接放行，永远不锁
      return;
    }
    // =====================================================

    // 普通登录用户正常进
    console.log("已登录普通用户");

  } catch (e) {
    // 未登录 → 锁页面
    document.body.innerHTML = `
    <div style="text-align:center;margin-top:80px;font-size:18px;">
      🔐 未登录，请先登录后使用
    </div>
    `;

    let goLogin = confirm("确定=登录 | 取消=注册");
    if(goLogin){
      let email = prompt("输入邮箱");
      let pwd = prompt("输入密码");
      if(email&&pwd){
        try{
          await window.appwriteClient.account.createEmailSession(email,pwd);
          alert("登录成功，刷新中");
          location.reload();
        }catch(err){
          alert("登录失败："+err.message);
          location.href="/index.html";
        }
      }
    }else{
      let email = prompt("注册邮箱");
      let pwd = prompt("设置密码(至少8位)");
      if(email&&pwd){
        try{
          await window.appwriteClient.account.create("unique()",email,pwd);
          alert("注册成功，请重新登录");
          location.reload();
        }catch(err){
          alert("注册失败："+err.message);
        }
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', checkLogin);
