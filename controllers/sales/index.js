
var log4js = require('log4js');
var ejs = require('ejs');
var moment = require('moment');
var async = require("async");
var logger = log4js.getLogger();
var Mysql = require("../../lib/mysqlService");
var Order = require("../../models/order")

module.exports = function(router){

router.get('/summary',function(req,res){
    res.render('sales/summary')
})
// 销售毛利总表   表格渲染
// router.get('/summary/data',function(req,res){
//     var select = req.query.select
//     var store = req.query.store
//     var month = req.query.month
//     if(!month){
//         month = moment().format('YYYY-MM')
//     }
//     var lastMonth = moment(month).subtract(1,'months').format('YYYY-MM')
//     if(select == '请选择'){
//         select = ''
//     }
//     var sql,sql1
//     function calc(str,store){
//         if(store && select == '按毛利率'){
//             sql = " select * from (SELECT b.store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate,substring(date,1,7) as month from reporder b WHERE substring(date,1,7)='"+str+"' and docType='零售出库单' and store like '%"+store+"%' group by store )a ORDER BY rate DESC "
//         }
//         if(store && (!select|| select == '按销售额')){
//             sql = " select * from (SELECT b.store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate ,substring(date,1,7) as month from reporder b WHERE substring(date,1,7)='"+str+"' and docType='零售出库单' and store like '%"+store+"%'  group by store )a ORDER BY sales DESC "
//         }
//         if(!store && select == '按毛利率'){
//             sql = "select * from (SELECT b.store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate ,substring(date,1,7) as month from reporder b WHERE substring(date,1,7)='"+str+"' and docType='零售出库单' group by store )a ORDER BY rate DESC "
//         }
//         if(!store && !select){
//             sql = " select * from (SELECT b.store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate ,substring(date,1,7) as month from reporder b WHERE substring(date,1,7)='"+str+"' and docType='零售出库单' group by store )a ORDER BY sales DESC "
//         }
//         if(!store && select == '按销售额'){
//             sql = "  select * from (SELECT b.store,  from reporder b WHERE substring(date,1,7)='"+str+"' and docType='零售出库单' group by store )a ORDER BY sales DESC "
//         }
//         sql+=" limit " + Number(req.query.start) + ', ' + Number(req.query.length)
//         return sql
//     }
//     function count(sql1){
//         // if(store){
//         //     sql1 = " select count(*) as count from (select count(*) from reporder where store='"+ store +"' group by store)a "
//         // }else{
//         //     sql1 = "select count(*) as count  from ( select count(*) from reporder GROUP BY store )a"
//         // }
//         if(store){
//             sql1 = " select count(*) as count  from (SELECT b.store,sum(amount-taxamount) as sales from reporder b WHERE substring(date,1,7)='"+month+"' and docType='零售出库单' and  store like '%"+store+"%' group by store )a ORDER BY sales DESC  "
//         }else{
//             sql1 = " select count(*) as count  from (SELECT b.store,sum(amount-taxamount) as sales from reporder b WHERE substring(date,1,7)='"+month+"' and docType='零售出库单' group by store )a ORDER BY sales DESC "
//         }

//         return sql1
//     }
//     async.auto({
//         "lastMonth":function(cb,rs){
//             Mysql.query(calc(lastMonth,store),function(err,row,field){
//                 if(err){
//                     logger.error('err in /summary/data lastMon',err)
//                     return false
//                 }
             
//                 var number 
//                 for(var i=0;i<row.length;i++){
//                     row[i].number =Number(req.query.start)+ i+1
//                 }
//                 cb(null,row)
//             })
//         },
//         "resultData":['lastMonth',function(cb,rs){
//             Mysql.query(calc(month,store),function(err,row,field){
//                 if(err){
//                     logger.error('err in /summary/data resultDatath',err)
//                     return false
//                 }
//                 var sort
//                 for(var i=0;i<row.length;i++){
//                     row[i].sort =Number(req.query.start)+ i+1
//                 }
//                 for(var a=0;a<row.length;a++){
//                     for(var b=0;b<rs.lastMonth.length;b++){
//                         if(a == b){
//                             var change = (rs.lastMonth[b].sales - row[a].sales)/row[a].sales
//                             row[a].change = change
//                         }
//                     }
//                 }
//                 cb(null,row)
//             })
//         }],
//         'count':function(cb,rs){
//             Mysql.query(count(sql1),function(err,row,field){
//                 if(err){
//                     logger.error('err in /summary/data count',err)
//                     return false
//                 }
//                 cb(null,row)
//             })
//         }
//     },function(err,result){
//         res.send({
//             aaData:result.resultData,
//             iTotalDisplayRecords:result.count[0].count,
//             iTotalRecords:result.count[0].count
//         })
//     })
    

// })
router.get('/summary/range',function(req,res){
    var val = req.query.val;
    var store = req.query.store;
    var select = req.query.select;
    var now = moment().format("YYYY-MM-DD")
    var lastday,sql1,before,sql2; //sql1 当前  sql2 前。。。天
    var change=[]
    if(select == '请选择'){
        select = ''
    }
    if(val == 'fifteen'){
        lastday = days(now,15);
        before = days(lastday,15);
        sql1 = sql(now,lastday);
        sql2 = sql(lastday,before);
        sqlcount = sqlCount(now,lastday)  
    }
    if(val == 'thirty'){
        lastday = days(now,30);
        before = days(lastday,30);
        sql1 = sql(now,lastday); 
        sql2 = sql(lastday,before);
        sqlcount = sqlCount(now,lastday)    
    }
    if(val == 'sixMonth'){
        lastday = days(now,180);
        before = days(lastday,180);
        sql1 = sql(now,lastday); 
        sql2 = sql(lastday,before);  
        sqlcount = sqlCount(now,lastday)  
    }
   
    function days(time,str){
       return  moment(time).subtract(str,'days').format("YYYY-MM-DD")
    }
    var sql3 = " select '"+lastday+"'as day1,'"+before+"'as day2,store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate  from reporder where substring(date,1,10)<'"+lastday+"' and substring(date,1,10)>='"+before+"' and docType='零售出库单' group by store ORDER BY sales DESC "
    function sql(day1,day2){
        var statement
        
        if(!store){
            if( select=='按销售额' || select == '' ){
                statement = " select '"+day1+"'as day1,'"+day2+"'as day2,store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate  from reporder where substring(date,1,10)<'"+day1+"' and substring(date,1,10)>='"+day2+"' and docType='零售出库单' group by store ORDER BY sales DESC "
            }
            if(select == '按毛利率'){
                statement = " select '"+day1+"'as day1,'"+day2+"'as day2,store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate  from reporder where substring(date,1,10)<'"+day1+"' and substring(date,1,10)>='"+day2+"' and docType='零售出库单' group by store ORDER BY rate DESC "
            }
        }else{
                statement = " select '"+day1+"'as day1,'"+day2+"'as day2,store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate  from reporder where substring(date,1,10)<'"+day1+"' and substring(date,1,10)>='"+day2+"' and docType='零售出库单' and store like '%"+store+"%' group by store "
        }
        statement += " limit " + Number(req.query.start) + ', ' + Number(req.query.length)
        return statement
    }
    function sqlCount(day1,day2){
        if(!store){
            sqlcount = " select count(*) as count from (SELECT store from reporder where substring(date,1,10)< '"+day1+"' and substring(date,1,10)>= '"+day2+"' and docType='零售出库单' group by store )a "
        }else {
            sqlcount = " select count(*) as count from (SELECT store from reporder where substring(date,1,10)< '"+day1+"' and substring(date,1,10)>= '"+day2+"' and docType='零售出库单' and store like'%"+store+"%' group by store )a "
        }
        return sqlcount
    }
    async.auto({
        "last":function(cb,rs){
            Mysql.query(sql3,function(err,row,field){
                if(err){
                    logger.error('/summary/range ',err)
                    res.send({code:"-1"})
                    return false
                }
                cb(null,row)
            })
        },
        'resultData':['last',function(cb,rs){
            Mysql.query(sql1,function(err,row,field){
                if(err){
                    logger.error('/summary/ranage',err)
                    res.send({code:"-1"})
                    return false
                }
                var sort;
                for (var i=0;i<row.length;i++){
                    row[i].sort =Number(req.query.start)+ i+1;
                }
                for (var a=0;a<row.length;a++){
                    for (var b=0;b<rs.last.length;b++){
                        if(row[a].store==rs.last[b].store){
                            var change;
                            if(select == '' || select == '按销售额'){
                                change = (row[a].sales - rs.last[b].sales)/rs.last[b].sales
                            }
                            if(select == '按毛利率'){
                                change = (row[a].rate - rs.last[b].rate )/rs.last[b].rate
                            }
                            row[a].change = change
                        }
                    } 
                    // (function(a){
                    //     var sql3=" select '"+lastday+"'as day1,'"+before+"'as day2,store,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax) as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate  from reporder where substring(date,1,10)<'"+lastday+"' and substring(date,1,10)>='"+before+"' and docType='零售出库单' and store='"+row[a].store+"' group by store ORDER BY sales DESC  "   
                    //     Mysql.query(sql3,function(err,row1,field){
                    //         if(err){
                    //             logger.error('.',err)
                    //             return false
                    //         }
                    //         for (var c=0;c<row1.length;c++){
                    //             if(row[a].store == row1[c].store){
                    //                 var changedata;
                    //                 if(select == '' || select == '按销售额'){
                    //                     changedata = (row[a].sales - row1[c].sales)/row1[c].sales
                    //                 }
                    //                 if(select == '按毛利率'){
                    //                     changedata = (row[a].rate - row1[c].rate )/row1[c].rate
                    //                 }
                    //                 change.push(changedata)
                    //             }
                    //         }
                            
                    //     }) 
                        
                    // })(a)
                }
                cb(null,row)
            })
        }],
        'count':function(cb,rs){
            Mysql.query(sqlcount,function(err,row,field){
                if(err){
                    logger.error('/summary/range/count ',err);
                    res.send({code:"-1"});
                    return false;
                }
                cb(null,row)
            })
        }

    },function(err,result){
        res.send({
            aaData:result.resultData,
            iTotalDisplayRecords:result.count[0].count,
            iTotalRecords:result.count[0].count
        })
    })


})

router.get('/drug',function(req,res){
    res.locals.store = req.query.store
    res.locals.day2 = req.query.day2
    res.locals.day1 = req.query.day1
    res.locals.ypfl = req.query.ypfl
    res.render('sales/drug')
})
// 药品明细表    表格渲染
router.get('/drug/data',function(req,res){
    var store = req.query.store
    var ypfl = req.query.ypfl
    var drug = req.query.drug
    var day1 = req.query.day1
    var day2 = req.query.day2
    if(!req.query.month){
        dateTime = moment().format('YYYY-MM')
    }
    if(!req.query.compareMonth){
        compareMonth = moment(dateTime).subtract(1,'months').format('YYYY-MM')
    }
    var time = '2017-09'
    var count
    if(drug){
        count = " select count(*) as count from (select count(b.productinfo) from reporder b  where substring(date,1,10)<'"+day1+"' and substring(date,1,10)>='"+day2+"' and store='"+store +"' and productinfo like '%"+drug+"%' and docType='零售出库单' and substring(standardCode,1,2)='"+ypfl+"' group by productinfo )a "
    }else{
       count = " select count(*) as count from (select count(b.productinfo) from reporder b  where substring(date,1,10)<'"+day1+"' and substring(date,1,10)>='"+day2+"' and store='"+store +"' and docType='零售出库单' and substring(standardCode,1,2)='"+ypfl+"' group by productinfo )a "
    }
    
    
    function calc(medicine,date){
        var sql = "  select * from (SELECT b.store,b.productinfo,sum(number) as number ,sum(amount-taxamount) as sales,sum(amount- taxamount -number*cose_notax)as profit,sum(cose_notax*number) as cost,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as rate ,substring(date,1,7) as month from reporder b   "
        if(drug){
            sql += "where substring(standardCode,1,2)='"+ypfl+"' and substring(date,1,10)<'"+ day1 +"'and substring(date,1,10)>='"+ day2 +"' and docType='零售出库单' and store='"+store+"' and productinfo like '%"+ medicine +"%' " 
        }else{
            sql += "where substring(date,1,10)<'"+ day1 +"'and substring(date,1,10)>='"+ day2 +"'  and substring(standardCode,1,2)='"+ypfl+"' and docType='零售出库单' and store='"+store+"'  " 
        }
        sql+= "group by productinfo )a ORDER BY sales DESC "
        sql+=" limit " + Number(req.query.start) + ', ' + Number(req.query.length)
        return sql
    }
    
    async.auto({
        'lastMonth':function(cb,rs){
            Mysql.query(calc(drug,compareMonth),function(err,row,field){
                if(err){
                    logger.error('err in /drug/data lastMonth',err)
                    return false
                }
                cb(null,row)
            })
        },
        'resultData':['lastMonth',function(cb,rs){
            Mysql.query(calc(drug,dateTime),function(err,row,field){
                if(err){
                    logger.error('err in /drug/data resultData',err)
                    return false
                }
                for(var j=0;j<row.length;j++){
                    row[j].sort =Number(req.query.start)+j+1
                }
                for(var a=0;a<row.length;a++){
                    for(var b=0;b<rs.lastMonth.length;b++){
                        if(a == b){
                            var change = (rs.lastMonth[b].sales - row[a].sales)/row[a].sales
                            row[a].change = change
                        }
                    }
                }
                cb(null,row)
            })
        }],
        'count':function(cb,rs){
            Mysql.query(count,function(err,row,field){
                if(err){
                    logger.error('err in /drug/data count ',err)
                    return false
                }
                cb(null,row)
            })
        }

    },function(err,result){
        res.send({
            aaData:result.resultData,
            iTotalDisplayRecords:result.count[0].count,
            iTotalRecords:result.count[0].count
        })
    })

})
// 折线图 销售额 毛利
router.get('/chart',function(req,res){
    var store = req.query.store
    async.auto({
        'day':function(cb,rs){
            Mysql.query(sum( time(0) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart day',err)
                    return false
                }
                if(row==''){
                    row.push({sales:0})
                }
                cb(null,row)
            })
        },
        'day1':function(cb,rs){
            Mysql.query(sum( time(1) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart day',err)
                    return false
                }
                if(row==''){
                    row.push({sales:0})
                }
                cb(null,row)
            })
        },
        'day2':function(cb,rs){
            Mysql.query(sum( time(2) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart day',err)
                    return false
                }
                if(row==''){
                    row.push({sales:0})
                }
                cb(null,row)
            })
        },
        'day3':function(cb,rs){
            Mysql.query(sum( time(3) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart day',err)
                    return false
                }
                if(row==''){
                    row.push({sales:0})
                }
                cb(null,row)
            })
        },
        'day4':function(cb,rs){
            Mysql.query(sum( time(4) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart day',err)
                    return false
                }
                if(row==''){
                    row.push({sales:0})
                }
                cb(null,row)
            })
        },
        'day5':function(cb,rs){
            Mysql.query(sum( time(5) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart day',err)
                    return false
                }
                if(row==''){
                    row.push({sales:0})
                }
                cb(null,row)
            })
        },
        'rate':function(cb,rs){
            Mysql.query(rate( time(0) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart rate',err)
                    return false
                }
                if(row==''){
                    row.push({profit:0})
                }
                cb(null,row)
            })
        },
        'rate1':function(cb,rs){
            Mysql.query(rate( time(1) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart rate1',err)
                    return false
                }
                if(row==''){
                    row.push({profit:0})
                }
                cb(null,row)
            })
        },
        'rate2':function(cb,rs){
            Mysql.query(rate( time(2) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart rate2',err)
                    return false
                }
                
                if(row == ''){
                    row.push({profit:0})
                }
                cb(null,row)
            })
        },
        'rate3':function(cb,rs){
            Mysql.query(rate( time(3) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart rate3',err)
                    return false
                }
                if(row==''){
                    row.push({profit:0})
                }
                cb(null,row)
            })
        },
        'rate4':function(cb,rs){
            Mysql.query(rate( time(4) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart rate4',err)
                    return false
                }
                if(row==''){
                    row.push({profit:0})
                }
                cb(null,row)
            })
        },
        'rate5':function(cb,rs){
            Mysql.query(rate( time(5) ),function(err,row,field){
                if(err){
                    logger.error('error in /chart rate5',err)
                    return false
                }
                if(row==''){
                    row.push({profit:0})
                }
                cb(null,row)
            })
        },
        
    },function(err,result){
        res.locals.data = result
        res.locals.store = store 
        res.render('sales/chart')
    })

    function sum(str){
        var sql = " select * from (SELECT b.store,sum(amount-taxamount) as sales from reporder b WHERE substring(date,1,7)='"+str+"' and store= '"+store+"' group by store )a ORDER BY sales DESC"
        return sql
    }
    function rate(str){
        var sql = "select * from (SELECT b.store,sum(amount- taxamount -number*cose_notax)/sum(amount-taxamount) as profit from reporder b WHERE substring(date,1,7)='"+str+"' and store='"+store+"' group by store )a"
        return sql 
    }
    function time(num){
        var time = moment().subtract(num,'months').format('YYYY-MM')
        return time 
    }

})

