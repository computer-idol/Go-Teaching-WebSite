//四级排序制度，1.19路优先，2.每一路中积分高的优先，3.每一路积分排好后棋局状态进行中、未开始、已结束排序的优先，4.各个棋局状态中先进行的优先,最后按房间号排
function sort (data) {
  let copy_data = [...data]
  let data1 =[];
  let levels = ["9k","8k","7k","6k","5k","4k","3k","2k","1k","1D","2D","3D","4D","5D","6D","7D","8D","9D"];
  for(let i=0;i<copy_data.length;i++) {
    let play = copy_data[i];
    play.rank = levels.indexOf(play.black_player.level) + levels.indexOf(play.white_player.level)
    play.score = play.black_player.score + play.white_player.score;
    play.if_finish = play.state == "进行中" ? 2 : (play.state == "未开始" ? 1 : 0)
    play.timeout = new Date(play.time).getTime();
    play.board_size = parseInt(play.board_type);
    data1.push(play);
  }
  data1.sort(sortRule)
  return data1;
}

function sortRule (a,b) {
  if(a["board_size"]===a["board_size"]) {
    if (a["rank"] === b["rank"]) {
      if (a["score"] === b["score"]) {
        if (a["if_finish"] === b["if_finish"]) {
          return a["timeout"] > b["timeout"] ? 1 : a["timeout"] < b["timeout"] ? -1 : 0;
        } else if (a["if_finish"] > b["if_finish"])
          return -1;
        else return 1;
      } else if (a["score"] > b["score"])
        return -1;
      else return 1
    } else if (a["rank"] > b["rank"])
      return -1;
    else return 1;
  }
  else if (a["board_size"] > b["board_size"])
    return -1;
  else return 1;
}

function search (data,search_name) {
  if(search_name=="")
    return data;
  let search_data = {nameList:[],dataList:[]};
  let patten = new RegExp(search_name);
  for(let i=0;i<data.length;i++){
    const play = data[i];
    if(patten.test(play.black_player.name)){
      if(search_data.nameList.indexOf(play.black_player.name)<0)
         search_data.nameList.push(play.black_player.name);
      search_data.dataList.push(play)
    }
    else if(patten.test(play.white_player.name)){
      if(search_data.nameList.indexOf(play.white_player.name)<0)
         search_data.nameList.push(play.white_player.name);
      search_data.dataList.push(play);
    }
  }
  let sorted_play = sort(search_data.dataList);
  search_data.dataList = sorted_play;
  return search_data;
}

function filter (data,filterRule) {
  console.log(filterRule)
 let filter_data = [];
 if(filterRule==1)
   return data;
 else if(filterRule==2){
   for(let i=0;i<data.length;i++){
     const play = data[i];
     if(play.board_type=="19路")
       filter_data.push(play);
   }
 }
 else{
   for(let i=0;i<data.length;i++){
     const play = data[i];
     if(play.board_type!="19路")
       filter_data.push(play);
   }
 }
 filter_data = sort(filter_data);
 return filter_data;
}

//增加数据
function add (data,list) {
  let copy_data = [...data];
  for(let i=0;i<list.length;i++){
    const play = list[i];
    copy_data.push(play);
  }
  return sort(copy_data);
}

//删除数据，根据roomid
function remove (data,roomid) {
  let copy_data = [...data];
  for(let i=0;i<data.length;i++){
    const play = data[i];
    if(play.roomid==roomid) {
      copy_data.slice(i, 1);
      break;
    }
  }
  return sort(copy_data);
}

//根据房间修改数据状态
function changeData(data,room) {
  let copy_data = [...data];
  for(let i=0;i<data.length;i++){
    const play = data[i];
    if(play.roomid==room.roomid) {
      play.state = room.state;
      if(room.state=="已结束")
        play.result = room.result;
      copy_data[i] = play;
      break;
    }
  }
  return sort(copy_data);
}



export default {
  sort,search,filter,add,remove,changeData
}
