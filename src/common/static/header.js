$(document).ready(function(){
   
    $('#dataSum').on('click',function(){
        $(this).addClass('orange')
        $(this).siblings().removeClass('orange')
        location.href="/sales/overview"
    })
    $('#rateSale').on('click',function(){
        $(this).addClass('orange')
        $(this).siblings().removeClass('orange')
        location.href="/sales/summary"
    })
})
