$(document).ready(function(){

  var lastResult = {
    date: null,
    home_team: null,
    away_team: null,
    networks: null
  }

  getLastResult();

  $('#team-select').on('change', function() {
    fetchTeamGame(this.value);
  })

  function titleize(string) {
    return string.split(' ').map(function(val) {
      if(val == 'l.a.') return 'L.A.';
      return `${val[0].toUpperCase()}${val.substring(1, val.length)}`;
    }).join(' ');
  }

  function populateSelectBox(){
    Object.keys(teams).forEach((league) => {
      $('#team-select').append(`<optgroup id="${league}-optgroup" label="${league.toUpperCase()}">`);
      const optgroup = $(`#${league}-optgroup`);
      teams[league].forEach((team) => {
        $('<option />', {
          value: team,
          html: titleize(team)
        }).appendTo(optgroup);
      });
    });
  }

  function fetchTeamGame(team){
    showLoading();
    $.ajax(
      {
        method: "POST",
        url: "https://sports-broadcasts.herokuapp.com/games",
        data: { team1: team },
        timeout: 3000,
        success: function(result){
          lastResult.date = result[0].date;
          lastResult.home_team = result[0].home_team;
          lastResult.away_team = result[0].away_team;
          lastResult.networks = result[0].tv_networks || 'TBD';
          saveResult();
          displayLastResult();
          showResult();
        },
        error: function(){
          showError();
        },
        complete: function(result){
          console.log(result);
        }
      }
    );
  }

  function displayLastResult(){
    $('#result-teams').html(titleize(lastResult.home_team) + " vs " + titleize(lastResult.away_team));
    $('#result-networks').html(lastResult.networks);
    $('#result-date').html(formatDate);
    $('#result-time').html(formatTime);
  }

  function formatTime(){
    var date = lastResult.date;
    let timezoneGuess = moment.tz.guess();
    let timeInTZ = moment.tz(date, timezoneGuess);
    let abbr = moment.tz.zone(timezoneGuess).abbr(date);
    return `${timeInTZ.format('h:mm a')} ${timeInTZ.zoneAbbr()}`;
  }

  function formatDate(){
    var date = lastResult.date;
    return moment.tz(date, moment.tz.guess()).format('MMMM Do, YYYY');
  }

  function lastResultExists(){
    return (lastResult.date != null && lastResult.home_team != null && lastResult.away_team != null && lastResult.networks != null);
  }

  function showResult(){
    $('#error').hide();
    $('#result').show();
    $('#loading').hide();
  }

  function showError(){
    $('#error').show();
    $('#result').hide();
    $('#loading').hide();
  }

  function showLoading(){
    $('#error').hide();
    $('#result').hide();
    $('#loading').show();
  }

  function getLastResult(){
    console.log('hello');
    chrome.storage.local.get('lastResult',function(result){
      console.log(result);
      if(result.lastResult != null){
        lastResult = result.lastResult;
        console.log(lastResult);
        showResult();
        displayLastResult();
      }
      populateSelectBox();
    });
  }

  function saveResult(){
    chrome.storage.local.set({'lastResult': lastResult},function(){
      console.log("storage updated: " + lastResult);
    });
  }
});
