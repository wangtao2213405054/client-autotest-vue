<template>
  <div class="wrap">
    <button @click="openSocket">连接Socket</button>
    <button @click="socketSendmsg">发送数据</button>
    <div :id="id" class="chart" style="height: calc(100vh - 84px); width: 100%" />
  </div>
</template>

<script>
import { joinMasterRoom } from '@/api/devices/master'
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'

export default {
  mixins: [resize],
  data() {
    return {
      chart: null,
      id: 'chart',
      info: {},
      chartData: {
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '性能图',
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
          data: ['CPU', 'Network', 'Disk'],
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
          name: 'Network',
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
        }, {
          name: 'Disk',
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
      // if (this.chartData.xAxis[0].data.length >= 50) {
      //   this.chartData.xAxis[0].data.splice(0, 1)
      //   this.chartData.series[0].data.splice(0, 1)
      //   this.chartData.series[1].data.splice(0, 1)
      //   this.chartData.series[2].data.splice(0, 1)
      // }
      this.chartData.xAxis[0].data.push(newData.currentTime)
      this.chartData.series[0].data.push(newData.cpu.percent)
      this.chartData.series[1].data.push(newData.virtual.percent)
      this.chartData.series[2].data.push(newData.disk.percent)
      this.chart.setOption(this.chartData)
    }
  },
  // beforeDestroy() {
  //   // 关闭 Socket
  //   this.sockets.unsubscribe('testCall')
  //   this.$socket.close()
  // },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    openSocket() {
      // 开始连接 socket
      this.$socket.open()
    },
    // 发送消息
    async socketSendmsg() {
      await joinMasterRoom({ id: 3 })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      // this.chart.setOption(this.chartData)
    }
  },
  sockets: {
    clientSystemInfo(value) {
      // console.log(value)
      this.info = value
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
