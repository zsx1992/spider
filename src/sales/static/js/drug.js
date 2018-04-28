$(document).ready(function(){
    $('#rateSale').addClass('orange')
    $('#dataSum').removeClass('orange')
    var col = [
        {'mData':'sort'},
		{'mData':'productinfo'},
		{'mData':'sales'},						
        {'mData':'cost',
        'render':function(data,type,full){
            return data.toFixed(2)
        }},				
        {'mData':'number'},
        {'mData':'profit',
        'render':function(data,type,full){
            return data.toFixed(2)
        }},
        {'mData':'rate',
        'render':function(data,type,full){
            if(data){
                return (data*100).toFixed(2)+'%'
            }else{
                return 0
            }
            // return data.toFixed(2)*100+'%'
        }},
        {'mData':'change',
        'render':function(data,type,full){
            if(data){
                return data.toFixed(2)
            }else{
                return 0
            }
            
        }}
	];
	// 初始化表格
	$('#sum').dataTable().fnDestroy(); 
    $("#sum").initDataTable({
        "ajax": {
            "url": '/sales/drug/data',
            "data": {ypfl:ypfl,store:store,day1:day1,day2:day2,drug:''}
        },
        "aoColumns": col,
        "bSort": false,
        "iDisplayLength": 10
    });
    // 点击搜索
    $('#search').on('click',function(){
        show()
    })
    // 回车  查询
    $(document).keyup(function(e){
       
        if(e.keyCode == '13'){
            show()
        }
        return false
    })
    function show(){
        var data = {
            ypfl:ypfl,
            store:store,
            day1:day1,
            day2:day2,
            drug:$.trim($('#drug').val()),
        }
        $('#sum').dataTable().fnDestroy(); 
        $("#sum").initDataTable({
            "ajax": {
                "url": '/sales/drug/data',
                "data": data
            },
            "aoColumns": col,
            "bSort": false,
            "iDisplayLength": 10
        });
    }

})