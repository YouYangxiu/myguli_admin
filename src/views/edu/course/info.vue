<template>
  <div>
    <el-steps :active="1" finish-status="success">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>

    <el-form ref="form" :model="courseInfo" label-width="80px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder="示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"></el-input>
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择课程讲师">
          <el-option v-for="teacher in teacherList"
                     :key="teacher.id"
                     :label="teacher.name" :value="teacher.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程分类">
        <el-select v-model="courseInfo.subjectParentId" placeholder="请选择课程一级分类" @change="getTwoSubjectList">
          <el-option v-for="subjectOne in subjectOneList"
                     :key="subjectOne.id"
                     :label="subjectOne.title" :value="subjectOne.id"
          >
          </el-option>
        </el-select>

        <el-select v-model="courseInfo.subjectId" placeholder="请选择课程二级分类">
          <el-option v-for="subjectTwo in subjectTwoList"
                     :key="subjectTwo.id"
                     :label="subjectTwo.title" :value="subjectTwo.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number v-model="courseInfo.lessonNum" controls-position="right" :min="0" placeholder="请填写课程的总课时数"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <el-form-item label="课程封面">
        <el-upload
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number v-model="courseInfo.price" controls-position="right" :min="0" placeholder="免费课程请设置为0元"
        ></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import courseMethod from '@/api/edu/course.js'
import teacherMethod from '@/api/edu/teacher.js'
import subjectMethod from '@/api/edu/subject.js'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'info',
  data() {
    return {
      courseInfo: {
        title: '',
        subjectId: '',
        subjectParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1',
        price: 0
      },
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: [],
      BASE_API: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    if (!this.$route.params) {
      this.courseInfo = {}
    }
    this.getAllSubjectsList()
    this.getTeacherList()
    if (this.$route.params && this.$route.params.id) {
      this.getCourseById(this.$route.params.id)
    }
  },

  methods: {
    next() {
      // console.log(this.courseInfo);
      if (this.$route.params && this.$route.params.id) {
        courseMethod.updateCourseInfo(this.courseInfo).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.$router.push({
            path: `/course/chapter/${response.data.courseId}`
          })
        })
      } else {
        courseMethod.addCourseInfo(this.courseInfo).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功！'
          })
          this.$router.push({
            path: `/course/chapter/${response.data.courseId}`
          })
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '保存失败！请稍后再试'
          })
        })
      }
    },
    getTeacherList() {
      teacherMethod.getAllTeachers().then(response => {
        this.teacherList = response.data.items
        console.log(this.teacherList)
      })
    },
    getAllSubjectsList() {
      subjectMethod.getAllSubjectsList().then(response => {
        this.subjectOneList = response.data.list
      })
    },
    getTwoSubjectList(subjectParentId) {
      if (!this.$route.params) {
        this.courseInfo.subjectId = ''
      }
      this.subjectOneList.forEach(item => {
        if (item.id === subjectParentId) {
          this.subjectTwoList = item.children
        }
      })
    },
    handleAvatarSuccess(response) {
      this.courseInfo.cover = response.data.url
    },
    beforeAvatarUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpg) {
        this.$message.error('上传的封面只能是JPG格式！')
      }
      if (!isLt2M) {
        this.$message.error('上传的封面的大小不能超过2MB！')
      }
      return isJpg && isLt2M
    },
    getCourseById(courseId) {
      // console.log("123151sa54d56qw4e8821!@!#!@#");
      // console.log(courseId);
      courseMethod.getCourseById(courseId).then(response => {
        this.courseInfo = response.data.courseInfo
        //解决二级分类显示id的问题
        // console.log('让我看看二级分类id的值', this.courseInfo.subjectId)
        this.getTwoSubjectList(this.courseInfo.subjectParentId)
        // console.log('让我看看二级分类的值', this.subjectTwoList)
      })
    }
  },
  components: {
    Tinymce
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
