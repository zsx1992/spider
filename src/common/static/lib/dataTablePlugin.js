;(function($, window, document, undefined){
	//定义DataTable的构造函数
    var DataTable = function(ele, opt){
        this.$element = $(ele),
        this.defaults = {
        	"dom": '<"top"lf>rt<"bottom"i<"_extendSkipPage pull-right">p><"clear">',
	        "language": {
	            "lengthMenu": "每页 _MENU_ 条记录",
	            "sLengthMenu": "显示 _MENU_ 项结果",
	            "zeroRecords": "没有找到记录",
	            "info": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
	            "infoEmpty": "无记录",
	            "infoFiltered": "(从 _MAX_ 条记录过滤)",
	            "sProcessing" : "正在加载数据...",
	            "sInfoPostFix": "",
	            "sUrl": "",
	            "sEmptyTable": "表中数据为空",
	            "sLoadingRecords": "载入中...",
	            "sInfoThousands": ",",
	            "paginate": {
	                "previous": "上页",
	                "next": "下页",
	                "first": "首页",
	                "last": "末页"
	            },
	            "search": "搜索：",
	            "oAria": {
					"sSortAscending": ": 以升序排列此列",
					"sSortDescending": ": 以降序排列此列"
				}
	        },
	        "pagingType": "full_numbers",
	        "bDeferRender": true,//是否延迟渲染
	        "bScrollCollapse": true,//高度自适应
	        "bFilter": false,//是否对数据进行过滤
	        "bLengthChange": false, //改变每页显示条数
	        "bStateSave": false,
	        "bPaginate": true, //分页
	        "iDisplayLength": 5, // 每页显示行数
	        "bInfo": true, //页脚信息
	        "bSort": true, //开启列排序
	        "aaSorting": [[0, "desc"]],//datatable默认排序列
	        "bJQueryUI": false, //是否开启jQuery UI ThemeRoller支持
	        "columnDefs": null,

	    	"processing": true,
			"bServerSide": true,
			"ajax": {
	    		"url": null,//请求路由
	    		"type": "get",//请求方式
	    		"data": null
	    	},
	    	"aoColumns": null
        }
        this.options = $.extend({}, this.defaults, opt);
    }

    DataTable.prototype = {
    	/*跳到指定页*/
    	skip_page: function(pId){
    		var $table = this.$element[0];
    		//跳到第几页
			$(pId).on('click', '._extendBtn', function(event) {
				var skipPage = $(pId).find('input[name="_extendPageNum"]').val().trim(),
					skipStartIndex;

				if(skipPage == ''){
					skipStartIndex = 0;
				}else{
					if(/^[0-9]*$/.test(skipPage) && skipPage>=1){
						skipStartIndex = skipPage - 1;
					}else{
						skipStartIndex = 0;
					}
				}
				$($table).dataTable().fnPageChange(skipStartIndex);
				return false;
			});
    	},
    	/*dataTable初始化*/
    	init : function(){
    		var $this = this;
    		return this.$element.each(function() {
    			var $parentId = $('#'+this.id).parent();

    			$($parentId).css('overflow','auto');
	            $($parentId).css('margin-top','10px');
	            $($parentId).css('margin-bottom','10px');

    			$('#'+this.id).dataTable($this.options);
    			var html = '<span style="margin-left: 15px;"></span>第 <input type="text"  id="_extendPageNum" name="_extendPageNum" style="width: 40px;"> 页 '+
							'<button class="btn btn-info btn-xs _extendBtn" >确定</button>';
				$('div._extendSkipPage').html(html);
				$('div._extendSkipPage').css('margin-top', '8px');

    			$this.skip_page($parentId);
    		});
    	}
    }

    $.fn.initDataTable = function(options){
    	var dataTable = new DataTable(this, options);
    	return dataTable.init();
    }
})(jQuery, window, document);

