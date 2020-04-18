import sgfParser from "../../../../static/js/util/sgf"
function get_message(sgf) {
  let json = sgfParser.sgf2jsonMain(sgf);
  let game = {};
  let black = {};
  let white = {};
  let gameRuleList = [];
  let gameMessage = json[0][0];
  game.handicap = 0;
  game.records=[];
  for (let i in gameMessage) {
    if (gameMessage[i].key == "SZ")
      game.board_size = parseInt(gameMessage[i].value[0]);
    if (gameMessage[i].key == "PB") {
      black.level = gameMessage[i].value[0].slice(-2);
      black.name = gameMessage[i].value[0].replace(black.level, "");
    }
    if (gameMessage[i].key == "PW") {
      white.level = gameMessage[i].value[0].slice(-2);
      white.name = gameMessage[i].value[0].replace(white.level, "");
    }
    if (gameMessage[i].key == "PC")
      game.location = gameMessage[i].value[0];
    if (gameMessage[i].key == "DT")
      game.time = gameMessage[i].value[0];
    if (gameMessage[i].key == "KM") {
      game.komi = parseFloat(gameMessage[i].value[0]);
      if (game.komi > 0) {
        game.komisituation = "黒贴" + game.komi + "目";
      } else {
        game.komisituation = "白让先不贴目";
      }
    }
    if (gameMessage[i].key == "RE")
      game.result = gameMessage[i].value[0];
    if (gameMessage[i].key == "GN")
      game.name = gameMessage[i].value[0];
    if (gameMessage[i].key == "HC") {
      game.handicap = gameMessage[i].value[0];
      if (game.handicap > 0) {
        game.komisituation = "白让" + game.handicap + "子不贴目";
        game.first_player = 2;
      }
    }
  }
  gameRuleList.push(game.name);
  gameRuleList.push(game.location);
  gameRuleList.push(game.time);
  gameRuleList.push(game.komisituation)
  for (let i = 1; i < json[0].length; i++) {
    game.records.push(json[0][i][0].value[0]);
  }
  let manual_message = {game:game,black:black,white:white,gameRuleList:gameRuleList};
  return manual_message;
}

export default {
  get_message
}
