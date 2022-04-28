<template>
  <div>
    <el-steps :active="2" finish-status="success">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <ul class="chanpterList">
      <li v-for="chapterAndVideo in chaptersAndVideos" :key="chapterAndVideo.id">
        <p>
          {{ chapterAndVideo.title }}
          <span class="acts">
            <el-button type="text" @click="openVideoDialog(chapterAndVideo.id)">添加课时</el-button>
            <el-button type="text" @click="editChapter(chapterAndVideo.id)">编辑</el-button>
            <el-button type="text" @click="deleteChapter(chapterAndVideo.id)">删除</el-button>
          </span>
        </p>
        <ul class="videoList">
          <li v-for="video in chapterAndVideo.children" :key="video.id" style="list-style: none">
            <p> {{ video.title }}
              <span class="acts">
            <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
            <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
          </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-button type="primary" @click="openChapterDialog">点我设置课程章节</el-button>
    <el-dialog title="章节信息" :visible.sync="dialogChapterVisible">
      <el-form :model="chapter">
        <el-form-item label="章节标题" :label-width="formLabelWidth">
          <el-input v-model="chapter.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" :label-width="formLabelWidth">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="课时信息" :visible.sync="dialogVideoVisible">
      <el-form :model="video">
        <el-form-item label="课时标题" :label-width="formLabelWidth">
          <el-input v-model="video.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" :label-width="formLabelWidth">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="是否免费" :label-width="formLabelWidth">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="0">免费</el-radio>
            <el-radio :label="1">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频" :label-width="formLabelWidth">
          <!--这里跨域问题并没有解决，需要完善-->
          <el-upload
            action="http://localhost:8083/eduvod/video/uploadAliyunVideo"
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br/>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br/>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br/>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br/>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
    <div>
      <el-button style="margin-top: 12px;" @click="previous">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import chapterMethod from '@/api/edu/chapter.js'
import videoMethod from '@/api/edu/video.js'

export default {
  name: 'chapter',
  data() {
    return {
      chaptersAndVideos: [],
      courseId: '',
      dialogChapterVisible: false,
      dialogVideoVisible: false,
      chapter: {
        sort: 0,
        title: '',
        courseId: ''
      },
      formLabelWidth: '120px',
      video: {
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: '',
        chapterId: '',
        courseId: '',
        videoOriginalName: ''
      },
      BASE_API: process.env.VUE_APP_BASE_API,
      fileList: []
    }
  },
  created() {
    this.showChaptersAndVideos()
  },
  methods: {
    beforeVodRemove(file) {
      return this.$confirm(`确定移除${file.name}?`)
    },
    handleVodUploadSuccess(response, file, fileList) {
      this.$message.success('上传视频成功！')
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },
    handleUploadExceed() {
      this.$message.warning('只能上传一个视频哦～')
    },
    handleVodRemove(file, fileList) {
      videoMethod.deleteAliyunVod(this.video.videoSourceId).then(response => {
        this.$message.success('删除视频成功！')
        this.fileList = []
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
      })
    },
    editVideo(videoId) {
      //数据的回显
      videoMethod.getVideoById(videoId).then(response => {
        this.dialogVideoVisible = true
        console.log(response.data)
        this.video = response.data.result

        //保存数据
      })
    },
    deleteVideo(videoId) {
      videoMethod.deleteVideoById(videoId).then(response => {
        this.$message.success('删除成功！')
        this.showChaptersAndVideos()
      })
    },
    saveOrUpdateVideo() {
      //赋值给video封装用
      this.video.courseId = this.courseId
      if (!this.video.id) {
        videoMethod.addVideo(this.video).then(response => {
          this.dialogVideoVisible = false
          this.$message.success('添加成功！')
          this.showChaptersAndVideos()
        })
      } else {
        videoMethod.updateVideo(this.video).then(response => {
          this.dialogVideoVisible = false
          this.$message.success('修改成功！')
          this.showChaptersAndVideos()
        })
      }
    },
    openVideoDialog(chapterId) {
      this.dialogVideoVisible = true
      this.video = {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        chapterId: '',
        courseId: ''
      }
      this.video.chapterId = chapterId
    },
    editChapter(id) {
      //数据回显
      chapterMethod.getChapterById(id).then(response => {
        this.chapter = response.data.chapter
      })
      this.fileList = this.video.videoOriginalName
      this.dialogChapterVisible = true
    },
    deleteChapter(id) {
      this.$confirm('是否删除此章节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapterMethod.deleteChapterById(id).then(response => {
          this.showChaptersAndVideos()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openChapterDialog() {
      this.dialogChapterVisible = true
      //保存完之后清空表单数据
      this.chapter.title = ''
      this.chapter.sort = 0
    },
    saveOrUpdate() {
      if (this.chapter.id) {
        chapterMethod.updateChapter(this.chapter).then(response => {
          this.dialogChapterVisible = false
          this.$message.success('修改成功！')
          //刷新页面
          this.chapter = {
            sort: 0,
            title: '',
            courseId: ''
          }
          this.showChaptersAndVideos()
        })
      } else {
        //赋值给chapter封装用
        this.chapter.courseId = this.courseId
        chapterMethod.addChapter(this.chapter).then(response => {
          this.dialogChapterVisible = false
          this.$message.success('添加成功！')
          //刷新页面
          this.showChaptersAndVideos()
        })
      }
    },
    next() {
      this.$router.push({
        path: `/course/publish/${this.courseId}`
      })
    },
    previous() {
      this.$router.push({
        path: `/course/info/${this.courseId}`
      })
    },
    showChaptersAndVideos() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id

        chapterMethod.getAllTitlesAndVideosByCourseId(this.courseId).then(response => {
          // console.log('点击删除之后，我执行了嘛？')
          // console.log("==============12412512/=3213=12=321=321=3124582u145")
          // console.log(response)
          this.chaptersAndVideos = response.data.result
          console.log(this.chaptersAndVideos)
        })
      }
    }
  }
}
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chanpterList li {
  position: relative;
}

.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
