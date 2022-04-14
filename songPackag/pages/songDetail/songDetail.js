// pages/songDetail/songDetail.js
import request from '../../../utils/request'
import pubSub from 'pubsub-js'
import moment from 'moment'
// 获取全局实例
const appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay:false, // 用来标识音乐是否在播放
        song:{}, //歌曲详情对象
        musicUrl:{}, // 音乐的播放地址
        currenTime:'00:00', //初始化实时时间
        durationTime: '00:00' ,//总时长
        currenWidth: 0, // 实时进度条的长度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 用于接收路由传参的query参数
        // 原生小程序中路由传参，对传参的长度有限制，如果参数过长会自动截取掉
        // console.log(Number(options.id))

        //判断当前音乐是否在播放
        if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == options.id){
            // 修改当前页面的音乐播放转态
            this.setData({
                isPlay:true
            })
        }

        this.getMusicList(Number(options.id))
        /**
         * 如果用户操纵系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的播放转态不一致
         * 解决方案，：
         *  1.通过控制音频的实例去监视音乐播放/暂停
         */
        // 获取音乐实例
        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        // 监视音乐暂停/开启
        this.backgroundAudioManager.onPlay(() =>{
            // 修改音乐是否播放的状态
            this.changPlayState(true)
            // 修改全局音乐播放时的ID
            appInstance.globalData.musicId = options.id
        })
        this.backgroundAudioManager.onPause(() =>{
            this.changPlayState(false)
        })
        this.backgroundAudioManager.onStop(() =>{
            this.changPlayState(false)
        })
        // 监听音乐实时播放的进度
        this.backgroundAudioManager.onTimeUpdate(() =>{
            // 格式化一个实时的时间
            let currenTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currenWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
            this.setData({
                currenTime,
                currenWidth
            })
        })
        // 监听音乐自然播放至结束
        this.backgroundAudioManager.onEnded(() =>{
            // 自动切换到下一首歌，进度条还原成0
            pubSub.subscribe('switchType','next')
            this.setData({
                currenWidth:0,
                currentTime:'00:00'
            })
        })
    },
    // 操作组件实例的封装函数
    changPlayState(isPlay){
        this.setData({
            isPlay
        })
        // 修改app里的变量转态
        appInstance.globalData.isMusicPlay = isPlay
    },
    // 歌曲请求
    getMusicList(id){
        request('/song/detail',{ids:id}).then(res =>{
            let durationTime = moment(res.songs[0].dt).format('mm:ss')
            this.setData({
                song:res.songs[0],
                durationTime
            })
            console.log(durationTime)
            wx.setNavigationBarTitle({
              title:this.data.song.name,
            })
        })
        // 获取音乐的播放链接
        request('/song/url',{id:id}).then(res =>{
            this.setData({
                musicUrl:res.data[0].url
            })
        })
    },
    // 点击播放或者暂停的回调
    // handleMusicPlay(){
    //     let isPlay = !this.data.isPlay
    //     this.setData({
    //         isPlay
    //     })
    //     this.musicControl(isPlay)
    // },
    // 控制音乐播放/暂停的功能函数
    musicControl(){
        let isPlay = !this.data.isPlay
        if(isPlay){
            // 创建控制音乐播放的实例对象
            this.backgroundAudioManager.src = this.data.musicUrl
            this.backgroundAudioManager.title = this.data.song.name
        }else{
            this.backgroundAudioManager.pause()
        }
    },
    // 切歌的回调
    switchMusic(e){
        let type = e.currentTarget.id
        // 关闭当前音乐的实例
        this.backgroundAudioManager.stop()
        // 在新的发布订阅之前，取消上一次的消息订阅
        pubSub.unsubscribe('musicId')
        // 发布消息给recommendSong页面
        pubSub.subscribe('musicId',(msg,musicId) =>{
            this.getMusicList(musicId)
            this.musicControl(true,musicId)
        })
        pubSub.publish('swichType',type)
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