// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
import pubSub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'', //天
        month:'',//月
        recommendList : [], // 初始化一个列表数据
        index : 0 , // 用来标识点击初始化下表的音乐
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

        // 来自songDetail发布的消息
        pubSub.subscribe('swichType',(msg,type) =>{
            let { recommendList, index } = this.data
                if(type === 'pre'){
                    // 断言函数
                    (index === 0) && (index = recommendList.length )
                    index = index - 1
                }else{
                    (index === recommendList.length - 1 ) && (index = -1)
                    index = index + 1
                }
                this.setData({
                    index
                })
            let musicId = recommendList[index].id
            // 将musicId回传给songDetail
            pubSub.publish('musicId',musicId)
        })
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
    //跳转至songDetail页面
    toSongDeteail(e){
        let {id,index} = e.currentTarget.dataset
        // 路由跳转传参， 支持的query参数
        wx.navigateTo({
          url: '/pages/songDetail/songDetail?id=' + id,
        })
        this.setData({
            index
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