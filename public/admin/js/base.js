$(function () {
  app.init();
});

var app = {
  init: function () {
    this.slideToggle();
    this.resizeIframe();

    this.confirmDelete();
  },
  resizeIframe: function () {
    //1、获取浏览器的高度
    //2、设置iframe的高度

    // alert($(window).height());

    $('#rightMain').height($(window).height() - 80);
  },
  slideToggle: function () {
    $('.aside>li:nth-child(1) ul,.aside>li:nth-child(2) ul').hide();
    $('.aside h4').click(function () {
      $(this).siblings('ul').slideToggle();
    });
  },
  // 提示是否删除
  confirmDelete() {
    $('.delete').click(function () {
      var flag = confirm('您确定要删除吗?');
      return flag;
    });
  },
  changeStatus(el, model, fields, id) {
    $.get(
      '/keep/main/changeStatus',
      { id: id, model: model, fields: fields },
      function (data) {
        if (data.success) {
          if (el.src.indexOf('yes') != -1) {
            el.src = '/admin/images/no.gif';
          } else {
            el.src = '/admin/images/yes.gif';
          }
        }
      },
    );
  },
  editNum(el, model, fields, id) {
    /*
		1、获取el里面的值  var val=$(el).html();


		2、创建一个input的dom节点   var input=$("<input value='' />");


		3、把input放在el里面   $(el).html(input);


		4、让input获取焦点  给input赋值    $(input).trigger('focus').val(val);

		5、点击input的时候阻止冒泡 

					$(input).click(function(){

						return false;
					})

		6、鼠标离开的时候给span赋值,并触发ajax请求

			$(input).blur(function(){
					var num=$(this).val();
					$(el).html(num);	
					
					触发ajax请求

			})
		*/

    var val = $(el).html();
    var input = $("<input value='' />");
    $(input).click(function () {
      return false;
    });
    $(el).html(input);
    $(input).trigger('focus').val(val);

    $(input).blur(function () {
      var num = $(this).val();
      $(el).html(num);
      $.get(
        '/keep/main/editNum',
        { id: id, model: model, fields: fields, num: num },
        function (data) {
          console.log(data);
        },
      );
    });
  },
};

window.onresize = function () {
  app.resizeIframe();
};
