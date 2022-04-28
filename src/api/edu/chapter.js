import request from '@/utils/request.js'

export default {
  getAllTitlesAndVideosByCourseId(courseId) {
    return request({
      url: `/eduservice/educhapter/getTitlesByCourseId/${courseId}`,
      method: 'get'
    })
  },

  addChapter(chapter) {
    return request({
      url: `/eduservice/educhapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },

  updateChapter(chapter) {
    return request({
      url: `/eduservice/educhapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },

  getChapterById(chapterId) {
    return request({
      url: `/eduservice/educhapter/getChapter/${chapterId}`,
      method: 'get'
    })
  },

  deleteChapterById(chapterId) {
    return request({
      url: `/eduservice/educhapter/deleteChapterById/${chapterId}`,
      method: 'delete'
    })
  },
}
