"use strict";
$(function(){
  function getErrBox($container){
    var $box = $container.find(".error");
    if( ! $box.length){
      $box = $("<div class='error'></div>").appendTo($container);
    }
    return $box;
  }


  $("body").on("click", ".json-logic-example .apply", function(event){
    var $this = $(event.target),
      $example = $this.closest(".json-logic-example"),
      $logic_error = getErrBox( $example.find(".logic") ),
      $data_error = getErrBox( $example.find(".data") ),
      $result = $example.find(".result textarea"),
      $result_error = getErrBox( $example.find(".result") ),
      logic, data, result;

    $result.text("");

    //Logic
    try{
      logic = JSON.parse($example.find(".logic textarea").val());
      $logic_error.hide();
    }catch(exception){
      $logic_error.text(exception.message).show();
      return;
    }

    //Data
    try{
      data = JSON.parse($example.find(".data textarea").val());
      $data_error.hide();
    }catch(exception){
      $data_error.text(exception.message).show();
      return;
    }

    //Result
    try{
      result = jsonLogic.apply(logic, data);
      $result
        .val( JSON.stringify(result, null, 2) )
        .removeClass("bam")
        .trigger("input"); //Notify autosize
      $result_error.hide();
      setTimeout(function(){
        $result.addClass("bam");
      }, 1)
    }catch(exception){
      $result_error.text(exception.message).show();
    }

  });

  $(".json-logic-example .apply").click(); //Run em all on page ready

  //Dynamically resize all the text areas
  $(".json-logic-example textarea").each(function () {
    this.style.height = this.scrollHeight + "px";
    this.style.overflowY = "hidden";
  }).on("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  $("body").on("click", ".json-logic-example .turn", function(event){
    $(event.target).closest(".json-logic-example")
      .toggleClass("horizontal")
      .find("textarea").trigger("input");
  });


  $(".json-logic-example").each(function(){
    //Some items *become* multi-line when forced horiz. So set everyone horiz, then undo those that don't make sense.
    var $example = $(this).addClass("horizontal");

    //Are any text areas multi-line?
    var $multiline = $example.find("textarea")
      .trigger("input") //Notify autosize
      .filter(function(){
        //Right this second, a single is 22px, give me some headroom to restyle
        return $(this).height() > 30;
      });

    if($multiline.length){
      $example.removeClass("horizontal");
      $example.find("textarea").trigger("input");
    }
  });
});
