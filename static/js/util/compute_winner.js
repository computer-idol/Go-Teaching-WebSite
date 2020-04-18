class Compute{
   constructor(martix,komi,white_capture,black_capture){
       this.martix = martix;//矩阵
       this.komi = komi;//贴目
       //记录势力矩阵
       this.situation = Array(martix.length).fill(0).map(x=>Array(martix.length).fill(0));
       this.white_point = 0;
       this.black_point = 0;
       this.black_num=0;
       this.white_num=0;
       this.white_capture = white_capture;
       this.black_capture = black_capture;
   }
   //形势判断
   conduct_lead(){
      let flag=0;
      for(let i=0;i<this.martix.length;i++){
         for(let j=0;j<this.martix.length;j++){
             //该点为空点
             if(this.martix[i][j]==0)
                  continue;
             //该点为白棋，势力为负
             else if(this.martix[i][j]==2) {
                 this.white_num++;
                 flag = -1;
             }
             else {
                this.black_num++;
                flag = 1;
             }
             this.ComputePowerSituation(flag,i,j);
         }
      }
      this.ComputePointNum();
      return new GameResult(this.white_point,this.black_point,this.white_capture,this.black_capture,this.komi,this.situation);
   }
   //计算该棋子的势力:横＋竖<=4为其势力影响范围
   ComputePowerSituation(flag,i,j){
       let n = this.martix.length;
       for(let x=0;x<=6;x++){
         for(let y=0;y<=6;y++){
             if(x+y>6)continue;
             else {
                 if (i + x < n && j + y < n) {
                     if (this.martix[i + x][j + y] == 0) {
                        if(this.can_add(i,j,i+x,j+y))
                           this.situation[i + x][j + y] += this.GetPowerPoint(flag, x, y);
                     }
                 }
                 if (i + x < n && j - y >= 0 && y != 0) {
                     if (this.martix[i + x][j - y] == 0) {
                       if(this.can_add(i,j,i+x,j-y))
                         this.situation[i + x][j - y] += this.GetPowerPoint(flag, x, y);
                     }
                 }
                 if (i - x >= 0 && j + y < n && x != 0) {
                     if (this.martix[i - x][j + y] == 0) {
                       if(this.can_add(i,j,i-x,j+y))
                          this.situation[i - x][j + y] += this.GetPowerPoint(flag, x, y);
                     }
                 }
                 if (i - x >= 0 && j - y >= 0 && x != 0 && y != 0) {
                     if (this.martix[i - x][j - y] == 0) {
                       if(this.can_add(i,j,i-x,j-y))
                          this.situation[i - x][j - y] += this.GetPowerPoint(flag, x, y);
                     }
                 }
             }
         }
      }
      //修正势力函数
      this.fix_situation();
      return this.situation;
   }
   //根据相应的距离返回对应的势力分数
   GetPowerPoint(flag,x,y){
      let sum = x+y;
      let rt=0;
      switch (sum) {
          case 1:
              rt = 128;
              break;
          case 2:
              rt = 64;
              break;
          case 3:
              rt = 32;
              break;
          case 4:
              rt = 16;
              break;
          case 5:
              rt = 8;
              break;
          case 6:
              rt=4;
              break;
          default:
              rt = 0;
              break;
      }
      return flag*rt;
   }

   fix_situation(){
     for(let i=0;i<this.situation.length;i++){
       for(let j=0;j<this.situation.length;j++) {
           if (this.martix[i][j] != 0) continue;
           if(this.situation[i][j]==0) continue;
           else{
              let point = new Point(i,j)
              if(point.conduct_neighbor(this.situation.length,this.martix)=="diff"){
                  this.situation[i][j] =0;
              }
              if(this.situation[i][j]!=0){
                 let color = this.situation[i][j]>0?1:2;
                 if(point.conduct_neighbors(this.situation.length,this.martix,color)=="diff")
                   this.situation[i][j] =0;
              }
           }
       }
     }
   }

   //根据势力计算的结果矩阵得出黑白所围的目,先排除有子的地方，然后如果势力分数为负，则为白棋，否则为黑棋
   ComputePointNum(){
     for(let i=0;i<this.situation.length;i++){
        for(let j=0;j<this.situation.length;j++) {
          if (this.martix[i][j] != 0) continue;
          else {
              if (this.situation[i][j]<0) this.white_point++;
              else if(this.situation[i][j]>0)this.black_point++;
          }
        }
     }
   }

   //修正，判断某点是否应该加势力分数
  can_add(i,j,pi,pj){
      let color = this.martix[i][j];
      let point = new Point(pi,pj)
      if(point.conduct_neighbor(this.martix.length,this.martix)=="same") return true;
      if(i<9&&pi>i) return false;
      else if(i>=9&&pi<i) return false;
      if(j<=3&&pj>j+1) return false;
      if(j>=15&&pj<j-1) return false
      if(j>3&&j<9&&pj>j) return false;
      if(j>=9&&j<15&&pj<j) return false;
      return true;
   }
}

