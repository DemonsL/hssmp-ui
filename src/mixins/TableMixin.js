export const TableMixin = {
  data() {
    return {
    }
  },
  created(){
  },
  methods: {
    // handleDelete: function (id) {
    //   if(!this.url.delete){
    //     this.$message.error("请设置url.delete属性!")
    //     return
    //   }
    //   var that = this;
    //   deleteAction(that.url.delete, {id: id}).then((res) => {
    //     if (res.success) {
    //       that.$message.success(res.message);
    //       that.loadData();
    //     } else {
    //       that.$message.warning(res.message);
    //     }
    //   });
    // },

    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
    },
  }
}


