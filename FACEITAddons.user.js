// ==UserScript==
// @name         FACEIT Addons
// @author       brains
// @version      0.2
// @author       You
// @downloadURL  https://github.com/krozum/FACEIT_Addons/raw/main/FACEITAddons.user.js
// @updateURL    https://github.com/krozum/FACEIT_Addons/raw/main/FACEITAddons.user.js
// @match        https://www.faceit.com/*
// @grant        none
// ==/UserScript==

(function() {
    $('body').append('<button id="teasd" style="position: absolute; bottom: 100px; left: 15px; width: 100px; background: #404040; border: none; z-index: 99999; padding: 10px;">Sprawdź czy grałeś</button>');


    $('#teasd').on('click', function(){
        let currentUser = $('profile-avatar.mini-profile.v2_avatar img').attr('alt');

        let url = window.location.pathname;
        let currentGameId = url.split("/csgo/room/")[1].split("/")[0];

        if (url.indexOf("/csgo/room/") >= 0) {

            let array = [];
            let object = {};
            $('strong[ng-bind="vm.teamMember.nickname"]').each(function() {
                array.push($(this).text());
            })

            let currentUser2 = $('avatar[img-alt="' + currentUser + '"]').attr('entity-id');
            $('.toRemoveAddons').remove();


            $.ajax({
                url: "https://api.faceit.com/stats/v1/stats/time/users/" + currentUser2 + "/games/csgo?page=0&size=21"
            }).done(function(response) {
                $(response).each(function(index, element) {
                    let matchId = element.matchId;
                    if (matchId !== currentGameId) {
                        $.ajax({
                            url: "https://api.faceit.com/match/v2/match/" + matchId
                        }).done(function(response) {
                            $(response).each(function(index, element2) {
                                let faction1 = element2.payload.teams.faction1.roster;
                                $(faction1).each(function(index, element3) {
                                    if (array.indexOf(element3.nickname) >= 0) {
                                        object[element3.nickname] = matchId;
                                        $('a[tooltip-class="fi-popover fi-popover--user-stats"][href="/pl/players-modal/' + element3.nickname + '"]').parent().append('<a class="toRemoveAddons" target="_blank" href="https://www.faceit.com/pl/csgo/room/' + matchId + '/scoreboard"><button style="background: #404040; border: none; margin: 2px;">ostatnia gierka</button></a>');
                                    }
                                })

                                let faction2 = element2.payload.teams.faction2.roster;

                                $(faction2).each(function(index, element3) {
                                    console.log(element3.nickname)
                                    if (array.indexOf(element3.nickname) >= 0) {
                                        object[element3.nickname] = matchId;
                                        $('a[tooltip-class="fi-popover fi-popover--user-stats"][href="/pl/players-modal/' + element3.nickname + '"]').parent().append('<a class="toRemoveAddons" target="_blank" href="https://www.faceit.com/pl/csgo/room/' + matchId + '/scoreboard"><button style="background: #404040; border: none; margin: 2px;">ostatnia gierka</button></a>');
                                    }
                                })
                            })
                        });
                    }
                })
            });
        }
    })
})();
