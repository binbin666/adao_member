//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
var rememberPW = false;
/**
 * @brief 获得新的验证码
 */
function getNewVcode(that)
{
  that.setData({ vCodeLoading: true});
  http.get_verifycode(function(res){
    if(res.statusCode == 200)
      that.setData({ verifyCodeURL: res.tempFilePath });
    else
      app.showError('http' + res.statusCode.toString());
  },
  function(){
    app.showError('获取验证码错误');
  });
}


function switchPate(that,new_page)
{
  var now_page = that.data.Mode;
  var now_anime = that.data.animations;

  var animeOut = wx.createAnimation({
    duration:200,
    timingFunction:'ease'
  });
  animeOut.opacity(0).step();



  now_anime[now_page] = animeOut.export();
  that.setData({ vCodeLoading:true, animations: now_anime});

  setTimeout((function callback() {
    that.setData({ Mode: new_page});
    var now_anime = that.data.animations;
    var animeIn = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    });
    animeIn.opacity(1).step();
    now_anime[new_page] = animeIn.export();
    var tt = "登录";
    if(new_page == 0)tt="登录"
    else if(new_page == 1)tt = "注册"
    else if(new_page == 2)tt = "找回密码"
    that.setData({ animations: now_anime, TitleText:tt});
  }).bind(that), 200);
}

Page({
  data: {
    verifyCodeURL:"",
    Mode:0,
    animations:[],
    TitleText:"登录",
    vCodeLoading: true,
    BLoading:false,
    RememberPW:false,
    UserName:'',
    PassWord:''
  },
  onLoad: function (e) {
    var that = this;
    switchPate(that,0);

    var sUN = wx.getStorageSync('UserName');
    var sPW = wx.getStorageSync('PassWord');
    if(sUN != '' && sPW != ''){
      rememberPW = true;
      this.setData({ RememberPW: true, UserName: sUN, PassWord: sPW });
    }

    this.setData({ BLoading:true});
/*
    wx.navigateTo({
      url: '../list/list?tid=1529161587tnZJN',
    });
    return;//不继续登录了
*/
    if (e.tid != undefined) {//通过公众号分享串二维码扫描过来
      wx.navigateTo({
        url: '../list/list?tid=' + e.tid,
      });
      return;//不继续登录了
    }

    http.api_request(
      app.globalData.ApiUrls.CheckSessionURL,
      null,
      function(res){
        if (res.status == 0) {//登陆已经失效
          getNewVcode(that);//请求验证码
        }
        else if (res.toString().indexOf('饼干管理') > 0){
          wx.switchTab({
            url: '../member-cookie/member-cookie',
          });
        }
        else
        {
          app.showError('未知错误');    
        }
        that.setData({ BLoading: false});
      },
      function(){
        app.showError('连接服务器失败');
      }
    );
  },
  onShow: function(e) {
    
  },
  onTapVerifyCode: function(e) {
    var that = this;
    getNewVcode(that);
  },
  onTapIlogin:function(){
    var that = this;
    switchPate(that, 0);
  },
  onTapIsignup: function () {
    var that = this;
    switchPate(that,1);
  },
  onTapIforgot: function () {
    var that = this;
    switchPate(that, 2);
  },
  onCodeLoad: function(e){
    this.setData({ vCodeLoading:false});
  },
  onLoginSubmit:function(e)//登陆
  {
    var that = this;
    var u_email = e.detail.value.email;
    var u_pass  = e.detail.value.passwd;
    var u_vcode = e.detail.value.verifycode;
    if(u_email.indexOf('@') < 1)
    {
      app.showError('邮箱格式错误');
      return;
    }
    if (u_pass.length < 5)
    {
      app.showError('密码长度太短');
      return;
    }
    if (u_vcode.length != 5) {
      app.showError('验证码错误');
      return;
    }
    this.setData({ BLoading: true });
    http.api_request(app.globalData.ApiUrls.LoginURL,
    {
      email:u_email,
      password:u_pass,
      verify:u_vcode
    },
    function(res){
      if (res.status == 1)
      {
        if (rememberPW){
          wx.setStorageSync('UserName', u_email);
          wx.setStorageSync('PassWord', u_pass)
        }
        app.showSuccess(res.info);
        wx.switchTab({
          url: '../member-cookie/member-cookie',
        });
      }
      else
      {
        app.showError(res.info);
        getNewVcode(that);
      }
      that.setData({ BLoading: false });
    },
    function(){
      app.showError('连接服务器失败');
      that.setData({ BLoading: false });
    });
  },
  onSignupSubmit: function(e)//注册
  {
    var that = this;
    var u_email = e.detail.value.email;
    var u_vcode = e.detail.value.verifycode;

    if (u_email.indexOf('@') < 1) {
      app.showError('邮箱格式错误');
      return;
    }

    if (u_vcode.length != 5) {
      app.showError('验证码错误');
      return;
    }
    this.setData({ BLoading: true });
    http.api_request(app.globalData.ApiUrls.SignupURL,
      {
        email: u_email,
        verify: u_vcode
      },
      function (res) {
        if (res.status == 1) {
          app.showSuccess(res.info);
        }
        else {
          app.showError(res.info);
          getNewVcode(that);
        }
        that.setData({ BLoading: false });
      },
      function () {
        app.showError('连接服务器失败');
        that.setData({ BLoading: false });
      });
  },
  onForgotPassSubmit: function (e)//忘记密码
  {
    var that = this;
    var u_email = e.detail.value.email;
    var u_vcode = e.detail.value.verifycode;

    if (u_email.indexOf('@') < 1) {
      app.showError('邮箱格式错误');
      return;
    }

    if (u_vcode.length != 5) {
      app.showError('验证码错误');
      return;
    }
    this.setData({ BLoading: true });
    http.api_request(app.globalData.ApiUrls.ForgotURL,
      {
        email: u_email,
        verify: u_vcode
      },
      function (res) {
        if (res.status == 1) {
          app.showSuccess(res.info);
        }
        else {
          app.showError(res.info);
          getNewVcode(that);
        }
        that.setData({ BLoading: false });
      },
      function () {
        app.showError('连接服务器失败');
        that.setData({ BLoading: false });
      });
  },
  onEat: function(e){
    app.playEat();
  },
  onRPW:function(e){
    rememberPW = e.detail.value;
  },
  onAppDw:function(){
    wx.showActionSheet({
      itemList: ['APP下载', '关于'],
      itemColor: '#334054',
      success: function (e) {
        if (e.cancel != true) {
          if (e.tapIndex == 0) {//App下载
            app.showDownloadAPP();
          }
          else if (e.tapIndex == 1) {//关于
            wx.navigateTo({
              url: '../about/about',
            });
          }
        }
      },
      fail: function () { }
    });
  }
})
