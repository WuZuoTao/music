// pages/search/search.js
import request from "../../utils/request"
let searchTime = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholdContent:'',// 搜索的默认内容
        searchHoldList:[],  // 热收列表
        searchContent:'',  //初始化表单的数据
        searchList:[], //初始化模糊匹配的数据
        historyList:[]    //初始化搜索历史数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getintiData()
        this.getStorageHistoryList()
       
    },
    // 清空历史搜索记录
    getStorageHistoryList(){
        if(wx.getStorageSync('searchHistory')){
            this.setData({
                historyList:wx.getStorageSync('searchHistory')
            })
        }
    },
    // 发送请求
    getintiData(){
        request('/search/default').then((res) =>{
            let placeholdContent = res.data.showKeyword
            this.setData({
                placeholdContent
            })
        })
        request('/search/hot/detail').then(res =>{
            this.setData({
                searchHoldList:res.data
            })
        })
    },
    /// 表单项内容发生改变的回调
    handleInputChange(e){
        this.setData({
            searchContent:e.detail.value.trim()
        })
        // 函数节流
        clearTimeout(searchTime)
       if(this.data.searchContent){
        searchTime = setTimeout(() =>{
            // 发请求获取关键字,模糊匹配数据
            request('/search',{keywords:this.data.searchContent,limit:10}).then((res) =>{
                let {historyList , searchContent} = this.data
                if(historyList.indexOf(searchContent) !== -1){
                    historyList.splice(historyList.indexOf(searchContent),1)
                }
                historyList.unshift(searchContent)
                wx.setStorageSync('searchHistory', historyList)
                    this.setData({
                        searchList: res.result.songs,
                        historyList
                    })
            })},300)
       }else{
            this.setData({
                searchList : []
            })
       }
    },
    // 清空搜索
    clearSearchContent(){
        this.setData({
            searchContent:'',
            searchList:[]
        })
    },
    // 删除历史记录缓存
    deleteSearchContent(){
        wx.showModal({
            content:'确认删除历史搜索记录吗？',
            success:(res) => {
                if(res.confirm){
                     // 清空data中historyList
                    this.setData({
                        historyList:[]
                    })
                    wx.removeStorageSync('searchHistory')
                }
            }
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