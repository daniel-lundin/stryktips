var Row = {};

Row.ETT = 1;
Row.KRYSS = 2;
Row.TVA = 4;

Row._extract_rows = function(all_rows, index, row, rows) {
  if(index == 13) {
    rows.push(row);
    return;
  }

  var curr = all_rows[index];
  if(curr & Row.ETT) {
    row[index] = Row.ETT;
    Row._extract_rows(all_rows, index+1, row, rows);
  }

  if(curr & Row.KRYSS) {
    var new_row = row.slice(0);
    new_row[index] = Row.KRYSS;
    Row._extract_rows(all_rows, index+1, new_row, rows);
  }

  if(curr & Row.TVA) {
    var new_row = row.slice(0);
    new_row[index] = Row.TVA;
    Row._extract_rows(all_rows, index+1, new_row, rows);
  }
};

Row.extract_rows = function(row) {
  var rows = [];
  var start_row = Array(13);
  Row._extract_rows(row, 0, start_row, rows);
  return rows;
};

Row.num_rows = function(row) {
  var halves = 0;
  var fulles = 0;
  for(var i in row) {
    if(row[i] == 3 || row[i] == 5 || row[i] == 6)
      halves += 1;
    if(row[i] == 7)
      fulles += 1;
  };
  return 1 * Math.pow(2, halves) * Math.pow(3, fulles);
};

row_full = [ 
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT | Row.KRYSS | Row.TVA
];

row96 = [ 
  Row.ETT | Row.KRYSS,
  Row.ETT | Row.KRYSS,
  Row.ETT | Row.KRYSS,
  Row.ETT | Row.KRYSS,
  Row.ETT | Row.KRYSS,
  Row.ETT | Row.KRYSS | Row.TVA,
  Row.ETT,
  Row.ETT,
  Row.ETT,
  Row.ETT,
  Row.ETT,
  Row.ETT,
  Row.ETT
];


console.log(Row.num_rows(row96));
var a = new Array(Row.num_rows(row_full));







