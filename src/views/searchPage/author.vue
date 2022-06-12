<template>
  <div>
    <div>
      <div style="font-weight: bolder;font-size: 32px">作者查询</div>
      <div style="display: flex;margin-top: 20px">
        <el-button circle type="success" style="width: 50px;height: 50px;margin-left: 100px" @click="returnBack">返回</el-button>
        <div style="margin-top: 10px;margin-left: 250px;">查询作者</div>
        <el-input v-model="content" clearable style="width: 300px;margin-left: 30px"></el-input>
        <el-button type="primary" style="height: 40px" @click="search">查询</el-button>
        <div style="margin-left: 50px;margin-top: 10px">请选择查询内容</div>
        <el-select v-model="chooseValue" clearable placeholder="请选择" style="margin-left: 50px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div>
      <div style="font-weight: bolder;">作者查询</div>
      <el-table v-if="tableData.length" :data="tableData" style="width: 80%;margin-left: 200px;margin-top: 50px" stripe>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="cn" label="引用文章次数" width="180"></el-table-column>
        <el-table-column prop="hi" label="高引次数" width="180"></el-table-column>
        <el-table-column prop="pc" label="发表文章数量" width="180"></el-table-column>
        <el-table-column prop="authorId" label="查询">
          <template slot-scope="tableData">
            <el-button @click="confirmSearch(tableData.row.authorId)" type="success">查询</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="d3-container">
      <div class="types">
      <span v-for="(value, key, index) of typeCategories"
            :key="index"
            :style="{backgroundColor: typeColor[key]}"
            @mouseover="handleTypeMouseover(value, key)"
            @mouseout="handleTypeMouseout()">
        {{ key }}({{ value.length }})
      </span>
      </div>
      <div class="info" v-if="visibleList[0]">
        <div style="font-weight: bolder">姓名: {{info.name}}</div>
        <div style="font-weight: bolder">文章应用次数: {{info.cn}}</div>
        <div style="font-weight: bolder">高引次数: {{info.hi}}</div>
        <div style="font-weight: bolder">文章发表数量: {{info.pc}}</div>
      </div>
      <div class="info" v-if="visibleList[1]">
          <div style="font-weight: bolder">名称: {{info.title}} {{info.name}}</div>
      </div>
      <div class="info" v-if="visibleList[2]">
        <div>
          <div style="font-weight: bolder">名称: {{info.title}} {{info.name}}</div>
        </div>
      </div>
      <div class="info" v-if="visibleList[3]">
        <div>
          <div style="font-weight: bolder">名称: {{info.title}} {{info.name}}</div>
        </div>
      </div>
      <svg />
    </div>
  </div>

</template>
<script>
import * as d3 from 'd3'
import {getAuthorsByName, getCollaborateAuthor, getPapersAndAuthorsCitedByAuthor, getPapersAndVenues, getAuthorsInSameAffiliation} from '../../api/authorAPI'

