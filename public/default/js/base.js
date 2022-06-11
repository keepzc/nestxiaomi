(function ($) {
  var app = {
    init: function () {
      this.initSwiper();

      this.initNavSlide();
      this.initContentTabs();
      this.initColorSelect();
    },
    initSwiper: function () {
      new Swiper('.swiper-container', {
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    },
    initNavSlide: function () {
      $('#nav_list>li').hover(
        function () {
          $(this).find('.children-list-warp').show();
        },
        function () {
          $(this).find('.children-list-warp').hide();
        },
      );
    },
    initContentTabs: function () {
      $('.detail_info .detail_info_item:first').addClass('active');
      $('.detail_list li:first').addClass('active');
      $('.detail_list li').click(function () {
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.detail_info .detail_info_item')
          .removeClass('active')
          .eq(index)
          .addClass('active');
      });
    },
    initColorSelect: function () {
      var _that = this;
      $('#color_list .banben').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        var color_id = $(this).attr('color_id');
        var goods_id = $(this).attr('goods_id');

        $.get(
          '/product/getImagelist?goods_id=' +
            goods_id +
            '&color_id=' +
            color_id,
          function (response) {
            console.log(response);
            var data = response.result;
            if (response.success) {
              //修改左侧的商品图片
              var str = '';
              for (var i = 0; i < data.length; i++) {
                str +=
                  '<div class="swiper-slide"><img src="' +
                  data[i].img_url +
                  '"> </div>';
              }
              $('#swiper-wrapper').html(str);

              _that.initSwiper();
            }
          },
        );
      });
    },
  };

  $(function () {
    app.init();
  });
})($);
