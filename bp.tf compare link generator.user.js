// ==UserScript==
// @name         bp.tf compare link generator
// @namespace    http://steamcommunity.com/id/deadbananas/
// @version      0.1
// @description  generate bp.tf compare links from history page
// @author       appy
// @match        https://backpack.tf/item/*
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function(){

    var colsHeads = {
        'owner': 'User',
        'lastseen': 'Last seen',
        'id': 'ID'
    };
    var cols = {};
    var $historytable = $('.history-sheet table.table');
    var other_owner = '';
    historyReady = function() {
        var $tr = $historytable.find('tbody tr'),
            $headertr = $historytable.find('thead tr th'),
            $tds, usersteamid, itemid;

        $headertr.each(getColPos); // get position of each column
        $tr.each(getID); // iterate to collect id's
    };

    getColPos = function() {
        for (var k in colsHeads) {
            if (colsHeads[k].toLowerCase() === $(this).text().toLowerCase()) {
                cols[k] = $(this).index();
            }
        }
    };

    getID = function() {
        var $this = $(this);
        var $tds = $this.find('td');
        var itemid = $tds.eq(cols['id']).text().trim();
        var usersteamid = $tds.eq(cols['owner']).find('.user-handle a').attr('data-id');
        var lastseen  = $tds.eq(cols['lastseen']).text();
        var day_current = new Date(lastseen);
        day_current = new Date(day_current.getUTCFullYear(),day_current.getMonth(),day_current.getUTCDate());
        var unix_current = (day_current.getTime() - day_current.getTimezoneOffset()*60*1000)/1000;
        var day_before = new Date(day_current.getUTCFullYear(),day_current.getMonth(),day_current.getUTCDate());
        var unix_before = (day_current.getTime() - day_current.getTimezoneOffset()*60*1000 - 86400000)/1000;
        var href_link1 = "https://backpack.tf/profiles/" + usersteamid + "#!/compare/" + unix_before + "/" + unix_current;
        var href_link2 = "https://backpack.tf/profiles/" + other_owner + "#!/compare/" + unix_before + "/" + unix_current;
        if(other_owner != ''){
            $tds.eq(cols['lastseen']).append("<a href="+href_link1+">      COMPARE1</a>");
            $tds.eq(cols['lastseen']).append("<a href="+href_link2+">      COMPARE2</a>");
        }
        other_owner = usersteamid;
    };



    historyReady();
})();