export default {
  name: 'author',
  data () {
    return {
      tableData: [],
      content: '',
      searchId: 1,
      options: [{
        value: '1',
        label: '查询协作者'
      }, {
        value: '2',
        label: '查询发表的文章以及发表刊物'
      }, {
        value: '3',
        label: '查询引用文章及其作者'
      }, {
        value: '4',
        label: '查询同机构作者'
      }],
      visibleList: [false, false, false, false],
      chooseValue: '',
      info: '',
      typeCategories: {},
      typeColor: {}, // 类型配色
      type: ['author', 'collaborator', 'paper', 'periodical', 'affiliation'], // 分类
      nodes: [], // 节点集
      links: [], // 关系集
      visibleFlag: false
    }
  },
  watch: {
    nodes: {
      handler (val) {
        // 监听节点变化，设置类型标签
        const obj = {}
        val.forEach(e => {
          if (Object.keys(obj).indexOf('' + e.label) === -1) {
            obj[e.label] = []
          }
          obj[e.label].push(e)
        })
        this.typeCategories = obj
      },
      deep: true
    }
  },
  mounted () {
    this.setTypeColor()
    this.chooseValue = sessionStorage.getItem('type')
    this.content = sessionStorage.getItem('content')
    this.searchId = sessionStorage.getItem('authorId')
    if ((this.content !== '') && (this.content !== null)) {
      const params = {'author': this.content}
      getAuthorsByName(params).then(res => {
        if (res.data.code === 204) this.$message.error('未查询到此名称的作者')
        else {
          this.tableData = res.data.value
        }
      })
    }
    this.initD3()
  },
  methods: {
    changeVisible (index) {
      for (let i = 0; i < this.visibleList.length; i++) {
        this.visibleList[i] = i === index
      }
    },
    returnBack () {
      sessionStorage.removeItem('type')
      sessionStorage.removeItem('content')
      sessionStorage.removeItem('authorId')
      this.$router.push('/')
    },
    search () {
      if ((this.content === '') || (this.content == null)) {
        this.$message.error('请填写作者名')
        return
      }
      sessionStorage.setItem('content', this.content)
      location.reload()
    },
    confirmSearch (id) {
      if ((this.chooseValue === '') || (this.chooseValue == null)) {
        this.$message.error('请选择要查询的信息')
      } else {
        sessionStorage.setItem('type', this.chooseValue)
        sessionStorage.setItem('content', this.content)
        sessionStorage.setItem('authorId', id)
        location.reload()
      }
    },
    handleTypeMouseout () {
      d3.selectAll('.single-node').style('opacity', 1)
      d3.selectAll('.single-line').style('opacity', 1)
    },
    handleTypeMouseover (data) {
      d3.selectAll('.single-node').style('opacity', 0.1)
      d3.selectAll('.single-line').style('opacity', 0.1)
      for (let i = 0; i < data.length; i++) {
        const nodeID = '#single-node' + data[i].id
        d3.selectAll(nodeID).style('opacity', 1)
      }
    },
    setTypeColor () {
      const obj = {}
      this.type.forEach(e => {
        if (Object.keys(obj).indexOf('' + e) === -1) {
          obj[e] = ''
        }
        obj[e] = this.randomColor()
      })
      this.typeColor = obj
    },
    randomColor () {
      const colors = ['#F4AB87', '#EEC88D', '#76CADF', '#97DA9D', '#88DCD8', '#FB7F89', '#F0E403', '#F576BE', '#ACADFF', '#7EC3FB', '#D0DB02', '#C07B11', '#00ACC2', '#2AAD41', '#A59D00', '#EB4747', '#CD0EBD', '#DE3997']
      return colors[Math.floor(Math.random() * colors.length)]
    },
    initD3 () {
      if (this.searchId === '') return
      if (this.searchId === null) {
        this.searchId = ''
        return
      }
      const _this = this
      // 数据示例
      // nodes = [
      //   { id: 'a', name: 'a' },
      //   { id: 'b', name: 'b' },
      //   { id: 'c', name: 'c' }
      // ]
      // links = [
      //   { id: 'ab', source: 'a', target: 'b' },
      //   { id: 'bc', source: 'b', target: 'c' }
      // ]

      // 容器
      const svg = d3.select('svg')
        .attr('viewBox', [-window.innerWidth / 2, -window.innerHeight / 2, window.innerWidth, window.innerHeight])

      // 缩放
      const zoom = d3.zoom()
        .on('zoom', function () {
          svg.attr('transform', d3.zoomTransform(svg.node()))
          // const tran = d3.zoomTransform(svg.node())
          // const _k = tran.k
        })
      svg.call(zoom)

      d3.select('#reset')
        .on('click', function () {
          svg.call(zoom.transform, d3.zoomIdentity)
        })
      d3.select('#zoomIn')
        .on('click', function () {
          zoom.scaleBy(svg, 1.1)
        })
      d3.select('#zoomOut')
        .on('click', function () {
          zoom.scaleBy(svg, 0.9) // 执行该方法后 会触发 zoom 事件 0.9 缩小
        })

      // 新建一个力导向图
      const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(-1000))
        .force('link', d3.forceLink().id(d => d.id).distance(200))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
        .on('tick', ticked)

      // 关系路径
      let link = svg.append('g')
        .attr('class', 'link-container')
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .selectAll('line')

      // 关系文字
      let linkText = svg.append('g')
        .attr('class', 'link-text-container')
        .attr('stroke', '#000')
        .attr('stroke-width', 1.5)
        .selectAll('text')

      // 节点
      let node = svg.append('g')
        .attr('class', 'node-container')
        .selectAll('circle')

      function ticked () {
        node
          .attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ')'
          })

        link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

        linkText
          .attr('x', d => (d.source.x + d.target.x) / 2)
          .attr('y', d => (d.source.y + d.target.y) / 2)
      }

      // 更新
      const updateObj = Object.assign(svg.node(), {
        update ({ nodes, links }) {
          // 做一个浅复制，以防止突变，回收旧节点以保持位置和速度
          const old = new Map(node.data().map(d => [d.id, d]))
          nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d))
          links = links.map(d => Object.assign({}, d))

          // 节点
          node = node
            .data(nodes, d => d.id)
            .join(
              enter =>
                enter.append('g')
                  .attr('class', 'single-node')
                  .attr('id', (d) => {
                    return 'single-node' + d.id
                  })
            )
            .call(d3.drag()
              .on('start', dragstarted)
              .on('drag', dragged)
              .on('end', dragended))
          d3.selectAll('.single-node')
            .append('circle')
            .attr('r', 30)
            .attr('fill', nodeColor)
            .style('cursor', 'pointer')
          // 节点文字
          d3.selectAll('.single-node')
            .append('text')
            .attr('y', 0)
            .attr('dy', 5)
            .attr('text-anchor', 'middle')
            .style('cursor', 'pointer')
            .attr('x', function (d) {
              return textBreaking(d3.select(this), d, false)
            })

          // 绘制箭头
          svg.append('g')
            .attr('class', 'arrow-marker')
            .append('marker')
            .attr('id', 'arrow-marker')
            .attr('markerUnits', 'strokeWidth') // 设置为 strokeWidth 箭头会随着线的粗细发生变化
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('viewBox', '0 -5 10 10') // 坐标系的区域
            .attr('refX', 40) // 箭头坐标
            .attr('refY', 0)
            .attr('markerWidth', 10) // 标识的大小
            .attr('markerHeight', 10)
            .attr('orient', 'auto') // 绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr('stroke-width', 2) // 箭头宽度
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5') // 箭头的路径
            .attr('fill', '#000') // 箭头颜色

          // 关系路径
          link = link
            .data(links, d => [d.source, d.target])
            .join(
              enter =>
                enter.append('line')
                  .attr('class', 'single-line')
                  .attr('id', (d) => {
                    return 'single-line' + d.id
                  })
                  .attr('marker-end', 'url(#arrow-marker)') // 根据箭头标记的 id 号标记箭头
            )

          // 路径文字
          linkText = linkText
            .data(links, d => [d.source, d.target])
            .join(
              enter =>
                enter.append('text')
                  .attr('class', 'link-text')
                  .attr('id', (d) => {
                    return 'link-text' + d.id
                  })
                  .text((d) => {
                    return d.relation
                  })
                  .attr('stroke', '#000')
                  .attr('stroke-width', '1')
                  .attr('fill', 'none')
                  .style('cursor', 'pointer')
            )

          simulation.nodes(nodes)
          simulation.force('link').links(links)
          simulation.alpha(1).restart()

          node
            .on('click', function (d) {
              _this.visibleFlag = !_this.visibleFlag
            })
            .on('mouseover', function (d) {
              // 鼠标移入节点，高亮当前节点及与当前节点有关系的路径和节点
              d3.selectAll('.single-node').style('opacity', 0.2)
              d3.selectAll('.single-line').style('opacity', 0.2)
              d3.selectAll('.link-text').style('opacity', 0.2)
              d3.select('#single-node' + d.id).style('opacity', 1)
              const relationLinks = []
              _this.links.forEach((item) => {
                if (item.source === d.id || item.target === d.id) {
                  relationLinks.push(item)
                }
              })
              relationLinks.forEach((item) => {
                d3.select('#single-line' + item.id).style('opacity', 1)
                d3.select('#link-text' + item.id).style('opacity', 1)
                d3.select('#single-node' + item.source).style('opacity', 1)
                d3.select('#single-node' + item.target).style('opacity', 1)
              })
              // _this.info = JSON.stringify(d)
              _this.info = d
            })
            .on('mouseout', function () {
              d3.selectAll('.single-node').style('opacity', 1)
              d3.selectAll('.single-line').style('opacity', 1)
              d3.selectAll('.link-text').style('opacity', 1)
              _this.info = ''
            })

          link
            .on('mouseover', function (d) {
              d3.selectAll('.single-node').style('opacity', 0.2)
              d3.selectAll('.single-line').style('opacity', 0.2)
              d3.selectAll('.link-text').style('opacity', 0.2)
              d3.select('#single-line' + d.id).style('opacity', 1)
              d3.select('#link-text' + d.id).style('opacity', 1)
              d3.select('#single-node' + d.source.id).style('opacity', 1)
              d3.select('#single-node' + d.target.id).style('opacity', 1)
              _this.info = JSON.stringify(d)
            })
            .on('mouseout', function () {
              d3.selectAll('.single-node').style('opacity', 1)
              d3.selectAll('.single-line').style('opacity', 1)
              d3.selectAll('.link-text').style('opacity', 1)
              _this.info = ''
            })
        }
      })

      /**
       * @name: 设置节点颜色
       * @param {*} node
       */
      function nodeColor (node) {
        const type = node.label
        if (_this.typeColor[type]) {
          return _this.typeColor[type]
        } else {
          return '#ddd'
        }
      }
      /**
       * @name: 节点文字换行
       * @param {*} dom
       * @param {*} data
       * @param {*} breaking 是否换行
       */
      function textBreaking (dom, data, breaking) {
        const text = data.name
        if (breaking) {
          const len = text.length
          if (len <= 3) {
            dom.append('tspan')
              .attr('x', 0)
              .attr('y', 0)
              .text(text)
          } else {
            const topText = text.substring(0, 3)
            const midText = text.substring(3, 7)
            let botText = text.substring(7, len)
            let topY = -22
            let midY = 8
            const botY = 34
            if (len <= 9) {
              topY += 10
              midY += 10
            } else {
              botText = text.substring(7, 9) + '...'
            }
            dom.text('')
            dom.append('tspan')
              .attr('x', 0)
              .attr('y', topY)
              .text(function () {
                return topText
              })
            dom.append('tspan')
              .attr('x', 0)
              .attr('y', midY)
              .text(function () {
                return midText
              })
            dom.append('tspan')
              .attr('x', 0)
              .attr('y', botY - 7)
              .text(function () {
                return botText
              })
          }
        } else {
          dom.append('tspan')
            .attr('x', 0)
            .attr('y', 0)
            .style('font-size', 12)
            .style('stroke', '#333')
            .text(data.name)
        }
      }

      /**
       * @name: 拖动
       * @param {*} event
       */
      function dragstarted (event) {
        if (!d3.event.active) {
          simulation.alphaTarget(0.8).restart() // 设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0, 1]
        }
        event.fx = event.x
        event.fy = event.y
      }
      function dragged (event) {
        event.fx = d3.event.x
        event.fy = d3.event.y
      }
      function dragended (event) {
        if (!d3.event.active) {
          simulation.alphaTarget(0)
        }
        event.fx = null
        event.fy = null
      }
      // 模拟接口返回节点信息
      _this.$nextTick(() => {
        const param = {authorId: parseInt(this.searchId)}
        // 查询协作者
        if (this.chooseValue === '1') {
          getCollaborateAuthor(param).then(res => {
            this.changeVisible(0)
            _this.nodes = []
            _this.links = []
            _this.nodes.push(res.data.value.author)
            const authorId = res.data.value.author.id
            _this.links = res.data.value.collaborators
            for (let i = 0; i < _this.links.length; i++) {
              _this.nodes.push(_this.links[i])
              _this.links[i]['source'] = authorId
              _this.links[i]['target'] = _this.links[i].id
              _this.links[i]['label'] = 'collaborator'
              _this.links[i]['relation'] = 'collaboration'
            }
            updateObj.update({
              nodes: _this.nodes,
              links: _this.links
            })
          })
        } else if (this.chooseValue === '2') {
          getPapersAndVenues(param).then(res => {
            this.changeVisible(1)
            _this.nodes = []
            _this.links = []
            const periodicalList = []
            _this.nodes.push(res.data.value.author)
            const authorId = res.data.value.author.id
            _this.links = res.data.value.papers
            for (let i = 0; i < _this.links.length; i++) {
              _this.nodes.push(_this.links[i])
              _this.links[i]['source'] = authorId
              _this.links[i]['target'] = _this.links[i].id
              _this.links[i]['name'] = _this.links[i].title
              _this.links[i]['relation'] = 'write'
              const paperId = _this.links[i].id
              for (let j = 0; j < _this.links[i].periodical.length; j++) {
                _this.links[i].periodical[j]['target'] = paperId
                _this.links[i].periodical[j]['source'] = _this.links[i].periodical[j].id
                _this.links[i].periodical[j]['relation'] = 'publish'
                _this.nodes.push(_this.links[i].periodical[j])
                periodicalList.push(_this.links[i].periodical[j])
              }
            }
            for (let i = 0; i < periodicalList.length; i++) {
              _this.links.push(periodicalList[i])
            }
            updateObj.update({
              nodes: _this.nodes,
              links: _this.links
            })
          })
        } else if (this.chooseValue === '3') {
          console.log(param)
          getPapersAndAuthorsCitedByAuthor(param).then(res => {
            console.log(res)
            this.changeVisible(2)
            _this.nodes = []
            _this.links = []
            const authorList = []
            _this.nodes.push(res.data.value.author)
            const authorId = res.data.value.author.id
            _this.links = res.data.value.papers
            for (let i = 0; i < _this.links.length; i++) {
              _this.nodes.push(_this.links[i])
              _this.links[i]['source'] = authorId
              _this.links[i]['target'] = _this.links[i].id
              _this.links[i]['name'] = _this.links[i].title
              _this.links[i]['relation'] = 'cite'
              const paperId = _this.links[i].id
              for (let j = 0; j < _this.links[i].author.length; j++) {
                _this.links[i].author[j]['target'] = paperId
                _this.links[i].author[j]['source'] = _this.links[i].author[j].id
                _this.links[i].author[j]['relation'] = 'write'
                _this.nodes.push(_this.links[i].author[j])
                authorList.push(_this.links[i].author[j])
              }
            }
            for (let i = 0; i < authorList.length; i++) {
              _this.links.push(authorList[i])
            }
            updateObj.update({
              nodes: _this.nodes,
              links: _this.links
            })
          })
        } else if (this.chooseValue === '4') {
          getAuthorsInSameAffiliation(param).then(res => {
            this.changeVisible(3)
            _this.nodes = []
            _this.links = []
            const authorList = []
            _this.nodes.push(res.data.value.author)
            const authorId = res.data.value.author.id
            _this.links = res.data.value.affiliation
            for (let i = 0; i < _this.links.length; i++) {
              _this.links[i].id = _this.links[i].name
              _this.nodes.push(_this.links[i])
              _this.links[i]['source'] = authorId
              _this.links[i]['target'] = _this.links[i].id
              _this.links[i]['relation'] = 'belong'
              const affiliationId = _this.links[i].id
              for (let j = 0; j < _this.links[i].authorDTOList.length; j++) {
                _this.links[i].authorDTOList[j]['target'] = affiliationId
                _this.links[i].authorDTOList[j]['source'] = _this.links[i].authorDTOList[j].id
                _this.links[i].authorDTOList[j]['relation'] = 'belong'
                _this.nodes.push(_this.links[i].authorDTOList[j])
                authorList.push(_this.links[i].authorDTOList[j])
              }
            }
            for (let i = 0; i < authorList.length; i++) {
              _this.links.push(authorList[i])
            }
            updateObj.update({
              nodes: _this.nodes,
              links: _this.links
            })
          })
        }
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
