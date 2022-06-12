<template>
  <div>
    <div>
      <div style="font-weight: bolder;font-size: 32px">关键期刊查询</div>
      <div style="display: flex;margin-top: 20px">
        <el-button circle type="success" style="width: 50px;height: 50px;margin-left: 100px" @click="returnBack">返回</el-button>
        <div style="margin-top: 10px;margin-left: 300px">研究领域</div>
        <el-input v-model="interest" clearable style="width: 150px;margin-left: 10px"></el-input>
        <div style="margin-left: 70px;margin-top: 10px">请选择查询内容</div>
        <el-select v-model="chooseValue" clearable placeholder="请选择" style="margin-left: 10px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" style="height: 40px" @click="search">查询</el-button>
      </div>
    </div>
    <div>
    </div>
    <div style="margin-top: 50px" class="d3Chart"></div>
  </div>

</template>
<script>
import * as d3 from 'd3'
import {getInfluentialAuthors} from '../../api/keyAuthor'

export default {
  name: 'keyAuthor',
  data () {
    return {
      interest: '',
      options: [{
        value: 'publish',
        label: '发表次数'
      }, {
        value: 'cite',
        label: '引用次数'
      }],
      chooseValue: '',
      info: '',
      typeCategories: {},
      typeColor: {}, // 类型配色
      type: ['Interest', 'author'], // 分类
      nodes: [], // 节点集
      links: [], // 关系集
      visibleFlag: false
    }
  },
  mounted () {
    this.interest = sessionStorage.getItem('interest')
    this.chooseValue = sessionStorage.getItem('chooseValue')
    if (this.year === 'null') this.year = ''
    this.initD3()
  },
  methods: {
    returnBack () {
      sessionStorage.removeItem('interest')
      sessionStorage.removeItem('chooseValue')
      this.$router.push('/')
    },
    search () {
      if ((this.interest === '') || (this.interest == null)) {
        this.$message.error('请填写研究领域名称')
        return
      }
      if ((this.chooseValue === '') || (this.chooseValue == null)) {
        this.$message.error('请选择搜索的选项')
        return
      }
      sessionStorage.setItem('interest', this.interest)
      sessionStorage.setItem('chooseValue', this.chooseValue)
      location.reload()
    },
    initD3 () {
      if ((this.interest === '') || (this.interest == null)) {
        this.interest = ''
        return
      }
      if ((this.chooseValue === '') || (this.chooseValue == null)) {
        this.chooseValue = ''
        return
      }
      const params = {interest: this.interest, type: this.chooseValue}
      getInfluentialAuthors(params).then(res => {
        if (res.data.code !== 200) {
          this.$message.error('未查询到记录')
          return
        }
        // 数据——x轴的标签——author人名
        let labelList = []
        const publishList = []
        const citeList = []
        for (let i = 0; i < res.data.value.length; i++) {
          labelList.push(res.data.value[i].name)
        }
        // 数据——对应y轴的值——城市人口（万）
        let dataList = []
        if (this.chooseValue === 'publish') dataList = publishList
        else if (this.chooseValue === 'cite') dataList = citeList
        // 画布的参数
        let mapWidth = 500
        let mapHeight = 500
        let mapPadding = 30
        // 定义画布—— 宽 300 高 300 外边距 10px
        let map = d3
          .select('.d3Chart')
          .append('svg')
          .attr('width', mapWidth)
          .attr('height', mapHeight)
          .style('margin', '10px')
        // d3.select("div").remove()
        // 定义x轴比例尺（序数段比例尺）
        let scaleX = d3
          .scaleBand()
          .domain(labelList)
          .range([0, mapWidth - mapPadding * 2])
        // .paddingInner(0.2) // 段间距
        // .paddingOuter(0.5) //外边距
        // .align(0.5) //段对齐
        // .round(true);  //取整
        // 定义Y轴比例尺（线性比例尺）——最大值为画布高度-2*画布内边距,最小值为0（0放在第二位，因为y轴正方向是反的）
        let scaleY = d3
          .scaleLinear()
          .domain([0, d3.max(dataList)])
          .range([mapHeight - 2 * mapPadding, 0])
        // 定义x y 轴
        let axisX = d3.axisBottom(scaleX)
        let axisY = d3.axisLeft(scaleY)
        // 绘制x y 轴
        map
          .append('g')
          .attr('transform', `translate(${mapPadding},${mapHeight - mapPadding})`)
          .call(axisX)
        map
          .append('g')
          .attr('transform', 'translate(' + mapPadding + ',' + mapPadding + ')')
          .call(axisY)
        // 矩形间的空白
        let rectMargin = scaleX.bandwidth() / 3
        // 添加矩形元素
        map
          .selectAll('.MyRect')
          .data(dataList)
          .enter()
          .append('rect')
          .on('mouseover', function (d, i) {
            d3.select(this).attr('fill', 'yellow')
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition().duration(500).attr('fill', 'steelblue')
          })
          .attr('class', 'MyRect')
          .attr('transform', 'translate(' + mapPadding + ',' + mapPadding + ')')
          .attr('x', function (d, i) {
            return i * scaleX.bandwidth() + rectMargin / 2
          })
          // 起始状态是在 y 轴等于 0 的位置（但要注意，不能在起始状态直接返回 0，要应用比例尺计算画布中的位置）
          .attr('y', function (d) {
            var min = scaleY.domain()[0]
            // 值域的最小值
            return scaleY(min)
          })
          .transition()
          .delay(function (d, i) {
            return i * 200
          })
          .duration(2000)
          // 终止状态是目标值
          .attr('y', function (data) {
            return scaleY(data)
          })
          .attr('width', scaleX.bandwidth() - rectMargin)
          .attr('height', function (data) {
            return mapHeight - mapPadding * 2 - scaleY(data)
          })
          // 矩形填充颜色_填充颜色不要写在CSS里
          .attr('fill', 'blue')
        // 添加文字元素
        map
          .selectAll('.MyText')
          .data(dataList)
          .enter()
          .append('text')
          .attr('class', 'MyText')
          .attr('transform', 'translate(' + mapPadding + ',' + mapPadding + ')')
          .attr('x', function (d, i) {
            return i * scaleX.bandwidth() + scaleX.bandwidth() / 2
          })
          .attr('y', function (d) {
            var min = scaleY.domain()[0]
            // 值域的最小值
            return scaleY(min)
          })
          .transition()
          .delay(function (d, i) {
            return i * 200
          })
          .duration(2000)
          .attr('y', function (data) {
            return scaleY(data)
          })
          // 沿x轴方向偏移量
          // .attr("dx",function(){
          //     return 0
          // })
          // 沿y轴方向偏移量
          .attr('dy', function (d) {
            return -6
          })
          // 文本对齐方式（相对于文本原点）  start、middle、end或inherit
          .attr('text-anchor', 'middle')
          // 文本字体大小
          .attr('font-size', '12px')
          // 文本颜色
          .attr('fill', 'red')
          .text(function (d) {
            return d
          })
      })
    }
  }
}
</script>

<style>
.d3-container {
  position: relative;
}
.d3-container .info {
  background: #fff;
  position: absolute;
  left: 50px;
  bottom: 50px;
  z-index: 9;
}
.d3-container .btns {
  background: #fff;
  position: absolute;
  right: 50px;
  bottom: 200px;
  z-index: 99;
}
.d3-container .btns span {
  cursor: pointer;
}
.d3-container .types {
  position: absolute;
  left: 50px;
  top: 50px;
  z-index: 9;
}
.d3-container .types span {
  display: inline-block;
  background: #a5abb6;
  border-radius: 4px;
  margin-right: 10px;
  padding: 5px 6px;
  cursor: pointer;
  color: #2e0f00;
  font-size: 12px;
}
</style>
