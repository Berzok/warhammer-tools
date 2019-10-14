$(function() {
    //Datepicker de jQuery UI
    $("#datepicker").datepicker({
        altField: '',
        buttonImage: '/img/calendar.gif',
        buttonImageOnly: true,
        dateFormat: 'yy-mm-dd',
        dayNames: '["Wellentag", "Aubentag", "Marktag", "Backertag", "Bezahltag", "Konistag", "Angestag", "Festag"]',
        dayNamesMin: ['We', 'Au', 'Ma', 'Ba', 'Be', 'Ko', 'An', 'Fe'],
        showOn: "both",
    });

    // Maj de la liste des applications au changement de client
    $("select[name = 'client']").on("change", function() {
        $.ajax({
            type: 'POST',
            url: SteamHelper.getUrl("/application/fillSelect"),
            data: {
                idClient: $(this).val()
            },
            success: function(retour) {
                $("select[name = 'application']").html(retour);
            }
        });
    });

    var cursor = [0,0]; // On ne veut pas ouvrir la page d'édition lors d'un drag de la souris pour selectionner du texte
    $("#commandes").on("mousedown", "tr", function(event) {
        if(event.which !== 1) return;
        cursor = [event.pageX, event.pageY];
    });
    $("#commandes").on("mouseup", "tr", function(event) {
        if(event.which !== 1) return;

        var distance = Math.sqrt( Math.pow(event.pageX - cursor[0], 2) + Math.pow(event.pageY - cursor[1], 2) );
        if(distance < 4) {
            tr = event.currentTarget;
            $button = $(tr).find('a.icon-edit');
            if ($button[0] !== undefined) $button[0].click();
        }
    });
});