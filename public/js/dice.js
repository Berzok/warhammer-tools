
$('.diceIcon').each(function(){
    $(this).attr('onclick', 'addDice(this.id)');
});




function addDice(id){
    var inventaire = $('#inventory');
    if(!($('input[name="counter_'+id+'"]').length)){
        let row = $('#inventory'+id);
        row.append("<table class='tableDiceInventory'>" +
            "<tr>" +
                "<td>" +
                    "<img class='imageIcon diceIcon' id='Dice"+id+"' src='../img/"+id+".png' style='width: 100%'>" +
                "</td>" +
                "<td>" +
                    "<input type='number' class='diceCount' name='counter_"+id+"' min='0' max='9' value='1' step='1' style='width: 100%; line-height: 28px'>" +
                "</td>" +
            "</tr>" +
            "</table>")
    }
    else{
        document.getElementsByName('counter_'+id)[0].stepUp(1);
    }
    console.dir('Avant: ' + $('#set').val());
    var diceToAdd = '';
    $('#set').val($('#set').val() + $('input[name="counter_'+id+'"]').val() + id + ' + ');
    if(id == 'd100'){
        $('#set').val($('#set').val()+'d10 + ');
    }
    console.dir('Après: ' + $('#set').val());
}




var inventaireBase = $('#inventory').html();
function clearInventory(){
    $('.diceCount').each(function(){
        this.value = 0;
    });
    $('#set').val('');
}