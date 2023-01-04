// this script is run on a post-submit of a squarespace form to more easily do things with the form data itself (trigger analytics calls, AJAX, etc.)

const whitespace_replace = /^\s+|\s+\*|\*\s+|\s+$/g;

const getNameFromLabel = (el) => {
  let l = $(el).prev().text();
  if (l) {
    return l.replace(whitespace_replace, "");
  }
};

let fields = [];

$("form").each((el) => {
  //DATE FIELDS
  $("fieldset[id*='date-']", el).each(function () {
    let v = { type: "date" };
    v.name = $(this).find("legend").text().replace(whitespace_replace, "");
    v.date_month = $(this).find("span:contains('MM')").prev().val();
    v.date_day = $(this).find("span:contains('DD')").prev().val();
    v.date_year = $(this).find("span:contains('YYYY')").prev().val();
    v.date = `${v.date_month}/${v.date_day}/${v.date_year}`;
    fields.push(v);
  });
  //PHONE FIELDS
  $("fieldset[id*='phone-']", el).each(function () {
    let v = { type: "phone" };
    v.name = $(this).find("legend").text().replace(whitespace_replace, "");
    const phone_area_code = $(this).find("input[data-title='Areacode']").val();
    const phone_prefix = $(this).find("input[data-title='Prefix']").val();
    const phone_line = $(this).find("input[data-title='Line']").val();
    v.phone = `${phone_area_code}-${phone_prefix}-${phone_line}`;
    fields.push(v);
  });
  //NAME FIELDS
  $("fieldset[id*='name-']", el).each(function () {
    let v = { type: "name" };
    const i_first = $(this).find("input[name='fname']");
    v.first_name = i_first.val();
    const i_last = $(this).find("input[name='fname']");
    v.last_name = i_last.val();
    v.name = `${v.first_name} ${v.last_name}`;
    fields.push(v);
  });
  //RADIO BUTTONS
  $("fieldset[id*='radio-']", el).each(function () {
    let v = { type: "radio" };
    v.name = $(this).find("legend").text().replace(whitespace_replace, "");
    $(this)
      .find("input[type='radio']")
      .each(function () {
        if ($(this).is(":checked")) {
          v.value = $(this).val();
        }
      });
    fields.push(v);
  });
  //EMAIL FIELDS
  $("input[name='email']", el).each(function () {
    let v = { type: "email" };
    v.name = this.name;
    v.value = $(this).val();
    fields.push(v);
  });
  //GENERIC TEXT FIELDS
  $("div[id*='text-'] input", el).each(function () {
    let v = { type: "text" };
    v.name = $(this)
      .parent()
      .find("label.title")
      .text()
      .replace(whitespace_replace, "");
    v.value = $(this).val();
    fields.push(v);
  });
  //GENERIC # FIELDS
  $("div[id*='number-'] input", el).each(function () {
    let v = { type: "number" };
    v.name = $(this)
      .parent()
      .find("label.title")
      .text()
      .replace(whitespace_replace, "");
    v.value = Number($(this).val());
    fields.push(v);
  });
});

window.sq_form_data = {
  fields,
};
console.log("squarespace fields successfully indexed", window.sq_form_data);
