// pages/video/index.js
import request from '../../utils/request'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        videroGroupList:[],    //导航的标签数据
        navId:'' , //导航的标识
        videoList:[],  // 视频列表
        videoId:'',//视频标识
        videoUpdateTime:[], //记录video播放的时长
        isTriggered:false // 标识刷新是否被触发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
          title: '加载中',
        })
        this.videroGroupListFun()
    },
    // 获取导航数据
    videroGroupListFun(){
        request('/video/group/list').then(res =>{
            let videroGroupList = res.data.slice(0,14)
            let navId = videroGroupList[0].id
            this.setData({
                videroGroupList,
                navId
            })
            this.getVideoListFun(navId)
        })
    },
    // 点击切换导航的回调
    changNavBtn(e){
        let navId = e.currentTarget.id // 通过id向event传参会自动转换为string
        // let navId = e.currentTarget.dataset.id
        this.setData({
            navId: navId >>> 0,
            videoList: []
        })
        wx.showLoading({
          title: '加载中',
          mask: 'true',
          success:() =>{
            this.getVideoListFun(navId)
          }
        })
    },
    // 获取视频列表数据
    getVideoListFun(id){
        request('/video/group',{id:id}).then(res =>{
            let index = 1
            let videoList = res.datas.map(item => {
                item.id = index++
                return item
            })
            console.log(videoList)
            this.setData({
                videoList,
                // 关闭下拉刷新
                isTriggered:false
            })
            // 关闭消息提示框
            wx.hideLoading()
        })
    },
    // 点击播放继续播放都会执行
    handlePlay(e){
        /**问题： 多视频可以同时播放的问题
         * 需求：
         *      1.在点击播放的事件中需要找到上一个播放的视频
         *      2.在播放新的视频之前关闭上一个正在播放的视频
         * 关键：
         *      1.如何找到上一个视频的实例对象
         *      2.如何确认点击播放的视频喝正在播放的视频不是同一个视频
         * 单例模式：
         *      1.需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象。
         *      2.节约内存空间
         */
        let vid = e.currentTarget.id
        // 关闭上一个视频的实例，
        // if(this.videoContext){
        //     this.videoContext.stop()
        // }
        // this.vid != vid && this.videoContext && this.videoContext.stop()
        // this.vid = vid
        // 更新data中的id状态
        this.setData({
            videoId:vid
        })
        this.videoContext = wx.createVideoContext(vid) 
        //判断当前的视频之前是否有播放记录，如果有就跳转至指定的播放位置
        let {videoUpdateTime} = this.data
        let videoTime = videoUpdateTime.find(item => item.vid === vid)
        if(videoTime){
            this.videoContext.seek(videoTime.currentTime)
        }
        // this.videoContext.play()
    },
    // 监听视频播放进度的函数
    handleTimeUpdate(e){
        let videoTimeObj = {vid:e.currentTarget.id,currentTime:e.detail.currentTime}
        /* 判断播放时长的数组中videoUpdateTime是否有当前视频的播放记录
            1.如果有要在原有的播放记录中修改播放时间为当前的播放时间
            1.如果没有需要在数组中添加当前视屏的播放对象
        */
       let { videoUpdateTime } = this.data
       let videoTime = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
       if(videoTime){
            videoTime.currentTime = videoTimeObj.currentTime
       }else{ // 之前没有
        videoUpdateTime.push(videoTimeObj)
       }
       // 更新videoUpdateTime的状态
       this.setData({
           videoUpdateTime
       })
    },

    /**
     * 视频播放结束调用
     */
    handleEnded(e){
        let {videoUpdateTime} = this.data
        videoUpdateTime.splice( videoUpdateTime.findIndex(item =>item.vid === e.currentTarget.id),1)
        this.setData({
            videoUpdateTime
        })
    },
    // 自定义下拉刷新问题的回调，针对scroll-view
    handleRefresher(){
        // 再次发请求获取最新的列表数据
        setTimeout(() => {
            this.getVideoListFun(this.data.navId)
            console.log('scroll view 的下拉刷新')
        },1000)
    },
    // 自定义上啦处理的回调
    handleTolower(){
        console.log("上啦处理")
        // 数据分页的效果 1.后端分页， 2.前端分页

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
        console.log('页面的下拉刷新')
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function ({from}) {
        console.log(from)
        return {
            title:'网易云音乐',
            page:'/pages/video/index',
            imageUrl:'/static/images/nvsheng.jpg'
        }
    }
})