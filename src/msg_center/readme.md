## 消息中心

访问url: http://tjz.frezc.com/msg_center/index.html?token={当前用户的token}&id={当前用户的id}

webView需要实现javascript接口：
接口名```nativeInterface```
需要实现的方法
- toast(String msg): 显示toast消息
- tokenExpired(): token过期，需要调用refresh接口并刷新当前webView页面
- tokenInvalid(): 无效token，需要重新登录

## 新消息提醒

在app里轮询调用 /umsg 接口得到未读消息数提醒用户