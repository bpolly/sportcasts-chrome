$(document).ready(function(){

  populateSelectBox();

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
          date = result[0].date;
          homeTeam = result[0].home_team;
          awayTeam = result[0].away_team;
          networks = result[0].tv_networks;
          $('#result-teams').html(titleize(homeTeam) + " vs " + titleize(awayTeam));
          displayDate(date);
          displayTime(date);
          $('#result-networks').html(networks);
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

  function displayTime(date){
    let timezoneGuess = moment.tz.guess();
    let timeInTZ = moment.tz(date, timezoneGuess);
    let abbr = moment.tz.zone(timezoneGuess).abbr(date);
    $('#result-time').html(`${timeInTZ.format('h:mm a')} ${timeInTZ.zoneAbbr()}`);
  }

  function displayDate(date){
    $('#result-date').html(moment.tz(date, moment.tz.guess()).format('MMMM Do, YYYY'));
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
});
