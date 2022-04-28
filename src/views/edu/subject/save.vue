<template>
  <div>
    <el-form>
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a
            :href="'https://youyangxiu.oss-cn-beijing.aliyuncs.com/excelDemo/01.xlsx'"
            >点击下载模版</a
          >
        </el-tag>
      </el-form-item>
    </el-form>
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="BASE_API + '/eduservice/edusubject/addSubject'"
      :on-success="FileUploadSuccess"
      :on-exceed="FileUploadExceed"
      :on-error="FileUploadError"
      :name="file"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      :file-list="fileList"
      :auto-upload="false"
      :limit="1"
    >
      <el-button slot="trigger" size="small" type="primary"
        >选取excel文件</el-button
      >
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        >上传到服务器</el-button
      >
      <div slot="tip" class="el-upload__tip">
        只能上传excel文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      BASE_API: process.env.VUE_APP_BASE_API,
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    FileUploadSuccess() {
      this.$message({
        type: "success",
        message: "上传课程分类成功!",
      });
      this.$router.push({ path: "./list" });
    },
    FileUploadExceed() {
      this.$message({
        type: "warning",
        message: "一次只能上传一份文件！",
      });
    },
    FileUploadError() {
      this.$message({
        type: "error",
        message: "上传失败！请稍后再试",
      });
    },
  },
};
</script>

<style>
</style>
