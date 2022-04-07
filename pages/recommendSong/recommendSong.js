// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'', //天
        month:'',//月
        recommendList : [], // 初始化一个列表数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth() + 1
        })
        this.getUserInfoList()
    },
    // 请求接口
    getUserInfoList(){
        let userInfo = wx.getStorageSync('userinfo')
        if(!userInfo){
            wx.showToast({
              title: '请先登入',
              icon:'none',
              success: () =>{
                  // 跳转到登录界面
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
              }
            })
            return
        }
        request('/recommend/songs').then( res =>{
            let recommendList = res.data
            this.setData({
                recommendList:recommendList.dailySongs
            })
        })
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