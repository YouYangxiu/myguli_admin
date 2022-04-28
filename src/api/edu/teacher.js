import request from '@/utils/request'

export default {
  //current代表当前页，size代表每页的大小，teacherQuery代表查询条件
  getTeacherListPage(current, size, teacherQuery) {
    return request({
      url: `/eduservice/teacher/pageTeacherCondition/${current}/${size}`,
      method: 'post',
      data: teacherQuery
    })
  },

  //删除讲师
  deleteTeacherById(id) {
    return request({
      url: `eduservice/teacher/${id}`,
      method: 'delete'
    })
  },

  //添加讲师
  addTeacher(teacher) {
    return request({
      url: '/eduservice/teacher/addTeacher',
      method: 'post',
      data: teacher
    })
  },

  //根据id获取讲师信息
  getTeacherById(id) {
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: 'get'
    })
  },

  //修改讲师信息
  updateTeacher(teacher) {
    return request({
      url: '/eduservice/teacher/updateTeacher',
      method: 'post',
      data: teacher
    })
  },

  //获取所有讲师信息
  getAllTeachers() {
    return request({
      url: '/eduservice/teacher/findAll',
      method: 'get'
    })
  }
}
