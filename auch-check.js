// auth-check.js
async function checkLogin() {
  try {
    // 检测当前登录会话
    await window.appwriteClient.account.get();
    console.log("用户已登录，可正常使用工具");
  } catch (e) {
    // 未登录，清空页面并弹出登录/注册框
    document.body.innerHTML = `
      <div style="text-align:center; margin-top:100px; font-size:20px;">
        🔐 请先登录才能使用此工具
      </div>
    `;

    const action = confirm("老用户点「确定」登录，新用户点「取消」注册");
    if (action) {
      // 登录流程
      const email = prompt("请输入你的邮箱：");
      const password = prompt("请输入你的密码：");
      if (email && password) {
        try {
          await window.appwriteClient.account.createEmailSession(email, password);
          alert("登录成功！正在刷新页面...");
          location.reload();
        } catch (err) {
          alert("登录失败：" + err.message);
          location.href = "/index.html"; // 跳回首页
        }
      }
    } else {
      // 注册流程
      const email = prompt("请输入你的邮箱：");
      const password = prompt("请设置你的密码（至少8位）：");
      if (email && password) {
        try {
          await window.appwriteClient.account.create('unique()', email, password);
          alert("注册成功！请重新登录");
          location.reload();
        } catch (err) {
          alert("注册失败：" + err.message);
          location.href = "/index.html";
        }
      }
    }
  }
}

// 页面加载时自动执行检查
window.onload = checkLogin;
