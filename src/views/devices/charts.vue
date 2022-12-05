<template>
  <div class="wrap" style="padding-top: 20px; background: #394056">
    <div style="height: 70px; ">
      <el-row :gutter="20">
        <el-col :span="6">
          <div style="color: #F1F1F3">
            <el-statistic title="开机时间">
              <template slot="formatter">
                {{ startedTime }}
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="磁盘容量">
              <template slot="formatter">
                {{ diskTotal }}
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="已用容量">
              <template slot="formatter">
                {{ diskUsed }}
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="剩余容量">
              <template slot="formatter">
                {{ diskFree }}
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="height: 70px; margin-top: 20px">
      <el-row :gutter="20">
        <el-col :span="6">
          <div style="color: #F1F1F3">
            <el-statistic title="CPU逻辑数量">
              <template slot="formatter">
                {{ cpuCount }}
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="CPU物理核心">
              <template slot="formatter">
                {{ cpuLogical }}
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="内存容量">
              <template slot="formatter">
                {{ virtualTotal }}
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="可用内存">
              <template slot="formatter">
                {{ virtualAvailable }}
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </div>
    <div :id="id" class="chart" style="height: calc(50vh); width: 100%" />
    <div :id="networkId" class="networkChart" style="height: calc(50vh); width: 100%" />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'

export default {
  mixins: [resize],
  data() {
    return {
      roomId: null,
      like: true,
      chart: null,
      networkChart: null,
      startedTime: '暂无',
      diskTotal: null,
      diskUsed: null,
      diskFree: null,
      virtualTotal: null,
      virtualAvailable: null,
      cpuCount: null,
      cpuLogical: null,
      id: 'chart',
      networkId: 'networkChart',
      info: {},
      chartData: {
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '性能',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['CPU', 'Memory'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: []
        }],
        yAxis: [{
          type: 'value',
          name: '(%)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: 'CPU',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: []
        }, {
          name: 'Memory',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: []
        }]
      },
      networkData: {
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '网络',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['发送', '接收'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: []
        }],
        yAxis: [{
          type: 'value',
          name: '(Kbps)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '发送',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(32,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: []
        }, {
          name: '接收',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: []
        }]
      }
    }
  },
  watch: {
    info(newData) {
      if (this.chartData.xAxis[0].data.length >= 300) {
        this.chartData.xAxis[0].data.splice(0, 1)
        this.chartData.series[0].data.splice(0, 1)
        this.chartData.series[1].data.splice(0, 1)

        this.networkData.xAxis[0].data.splice(0, 1)
        this.networkData.series[0].data.splice(0, 1)
        this.networkData.series[1].data.splice(0, 1)
      }
      this.chartData.xAxis[0].data.push(newData.currentTime)
      this.chartData.series[0].data.push(newData.cpu.percent)
      this.chartData.series[1].data.push(newData.virtual.percent)
      this.networkData.xAxis[0].data.push(newData.currentTime)
      this.networkData.series[0].data.push(newData['network'].send)
      this.networkData.series[1].data.push(newData['network'].recv)

      this.chart.setOption(this.chartData)
      this.networkChart.setOption(this.networkData)
    }
  },
  mounted() {
    // 进入组件时需要将 route params 中的值拿出来放在组件的生命周期中，不然调用 beforeDestroy 钩子时会获取不到 params 中的值
    this.roomId = this.$route.params.id
    this.joinDeviceRoom()
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    if (!this.networkChart) {
      return
    }
    this.networkChart.dispose()
    this.networkChart = null
    // 退出房间
    this.$socket.emit('leaveRoom', { roomId: this.roomId })
  },
  methods: {
    joinDeviceRoom() {
      // console.log('join room')
      this.$socket.emit('joinRoom', { roomId: this.roomId })
      // console.log('join room')
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.networkChart = echarts.init(document.getElementById(this.networkId))
      // this.chart.setOption(this.chartData)
    }
  },
  sockets: {
    clientSystemInfo(value) {
      // console.log(value)
      this.info = value
      this.startedTime = value.startedTime
      this.diskTotal = value['disk'].total
      this.diskUsed = value['disk'].used
      this.diskFree = value['disk'].free
      this.cpuCount = value.cpu.count
      this.cpuLogical = value.cpu['logical']
      this.virtualTotal = value.virtual.total
      this.virtualAvailable = value.virtual['available']
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}
::v-deep .el-statistic .head {
  color: #F1F1F3;
}
.el-statistic {
  color: #F1F1F3;
}
</style>