// 折线图库存金额
router.get('/chart/data',function(req,res){
    var store = req.query.store
    var dataJson = []
    var sql = "select sum(amount- taxamount) sales,store,date from stock where store='"+store+"' group by date  order by date desc limit 180"
    
    Mysql.query(sql,function(err,row,field){
        if(err){
            logger.error('err in chart/data',err)
            return false
        }
        for(var i=0;i<row.length;i++){
            var year=row[i].date.substring(0,4)
            var month = row[i].date.substring(5,7)-1
            if(month == '0'){
                month = 12;
                year = year - 1
            }
            var day = row[i].date.substring(8,10)
            dataJson.push([Date.UTC(year,month,day),row[i].sales])
        }
        res.send({
            data:dataJson
        })
    })
})

// 折线图退货金额
router.get('/chart/return',function(req,res){
    var store = req.query.store
    var sql = " select DATE_FORMAT(t.date,'%Y-%m') month,store,sum(amountTax) amount from returnin t where store='"+store+"' AND  DATE_FORMAT(date,'%Y-%m')>DATE_FORMAT(date_sub(curdate(), interval 24 month),'%Y-%m')group by month order by month DESC "
    var data=[]
    Mysql.query(sql,function(err,row,field){
        if(err){
            logger.error('err in chart/return',err)
            return false
        }
        for(var i=0;i<row.length;i++){
            var year=row[i].month.substring(0,4)
            var months = row[i].month.substring(5,7)-1
            if(months == '0'){
                months = 12
                year = year-1
            }
            data.push([Date.UTC(year,months),row[i].amount])
        }
        res.send({
            data:data
        })

    })

})

