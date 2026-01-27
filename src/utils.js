export const utils = (function() {
  return {
    DictIntersection: function(dictA, dictB) {
      const intersection = {};
      for (let k in dictB) {
        if (k in dictA) {
          intersection[k] = dictA[k];
        }
      }
      return intersection
    },

    DictDifference: function(dictA, dictB) {
      const diff = {...dictA};//Tạo một bản sao của dictA 
      for (let k in dictB) {
		  //kiểm tra xem khóa này có tồn tại trong diff hay không. 
		  //Nếu tồn tại, tức là khóa này cũng có trong dictA, 
		  //và hàm sẽ xóa cặp khóa - giá trị tương ứng trong diff. 
		  //Điều này đảm bảo rằng diff chỉ chứa các cặp khóa - giá trị 
		  //mà không có trong dictB.
        delete diff[k];
      }
      return diff;
    }
  };
})();
