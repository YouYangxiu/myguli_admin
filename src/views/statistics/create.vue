<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="date" type="date" placeholder="选择要统计的日期" value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-button type="primary" @click="create()">生成</el-button>
    </el-form>
  </div>
</template>
<script>
import statisticsMethod from '@/api/statistics'

export default {
  data() {
    return {
      date: ''
    }
  },
  created() {
  },
  methods: {
    create() {
      statisticsMethod.createStatisticsData(this.date).then(response => {
        this.$message.success('生成成功！')
        this.$router.push({ path: '/statistics/show'})
      })
    }
  }
}
</script>
