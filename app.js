//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    ApiUrls:{
      //请求验证码需要带Cookie，小程序不好实现，转一下
      VerifyCodeURL: "https://mfweb.top/adao/member/vcode.php",
      LoginURL:"http://adnmb1.com/Member/User/Index/login.html",
      SignupURL:"http://adnmb1.com/Member/User/Index/sendRegister.html",
      ForgotURL:"http://adnmb1.com/Member/User/Index/sendForgotPassword.html",
      CheckSessionURL:"http://adnmb1.com/Member/User/Index/index.html",
      CookiesListURL:"http://adnmb1.com/Member/User/Cookie/index.html",
      CookieDeleteURL:"http://adnmb1.com/Member/User/Cookie/delete/id/",
      CookieGetQRURL: "http://adnmb1.com/Member/User/Cookie/export/id/",
      CookieGetNewURL:"http://adnmb1.com/Member/User/Cookie/apply.html",
      CertifiedStatusURL:"http://adnmb1.com/Member/User/Authentication/mobile.html",
      MobileCertURL:"http://adnmb1.com/Member/User/Authentication/mobileReverseAuthCode",
      MobileCheckURL:"http://adnmb1.com/Member/User/Authentication/isBindMobile"
    }
  }
})