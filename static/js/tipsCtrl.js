var tipsController = function ($scope, $http) {
  $scope.ETT = 1;
  $scope.KRYSS = 2;
  $scope.TVA = 4;

  $scope.CORRECT_LIST_COUNT = 4;

  $scope.team_names = [ "", "", "", "", "", "", "", "", "", "", "", "", "" ];
  $scope.team_scores = [ "", "", "", "", "", "", "", "", "", "", "", "", "" ];
  $scope.results = [ $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT]; 

  $scope.rows = [ $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT, $scope.ETT ]; 

  $scope.toggle_row = function(index, value) {
    if($scope.rows[index] & value)
      $scope.rows[index] &= ~value;
    else
      $scope.rows[index] |= value;
    calculate_correct_rows();
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
    return correct_rows;
    return correct_rows.slice(13 - $scope.CORRECT_LIST_COUNT);
  };


  $scope.correct = function(index) {
    return $scope.results[index] & $scope.rows[index];
  };



  $scope.save = function() {
    window.localStorage.clear();
    window.localStorage.setItem('rows', $scope.rows);
    window.localStorage.setItem('results', $scope.results);
  };

  $scope.load = function() {

    $scope.rows = [];
    window.localStorage.getItem('rows').split(",").map(function(a) {
      $scope.rows.push(parseInt(a, 10));
    });
    $scope.results = [];
    window.localStorage.getItem('results').split(",").map(function(a) {
      $scope.results.push(parseInt(a, 10));
    });
  };

  function update_results() {
    console.log('updating');
    $http.get('/results.json').success(function(data) {
      $scope.team_names = [];
      $scope.team_scores = [];
      $scope.results = [];
      for(var i in data) {
        $scope.team_names.push(data[i].home_team + '-' + data[i].away_team);
        $scope.team_scores.push(data[i].home_score + '-' + data[i].away_score);
        var result = $scope.KRYSS;
        if(data[i].home_score > data[i].away_score) {
          result = $scope.ETT;
        } else if(data[i].home_score < data[i].away_score) {
          result = $scope.TVA;
        }
        $scope.results.push(result);
        calculate_correct_rows();
      }
    });
  }

  update_results();
  setTimeout(update_results, 5000);

};
