// pages/personal/index.js
let startY = 0 // 手指起始的位置
let moveY = 0  // 手指平移的坐标
let moveDistance = 0  // 手指一动的距离
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:`translateY(0)`,
        coveTransition:'',
        userInfo:{},
        recentPlayList:[]
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