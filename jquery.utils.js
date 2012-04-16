(function($){
	var methods = {
		//debug
		debug : function(el){
			var el = $.trim(el);
			if(typeof console === "undefined") {
			alert(el);
			}
			else{
				console.log(el);
			}
		},
		//modal
		modal: function(scrollFollow,callback){
			var arg = arguments;
			$(this).hide();
			(arg[1].callback.modalLoad) ? arg[1].callback.modalLoad.call() : "";
			var html = $(this).html();
			var maskcss = {
				height: $(document).height(),
				width: $(window).width(),
				"position": "absolute",
				"z-index": "1000",
				top: 0,
				left: 0,
				"display": "none",
				"background-color":"#000"
			};
			
			//html
			$("<div>",{ id:"util-modal-wrap" }).appendTo('body');
			$("<div>", { id:"util-mask"}).appendTo('#util-modal-wrap');
			$("<div>", { id: "util-modal-content"}).appendTo('#util-modal-wrap');

			var contentWidth = Number($(this).width())
			var contentHeight = Number($(this).height());
			var left = parseInt($(window).width()/2);
			var top = parseInt($(window).height()/2);
			var contentcss = {
					'position':'absolute',
					'width': contentWidth,
					'height': contentHeight,
					'top': top,
					'left': left,
					'z-index':'2000',
					'background-color':'#fff'
			};
			var animation = function(type){
				var obj="";
				if(type=="in") {
					obj = {
						width: contentWidth,
						'margin-left': -(contentWidth/2),
						height: contentHeight,
						'margin-top': -(contentHeight/2)
					}
				}
				else {
					obj = { 
						width: 0,
						'margin-left': 0,
						height: 0,
						'margin-top': 0
					}
				}
				return obj;
			}
			if(scrollFollow){
				$(window).on('scroll',function(){
					var marginT = ($(window).height()-contentHeight)/2;
					top = $(window).scrollTop()+ (contentHeight/2+marginT);
					$("#util-modal-content").css({top: top, left:left});
				});
			}
			
			$("#util-mask").css(maskcss).fadeTo('slow',0.5);
			$("#util-modal-content").html(html);
			$("#util-modal-content").css(contentcss).width(0).height(0).animate(animation("in"),500, function(){
				(arg[1].callback.modalOpen) ? arg[1].callback.modalOpen.call() : "";
			});
			$("#util-mask, .modal-close").on('click',function(){
				$("#util-modal-content").css(contentcss).animate(animation("out"),500, function(){ 
					$(this).hide();
					$("#util-mask").fadeOut();
					(arg[1].callback.modalClose) ? arg[1].callback.modalClose.call() : "";
				});
			});
		},
		//video gallery
		videoGallery: function(videoID, stageDimension, autoplay){
			$("<div>", {id: "util-video-gallery"}).appendTo($(this));
			$("<div>", {id: "util-stage"}).appendTo("#util-video-gallery");
			$("<ul>", {id: "util-video-list"}).appendTo("#util-video-gallery");
			for(i in videoID) {
				$("#util-video-list").append("<li id='videoID_"+videoID[i][0]+"'>"+"<div class='util-thumb'>"+videoID[i][1]+"</div>"+"<p class='description'>"+videoID[i][2]+"</p>"+"</li>");
			}
			$("#util-video-list li").on("click",function(){
				$("#util-video-list li").removeClass('current')
				$(this).addClass('current');
				videoID = $(this).attr("id").split("videoID_")[1];
				var iframe = $("<iframe>", {
						width: stageDimension.width, 
						height: stageDimension.height, 
						"src":"http://www.youtube.com/embed/"+videoID+"?wmode=transparent&amp;autoplay="+autoplay,
						"allowfullscreen": "allowfullscreen",
						"frameborder":"0" 
				});
				$("#util-stage").html(iframe);
			});
		},
		//caracter counter
		caracterCounter : function(maxlimit,cntfield){
			var counter = $("<div>", {id: "util-counter"});
			var cntfield = (cntfield) ? cntfield : counter.insertAfter($(this));
			$(this).on("keyup",function(){
				if ($(this).val().length > maxlimit) {
					$(this).val($(this).val().substring(0, maxlimit))
				}else {
					$(cntfield).text(maxlimit - $(this).val().length);
				}
			});
		},
		//number to image counte
		imageCounter : function(str,counterLen,appendCont) {
			str = String(str);
			var str = str.split("");
			var html = "";
			for(i=0; i<(counterLen - str.length); i++) {
				html += "<li><span class='number-0'>0</span></li>";
			}
			for(i in str) {
				html += "<li><span class='number-"+str[i]+"'>"+str[i]+"</span></li>";
			}
			$(appendCont).html(html);
		}
	};
	$.fn.utils = function(method) {
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'O metodo ' +  method + ' nao existe' );
		}
	}
})(jQuery);