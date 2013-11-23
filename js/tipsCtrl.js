var tipsController = function ($scope) {
  $scope.ETT = 1;
  $scope.KRYSS = 2;
  $scope.TVA = 4;

  $scope.CORRECT_LIST_COUNT = 4;

  $scope.results = [
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT];

  $scope.rows = [
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT,
    $scope.ETT
  ];

  $scope.update_result = function(index, value) {
    $scope.results[index] = value;
  };

  $scope.toggle_row = function(index, value) {
    if($scope.rows[index] & value)
      $scope.rows[index] &= ~value;
    else
      $scope.rows[index] |= value;
  };


  $scope.num_to_letter = function(num) {
    if(num === $scope.ETT)
      return '1';
    if(num === $scope.KRYSS)
      return 'X';
    if(num === $scope.TVA)
      return '2';
  };

  $scope.resultat = function(index, constant) {
    return $scope.results[index] & constant;
  };

  $scope.har_vi_med_den = function(index, constant) {
    return $scope.rows[index] & constant;
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
    var rows = [];
    var start_row = [];
    $scope._extract_rows(0, start_row, rows);
    return rows;
  };

  $scope.correct_rows = function() {

    var rows = $scope.extract_rows();
    correct_rows = Array(14);
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
    return correct_rows;
    return correct_rows.slice(13 - $scope.CORRECT_LIST_COUNT);
  };


  $scope.correct = function(index) {
    return $scope.results[index] & $scope.rows[index];
  };


};
