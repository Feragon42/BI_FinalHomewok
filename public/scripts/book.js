$('#saveClient').on('click', function(evt){
  evt.preventDefault()
  var blanckSpace=false;
  $('.registerForm input').each(function(){
    if($(this).val().trim()===''){
      $('#warning').css('color','red');
      $('#warning').css('font-weight','bold');
      $(".registerForm input").filter(function(){
        return this.value.length == 0;
      }).css('box-shadow', '0px 0px 10px red');
      window.location.href='#';
      blanckSpace=true;
    }
  })
  
  var x = Number(($('#roomCost').val()));
  var y = parseInt($('#gymCost').val(), 10);
  if(!blanckSpace){
    $.ajax({
      type: 'POST',
      data: {
        name: $('#clientName').val(),
        id_document: $('#clientIdType option:selected').text()+'-'+$('#clientIdNumber').val(),
        email: $('#clientEmail').val(),
        origin: $('#clientOrigin').val(),
        profession: $('#clientProfession').val(),
        enterprise: $('#clientEnterprise').val(),
        charge: $('#clientCharge').val(),
        hotel_hq: $('#hotelHQ option:selected').text(),
        room_type: $('#hotelHabType option:selected').text(),
        lodging_days: $('#lodgingDays').val(),
        room_cost: x,
        gym_cost: y,
        restaurant_cost: $('#restaurantCost').val()
      },
      url: '/querys/uploadRegistration',
      dataType: 'json',
      cache: false,
      success: function(data){
        alert(data);
        blankSpaces();
      },
      error: function(data){
        alert('Ha habido un error, vuelve a intentarlo luego')
      }
    })
  }
})

$('#lodgingDays, #hotelHabType').change(function(){
  var roomType = $('#hotelHabType option:selected').text();
  var room = roomType.toString();
  var hours = $('#lodgingDays').val();
  var cost = 0;
  if(room=='Individual'){
    cost = hours * 15000;
  }
  else if(room=='Duo'){
    cost = hours * 21000;
  }
  else if(room=='Familiar'){
    cost = hours * 35000;
  }
  else if(room=='Matrimonial'){
    cost = hours * 29000;
  }
  else if(room=='Presidencial'){
    cost = hours * 43000;
  }
  $('#roomCost').val(cost);
})

$('.checkbox').change(function(){
  if($(this).is(':checked')){
    var service=$(this).attr('value');
    var cost = 0;
    if(service == 'gym'){
      cost=$('#lodgingDays').val()*4500;
    }
    else{
      cost=$('#lodgingDays').val()*9350;
    }
    $('#'+service+'Cost').val(cost);
  }
  else{
    service=$(this).attr('value');
    $('#'+service+'Cost').val(0);
  }
})

function blankSpaces (){
  $('.registerForm input').each(function(){
    $(this).not('.checkbox').val('');
    $('.checkbox').attr('checked', false);
    $('.cost').val(0)
  })
}