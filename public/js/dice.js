
$('.diceIcon').each(function(){
    $(this).attr('onclick', 'addDice(this.id)');
});




function addDice(id){
    console.dir(id);
    var inventaire = $('#inventory');
    inventaire.append("<img class='imageIcon diceIcon' id='"+id+"' src='../img/"+id+".png' style='margin-bottom: 20px'>");
}