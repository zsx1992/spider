$(document).ready(function(){
    $('#rateSale').addClass('orange')
    $('#dataSum').removeClass('orange')
    $('.fifteen').addClass('orange')
    $('.fifteen').siblings('button').removeClass('orange')
    var col = [
        {'mData':'sort'},
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
            if(!data){
                data = 0
            }
            return (data*100).toFixed(2)+'%'
        }},
        {'mData':'change',
        'render':function(data,type,full){
            if(data){
                return data.toFixed(2)
            }else{
                return 0
            }
            
        }},
        {'mData':'cost',
        "render":function(data,type,full){
            var str = ''
            str += "<a href='/sales/chart/?store="+full.store+"'>趋势图</a>"
            str += "<a href='/sales/classification/?store="+full.store+"&day1="+full.day1+"&day2="+full.day2+"' style='margin-left:5px'>商品分类</a>"
            return str
        }}
	];
	// 初始化表格
	$('#sum').dataTable().fnDestroy(); 
    $("#sum").initDataTable({
        "ajax": {
            "url": '/sales/summary/range',
            "data": {val:'fifteen',select:'',store:''}
        },
        "aoColumns": col,
        "bSort": false,
        "iDisplayLength": 10
    });

    // 搜索
    $('#search').on('click',function(){
        search()
    })
    $(document).keyup(function(e){
        if(e.keyCode == 13){
            search()
        }
        return false
    })
    function search(){
        var store = $('#store').val()
        var select = $('#select option:selected').val()
        var data = {
            store:$.trim(store),
            select:select,
            val:'fifteen'
        }
        $('#sum').dataTable().fnDestroy(); 
        $("#sum").initDataTable({
            "ajax": {
                "url": '/sales/summary/range',
                "data": data
            },
            "aoColumns": col,
            "bSort": false,
            
            "iDisplayLength": 10
        });
    }

    // 15天 30天 半年
    $('.range').on('click',function(){
        $(this).addClass('orange')
        $(this).siblings('button').removeClass('orange')
        var store = $('#store').val();
        var select = $('#select option:selected').val();
        var val ;
        if($(this).text() == '最近半年'){
            val = 'sixMonth'
        }else if($(this).text() == '最近15天'){
            val = 'fifteen'
        }else{
            val = 'thirty'
        }
        $('#sum').dataTable().fnDestroy(); 
        $("#sum").initDataTable({
            "ajax": {
                "url": '/sales/summary/range',
                "data": {val:val,store:store,select:select}
            },
            "aoColumns": col,
            "bSort": false,
            "iDisplayLength": 10
        });
        
    })


})
