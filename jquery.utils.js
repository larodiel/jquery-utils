(function($){
	var methods = {
		//modal
		modal: function(scrollFollow,callback){
			var arg = arguments;
			$(this).hide();
			(callback && arg[1].callback.modalLoad) ? arg[1].callback.modalLoad.call() : "";
			var html = $(this).html();
			//html
			$("<div>",{ id:"util-modal-wrap" }).appendTo('div:first');
			$("<div>", { id: "util-modal-content"}).appendTo('#util-modal-wrap');
			$("#util-modal-wrap").css({ 'position':'absolute', top:0, left:0});

			var contentWidth = Number($(this).width());
			var contentHeight = Number($(this).height());
			var left = parseInt($(window).width()/2);
			var top = parseInt($(window).height()/2);
			var contentcss = {
					'position':'absolute',
					'width': contentWidth,
					'height': contentHeight,
					'top': top,
					'left': left,
					'z-index':'2000'
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
					contentcss = { top: top};
				});
			}
			
			methods._mask("#000");
			$("#util-modal-content").css(contentcss).html(html);
			methods._reposition($("#util-modal-content"));
			$("#util-modal-content").width(0).height(0).animate(animation("in"),300, function(){
				(callback && arg[1].callback.modalOpen) ? arg[1].callback.modalOpen.call() : "";
			});
			$("#util-mask, .modal-close").on('click',function(){
				$("#util-modal-content").css(contentcss).animate(animation("out"),500, function(){ 
					$(this).hide();
					$("#util-mask").fadeOut('slow',function(){
						$("#util-modal-wrap").remove();
						$(this).remove();
					});
					(callback && arg[1].callback.modalClose) ? arg[1].callback.modalClose.call() : "";
				});
			});
		},
		//video gallery
		videoGallery: function(videoID, stageDimension, autoplay){
			var ap = autoplay;
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
			if($("#util-stage").is(":empty")){
				$("#util-video-list li:first").trigger('click');
			}
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
		},
		//select video
		getVideoID : function() {
			var elements = $(this).parent().children().removeClass('current');
			if(!$(this).hasClass('locked')) {
				elements.removeClass('current');
				$(this).addClass('current');
				return  $(this).attr("id").split("videoID_",2)[1];
			}
			else {
				return false;
			}
		},
		//show video
		showVideo : function(videoID,dimensions,autoplay){
			var dimensionsDefault = { width: 560, height: 315};
			var dimensions = $.extend(dimensionsDefault, dimensions);
			autoplay = (autoplay=="undefined" || autoplay==true) ? 1 : 0;
			if(videoID){
				var html = "<object width='"+dimensions.width+"' height='"+dimensions.height+"'>";
				html +=	"<param name='movie' value='http://www.youtube.com/v/"+videoID+"?version=3&amp;playerapiid=ytplayer&amp;enablejsapi=1&amp;autoplay="+autoplay+"'></param>";
				html +=	"<param name='allowFullScreen' value='true' />";
				html +=	"<param name='allowscriptaccess' value='always' />";
				html +=	"<param name='wmode' value='transparent' />";
				html +=	"<embed src='http://www.youtube.com/v/"+videoID+"?version=3&amp;playerapiid=ytplayer&amp;enablejsapi=1&amp;autoplay="+autoplay+"' type='application/x-shockwave-flash' width='"+dimensions.width+"' height='"+dimensions.height+"' allowscriptaccess='always' allowfullscreen='true' wmode='transparent'></embed>";
				html += "</object>";
		
				$(this).html(html);
			}
		},
		//accordion
		accordion: function() {
			var colection = $(this).next();
			colection.hide();
			$(this).on('click',function(e){
				e.preventDefault();
				el = $(this).next();
				($(this).hasClass("open")) ? $(this).removeClass("open") : $(this).removeClass("closed");
				colection.slideUp('fast');
				if(el.is(':hidden')) {
					$(this).addClass("open");
					el.slideDown('fast');
				}
				else {
					$(this).addClass("closed");
					el.slideUp('fast');
				}
				console.log(el)
			});
		},
		
		//Private Methods
		
		//mask
		_mask: function(bgcolor,callback) {
			var mHeight = $(document).height();
			var mWidth = $(window).width();
			var maskcss = {
				height: mHeight ,
				width: mWidth ,
				"position": "absolute",
				"z-index": "1000",
				top: 0,
				left: 0,
				"display": "none",
				"background-color": bgcolor
			};
			$("<div>", { id:"util-mask"}).appendTo('div:first');
			$("#util-mask").css(maskcss).hide().fadeTo('slow',0.5,function(){
				(callback && typeof(callback)=="function") ? callback.call() : "";
			});
			$(window).on('resize',function(e){
				$("#util-mask").height($(document).height());
				$("#util-mask").width($(window).width());
			});
		},
		_reposition : function(el){
			$(window).on('resize',function(e){
				var pLeft = parseInt($(window).width()/2);
				var pTop = parseInt($(window).height()/2);
				el.css({
					left: pLeft,
					top: pTop
				})
			});
		}
	};
	//debug
	$.utils = {
		debug : function(el){
			var el = $.trim(el);
			if(typeof(console) === "undefined") {
				alert(el);
			}
			else{
				console.log(el);
			}
		},
		uAlert : function(okButton, txt, f){
			var f = (f && typeof(f)=="object") ? f : "";
			var html = "<div id='util-alert-wrap' style='display:none'>  <div id='alert-painel'><h1 id='util-alert-title'>"+txt.title+"</h1><h2 id='description'>"+txt.description+"</h2><input type='button' name='ultil-ok' value='"+okButton+"' id='uAlert-ok' /></div>  </div>";
			var left = parseInt($(window).width()/2);
			var top = parseInt($(window).height()/2);
				methods._mask("#ccc",function(){
				$('div:first').append(html);
				top -= $('#util-alert-wrap').height()/2;
				left -= $('#util-alert-wrap').width()/2;
				$('#util-alert-wrap').css({
					'top': top,
					'left': left,
					'position': 'absolute',
					'z-index': '3000',
					'display':'none'
				});
				$("#util-alert-wrap").hide().fadeIn("fast",function(){
					(f && f.callback.onload) ? f.callback.onload() : "";
				});					
				$("#uAlert-ok").on('click',function() {
					$("#util-mask, #util-alert-wrap").fadeOut('fast',function(){
						$("#util-alert-wrap").remove();
						$(this).remove();
						(f && f.callback.onclose) ? f.callback.onclose() : "";
					});
				});
				$("#uAlert-ok").focus().keypress( function(e) {
					if( e.keyCode == 13 || e.keyCode == 27 ) $("#uAlert-ok").trigger('click');
				});
			});		
		}
	}
	$.fn.utils = function(method) {
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'The method ' +  method + " doesn't exist" );
		}
	}
})(jQuery);