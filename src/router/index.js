import Vue from "vue";
import Router from "vue-router";
import Index from "@/components/Index";
import GoClass from "@/components/teach/goClass";
import Manuals from "@/components/play/manualLibrary";
import GoManual from "@/components/play/goManual";
import ExerciseBank from "@/components/exercise/exerciseBank";
import DetailExerise from "@/components/exercise/detailexercise";
import Play from "@/components/play/play";
import playUserRoom from "@/components/play/playUserRoom";
import playAIRoom from "@/components/play/playAIRoom";
import Evaluation from "@/components/evaluation/evaluation";
import EvaluationDetail from '@/components/evaluation/evaluationDetail'
import Login from "@/components/login";
import test from "@/components/test/test";
import test1 from "@/components/test/test1";
import test2 from "@/components/test/test2";
import selfPlay from "@/components/test/selfPlay";
import onlineManual from "@/components/play/onlineManual";
import agentOpt from "@/components/play/agentOpt";
import classDetail from "@/components/teach/classDetail";
import NotFound from "@/components/tools/NotFound";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: Login,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/index",
      component: Index,
    },
    {
      path: "/study",
      component: GoClass,
    },
    {
      path: "/study/detail/:chapterNum/:chapterid",
      component: classDetail,
    },
    {
      path: "/play/manualLibrary",
      component: Manuals,
    },
    {
      path: "/play/manualLibrary/:manualid",
      component: GoManual,
    },
    {
      path: "/play",
      component: Play,
    },
    {
      path: "/play/room/user/:roomid",
      component: playUserRoom,
    },
    {
      path: "/play/room/AI/:roomid",
      component: playAIRoom,
    },
    {
      path: "/play/room/manual/:roomid",
      component: onlineManual,
    },
    {
      path: "/exercise",
      component: ExerciseBank,
    },

    {
      path: "/exercise/detail/:typeid/:levelid",
      component: DetailExerise,
    },
    {
      path: "/evaluation",
      component: Evaluation,
    },
    {
      path: "/evaluation/detail/:recordid",
      component: EvaluationDetail,
    },
    {
      path: "/test",
      component: test,
    },
    {
      path: "/test1",
      component: test1,
    },
    {
      path: "/test2",
      component: test2,
    },
    {
      path: "/selfPlay",
      component: selfPlay,
    },
    {
      path: "/play/agentOpt",
      component: agentOpt,
    },
    {
      path:"*",
      component:NotFound,
    }
  ],
  mode: "history",
});
