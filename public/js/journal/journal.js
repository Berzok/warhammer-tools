

$('li').each(this, function(){
    this.on('click', function(){
        console.log('aaa');
        smoothTransition(this.attr('name'));
    });
    console.log('aaaa');
    console.dir((this).getFirstNode().attr('style', 'cursor: pointer'));
});


function smoothTransition(categorie){
    switch(categorie){
        case 'calendrier': createCalendar(function(){
            calendarCallback();
        });
        case 'synopsis': createSynopsis();
        case 'map': createMap();
    }

}

function createCalendar(calendarCallback){

    $('#informations_page').html("<iframe id='calendrier' src='https://fantasy-calendar.com/calendar?action=view&id=b3298f3654f3fc03fd94e2ddd4847877'></iframe>");



    $('#informations_page').css('height', '4200px');


    $('.containerGlobal').css('width', '90%');
    $('.fieldset').css('height', '4200px');
    $('.containerGlobal').css('height', '3800px');
    /*
    $.get(`${'https://cors-anywhere.herokuapp.com/'}https://fantasy-calendar.com/calendar?action=view&id=b3298f3654f3fc03fd94e2ddd4847877`)
        .then(res => {
            $('#informations_page').html($(res).find('#generator_container').html());
        })

    /*
    $.get({
        url: 'https://fantasy-calendar.com/calendar?action=view&id=b3298f3654f3fc03fd94e2ddd4847877',
        crossDomain: true,
        withCredentials: false,
        success: function(data){
            console.log(data);

        }
    });*/
    setTimeout(function(){
        calendarCallback();
    }, 4000);
}


function calendarCallback(){
    var calendrier = $('#calendrier');
    var calendar = calendrier.contents().find('#calendar_container');
    console.log(calendar);
}


function createSynopsis(){
    return;
}

function createMap(){
    return;
}