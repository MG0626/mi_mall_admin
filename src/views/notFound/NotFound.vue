<template>
  <div class="not-found">
    <img src="../../assets/404.svg" alt="" />
    <div>
      <h4>抱歉，你访问的页面不存在！</h4>
      <p>可能是因为你的链接网址有误，或页面被删除</p>
    </div>
    <div class="back">
      <a href="/">返回首页</a>
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  p {
    color: #999999;
  }
  .back {
    a {
      text-decoration: none;
      color: #00a4ff;
    }
    .el-icon-arrow-right {
      color: #00a4ff;
      font-weight: bolder;
    }
    &:hover {
      .el-icon-arrow-right {
        transform: translateX(5px);
        transition: all .4s ease;
      }
    }
  }
}
</style>
