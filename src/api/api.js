const api = {
  User: {
    Login: "/user/login",
    Register: "/user/register",
    UserList: "/user/list/user",
    AIList: "/user/list/AI",
  },
  Study:{
    DifficultyList:"/study/difficulty/list",
    ChapterList:"/study/chapter/list",
    ClassList:"/study/class/list",
    TeachStepList:"/study/teachStep/list"
  },
  Evaluation:{
    EvaluationList:"/evaluation/list",
    EvaluationCreate:"/evaluation/create",
    EvaluationEnd:"/evaluation/end",
    EvaluationRecord:"/evaluation/record",
    WatchEvaluation:"/evaluation/watch"
  },
  Exercise:{
    ExerciseTypeList:"/exercise/type/list",
    ExerciseSubTypeLevelList:"/exercise/subType/list"
  },
  Play:{
    PlayRoomDetail:"/play/room/detail",
    PlayRoomList:"/play/room/list",
    PlayUserRoomList:"/play/room/user/list",
    GetAIMove:"/select-move",

  },
  Manual:{
    AddPlayer:"/manual/player/add",
    PlayerCountryList:"/manual/player/country/list",
    ManualDetail:"/manual/detail",
    ManualList:"/manual/list"
  }
}

const baseUrl = "http://localhost:8081";
const AIUrl = "http://127.0.0.1:5000"
const compute = "https://ai.yikeweiqi.com/ai/score/low"

export default{
  api,baseUrl,AIUrl,compute
}
