(function ($) {
  var app = {
    init: function () {
      this.initCheckBox();
      this.changeCartNum();
      this.isCheckedAll();
      this.deleteConfirm();
    },
    deleteConfirm: function () {
      $('.delete').click(function () {
        var flag = confirm('您确定要删除吗?');
        return flag;
      });
    },
    initCheckBox() {
      $('#checkAll').click(function () {
        if (this.checked) {
          $(':checkbox').prop('checked', true);
          $.get(
            '/cart/changeAllCart?type=1',
            function (response) {
              if (response.success) {
                $('#allPrice').html(response.allPrice + '元');
                $(this)
                  .parent()
                  .parent()
                  .parent()
                  .parent()
                  .parent()
                  .siblings('.jiesuandan')
                  .find('.allchecknum')[0].innerText = response.allCheckNum;
              }
            }.bind(this),
          );
        } else {
          $(':checkbox').prop('checked', false);
          $.get(
            '/cart/changeAllCart?type=0',
            function (response) {
              if (response.success) {
                $('#allPrice').html(response.allPrice + '元');
                $(this)
                  .parent()
                  .parent()
                  .parent()
                  .parent()
                  .parent()
                  .siblings('.jiesuandan')
                  .find('.allchecknum')[0].innerText = response.allCheckNum;
              }
            }.bind(this),
          );
        }
      });
      var _that = this;
      $('.cart_list input:checkbox').click(function () {
        _that.isCheckedAll();
        //改变当前商品的状态
        var goods_id = $(this).attr('goods_id');
        var color = $(this).attr('color');
        $.get(
          '/cart/changeOneCart?goods_id=' + goods_id + '&color=' + color,
          function (response) {
            if (response.success) {
              $('#allPrice').html(response.allPrice + '元');
              $(this)
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .siblings('.jiesuandan')
                .find('.allchecknum')[0].innerText = response.allCheckNum;
            }
          }.bind(this),
        );
      });
    },
    //判断全选是否选择
    isCheckedAll() {
      var chknum = $('.cart_list input:checkbox').size(); //checkbox总个数
      var chk = 0; //checkbox checked=true总个数
      $('.cart_list input:checkbox').each(function () {
        if ($(this).prop('checked') == true) {
          chk++;
        }
      });
      if (chknum == chk) {
        //全选
        $('#checkAll').prop('checked', true);
      } else {
        //不全选
        $('#checkAll').prop('checked', false);
      }
    },
    changeCartNum() {
      $('.decCart').click(function () {
        var goods_id = $(this).attr('goods_id');
        var color = $(this).attr('color');
        $.get(
          '/cart/decCart?goods_id=' + goods_id + '&color=' + color,
          function (response) {
            if (response.success) {
              $('#allPrice').html(response.allPrice + '元');
              $(this).siblings('.input_center').find('input').val(response.num);
              $(this)
                .parent()
                .parent()
                .siblings('.totalPrice')
                .html(response.totalPrice);

              $(this)
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .siblings('.jiesuandan')
                .find('.allchecknum')[0].innerText = response.allCheckNum;
            }
          }.bind(this),
        );
      });

      $('.incCart').click(function () {
        var goods_id = $(this).attr('goods_id');
        var color = $(this).attr('color');
        $.get(
          '/cart/incCart?goods_id=' + goods_id + '&color=' + color,
          function (response) {
            if (response.success) {
              $('#allPrice').html(response.allPrice + '元');
              $(this).siblings('.input_center').find('input').val(response.num);
              $(this)
                .parent()
                .parent()
                .siblings('.totalPrice')
                .html(response.totalPrice);
              $(this)
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .siblings('.jiesuandan')
                .find('.allchecknum')[0].innerText = response.allCheckNum;
            }
          }.bind(this),
        );
      });
    },
  };

  $(function () {
    app.init();
  });
})($);
