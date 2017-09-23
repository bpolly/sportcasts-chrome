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
          time = result[0].date;
          homeTeam = result[0].home_team;
          awayTeam = result[0].away_team;
          networks = result[0].tv_networks;
          $('#result-teams').html(titleize(homeTeam) + " vs " + titleize(awayTeam));
          $('#result-date').html(moment(time).format('MMMM Do, YYYY'));
          $('#result-time').html(moment(time).format('h:mm a'));
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
