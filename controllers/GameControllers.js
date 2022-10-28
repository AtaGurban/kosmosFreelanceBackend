const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");

const { User } = require("../models/models");

const symbolCombination = () => {
  let symbols2 = {};
  let val = 7;
  for (let i = 0; i < 7; i++) {
    let obj = {};
    for (let j = 0; j < 7; j++) {
      obj[j] = { code: Math.floor(Math.random() * val) + 1 };
    }
    symbols2[i] = obj;
  }
  return symbols2;
};


const checkCombination = (symbols) => {
  let arrHorizontal = [];
  let resultHorizontal = [];
  for (let i = 0; i < 7; i++) {
    let code = { code: symbols[i][0].code, v: i, h: 0 };
    arrHorizontal[0] = code;
    for (let j = 1; j < 7; j++) {
      if (code.code === symbols[i][j].code) {
        arrHorizontal.push({ code: symbols[i][j].code, v: i, h: j });
        if (j === 6) {
          if (arrHorizontal.length > 1) {
            arrHorizontal.map((item, index) => {
              resultHorizontal.push({ 0: item.v, 1: item.h, code: item.code });
            });
          }
        } else {
          if (
            arrHorizontal.length > 1 &&
            code.code !== symbols[i][j + 1]?.code
          ) {
            arrHorizontal.map((item, index) => {
              resultHorizontal.push({ 0: item.v, 1: item.h, code: item.code });
            });
          }
        }
      } else {
        code = { code: symbols[i][j].code, v: i, h: j };
        arrHorizontal = [];
        arrHorizontal[0] = code;
      }
    }
    if (arrHorizontal.length < 2) {
      arrHorizontal = [];
    }
  }
  let arrVertikal = [];
  let resultVertikal = [];
  for (let i = 0; i < 7; i++) {
    let code = { code: symbols[0][i].code, v: 0, h: i };
    arrVertikal[0] = code;
    for (let j = 1; j < 7; j++) {
      if (code.code === symbols[j][i].code) {
        arrVertikal.push({ code: symbols[j][i].code, v: j, h: i });
        if (j === 6) {
          if (arrVertikal.length > 1) {
            arrVertikal.map((item, index) => {
              resultVertikal.push({ 0: item.v, 1: item.h, code: item.code });
            });
          }
        } else {
          if (arrVertikal.length > 1 && code.code !== symbols[j + 1][i]?.code) {
            arrVertikal.map((item, index) => {
              resultVertikal.push({ 0: item.v, 1: item.h, code: item.code });
            });
          }
        }
      } else {
        code = { code: symbols[j][i].code, v: j, h: i };
        arrVertikal = [];
        arrVertikal[0] = code;
      }
    }
    if (arrVertikal.length < 2) {
      arrVertikal = [];
    }
  }
  const result = [...resultHorizontal, ...resultVertikal];
  const table = {};
  let res = result
    .filter((i) => !table[`${i[0]}${i[1]}`] && (table[`${i[0]}${i[1]}`] = 1))
    .sort((a, b) => {
      return a.code - b.code;
    });
  // console.log(res);
  let filterRes = [];

  for (let i = 1; i < 8; i++) {
    let temp = res.filter((j) => i === j.code);
    if (temp.length > 3) {
      for (let j = 0; j < temp.length; j++) {
        temp[j]["pos"] = `${+temp[j][0]}${+temp[j][1]}`;
      }
      // console.log('temp',temp, 'length', temp.length);
      filterRes.push(
        temp.sort((a, b) => {
          return a.pos - b.pos;
        })
      );
      temp = [];
      // console.log('res',filterRes);
    }
    temp = [];
  }

  // let tempThree = [...filterRes]

  const checkCombinationFunc = (item, arr) => {
    let temp = [...arr];
    for (let i = 0; i < arr.length; i++) {
      if (
        ((item[0] === arr[i][0] + 1 && item[1] === arr[i][1]) ||
          (item[0] === arr[i][0] && item[1] === arr[i][1] + 1) ||
          (item[0] === arr[i][0] - 1 && item[1] === arr[i][1]) ||
          (item[0] === arr[i][0] && item[1] === arr[i][1] - 1)) &&
        !(item[0] === arr[i][0] && item[1] === arr[i][1])
      ) {
        temp.push(item);
        // console.log(item, temp[i]);
      } else if ((((+item[0]) + (+item[1])) === ((+arr[i][0]) + (+arr[i][1]))) && (arr[i]['code'] === symbols[arr[i][0]][arr[i][1]['code']])) {
        temp.push(item);
      }
    }
    return temp;
  };
  let winResult = [];
  for (let k = 0; k < filterRes.length; k++) {
    for (let j = 0; j < filterRes[k].length; j++) {
      let tempTwo = filterRes[k][j];
      let tempArr = [];
      tempArr[0] = filterRes[k][j];
      for (let i = 1; i < filterRes[k].length; i++) {
        // console.log('filterres',filterRes[k][i]);
        // console.log('temptwo',tempTwo);
        tempArr = checkCombinationFunc(filterRes[k][i], tempArr);
        // if (
        //   ((filterRes[k][i][0] === tempTwo[0] + 1 &&
        //     filterRes[k][i][1] === tempTwo[1]) ||
        //     (filterRes[k][i][0] === tempTwo[0] &&
        //       filterRes[k][i][1] === tempTwo[1] + 1) ||
        //     (filterRes[k][i][0] === tempTwo[0] - 1 &&
        //       filterRes[k][i][1] === tempTwo[1]) ||
        //     (filterRes[k][i][0] === tempTwo[0] &&
        //       filterRes[k][i][1] === tempTwo[1] - 1)) &&
        //   !(
        //     filterRes[k][i][0] === tempTwo[0] &&
        //     filterRes[k][i][1] === tempTwo[1]
        //   )
        // ) { console.log(true);
        //   if (
        //     filterRes[k][i][0] === tempTwo[0] &&
        //     filterRes[k][i][1] === tempTwo[1] + 1
        //   ) {
        //     console.log(filterRes[k][i]);
        //     tempTwo = filterRes[k][i];
        //   }
        //   if (
        //     filterRes[k][i][0] === tempTwo[0] + 1 &&
        //     filterRes[k][i][1] === tempTwo[1]
        //   ) {
        //     console.log(filterRes[k][i]);
        //     tempTwo = filterRes[k][i];
        //   }
        //   if (
        //     filterRes[k][i][0] === tempTwo[0] - 1 &&
        //     filterRes[k][i][1] === tempTwo[1]
        //   ) {
        //     console.log(filterRes[k][i]);
        //     tempTwo = filterRes[k][i];
        //   }
        //   if (
        //     filterRes[k][i][0] === tempTwo[0] &&
        //     filterRes[k][i][1] === tempTwo[1] - 1
        //   ) {
        //     console.log(filterRes[k][i]);
        //     tempTwo = filterRes[k][i];
        //   }
        //   tempArr.push(filterRes[k][i]);
        // }
      }
      let table = {};
      let tempArrTwo = tempArr.filter(
        (i) => !table[`${i[0]}${i[1]}`] && (table[`${i[0]}${i[1]}`] = 1)
      );
      // console.log(tempArrTwo);
      if (tempArrTwo.length > 3) {
        winResult.push([...tempArrTwo]);
        // console.log(winResult.length);
      }

    }
  }


  if (winResult.length === 1) {
    return winResult[0];
  } else if (winResult.length === 0) {
    return winResult;
  } else {
    return winResult[0];
  }


};

