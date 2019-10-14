
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
            "</table>");
        diceInBag[id] += 1;
    }
    else{
        diceInBag[id] += 1;
        document.getElementsByName('counter_'+id)[0].stepUp(1);
    }
    if(id == 'd100'){
        diceInBag['d10'] += 1;
    }
    var diceToAdd = '';
    for(let i in diceInBag){
        diceToAdd += diceInBag[i] + i + ' + ';
    }
    $('#set').val(diceToAdd);
    console.dir($('#set').val());
}




var diceInBag = {'d3': 0, 'd4': 0, 'd6': 0, 'd10': 0, 'd12': 0, 'd20': 0, 'd100': 0 };



function clearInventory(){
    $('.tableDiceInventory').each(function(){
        this.remove();
    });
    $('#set').val('');
    diceInBag = {'d3': 0, 'd4': 0, 'd6': 0, 'd10': 0, 'd12': 0, 'd20': 0, 'd100': 0 };
}