import request from '@/utils/request'
import axios from 'axios'

export default {
  addVideo(video) {
    return request({
      url: '/eduservice/eduvideo/addVideo',
      method: 'post',
      data: video
    })
  },
  getVideoById(videoId) {
    return request({
      url: `/eduservice/eduvideo/getVideoById/${videoId}`,
      method: 'get'
    })
  },
  deleteVideoById(videoId) {
    return request({
      url: `/eduservice/eduvideo/deleteVideoById/${videoId}`,
      method: 'delete'
    })
  },
  updateVideo(video) {
    return request({
      url: `/eduservice/eduvideo/updateVideo`,
      method: 'post',
      data: video
    })
  },
  deleteAliyunVod(videoSourceId) {
    return axios.delete(`http://localhost:8083/eduvod/deleteAliyunVideById/${videoSourceId}`)
  }
}
