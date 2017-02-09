var $form = $("#ajax-form");

$form.submit(function(event) {
  event.preventDefault();
  var name = $form.find("[name='name']").val();
  var price = $form.find("[price='price']").val();
  console.log("poop");
  $.post("addIngred", {
    name: name,
    price: price,
  })
    .done(function(burg) {
      var div = $('div').first().clone();
      div.attr('id',burg._id);
      div.children()[0].value = burg.name;
      div.children()[1].value = burg.price.toString();
      div.children()[2].id = burg._id;
      div.children()[4].id = burg._id;
      $('#ingredientInvent').append(div);
    });
});

$(".form-stock").submit(function(event){
  event.preventDefault();
  var div = $(this).parent();
  div.hide();
  $.post('noIngred',{
    id: div.attr('id'),
  }).done(function(burg){});
})

$(".form-edit").submit(function(event){
  event.preventDefault();
  var div = $(this).parent();
  var newName = div.children()[0].value;
  var newPrice = parseInt(div.children()[1].value);
  var id = div.attr('id');
  $.post('editIngred',{
    name: newName,
    price: newPrice,
    id: id
  }).done(function(burg){
    var div = $(this).parent();
    div.children()[0].value = burg.name;
    div.children()[1].value = burg.price.toString();
  });
})
