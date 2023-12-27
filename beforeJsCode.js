$("#header-addrow").hide();
$("#header-delrow").hide();
$("#excelupload").hide();

$(`#${itmobj1["user_id_ser"]}`).val($("#UID").val());

$("#search_btn").trigger("click");

$(window).on("resize", function () {
  var height =
    $(".right-content").height() -
    ($(".ui-widget-header").height() + $(".editer-content1").height() + 100);
  grid1.setHeight(height);
});

$("#cust_btn2").on("click", function () {
  const calc_ym_ser = nvl($(`#${itmobj1["calc_ym_ser"]}`).val(), "");
  if (calc_ym_ser == "") {
    msg("[년월] 필수 입력입니다.", null, "N");
    if ($("#msgconfirm").is(":visible")) {
      $("#msgconfirm").dialog("destroy");
    }
    return false;
  }

  grid1.checkAll();

  const checked = grid1.getCheckedRows();
  if (checked.length > 0) {
    let check_flag = true;
    let error_msg = "";
    let bond_debt_status = "";
    for (let i = 0; i < checked.length; i++) {
      bond_debt_status = nvl(checked[i][itmobj1["bond_debt_status"]], "");
      if (bond_debt_status !== "" && bond_debt_status !== "N") {
        error_msg = "미확인 상태만 확인처리가 가능합니다!";
        check_flag = false;
        break;
      }
    }

    if (check_flag) {
      if (confirm("확인처리하시겠습니까?")) {
        let calc_ym = "";
        let agency_cd = "";
        //1건만 가져와서 년월, 대리점코드로 확인처리
        for (let i = 0; i < checked.length; i++) {
          if (
            checked[i][itmobj1["calc_ym"]] !== "" &&
            checked[i][itmobj1["agency_cd"]] !== ""
          ) {
            calc_ym = checked[i][itmobj1["calc_ym"]];
            agency_cd = checked[i][itmobj1["agency_cd"]];
            break;
          }
        }

        var data = {};
        data.type = "cust_btn2";
        data.menucode = $("#menucode").val();
        //data.header = JSON.stringify(header);
        data.calc_ym = calc_ym;
        data.agency_cd = agency_cd;
        data.UID = $("#UID").val();
        //console.log(data)
        $.ajax({
          type: "POST",
          url: "/ajax.do",
          data: data,
          success: function (response, status, request) {
            response = JSON.parse(response.trim());
            msg(response.result, null, "N");
            //처리후 사용자ID가 clear되는 문제가 있어서 추가
            $(`#${itmobj1["user_id_ser"]}`).val($("#UID").val());
            $("#search_btn").trigger("click");
          },
          error: function (xmlHttpRequest, txtStatus, errorThrown) {},
        });
      }
    } else {
      error_msg = "이미 확인하신 상태입니다."; //해당 요청이 처리되거나 취소되었습니다!
      msg(error_msg);
    }
  }
});
$("#cust_btn3").on("click", function () {
  var gd1 = grid1.getCheckedRows();
  //get data for printting
  var dataPost = {};
  dataPost.type = "insert";
  dataPost.menucode = "M000000832";
  dataPost.UID = nvl($("#UID").val(), "");
  dataPost.agency_cd = gd1[0][itmobj1["agency_cd"]];

  $.ajax({
    type: "POST",
    url: "/ajax.do",
    dataType: "json",
    data: dataPost,
    success: function (response, status, request) {
      if (status === "success") {
      }
    },
    error: function (xmlHttpRequest, txtStatus, errorThrown) {},
  });

  $("#print_btn").trigger("click");
});

grid1.on("check", function (event) {
  const value = grid1.getRow(event.rowKey);
  if (value[itmobj1["agency_cd"]]) {
    const rows = grid1.getRows();
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i][itmobj1["agency_cd"]] == value[itmobj1["agency_cd"]] &&
        rows[i][itmobj1["region"]] == value[itmobj1["region"]]
      )
        grid1.check(i);
    }
  }
});

grid1.on("uncheck", function (event) {
  console.log("abc");
  const value = grid1.getRow(event.rowKey);
  if (value[itmobj1["agency_cd"]]) {
    const rows = grid1.getRows();
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i][itmobj1["agency_cd"]] == value[itmobj1["agency_cd"]] &&
        rows[i][itmobj1["region"]] == value[itmobj1["region"]]
      )
        grid1.uncheck(i);
    }
  }
});
