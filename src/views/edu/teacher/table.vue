<template>
  <div class="app-container">
    <h1>讲师列表</h1>
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="teacherQuery.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="头衔">
        <el-select v-model="teacherQuery.level" placeholder="头衔">
          <el-option label="" value=""></el-option>
          <el-option label="高级讲师" value="1"></el-option>
          <el-option label="首席讲师" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="teacherQuery.begin"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">---</el-col>
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="teacherQuery.end"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warn" @click="clearData">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- <div v-for="(teacher, index) in list" :key="index">
      {{teacher.name}}
      <img :src="teacher.avatar">
    </div> -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>

      <el-table-column label="头衔" width="100">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" width="280"></el-table-column>

      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        width="180"
      ></el-table-column>

      <el-table-column prop="sort" label="排序" width="120"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
            >修改
            </el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >
            删除
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
      @current-change="getTeacherListPage"
    />
  </div>
</template>

<script>
import teacherMethod from '@/api/edu/teacher.js'

export default {
  data() {
    return {
      current: 1, //当前页
      size: 5, //每页显示的条数
      total: 0, //总记录数字
      teacherQuery: {
        name: '',
        level: null,
        begin: '',
        end: ''
      }, //查询条件
      list: [] //查询结果
    }
  },
  created() {
    this.getTeacherListPage()
  },
  methods: {
    getTeacherListPage(current = 1, teacherQuery = {}) {
      this.current = current
      this.teacherQuery = teacherQuery
      teacherMethod
        .getTeacherListPage(this.current, this.size, this.teacherQuery)
        .then((response) => {
          console.log(response)
          this.list = response.data.rows
          this.total = response.data.total
          // console.log(this.list);
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onSubmit() {
      this.getTeacherListPage(this.current, this.teacherQuery)
    },
    clearData() {
      this.teacherQuery = {}
      this.getTeacherListPage()
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除该讲师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          teacherMethod
            .deleteTeacherById(id)
            .then((response) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTeacherListPage()
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
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

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
