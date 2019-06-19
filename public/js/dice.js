
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
                    "<input type='number' name='counter_"+id+"' min='0' max='9' value='1' style='width: 100%; line-height: 28px'>" +
                "</td>" +
            "</tr>" +
            "</table>")
        // row.append("<img class='imageIcon diceIcon' id='Dice"+id+"' src='../img/"+id+".png' style='margin-bottom: 20px'>");
        // row.append("<input type='number' name='counter_"+id+"' disabled>");
    }
    else{
        document.getElementsByName('counter_'+id)[0].stepUp(1);
    }
    $('#set').val($('input[name="counter_'+id+'"]').val() + id);

}




var inventaireBase = $('#inventory').html();
function clearInventory(){
    console.dir(inventaireBase);
    $('#inventory').html(inventaireBase);
}