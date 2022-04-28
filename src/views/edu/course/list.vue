<template>
  <div>
    <h1>课程列表</h1>
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item label="课程标题">
        <el-input v-model="courseQuery.courseTitle" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input v-model="courseQuery.lessonNum" placeholder="课时"></el-input>
      </el-form-item>
      <el-form-item label="价格区间">
        <el-col :span="11">
          <el-input v-model="courseQuery.priceBegin" placeholder="价格"></el-input>
        </el-col>
        <el-col class="line" :span="2">---</el-col>
        <el-col :span="11">
          <el-input v-model="courseQuery.priceEnd" placeholder="价格"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warn" @click="clearData">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" style="width: 100%">
      <el-table-column label="课程封面" width="500">
        <template slot-scope="scope">
          <img :src="scope.row.cover"/>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程标题" width="100"></el-table-column>
      <el-table-column prop="status" label="课程状态" width="100"></el-table-column>
      <el-table-column label="总课时数" width="100" prop="lessonNum"></el-table-column>

      <el-table-column prop="price" label="课程价格" width="120"></el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改课程大纲</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >
            下架
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="current"
      :page-size="size"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getCourseListPage"
    />
  </div>
</template>

<script>
import courseMethod from '@/api/edu/course.js'

export default {
  name: 'list',
  data() {
    return {
      courseQuery: {
        courseTitle: '',
        lessonNum: '',
        priceBegin: '',
        priceEnd: '',
        status: '',
        cover: ''
      },
      current: 1,
      size: 2,
      total: 0,
      list: []
    }
  },
  created() {
    this.getCourseListPage()
  },
  methods: {
    clearData() {
      this.courseQuery = {}
      this.getCourseListPage()
    },
    query() {
      this.getCourseListPage(this.current, this.courseQuery)
    },
    getCourseListPage(current = 1, courseQuery = {}) {
      this.current = current
      this.courseQuery = courseQuery
      courseMethod.getPageCourses(this.current, this.size, this.courseQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.rows
        console.log(this.list)
      })
    },
    removeDataById(courseId) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseMethod.deleteCourseById(courseId).then(response => {
          this.$message.success('删除成功！')
          this.getCourseListPage(this.current, this.courseQuery)
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
