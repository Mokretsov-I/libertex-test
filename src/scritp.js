import $ from "jquery";
import "./index.scss";

$(document).ready(function () {
  let isPercentInvestValue = false;

  $(".custom_input").each(function () {
    $(this)
      .find(":input")
      .on("input", (e) => {
        let value = e.currentTarget.value;
        if ($(e.currentTarget).hasClass("number")) {
          e.currentTarget.value = onlyNumber(e.currentTarget.value);
          value = +e.currentTarget.value.replace(/\D+/g, "");
        }

        if (e.currentTarget?.dataset?.min) {
          let min = +e.currentTarget?.dataset?.min;
          if (
            $(e.currentTarget).hasClass("havePercent") &&
            isPercentInvestValue
          ) {
            min /= 100;
          }
          if (isMinError(value, min)) {
            showInputError(this, isPercentInvestValue);
          } else {
            $(this).removeClass("error");
            $(this).removeClass("error-percent");
          }
        }

        if (e.currentTarget?.dataset?.max) {
          let max = +e.currentTarget?.dataset?.max;
          if (
            $(e.currentTarget).hasClass("havePercent") &&
            isPercentInvestValue
          ) {
            max = 100;
          }
          if (value > max) e.currentTarget.value = max;
        }

        if ($(e.currentTarget).hasClass("total")) {
          if ($(this).hasClass("multi_input")) {
            $(".range-input input").val(value);
          }
          countTotalValue();
        }

        if ($(e.currentTarget).hasClass("required")) {
          if (e.currentTarget.value === "") {
            $(this).addClass("error-empty");
          } else {
            $(this).removeClass("error-empty");
          }
        }
      });
  });

  $(".limitation-block__body input[type=checkbox]").on("change", (e) => {
    $(e.currentTarget)
      .parent()
      .parent()
      .find(".custom_input")
      .toggleClass("disabled");
  });

  $(".limitation-block__toggler").on("click", (e) => {
    $(e.currentTarget).parent().toggleClass("active");
  });

  $(".multiply-block__input").on("click", (e) => {
    $(e.currentTarget).toggleClass("active");
    $(".range-input").toggleClass("active");
  });

  $(".range-input input").on("input", (e) => {
    $(".multiply-block__input").removeClass("error");
    $(".multiply-block__input").removeClass("error-empty");
    $(".multiply-block__input input").val(e.currentTarget.value);
    countTotalValue();
  });

  $(".limitation-block__radio input").on("change", (e) => {
    isPercentInvestValue = e.currentTarget.value === "%";
    $(".invest_icon").each((i, $el) => {
      $($el).text(e.currentTarget.value);
    });
  });

  $(".custom_input.disabled input").focus((e) => {
    if ($(e.currentTarget).parent().hasClass("disabled")) {
      $(e.currentTarget).blur();
    }
  });

  $(".invest-block").on("click", (e) => {
    let $multiplyInput = $(".multiply-block__input");
    if (
      $multiplyInput.has(e.target).length === 0 &&
      !(
        $(e.target).hasClass("range-input") ||
        $(e.target).parent().hasClass("range-input")
      )
    ) {
      $(".range-input").removeClass("active");
      $multiplyInput.removeClass("active");
    }
  });

  $(".custom_checkbox input").on("change", (e) => {
    const $el = $(e.target).parent().parent().find(".custom_input");
    if ($el.hasClass("error-percent") || $el.hasClass("error")) {
      $el.removeClass("error-percent");
      $el.removeClass("error");
      $($el).find("input").val("");
    }
  });
});

function onlyNumber(str) {
  return str.replace(/\D+/g, "").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}

function isMinError(value, min) {
  return value < min;
}

function countTotalValue() {
  const arrForTotal = [];
  $(".total").each((i, $el) => {
    arrForTotal.push(+$($el).val().replace(/\D+/g, ""));
  });
  $(".total_count").text(`$ ${arrForTotal[0] * arrForTotal[1]}`);
}

function showInputError(that, isPercent) {
  $(that).addClass(isPercent ? "error-percent" : "error");
}