class Point{
  constructor(row,col){
    this.row = row;
    this.col = col;
  }
  neighbors (length) {
    let point1 = new Point(this.row + 3, this.col+2);
    let point2 = new Point(this.row + 1, this.col+2);
    let point3 = new Point(this.row+2, this.col + 3);
    let point4 = new Point(this.row+2, this.col + 1);
    let neighbor_points = [point1, point2, point3, point4];
    let true_neighbor_points = [];
    for (let i = 0; i < 4; i++) {
      if (this.is_in_board(neighbor_points[i], length))
        true_neighbor_points.push(neighbor_points[i])
    }
    return true_neighbor_points;
  }
  is_in_board(point,length){
    if(point.row<2||point.row>=length+2|| point.col<2||point.col>=length+2)
      return false;
    return true;
  }
  conduct_neighbor(length,martix){
    let point = new Point(this.row,this.col)
    let flag=0;
    let point_neighbors = point.neighbors(length);
    let w=0;
    for(w=0;w<point_neighbors.length;w++){
      let point_neighbor = point_neighbors[w];
      let row = point_neighbor.row;
      let col = point_neighbor.col;
      let c = martix[row-2][col- 2];
      if (c!= 0) {
        if (flag != 0 &&c!= flag) {
          break;
        } else {
          flag = c;
        }
      }
    }
    if(flag==0) return "empty";
    else if(w==point_neighbors.length) return "same";
    else return "diff";
  }

  conduct_neighbors(length,martix,color){
    let point = new Point(this.row,this.col)
    let flag=0;
    let point_neighbors = point.neighbors(length);
    let w=0;
    for(w=0;w<point_neighbors.length;w++) {
      let point_neighbor = point_neighbors[w];
      let row = point_neighbor.row;
      let col = point_neighbor.col;
      let c = martix[row - 2][col - 2];
      if (c != 0 && c != color)
        return "diff";
    }
    return "same"
  }
}

class GameResult{
    constructor(white_num_point,black_num_point,white_capture,black_capture,komi,situation){
        this.white_num_point = white_num_point;
        this.black_num_point = black_num_point;
        this.white_total_num = white_num_point+white_capture;
        this.black_total_num = black_num_point+black_capture;
        this.komi = parseInt(komi);
        this.lead_num = Math.abs(this.black_total_num-this.white_total_num-komi);//计算领先的绝对值
        let total_white = this.white_total_num+this.komi;
        if(this.black_total_num>total_white){
           this.result = "黑领先"+this.lead_num+"目";
        }
        else if(this.black_total_num<total_white){
           this.result="白领先" + this.lead_num + "目";
        }
        else{
          this.result="双方均等";
        }
        this.winner=this.black_total_num>this.white_total_num+komi?1:2;
        this.situation = situation;
    }
}

export default {
   Compute
}
