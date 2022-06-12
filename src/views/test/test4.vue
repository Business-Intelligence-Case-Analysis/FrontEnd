<template>
  <div class="d3Chart"></div>
</template>
<script>
import * as d3 from 'd3'
export default {
  mounted () {
    // 数据——x轴的标签——城市
    let labelList = ['成都', '武汉', '上海', '北京', '深圳']
    // 数据——对应y轴的值——城市人口（万）
    let dataList = [100, 105, 200, 250, 230]
    // 画布的参数
    let mapWidth = 300
    let mapHeight = 300
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
  }
}
</script>
<style scoped>
</style>
