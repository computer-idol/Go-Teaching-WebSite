import "../../js/jgoboard-master/jgoboard-master/dist/jgoboard-latest"
import Medium from "../../../static/js/jgoboard-master/jgoboard-master/medium/board"
import Large from "../../../static/js/jgoboard-master/jgoboard-master/large/board"
import MoreLarge from "../../../static/js/jgoboard-master/jgoboard-master/Morelarge/board"
import More_MoreLarge from "../../../static/js/jgoboard-master/jgoboard-master/More_Morelarge/board"
import MostLarge from "../../../static/js/jgoboard-master/jgoboard-master/Mostlarge/board"
import SgfParser from "../../../static/js/util/sgf"

function arrTrans(num, arr) {
  const newArr = [];
  while(arr.length > 0) {
    newArr.push(arr.splice(0, num));
  }
  return newArr;
}

//将字符串转成点
function strTocoord(str,cols) {
  let colStr = str.substring(0, 1);
  let rowStr = str.substring(1);
  let col = cols.indexOf(colStr);
  let row = cols.length - parseInt(rowStr, 10);
  let coord = new JGO.Coordinate(col,row);
  return coord;
}


//将点转成字符串
function coordTostr(coord,cols) {
  let str = cols[coord.i].toString() + (cols.length - coord.j).toString();
  return str;
}

//将棋盘的字母坐标转成坐标
function strTocoord2(str,cols) {
  let colStr = str.substring(0, 1);
  let rowStr = str.substring(1);
  let col = cols.indexOf(colStr);
  let row = cols.indexOf(rowStr);
  let coord = new JGO.Coordinate(col, row)
  return coord
}

//获取?后面参数
function getUrlKey(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

//根据棋盘大小选择尺寸
function choose_board_size(board_size){
  if(board_size==5)
      return MostLarge.Mostlarge
  if(board_size==7)
      return More_MoreLarge.morelarge;
  if(board_size==9)
      return MoreLarge.morelarge;
  else if(board_size==13)
      return Large.large;
  else
      return Medium.medium;
}

//根据棋盘大小选点
function get_point_num(board_size){
  if(board_size==9)
    return 5;
  else if(board_size<9)
    return 0;
  return 9;
}

function get_cols(board_size){
  let cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
  return cols.slice(0,board_size);
}
//数字转字符串，小于10就前面
function num_to_str(num){
  if(num>=0&&num<=9)
    return "0"+num
  else
    return ""+num
}

//将记录的str转为sgf格式的str
function str_to_sgf_str (str,cols) {
   console.log(str)
   let sgf_col = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'];
   let real_col = sgf_col.slice(0,cols.length);
   let row = parseInt(str.substring(1));
   let rowstr = real_col[cols.length-row].toLowerCase();
   let index = cols.indexOf(str.substring(0,1));
   let colstr = real_col[index];
   return colstr+rowstr;
}

function record_to_sgf (record) {
    let board_size = record.game.board_size;
    let black_user = record.black.name+record.black.level;
    let white_user = record.white.name+record.white.level;
    let location = "线上";
    let time = record.game.time;
    let komi = record.game.komi;
    let result = record.game.result;
    let name = "线上"+record.roomid+"号房间";
    let totalstep = record.game.records.length;
    let game_record = record.game.records;
    let handicap = record.game.handicap;
    let json = new Array(1);
    let keystr = "SZ,FF,PB,PW,PC,DT,KM,RE,GN,RO,HC";
    let keys = keystr.split(",");
    json[0] = new Array(1+totalstep);
    json[0][0] = new Array(11);
    for(let i=0;i<11;i++){
       json[0][0][i] = {};
       json[0][0][i].key =keys[i];
       json[0][0][i].value = new Array(1);
    }
    json[0][0][0].value[0] = board_size;
    json[0][0][1].value[0] = 3;
    json[0][0][2].value[0] = black_user;
    json[0][0][3].value[0] = white_user;
    json[0][0][4].value[0] = location;
    json[0][0][5].value[0] = time;
    json[0][0][6].value[0] = komi;
    json[0][0][7].value[0] = result;
    json[0][0][8].value[0] = name;
    json[0][0][9].value[0] = totalstep;
    json[0][0][10].value[0] = handicap;
    let player = record.game.first_player;
    for(let i=0;i<totalstep;i++){
       json[0][i+1] = new Array(1);
       json[0][i+1][0] = {}
       json[0][i+1][0].key = player==1?'B':'W';
       json[0][i+1][0].value = new Array(1);
       json[0][i+1][0].value[0] = str_to_sgf_str(game_record[i],this.get_cols(board_size))
       player=player==1?2:1;
    }
    console.log(json);
    return SgfParser.json2sgf(json);
}

function dateFormat(time) {
  var date=new Date(time);
  var year=date.getFullYear();
  var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
  var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
  var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
  var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
  var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
  // 拼接
  return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
}

//生成并下载sgf文件
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

//排序规则
function sortRule(name){
  return function(o1,o2){
    var value1 = o1[name];
    var value2 = o2[name];
    if(value1 < value2){
      return 1;
    } else if(value1 > value2){
      return -1;
    } else {
      return 0;
    }
  };
}

//给用户对象数组进行排序,永远把当前的用户排第一个
function sortArr(userData,msg){
    console.log(userData);
    let sort_userData = [];
    for(let i=0;i<userData.length;i++){
      if(userData[i].userid==msg.user.userid){
        sort_userData.push(userData[i]);
        userData.splice(i,1);
        break;
      }
   }
   //对局中，自己排第一，对弈方次之，可能自己也是对弈方，其余按分数排
   if(msg.type=="play"){
       if(msg.user.name==msg.black.name&&msg.user.name!=msg.white.name){
         for(let i=0;i<userData.length;i++){
           if(userData[i].name==msg.white.name){
             sort_userData.push(userData[i]);
             userData.splice(i,1);
             break;
           }
         }
       }
       else if(msg.user.name==msg.white.name&&msg.user.name!=msg.black.name){
           for(let i=0;i<userData.length;i++){
             if(userData[i].name==msg.black.name){
               sort_userData.push(userData[i]);
               userData.splice(i,1);
               break;
             }
           }
       }
       else{
           for(let i=0;i<userData.length;i++) {
             if (userData[i].name == msg.black.name) {
               sort_userData.push(userData[i]);
               userData.splice(i, 1);
             }
           }
           for(let i=0;i<userData.length;i++) {
             if(userData[i].name==msg.white.name){
               sort_userData.push(userData[i]);
               userData.splice(i,1);
             }
           }
       }
   }
   //剩余的按分数排
    userData.sort(sortRule("score"));
    for(let i=0;i<userData.length;i++){
      sort_userData.push(userData[i]);
    }
    return sort_userData;
}


export default {
   strTocoord,coordTostr,getUrlKey,strTocoord2,choose_board_size,
   get_point_num,num_to_str,record_to_sgf,dateFormat,download,sortArr,get_cols,
   arrTrans
}
