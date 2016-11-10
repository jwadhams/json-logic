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
      console.log(result);
      $result.text( JSON.stringify(result, null, 4) ).removeClass("bam");
      $result_error.hide();
      setTimeout(function(){
        $result.addClass("bam");
      }, 1)
    }catch(exception){
      $result_error.text(exception.message).show();
    }

  });


  $(".json-logic-example .apply").click(); //Run em all on page ready
  $(".json-logic-example textarea").textareaAutoSize();
});
