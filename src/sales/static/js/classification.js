$(document).ready(function(){
      // 10-中西药片 20-中西饮片 30-特殊食品 31-保健用品 40-医疗器械  50-食品，60化妆品 70-其他用品，71-已批药包材 80-成人用品 90消毒产品
    $('#rateSale').addClass('orange')
    $('#dataSum').removeClass('orange')
    var col = [
        {'mData':'ypfl',
        'render':function(data,type,full){
            if(data == '10') return '中西药片'
            if(data == '20') return '中西饮片'
            if(data == '30') return '特殊食品'
            if(data == '31') return '保健用品'
            if(data == '40') return '医疗器械'
            if(data == '50') return '食品'
            if(data == '60') return '化妆品'
            if(data == '70') return '其他用品'
            if(data == '80') return '成人用品'
            if(data == '90') return '消毒产品'
        }},
		{'mData':'store'},
		{'mData':'sales'},						
        {'mData':'cost',
        'render':function(data,type,full){
            return data.toFixed(2)
        }},
        {'mData':'profit',
        'render':function(data,type,full){
            return data.toFixed(2)
        }},
        {'mData':'rate',
        'render':function(data,type,full){
            return (data*100).toFixed(2)+'%'
        }},
        {'mData':'detail',
        'render':function(data,type,full){
            var str = ''
            return "<a href='/sales/drug/?ypfl="+full.ypfl+"&store="+full.store+"&day1="+day1+"&day2="+day2+"'>商品明细</a>"
        }}
	];
    // 初始化表格
    var data = {day1:day1,day2:day2,store:store}
	$('#sum').dataTable().fnDestroy(); 
    $("#sum").initDataTable({
        "ajax": {
            "url": '/sales/classification/data',
            "data": {data}
        },
        "aoColumns": col,
        "bSort": false,
        "iDisplayLength": 10
    });

})