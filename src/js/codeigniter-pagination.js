(function($) {
  if (typeof $ === "undefined") {
    throwError("Pagination requires jQuery.");
  }

  var CI_Pagination = function(options) {
    var context = $(this);

    context.settings = $.extend(
      {
        pClass: "float-right mt-2",
        sClass: "search-form search-form--light mb-3",
        siClass: "form-control search",
        sbClass: "btn"
      },
      options
    );

    context.namespace = context.attr("id");
    context.baseURL = context.settings.baseURL + "/";
    context.numrow = $("#" + context.namespace + " thead tr th").length;
    context.thead = $("#" + context.namespace + " thead");
    context.tbody = $("#" + context.namespace + " tbody");

    context.loading = $("<tr/>").append(
      $("<td/>", { text: "Loading...", colspan: context.numrow })
    );

    if (!context.settings.baseURL)
      return alert("CI_Pagination is error. Option baseURL not Found!");

    // Create button pagination.
    context.pBtn = $("<div/>", {
      id: context.namespace + "-pagination",
      class: context.settings.pClass
    })
      .appendTo($(this).parent())
      .on("click", "a", function(e) {
        e.preventDefault();
        var page = $(this).attr("data-ci-pagination-page");
        context._paginate(page, "?s=" + context.sInput.val());
      });

    // Create search input pagination.
    context.sInput = $("<input/>", {
      class: context.settings.siClass,
      type: "text",
      placeholder: "Pencarian"
    }).on("keypress", function(e) {
      context._paginate(0, "?s=" + this.value);
    });

    // Create search button pagination.
    context.sBtn = $("<button/>", {
      class: context.settings.sbClass,
      type: "button"
    })
      .append($("<i/>", { class: "material-icons", html: "search" }))
      .click(function() {
        context._paginate(0, "?s=" + context.sInput.val());
      });

    // Create search pagination.
    $("<div/>", {
      id: context.namespace + "-search",
      class: context.settings.sClass
    })
      .append(context.sInput)
      .append(context.sBtn)
      .prependTo($(this).parent());

    context._paginate = function(page, search = "") {
      context.loading.appendTo(context.tbody);
      return $.ajax({
        url: context.baseURL + page + search,
        type: "GET",
        async: context.settings.async ?? "true",
        dataType: "json",
        success: function(response) {
          context.pBtn.html(response.pagination);
          context._table(response.pagination_data, response.pagination_row);
        },
        error: function(e) {
          alert("Something wrong!");
        }
      }).responseJSON;
    };

    context._table = function(response, num) {
      context.num = Number(num);
      context.tbody.empty();
      if (response.length == 0)
        context.tbody.append(
          $("<tr/>").append(
            $("<td/>", { colspan: context.numrow, text: "No data available." })
          )
        );

      response.forEach(function(item) {
        tr = $("<tr/>");

        for (rows in context.settings.columns ?? item) {
          tdText =
            item[
              context.settings.columns
                ? context.settings.columns[rows].data
                : rows
            ];

          if (context.settings.columns[rows].render) {
            tdText = context.settings.columns[rows].render(item, num);
          }

          td = $("<td/>", {
            html: tdText,
            class: context.settings.columns[rows].class
          }).appendTo(tr);
        }
        num++;
        context.tbody.append(tr);
      });
    };

    context._paginate(0);
    return context;
  };

  $.fn.Pagination = CI_Pagination;
})(jQuery);
