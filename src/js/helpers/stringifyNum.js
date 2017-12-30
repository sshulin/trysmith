function stringifyNum(number) {
	var int = parseInt(number);

  var prefix = ["", "K", "M", "B", "T", "Quad", "Qiunt", " Z", " Y", " * 10^27", " * 10^30", " * 10^33"]; // should be enough. Number.MAX_VALUE is about 10^308
  var ii = 0;
  while ((int = int/1000) >= 1) { ii++; }
  int = parseInt(int * 10000)/10;
  return int + prefix[ii];

}

export default stringifyNum;