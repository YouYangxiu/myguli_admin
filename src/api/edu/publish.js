import request from '@/utils/request.js'

export default {
  getCoursePublishInfo(courseId) {
    return request({
      url: `/eduservice/educourse/getCoursePublishInfo/${courseId}`,
      method: 'get'
    })
  },
  publishCourse(courseId) {
    return request({
      url: `/eduservice/educourse/publishCourse/${courseId}`,
      method: 'post'
    })
  }

}
