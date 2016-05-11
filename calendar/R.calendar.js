/**
 * @author xiaoweizhi
 */
;(function($){
	"use strict";
	$.fn.extend({
		rcalendar:function(opts){
			var defaults={}; 
			var option=$.extend({},defaults,opts);
			function include_css(path,id)   
			{       
			    var fileref=document.createElement("link");   
			    fileref.rel = "stylesheet";  
			    fileref.type = "text/css";
			    fileref.id=id;
			    fileref.href = path;
			    var headobj =document.getElementsByTagName('head')[0];
			     if(!document.getElementById(id)){   
     				headobj.appendChild(fileref);
     			 }      
			}
			function include_js(path,id)   
			{       
			      var sobj = document.createElement('script');   
			      sobj.type = "text/javascript";   
			      sobj.src = path;
			      sobj.id=id;   
			      var headobj = document.getElementsByTagName('head')[0];
			      if(!document.getElementById(id)){
			      	 headobj.appendChild(sobj);   
			      }   
			     
			}
			function path(t){
				var str;
				for(var i=0;i<$("script").length;i++){
					if($("script")[i].src.indexOf("R.calendar.js")>0)
					{
						str=$("script").eq(i).attr("src").replace("R.calendar.js",t);
					}
				}
				return str;
			}
			
			include_css(path("R.calendar.css"),"calendarCss");  
			var lastDate=function(year,month){
				var largeMonth=[0,2,4,6,7,9,11];
				var smallMonth=[3,5,8,10];
				var isLeapYear=function(y){
					return y%4==0&&(y%100!=0||y%400==0);
				}; 
				if(isLeapYear(year)&&month==1){
					return 29;
				}
				else if(!isLeapYear(year)&&month==1){
					return 28;
				}
				for(var i in largeMonth){
					if(largeMonth[i]==month){
						return 31;
					}
				}
				for(var i in smallMonth){
					if(smallMonth[i]==month){
						return 30;  
					}
				}
				
			};
			
			this.each(function(){
				var _this=$(this),nowDay,ryear,rmonth,rday,mark;
				_this.attr("readonly","readonly");
				_this.addClass("rcalendarinput");
				var creatTable=function(a,b,c,bool){
					var html="",day=1,e=1;
					html+="<table cellpadding=\"0\" cellspacing=\"0\">";
						html+="<thead>";
							html+="<tr>";
								html+="<th>一</th>";
								html+="<th>二</th>";
								html+="<th>三</th>";
								html+="<th>四</th>";
								html+="<th>五</th>";
								html+="<th>六</th>";
								html+="<th>日</th>";
							html+="</tr>";
						html+="</thead>";
						html+="<tbody>";
							for(var i=0;i<6;i++){
								html+="<tr>";
								if(i==0){
									for(var j=1,d=c-a+2;j<a,d<=c;j++,d++){
										html+="<td><a href='javascript:void(0)' class='rcalendar_old'>"+d+"</a></td>";
									}
									for(var j=a;j<=7;j++){
										if(bool&&day==nowDay.getDate()){
											html+="<td><a href='javascript:void(0)' class='rcalendar_now active'>"+day+"</a></td>";
										}
										else{
											html+="<td><a href='javascript:void(0)' class='rcalendar_now'>"+day+"</a></td>";
										}
										day++;
									}
								}
								else{
									for(var j=0;j<7;j++){
										if(day>b){
											html+="<td><a href='javascript:void(0)' class='rcalendar_new'>"+e+"</a></td>";
											e++;
										}
										else{
											
											if(bool&&day==nowDay.getDate()){
												html+="<td><a href='javascript:void(0)' class='rcalendar_now active'>"+day+"</a></td>";
											}
											else{
												html+="<td><a href='javascript:void(0)' class='rcalendar_now'>"+day+"</a></td>";
											}
										}
										day++;
									}
									
								}
								html+="</tr>";
							}
	 					html+="</tbody>";
					html+="</table>";
					return html;
				};
				var creatMonth=function(bool,m){
					var html="<table cellpadding=\"0\" cellspacing=\"0\">";
					for(var i=0,k=1;i<3;i++){
						html+="<tr>";
						for(var j=0;j<4;j++,k++){
							if(bool&&m==k){
								html+="<td><a href='javascript:void(0)' class='rcalendar_now active'>"+k+"月 </a></td>";
							}else{
								html+="<td><a href='javascript:void(0)' class='rcalendar_now'>"+k+"月 </a></td>";
							}
						}
						html+="</tr>";
					}
					return html;
				};
				var creatYear=function(startyear,nowyear){
					var start=startyear-1;
					var html="<table cellpadding=\"0\" cellspacing=\"0\">";
					for(var i=0;i<3;i++){
						html+="<tr>";
						for(var j=0;j<4;j++,start++){
							if(j==0&&i==0){
								html+="<td><a href='javascript:void(0)' class='rcalendar_old'>"+start+"</a></td>";
							}
							else if(j==3&&i==2){
								html+="<td><a href='javascript:void(0)' class='rcalendar_old'>"+start+"</a></td>";
							}
							else{
								if(nowyear==start){
									html+="<td><a href='javascript:void(0)' class='rcalendar_now active'>"+start+"</a></td>";
								}else{
									html+="<td><a href='javascript:void(0)' class='rcalendar_now'>"+start+"</a></td>";
								}
							}
						}
						html+="</tr>";
					}
					return html;
				};
				var monthOper={
					add:function(m,y){
					 if((m+1)>11)
					  {m=0;y=y+1;} 
					  else
					  {m=m+1;}
					  return{month:m,year:y}; 
					},
					sub:function(m,y){
					  if ((m-1)<0)
					  {m=11;y=y-1;} 
					  else
					  {m=m-1; }
					  return{month:m,year:y}; 
					}
				};
				var init=function(event){
					var html="",val=$(event).val();
					html+="<div class=\"rcalendar\" id=\"rcalendar\">";
					   html+="<div class='rcalendarDays'>";
						html+="<div class=\"rcalendarSwitch\">";
							html+="<a class=\"rcalendar_prev\" href=\"javascript:void(0)\"><</a>";
							html+="<div class=\"rcalendar_switch\">";
								html+="<a href=\"javascript:void(0)\"></a>";
							html+="</div>";
							html+="<a class=\"rcalendar_next\" href=\"javascript:void(0)\">></a>";
						html+="</div>";
						html+="<div class=\"rcalendarTable\" id='daysTable'></div>";
						html+="</div>";
						html+="<div class='rcalendarMonths' style='display:none'>";
						html+="<div class=\"rcalendarSwitch\">";
							html+="<a class=\"rcalendar_prev\" href=\"javascript:void(0)\"><</a>";
							html+="<div class=\"rcalendar_switch\">";
								html+="<a href=\"javascript:void(0)\"></a>";
							html+="</div>";
							html+="<a class=\"rcalendar_next\" href=\"javascript:void(0)\">></a>";
						html+="</div>";
						html+="<div class=\"rcalendarTable\" id='monthsTable'></div>";
						html+="</div>";
						html+="<div class='rcalendarYears' style='display:none'>";
						html+="<div class=\"rcalendarSwitch\">";
							html+="<a class=\"rcalendar_prev\" href=\"javascript:void(0)\"><</a>";
							html+="<div class=\"rcalendar_switch\">";
								html+="<a href=\"javascript:void(0)\"></a>";
							html+="</div>";
							html+="<a class=\"rcalendar_next\" href=\"javascript:void(0)\">></a>";
						html+="</div>";
						html+="<div class=\"rcalendarTable\" id='yearsTable'></div>";
						html+="</div>";
					html+="</div>";
					if($("#rcalendar").length<1){
						$("body").append($(html));
						position($(event),$(event).offset().left,$(event).offset().top);
						nowDay=(val==""||val==undefined)?new Date():new Date(val); 
						ryear=nowDay.getFullYear();
						rmonth=nowDay.getMonth();
						rday=nowDay.getDate();
						mark=(val==""||val==undefined)?"-":val.substr(4,1);
						calendar(nowDay);
					}
					////////////////////选择日
					$(".rcalendarDays .rcalendar_switch a").text(ryear+"-"+(rmonth+1));
					$(".rcalendarDays .rcalendar_prev").off("click").on("click",function(){
						ryear=monthOper.sub(rmonth,ryear).year;
						rmonth=monthOper.sub(rmonth,ryear).month;
						$(".rcalendarDays .rcalendar_switch a").text(ryear+"-"+(rmonth+1));
						calendar(new Date(ryear,rmonth));
		 			 });
		 			$(".rcalendarDays .rcalendar_next").off("click").on("click",function(){
						ryear=monthOper.add(rmonth,ryear).year;
						rmonth=monthOper.add(rmonth,ryear).month;
						$(".rcalendarDays .rcalendar_switch a").text(ryear+"-"+(rmonth+1));
						calendar(new Date(ryear,rmonth));
		 			 });
		 			 $("#rcalendar").on("click",".rcalendarDays .rcalendar_now",function(){
		 			 	rday=parseInt($(this).text());
		 			 	$(this).addClass("active");
		 			 	_this.val(ryear+mark+(rmonth+1)+mark+rday);
		 			 	close();
		 			 });
		 			 ///////////////////////////////选择月份
		 			 $("#rcalendar").on("click",".rcalendarDays .rcalendar_switch a",function(e){
		 			 	e.stopPropagation();
		 			 	var y=ryear;
		 			 	var m=rmonth;
		 			 	$("#monthsTable").html("").append(creatMonth(true,m+1));
		 			 	$(".rcalendarMonths .rcalendar_switch a").text(ryear);
		 			 	$(".rcalendarMonths").siblings().hide().end().show();
		 			 	//上一年
		 			 	$(".rcalendarMonths .rcalendar_prev").off("click").on("click",function(){
							ryear--;
							var bool=(ryear==y);
							$(".rcalendarMonths .rcalendar_switch a").text(ryear);
							$("#monthsTable").html("").append(creatMonth(bool,m));
			 			 });
			 			 //下一年
			 			$(".rcalendarMonths .rcalendar_next").off("click").on("click",function(){
							ryear++;
							var bool=(ryear==y);
							$(".rcalendarMonths .rcalendar_switch a").text(ryear);
							$("#monthsTable").html("").append(creatMonth(bool,m));
			 			 });
			 			 //点击赋值
			 			 $("#rcalendar").on("click",".rcalendarMonths .rcalendar_now",function(){
			 			 	rmonth=parseInt($(this).text().split("月"))-1;
			 			 	$(this).addClass("active");
			 			 	calendar(new Date(ryear,rmonth));
			 			 	$(".rcalendarDays .rcalendar_switch a").text(ryear+"-"+(rmonth+1));
			 			 	$(".rcalendarDays").siblings().hide().end().show();
			 			 });
		 			 });
		 			  ///////////////////////////////选择年份
		 			 $("#rcalendar").on("click",".rcalendarMonths .rcalendar_switch a",function(e){
		 			 	e.stopPropagation();
		 			 	var y=ryear-ryear%10,nowYear=ryear;
		 			 	$("#yearsTable").html("").append(creatYear(y,ryear));
		 			 	$(".rcalendarYears .rcalendar_switch a").text(y+"-"+(y+9));
		 			 	$(".rcalendarYears").siblings().hide().end().show();
		 			 	//上十年
		 			 	$(".rcalendarYears .rcalendar_prev").off("click").on("click",function(){
							y-=10;
							$(".rcalendarYears .rcalendar_switch a").text(y+"-"+(y+9));
							$("#yearsTable").html("").append(creatYear(y,ryear));
			 			 });
			 			 //下十年
			 			$(".rcalendarYears .rcalendar_next").off("click").on("click",function(){
							y+=10;
							$(".rcalendarYears .rcalendar_switch a").text(y+"-"+(y+9));
							$("#yearsTable").html("").append(creatYear(y,ryear));
			 			 });
			 			 //点击赋值
			 			 $("#rcalendar").on("click",".rcalendarYears .rcalendar_now",function(){
			 			 	ryear=parseInt($(this).text());
			 			 	$(this).addClass("active");
			 			 	var bool=(ryear==nowYear);
			 			 	$("#monthsTable").html("").append(creatMonth(bool,rmonth));
			 			 	$(".rcalendarMonths .rcalendar_switch a").text(ryear);
			 			 	$(".rcalendarMonths").siblings().hide().end().show();
			 			 });
		 			 });
		 			 
		 			 //////////////防冒泡
		 			 $("#rcalendar").on("click",function(e){
		 			 	e.stopPropagation();
		 			 });
				};
				var calendar=function(times){
					var day=0,nowLastDate,prevMonthLastDate,bool=false; 
					var nowdate=new Date(times.getFullYear(),times.getMonth(),1);
					if(nowdate.getDay()==0){day=7;}
					else{day=nowdate.getDay();}
					nowLastDate=lastDate(times.getFullYear(),times.getMonth());
					prevMonthLastDate=lastDate(times.getFullYear(),monthOper.sub(times.getMonth(),times.getFullYear()).month);
				    bool=nowDay.getFullYear()==times.getFullYear()&&nowDay.getMonth()==times.getMonth();
	 				$("#daysTable").html("").append(creatTable(day,nowLastDate,prevMonthLastDate,bool));
				};
				var close=function(){
					$("#rcalendar").remove();
				};
				$(document).on("click",close);
				var position=function(event,left,top){
					$("#rcalendar").css({"left":left+"px","top":(top+$(event).outerHeight()+5)+"px"});
				};
				_this.on("click",function(e){
					e.stopPropagation();
					close();
					init($(this));
				});
			});
 		}
	});
})(jQuery);
    