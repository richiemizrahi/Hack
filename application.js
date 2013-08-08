$(document).ready(function(){
  //On load it makes a call to Instagram for the to 16 photos
  $.ajax({
    type: "GET",
    url: "https://api.instagram.com/v1/media/popular",
    data: {'client_id':'e0eb0bea7bf144aebfb2fb7dedb1cce1'},
    dataType: "jsonp",
    beforeSend: function(){$('ul').addClass('is-loading');},
    complete: function(){$('ul').removeClass('is-loading');},    
  }).done(function(data){
    console.log(data);
    for(i=0;i<data.data.length;i++){
      var img = data.data[i].images.low_resolution.url;
      var link = data.data[i].link;
      $('ul').append("<li><a href='"+link+"'><img src='"+img+"'></a></li>");
    }
  });


  var killScroll = false;
  var max = '';
  var url = 'https://api.instagram.com/v1/media/popular';
  
  //Loads more pics by sending max_tag_id, when the user scrolls to the bottom
  $(window).scroll(function(){
     if  ($(window).scrollTop()+200 >= ($(document).height() - ($(window).height()))){
       if (killScroll == false) {
        killScroll = true;
        $.ajax({
          type: "GET",
          url: url,
          data: {'client_id':'e0eb0bea7bf144aebfb2fb7dedb1cce1','max_tag_id':max},
          dataType: "jsonp",
          beforeSend: function(){$('ul').addClass('is-loading');},
          complete: function(){$('ul').removeClass('is-loading');},    
        }).done(function(data){
        console.log(data);
          for(i=0;i<data.data.length;i++){
            var img = data.data[i].images.low_resolution.url;
            var link = data.data[i].link;
            $('ul').append("<li><a href='"+link+"'><img src='"+img+"'></a></li>");
          }
          killScroll = false;
          if(url != 'https://api.instagram.com/v1/media/popular')
            max = data.pagination.next_max_tag_id;
            test(data);
        });
      }
    }
  });

//When someone enters a search it calls the search function
  $("#search").keydown(function(enter){
        if(enter.keyCode == 13){
          search();
        }
      });

  function test(data){
    if(data.data.length == 0){
      $('li').remove();
      $('ul').removeClass('.is-loading');
      $('ul').append("<li class='no-pics'>No Pictures Were Found</li>");
    }
  }

  //set the search to a variable and makes a call to
  //Instagram to search for the variable
  function search(){
    var item = $("#search").val();
    var blankRE =  /^[\s]*$/;
    max = '';
    url = "https://api.instagram.com/v1/tags/"+item+"/media/recent";
    console.log(item);
    if(item == '' || blankRE.test(item))
    {
      alert('You didn\'t enter anything!');
    }
     else{
      $('li').remove();
      $.ajax({
        type: "GET",
        url: url,
        data: {'client_id':'e0eb0bea7bf144aebfb2fb7dedb1cce1','max_tag_id':max},
        dataType: "jsonp",
        beforeSend: function(){$('ul').addClass('is-loading');},
        complete: function(){$('ul').removeClass('is-loading');},    
      }).done(function(data){
      //console.log(data);
        for(i=0;i<data.data.length;i++){
          var img = data.data[i].images.low_resolution.url;
          var link = data.data[i].link;
          $('ul').append("<li><a href='"+link+"'><img src='"+img+"'></a></li>");
        }
        max = data.pagination.next_max_tag_id;
        test(data);
      });
    }
  }
});
