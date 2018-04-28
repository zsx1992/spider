$(document).ready(function(){
// 销量趋势表
$('#rateSale').addClass('orange')
$('#dataSum').removeClass('orange')
    var nowDate = moment().format('YYYY-MM')
    $('#sales').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: '销量趋势'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [show(5), show(4), show(3), show(2), show(1), show(0)]
        },
        credits: {
            enabled: false
        },
        yAxis: {
            title: {
                text: '销量'
            },
            labels: {
                formatter: function () {
                    return this.value ;
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: '销售额',
            marker: {
                symbol: 'square'
            },
            data: [data.day5[0].sales, data.day4[0].sales, data.day3[0].sales, data.day2[0].sales, data.day1[0].sales, data.day[0].sales]
        }]
    });
// 毛利率表
    $('#profit').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: '毛利率趋势'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: [show(5), show(4), show(3), show(2), show(1), show(0)]
        },
        credits: {
            enabled: false
        },
        yAxis: {
            title: {
                text: '利率'
            },
            labels: {
                formatter: function () {
                    return this.value.toFixed(2) ;
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: '毛利率',
            marker: {
                symbol: 'square'
            },
            data: [Number(data.rate5[0].profit.toFixed(2)), Number(data.rate4[0].profit.toFixed(2)), Number(data.rate3[0].profit.toFixed(2)), Number(data.rate2[0].profit.toFixed(2)), Number(data.rate1[0].profit.toFixed(2)), Number(data.rate[0].profit.toFixed(2))]
        }]
    });
   
//库存表
$.getJSON('/sales/chart/data/?store='+store, function (data) {
    $('#stock').highcharts({
        chart: {
            zoomType: 'x'
        },
        credits: {
            enabled: false
        },
        title: {
            text: '门店库存金额变化'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
        },
        xAxis: {
            
            type: 'datetime',
            dateTimeLabelFormats: {
                // millisecond: '%H:%M:%S.%L',
                // second: '%H:%M:%S',
                // minute: '%H:%M',
                // hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
        },
        tooltip: {
            dateTimeLabelFormats: {
                // millisecond: '%H:%M:%S.%L',
                // second: '%H:%M:%S',
                // minute: '%H:%M',
                // hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
        },
        yAxis: {
            title: {
                text: '金额'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: '库存金额',
            data: data.data
        }]
    });
});

// 门店退货金额
$.getJSON('/sales/chart/return/?store='+store, function (data) {
    console.log('data',data)
    $('#returnin').highcharts({
        chart: {
            zoomType: 'x'
        },
        credits: {
            enabled: false
        },
        title: {
            text: '门店退货金额'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
            '鼠标拖动可以进行缩放' : '手势操作进行缩放'
        },
        xAxis: {
            
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
        },
        tooltip: {
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
        },
        yAxis: {
            title: {
                text: '金额'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: '退货金额',
            data: data.data
        }]
    });
});


    function show(num){
        var date = moment().subtract(num,'months').format('YYYY-MM')
        return date
    }
    

})