class GameControllers {
  async project(req, res, next) {
    // const { authorization } = req.headers;
    // const token = authorization.slice(7);
    const data = JSON.parse(req.body.data);
    let { request_id, bet, customVars } = data;
    const decodeToken = jwt_decode(customVars);
    const user = await User.findOne({
        where: { username: decodeToken.username },
    });
    const balance = { before: user.balance, after: user.balance };
    // let val = 9
    // const a = { 0: 0 }
    const b = { 0: 1 };
    // const ab = { 0: { a, b, } }

    const denomination = 1;
    const next_request_id = request_id ? request_id++ : 1;
    const paytable = {
      1: {
        5: 2,
        6: 5,
        7: 10,
        8: 18,
        9: 24,
        10: 27,
        11: 30,
        12: 30,
        13: 37,
        14: 37,
        15: 50,
      },
      2: {
        5: 1.2,
        6: 3,
        7: 6,
        8: 10,
        9: 12.5,
        10: 16,
        11: 20,
        12: 20,
        13: 30,
        14: 30,
        15: 35,
      },
      3: {
        5: 1,
        6: 2.5,
        7: 5,
        8: 8,
        9: 10,
        10: 12.5,
        11: 15,
        12: 15,
        13: 20,
        14: 20,
        15: 25,
      },
      4: {
        5: 0.7,
        6: 1.2,
        7: 2.5,
        8: 3.5,
        9: 7,
        10: 11,
        11: 12.5,
        12: 12.5,
        13: 15,
        14: 15,
        15: 20,
      },
      5: {
        5: 0.5,
        6: 1,
        7: 2,
        8: 3,
        9: 6,
        10: 8,
        11: 9,
        12: 9,
        13: 10,
        14: 10,
        15: 12,
      },
      6: {
        5: 0.4,
        6: 0.8,
        7: 1.5,
        8: 2.5,
        9: 4.5,
        10: 5.5,
        11: 6,
        12: 6,
        13: 7,
        14: 7,
        15: 8,
      },
      7: {
        5: 0.3,
        6: 0.7,
        7: 1.2,
        8: 2,
        9: 3.5,
        10: 3.8,
        11: 4.5,
        12: 4.5,
        13: 5,
        14: 5,
        15: 6,
      },
      8: {
        5: 0.2,
        6: 0.5,
        7: 1,
        8: 1.5,
        9: 2.5,
        10: 2.7,
        11: 3,
        12: 3,
        13: 3.5,
        14: 3.5,
        15: 5,
      },
      0: {},
    };
    const bets = {
      1: {
        0: 0.1,
        1: 0.2,
        2: 0.3,
        3: 0.5,
        4: 0.7,
        5: 1,
        6: 2,
        7: 3,
        8: 5,
        9: 7.5,
        10: 10,
        11: 20,
        12: 30,
        13: 50,
        14: 75,
        15: 100,
        16: 200,
        17: 300,
        18: 500,
      },
    }; 
    const directory = {
      paytable,
      rtp: 96.33,
    };

    const symbols = symbolCombination();
    const init = {
      bet,
      fixed_bet: bets["1"]["5"],
      ranges: { bet: bets, denomination: b },
      currency: "DEMO",
      restorestate: false,
      next_request_id,
      directory,
      symbols,
    };

    if (!request_id) {
      return res.json({ balance, denomination: b, init });
    }
    let check = checkCombination(symbols);
    let result = {};
    if (check.length > 0) {
      let pos = {};
      for (let i = 0; i < check.length; i++) {
        pos[i] = { 0: check[i][0], 1: check[i][1] };
      }
      // console.log('pos');
      let wins = {
        pos_wins: {
          0: {
            type: "group",
            code: check[0].code,
            pos,
            multiplier: 1,
            amount: 5,
            extra: {},
          },
        },
        total: 5,
      };
      const spin = {
        bet,
        fixed_bet: 1,
        type: "spin",
        symbols,
        wins,
        multiplier: 1,
        extra: { skill_scale: check.length },
        drop_ready: true,
        drop: {
          symbols,
          pos,
          drop_chain: { count: 0, wins: { total: 0 } },
        },
      };
      result = {
        balance,
        denomination: 1,
        spin,
        available_actions: { 0: "drop" },
        macro_round: { wins: { total: 5 } },
      };
    } else {
      const wins = { total: 0 };
      const spin = {
        bet,
        fixed_bet: 1,
        type: "spin",
        symbols,
        wins,
        multiplier: 1,
        extra: {
          skill_scale: 0,
          waiting_for_event: "boss_1",
          next_boss: 1,
          events_chain: {},
        },
        drop_ready: false,
        drop: {
          symbols: {},
          pos: {},
          drop_chain: { count: 0, wins: { total: 0 } },
        },
      };
      result = {
        balance,
        denomination: 1,
        spin,
        available_actions: { 0: "spin" },
        macro_round: { wins: { total: 5 } },
      };
    }

    const result0 = {
      balance: {
        before: 5340,
        after: 5345,
      },
      denomination: "1",
      spin: {
        bet: 10,
        fixed_bet: 1,
        type: "spin",
        symbols: {
          0: {
            0: {
              code: 5,
            },
            1: {
              code: 5,
            },
            2: {
              code: 5,
            },
            3: {
              code: 8,
            },
            4: {
              code: 2,
            },
            5: {
              code: 4,
            },
            6: {
              code: 7,
            },
          },
          1: {
            0: {
              code: 7,
            },
            1: {
              code: 6,
            },
            2: {
              code: 5,
            },
            3: {
              code: 4,
            },
            4: {
              code: 3,
            },
            5: {
              code: 2,
            },
            6: {
              code: 8,
            },
          },
          2: {
            0: {
              code: 6,
            },
            1: {
              code: 4,
            },
            2: {
              code: 5,
            },
            3: {
              code: 6,
            },
            4: {
              code: 7,
            },
            5: {
              code: 8,
            },
            6: {
              code: 8,
            },
          },
          3: {
            0: {
              code: 5,
            },
            1: {
              code: 4,
            },
            2: {
              code: 6,
            },
            3: {
              code: 3,
            },
            4: {
              code: 2,
            },
            5: {
              code: 2,
            },
            6: {
              code: 2,
            },
          },
          4: {
            0: {
              code: 6,
            },
            1: {
              code: 7,
            },
            2: {
              code: 1,
            },
            3: {
              code: 3,
            },
            4: {
              code: 4,
            },
            5: {
              code: 5,
            },
            6: {
              code: 6,
            },
          },
          5: {
            0: {
              code: 5,
            },
            1: {
              code: 4,
            },
            2: {
              code: 4,
            },
            3: {
              code: 4,
            },
            4: {
              code: 6,
            },
            5: {
              code: 3,
            },
            6: {
              code: 2,
            },
          },
          6: {
            0: {
              code: 6,
            },
            1: {
              code: 5,
            },
            2: {
              code: 8,
            },
            3: {
              code: 4,
            },
            4: {
              code: 7,
            },
            5: {
              code: 7,
            },
            6: {
              code: 7,
            },
          },
        },
        wins: {
          pos_wins: {
            0: {
              type: "group",
              code: 5,
              pos: {
                0: {
                  0: 0,
                  1: 0,
                },
                1: {
                  0: 0,
                  1: 1,
                },
                2: {
                  0: 0,
                  1: 2,
                },
                3: {
                  0: 1,
                  1: 2,
                },
                4: {
                  0: 2,
                  1: 2,
                },
              },
              multiplier: 1,
              amount: 5,
              extra: {},
            },
          },
          total: 5,
        },
        multiplier: 1,
        extra: {
          skill_scale: 5,
        },
        drop_ready: true,
        drop: {
          symbols: {},
          pos: {
            0: {
              0: 0,
              1: 0,
            },
            1: {
              0: 0,
              1: 1,
            },
            2: {
              0: 0,
              1: 2,
            },
            3: {
              0: 1,
              1: 2,
            },
            4: {
              0: 2,
              1: 2,
            },
          },
        },
        drop_chain: {
          count: 0,
          wins: {
            total: 0,
          },
        },
      },
      available_actions: {
        0: "drop",
      },
      macro_round: {
        wins: {
          total: 5,
        },
      },
    };

    // const result = {"balance":{"before":5048,"after":5398},"denomination":"1","spin":{"bet":10,"fixed_bet":1,"type":"spin","symbols":{"0":{"0":{"code":3},"1":{"code":8},"2":{"code":1},"3":{"code":7},"4":{"code":3},"5":{"code":6},"6":{"code":5}},"1":{"0":{"code":2},"1":{"code":8},"2":{"code":7},"3":{"code":6},"4":{"code":5},"5":{"code":4},"6":{"code":7}},"2":{"0":{"code":1},"1":{"code":7},"2":{"code":7},"3":{"code":8},"4":{"code":2},"5":{"code":3},"6":{"code":6}},"3":{"0":{"code":7},"1":{"code":6},"2":{"code":5},"3":{"code":4},"4":{"code":3},"5":{"code":2},"6":{"code":7}},"4":{"0":{"code":2},"1":{"code":3},"2":{"code":6},"3":{"code":4},"4":{"code":4},"5":{"code":4},"6":{"code":7}},"5":{"0":{"code":6},"1":{"code":5},"2":{"code":4},"3":{"code":8},"4":{"code":7},"5":{"code":2},"6":{"code":4}},"6":{"0":{"code":5},"1":{"code":5},"2":{"code":8},"3":{"code":2},"4":{"code":4},"5":{"code":7},"6":{"code":4}}},"wins":{"pos_wins":{"0":{"type":"group","code":4,"pos":{"0":{"0":2,"1":2},"1":{"0":2,"1":3},"2":{"0":2,"1":4},"3":{"0":3,"1":2},"4":{"0":3,"1":3},"5":{"0":3,"1":4},"6":{"0":4,"1":2},"7":{"0":4,"1":3},"8":{"0":4,"1":4}},"multiplier":5,"amount":350,"extra":{}}},"total":350},"multiplier":1,"extra":{"skill_scale":9,"event":"boss_1","patterns":{"0":{"from":{"code":4,"positions":{"0":{"0":2,"1":2},"1":{"0":3,"1":2},"2":{"0":4,"1":2},"3":{"0":2,"1":3},"4":{"0":3,"1":3},"5":{"0":4,"1":3},"6":{"0":2,"1":4},"7":{"0":3,"1":4},"8":{"0":4,"1":4}},"is_new":true},"to":{"code":4,"positions":{"0":{"0":2,"1":2},"1":{"0":3,"1":2},"2":{"0":4,"1":2},"3":{"0":2,"1":3},"4":{"0":3,"1":3},"5":{"0":4,"1":3},"6":{"0":2,"1":4},"7":{"0":3,"1":4},"8":{"0":4,"1":4}},"is_new":true}}},"waiting_for_event":"boss_2","next_boss":2,"events_chain":{"0":"boss_1"},"swap_positions":{"0":{"from":{"0":1,"1":5},"to":{"0":2,"1":4}},"1":{"from":{"0":4,"1":5},"to":{"0":3,"1":4}},"2":{"from":{"0":5,"1":2},"to":{"0":4,"1":2}},"3":{"from":{"0":5,"1":6},"to":{"0":2,"1":3}},"4":{"from":{"0":6,"1":4},"to":{"0":3,"1":2}},"5":{"from":{"0":6,"1":6},"to":{"0":2,"1":2}}}},"drop_ready":true,"drop":{"symbols":{"0":{"0":{"code":3},"1":{"code":8},"2":{"code":1},"3":{"code":7},"4":{"code":3},"5":{"code":6},"6":{"code":5}},"1":{"0":{"code":2},"1":{"code":8},"2":{"code":7},"3":{"code":6},"4":{"code":5},"5":{"code":4},"6":{"code":7}},"2":{"0":{"code":1},"1":{"code":7},"2":{"code":7},"3":{"code":8},"4":{"code":2},"5":{"code":3},"6":{"code":6}},"3":{"0":{"code":7},"1":{"code":6},"2":{"code":5},"3":{"code":4},"4":{"code":3},"5":{"code":2},"6":{"code":7}},"4":{"0":{"code":4},"1":{"code":4},"2":{"code":4},"3":{"code":5},"4":{"code":5},"5":{"code":5},"6":{"code":7}},"5":{"0":{"code":5},"1":{"code":4},"2":{"code":8},"3":{"code":7},"4":{"code":2},"5":{"code":5},"6":{"code":4}},"6":{"0":{"code":5},"1":{"code":8},"2":{"code":2},"3":{"code":4},"4":{"code":7},"5":{"code":5},"6":{"code":4}}},"pos":{"0":{"0":2,"1":2},"1":{"0":2,"1":3},"2":{"0":2,"1":4},"3":{"0":3,"1":2},"4":{"0":3,"1":3},"5":{"0":3,"1":4},"6":{"0":4,"1":2},"7":{"0":4,"1":3},"8":{"0":4,"1":4}}},"drop_chain":{"count":2,"wins":{"total":355}}},"available_actions":{"0":"drop"},"macro_round":{"wins":{"total":375}}}
    // проиграшная комбинация //

    // console.log(abc);
    // console.log(check);

    return res.json(result);
  }
}

module.exports = new GameControllers();
