// ==UserScript==
// @name         FACEIT Addons
// @author       brains
// @version      0.1
// @author       You
// @downloadURL  https://github.com/krozum/FACEIT_Addons/raw/master/FACEITAddons.user.js
// @updateURL    https://github.com/krozum/FACEIT_Addons/raw/master/FACEITAddons.user.js
// @match        https://www.faceit.com/*
// @grant        none
// ==/UserScript==

(function() {
    $('body').append('<button id="teasd" style="position: absolute; bottom: 100px; left: 15px; width: 100px; background: #404040; border: none; z-index: 99999; padding: 10px;">Sprawdź czy grałeś</button>');


    $('#teasd').on('click', function(){
        let currentUser = $('profile-avatar.mini-profile.v2_avatar img').attr('alt');

        let array = [];
        let object = {};
        $('strong[ng-bind="vm.teamMember.nickname"]').each(function() {
            array.push($(this).text());
        })

        let currentUser2 = $('avatar[img-alt="' + currentUser + '"]').attr('entity-id');


        // https://api.faceit.com/stats/v1/stats/time/users/96ff1f85-9866-4840-ba12-50a537317b99/games/csgo?page=0&size=21
        $.ajax({
            url: "https://api.faceit.com/stats/v1/stats/time/users/" + currentUser2 + "/games/csgo?page=0&size=21"
        }).done(function(response) {
            $(response).each(function(index, element) {
                let matchId = element.matchId;

                $.ajax({
                    url: "https://api.faceit.com/match/v2/match/" + matchId
                }).done(function(response) {
                    $(response).each(function(index, element2) {
                        let faction1 = element2.payload.teams.faction1.roster;
                        $(faction1).each(function(index, element3) {
                            console.log(element3.nickname)
                            if (array.indexOf(element3.nickname) >= 0) {
                                object[element3.nickname] = matchId;
                                console.log('tak')
                                $('a[tooltip-class="fi-popover fi-popover--user-stats"][href="/pl/players-modal/' + element3.nickname + '"]').parent().append('<a target="_blank" href="https://www.faceit.com/pl/csgo/room/' + matchId + '/scoreboard"><button style="background: #404040; border: none; margin: 2px;">ostatnia gierka</button></a>');
                            }
                        })

                        let faction2 = element2.payload.teams.faction2.roster;

                        $(faction2).each(function(index, element3) {
                            console.log(element3.nickname)
                            if (array.indexOf(element3.nickname) >= 0) {
                                object[element3.nickname] = matchId;
                               $('a[tooltip-class="fi-popover fi-popover--user-stats"][href="/pl/players-modal/' + element3.nickname + '"]').parent().append('<a target="_blank" href="https://www.faceit.com/pl/csgo/room/' + matchId + '/scoreboard"><button style="background: #404040; border: none; margin: 2px;">ostatnia gierka</button></a>');
                            }
                        })
                    })
                });
            })
        });

        // https://api.faceit.com/match/v2/match/1-34158d54-fc91-46c5-b91a-52ce21b8ede9
    })
})();
