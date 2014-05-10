var tipsController = function ($scope, $http) {
  $scope.ETT = 1;
  $scope.KRYSS = 2;
  $scope.TVA = 4;

  $scope.CORRECT_LIST_COUNT = 4;

  $scope.team_names = [ "", "", "", "", "", "", "", "", "", "", "", "", "" ];
  $scope.team_scores = [ "", "", "", "", "", "", "", "", "", "", "", "", "" ];
  $scope.results = [ $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT]; 
  $scope.utdelning = {13: 0, 12: 0, 11: 0, 10: 0};

  $scope.rows = [ $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT ]; 
  $scope.winnings = 0;
  $scope.UPDATE_BLINK_TIME_MS = 60*1000;
  $scope.last_game_updates = [
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
    Date.now() - $scope.UPDATE_BLINK_TIME_MS,
  ];

  $scope.toggle_row = function(index, value) {
    if($scope.rows[index] & value)
      $scope.rows[index] &= ~value;
    else
      $scope.rows[index] |= value;
    calculate_correct_rows();
    update_hash();
  };

  $scope.is_good = function(index) {
    return $scope.har_vi_med_den(index, $scope.results[index]);
  }
  $scope.resultat = function(index, constant) {
    return $scope.results[index] & constant;
  };

  $scope.har_vi_med_den = function(index, constant) {
    return $scope.rows[index] & constant;
  };

  $scope._extract_rows = function(index, row, rows) {
    if(index == 13) {
      rows.push(row);
      return;
    }

    if($scope.rows[index] & $scope.ETT) {
      var new_row = row.slice(0);
      new_row.push($scope.ETT);
      $scope._extract_rows(index+1, new_row, rows);
    }

    if($scope.rows[index] & $scope.KRYSS) {
      var new_row = row.slice(0);
      new_row.push($scope.KRYSS);
      $scope._extract_rows(index+1, new_row, rows);
    }

    if($scope.rows[index] & $scope.TVA) {
      var new_row = row.slice(0);
      new_row.push($scope.TVA);
      $scope._extract_rows(index+1, new_row, rows);
    }
  };

  $scope.extract_rows = function() {
    return Row.extract_rows($scope.rows);
  };

  var calculate_correct_rows = function() {
    var rows = $scope.extract_rows();
    var correct_rows = Array(14);
    for(var i=0;i<14;++i)
      correct_rows[i] = 0;

    for(var i in rows) {
      var sum = 0;
      for(var j in $scope.results) {
        if(rows[i][j] & $scope.results[j]) {
          sum += 1;
        }
      }
      correct_rows[sum] += 1;
    }
    correct_rows.reverse();
    $scope.correct_rows = correct_rows;
    var winnings = 0;
    for(i=10;i<14;++i) {
      winnings += $scope.correct_rows[13-i] * $scope.utdelning[i];
    }
    $scope.winnings = winnings;
  };


  $scope.correct = function(index) {
    return $scope.results[index] & $scope.rows[index];
  };

  var update_hash = function() {
    var s = "";
    for(var i in $scope.rows) {
      s += $scope.rows[i];
    }
    document.location.hash = s;
  };

  var read_from_hash = function() {
    var hash = document.location.hash;
    if(hash.length == 14) {
      for(var i in document.location.hash) {
        if(i == 0)
          continue;
        $scope.rows[i-1] = parseInt(document.location.hash[i]);
      }
    }
  };

  $scope.result_updated = function(i) {
    return Date.now() < ($scope.last_game_updates[i] + $scope.UPDATE_BLINK_TIME_MS);
  };

  $scope.update_game_updates = function (new_results) {
    for(var i=0;i<$scope.results.length;++i) {
      if($scope.team_scores[i] != new_results.team_scores[i]) {
        $scope.last_game_updates[i] = Date.now();
      }
    }
  };

  function update_results() {
    $http.get('/results.json').success(function(data) {
      var new_results = {};
      new_results.team_names = [];
      new_results.team_scores = [];
      new_results.results = [];
      for(var i in data.rows) {
        new_results.team_names.push(data.rows[i].home_team + '-' + data.rows[i].away_team);
        new_results.team_scores.push(data.rows[i].home_score + '-' + data.rows[i].away_score);
        var result = $scope.KRYSS;
        if(data.rows[i].home_score > data.rows[i].away_score) {
          result = $scope.ETT;
        } else if(data.rows[i].home_score < data.rows[i].away_score) {
          result = $scope.TVA;
        }
        new_results.results.push(result);
      }

      $scope.update_game_updates(new_results);
      $scope.utdelning = data.utdelning;
      $scope.team_names = new_results.team_names;
      $scope.team_scores = new_results.team_scores;
      $scope.results = new_results.results;
      calculate_correct_rows();
    });
  }

  update_results();
  read_from_hash();
  setInterval(update_results, 5000);
};