// 数据总览
router.get('/overview',function(req,res){
    res.render('sales/overview')
})
router.get('/overview/data',function(req,res){
    var data = req.query.data
    var month = moment().format('YYYY-MM')
    var month6 = moment(month).subtract(6,'months').format('YYYY-MM')
    var today = moment().format('YYYY-MM-DD')
    var today15 = moment(today).subtract(16,'days').format('YYYY-MM-DD')
    var today30 = moment(today).subtract(31,'days').format('YYYY-MM-DD')
    var sql,sqlCount;
    if(data == 'fifteen'){
        sql = " select sum(amount-taxamount)as sales,substring(date,1,10) as date,sum(number) as number,sum(cose_notax*number) as cost,sum(amount-taxamount-cose_notax*number) as profit ,sum(amount-taxamount-cose_notax*number)/sum(amount-taxamount)as rate from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>'"+today15+"' and docType='零售出库单' GROUP BY substring(date,1,10) ORDER BY substring(date,1,10) DESC"
        sqlCount = " select count(*) as count from (select *  from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>'"+today15+"' and docType='零售出库单' GROUP BY substring(date,1,10) ORDER BY substring(date,1,10) DESC )a"
    }
    if(data == 'thirty'){
        sql = " select sum(amount-taxamount)as sales,substring(date,1,10) as date,sum(number) as number,sum(cose_notax*number) as cost,sum(amount-taxamount-cose_notax*number) as profit ,sum(amount-taxamount-cose_notax*number)/sum(amount-taxamount)as rate from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>'"+today30+"' and docType='零售出库单' GROUP BY substring(date,1,10) ORDER BY substring(date,1,10) DESC"
        sqlCount = " select count(*) as count from (select *  from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>'"+today30+"' and docType='零售出库单' GROUP BY substring(date,1,10) ORDER BY substring(date,1,10) DESC )a "
    }
    if(data == 'sixMonth'){
        sql = " select sum(amount-taxamount) as sales,substring(date,1,7) as date,sum(number) as number ,sum(cose_notax*number) as cost,sum(amount-taxamount-cose_notax*number) as profit ,sum(amount-taxamount-cose_notax*number)/sum(amount-taxamount)as rate from reporder where docType='零售出库单' and substring(date,1,7)<='"+month+"' and substring(date,1,7)>'"+month6+"'  group by  substring(date,1,7) ORDER BY substring(date,1,7) DESC "
        sqlCount = "  select count(*) as count from (select *  from reporder where substring(date,1,7)<='"+month+"' and substring(date,1,7)>'"+month6+"' and docType='零售出库单' GROUP BY  substring(date,1,7) ORDER BY substring(date,1,7) DESC )a "
    }
    sql+=" limit " + Number(req.query.start) + ', ' + Number(req.query.length);
    async.auto({
        'sales':function(cb,rs){
            Mysql.query(sql,function(err,row,field){
                if(err){
                    logger.error('/overview/data/    sales',err)
                    return false
                }
                cb(null,row)
            })
        },
        'count':function(cb,rs){
            Mysql.query(sqlCount,function(err,row,field){
                if(err){
                    logger.error('/overview/data/    sales',err)
                    return false
                }
                cb(null,row)
            })
        }
        
    },function(err,result){
        res.send({
            aaData:result.sales,
            iTotalDisplayRecords:result.count[0].count,
            iTotalRecords:result.count[0].count
        })
    })

})
router.get('/overview/chart',function(req,res){
    var data = req.query.data
    var month = moment().format('YYYY-MM')
    var month6 = moment(month).subtract(6,'months').format('YYYY-MM')
    var today = moment().format('YYYY-MM-DD')
    var today15 = moment(today).subtract(16,'days').format('YYYY-MM-DD')
    var today30 = moment(today).subtract(31,'days').format('YYYY-MM-DD')
    var today180 = moment(today).subtract(180,'days').format('YYYY-MM-DD')
    var sql,sql2
    if(data == 'fifteen'){
        sql = " select sum(amount-taxamount)as sales,substring(date,1,10) as date,sum(amount-taxamount-cose_notax*number) as profit  from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>='"+today15+"' and docType='零售出库单' GROUP BY substring(date,1,10) ORDER BY substring(date,1,10) DESC"
        sql2 = " select sum(amount-taxamount)as sales,sum(amount-taxamount-cose_notax*number) as profit ,sum(number) as number, sum(cose_notax*number) as cost,sum(amount-taxamount-cose_notax*number)/sum(amount-taxamount)as rate from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>='"+today15+"' and docType='零售出库单' "
    }
    if(data == 'thirty'){
        sql = " select sum(amount-taxamount)as sales,substring(date,1,10) as date,sum(amount-taxamount-cose_notax*number) as profit  from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>='"+today30+"' and docType='零售出库单' GROUP BY substring(date,1,10) ORDER BY substring(date,1,10) DESC"
        sql2 = "  select sum(amount-taxamount)as sales,sum(amount-taxamount-cose_notax*number) as profit ,sum(number) as number, sum(cose_notax*number) as cost,sum(amount-taxamount-cose_notax*number)/sum(amount-taxamount)as rate from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>='"+today30+"' and docType='零售出库单'  "
    }
    if(data == 'sixMonth'){
        sql = " select sum(amount-taxamount) as sales,substring(date,1,7) as date,sum(amount-taxamount-cose_notax*number) as profit  from reporder where docType='零售出库单' and substring(date,1,7)<='"+month+"' and substring(date,1,7)>'"+month6+"'  group by  substring(date,1,7) ORDER BY substring(date,1,7) DESC "
        sql2 = " select sum(amount-taxamount)as sales,sum(amount-taxamount-cose_notax*number) as profit ,sum(number) as number, sum(cose_notax*number) as cost,sum(amount-taxamount-cose_notax*number)/sum(amount-taxamount)as rate from reporder where substring(date,1,10)<'"+today+"' and substring(date,1,10)>='"+today180+"' and docType='零售出库单' "
    }
    async.auto({
        'chart':function(cb,rs){
            Mysql.query(sql,function(err,row,field){
                if(err){
                    logger.error('/overview/chart/    salchart',err)
                    res.send({code:'-1'})
                    return false
                }
                cb(null,row)
            })
        },
        'all':function(cb,rs){
            Mysql.query(sql2,function(err,row,field){
                if(err){
                    logger.error('/overview/chart/    salchart',err)
                    res.send({code:'-1'})
                    return false
                }
                cb(null,row)
            })
        }
    },function(err,result){
        res.send({
            data:result.chart,
            overdata:result.all,
            code:'1'
        })
    })
    


})

