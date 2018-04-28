$(document).ready(function(){
    $('#dataSum').addClass('orange')
    $('#rateSale').removeClass('orange')
    $('.fifteen').addClass('orange')
    $('.fifteen').siblings('button').removeClass('orange')
    var fullData
    var col = [
        {'mData':'date'},
        {'mData':'sales',
        'render':function(data,type,full){
            return '<span class="sales">'+data+'</span>'
        }},			
		{'mData':'number'},
        {'mData':'cost',
        "render":function(data,type,full){
            fullData = full;
            return data.toFixed(2)
        }},						
        {'mData':'profit',
        'render':function(data,type,full){
            return '<span class="profit">'+data.toFixed(2)+'</span>'
        }},				
        {'mData':'rate',
        'render':function(data,type,full){
            return (data*100).toFixed(2)+'%'
        }}
    ];
	// 初始化表格
	$('#tableId').dataTable().fnDestroy(); 
    $("#tableId").initDataTable({
        "ajax": {
            "url": '/sales/overview/data',
            "data": {data:'fifteen'}
        },
        "aoColumns": col,
        "bSort": false,
        "iDisplayLength": 10
    });
    $.ajax({
        type:'get',
        url:'/sales/overview/chart',
        data:{data:'fifteen'},
        success:function(res){
            if(res.code == '1'){
                var alldata = res.overdata
                var data = res.data
                var date=[]
                var sales = []
                var profit = []
                for(var i=0;i<data.length;i++){
                    date.push(data[i].date)
                    sales.push(data[i].sales)
                    profit.push(Number(data[i].profit.toFixed(2)) )
                }
                $('#overview1').text(alldata[0].sales)
                $('#overview2').text(alldata[0].number)
                $('#overview3').text(alldata[0].cost.toFixed(2))
                $('#overview4').text(alldata[0].profit.toFixed(2))
                $('#overview5').text( (alldata[0].rate*100).toFixed(2)+'%')
                // 销量趋势图
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
                        categories: date
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
                        data: sales
                    }]
                });//销量
                // 毛利
                $('#profit').highcharts({
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: '毛利润'
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        categories: date
                    },
                    credits: {
                        enabled: false
                    },
                    yAxis: {
                        title: {
                            text: '毛利'
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
                        name: '毛利润',
                        marker: {
                            symbol: 'square'
                        },
                        data: profit
                    }]
                });


            }//if
        }
    })
    $('.allbtn').on('click',function(){
        $(this).addClass('orange')
        $(this).siblings('button').removeClass('orange')
        var val= $(this).data('val')
        var data ;
       
        if(val=="fifteen"){
            data="fifteen"
        }
        if(val=="thirty"){
            data="thirty"
        }
        if(val=="sixMonth"){
            data="sixMonth"
        }
        $.ajax({
            type:'get',
            url:'/sales/overview/chart',
            data:{data:data},
            success:function(res){
                if(res.code == '1'){
                    var alldata = res.overdata
                    var data = res.data
                    var date=[]
                    var sales = []
                    var profit = []
                    $('#overview1').text(alldata[0].sales)
                    $('#overview2').text(alldata[0].number)
                    $('#overview3').text(alldata[0].cost.toFixed(2))
                    $('#overview4').text(alldata[0].profit.toFixed(2))
                    $('#overview5').text((alldata[0].rate*100).toFixed(2)+'%')
                    for(var i=0;i<data.length;i++){
                        date.push(data[i].date)
                        sales.push(data[i].sales)
                        profit.push(Number(data[i].profit.toFixed(2)) )
                    }
                    // 销量趋势图
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
                            categories: date
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
                            data: sales
                        }]
                    });//销量
                    // 毛利
                    $('#profit').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: '毛利润'
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: date
                        },
                        credits: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: '毛利'
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
                            name: '毛利润',
                            marker: {
                                symbol: 'square'
                            },
                            data: profit
                        }]
                    });


                }//if
            }
        })
        $('#tableId').dataTable().fnDestroy(); 
        $("#tableId").initDataTable({
            "ajax": {
                "url": '/sales/overview/data',
                "data": {data:data},
            },
            "aoColumns": col,
            "bSort": false,
            "iDisplayLength": 10
        });
      
    })
 

})