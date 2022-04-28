import request from '@/utils/request.js'

export default {
  addCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/educourse/addCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },
  getCourseById(courseId) {
    return request({
      url: `/eduservice/educourse/getCourseById/${courseId}`,
      method: 'get'
    })
  },
  updateCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/educourse/updateCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },
  //查询所有课程分页
  getPageCourses(current, size, courseQuery) {
    return request({
      url: `/eduservice/educourse/getPageCourses/${current}/${size}`,
      method: 'post',
      data: courseQuery
    })
  },

  //根据id删除课程
  deleteCourseById(courseId) {
    return request({
      url: `/eduservice/educourse/deleteCourseById/${courseId}`,
      method: 'delete'
    })
  }
}
