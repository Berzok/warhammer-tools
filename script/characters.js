$(function(){
  $.get('/users', function(users) {
    users.forEach(function(user) {
      $('<li></li>').text(user[0] + " " + user[1]).appendTo('ul#users');
    });
  });
})