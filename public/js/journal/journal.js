



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


function createSynopsis(){
    return;
}

function createMap(){
    return;
}


$(document).ready(function(){
    $('#calendarButton').on('click', function(){
        window.location.replace('/view/calendrier.html');
    });
});




