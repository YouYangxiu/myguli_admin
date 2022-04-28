import request from '@/utils/request'

export default {
  createStatisticsData(date) {
    return request({
      url: `/staservie/statistics/registerCount/${date}`,
      method: 'post'
    })
  },
  showData(type, begin, end){
    return request({
      url:`/staservie/statistics/showData/${type}/${begin}/${end}`,
      method: 'get'
    })
  }

}
