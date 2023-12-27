$("#print_no_table").hide();

function getData() {
  //declare variable
  let region = $("#region").text().trim();
  let agency_name = $("#agency_name").text().trim();
  let cust_ceo_name = $("#cust_ceo_name").text().trim();
  let cust_address = $("#cust_address").text().trim();
  let company_ceo_name = $("#company_ceo_name").text().trim();
  let last_day = $("#last_day").text().trim();
  let cur_day = $("#cur_date").text().trim();
  let region_agency_name = $("#region_agency_name").text().trim();
  //call ajax
  const data_Send = {};
  data_Send.menucode = "M000000831";
  data_Send.type = "get_data_to_print";
  data_Send.header = JSON.stringify({
    region: region,
    agency_name: agency_name,
  });
  $.ajax({
    type: "post",
    url: "/ajax.do",
    data: data_Send,
    async: false,
    success: function (response, status, request) {
      const { res_b } = JSON.parse(response.trim());
      const { res_d } = JSON.parse(response.trim());
      //Woking with table type D
      $("#type_D").attr("height", `${30 * res_d.length}px`);
      var is_completee = "";
      let total_amount_id_d = 0;

      for (let i = 0; i < res_d.length; i++) {
        let item = res_d[i];

        let remark_class = item.remark || "";
        let account_nm_class = item.account_nm || "";
        let memo_class = item.memo || "";
        let amount_class = item.amount == 0 ? 0 : item.amount || "";
        total_amount_id_d += amount_class;

        let newRow = `
              <tr style=" height: 13px">
                    <td class="remark_class"style="text-align: center;height: 13px">${remark_class}</td>
                    <td class="account_nm_class" style="text-align: center; height: 13px">${account_nm_class}</td>
                    <td class="amount_class" style="text-align: right; height: 13px">${formatNumber(
                      amount_class
                    )}</td>
                    <td class="memo_class" style="text-align: center; height: 13px">${memo_class}</td>
              </tr>
                `;
        is_completee += newRow;
      }
      // Ensure there are at least 8 rows in table type D
      const numEmptyRows_d = Math.max(8 - res_d.length, 0);

      for (let i = 0; i < res_d.length + numEmptyRows_d; i++) {
        let item = res_d[i] || {}; // Use an empty object for non-existing rows

        let newRow = `
              <tr style=" height: 13px">
                    <td class="remark_class"style="text-align: center;height: 13px"></td>
                    <td class="account_nm_class" style="text-align: center; height: 13px"></td>
                    <td class="amount_class" style="text-align: right; height: 13px">0</td>
                    <td class="memo_class" style="text-align: center; height: 13px"></td>
              </tr>
                `;
        is_completee += newRow;
      }

      //Woking with table type D
      $("#type_B").attr("height", `${30 * res_b.length}px`);
      var is_complete = "";
      let total_amount_id_b = 0;

      for (let i = 0; i < res_b.length; i++) {
        let item = res_b[i];

        let remark_class = item.remark || "";
        let account_nm_class = item.account_nm || "";
        let memo_class = item.memo || "";
        let amount_class = item.amount == 0 ? 0 : item.amount || "";

        total_amount_id_b += amount_class;

        let newRow = `
              <tr style=" height: 13px">
                    <td class="remark_class"style="text-align: center;height: 13px">${remark_class}</td>
                    <td class="account_nm_class" style="text-align: center; height: 13px">${account_nm_class}</td>
                    <td class="amount_class" style="text-align: right; height: 13px">${formatNumber(
                      amount_class
                    )}</td>
                    <td class="memo_class" style="text-align: center; height: 13px">${memo_class}</td>
              </tr>
                `;
        is_complete += newRow;
      }
      // Ensure there are at least 8 rows in table type B
      const numEmptyRows = Math.max(8 - res_b.length, 0);

      for (let i = 0; i < res_b.length + numEmptyRows; i++) {
        let item = res_b[i] || {}; // Use an empty object for non-existing rows

        let newRow = `
              <tr style=" height: 13px">
                    <td class="remark_class"style="text-align: center;height: 13px"></td>
                    <td class="account_nm_class" style="text-align: center; height: 13px"></td>
                    <td class="amount_class" style="text-align: right; height: 13px">0</td>
                    <td class="memo_class" style="text-align: center; height: 13px"></td>
              </tr>
                `;
        is_complete += newRow;
      }

      //Done for add row into table
      $("#tr_lv2_d").after(is_completee);
      $("#tr_lv2_b").after(is_complete);

      //Put data into table
      $("#company_ceo_name_id").text(
        "얀마농기코리아㈜ 대표 이사 귀하(대표:" + company_ceo_name + ")"
      );
      $("#last_day_id").text(
        last_day + "현재 다음 내용과 같이 채권•채무 사실이 있음을 확인 합니다. "
      );
      $("#cur_day_id").text(cur_day);
      $("#cust_address_id").text(cust_address);
      $("#agency_name_id").text(
        region_agency_name +
          " 대리점 대표 " +
          cust_ceo_name +
          "은 귀사와 계약을 체결 후 거래를 하면서"
      );
      $("#agency_name_id_last").text(agency_name + " 대리점");
      $("#cust_ceo_name_last").text(cust_ceo_name);
      $("#total_amount_d").text(formatNumber(total_amount_id_d));
      $("#total_amount_b").text(formatNumber(total_amount_id_b));
      $("#grand_total_d").text(formatNumber(total_amount_id_d));
      $("#grand_total_b").text(formatNumber(total_amount_id_b));
      $("#grand_total_last").text(
        formatNumber(total_amount_id_d - total_amount_id_b)
      );
    },
    error: function (xhr, status, error) {
      console.log("Error occurred in AJAX request:");
      console.log("Status: " + status);
      console.log("Error: " + error);
      console.log(xhr.responseText);
    },
  });
}
getData();

//format number
function formatNumber(number) {
  // convert to string
  let numStr = number.toString();

  // find where is .
  let decimalIndex = numStr.indexOf(".");

  // is not found ., move last position
  if (decimalIndex === -1) {
    decimalIndex = numStr.length;
  }

  // loop from last to begin and insert ',' after 3 numbers
  for (let i = decimalIndex - 3; i > 0; i -= 3) {
    numStr = numStr.slice(0, i) + "," + numStr.slice(i);
  }

  // return result
  return numStr;
}

function getNum(val) {
  if (isNaN(val)) {
    return 0;
  }
  return val;
}
