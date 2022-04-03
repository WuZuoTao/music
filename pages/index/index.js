// 引入封装好的axios
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImage:[],
    personalizedList:[],
    topList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.indexBannerImage()
    this.indexpersonalizedList()
    this.indexTopList()
  },
  // 轮播图API请求
  indexBannerImage(){
    request('/api/v2/banner/get',{clientType: 'iphone'}).then(res =>{
      this.setData({
        bannerImage: res.banners
      })
    })
  },
  // 排行榜数据
  /**
   * 需求分析：
   *    1.需要根据Idx获取对应的数据
   *    2.idx的取值范围0-20   需要0-4
   *    3.需要发送5次请求
   */
  indexTopList(){
    let index = 0
    let itemArr = []
    request('/api/toplist/detail').then(res =>{
      while(index < 4){
      let topListItem = {name:res.list[index].name,tarcks:res.list[index].tracks}
      itemArr.push(topListItem)
      index++
      }
      this.setData({
        topList:itemArr
      })
      console.log(this.data.topList)
    })
  },
  // 推荐请求
  indexpersonalizedList(){
    request('/api/personalized/playlist',{limit:20}).then(res =>{
      this.setData({
        personalizedList:res.result
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