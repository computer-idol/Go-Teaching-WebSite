function sort(data,user){
  let sorted_data = [user];
  let copy_data = [...data]
  for(let i=0;i<data.length;i++){
    if(data[i].userid==user.userid){
      copy_data.splice(i,1);
    }
  }
  copy_data.sort(sortRule)
  return sorted_data.concat(copy_data);
}

function sortRule (a,b) {
  return a["score"]>b["score"]?-1:a["score"]<b["score"]?1:0;
}

function search (data,search_name,user) {
  if(search_name=="")
    return data;
  let search_data = {nameList:[],dataList:[]};
  let patten = new RegExp(search_name);
  for(let i=0;i<data.length;i++){
    const user = data[i];
    if(patten.test(user.name)){
      if(search_data.nameList.indexOf(user.name)<0)
        search_data.nameList.push(user.name);
      search_data.dataList.push(user)
    }
  }
  let sorted_user = sort(search_data.dataList,user);
  search_data.dataList = sorted_user;
  return search_data;
}

//增加数据
function add (data,list,user) {
  let copy_data = [...data];
  for(let i=0;i<list.length;i++){
    const play = list[i];
    copy_data.push(play);
  }
  return sort(copy_data,user);
}



//删除数据，根据roomid
function remove (data,user) {
  let copy_data = [...data];
  for(let i=0;i<data.length;i++){
    const play = list[i];
    if(play.userid==user.userid) {
      copy_data.slice(i, 1);
      break;
    }
  }
  return sort(copy_data,user);
}

//修改数据状态
function changeData(data,room,user) {
  let copy_data = [...data];
  for(let i=0;i<data.length;i++){
    if (data[i].userid == room.blackid||data[i].userid == room.whiteid) {
      copy_data[i].state = room.state == "进行中" ? "对弈" : "空闲";
      break;
    }
  }
  return sort(copy_data,user);
}

//修改数据状态
function changeData2(data,user,state) {
  let copy_data = [...data];
  for(let i=0;i<data.length;i++){
    if (data[i].userid == user.userid) {
      copy_data[i].state = state;
      break;
    }
  }
  return sort(copy_data,user);
}

export default {
  sort,add,remove,changeData,changeData2,search
}
