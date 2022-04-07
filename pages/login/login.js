// pages/login/login.js
/* 
    登入说明
        1.收集表单信息
        2.前段验证
            1.验证用户信息(账号，密码)是否合法
            2.前段验证不通过就提示用户，不需要发请求给后端
            3.前端验证通过了，发请求（携带，账号密码）给服务器
        3.后端验证
            1.验证用户是否存在
            2.用户不存在直接返回，告诉前段用户不存在
            3.用户存在需要验证密码是否正确
            4.用户密码不正确，告诉密码不正确
            5.用户账户不在缺，告诉用户账号不正确
*/
import request from '../../utils/request'
let md5 = require('../../utils/hd5')
Page({

    /**
     * 页面的初始数据
     */
    data: {
            phone:'',
            password:'',
            rememberLogin: 'true'
    },

    // 表单项内容发生改变之后的回调
    handleInput(e){
        let type = e.currentTarget.id
        this.setData({
            [type]:e.detail.value
        })
    },
    // 登入的回调
    login(){
        let { phone,password} = this.data
        if(!phone){
            wx.showToast({
              title: '手机号不能为空',
              icon:'none'
            })
            return
        }
        // 正则表达式
        let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
        if(!phoneReg.test(phone)){
            wx.showToast({
                title: '手机号格式不正确',
                icon:'none'
              })
              return
        }
        if(!password){
            wx.showToast({
              title: '密码不能为空',
            })
            return
        }
    "pages/login/login",

        request('/login/cellphone',{phone,password,isLogin:true},).then(res =>{
            console.log(res)
            if(res.code === 200){
                wx.showToast({
                  title: '登入成功',
                })
                // 将用户的信息存储到本地
                wx.setStorageSync('userinfo', JSON.stringify(res.profile))
                // 跳转页面
                wx.switchTab({
                  url: '/pages/personal/index',
                })
            }else if(res.code == 400 || res.code === 502){
                let tis = res.code+res.msg
                wx.showToast({
                  title: tis,
                  icon: 'none'
                })
            }
            // else{
            //     wx.showToast({
            //       title: '出现异常，请重新登入',
            //       icon: 'none'
            //     })
            // }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})