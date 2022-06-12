<template>
  <div>
    <!--粒子效果-->
    <Particles/>
    <div>
      <div style="font-size: 32px;font-weight: bolder">商务智能期末项目</div>
      <el-card class="card">
        <div>
          <div style="width: 100%;display: flex;flex-direction: row;flex-wrap: wrap;">
            <div v-for="(item, index) in pageList" :key="index" style="width: 25%">
              <el-button @click="goToSearch(index)" circle style="height: 150px;width: 150px;margin-top: 40px" v-bind:style="{ background: item.color}">
                <div style="font-size: 18px;font-weight: bolder">{{item.name}}</div>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Particles from '../../components/Particles'

export default {
  name: 'home',
  components: {Particles},
  data () {
    return {
      pageList: [{color: 'silver', name: '作者'},
        {color: 'cornflowerblue', name: '学术刊物/会议'},
        {color: 'yellowgreen', name: '论文'},
        {color: 'indianred', name: '研究领域'},
        {color: 'lightyellow', name: '机构'},
        {color: 'aqua', name: '多跳关系查询'},
        {color: 'gold', name: '关键作者'}]
      // {color: 'lightgray', name: '关键期刊'}]
    }
  },
  methods: {
    goToSearch (id) {
      if (id === 0) this.$router.push('/author')
      else if (id === 1) this.$router.push('/periodical')
      else if (id === 2) this.$router.push('/paper')
      else if (id === 3) this.$router.push('/interest')
      else if (id === 4) this.$router.push('/affiliation')
      else if (id === 5) this.$router.push('/multi')
      else if (id === 6) this.$router.push('/keyAuthor')
      // else if (id === 7) this.$router.push('/keyPeriodical')
    }
  }
}
</script>

<style scoped>
.card{
  background-color: transparent;
  height: 650px;
  margin-top: 50px;
}
</style>
