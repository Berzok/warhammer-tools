$('.diceIcon').each(function () {
    $(this).attr('onclick', 'addDice(this.id)');
});


function addDice(id) {
    let counter = $('#inventory'+id).val();
    counter++;
    $('#inventory'+id).val(counter);
    $('#'+id).parent().siblings()[0].children[0].innerText = counter;
    diceInBag[id] += 1;
    if (id == 'd100') {
        diceInBag['d10'] += 1;
    }
    var diceToAdd = '';
    for (let i in diceInBag) {
        diceToAdd += diceInBag[i] + i + ' + ';
    }
    $('#set').val(diceToAdd);
    console.dir($('#set').val());
}


var diceInBag = {'d3': 0, 'd4': 0, 'd6': 0, 'd10': 0, 'd12': 0, 'd20': 0, 'd100': 0};


$('.row.align-items-center').each(function () {
    $(this).on('click', function () {
        addDice(this.children[1].children[0].id);
    })
});


function clearInventory() {
    $('.tableDiceInventory').each(function () {
        this.remove();
    });
    $('#set').val('');
    diceInBag = {'d3': 0, 'd4': 0, 'd6': 0, 'd10': 0, 'd12': 0, 'd20': 0, 'd100': 0};
}