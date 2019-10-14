(function() {

    var Cra = function Cra($container) {

        var ms = ["","Nachexen", "Jarhdrung.", "Pflugzeit", "Sigmarzeit", "Sommerzeit", "Vorgeheim", "Nachgeheim", "Erntezeit", "Brauzeit", "Kaldezeit", "Ulriczeit", "Vorhexen"];
        this.$container = $container;
        this.currentYear = null;
        this.currentMonth = null;
        this.now = null;
        this.$table = null;
        this.days = null;
        this.nbdays = null;
        this.today = 0;
        this.gin = false;
        this.dirty = false;
        this.validation = false;
        this.currentUser = this.$container.data("current-user");
        this.canValidate = this.$container.data("can-validate") ? true : false;
        this.getLoadParams = async function() {
            let data2;
            var self = this;
            data2 = $.getJSON('/res/yearStructure.json', data2, function(data, text, jqXHR){
                data2 = jqXHR.responseText;
                data2 = JSON.parse(data2);
                return this.yearStructure;
            }).then(function(){
                return {
                    annee: self.currentYear
                    ,mois: self.currentMonth
                    ,_: $.now() // IE est une grosse roulure sur les GET et sa gestion du cache
                };
            });
        };

        this.getAnnee = function() {
            return this.$container.data("annee");
        };

        this.getMois = function() {
            return this.$container.data("mois");
        };

        this.getAnneeMoisString = function() {
            var annee = this.getAnnee();
            var mois = this.getMois();

            return ms[mois] + " " + annee;
        };

        this.getSlashDate = function(){
            let annee = this.currentYear;
            let mois = this.currentMonth;
            let jour = this.currentDay;
            return jour + '-' + mois + '-' + annee;
        };

        this.getDowClass = function(day) {
            return "dow" + (this.days[day] ? "" : " disabled") + (this.today === day ? " today" : "");
        };

        this.isDirty = function() {
            return this.dirty;
        }

        this.setDirty = function(dirty) {
            this.dirty = dirty;
            if(dirty) {
                $container.addClass("dirty");
                $('#save').removeClass("disabled");
                $('#cancel').removeClass("disabled");
            }
            else {
                $container.removeClass("dirty");
                $('#save').addClass("disabled");
                $('#cancel').addClass("disabled");
            }
            this.displayValidateButton();
        };

        this.init = function(days) {
            this.days = days;
            for(var i=8; i>0; --i) {
                if(days[i] !== undefined) {
                    this.nbdays = i;
                    break;
                }
            }

            var today = new Date();
            if(today.getFullYear() === this.getAnnee() && (today.getMonth()+1) === this.getMois()) {
                this.today = today.getDate(); // 1 - 31
            } else {
                this.today = 0;
            }

            var $table = $("<table id='cra' class='cra table table-condensed'></table>");

            var $tr = $("<tr>").appendTo($('<thead>').appendTo($table));

            $tr.append("<th class='weekdays'>Wellentag</th>");
            $tr.append("<th class='weekdays'>Aubentag</th>");
            $tr.append("<th class='weekdays'>Marktag</th>");
            $tr.append("<th class='weekdays'>Backertag</th>");
            $tr.append("<th class='weekdays'>Bezahltag</th>");
            $tr.append("<th class='weekdays'>Konistag</th>");
            $tr.append("<th class='weekdays'>Angestag</th>");
            $tr.append("<th class='weekdays'>Festag</th>");


            $table.append('<tbody id="table-body">');

            $tr = $("<tr>").appendTo($('<tfoot>').appendTo($table));


            this.$table = $table.appendTo($container.empty());

            for(let i=0; i<5; i++){
                $('<tr id="tr_number_'+i+'">').appendTo($('#cra tbody'));
                for(let j=0; j<8; j++){
                    $('<td class="dow">').appendTo($('#tr_number_'+i+''));
                }
            }


            // changement du texte pour le mois selectionné
            $('#changemonth').children('span').html(this.getAnneeMoisString());
        };

        this.add = function(data) {
            var self = this;
            var $tr = $("<tr>");


            let cells = $('#cra tbody').find('td');
            $.getJSON('/res/yearStructure.json', null, function(data, text, jqXHR){

                let currentMonth = self.currentMonth;
                let firstDay = self.yearStructure.month[currentMonth].firstDay;
                let dayCount = self.yearStructure.month[currentMonth].daysCount;

                for(let i=firstDay; i<dayCount+firstDay; i++){
                    cells[i].innerText = i-firstDay+1;
                    cells[i].setAttribute('id', (i-firstDay+1)+'-'+$container.data("mois")+'-'+$container.data("annee"));
                    if(cells[i].id === self.now){
                        $(cells[i]).addClass('today');
                    }
                }
            });

            $tr.appendTo(this.$table.children('tbody'));
        };

        this.addGin = function(data) {
            var $tr = $("<tr>");

            $tr.append("<td class='cl'>&nbsp;</td>");
            $tr.append("<td class='gin'>&nbsp;</td>");

            if(data) {
                $tr.find('td.cl')
                    .addClass('filled')
                    .text(data.commande.client.libelle);

                $tr.find('td.gin')
                    .addClass('filled')
                    .text(data.commande.codeGin);
            }

            var $tot = $("<td class='tot'></td>")
                .data('value', 0)
                .appendTo($tr);

            var total = 0;
            for(var i=1; i<=this.nbdays; ++i) {
                var duree = "";
                if(data) {
                    var intervention = data.interventions[i];
                    if(intervention) {
                        duree = parseFloat(intervention.duree);
                        intervention.duree = duree;
                        total += duree;

                        this.updateSummaries($tr, i, duree);
                    }
                }
                $("<td class='" + this.getDowClass(i) + "'>" + (duree?duree:"") + "</td>")
                    .data("day",i)
                    .insertBefore($tot);
            }

            $tr.appendTo(this.$table.children('tbody'));
        };

        this.build = function(days, cra) {
            var self = this;

            this.validation = cra.validation == "1" ? true : false;
            if(this.validation) {
                $('#lbl-valide').show();
            }
            else {
                $('#lbl-valide').hide();
            }

            self.init(days);
            var commandes = cra.commandes;
            var add = this.add;
            if(this.gin) {
                add = this.addGin;

                // fusion commandes
                commandes = {};
                $.each(cra.commandes, function(cid, row) {
                    var codeGin = row.commande.codeGin;
                    if(!commandes[codeGin]) {
                        var interventions = {};
                        for(var i=1; i<=self.nbdays; ++i) {
                            var intervention = row.interventions[i];
                            if(intervention) {
                                var duree = parseFloat(intervention.duree);
                                interventions[i] = { duree: duree };
                            }
                        }
                        commandes[codeGin] = {
                            commande: row.commande,
                            interventions: interventions
                        };
                    }
                    else {
                        for(var i=1; i<=self.nbdays; ++i) {
                            var intervention = row.interventions[i];
                            if(intervention) {
                                var duree = parseFloat(intervention.duree);

                                intervention = commandes[codeGin].interventions[i];
                                if(intervention) {
                                    duree = duree + parseFloat(intervention.duree);
                                }

                                commandes[codeGin].interventions[i] = { duree: duree };
                            }
                        }
                    }
                });
            }
            add = jQuery.proxy(add, this);

            var i = 0;
            $.each(commandes, function(cid, row) {
                add(row);
                i++;
            });

            if(i >= 10) {
                add();
            }
            else {
                for(var j=i; j<10; ++j) {
                    add();
                }
            }
            this.craId = cra.id;
            this.cra = this.gin ? cra : null;

            self.displayValidateButton();
        };

        this.updateSummaries = function($tr, day, variance) {

            var $tt = $tr.children("td.tot");
            if($tt) {
                var total = $tt.data("value") + variance;
                $tt.data("value", total).html(total ? total : "");
            }

            var $dt = $('#tot-' + day);
            var total = $dt.data("value") + variance;
            $dt.data("value", total).html(total ? total : "");

            var $summary = this.$table.children("tfoot").children("tr");
            var total = $summary.data("total") + variance;
            $summary.data("total", total);
            $summary.children("td.tot").html(total ? total : "");
        };
    };

    Cra.prototype.getData = function() {
        if(this.gin) {
            return this.cra;
        }
        else {
            var cra = {
                id: this.craId
                ,validation: this.validation
            };

            var commandes = [];
            $('#cra tr').each(function(i,tr) {
                var $tr = $(tr);

                if($tr.data('active')) {
                    var data = $tr.data('js');
                    commandes.push(data);
                }
            });
            cra.commandes = commandes;

            return cra;
        }
    };

    Cra.prototype.load = async function(params) {
        var self = this;

        params = $.extend(this.getLoadParams(), params);
        let data2;
        $.getJSON('/res/yearStructure.json', data2, function(data, text, jqXHR){
            data2 = jqXHR.responseText;
            data2 = JSON.parse(data2);
            self.yearStructure = data2;
            if(!self.currentMonth){
                self.currentYear = data2.currentDate.year;
                self.currentMonth = data2.currentDate.month;
                self.now = data2.currentDate.day + '-' + data2.currentDate.month + '-' + data2.currentDate.year;
            }
        }).then(function(){
            $.getJSON("/res/events2.json", null, function (data) {
                var days = data["days"];
                var cra = data["cra"];
                self.setDirty(false);

                self.$container.data("annee", self.currentYear);
                self.$container.data("mois", self.currentMonth);
                self.$container.data("utilisateur", params.utilisateur);


                self.build(days, cra);
            })
                .fail(function () {
                    window.alert("Une erreur inattendue s'est produite au chargement.");
                })
                .always(function () {
                    setTimeout(function () {
                        $('.loading').hide();
                    }, 1800)
                });
        });


        if(this.isDirty()) {
            if(!confirm("Il y a actuellement des modifications non enregistrées. Êtes-vous sure de vouloir quitter ce CRA ?")) {
                $('#utilisateur').val(this.getLoadParams().utilisateur);
                return;
            }
        }

        //$('.loading').show();
        $.get('/res/story.txt', function(data) {
            $('.aventure').append(document.createTextNode(data));
        }, 'text');
    };

    Cra.prototype.changeUtilisateur = function(utilisateur) {
        this.load({ utilisateur: utilisateur });
    };

    Cra.prototype.canUserEdit = function (utilisateur){
        if(utilisateur.value == this.currentUser){
            return;
        }
        if(this.canEditOthers == false){
            var lesInput = document.getElementsByTagName("input");
            setTimeout(function(){
                for(let i=0; i<lesInput.length; i++){
                    lesInput[i].setAttribute("readonly", "");
                }
            }, 800);
        }
    }

    Cra.prototype.nextMois = function() {
        var annee = this.$container.data("annee");
        var mois = this.$container.data("mois");

        if(mois === 12) {
            mois = 1;
            annee++;
        } else {
            mois++;
        }
        this.currentMonth = mois;
        this.currentYear = annee;

        this.load({ annee: annee, mois: mois });
    };

    Cra.prototype.prevMois = function() {
        var annee = this.$container.data("annee");
        var mois = this.$container.data("mois");

        if(mois === 1) {
            mois = 12;
            annee--;
        } else {
            mois--;
        }
        this.currentMonth = mois;
        this.currentYear = annee;

        this.load({ annee: annee, mois: mois });
    };

    Cra.prototype.changeMode = function(mode) {
        var gin = mode === "gin" ? true : false;
        if(this.gin === gin)
            return;

        var cra = this.gin ? this.cra : this.getData();

        this.gin = gin;
        this.build(this.days, cra);
    };

    Cra.prototype.displayValidateButton = function() {
        var visible = false;
        var enabled = false;
        var button = $('#validate');

        if(this.canValidate) {
            button.show();
        }
        else {
            button.hide();
        }

        // on active le bouton si déjà enregistré, non 'dirty' et en mode gin
        if(this.craId && !this.dirty && this.gin) {
            button.removeClass('disabled');
        }
        else {
            button.addClass('disabled');
        }
    };

    var palier = {
        get: function() {
            if(!this.private) {
                var $palier = $("#palier button.active");
                this.set($palier.val());
            }
            return this.private;
        }
        ,set: function(value) {
            this.private = parseFloat(value);
        }
    };

    $(function onDocumentLoad() {
        var cra = new Cra($("#cra-container"));
        cra.load();

        $('#prevmonth').on('click', function(e) {
            e.preventDefault();
            cra.prevMois();
        });

        $('#nextmonth').on('click', function(e) {
            e.preventDefault();
            cra.nextMois();
        });

        $('#palier').on('click', 'button', function() {
            var value = parseFloat($(this).val());
            palier.set(value);
        });

        $('#utilisateur').on('change', function() {
            var value = $(this).val();
            cra.changeUtilisateur(value);
        });

        $('#showall').on('change', function() {
            var params = {},
                $select = $("select[name = 'utilisateur']");

            params.idUtilisateur = cra.getLoadParams().utilisateur;
            params.showAll = $(this).is(':checked') ? '1' : '0';

            $.ajax({
                type: 'POST',
                url: SteamHelper.getUrl("/utilisateur/fillSelect"),
                data: params,
                success: function(data) {
                    $select.html(data);
                    $select.val(params.idUtilisateur);
                }
            });
        });

        $('#mode').on('click', 'button', function() {
            var mode = $(this).val();
            cra.changeMode(mode);
        });

        var mapTypeahead;

        /*
         * 'Client' input management
         */

        $('#cra-container').on('focus', 'td.cl input', function onClientInputFocus(e) {
            var $input = $(e.target);

            // save previous value for focus out stuff
            $input.data('old-value', $input.val());

            // build typeahead if necessary
            if(!$input.data('typeahead')) {
                var $tr = $input.parent().parent();
                $input.typeahead({
                    source: function client_source(query, process) {
                        $.post(SteamHelper.getUrl("/client/typeahead"), { libelle: query }, function(data) {
                            mapTypeahead = {};

                            var labels = [];
                            $.each(data, function (i, item) {
                                mapTypeahead[item.libelle] = item.id;
                                labels.push(item.libelle);
                            });

                            process(labels);
                        });
                    }
                    , updater: function client_updater(item) {
                        var id = mapTypeahead[item];

                        if(id !== $tr.data('idClient')) {
                            selectClient($tr, id, item);

                            $input.data('old-value', item);
                        }

                        return item;
                    }
                    , matcher: function client_matcher(item) {
                        return true;
                    }
                });
            }
        })
            .on('blur', 'td.cl input', function onClientInputBlur(e) {
                var $input = $(e.target);
                var newv = $input.val();
                var oldv = $input.data('old-value');

                if(oldv === newv) return;

                if(oldv.toLowerCase() === newv.toLowerCase()) {
                    $input.val(oldv);
                    return;
                }

                selectClient($input.parent().parent(), null, newv);
            });

        var selectClient = function selectClient($tr, id, libelle) {
            $tr.data('idClient', id);
            $tr.data('idCommande', null);

            $tr.data('active', 0);

            if(id)
                $tr.find('td.cl').removeClass().addClass('cl filled');
            else if(libelle)
                $tr.find('td.cl').removeClass().addClass('cl unknown');
            else
                $tr.find('td.cl').removeClass().addClass('cl missing');

            selectCommande($tr, {});
        };

        /*
         * 'Commande' input management
         */

        $('#cra-container').on('focus', 'td.co input', function onCommandeInputFocus(e) {
            var $input = $(e.target);

            // save previous value for focus out stuff
            $input.data('old-value', $input.val());

            // build typeahead if necessary
            if(!$input.data('typeahead')) {
                var $tr = $input.parent().parent();
                $input.typeahead({
                    source: function typehead_source(query, process) {
                        var idClient = $tr.data('idClient');
                        $.post(SteamHelper.getUrl("/commande/typeahead"), { idclient: idClient, libelle: query }, function(data) {
                            mapTypeahead = {};

                            var labels = [];
                            $.each(data, function (i, item) {
                                mapTypeahead[item.libelle] = item;
                                labels.push(item.libelle);
                            });

                            process(labels);
                        });
                    }
                    , updater: function (item) {
                        var data = mapTypeahead[item];

                        if(data.id !== $tr.data('idCommande')) {
                            selectCommande($tr, data);
                            $input.data('old-value', item);
                        }

                        return item;
                    }
                    , matcher: function (item) {
                        return true;
                    }
                });
            }
        })
            .on('blur', 'td.co input', function onCommandeInputBlur(e) {
                var $input = $(e.target);
                var newv = $input.val();
                var oldv = $input.data('old-value');

                if(oldv === newv) return;

                if(oldv.toLowerCase() === newv.toLowerCase()) {
                    $input.val(oldv);
                    return;
                }

                selectCommande($input.parent().parent(), {libelle: newv});
            });

        var selectCommande = function selectCommande($tr, commande) {
            if(commande.id) {
                $tr.data('idCommande', commande.id);

                $tr.find('td.co').removeClass().addClass('co filled').children('input').val(commande.libelle);
                $tr.find('td.gin').removeClass().addClass('gin filled').children('input').val(commande.codeGin);

                var js = $tr.data('js');
                var clientId = $tr.data('idClient');
                var clientLibelle = $tr.find('td.co').children('input').val();
                if(!js) {
                    js = {
                        commande: {
                            id: commande.id,
                            libelle: commande.libelle,
                            codeGin: commande.codeGin,
                            client: {
                                id: 0,
                                libelle: clientLibelle
                            }
                        }
                        ,interventions: []
                    };
                    $tr.data('js', js);
                } else {
                    js.commande.id = commande.id;
                    js.commande.libelle = commande.libelle;
                    js.commande.codeGin = commande.codeGin;
                    js.commande.client.id = 0;
                    js.commande.client.libelle = clientLibelle;
                }

                $tr.data('active', 1);
            }
            else {
                $tr.data('active', 0);

                $tr.data('idCommande', null);

                if(commande.libelle)
                    $tr.find('td.co').removeClass().addClass('co unknown').children('input').val(commande.libelle);
                else
                    $tr.find('td.co').removeClass().addClass('co missing').children('input').val(commande.libelle);

                if(commande.codeGin)
                    $tr.find('td.gin').removeClass().addClass('gin missing').children('input').val(commande.codeGin);
                else
                    $tr.find('td.gin').removeClass().addClass('gin missing').children('input').val(commande.codeGin);
            }
            cra.setDirty(true);
        };

        /*
         *
         */

        $('#cra-container').on('click', '#cra td.dow', function onDayClick(e) {
            $('td.selected').removeClass('selected');
            $('#champ-aventure-edit')
                .empty()
                .hide();
            initPesterlog();
            $('#aventure-text')
                .empty()
                .hide();
            var td = e.target;
            var $td = $(td);
            $td.addClass('selected');

            $.getJSON("/res/events.json", null, function (data, textStatus, jqXHR) {
                var dayId = $td.attr('id');
                let events;
                events = jqXHR.responseText;
                events = JSON.parse(events);
                $('#aventure-text').attr('class', dayId);
                var event = events[dayId];
                if(event){
                    $.get(event.filepath, function (data) {
                        $('#aventure-text')
                            .show()
                            .append(data)
                            .show();
                    }, 'text');
                } else{
                    $('#aventure-text')
                        .show()
                        .append('')
                        .show();
                }
            });
        });

        $('#cra-container').on("keyup", "#comment", function onCommentInputChange() {
            var $comment = $('#comment');
            var intervention = $comment.data("js");
            var commentaire = $comment.val().trim();
            intervention.commentaire = commentaire;
            if(commentaire) {
                $('#cra td.dow.selected').addClass('comment');
            }
            else {
                $('#cra td.dow.selected').removeClass('comment');
            }
        });

        $('#save').on('click', function onSaveButtonClick() {
            if(!cra.isDirty())
                return;

            var craData = cra.getData();

            var post = {
                id: craData.id
                , validation: (cra.validation ? '1' : '0')
                , commandes: []
            };

            $.each(craData.commandes, function (i, data) {
                post.commandes.push({
                    idCommande: data.commande.id
                    ,interventions: data.interventions
                });
            });

            var $craContainer = $("#cra-container");
            var utilisateur = $craContainer.data("utilisateur");
            var annee = $craContainer.data("annee");
            var mois = $craContainer.data("mois");

            $('.loading').show();
            jQuery.post(SteamHelper.getUrl('/cra?annee='+annee+'&mois='+mois+'&utilisateur='+utilisateur), JSON.stringify(post), function(data) {
                cra.setDirty(false);
                cra.load();
                $('.loading').hide();
                $('#containerEdit').show(hideMessage);
                //SteamHelper.showMessage('success', 'Enregistrement effectué.');
            },'json')
                .fail(function() {
                    $('.loading').hide();
                    SteamHelper.showMessage('error', "Une erreur inattendue s'est produite à l'enregistrement.");
                });
        });

        $('#cancel').on('click', function onCancelButtonClick() {
            if(!cra.isDirty())
                return;

            cra.setDirty(false);
            cra.load();
        });

        $('#validate').on('click', function onSaveButtonClick() {
            if($('#validate').hasClass('disabled'))
                return;

            var id = cra.getData().id;

            $('.loading').show();
            jQuery.post(SteamHelper.getUrl('/cra/validate/' + id), function(data) {
                if(data.error) {
                    SteamHelper.showMessage('error', data.error.message);
                }
                else {
                    cra.load();
                    $('#containerEdit').show();
                    //SteamHelper.showMessage('success', 'Validation effectuée.');
                }
            })
                .fail(function(data) {
                    //$('.loading').hide();
                    window.alert('Fail' + "Une erreur inattendue s'est produite à l'enregistrement.");
                })
        });

        window.onbeforeunload = function() {
            if(cra.isDirty()) {
                return "Il y a actuellement des modifications non enregistrées. Êtes-vous sure de vouloir quitter ?";
            }
        };
    });
})();

function hideMessage(){
    setTimeout(function () {
        $('#containerEdit').hide();
    }, 2950);
}

function initPesterlog(){
    $('#editAventure').on('click', function (){
        var champEdit = $('#champ-aventure-edit');
        var ventureLog = $('#aventure-text');
        let content = ventureLog.text();
        ventureLog.hide();
        champEdit
            .show()
            .append(content);
        $('#aventure-text-edit').show();
    });
}