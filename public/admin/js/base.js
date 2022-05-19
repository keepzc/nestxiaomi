$(function () {
  app.init();
});

var app = {
  init: function () {
    this.slideToggle();
    this.confirmDelete();
  },
  resizeIfream: function () {
    //1. 获取浏览器的高度
    //2. 设置iframe高度
    $('#rightMain').height($(window).height() - 80);
  },
  slideToggle: function () {
    $('.aside h4').click(function () {
      $(this).siblings('ul').slideToggle();
    });
  },
  //提示是否删除
  confirmDelete() {
    $('.delete').click(function () {
      var flag = confirm('您确定要删除么');
      return flag;
    });
  },
};

window.onresize = function () {
  app.resizeIfream();
};
