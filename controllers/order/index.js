var express = require('express'),
    app = express(),
    cheerio = require('cheerio'),
    request = require('request'),
    log4js = require('log4js'),
    logger = log4js.getLogger();
var URL = require("url");
var xmlreader = require("xmlreader");
var async = require('async');

var cookDb = require('../../models/cookies'); //cookie表
var Mysql = require('../../lib/mysqlService');
var dataService = require('../../service/getData');
var myHttp = require('../../lib/myhttp');


module.exports = function(router) {

    var host = 'saas.gooddrug.cn';
    var urlBuy = 'http://saas.gooddrug.cn/views/center/inv/purIn/list.views';//采购验收入库单查询url
    var urlProduct = 'http://saas.gooddrug.cn/views/center/doc/god/list.views'; //资料-》商品
    var urlJfywmx = 'http://saas.gooddrug.cn/views/center/inv/rep/inoutItemRep.views';  //仓库进发业务明细表
    var urlMdjfyw = 'http://saas.gooddrug.cn/views/center/str/rep/inoutItemRep.views';  //门店》》进发业务明细表
    var urlStock= 'http://saas.gooddrug.cn/views/center/str/rep/stockItemRep.views';  //门店》》库存明细表
    var urlReturn= 'http://saas.gooddrug.cn/views/center/inv/salReturnIn/list.views';  //仓库》》销售退货入库单
   
    //进入门店订单页
    router.get('/orderPage', function(req, res) {
        var cond = {
            host: 'http://saas.gooddrug.cn', //
            url: url_order,   //必须
            path:'/views/center/str/rep/purOrderListRep.views',
            method: "get",
            gzip: true,    //解决乱码问题
            headers: { 
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",    
                "Accept":"text/plain, */*; q=0.01",
                "X-Requested-With":'XMLHttpRequest',
                "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                "Accept-Encoding": "gzip, deflate, sdch",
                "Accept-Language":"zh-CN, zh;q=0.8",
                "Host":"saas.gooddrug.cn",
                "Referer": url_order,
                "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36",
                "Cookie": 'g=2017-08-06; bfAppId=2; bfId=10121;JSESSIONID=C2BCCEF432A87EECAE7A8B87505FB9AE.pro_rtl_1'
            }   
        };
        request(cond, function(err, rs, body) {
            if(err) {
                logger.error('er in .../account/orders', err);
                return false;
            }
            rs.setEncoding("utf8");
            if(!err && rs.statusCode == 200) {
                $ = cheerio.load(body);
                logger.info("form detail", $('#mainForm'));
                res.json({
                    body: body
                })
                return false;
            }
        })
    });


    //资料商品页数据
    router.get('/productInfo', function(req, res) {
        dataService.getViewState(urlProduct, function(viewState) {
            // logger.info("productInfo  viewState", viewState);
            var searchParam = {
                // begDate: '2017-08-01',
                pageSize: '20',  //该值会对应viewstate
                type: 'zlsp',        //查询类型
                Source: 'mainForm:j_idt97:n_next',
                mainFormNext: 'mainForm:j_idt97:n_next',  //增加该项
                deleteParam: 'mainForm:j_idt44',
                renderParam: 'mainForm:mainContent',
                pageParam: 'mainForm:j_idt97:pageNumber',  //分页
            }

            cookDb.findOne({'host': host}, function(err, result) {
                if(err) {
                    logger.error('获取cookie失败，请登录', err);
                    res.send('获取cookie失败，请登录');
                    return false;
                }
                var tempCookie = result.JSESSIONID;
                tempCookie = 'JSESSIONID=6AB48E11107CB4970C864039E3AE0642';
                logger.info('tempCookie in productInfo', tempCookie);
                var params = {
                    'javax.faces.partial.ajax':'true',
                    'javax.faces.source':"mainForm:j_idt44",
                    'javax.faces.partial.execute': '@all',
                    'javax.faces.partial.render':'mainForm:listMain',
                    'mainForm:j_idt44': 'mainForm:j_idt44',
                    'mainForm':'mainForm',
                    'mainForm:j_idt18': '',
                    'mainForm:select': '-1',
                    'mainForm:j_idt25': '',   //商品类型，10-中西药片 20-中西饮片 30-特殊食品 31-保健用品 40-医疗器械  50-食品，60化妆品7 0-其他用品，71-已批药包材 80-成人用品 90消毒产品          // 资料-》商品  107-中西药片 
                    'mainForm:j_idt30': '',
                    'mainForm:j_idt35': '',
                    'mainForm:j_idt40_input': '',
                    'mainForm:j_idt42_input': '',
                    'mainForm:selectedRow': '',
                    'mainForm:list_selection': '',
                    'mainForm:list_scrollState': '0,0',
                    'mainForm:j_idt97:n_pageSize': searchParam.pageSize,
                    'mainForm:j_idt97:pageNumber': '0',
                    'javax.faces.ViewState': viewState+''
                };
                dataService.getRepOrder(urlProduct, params, searchParam, tempCookie, function(er, records) {
                    if(er) {
                        logger.info("数据获取失败", er);
                        res.send('数据获取失败');
                        return false;
                    }
                    logger.info("records..........", records);
                    if(records == 0) {
                        logger.info('没有数据记录！');
                        res.send('采购验收入库单数据插入失败');
                        return false;
                    }
                    res.send('成功插入商品数据' + records + '条！');
                    // async.eachSeries(dataArr,function(it, callback){
                    //     var sql = 'insert into product values(?,?,?)';
                    //     //不同商品可能对应同一个商品代码
                    //     Mysql.queryInsert(sql, it, function(errInsert, row, field) {
                    //         callback(errInsert);
                    //     })
                    // }, function(errSql) {
                    //     if(errSql) {
                    //         logger.info("repOder insert err", errSql);
                    //         res.send('采购验收入库单数据插入失败');
                    //         return false;
                    //     }
                    //     res.send('采购验收入库单数据保存成功');
                    // });
                });
            });    
        })
        
    });

    //  门店 》》进发业务明细表   
    // *****/views/center/str/rep/inoutItemRep.views
    router.get('/inoutRepoData', function(req, res) {
        dataService.getViewState(urlMdjfyw, function(viewState) {
            var searchParam = {   //2018-04-27  2017-12-28
                begDate: '2018-04-25',
                endDate: '2018-04-27',
                pageSize: '20',
                type: 'mdjfyw',        //查询类型
                Source: 'j_idt193:n_next',
                mainFormNext: 'mainForm:mainContent:j_idt196:n_next',
                deleteParam: 'mainForm:headerContent:j_idt36',
                // renderParam: 'mainForm:mainContent',
                pageParam: 'mainForm:mainContent:j_idt196:pageNumber',  //分页
            }
            dataService.getCookieNew(urlMdjfyw, function(err, result) {
                if(err) {
                    logger.error('获取cookie失败', err);
                    res.send('获取cookie失败，请登录');
                    return false;
                }
                logger.info('result----->>>>>',result)
                var tempCookie = result;
                tempCookie = 'JSESSIONID=4F306AD41578483624BC8432FBEFC047';
                logger.info('tempCookie', tempCookie);
                var params = {
                    'javax.faces.partial.ajax':'true',
                    'javax.faces.source':"mainForm:headerContent:j_idt36",
                    // 'javax.faces.source':"mainForm:j_idt80:n_next",
                    'javax.faces.partial.execute': '@all',
                    'javax.faces.partial.render':'mainForm:listMain',
                    'mainForm:headerContent:j_idt36': 'mainForm:headerContent:j_idt36',
                    // 'mainForm:j_idt80:n_next':'mainForm:j_idt80:n_next',
                    'mainForm':'mainForm',
                    'mainForm:headerContent:j_idt18': '', 
                    'mainForm:headerContent:j_idt32_input' : searchParam.begDate,    
                    'mainForm:headerContent:j_idt34_input': searchParam.endDate,     
                    'mainForm:mainContent:dataList_selection': '',  
                    'mainForm:mainContent:dataList_scrollState' :'0,0',
                    'mainForm:mainContent:j_idt196:n_pageSize': searchParam.pageSize,        //每次上限为100条
                    'mainForm:mainContent:j_idt196:pageNumber': '1',
                    //该参数会定时过期
                    'javax.faces.ViewState': viewState + '',
                };
                    
                dataService.getRepOrder(urlMdjfyw, params, searchParam, tempCookie, function(er, records) {
                    if(er) {
                        logger.info("数据获取失败", er);
                        res.send('数据获取失败');
                        return false;
                    }
                    logger.info("records..........", records);
                    if(records == 0) {
                        logger.info('没有数据记录！');
                        res.send('没有数据记录,采购验收入库单数据插入失败');
                        return false;
                    }
                    res.send('成功插入数据' + records + '条！');
                    // async.eachSeries(dataArr,function(it, callback){
                    //     var sql = 'insert into reporder(date, productCode, store, receiptno,productinfo,number,begindate,enddate,prize,amount,cost,cose_notax,taxrate,taxamount) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                    //     Mysql.queryInsert(sql, it, function(errInsert, row, field) {
                    //         callback(errInsert);
                    //     })
                    // }, function(errSql) {
                    //     if(errSql) {
                    //         logger.info("repOder insert err", errSql);
                    //         res.send('采购验收入库单数据插入失败');
                    //         return false;
                    //     }
                    //     res.send('采购验收入库单数据保存成功');
                    // });
                });
            }); 
        });
        
    });

    /**   门店 》》库存明细表   
    /*** ****views/center/str/rep/inoutItemRep.views
    /**
    **/
    router.get('/stock', function(req, res) {
        dataService.getViewState(urlStock, function(viewState) {
            logger.info("stock  viewState", viewState);
            var searchParam = {   // 2018-04-27  2017-12-20
                begDate: '2018-04-25',
                endDate: '2018-04-27',
                pageSize: '20',
                type: 'stock',        //查询类型
                Source: 'mainForm:mainContent:j_idt179:n_next',
                mainFormNext: 'mainForm:mainContent:j_idt179:n_next',
                deleteParam: 'mainForm:j_idt22',
                // renderParam: 'mainForm:mainContent',
                pageParam: 'mainForm:mainContent:j_idt179:pageNumber',  //分页
            }
            dataService.getCookieNew(urlStock, function(err, result) {
                if(err) {
                    logger.error('获取cookie失败', err);
                    res.send('获取cookie失败，请登录');
                    return false;
                }
                var tempCookie = result;
                tempCookie = 'JSESSIONID=4F306AD41578483624BC8432FBEFC047';
                logger.info('tempCookie', tempCookie);
                var params = {
                    'javax.faces.partial.ajax':'true',
                    'javax.faces.source':"mainForm:j_idt22",
                    'javax.faces.partial.execute': '@all',
                    'javax.faces.partial.render':'mainForm:listMain',
                    'mainForm:j_idt22': 'mainForm:j_idt22',
                    'mainForm':'mainForm',
                    'mainForm:queryText': '',
                    'mainForm:j_idt18_input' : searchParam.begDate,    
                    'mainForm:j_idt20_input': searchParam.endDate,     
                    'mainForm:mainContent:dataList_selection': '',  
                    'mainForm:mainContent:dataList_scrollState' :'0,0',
                    'mainForm:mainContent:j_idt179:n_pageSize': searchParam.pageSize,        //每次上限为100条
                    'mainForm:mainContent:j_idt179:pageNumber': '0',
                    'javax.faces.ViewState': viewState
                };

                dataService.getRepOrder(urlStock, params, searchParam, tempCookie, function(er, records) {
                    if(er) {
                        logger.info("数据获取失败", er);
                        res.send('数据获取失败');
                        return false;
                    }
                    // logger.info('data....
                    //     .......', dataArr.length);
                    logger.info("records..........", records);
                    if(records == 0) {
                        logger.info('没有数据记录！');
                        res.send('没有数据记录,采购验收入库单数据插入失败');
                        return false;
                    }
                    res.send('成功插入数据' + records + '条！');
                    // async.eachSeries(dataArr,function(it, callback){
                    //     var sql = 'insert into reporder(date, productCode, store, receiptno,productinfo,number,begindate,enddate,prize,amount,cost,cose_notax,taxrate,taxamount) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                    //     Mysql.queryInsert(sql, it, function(errInsert, row, field) {
                    //         callback(errInsert);
                    //     })
                    // }, function(errSql) {
                    //     if(errSql) {
                    //         logger.info("repOder insert err", errSql);
                    //         res.send('采购验收入库单数据插入失败');
                    //         return false;
                    //     }
                    //     res.send('采购验收入库单数据保存成功');
                    // });
                });
            }); 
        });
        
    });

    /**   仓库 》》销售退货入库   
    /*** http://saas.gooddrug.cn/views/center/inv/salReturnIn/list.views
    /**
    **/
    router.get('/return', function(req, res) {
        dataService.getViewState(urlReturn, function(viewState) {
            logger.info("return  viewState>>>>>>>>>>>>>>>>>>", viewState);
            var searchParam = {
                begDate: '2017-08-01',
                endDate: '2018-01-30',
                pageSize: '20',
                type: 'return',        //查询类型
                Source: 'mainForm:j_idt82:n_next',
                mainFormNext: 'mainForm:j_idt82:n_next',
                deleteParam: 'mainForm:headerContent:j_idt45',
                pageParam: 'mainForm:j_idt82:pageNumber',  //分页
            }
            dataService.getCookieNew(urlReturn, function(err, result) {
                if(err) {
                    logger.error('获取cookie失败', err);
                    res.send('获取cookie失败，请登录');
                    return false;
                }
                logger.info("result cookie in return getCookieNew>>>>>>>", result);
                // return false;
                var tempCookie = result;
                tempCookie = 'JSESSIONID=881D13E5140238445DEDF076E6F699CD';
                logger.info('tempCookie', tempCookie);
                var params = {
                    'javax.faces.partial.ajax':'true',
                    'javax.faces.source':"mainForm:headerContent:j_idt45",
                    'javax.faces.partial.execute': '@all',
                    'javax.faces.partial.render':'mainForm:listMain',
                    'mainForm:headerContent:j_idt45': 'mainForm:headerContent:j_idt45',
                    'mainForm':'mainForm',
                    'mainForm:headerContent:j_idt17': '',
                    'mainForm:headerContent:j_idt31_input' : searchParam.begDate,    
                    'mainForm:headerContent:j_idt33_input': searchParam.endDate,
                    'mainForm:headerContent:j_idt37':'31',     
                    'mainForm:dataList_selection': '',  
                    'mainForm:dataList_scrollState' :'0,0',
                    'mainForm:j_idt82:n_pageSize': searchParam.pageSize,        //每次上限为100条
                    'mainForm:j_idt82:pageNumber': '0',
                    'javax.faces.ViewState': viewState + '',
                };

                dataService.getRepOrder(urlReturn, params, searchParam, tempCookie, function(er, records) {
                    if(er) {
                        logger.info("数据获取失败", er);
                        res.send('数据获取失败');
                        return false;
                    }
                    logger.info("records..........", records);
                    if(records == 0) {
                        logger.info('没有数据记录！');
                        res.send('没有数据记录,仓库退货入库单数据插入失败');
                        return false;
                    }
                    res.send('成功插入数据' + records + '条！');
                });
            }); 
        });
        
    });



















    //获取订单信息 使用request 
    //no use
    router.get('/orders/data', function(req, res) {
        cond['method'] = 'post';
        cond['formData'] = {
            'javax.faces.partial.ajax':'true',
            'javax.faces.source:mainForm':'j_idt21',
            'javax.faces.partial.execute': '@all',
            'javax.faces.partial.render:mainForm': 'listMain',
            'mainForm':'j_idt21:mainForm:j_idt21',
            'mainForm':'mainForm',
            'mainForm':'queryText:',
            'mainForm':'j_idt17_input:2017-05-01',
            'mainForm':'j_idt19_input:2017-08-06',
            'mainForm':'j_idt22_selection:',
            'mainForm:j_idt22_scrollState':'0,0',
            'mainForm:j_idt65:n_pageSize':20,
            'mainForm:j_idt65:pageNumber':1,
            'javax.faces.ViewState':'deYjOr7eVwyASFQsXoSucAvoFFgtJT3bP1ev1GUjbrNNQRiKz1IzqA5JXaAdzkEoPnr9rXH2WVRckOptu/OZroEmS0jMkZxSbNEXNDJ41cNYeySQtaOZ3VA31khWjTYUP5pjHWv9Ce+WGTG331MOzXAE1wSgU/Yf6Ly28JqObZHajmPgRCDe1bO1ru'
        }
        var params = cond.formData.toString();
        logger.info('params..........', params);
        // request(cond, function(err, rs, body) {
        request(url_order, params, function(err, rs, body) {
            if(err) {
                logger.error('er in .../account/orders', err);
                return false;
            }
            rs.setEncoding("utf8");
            if(!err && rs.statusCode == 200) {
                $ = cheerio.load(body);
                logger.info("body detail", body);
                // logger.info("form detail", $('#j_id1'));
                res.render({
                    body: body
                })
            }
        })
    });


};


