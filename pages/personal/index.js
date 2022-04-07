import request from '../../utils/request'

// pages/personal/index.js
let startY = 0 // 手指起始的位置
let moveY = 0  // 手指平移的坐标
let moveDistance = 0  // 手指一动的距离
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:`translateY(0)`, // CSS3移动
        coveTransition:'',
        userInfo:'', // 用户信息
        recentPlayList:[] // 用户播放记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       this.UserInfoFun()
       if(this.data.userInfo){
        this.getRecentPlayListFun(this.data.userInfo.userId)
       }
    },
    // 获取用户基本信息
    UserInfoFun(){
         let userinfo = wx.getStorageSync('userinfo')
         if(userinfo){
             // 更新userinfo的转态
             this.setData({
                 userInfo:JSON.parse(userinfo)
             })
         }
    },
    // 获取用户最近播放记录
    getRecentPlayListFun(userId){
        let index = 1
        request('/user/record',{uid:userId,type:0}).then(res =>{
            let recentPlayList = res.allData.splice(0,20).map(item =>{
                item.id = index++
                return item
            })
            this.setData({
                recentPlayList
            })
        })
    },
    // 跳转到登入页面的回调
    toLogin(){
        wx.redirectTo({
          url: '/pages/login/login',
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
    handleTouchStart(e){
        this.setData({
            coveTransition:''
        })
        // 获取手指的坐标
        startY = e.touches[0].clientY
    },
    handleTouchMove(e){
        moveY = e.touches[0].clientY
        moveDistance = moveY - startY
        if(moveDistance <= 0) return
        if(moveDistance >= 80) moveDistance = 80
        
        // 动态更新coverTransform的转态值
        this.setData({
            coverTransform:`translateY(${moveDistance}rpx)`
        })
    },
    handleTouchEnd(){
        this.setData({
            coverTransform:`translateY(0rpx)`,
            coveTransition:`transform 1s ;inear`
        })
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