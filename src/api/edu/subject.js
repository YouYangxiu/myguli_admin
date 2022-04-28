import request from "@/utils/request"
export default {
    getAllSubjectsList(){
        return request({
            url: '/eduservice/edusubject/getAllSubjects',
            method: 'get'
        })
    }
}