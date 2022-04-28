<template>
  <div class="app-container">
    <h1>添加讲师</h1>
    <el-form ref="form" :model="teacher" label-width="80px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"></el-input>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="讲师介绍">
        <el-input v-model="teacher.intro" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"></el-input>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" placeholder="请选择讲师头衔">
          <el-option label="高级讲师" value="1"></el-option>
          <el-option label="首席讲师" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传头像">
        <el-upload
          class="avatar-uploader"
          :action="BASE_API + '/eduoss/fileoss'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="teacher.avatar" :src="teacher.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherMethod from "@/api/edu/teacher.js";

export default {
  data() {
    return {
      teacher: {
        name: "",
        intro: "",
        level: "",
        career: "",
        sort: 0,
        avatar: "",
      },
      BASE_API: process.env.VUE_APP_BASE_API,
    };
  },
  created() {
    // console.log("========================");
    if (this.$route.params && this.$route.params.id) {
      //如果有参数且id存在
      const id = this.$route.params.id;
      // console.log(id);
      this.getTeacherById(id);
    }
  },
  methods: {
    //根据id获取教师信息
    getTeacherById(id) {
      teacherMethod.getTeacherById(id).then((response) => {
        this.teacher = response.data.teacher;
        // console.log(this.teacher)
      });
    },
    //点击保存的逻辑，根据地址栏判断
    onSubmit() {
      if (this.$route.params && this.$route.params.id) {
        teacherMethod.updateTeacher(this.teacher).then((response) => {
          this.$message({
            type: "success",
            message: "修改成功！!",
          });
          this.$router.push({
            path: "/teacher/table",
          });
        });
      } else {
        teacherMethod.addTeacher(this.teacher).then((response) => {
          this.$message({
            type: "success",
            message: "添加成功!",
          });
          this.$router.push({ path: "/teacher/table" });
        });
      }
    },
    //点击取消之后的逻辑，根据地址栏判断逻辑
    cancel() {
      if (this.$route.params && this.$route.params.id) {
        this.$router.push({ path: "/teacher/table" });
      } else {
        this.teacher = {};
      }
    },
    //上传成功后返回地址
    handleAvatarSuccess(response) {
      // console.log("~~~~~~~~~~~~~~~~~~~~#@!$@!%!@^@#^@$&$#&$%&")
      // console.log(res);
      // console.log(file);
      this.teacher.avatar = response.data.url;
      // console.log(this.avatar);
    },
    //上传前校验图片的格式
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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