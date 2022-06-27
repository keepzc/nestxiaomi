(function ($) {
  var app = {
    init: function () {
      this.addAddress();
      this.changeDefaultAddress();
      this.editAddress();
      this.doEditAddress();
      this.onSubmit();
    },
    //选择一个地址默认地址
    changeDefaultAddress: function () {
      //注意这里绑定事件需要用事件委托
      $('#addressList ').on('click', '.J_addressItem', function () {
        console.log(this, '----');
        $(this).addClass('selected').siblings().removeClass('selected');

        var id = $(this).attr('data-id');

        $.get(
          '/user/address/changeDefaultAddress?id=' + id,
          function (response) {
            if (response.success) {
              toastr.warning(response.msg);
            } else {
              toastr.error('操作失败');
            }
          },
        );
      });
    },
    //提交订单验证是否有收货地址
    onSubmit: function () {
      //防止重复提交
      var flag = true;
      $('#checkoutForm').submit(function () {
        if (flag) {
          flag = false;
          var addressCount = $('#addressList .address-item.selected').length;
          if (addressCount > 0) {
            return true;
          }
          toastr.warning('请设置,并选择收货地址');
          return false;
        }
        return false;
      });
    },
    //弹出编辑框
    editAddress: function () {
      $('.modify').click(function (e) {
        $('#editModal').modal('show');
        var id = $(this).parent().attr('data-id');
        //阻止事件冒泡
        e.stopPropagation();
        $.get('/user/address/getOneAddressList?id=' + id, function (response) {
          if (response.success) {
            var addressInfo = response.result;
            $('#edit_id').val(addressInfo._id);
            $('#edit_name').val(addressInfo.name);
            $('#edit_phone').val(addressInfo.phone);
            $('#edit_address').val(addressInfo.address);
            $('#edit_zipcode').val(addressInfo.zipcode);
          }
        });
      });
    },
    //编辑地址操作
    doEditAddress: function () {
      $('#doEditAddress').click(function () {
        var id = $('#edit_id').val();
        var name = $('#edit_name').val();
        var phone = $('#edit_phone').val();
        var address = $('#edit_address').val();
        var zipcode = $('#edit_zipcode').val();

        $.post(
          '/user/address/doEditAddressList',
          {
            id: id,
            name: name,
            phone: phone,
            address: address,
            zipcode: zipcode,
          },
          function (response) {
            var str = '';
            if (response.success == true) {
              var addressList = response.result;
              for (var i = 0; i < addressList.length; i++) {
                if (addressList[i].default_address) {
                  str +=
                    '<div class="address-item J_addressItem selected" data-id="' +
                    addressList[i]._id +
                    '" data-name="' +
                    addressList[i].name +
                    '" data-phone="' +
                    addressList[i].phone +
                    '" data-address="' +
                    addressList[i].address +
                    '" > ';
                  str += '<dl>';
                  str +=
                    '<dt> <em class="uname">' +
                    addressList[i].name +
                    '</em> </dt>';
                  str += '<dd class="utel">' + addressList[i].phone + '</dd>';
                  str +=
                    '<dd class="uaddress">' + addressList[i].address + '</dd>';
                  str += '</dl>';
                  str += '<div class="actions">';
                  str +=
                    '<a href="javascript:void(0);" data-id="' +
                    addressList[i]._id +
                    '" class="modify addressModify">修改</a>';
                  str += '</div>';
                  str += '</div>';
                } else {
                  str +=
                    '<div class="address-item J_addressItem" data-id="' +
                    addressList[i]._id +
                    '" data-name="' +
                    addressList[i].name +
                    '" data-phone="' +
                    addressList[i].phone +
                    '" data-address="' +
                    addressList[i].address +
                    '" > ';
                  str += '<dl>';
                  str +=
                    '<dt> <em class="uname">' +
                    addressList[i].name +
                    '</em> </dt>';
                  str += '<dd class="utel">' + addressList[i].phone + '</dd>';
                  str +=
                    '<dd class="uaddress">' + addressList[i].address + '</dd>';
                  str += '</dl>';
                  str += '<div class="actions">';
                  str +=
                    '<a href="javascript:void(0);" data-id="' +
                    addressList[i]._id +
                    '" class="modify addressModify">修改</a>';
                  str += '</div>';
                  str += '</div>';
                }
              }
              //增加
              $('#addressList').html(str);
              $(function () {
                app.init();
              });
              toastr.success(response.msg);
            } else {
              toastr.error('修改失败');
            }
            $('#editModal').modal('hide');
          },
        );
      });
    },
    //新增地址
    addAddress: function () {
      $('#addAddress').click(function () {
        var name = $('#add_name').val();
        var phone = $('#add_phone').val();
        var address = $('#add_address').val();
        var zipcode = $('#add_zipcode').val();
        if (name == '' || phone == '' || address == '') {
          toastr.warning('格式不正确');
          return false;
        }
        var reg = /^[\d]{11}$/;
        if (!reg.test(phone)) {
          toastr.warning('手机号输入错误');
          return false;
        }
        $.post(
          '/user/address/addAddress',
          { name: name, phone: phone, address: address, zipcode: zipcode },
          function (response) {
            console.log(response);
            // if(response.success){
            // 	location.href="/buy/checkout"
            // }
            var str = '';
            if (response.success == true) {
              var addressList = response.result;
              for (var i = 0; i < addressList.length; i++) {
                if (addressList[i].default_address) {
                  str +=
                    '<div class="address-item J_addressItem selected" data-id="' +
                    addressList[i]._id +
                    '" data-name="' +
                    addressList[i].name +
                    '" data-phone="' +
                    addressList[i].phone +
                    '" data-address="' +
                    addressList[i].address +
                    '" > ';
                  str += '<dl>';
                  str +=
                    '<dt> <em class="uname">' +
                    addressList[i].name +
                    '</em> </dt>';
                  str += '<dd class="utel">' + addressList[i].phone + '</dd>';
                  str +=
                    '<dd class="uaddress">' + addressList[i].address + '</dd>';
                  str += '</dl>';

                  str += '<div class="actions">';
                  str +=
                    '<a href="javascript:void(0);" data-id="' +
                    addressList[i]._id +
                    '" class="modify addressModify">修改</a>';
                  str += '</div>';
                  str += '</div>';
                } else {
                  str +=
                    '<div class="address-item J_addressItem" data-id="' +
                    addressList[i]._id +
                    '" data-name="' +
                    addressList[i].name +
                    '" data-phone="' +
                    addressList[i].phone +
                    '" data-address="' +
                    addressList[i].address +
                    '" > ';
                  str += '<dl>';
                  str +=
                    '<dt> <em class="uname">' +
                    addressList[i].name +
                    '</em> </dt>';
                  str += '<dd class="utel">' + addressList[i].phone + '</dd>';
                  str +=
                    '<dd class="uaddress">' + addressList[i].address + '</dd>';
                  str += '</dl>';
                  str += '<div class="actions">';
                  str +=
                    '<a href="javascript:void(0);" data-id="' +
                    addressList[i]._id +
                    '" class="modify addressModify">修改</a>';
                  str += '</div>';
                  str += '</div>';
                }
              }
              //增加
              $('#addressList').html(str);
              toastr.success(response.msg);
            } else {
              toastr.error('增加失败');
            }
            $('#addModal').modal('hide');
          },
        );
      });
    },
  };
  $(function () {
    app.init();
  });
})($);