// 药品分类
router.get('/classification',function(req,res){
    res.locals.store = req.query.store
    res.locals.day1 = req.query.day1
    res.locals.day2 = req.query.day2
    res.render('sales/classification')
})
router.get('/classification/data',function(req,res){
    var day1 = req.query.data.day1;
    var day2 = req.query.data.day2;
    var store = req.query.data.store
    // 10-中西药片 20-中西饮片 30-特殊食品 31-保健用品 40-医疗器械  50-食品，60化妆品 70-其他用品，71-已批药包材 80-成人用品 90消毒产品
    var arr = [10,20,30,31,40,50,60,70,71,80,90]
    var data = [];
    var sqlCount = " select count(*) as count from reporder where substring(date,1,10)<'"+day1+"' and substring(date,1,10)>='"+day2+"'  and docType='零售出库单'  and store = '"+store+"' "
    for (var i=0;i<arr.length;i++){
        
        (function(i){
            var sql = " select sum(amount-taxamount)as sales,store,sum(amount-taxamount-cose_notax*number) as profit ,substring(standardCode,1,2) as ypfl, sum(cose_notax*number) as cost,sum(amount-taxamount-cose_notax*number)/sum(amount-taxamount) as rate,substring(date,1,7) as month   from reporder where substring(date,1,10)<'"+day1+"' and substring(date,1,10)>='"+day2+"' and substring(standardCode,1,2)='"+arr[i]+"'  and docType='零售出库单'  and store = '"+store+"' ";
            // sql+=" limit " + Number(req.query.start) + ', ' + Number(req.query.length);
            async.auto({
                'resultData':function(cb,rs){
                    Mysql.query(sql,function(err,row,field){
                        if(err){
                            logger.error('/overview/classification/    salchart',err)
                            res.send({code:'-1'})
                            return false
                        }
                        var stringRow = JSON.stringify(row)
                        var subs = stringRow.substring(1,stringRow.length-1)
                        data.push(JSON.parse(subs))
                        if(data.length == '11'){
                            var lastData = []
                            for(var k=0;k<data.length;k++){
                                if(data[k].ypfl != null) {
                                    lastData.push(data[k])
                                }
                            }
                            cb(null,lastData)
                        }
                    })
                },
                'count':function(cb,rs){
                    Mysql.query(sqlCount,function(err,row,field){
                        if(err){
                            logger.error('/over/classification/ ',err)
                            res.send({code:'-1'})
                            return false
                        }
                        cb(null,row)
                    })
                }
            },function(err,result){
                res.send({
                    aaData:result.resultData,
                    iTotalDisplayRecords:result.resultData.length,
                    iTotalRecords:result.resultData.length
                })
            })
        })(i)

    }
    


})

}

