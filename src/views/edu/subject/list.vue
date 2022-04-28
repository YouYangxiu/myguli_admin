<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      style="margin-bottom: 30px"
    />

    <el-tree
      ref="tree2"
      :data="subjects"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import subjectMethod from "@/api/edu/subject.js";
export default {
  data() {
    return {
      filterText: "",
      subjects: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },
  created() {
    this.getAllSubjectsList();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value) !== -1;
    },
    getAllSubjectsList() {
      subjectMethod.getAllSubjectsList().then((response) => {
        //   console.log(response);
        this.subjects = response.data.list;
        console.log(this.subjects);
      });
    },
  },
};
</script>

