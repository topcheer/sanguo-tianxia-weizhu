export default {
  "1": {
    "taoyuan": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei"
      ],
      "objective": "在黃巾亂兵中護住鄉勇，也讓三個陌生人的誓約經得住第一場敗仗。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "涿郡的桃花落在告示上，黃巾二字被雨浸開。三個人同時伸手去揭，指尖碰在一處。"
        },
        {
          "speaker": "liubei",
          "text": "備只有一雙草鞋、一腔熱血。二位若願同行，先把這條命借給鄉親。"
        },
        {
          "speaker": "zhangfei",
          "text": "俺有酒，有矛，最不怕把命押上！只是輸了以後，誰來替俺們收屍？"
        },
        {
          "speaker": "guanyu",
          "text": "所以今日不求同勝，先約一件事：無論誰退，另外兩人都要接他回來。"
        }
      ],
      "map": [
        {
          "id": "peach-oath",
          "title": "桃林 · 先約退路",
          "node": 1,
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "結義還不先喝酒？俺連今後埋在哪座山頭都不怕！"
            },
            {
              "speaker": "guanyu",
              "text": "不怕死容易。難的是看見兄弟敗了，肯放下自己的勝名去接。"
            },
            {
              "speaker": "liubei",
              "text": "那便把這一條放在同年同月之前。能回來，纔有下一次同行。"
            }
          ],
          "choices": [
            {
              "id": "mutual-cover",
              "text": "把“接回彼此”寫進誓約",
              "detail": "敵軍起手士氣 -1，記住互救之約",
              "effects": {
                "sow": 1,
                "fact": "taoyuan_cover"
              }
            },
            {
              "id": "village-rearguard",
              "text": "先教鄉勇辨認退路",
              "detail": "本回看破提升，記住鄉勇退路",
              "effects": {
                "keenEye": true,
                "fact": "taoyuan_rearguard"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "taoyuan-open",
          "speaker": "zhangfei",
          "text": "俺先衝！你們可別跟得太慢，叫黃巾看了笑話！",
          "at": "start"
        },
        {
          "id": "taoyuan-cover",
          "speaker": "guanyu",
          "text": "益德逼陣，玄德護住鄉勇。別三人同時向前，把退路空給敵人。",
          "at": "hand:2"
        },
        {
          "id": "taoyuan-low-oath",
          "speaker": "liubei",
          "text": "翼德，回來！你答應過，敗了也有人接，不許把誓約只用在別人身上。",
          "at": "low",
          "when": "fact:taoyuan_cover"
        },
        {
          "id": "taoyuan-low",
          "speaker": "liubei",
          "text": "別盯着倒下的旗。先看清誰還在等同伴伸手。",
          "at": "low"
        }
      ],
      "win": {
        "text": "桃花落在三隻碗裏，劉備把第四隻推給你，卻沒有請你改口叫兄長。“今日你看見我們如何開始；他日若有人走散，替我們記得回來。”",
        "hook": "桃園酒未醒，酸棗諸侯已會盟。下一杯，要在一個叫華雄的人面前保持溫熱。"
      },
      "loss": {
        "text": "酒還溫着，三人卻各自被困在一處。你終於明白，同生共死若只是同時向前，便只是三場互不相見的孤戰。",
        "clue": "史鑑 · 互救不是三人一起全押：有人逼陣，便要有人留後。重開軍資 +150，先給同伴留退路。",
        "clueFx": "supply"
      }
    },
    "sishui": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "caocao",
        "huaxiong"
      ],
      "objective": "在諸侯的輕視與華雄的連勝裏，替關羽爭到一杯仍未涼的出戰機會。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "諸侯帳中擺着十九路酒杯，關外華雄連斬兩將。第三杯酒斟好了，卻沒人肯起身。"
        },
        {
          "speaker": "caocao",
          "text": "這酒我斟。誰能取華雄首級，回來便還是溫的。"
        },
        {
          "speaker": "guanyu",
          "text": "桃園之約，不是叫兄弟替我去死。此杯請留，關某自己回來喝。",
          "when": "page:taoyuan:yeshi"
        },
        {
          "speaker": "zhangfei",
          "text": "二哥，俺替你擂鼓。你若不回來，酒再熱俺也不飲！"
        }
      ],
      "map": [
        {
          "id": "warm-cup",
          "title": "汜水關 · 杯酒爲憑",
          "node": 1,
          "lines": [
            {
              "speaker": "caocao",
              "text": "滿帳都在數華雄殺了幾人，只有雲長在看他殺完以後往哪裏回頭。"
            },
            {
              "speaker": "guanyu",
              "text": "他靠下一陣連勝壓住諸侯。若我不替自己急，他便要替我急。"
            }
          ],
          "choices": [
            {
              "id": "leave-wine",
              "text": "把酒留在帳中，不發豪言",
              "detail": "華雄起手士氣 -1，記住這杯歸約",
              "effects": {
                "sow": 1,
                "fact": "sishui_return_cup"
              }
            },
            {
              "id": "watch-reins",
              "text": "先看華雄如何勒馬回頭",
              "detail": "本回看破提升，記住他的回望",
              "effects": {
                "keenEye": true,
                "fact": "sishui_horse_reins"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "sishui-open",
          "speaker": "huaxiong",
          "text": "又來一個借酒出名的。酒冷之前，夠你敗三次。",
          "at": "start"
        },
        {
          "id": "sishui-cup",
          "speaker": "caocao",
          "text": "酒面還靜。雲長，滿帳催的是鼓，不是你的刀。",
          "at": "hand:2"
        },
        {
          "id": "sishui-low",
          "speaker": "guanyu",
          "text": "關某不急。他若只敢在連勝時揮刀，酒涼之前，急的一定是他。",
          "at": "low"
        }
      ],
      "win": {
        "text": "關羽把酒杯遞迴曹操手中，酒面仍暖。劉備替他解下染塵的披風，張飛的鼓直到此刻才停。曹操卻看向你：“方纔滿帳都急，只有你肯等他。”",
        "hook": "華雄已退，虎牢關門卻開了。呂布只問一句：方纔溫酒的人，敢不敢再來？"
      },
      "loss": {
        "text": "酒徹底冷了，帳內無人再提第二杯。你不是敗給華雄的快刀，是把“回來喝酒”誤聽成了“必須立刻贏”。",
        "clue": "史鑑 · 溫酒不是催你速勝，而是相信能回來。華雄靠連勝逼人搶攻；讓他先急，重開時其起手士氣 -1。",
        "clueFx": "sow"
      },
      "intros": {
        "huaxiong": [
          {
            "bio": "他記得上次那杯沒有涼的酒，更記得是誰沒有急。",
            "quote": "又斟酒？這次，我讓它開席便冷。",
            "when": "seen:huaxiong"
          },
          {
            "bio": "連勝讓他相信，每一個挑戰者都會比上一個更急。",
            "quote": "酒溫正好。你的首級，也正好。"
          }
        ]
      }
    },
    "hulao": {
      "cast": [
        "lvbu",
        "liubei",
        "guanyu",
        "zhangfei"
      ],
      "objective": "看清呂布的進退，在虎牢關前贏下第一場“不可能”。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "關上畫戟一指，諸侯的旗號便矮了半截。你剛到，劉備卻把一杯酒推到你面前。"
        },
        {
          "speaker": "liubei",
          "text": "我二弟的酒曾斬華雄。今日這一杯，你敢不敢接？"
        },
        {
          "speaker": "writer",
          "text": "這一頁人人知道結局。可沒有人知道，你爲何也在場。",
          "when": "!seen:lvbu"
        },
        {
          "speaker": "lvbu",
          "text": "又是你。上次沒打完的，今日一併算。",
          "when": "seen:lvbu"
        }
      ],
      "map": [
        {
          "id": "three-heroes",
          "title": "汜水 · 三英舊約",
          "node": 1,
          "lines": [
            {
              "speaker": "guanyu",
              "text": "他的強，不在每一手都進；在你怕了以後，他不必再有牌。"
            },
            {
              "speaker": "zhangfei",
              "text": "說這些作甚！俺先替你掀他一陣！"
            }
          ],
          "choices": [
            {
              "id": "allies",
              "text": "請三英掠陣",
              "detail": "軍資 +100，呂布起手士氣 -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "hulao_allies"
              }
            },
            {
              "id": "watch",
              "text": "獨自看他打完一手",
              "detail": "本回假破綻減少",
              "effects": {
                "keenEye": true,
                "fact": "hulao_watch"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "hulao-open",
          "speaker": "lvbu",
          "text": "你的籌碼像諸侯的膽子——看着不少。",
          "at": "start"
        },
        {
          "id": "hulao-read",
          "speaker": "guanyu",
          "text": "他越順，越會把強牌寫在眉上。別急着替他怕。",
          "at": "hand:2"
        },
        {
          "id": "hulao-low",
          "speaker": "lvbu",
          "text": "好！這才配叫虎牢！",
          "at": "low",
          "when": "!fact:hulao_watch"
        },
        {
          "id": "hulao-low-watch",
          "speaker": "you",
          "text": "原來“只進不退”不是勇，是他只會這一種贏法。",
          "at": "low",
          "when": "fact:hulao_watch"
        }
      ],
      "win": {
        "text": "畫戟墜地，諸侯卻沒有歡呼。劉備先扶住你，關羽拾起了那杯始終未動的酒。",
        "hook": "呂布敗走前記住了你的名字。下一次相見，不會還在虎牢。"
      },
      "loss": {
        "text": "你跟着諸侯一起退了。直到離開虎牢，你才懂：他一直在逼你把“天下第一”當成第五張公共牌。",
        "clue": "史鑑 · 呂布靠連續施壓放大恐懼；重開時，他的假破綻會減少。",
        "clueFx": "keenEye"
      },
      "intros": {
        "lvbu": [
          {
            "bio": "他記得你上一次坐在對面，也記得你怎樣贏下底池。",
            "quote": "別拿諸侯嚇唬我。你，一個人上來。",
            "when": "seen:lvbu"
          },
          {
            "bio": "虎牢關前，他把“天下無雙”當作最短的戰書。",
            "quote": "三英一起來，或你一個人來。別讓我等。"
          }
        ]
      }
    },
    "xianshan": {
      "cast": [
        "sunjian",
        "huanggai",
        "chengpu",
        "handang",
        "liubiao"
      ],
      "objective": "在峴山的竹影裏替孫堅讀出那一箭,讓江東的火種不滅在起筆。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "洛陽的餘燼未冷,傳國玉璽貼着孫堅的胸口發燙。襄陽城頭,劉表的第二支箭已經搭上弦。"
        },
        {
          "speaker": "sunjian",
          "text": "孤從長沙殺到洛陽,沒輸過一陣。劉景升憑一座城、幾支箭,就想留下江東的虎?"
        },
        {
          "speaker": "chengpu",
          "text": "主公,峴山竹密,追兵不宜盡出。不如先遣人探路,老臣壓陣。"
        },
        {
          "speaker": "huanggai",
          "text": "德謀謹慎過了頭。那「呂公」跑得連盔都歪了,再不追,劉表就真尋着援軍了!"
        },
        {
          "speaker": "writer",
          "text": "野史裏,猛虎常死於最信任自己爪牙的那一天。",
          "when": "!seen:sunjian"
        }
      ],
      "map": [
        {
          "id": "bamboo-veil",
          "title": "鄧塞 · 竹影疑兵",
          "node": 1,
          "lines": [
            {
              "speaker": "handang",
              "text": "竹影裏有人影,數不清。末將願帶義從先探,主公壓後。"
            },
            {
              "speaker": "sunjian",
              "text": "義公的話,孤聽見了。可若孤壓後,將士便會替孤慢半拍。"
            },
            {
              "speaker": "you",
              "text": "虎的膽氣在陣前,虎的活路卻常常在回頭的那一眼。"
            }
          ],
          "choices": [
            {
              "id": "scout-first",
              "text": "先遣韓當探竹,全軍緩進",
              "detail": "本回看破提升,記住竹影之疑",
              "effects": {
                "keenEye": true,
                "fact": "xianshan_scout"
              }
            },
            {
              "id": "tiger-charge",
              "text": "隨猛虎直接鑿穿竹陣",
              "detail": "軍資 +100,敵軍起手士氣 -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "xianshan_charge"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "xianshan-open",
          "speaker": "huangzu",
          "text": "孫堅!你追了兩天,箭也追了你兩天!",
          "at": "start"
        },
        {
          "id": "xianshan-slow",
          "speaker": "chengpu",
          "text": "別急着回應每一聲鼓。竹子會響,響的不都是人。",
          "at": "hand:2",
          "when": "fact:xianshan_scout"
        },
        {
          "id": "xianshan-rain",
          "speaker": "sunjian",
          "text": "箭雨將至。看旗不看他——旗倒的方向,纔是伏兵真處。",
          "at": "hand:2",
          "when": "!fact:xianshan_scout"
        },
        {
          "id": "xianshan-low",
          "speaker": "huanggai",
          "text": "主公,換馬!公覆的背,還擋得住一輪!",
          "at": "low"
        }
      ],
      "win": {
        "text": "竹影裏的箭一一落空,黃祖被按在馬下時還在喊\"不可能\"。孫堅沒有殺他,只折斷了他兩支箭:\"回去告訴劉景升,襄陽的城門,孤明年再來敲。\"江東的火種,就這樣越過了峴山。",
        "hook": "猛虎既全,江東的故事有了下一個名字——界橋的白馬,正朝幽州奔去。"
      },
      "loss": {
        "text": "箭入竹影的那一刻,你纔看清那陣\"潰逃\"有多整齊。猛虎死於追擊,而江東還要等一個少年接住這個名字。",
        "clue": "史鑑 · 黃祖的伏兵靠「亂」誘你全押:竹響時先看旗。重開後他的假破綻會減少。",
        "clueFx": "keenEye"
      },
      "intros": {
        "huangzu": [
          {
            "bio": "他記得孫堅的刀有多快,這次把伏兵埋得更深。",
            "quote": "又來一隻孫家的虎。峴山的箭,管夠。",
            "when": "seen:huangzu"
          },
          {
            "bio": "他打不過孫堅,但他認得孫堅的性子——猛虎從不繞路。",
            "quote": "江夏的箭,等這一天等了兩年。"
          }
        ],
        "caimao": [
          {
            "bio": "水軍布好了退路,他只剩一件事:別讓蔡家陪葬。",
            "quote": "這次我守水路。山裏的事,黃將軍請自便。",
            "when": "seen:caimao"
          },
          {
            "bio": "他把姐姐的枕風與姐夫的兵符都換成了籌碼。",
            "quote": "荊州的水養不了虎。將軍,別白費箭。"
          }
        ]
      }
    },
    "jieqiao": {
      "cast": [
        "gongsunzan",
        "zhaoyun",
        "quyi",
        "wenchou"
      ],
      "objective": "在界橋替白馬義從擋下先登的弩,也替趙雲掙到第一次被看清的出手。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "幽州的白馬義從號稱天下第一騎,直到界橋對岸,八百先登營沉默地張開了弩。"
        },
        {
          "speaker": "gongsunzan",
          "text": "白馬義從,衝一次,河北就安靜十年。伯圭在幽州見過最強的是狼,沒見過會等人的狼。"
        },
        {
          "speaker": "zhaoyun",
          "text": "雲自常山來,投的是守土之軍,不是送死之軍。將軍,敵陣不齊,必有後變。"
        },
        {
          "speaker": "quyi",
          "text": "騎兵?過了河,就是一排排會喘氣的靶子。",
          "when": "seen:quyi"
        },
        {
          "speaker": "wenchou",
          "text": "袁公說,河北的槍,今日要教幽州人怎麼用。",
          "when": "!seen:wenchou"
        }
      ],
      "map": [
        {
          "id": "river-read",
          "title": "界橋 · 半渡之機",
          "node": 1,
          "lines": [
            {
              "speaker": "zhaoyun",
              "text": "橋窄,馬密。若先登趁我半渡放弩,白馬再多也擠不成陣。"
            },
            {
              "speaker": "gongsunzan",
              "text": "子龍太謹慎。當年孤帶着幾十騎,就敢鑿穿鮮卑的狼羣。"
            },
            {
              "speaker": "you",
              "text": "鑿穿靠的是出其不意。今日對岸的人,專等你們衝。"
            }
          ],
          "choices": [
            {
              "id": "dismount-line",
              "text": "令前鋒下馬結盾,牽馬過橋",
              "detail": "本回看破提升,記住半渡之險",
              "effects": {
                "keenEye": true,
                "fact": "jieqiao_dismount"
              }
            },
            {
              "id": "white-storm",
              "text": "白馬全速,直撲先登",
              "detail": "軍資 +100,先登起手士氣 -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "jieqiao_storm"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "jieqiao-open",
          "speaker": "quyi",
          "text": "盾——起!弩——抬!讓幽州人見識什麼叫先登!",
          "at": "start"
        },
        {
          "id": "jieqiao-shield",
          "speaker": "zhaoyun",
          "text": "他的盾每落一次,弩就要重上一弦。數他的節拍,別數他的箭。",
          "at": "hand:2",
          "when": "fact:jieqiao_dismount"
        },
        {
          "id": "jieqiao-wen",
          "speaker": "wenchou",
          "text": "白馬亂了!河北的槍,收賬!",
          "at": "hand:3"
        },
        {
          "id": "jieqiao-low",
          "speaker": "gongsunzan",
          "text": "義從折損過半……子龍,你說得對,是伯圭急了。",
          "at": "low"
        }
      ],
      "win": {
        "text": "弩陣的節拍被你數盡,白馬分三隊輪衝,先登的盾牆終於裂開一角。文丑挺槍來救時,趙雲一槍逼住他:\"將軍的槍很穩,可惜爲驕人而用。\"袁紹的中軍退回河北,界橋兩岸,從此都知道了常山趙子龍的名字。",
        "hook": "公孫瓚勝了這一陣,卻敗給了自己的高牆。而在郿塢的鳳儀亭,另一場父子裂痕正待花開。"
      },
      "loss": {
        "text": "半渡時弩聲齊響,白馬成排倒在河裏。趙雲斷後救回公孫瓚,回頭看你一眼,沒有說話。",
        "clue": "史鑑 · 麴義的弩陣贏在「等你衝」。重開後他的假破綻減少;別在半渡時把義從全部推上。",
        "clueFx": "keenEye"
      },
      "intros": {
        "quyi": [
          {
            "bio": "他記得上一次你的白馬怎樣繞開弩陣,這次把盾壓得更低。",
            "quote": "又想繞?我的弩,不止一排。",
            "when": "seen:quyi"
          },
          {
            "bio": "他麾下八百人,人人見過血,個個不怕騎。",
            "quote": "過河吧。我的弩等你很久了。"
          }
        ],
        "wenchou": [
          {
            "bio": "顏良的名字是他的傷疤,也是他的火——他聽說那陣輸得不明不白。",
            "quote": "河北雙壁,少了一壁。今日我來補上。",
            "when": "page:baima:yeshi"
          },
          {
            "bio": "他仍不服上一陣,槍卻收起了三分輕敵。",
            "quote": "這次,我先等你過河。",
            "when": "seen:wenchou"
          },
          {
            "bio": "他與顏良並稱河北雙壁,唯一勝過顏良的,是耐心。",
            "quote": "我不急。槍比你長,我等得起。"
          }
        ]
      }
    },
    "fengyiting": {
      "cast": [
        "diaochan",
        "dongzhuo",
        "lvbu"
      ],
      "objective": "讓董卓與呂布在同一張桌上互相猜疑，替貂蟬把連環計走完最後一步。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "鳳儀亭的荷花開得極靜。董卓在亭外等美人，呂布在假山後等一個解釋，貂蟬卻只等他們同席。"
        },
        {
          "speaker": "diaochan",
          "text": "太師要我的歸順，將軍要我的誓言。今日我不答，我要他們聽見彼此的答案。"
        },
        {
          "speaker": "lvbu",
          "text": "虎牢你逼我退一步，今日若叫我再退，走的便不是我，是這整座郿塢。",
          "when": "page:hulao:yeshi"
        },
        {
          "speaker": "dongzhuo",
          "text": "奉先，咱家待你不薄。連你也要隔着珠簾看她麼？"
        }
      ],
      "map": [
        {
          "id": "two-listeners",
          "title": "鳳儀亭 · 一句話兩人聽",
          "node": 1,
          "lines": [
            {
              "speaker": "diaochan",
              "text": "他們若各自來問，我只能各答一半。同席以後，太師加註要看奉先臉色，奉先棄牌也要聽太師笑聲。"
            },
            {
              "speaker": "you",
              "text": "所以你不必騙兩個人，只要讓同一句真話有兩種聽法。"
            },
            {
              "speaker": "diaochan",
              "text": "不。我還要他們終於明白，我不是那句真話裏的酬勞。"
            }
          ],
          "choices": [
            {
              "id": "tell-dong",
              "text": "讓董卓先看見呂布的遲疑",
              "detail": "本回看破提升，記住太師的疑",
              "effects": {
                "keenEye": true,
                "fact": "fengyi_dong_doubt"
              }
            },
            {
              "id": "tell-lvbu",
              "text": "讓呂布聽見董卓的佔有",
              "detail": "敵軍起手士氣 -1，記住奉先的怒",
              "effects": {
                "sow": 1,
                "fact": "fengyi_lvbu_rage"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "fengyi-open-multi",
          "speaker": "diaochan",
          "text": "今日沒有兩張底牌，只有一道父子名分。誰先把對方當敵人，誰便替我開了局。",
          "at": "start",
          "when": "multi"
        },
        {
          "id": "fengyi-dong",
          "speaker": "dongzhuo",
          "text": "奉先，你跟她走，還是跟咱家走？想清楚再下注。",
          "at": "hand:2",
          "when": "multi"
        },
        {
          "id": "fengyi-lvbu",
          "speaker": "lvbu",
          "text": "義父口口聲聲待我不薄，原來我的一切，都記得這麼清楚。",
          "at": "hand:3",
          "when": "multi"
        },
        {
          "id": "fengyi-low",
          "speaker": "diaochan",
          "text": "別看我。看你們自己：一個怕失去權，一個怕從來不是自己。",
          "at": "low",
          "when": "multi"
        }
      ],
      "win": {
        "text": "貂蟬推開亭門，第一次不必借誰的眼色說話。董卓與呂布仍盯着彼此，直到父子之名只剩一張撕開的請帖。她沒有奔向任何一人，只把自己的路走出了郿塢。",
        "hook": "鳳儀亭一別，呂布與貂蟬都離開了郿塢。小沛來的使者卻在路上——下回，他要替兩家解仇。"
      },
      "loss": {
        "text": "董卓只當你爭寵，呂布只當你欺瞞。貂蟬摘下耳璫，沒有哭：你想替她贏下兩個男人，卻忘了她真正要贏的是不再屬於任何人的一句話。",
        "clue": "史鑑 · 別分頭猜董卓與呂布的牌；要看一人下注時另一人先望向誰。連環計的縫隙在兩人之間，重開後假破綻減少。",
        "clueFx": "keenEye"
      },
      "intros": {
        "dongzhuo": [
          {
            "bio": "郿塢的門換過鎖，他仍以爲所有真心都能收入庫中。",
            "quote": "又來挑唆？咱家這次先看你，再看奉先。",
            "when": "seen:dongzhuo"
          },
          {
            "bio": "他把恩情寫成賬簿，也要呂布用順從逐筆償還。",
            "quote": "父子同席，有什麼話不能明着說？"
          }
        ],
        "lvbu": [
          {
            "bio": "虎牢之後他肯退一次，卻不肯再讓任何人替他決定去處。",
            "quote": "上次你贏我的戟。這次，別替她選。",
            "when": "page:hulao:yeshi"
          },
          {
            "bio": "舊敗沒有磨去鋒芒，只讓他更難忍受被當作他人之物。",
            "quote": "我認得你。也認得你眼裏那種“爲我好”。",
            "when": "seen:lvbu"
          },
          {
            "bio": "方天畫戟立在亭外，他最怕的卻是亭內一句含糊的話。",
            "quote": "讓她說清楚。你也一樣。"
          }
        ]
      }
    },
    "shenting": {
      "cast": [
        "sunce",
        "taishici",
        "zhouyu",
        "chengpu"
      ],
      "objective": "在神亭嶺讓兩件兵器打完整場,替孫策與太史慈都留下體面。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "曲阿城外,斥候來報:孫策只帶十二騎,去探劉繇大營。太史慈提槍上馬,身後只跟了一個會打鼓的小卒。"
        },
        {
          "speaker": "sunce",
          "text": "人人都叫我小霸王。今日嶺上無陣無鼓,正好看看,名號底下還剩什麼。"
        },
        {
          "speaker": "taishici",
          "text": "東萊太史慈,飯都喫不飽的人,偏偏槍不輸人。戰便戰,誰怕誰!"
        },
        {
          "speaker": "zhouyu",
          "text": "伯符,神亭嶺的風向不對。這一仗打到一半,必來第三撥人。"
        }
      ],
      "map": [
        {
          "id": "no-flags",
          "title": "神亭嶺 · 無鼓之陣",
          "node": 2,
          "lines": [
            {
              "speaker": "taishici",
              "text": "此間沒有軍令,沒有陣圖。你若替誰出謀,這一架便不乾淨了。"
            },
            {
              "speaker": "sunce",
              "text": "好!那便讓開戰場。公瑾退後三十步——今日單挑,誰插手我跟誰急!"
            },
            {
              "speaker": "you",
              "text": "那我押在一旁看。看誰先露出真本事,也看誰先露出真性情。"
            }
          ],
          "choices": [
            {
              "id": "fair-watch",
              "text": "袖手旁觀,記下二人槍路",
              "detail": "本回看破提升,記住神亭槍路",
              "effects": {
                "keenEye": true,
                "fact": "shenting_watch"
              }
            },
            {
              "id": "drink-bet",
              "text": "在嶺頭擺酒,賭誰先脫力",
              "detail": "軍資 +120,二人戰意更盛",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "shenting_bet"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "shenting-open",
          "speaker": "taishici",
          "text": "小霸王,接槍!別叫旁人小看了你我!",
          "at": "start"
        },
        {
          "id": "shenting-halberd",
          "speaker": "sunce",
          "text": "好戟法!槍再快些——我孫家的手,還沒抖!",
          "at": "hand:2"
        },
        {
          "id": "shenting-armor",
          "speaker": "taishici",
          "text": "盔給你扯了,甲也快了。還想打?我陪到底!",
          "at": "hand:3"
        },
        {
          "id": "shenting-low",
          "speaker": "zhouyu",
          "text": "兩虎相爭,必有一傷——而傷的那個,明日還要守城。",
          "at": "low"
        }
      ],
      "win": {
        "text": "戟折了,甲裂了,兩人抱着兵器躺在嶺上喘氣,忽然同時大笑。太史慈翻身坐起:\"孫郎,明日陣前再見,我可不讓你。\"孫策把斷戟扔給他:\"留着。修好了,再來。\"你把嶺頭的酒分作兩碗,一碗給了贏家,一碗給了沒輸的人。",
        "hook": "神亭的笑聲未落,江東的版圖正待鋪開。而在小沛,一支畫戟又要替兩家人說和。"
      },
      "loss": {
        "text": "你的插手讓單挑變了味,兩件兵器同時指住了你。太史慈失望地收槍:\"原來讀卷人,也會掀桌。\"",
        "clue": "史鑑 · 這一頁要的不是速勝,是讓二人打滿全場。重開時,先看誰先脫力再落注。",
        "clueFx": "keenEye"
      },
      "intros": {
        "taishici": [
          {
            "bio": "上一次的戟與甲讓他記住了你的名字,也記住了你的公平。",
            "quote": "又是你。這次,借你的眼看誰更配贏。",
            "when": "seen:taishici"
          },
          {
            "bio": "他聽說過界橋那個數節拍的讀卷人,槍下便多了三分敬。",
            "quote": "數得清弩陣的人,應該也數得清我的槍。",
            "when": "page:jieqiao:yeshi"
          },
          {
            "bio": "他一生只認兩個東西:母親的教誨,和打得贏的對手。",
            "quote": "神亭嶺的風大。兵器拿穩了!"
          }
        ]
      }
    },
    "yuanshemen": {
      "cast": [
        "lvbu",
        "jiling",
        "yuanshu",
        "liubei",
        "guanyu",
        "zhangfei"
      ],
      "objective": "讓紀靈與劉備都保住退路，也逼呂布證明那一箭不是另一種恃強。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "轅門外的畫戟只有小枝可中，轅門內卻坐着兩支隨時會廝殺的大軍。呂布把弓放在桌上，先請你發牌。"
        },
        {
          "speaker": "lvbu",
          "text": "虎牢你說我只知進。今日兩家都在，看我如何用一支箭叫他們退。",
          "when": "page:hulao:yeshi"
        },
        {
          "speaker": "yuanshu",
          "text": "紀靈聽令:小沛若不下,休回淮南!孤的玉璽要配的是天下,不是一個呂布的情面。",
          "when": "!seen:yuanshu"
        },
        {
          "speaker": "jiling",
          "text": "紀某奉主公之命，不因一箭退兵。除非滿座都承認，這一箭賭得起。"
        },
        {
          "speaker": "liubei",
          "text": "備不願拿小沛百姓的命，替任何人證明箭術。"
        }
      ],
      "map": [
        {
          "id": "shared-wager",
          "title": "轅門 · 共認一注",
          "node": 1,
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "一箭便叫俺大哥免於刀兵？若射不中，俺先掀了他的弓！"
            },
            {
              "speaker": "guanyu",
              "text": "所以最難不在射中，在射失以後兩家也認這筆賬。"
            },
            {
              "speaker": "lvbu",
              "text": "那就把不中怎麼辦也說清。呂某今日不靠別人替我自信。"
            }
          ],
          "choices": [
            {
              "id": "name-the-miss",
              "text": "先說箭若不中，兩家如何收兵",
              "detail": "本回看破提升，記住共同的賭注",
              "effects": {
                "keenEye": true,
                "fact": "yuanshemen_named_miss"
              }
            },
            {
              "id": "seat-the-rivals",
              "text": "請玄德與紀靈同坐一側",
              "detail": "紀靈起手士氣 -1，記住同席之義",
              "effects": {
                "sow": 1,
                "fact": "yuanshemen_shared_seat"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "yuanmen-open",
          "speaker": "jiling",
          "text": "先別談神射。我若贏了這一手，你敢不敢也讓玄德出城一戰？",
          "at": "start"
        },
        {
          "id": "yuanmen-arrow",
          "speaker": "lvbu",
          "text": "我若射不中，自然依你。可你若只想看我出醜，便沒聽懂這局。",
          "at": "hand:2"
        },
        {
          "id": "yuanmen-low",
          "speaker": "liubei",
          "text": "紀將軍，今日要贏的不是你的軍令，是你回去以後仍能向士卒交代。",
          "at": "low"
        }
      ],
      "win": {
        "text": "箭離弦時，紀靈沒有看小枝，先看劉備。劉備把面前的刀推遠一寸，他才終於收兵。呂布大笑，只有你看見他掌心也有汗：這一箭若只是神技，救不了任何人。",
        "hook": "轅門保住了小沛，卻保不住呂布自己的下邳；而許都來的曹操，已先一步走向宛城。"
      },
      "loss": {
        "text": "箭還未離弦，紀靈與劉備已經各自起身。你忙着替呂布保證必中，忘了問另外兩人是否願意把軍令與百姓押在同一句話上。",
        "clue": "史鑑 · 和事不是兩邊都不得罪，而是先讓兩邊承認同一個賭注。箭未離弦前別說滿；重開後假破綻減少。",
        "clueFx": "keenEye"
      },
      "intros": {
        "jiling": [
          {
            "bio": "他仍不服那一箭，卻開始認真衡量箭下的另一條命。",
            "quote": "再賭可以。先把兩家的條件一字不改地說清。",
            "when": "seen:jiling"
          },
          {
            "bio": "三尖刀壓着軍令，他不能退得像一個被神箭嚇走的人。",
            "quote": "呂將軍有神射，紀某也有軍令。"
          }
        ]
      }
    },
    "wancheng": {
      "cast": [
        "caocao",
        "dianwei",
        "zhangxiu"
      ],
      "objective": "在張繡降而復叛的一夜，先看住典韋的雙戟，再替曹操留住最後一條退路。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "宛城降旗尚未收起，曹營的宴席已經唱到深夜。典韋抱着雙戟坐在帳外，只有你看見牆影裏多了一雙腳。"
        },
        {
          "speaker": "caocao",
          "text": "汜水那杯溫酒，孤至今記得。可惜今夜人心比酒涼得快，孤竟沒嚐出來。",
          "when": "page:sishui:yeshi"
        },
        {
          "speaker": "dianwei",
          "text": "主公安睡。典某不懂牌，只懂這扇門：人在，戟在，門便在。"
        },
        {
          "speaker": "zhangxiu",
          "text": "降將的酒，是不是總要低頭才配喝？曹公，你也來算算這一夜誰欠誰。"
        }
      ],
      "map": [
        {
          "id": "twin-halberds",
          "title": "宛城 · 雙戟未失",
          "node": 1,
          "lines": [
            {
              "speaker": "dianwei",
              "text": "胡車兒今夜敬了我三碗酒，眼睛卻總落在戟上。兵器若失，我拿什麼替主公爭一條退路？"
            },
            {
              "speaker": "caocao",
              "text": "張繡既降，爲何還像坐在針氈？孤是不是把“歸順”誤聽成了“無話可說”。"
            }
          ],
          "choices": [
            {
              "id": "guard-arms",
              "text": "與典韋同守雙戟和後營馬道",
              "detail": "本回看破提升，雙戟與退路同守",
              "effects": {
                "keenEye": true,
                "fact": "wancheng_arms_ready"
              }
            },
            {
              "id": "return-camps",
              "text": "讓降卒各歸舊營，不奪其械",
              "detail": "張繡起手士氣 -1，記住降卒之心",
              "effects": {
                "sow": 1,
                "fact": "wancheng_respect"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "wancheng-open",
          "speaker": "zhangxiu",
          "text": "白日你受我的降，夜裏卻當我無話可說。張繡這一槍，現在才遞出去。",
          "at": "start"
        },
        {
          "id": "wancheng-regret",
          "speaker": "caocao",
          "text": "孤錯算了張繡，還是錯算了自己？典韋，先莫讓任何人進帳。",
          "at": "hand:2"
        },
        {
          "id": "wancheng-low-ready",
          "speaker": "dianwei",
          "text": "主公先走！雙戟還在，今夜便沒有人能叫典某空手守門。",
          "at": "low",
          "when": "fact:wancheng_arms_ready"
        },
        {
          "id": "wancheng-low",
          "speaker": "dianwei",
          "text": "主公先走！莫問典某還能站多久，只問馬是否備好。",
          "at": "low"
        }
      ],
      "win": {
        "text": "雙戟仍在典韋手中，張繡的火沒能封住營門。曹操走出很遠纔回頭，第一次沒有問損失多少兵馬，只問：“典韋可還站在原處？”身後的壯漢舉了舉戟，算是回答。",
        "hook": "宛城的門守住了，曹操卻來不及學乖。他已兵臨下邳；這一次，被圍的是呂布。"
      },
      "loss": {
        "text": "雙戟被盜那刻，你才懂張繡等的不是曹操熟睡，是他把別人的屈辱當作安全。營門還亮着火，典韋沒有再退。",
        "clue": "史鑑 · 張繡決意，在他不再看曹操時便已寫下。別隻盯槍尖，先守營門與雙戟；重開後假破綻減少。",
        "clueFx": "keenEye"
      },
      "intros": {
        "zhangxiu": [
          {
            "bio": "降旗可以再次升起，被當作無聲的屈辱卻再難收回。",
            "quote": "這次莫問雙戟。先問你還肯不肯聽我說完。",
            "when": "seen:zhangxiu"
          },
          {
            "bio": "北地槍王已經降過一次，再出手時便不會留第二次猶豫。",
            "quote": "白日受降，夜裏聽槍。曹公請坐。"
          }
        ]
      }
    },
    "baimenlou": {
      "cast": [
        "lvbu",
        "chengong",
        "caocao",
        "liubei"
      ],
      "objective": "在呂布與陳宮之間找出真正的死局，決定下邳還有沒有明天。",
      "coldOpen": [
        {
          "speaker": "chengong",
          "text": "城外是曹軍，城內是渴了三日的兵。溫侯仍說，只要他肯出戰，便沒有輸。"
        },
        {
          "speaker": "lvbu",
          "text": "虎牢那次，你贏的是牌。今日敢拿命再賭一次？",
          "when": "page:hulao:yeshi"
        },
        {
          "speaker": "chengong",
          "text": "你來了。虎牢那頁我讀過——可這一回，要救的不是他的勝名。",
          "when": "page:hulao:yeshi"
        },
        {
          "speaker": "writer",
          "text": "白門樓的繩子懸在頁外。你每贏一手，它便清楚一分。"
        }
      ],
      "map": [
        {
          "id": "last-counsel",
          "title": "泗水 · 最後一策",
          "node": 1,
          "lines": [
            {
              "speaker": "chengong",
              "text": "我勸他出城，他問我出城以後還是不是呂布。你看，這纔是他的牢。"
            },
            {
              "speaker": "caocao",
              "text": "玄德也在樓上。你若救下奉先，他日誰來制他？"
            }
          ],
          "choices": [
            {
              "id": "chen-plan",
              "text": "替陳宮說完那一條退路",
              "detail": "看破提升，記住陳宮之謀",
              "effects": {
                "keenEye": true,
                "fact": "chen_plan"
              }
            },
            {
              "id": "lvbu-oath",
              "text": "讓呂布親口許諾不再輕進",
              "detail": "敵軍起手士氣 -1",
              "effects": {
                "sow": 1,
                "fact": "lvbu_oath"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "baimen-open",
          "speaker": "chengong",
          "text": "看他籌碼少於三成時。困獸會把最後一絲理智也壓上去。",
          "at": "start"
        },
        {
          "id": "baimen-low",
          "speaker": "lvbu",
          "text": "陳宮！若我這次聽了你的，世人會不會笑我？",
          "at": "low"
        },
        {
          "id": "baimen-answer",
          "speaker": "chengong",
          "text": "會。可活着的人，才輪得到被笑話。",
          "at": "low"
        }
      ],
      "win": {
        "text": "呂布終於沒有衝向城門。他摘下束髮金冠，第一次問陳宮：“往哪裏退？”下邳的哭聲停了一夜。",
        "hook": "許都青梅將熟。曹操已經聽說：天下第一沒有死，而你就在那張桌邊。"
      },
      "loss": {
        "text": "繩索收緊時，你才發現自己一直在回答“怎樣贏呂布”，卻從沒回答“呂布怎樣才肯活”。",
        "clue": "史鑑 · 陳宮看穿了困獸的節奏；重開時假破綻減少。",
        "clueFx": "keenEye"
      },
      "intros": {
        "lvbu": [
          {
            "bio": "虎牢敗過一次的呂布，更不肯承認自己已被困死。",
            "quote": "你能讓我敗，能不能讓我活？",
            "when": "page:hulao:yeshi"
          },
          {
            "bio": "泗水淹城，天下第一仍在等一個可以衝鋒的方向。",
            "quote": "讓開。我再去殺一條路。"
          }
        ],
        "chengong": [
          {
            "bio": "他不是來替呂布求勝，是來替下邳求一條退路。",
            "quote": "若只會贏牌，你救不了他。"
          }
        ]
      }
    },
    "zhujiu": {
      "cast": [
        "caocao",
        "liubei",
        "lvbu"
      ],
      "objective": "藏住自己的答案，也聽清曹操沒有說出口的那一句。",
      "coldOpen": [
        {
          "speaker": "caocao",
          "text": "白門樓上你替他選了一條活路。今日這杯酒，我想知道你替自己選什麼。",
          "when": "page:baimenlou:yeshi"
        },
        {
          "speaker": "liubei",
          "text": "他若提起奉先，別急着答。先聽他把天下說到第幾個人。",
          "when": "page:baimenlou:yeshi"
        },
        {
          "speaker": "caocao",
          "text": "白門樓一別，玄德愈發謹慎了。謹慎的人，最適合對酌。",
          "when": "page:baimenlou:history"
        },
        {
          "speaker": "narrator",
          "text": "青梅過小盞，遠處一聲雷。你忽然明白，這桌酒沒有一題是問天下。"
        }
      ],
      "map": [
        {
          "id": "green-plum",
          "title": "青梅亭 · 未問先答",
          "node": 1,
          "lines": [
            {
              "speaker": "liubei",
              "text": "他說你是英雄時，你若只謙虛，他便知道你聽懂了。"
            },
            {
              "speaker": "you",
              "text": "那我該裝作不懂？"
            },
            {
              "speaker": "liubei",
              "text": "不。讓他以爲你只懂牌。"
            }
          ],
          "choices": [
            {
              "id": "thunder",
              "text": "借雷聲藏住神情",
              "detail": "曹操起手士氣 -1",
              "effects": {
                "sow": 1,
                "fact": "thunder_mask"
              }
            },
            {
              "id": "watch-cao",
              "text": "反問他白門樓最怕什麼",
              "detail": "本回看破提升",
              "effects": {
                "keenEye": true,
                "fact": "watch_cao"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "zhujiu-open",
          "speaker": "caocao",
          "text": "牌如人。先看，莫急着認。",
          "at": "start"
        },
        {
          "id": "zhujiu-mid",
          "speaker": "caocao",
          "text": "今天下英雄——你覺得，我會先說誰？",
          "at": "hand:2"
        },
        {
          "id": "zhujiu-low",
          "speaker": "liubei",
          "text": "雷要來了。你該落筷了。",
          "at": "low"
        }
      ],
      "win": {
        "text": "筷落，雷止。曹操笑着替你斟酒，沒有再問第二遍。劉備知道，方纔有一瞬，你們三人都看見了彼此的底牌。",
        "hook": "關羽即將掛印封金。許都這一局，曹操記住了你的藏鋒。"
      },
      "loss": {
        "text": "你回答了“誰是英雄”，卻沒聽出他真正問的是“你願不願與我爲敵”。酒未毒，話已經把你圍住。",
        "clue": "史鑑 · 曹操會在第二手開始讀你的下注；重開時他的假破綻減少。",
        "clueFx": "keenEye"
      },
      "intros": {
        "caocao": [
          {
            "bio": "他記得白門樓的每一個選擇，尤其記得你讓誰活了下來。",
            "quote": "奉先未死，玄德在座。今日英雄，恐怕不止兩個。",
            "when": "page:baimenlou:yeshi"
          },
          {
            "bio": "青梅煮酒，他把每個人的野心都當作可以試出的底牌。",
            "quote": "莫怕雷。怕我接下來這句。"
          }
        ]
      }
    },
    "baima": {
      "cast": [
        "guanyu",
        "caocao",
        "guojia",
        "xunyu",
        "yanliang",
        "wenchou"
      ],
      "objective": "在白馬與延津兩陣之間,替關羽把兩場大功,贏成一條回家的路。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "白馬坡前,顏良連斬宋憲魏續,二十合敗徐晃,曹營諸將慄然。曹操把目光投向了那個始終背對着戰報的人。"
        },
        {
          "speaker": "caocao",
          "text": "雲長,孤知道你人在心不在。可顏良的刀,如今懸在孤所有將軍的頭上。"
        },
        {
          "speaker": "guanyu",
          "text": "關某答應過,立功便走。此陣之後,請丞相守信——備的下落,孤已聽說了。"
        },
        {
          "speaker": "guojia",
          "text": "顏良之勇不可力敵,文丑之躁可以計取。奉孝只擔心一件事:雲長這兩刀砍完,天下再無人留得住他。",
          "when": "!seen:guojia"
        },
        {
          "speaker": "yanliang",
          "text": "曹營無人了嗎?叫那個紅臉的馬弓手上來看看。",
          "when": "!seen:yanliang"
        }
      ],
      "map": [
        {
          "id": "two-blades",
          "title": "黎陽 · 兩陣之間",
          "node": 1,
          "lines": [
            {
              "speaker": "xunyu",
              "text": "顏良兵精而不識變,文丑勇而性躁。兩陣之間,真正要讀的是雲長的心。"
            },
            {
              "speaker": "guanyu",
              "text": "荀令君放心。關某的刀只爲丞相砍這一回,砍完,便去尋兄。"
            },
            {
              "speaker": "you",
              "text": "兩陣兩刀,刀刀都要乾淨。拖泥帶水,走的路就長了。"
            }
          ],
          "choices": [
            {
              "id": "feed-few",
              "text": "以老弱爲餌,佯棄輜重",
              "detail": "文丑軍起手軍資 -200,記住餌兵之計",
              "effects": {
                "raid": true,
                "fact": "baima_bait"
              }
            },
            {
              "id": "watch-blade",
              "text": "陪關羽先看清顏良的麾蓋",
              "detail": "本回看破提升,記住麾蓋之下",
              "effects": {
                "keenEye": true,
                "fact": "baima_watch"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "baima-open",
          "speaker": "yanliang",
          "text": "又來?宋憲魏續的刀,還在我馬上掛着!",
          "at": "start"
        },
        {
          "id": "baima-ride",
          "speaker": "narrator",
          "text": "赤兔馬從土山後轉出,顏良的麾蓋在陣前孤零零亮着——他想問來將何人,刀已經到了。",
          "at": "hand:2",
          "when": "fact:baima_watch"
        },
        {
          "id": "baima-clash",
          "speaker": "guanyu",
          "text": "麾蓋之下,便是他要護的軍心。破了他的旗,這一陣就完了。",
          "at": "hand:2",
          "when": "!fact:baima_watch"
        },
        {
          "id": "baima-wen",
          "speaker": "wenchou",
          "text": "馬快!文丑的槍還沒熱,你跑什麼?!",
          "at": "hand:3"
        },
        {
          "id": "baima-low",
          "speaker": "guojia",
          "text": "兩陣之間最忌戀戰。雲長,酒在這裏,路也在這裏。",
          "at": "low"
        }
      ],
      "win": {
        "text": "白馬的麾蓋倒下時,延津的文丑還在馬蹄聲裏數你的節拍。兩陣兩刀,乾淨得像關羽的刀背。曹操親斟的酒他沒有喝,只拱了拱手:\"丞相,關某去也。\"袖中那封尋兄的書信,終於用上了。",
        "hook": "兩陣大功換來一紙放行。前方五關六將,沒有一人讀過這封信。"
      },
      "loss": {
        "text": "第一陣的勝利讓你貪了第二陣的快。文丑的鐵騎漫過河灘時,你纔想起郭嘉那句\"兩陣之間,真正要讀的是雲長的心\"。",
        "clue": "史鑑 · 顏良輸給輕敵,文丑贏在等你急。重開時先棄輜重亂其軍心:文丑起手軍資 -200。",
        "clueFx": "raid"
      },
      "intros": {
        "yanliang": [
          {
            "bio": "他記得那次快得看不清的刀光,這次把營壘扎得更深。",
            "quote": "那口刀……這次,我要看清它來路。",
            "when": "seen:yanliang"
          },
          {
            "bio": "河北第一刀,連勝讓他相信天下沒有第二口更快的刀。",
            "quote": "連營十里,誰來誰死。"
          }
        ],
        "wenchou": [
          {
            "bio": "界橋之後他學會等,延津卻又要他追——他最恨這種矛盾。",
            "quote": "你教會我數節拍。那這次,換你數我的馬蹄。",
            "when": "seen:wenchou"
          },
          {
            "bio": "爲顏良復仇的心比槍更重,輜重散落一地也攔不住他的衝鋒。",
            "quote": "白馬的賬,延津清。"
          }
        ],
        "songxian": [
          {
            "bio": "他從呂布的舊夢裏醒來,急着向新主證明自己。",
            "quote": "溫侯舊部,不是孬種!看我的!"
          }
        ]
      }
    },
    "qianli": {
      "cast": [
        "guanyu",
        "liubei",
        "zhangfei",
        "caocao",
        "kongxiu",
        "hanfu",
        "bianxi",
        "wangzhi",
        "qinqi"
      ],
      "objective": "護送車仗穿過五關，辨認孔秀、韓福、卞喜、王植、秦琪各自的攔法，把最後一點氣力留給古城重逢。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "許都城門在身後，印綬高懸，金帛未動。關羽只帶車仗與一柄不願再受人情的刀。"
        },
        {
          "speaker": "caocao",
          "text": "那日煮酒，玄德借雷藏鋒；今日雲長要去尋他，孤該放行，還是再留一頓酒？",
          "when": "page:zhujiu:yeshi"
        },
        {
          "speaker": "guanyu",
          "text": "丞相之義，關某記在心裏；兄長之約，卻在前面等我。"
        },
        {
          "speaker": "liubei",
          "text": "雲長，見字如面。莫以我爲念，亦莫以我爲負。能來便來，古城有人等你。"
        }
      ],
      "map": [
        {
          "id": "two-kinds-of-gates",
          "title": "洛陽 · 明暗兩關",
          "node": 2,
          "lines": [
            {
              "speaker": "guanyu",
              "text": "孔秀要文憑，韓福藏冷箭，卞喜卻把酒擺到佛前。關隘不同，攔人的理由也不同。"
            },
            {
              "speaker": "narrator",
              "text": "車仗裏沒有催促。關羽回望來路，把刀從右手換到左手，只爲讓趕車的人安心。"
            }
          ],
          "choices": [
            {
              "id": "share-rations",
              "text": "以乾糧換百姓口述五關地形",
              "detail": "本回看破提升，記住沿途人心",
              "effects": {
                "keenEye": true,
                "fact": "qianli_guides"
              }
            },
            {
              "id": "guard-the-rear",
              "text": "親自斷後，讓車仗先行",
              "detail": "守將起手士氣 -1，記住斷後之諾",
              "effects": {
                "sow": 1,
                "fact": "qianli_rearguard"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "qianli-kongxiu",
          "speaker": "kongxiu",
          "text": "東嶺關只認丞相文憑，不認你的舊名。沒有文書，青龍刀也得留下。",
          "at": "start",
          "when": "round:1"
        },
        {
          "id": "qianli-hanfu",
          "speaker": "hanfu",
          "text": "關將軍，韓某敬你之名，卻不能棄守關之責。這一箭之後，莫怪我。",
          "at": "start",
          "when": "round:2"
        },
        {
          "id": "qianli-bianxi",
          "speaker": "bianxi",
          "text": "鎮國寺酒已溫。將軍把刀留在佛前，卞某便讓你看一條平安路。",
          "at": "start",
          "when": "round:3"
        },
        {
          "id": "qianli-wangzhi",
          "speaker": "wangzhi",
          "text": "滎陽館舍潔淨，夜色也長。將軍何不住下，等我把各處的門都替你關好？",
          "at": "start",
          "when": "round:4"
        },
        {
          "id": "qianli-qinqi",
          "speaker": "qinqi",
          "text": "黃河在此。四關的人情到這裏用盡；秦琪只認夏侯將軍的軍令。",
          "at": "start",
          "when": "round:5"
        },
        {
          "id": "qianli-no-sixth-grave",
          "speaker": "guanyu",
          "text": "五關各有鎖，人心卻未必都是鎖。能繞過的殺念，便別把它變成第六座墳。",
          "at": "hand:2"
        },
        {
          "id": "qianli-drums",
          "speaker": "zhangfei",
          "text": "二哥，聽見鼓沒有？五關不必再替誰守了，回來與俺擊這一面！",
          "at": "low",
          "when": "round:5"
        }
      ],
      "win": {
        "text": "秦琪倒下時，黃河浪聲蓋過了刀聲。關羽沒有數第五顆首級，只回身扶穩車仗。古城門下，張飛扔了鼓槌便來抱馬；劉備趕到時，關羽只說“來遲了”。三雙眼睛都在回答：回來便好。",
        "hook": "古城鼓聲未歇，北方的袁曹已經相持。下一場不再是一人過五關，而是兩軍爭一口氣。"
      },
      "loss": {
        "text": "你在某一關贏得了刀光，卻把車仗、籌碼與歸期都留在身後。千里最難的從不是殺出一條直路，是到古城時仍有資格說一句“都平安”。",
        "clue": "史鑑 · 孔秀耗令、韓福冷箭、卞喜設宴、王植借火、秦琪守渡。五關共用一條命，莫爲一關押盡路費；重開軍資 +150。",
        "clueFx": "supply"
      },
      "intros": {
        "kongxiu": [
          {
            "bio": "東嶺關的鎖只認文書，他把職責守得比性命更窄。",
            "quote": "沒有丞相文憑，關雲長也不能過。"
          }
        ],
        "hanfu": [
          {
            "bio": "他把敬重藏在弓弦後，放箭之前仍想保住一份舊情。",
            "quote": "關將軍，韓某敬你，卻不能棄關。"
          }
        ],
        "bianxi": [
          {
            "bio": "鎮國寺的香火壓不住殺氣，他的平安路只通向埋伏。",
            "quote": "刀留佛前，酒入口中，將軍便可安睡。"
          }
        ],
        "wangzhi": [
          {
            "bio": "滎陽的館舍過於齊整，每一扇門都已想好何時上鎖。",
            "quote": "夜長路遠，何不住到火起——住到天明？"
          }
        ],
        "qinqi": [
          {
            "bio": "黃河渡口的最後一道軍令，他把舊交與風浪都擋在岸上。",
            "quote": "過了四關又如何？黃河只認秦某這一面旗。"
          }
        ]
      }
    }
  },
  "2": {
    "guandu": {
      "cast": [
        "caocao",
        "yuanshao",
        "guojia",
        "xuyou",
        "tianfeng",
        "jushou"
      ],
      "objective": "讓袁紹的雄厚軍資變成遲疑，在盲注吞盡曹軍之前找到烏巢真正的軟肋。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "官渡的糧簿比戰報更薄。曹操每劃掉一日，袁紹帳中便多一位自稱有策的謀士。"
        },
        {
          "speaker": "yuanshao",
          "text": "孟德，你我自幼相識。你的脾氣我清楚，你的糧草，我更清楚。"
        },
        {
          "speaker": "caocao",
          "text": "雲長終究還是去找玄德了。孤留得住赤兔，留不住人心；本初，你卻連人心都未看清。",
          "when": "page:qianli:yeshi"
        },
        {
          "speaker": "guojia",
          "text": "明公，袁氏十勝十敗之說，嘉只敢保證前九。最後一勝，要你親自去贏。"
        },
        {
          "speaker": "tianfeng",
          "text": "主公若勝，豐必死；若敗，豐亦死。冀州的牢裏，元皓已替你們把話寫好了。",
          "when": "!seen:tianfeng"
        },
        {
          "speaker": "caocao",
          "text": "許攸來了便請他坐。孤可以只穿一隻鞋迎他，卻不能讓全軍看見孤只剩三日糧。"
        }
      ],
      "map": [
        {
          "id": "true-ledger",
          "title": "官渡 · 真賬假賬",
          "node": 2,
          "lines": [
            {
              "speaker": "caocao",
              "text": "許攸問孤還有幾糧。孤若說實話，他或許給烏巢；若說假話，他今夜便會走。"
            },
            {
              "speaker": "narrator",
              "text": "帳外袁紹的催戰鼓一聲近過一聲。曹操把真賬推給你：這回要燒的不是糧，是他讓別人替自己作主的習慣。"
            }
          ],
          "choices": [
            {
              "id": "true-account",
              "text": "以真實糧數換許攸一句真話",
              "detail": "本回看破提升，記住赤足相迎",
              "effects": {
                "keenEye": true,
                "fact": "guandu_true_account"
              }
            },
            {
              "id": "feint-wuchao",
              "text": "分兵佯攻，只留烏巢一路實棋",
              "detail": "袁紹起手軍資 -200，記住烏巢奇襲",
              "effects": {
                "raid": true,
                "fact": "guandu_feint"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "guandu-open",
          "speaker": "yuanshao",
          "text": "你每一手都在算還能活幾日，我只需等。河北最不怕的，就是多開一次軍議。",
          "at": "start"
        },
        {
          "id": "guandu-old-friend",
          "speaker": "caocao",
          "text": "本初，你不是不知該聽誰，是隻怕聽錯以後無人可怪。",
          "at": "hand:2"
        },
        {
          "id": "guandu-unsigned",
          "speaker": "narrator",
          "text": "烏巢未燃，河北諸將卻都在等別人先改口。千條計策，忽然沒有一條肯署名。",
          "at": "hand:3"
        },
        {
          "id": "guandu-low",
          "speaker": "yuanshao",
          "text": "田豐、沮授、許攸……究竟是誰誤我？孟德，你先說！",
          "at": "low"
        }
      ],
      "win": {
        "text": "烏巢沒有火，袁紹帳中的燈卻一盞盞滅了。曹操沒有趁勝追罵舊友，只把寫滿虛假餘糧的賬簿合上：“本初，你輸在人人都在等別人先認。”",
        "hook": "北方將定，劉備卻在新野等一場雪。曹操已有謀士滿帳，他連一個肯開門的人還未尋到。"
      },
      "loss": {
        "text": "烏巢的火終究沒有燒起來。袁紹仍坐在成堆軍報之後，每一份都有道理，每一份都不必由他負責。你的糧卻真的一日日盡了。",
        "clue": "史鑑 · 袁紹的籌碼多不是弱點，怕獨自擔責纔是。逼他在盲注升高前自己選；重開先劫烏巢，敵軍軍資 -200。",
        "clueFx": "raid"
      },
      "intros": {
        "yuanshao": [
          {
            "bio": "他聽說青梅亭只論了劉曹，偏要把舊友局變成天下的答辯。",
            "quote": "孟德，今日再數一次英雄，可還有袁本初？",
            "when": "page:zhujiu:yeshi"
          },
          {
            "bio": "他仍帶千軍與滿腹計策歸來，仍缺一個肯爲決定署名的人。",
            "quote": "上次衆議未決。這次，你聽誰？",
            "when": "seen:yuanshao"
          },
          {
            "bio": "四世三公給了他太多謀士，也給了他永遠不必先認錯的位置。",
            "quote": "河北兵精糧足。孟德，你拿什麼拖？"
          }
        ]
      }
    },
    "sangu": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "zhuge"
      ],
      "objective": "讓三次敲門各有來意：前兩次無論勝敗都肯再訪，第三次才聽懂臥龍真正要問的天下。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "新野到隆中的路，劉備已經走過兩遍。張飛把第三次風雪叫作折騰，關羽卻替兄長又撣了一遍名刺。"
        },
        {
          "speaker": "zhangfei",
          "text": "二哥千里回來，俺才懂路遠不怕。可一個先生，憑什麼叫俺們走三回？",
          "when": "page:qianli:yeshi"
        },
        {
          "speaker": "liubei",
          "text": "因爲他若肯爲百姓出山，備多走幾次，又算得了什麼。"
        },
        {
          "speaker": "guanyu",
          "text": "勝敗可以催，開門不能催。翼德，把火摺子收起來。"
        }
      ],
      "map": [
        {
          "id": "leave-the-door-unforced",
          "title": "隆中 · 門不可催",
          "node": 1,
          "lines": [
            {
              "speaker": "liubei",
              "text": "今日若仍不見，備便把名刺留下。求賢不是叫天下人都按劉備的時辰起身。"
            },
            {
              "speaker": "zhangfei",
              "text": "那俺在外面等！若等得不耐煩，便數雪，不數他的過錯。"
            },
            {
              "speaker": "guanyu",
              "text": "你能這樣等，大哥這一趟便已沒有白來。"
            }
          ],
          "choices": [
            {
              "id": "disarm-and-wait",
              "text": "命全軍解甲，只在門外靜候",
              "detail": "臥龍起手士氣 -1，記住解甲之禮",
              "effects": {
                "sow": 1,
                "fact": "sangu_disarmed_wait"
              }
            },
            {
              "id": "ask-the-sleep",
              "text": "不問天下，先問先生睡得可安穩",
              "detail": "本回看破提升，記住不催之問",
              "effects": {
                "keenEye": true,
                "fact": "sangu_gentle_question"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "sangu-first-door",
          "speaker": "unknown",
          "text": "第一顧，先生不在。你可以贏這一局，卻不能替他答應相見。",
          "at": "start",
          "when": "round:1"
        },
        {
          "id": "sangu-first-return",
          "speaker": "zhangfei",
          "text": "輸了便輸了，大哥，俺們明日再來。總比在這裏替他守門強！",
          "at": "hand:2",
          "when": "round:1"
        },
        {
          "id": "sangu-second-snow",
          "speaker": "unknown",
          "text": "第二顧，雪滿草廬。你昨日又來了——這一次，你爲求勝，還是爲求人？",
          "at": "start",
          "when": "round:2"
        },
        {
          "id": "sangu-second-intent",
          "speaker": "liubei",
          "text": "雲長，翼德，雪大便靠近些。先生可以不見，我們不可失了來意。",
          "at": "hand:2",
          "when": "round:2"
        },
        {
          "id": "sangu-third-reveal",
          "speaker": "zhuge",
          "text": "前兩局的書童與冷遇，都是亮借來問你的：勝後會不會狂，敗後還肯不肯來。你來了三次，門便該開了。",
          "at": "start",
          "when": "round:3"
        },
        {
          "id": "sangu-third-world",
          "speaker": "zhuge",
          "text": "現在莫問牌。將軍要荊益二州，還是要一個讓百姓不必再逃的天下？",
          "at": "hand:2",
          "when": "round:3"
        },
        {
          "id": "sangu-third-answer",
          "speaker": "liubei",
          "text": "先生若不出山，備仍去；先生若肯同行，這條路便不只屬於備。",
          "at": "hand:3",
          "when": "round:3"
        }
      ],
      "win": {
        "text": "諸葛亮把荊襄與益州寫在同一盞燈下，卻沒有寫下誰是主、誰是客。劉備起身長揖，關羽收刀，張飛替你搬來第四張凳子：這一局，終於不是爲了請誰認輸。",
        "hook": "隆中對策已定，曹操的先鋒也到了新野。臥龍出山第一把火，要先讓最不服他的兩個人心服。"
      },
      "loss": {
        "text": "第三顧你終於見到隆中圖，卻還在翻前兩局的舊賬。諸葛亮收扇不語：耐心不是多走兩趟，是見到答案以後仍肯聽別人說完。",
        "clue": "史鑑 · 前兩顧輸了也會再訪，不必爲每陣強撐；把氣力留到第三顧。重開軍資 +150。",
        "clueFx": "supply"
      },
      "intros": {
        "zhuge": [
          {
            "bio": "博望之後，他不再只看你有沒有耐心，也看你能否容別人立功。",
            "quote": "草堂一別，你已會退。今日可還肯等？",
            "when": "page:bowang:yeshi"
          },
          {
            "bio": "前兩顧的輸贏他都記得，唯獨不拿它們當開門的鑰匙。",
            "quote": "勝敗我看見了。今日，你爲何還來？",
            "when": "seen:zhuge"
          },
          {
            "bio": "他在門後聽了兩次風雪，第三次才把天下襬上桌。",
            "quote": "將軍請進。先莫問天下，可還坐得住？"
          }
        ]
      }
    },
    "bowang": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "zhaoyun",
        "zhuge",
        "xiahoudun"
      ],
      "objective": "讓關羽張飛心服用兵，讓夏侯惇把每一次追擊都當成自己的主意。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "博望坡的草幹得正好。諸葛亮把火摺子壓在地圖下，先給每個人派了一條必須敗着走完的路。"
        },
        {
          "speaker": "zhangfei",
          "text": "三顧時俺服的是大哥的禮。今日你若只會叫俺退，俺可不服！",
          "when": "page:sangu:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "益德，退到你能聽見雲長的金聲便停。火攻之前，先莫把誘餌做成真敗。"
        },
        {
          "speaker": "liubei",
          "text": "備請先生出山，不是請他替你們逞強，是請他教你們不必白白逞強。"
        }
      ],
      "map": [
        {
          "id": "planned-retreat",
          "title": "博望坡 · 退到何處",
          "node": 1,
          "lines": [
            {
              "speaker": "guanyu",
              "text": "軍師要我們各退幾步，卻連停在哪一棵樹後都寫清了。看來這“敗”字，比勝還難演。"
            },
            {
              "speaker": "zhaoyun",
              "text": "我的槍先露給夏侯惇。他若咬住我，雲長與翼德才有真正的伏兵。"
            },
            {
              "speaker": "zhangfei",
              "text": "好！俺便輸得像些。可誰先忍不住真逃，誰回來替全軍洗矛！"
            }
          ],
          "choices": [
            {
              "id": "brothers-ambush",
              "text": "令雲長益德互以金聲爲號",
              "detail": "夏侯惇起手士氣 -1，記住兄弟伏兵",
              "effects": {
                "sow": 1,
                "fact": "bowang_brothers_ambush"
              }
            },
            {
              "id": "zhaoyun-route",
              "text": "與子龍逐段走完誘敵退路",
              "detail": "本回看破提升，記住每段伏兵",
              "effects": {
                "keenEye": true,
                "fact": "bowang_zhaoyun_route"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "bowang-open",
          "speaker": "xiahoudun",
          "text": "劉玄德新得軍師，便只會後退？那我便一路追到你們無坡可伏。",
          "at": "start"
        },
        {
          "id": "bowang-bait",
          "speaker": "zhaoyun",
          "text": "夏侯惇已咬住我的槍。軍師，火還未到嗎？",
          "at": "hand:2"
        },
        {
          "id": "bowang-wait",
          "speaker": "zhuge",
          "text": "不急。他還在贏，纔會繼續追；火要燒的是他確信自己正確的這一刻。",
          "at": "hand:3"
        },
        {
          "id": "bowang-low",
          "speaker": "zhangfei",
          "text": "俺懂了！這一退不是把路讓給他，是把他的路越讓越窄。",
          "at": "low"
        }
      ],
      "win": {
        "text": "張飛先收矛，關羽隨後抱拳。諸葛亮沒有受這一拜，只把燒彎的軍旗交給子龍。劉備笑了：從今日起，他們爭的不是誰先來，是誰肯最後一個退。",
        "hook": "博望的火讓曹軍記住了新野。下一回來得更快：子龍將抱着阿斗，從熟悉的伏兵圖裏反向殺出。"
      },
      "loss": {
        "text": "夏侯惇沒有衝進火裏，因爲你的敗退太像真的敗退：伏兵急着救，誘兵忘了停。博望坡只剩煙，沒有一個曹軍走進計中。",
        "clue": "史鑑 · 退不是逃；每次示弱都要保留下一段伏兵與回本的錢。重開軍資 +150，別把誘敵變成真敗。",
        "clueFx": "supply"
      },
      "intros": {
        "xiahoudun": [
          {
            "bio": "他記得上一次的伏兵，卻仍不願承認追擊也能被人牽着走。",
            "quote": "同一道坡，我不會再替你看第二次。",
            "when": "seen:xiahoudun"
          },
          {
            "bio": "獨目只肯向前看，他把每一次後退都讀成敵人的膽怯。",
            "quote": "新野若只有火，便讓它先燒劉備自己。"
          }
        ]
      }
    },
    "changban": {
      "cast": [
        "liubei",
        "zhaoyun",
        "zhangfei",
        "caocao",
        "xiahoudun",
        "zhanghe",
        "wenpin"
      ],
      "objective": "在曹操、夏侯惇、張郃同桌追剿下，讓趙雲帶回阿斗、張飛守住當陽橋。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "長坂的塵土裏，百姓、輜重和敗兵擠成一條路。趙雲逆向而行，張飛卻勒馬停在橋頭。"
        },
        {
          "speaker": "zhaoyun",
          "text": "主公，夫人與阿斗還在後面。雲去去便回——若不回，翼德替我守橋。"
        },
        {
          "speaker": "zhangfei",
          "text": "俺不要你替！回來，自己守！"
        },
        {
          "speaker": "wenpin",
          "text": "常山趙子龍……文聘奉命攔截，卻不忍逼之過死。這一槍，聘自留三分。",
          "when": "!seen:wenpin"
        },
        {
          "speaker": "caocao",
          "text": "傳令，趙雲要活的。至於橋上的黑臉將軍——孤要親自看看，他憑什麼叫三軍停下。"
        }
      ],
      "map": [
        {
          "id": "rescue-route",
          "title": "當陽 · 逆行人潮",
          "node": 1,
          "lines": [
            {
              "speaker": "liubei",
              "text": "子龍，備不能命你舍百姓而救我兒。若只帶回阿斗，卻把他們留在刀下，這仗仍是我敗。"
            },
            {
              "speaker": "zhaoyun",
              "text": "雲明白。七進七出不是七次逞勇，是每一次回來，都知道還有人等。"
            }
          ],
          "choices": [
            {
              "id": "people-first",
              "text": "先護百姓，再循哭聲尋阿斗",
              "detail": "本回看破提升，記住逆行之義",
              "effects": {
                "keenEye": true,
                "fact": "changban_people_first"
              }
            },
            {
              "id": "bridge-mark",
              "text": "與子龍約定只認翼德旗色回橋",
              "detail": "追軍起手士氣 -1，記住回橋之約",
              "effects": {
                "sow": 1,
                "fact": "changban_bridge_mark"
              }
            }
          ]
        },
        {
          "id": "bridge-signal",
          "title": "長坂坡 · 一橋三令",
          "node": 2,
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "橋後塵土少了，曹操必疑；塵土多了，百姓又無路。子龍還沒回來，俺連斷橋都不能痛痛快快斷！"
            },
            {
              "speaker": "zhaoyun",
              "text": "翼德，留一道只容單騎的縫。曹軍若三人同追，便叫他們先爭誰先過橋。"
            }
          ],
          "choices": [
            {
              "id": "single-file-gap",
              "text": "斷橋之前先留一條單騎馬道",
              "detail": "本回看破提升，記住一線生機",
              "effects": {
                "keenEye": true,
                "fact": "changban_single_file"
              }
            },
            {
              "id": "split-banners",
              "text": "移動三面殘旗，分開三路追兵",
              "detail": "曹操起手軍資 -150，記住分追之策",
              "effects": {
                "oppChips": -150,
                "fact": "changban_split_pursuit"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "changban-open",
          "speaker": "caocao",
          "text": "元讓追子龍，儁乂斷歸橋。孤只要玄德走投無路。",
          "at": "start",
          "when": "multi"
        },
        {
          "id": "changban-zhaoyun",
          "speaker": "zhaoyun",
          "text": "阿斗在懷，槍便不能只爲取勝。翼德，橋還在嗎？",
          "at": "hand:2",
          "when": "multi"
        },
        {
          "id": "changban-zhanghe",
          "speaker": "zhanghe",
          "text": "他每次回馬都在找同一個人。別追槍，追他要回的那座橋。",
          "at": "hand:3",
          "when": "multi"
        },
        {
          "id": "changban-xiahoudun",
          "speaker": "xiahoudun",
          "text": "博望那把火，今日拿你的退路來還！",
          "at": "hand:4",
          "when": "multi"
        },
        {
          "id": "changban-low",
          "speaker": "zhangfei",
          "text": "俺只要還站在這裏，他們的十萬兵就得一個一個來！",
          "at": "low",
          "when": "multi"
        }
      ],
      "win": {
        "text": "趙雲把孩子遞迴劉備懷裏，張飛才肯退下橋頭。曹操沒有責罰夏侯惇與張郃，只望着那道斷橋：“他們一個敢回來，一個肯不走。我輸的不是追兵。”",
        "hook": "漢津舟楫已近，曹操也記住了這座橋。下一路要走江東：劉備需要一句能讓孫權出兵的話。"
      },
      "loss": {
        "text": "趙雲找回了阿斗，卻找不到回橋的路；張飛喝住了追兵，卻喝不住三支軍令同時分開。孤勇能贏一陣，救不了所有人。",
        "clue": "史鑑 · 曹操要活口，元讓要報仇，張郃要截橋。讓他們爭同一條追擊線，別把三人各推向一條退路；重開敵軍士氣 -1。",
        "clueFx": "sow"
      },
      "intros": {
        "wenpin": [
          {
            "bio": "赤壁之後他守着荊州舊地，深知追與不追都寫進史筆。",
            "quote": "當年長坂追與不追，聘如今仍未想明白。",
            "when": "page:chibi:yeshi"
          },
          {
            "bio": "他還記得長坂那半式收回的槍，出手便不再留情面。",
            "quote": "這次不讓你過。對不住舊主的家眷。",
            "when": "seen:wenpin"
          },
          {
            "bio": "新附曹營的荊州舊將，槍一寸寸都在盡忠與舊義之間。",
            "quote": "聘奉命巡此。長坂的路，不通。"
          }
        ],
        "caocao": [
          {
            "bio": "青梅亭後他仍記得那聲雷，如今要用千軍逼出藏住的答案。",
            "quote": "那次讓你借雷藏住了。今日，孤看千軍替你開牌。",
            "when": "page:zhujiu:yeshi"
          },
          {
            "bio": "博望新敗讓他更謹慎，也更不肯給劉備第二次整軍的機會。",
            "quote": "一把火贏不了第二次。追。",
            "when": "page:bowang:yeshi"
          },
          {
            "bio": "他要的不只是玄德的敗，還要看看什麼人值得敗軍仍然回頭。",
            "quote": "趙雲要活的。其餘人，不必留。"
          }
        ],
        "xiahoudun": [
          {
            "bio": "博望坡的火還留在獨目裏，他把子龍的回馬看作同一道伏兵。",
            "quote": "諸葛不在橋上。今日看誰還能救你。",
            "when": "page:bowang:yeshi"
          },
          {
            "bio": "他與你重逢仍只肯向前，卻開始防着每一條過分好走的退路。",
            "quote": "這次你退，我先看你身後。",
            "when": "seen:xiahoudun"
          },
          {
            "bio": "獨目將軍帶着博望的舊怒，最先追上趙雲，也最容易追過頭。",
            "quote": "長坂之前，先還博望一箭。"
          }
        ],
        "zhanghe": [
          {
            "bio": "他記得你上次怎樣找路，這次先把所有迴路都標進陣圖。",
            "quote": "上次讓你走脫的路，這次我親自封。",
            "when": "seen:zhanghe"
          },
          {
            "bio": "他不與夏侯惇爭先，只計算趙雲和張飛之間還剩幾步。",
            "quote": "一個救人，一個守橋。分開他們。"
          }
        ]
      }
    },
    "shezhan": {
      "cast": [
        "zhangzhao",
        "yufan",
        "luji",
        "zhuge",
        "sunquan"
      ],
      "objective": "拆穿“降曹保江東”的退路，讓孫權聽見羣臣沒有說出口的恐懼。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "議事廳裏擺着四張案，三張堆滿經書，唯獨你的案上只有一柄羽扇。張昭先問劉備幾敗，虞翻已替你把“喪家”二字寫在脣邊。"
        },
        {
          "speaker": "zhangzhao",
          "text": "曹公擁百萬之衆，先生以何御之？莫把隆中一對，當作救命符。"
        },
        {
          "speaker": "sunquan",
          "text": "先生，孤要聽的不是誰的經熟，是誰敢擔江東的明日。"
        },
        {
          "speaker": "zhuge",
          "text": "隆中你問的是天下，今日他們問的是輸贏。別答反了。"
        }
      ],
      "map": [
        {
          "id": "three-questions",
          "title": "館驛 · 三問同鎖",
          "node": 1,
          "lines": [
            {
              "speaker": "yufan",
              "text": "張公問強弱，陸公問名分。我只問你：敗到夏口的人，憑什麼談救別人？"
            },
            {
              "speaker": "luji",
              "text": "曹丞相奉天子以令不臣。你要抗的，究竟是曹軍，還是朝廷？"
            },
            {
              "speaker": "you",
              "text": "三道題共用一把鎖：先讓我承認，自己已經輸了。"
            }
          ],
          "choices": [
            {
              "id": "ask-burden",
              "text": "追問“降後誰擔江東”",
              "detail": "看破提升，記住共同前提",
              "effects": {
                "keenEye": true,
                "fact": "shezhan_common_fear"
              }
            },
            {
              "id": "sign-surrender",
              "text": "請主和者各寫一個降字",
              "detail": "衆儒起手士氣 -1，記住署名",
              "effects": {
                "sow": 1,
                "fact": "shezhan_signed"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "shezhan-open-multi",
          "speaker": "zhangzhao",
          "text": "我們三人依次問。先生若有一處語塞，便不必再談抗曹。",
          "at": "start",
          "when": "multi"
        },
        {
          "id": "shezhan-open-single",
          "speaker": "zhangzhao",
          "text": "曹操之強，史書可查。先生要拿主公性命，替自己立名麼？",
          "at": "start",
          "when": "single"
        },
        {
          "id": "shezhan-defeats",
          "speaker": "yufan",
          "text": "你莫繞。劉豫州一敗再敗，難道不是事實？",
          "at": "hand:2"
        },
        {
          "id": "shezhan-name",
          "speaker": "luji",
          "text": "漢室傾頹，正需識時務者。你連名分都不顧，還談什麼興復？",
          "at": "hand:3"
        },
        {
          "id": "shezhan-low-fear",
          "speaker": "you",
          "text": "你們說江東不可賭，原來是怕自己的名字留在抗曹那一頁。",
          "at": "low",
          "when": "fact:shezhan_common_fear"
        },
        {
          "id": "shezhan-low-sign",
          "speaker": "zhuge",
          "text": "他們不肯獨書一個降字，卻敢替萬民同寫。子布，這算誰的江東？",
          "at": "low",
          "when": "fact:shezhan_signed"
        }
      ],
      "win": {
        "text": "孫權將案上的“降”字翻扣，命人取來戰圖。張昭沒有再問曹操有多少兵，只問江東還有多少可戰之船。羣臣仍有異議，卻再不能把主和說成一個不必負責的答案。",
        "hook": "魯肅已在江邊備船。諸葛亮尚需十萬支箭，而曹操的箭，比江東的耐心多。"
      },
      "loss": {
        "text": "你逐條答完了典故，卻沒讓他們承認懼意。孫權只聽見一場爭吵，沒聽見誰願意承擔抗曹的後果。",
        "clue": "史鑑 · 羣儒會輪流轉問，把爭勝變成消耗；先拆共同前提，重開時看破提升。",
        "clueFx": "keenEye"
      },
      "intros": {
        "zhangzhao": [
          {
            "bio": "他記得你上次怎樣拆題，這次先把每部經典都擺成了盾。",
            "quote": "典故可以重引。先生，敗績也能重答麼？",
            "when": "seen:zhangzhao"
          },
          {
            "bio": "江東文膽，以經典爲城，以主和爲最後一道門。",
            "quote": "先不論兵。劉豫州屢敗，可是事實？"
          }
        ],
        "yufan": [
          {
            "bio": "他的話不繞彎，專挑對手最狼狽的地方落刃。",
            "quote": "避難的人，也敢來談救人？"
          }
        ],
        "luji": [
          {
            "bio": "他把名分說得端正，袖中卻藏着不敢獨擔的降書。",
            "quote": "抗曹之前，先答我何謂漢臣。"
          }
        ]
      }
    },
    "caochuan": {
      "cast": [
        "zhuge",
        "lusu",
        "caocao",
        "caizhong"
      ],
      "objective": "在霧散前讓曹軍自己決定放箭，把曹操的多疑借成江東的軍需。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "第三更，魯肅摸着船上的稻草人，終於明白諸葛亮要借的不只是箭，還有曹操不敢出兵的那一顆心。"
        },
        {
          "speaker": "lusu",
          "text": "若霧突然散了呢？子敬可以陪你冒險，江東不能陪你陪葬。"
        },
        {
          "speaker": "caizhong",
          "text": "丞相放心,小人兄弟早把江東水路摸熟了——這霧夜裏,他們絕不敢出船。",
          "when": "!seen:caizhong"
        },
        {
          "speaker": "zhuge",
          "text": "堂上既已請江東主戰，箭便不能只在賬上。子敬，這一船是還願，不是賭命。"
        },
        {
          "speaker": "you",
          "text": "霧只負責遮船。讓曹操看見什麼，還得由我們來說。"
        }
      ],
      "map": [
        {
          "id": "fog-cadence",
          "title": "江霧 · 留白令敵",
          "node": 1,
          "lines": [
            {
              "speaker": "lusu",
              "text": "箭垛、船隻、更次都齊了，只差曹操肯不肯。若他看出是草人呢？"
            },
            {
              "speaker": "zhuge",
              "text": "所以不能只讓他看不清。要讓他覺得，自己看得比我們更遠。"
            },
            {
              "speaker": "you",
              "text": "霧遮住船，鼓聲替他補出一支伏兵。"
            }
          ],
          "choices": [
            {
              "id": "full-drums",
              "text": "二十船同擂，假裝主力",
              "detail": "曹軍起手士氣 -1，記住鼓陣",
              "effects": {
                "sow": 1,
                "fact": "caochuan_full_drums"
              }
            },
            {
              "id": "answering-drums",
              "text": "首尾應鼓，留出空船",
              "detail": "看破提升，記住霧中留白",
              "effects": {
                "keenEye": true,
                "fact": "caochuan_empty_space"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "caochuan-open",
          "speaker": "caocao",
          "text": "水寨不出，弓弩向前。孤倒要看，霧裏藏了多少人。",
          "at": "start"
        },
        {
          "id": "caochuan-drums",
          "speaker": "zhuge",
          "text": "現在撤下一半鼓。曹操聽見勢弱，反會認定我們開始收網。",
          "at": "hand:2",
          "when": "fact:caochuan_full_drums"
        },
        {
          "id": "caochuan-space",
          "speaker": "lusu",
          "text": "空船轉到外舷了。曹操不看鼓聲最密處，偏要猜最靜的地方。",
          "at": "hand:2",
          "when": "fact:caochuan_empty_space"
        },
        {
          "id": "caochuan-more-arrows",
          "speaker": "caocao",
          "text": "鼓聲虛了。莫追，添箭——他們若退，便是有詐。",
          "at": "hand:3"
        },
        {
          "id": "caochuan-low",
          "speaker": "you",
          "text": "箭不是騙來的，是他替自己心裏的伏兵預備的。",
          "at": "low"
        }
      ],
      "win": {
        "text": "霧散時，各船草人都已滿箭。魯肅不再問若霧早退怎麼辦，只忙着催人報數；諸葛亮折下一枚簇尖收進袖中。箭已夠用，下一頁要借的是火。",
        "hook": "箭已備，東風未至。周瑜在赤壁等你，也等諸葛亮露出一絲來不及。"
      },
      "loss": {
        "text": "霧未散，曹操先停了箭。你把多疑當成一道不會更改的命令，忘了多疑的人最擅長改主意；魯肅只好帶你退回空船。",
        "clue": "史鑑 · 曹操會根據鼓聲重新判斷虛實；別把同一種試探用到底，重開時看破提升。",
        "clueFx": "keenEye"
      },
      "intros": {
        "caizhong": [
          {
            "bio": "詐降的兄弟檔又換了一套裝束,口徑卻仍舊差半拍。",
            "quote": "這、這次弟弟沒來。情報,小人一個人包了。",
            "when": "seen:caizhong"
          },
          {
            "bio": "蔡夫人族中小子,降書裏的每一個字都商量好了,唯獨彼此沒商量。",
            "quote": "降卒蔡中,願爲丞相效犬馬!"
          }
        ],
        "caocao": [
          {
            "bio": "他在青梅亭讀過你的藏鋒，如今更不信江上的每一次試探。",
            "quote": "青梅舊友，也學會借霧藏鋒了？",
            "when": "page:zhujiu:yeshi"
          },
          {
            "bio": "北岸水寨，他把每一聲鼓都當成一句沒說完的謊話。",
            "quote": "霧夜來船，必有深意。先莫出擊。"
          }
        ]
      }
    },
    "chibi": {
      "cast": [
        "caocao",
        "zhouyu",
        "zhuge"
      ],
      "objective": "在三方各懷勝負的牌局裏，讓火船、東南風與曹操的疑心同時到位。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "曹操的連舫在北，周瑜的火船在南，諸葛亮的七星壇夾在兩者之間。三方同桌，卻沒有任何兩人的勝利完全相同。"
        },
        {
          "speaker": "caocao",
          "text": "連舫穩如平地。孤倒要聽聽，東吳還能拿什麼來燒。"
        },
        {
          "speaker": "zhouyu",
          "text": "孔明若借不來風，火攻便止；你若只贏他，曹操照樣過江。"
        },
        {
          "speaker": "zhuge",
          "text": "所以這一局沒有盟友。只有誰先看見，風已在誰的袖中。"
        }
      ],
      "map": [
        {
          "id": "three-fuses",
          "title": "烏林 · 三方引信",
          "node": 1,
          "lines": [
            {
              "speaker": "zhouyu",
              "text": "火船隻能燒一次。孔明先離場，風未必來；孟德先離場，他會帶走主力。"
            },
            {
              "speaker": "caocao",
              "text": "你們都等風。孤已把船鎖在一起，風來，也不過多照幾處燈火。"
            },
            {
              "speaker": "you",
              "text": "要贏的不是三份籌碼，是讓三個人都不能提前離席。"
            }
          ],
          "choices": [
            {
              "id": "loose-chain",
              "text": "暗解一節連環索",
              "detail": "曹軍起手軍資 -200，記住暗索",
              "effects": {
                "raid": true,
                "fact": "chibi_loose_chain"
              }
            },
            {
              "id": "empty-jars",
              "text": "把火油換成空壇示弱",
              "detail": "看破提升，記住空壇真火",
              "effects": {
                "keenEye": true,
                "fact": "chibi_empty_jars"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "chibi-open",
          "speaker": "caocao",
          "text": "一個借風，一個縱火，一個無名之輩。很好，孤一桌收拾。",
          "at": "start",
          "when": "multi"
        },
        {
          "id": "chibi-read",
          "speaker": "zhouyu",
          "text": "先碰孔明，還是先碰我？你每贏一家，另一家都在讀你的牌。",
          "at": "hand:2",
          "when": "multi"
        },
        {
          "id": "chibi-chain",
          "speaker": "zhuge",
          "text": "斷索讓他以爲船可散逃。可命令傳到各艦之前，火已經替他做了決定。",
          "at": "hand:3",
          "when": "fact:chibi_loose_chain"
        },
        {
          "id": "chibi-jars",
          "speaker": "zhuge",
          "text": "空壇不是無火，是讓公瑾以爲你沒有後手。現在，把真火油推出來。",
          "at": "hand:3",
          "when": "fact:chibi_empty_jars"
        },
        {
          "id": "chibi-low",
          "speaker": "you",
          "text": "曹操怕埋伏，周瑜怕無功，孔明怕風失期。火起的空隙，就在三種恐懼之間。",
          "at": "low",
          "when": "multi"
        }
      ],
      "win": {
        "text": "最後一名對手離席時，東南風才越過旗角。火船借風撞入連舫，周瑜沒有看你，諸葛亮卻已收扇——兩人都明白，你方纔留住的不是三份籌碼，是同一刻。",
        "hook": "曹操敗向華容。關羽的刀已等在那裏，而諸葛亮說，今夜還欠他一份人情。"
      },
      "loss": {
        "text": "你先清掉周瑜，曹操便收船；你先壓住曹操，諸葛亮便不再等風。赤壁沒有敗給某一張牌，敗給三方從未同時入局。",
        "clue": "史鑑 · 多方會彼此讀取你的下注，先清一家會給另一家收帆的機會；重開時看破提升。",
        "clueFx": "keenEye"
      },
      "intros": {
        "caocao": [
          {
            "bio": "從青梅到赤壁，他仍想逼你把藏住的答案押上桌面。",
            "quote": "煮酒能藏雷，今日烈火往哪裏藏？",
            "when": "page:zhujiu:yeshi"
          },
          {
            "bio": "八十萬連舫，他要北方從此不必再懂水戰。",
            "quote": "船已相連，江上也是孤的中原。"
          }
        ],
        "zhouyu": [
          {
            "bio": "他看見十萬支箭如約而至，更不肯讓孔明獨佔赤壁。",
            "quote": "箭你借到了。火，還得聽我的。",
            "when": "page:caochuan:yeshi"
          },
          {
            "bio": "他的火攻萬事俱備，唯獨不願承認自己也在等風。",
            "quote": "曲有誤，周郎顧；風若誤呢？"
          }
        ],
        "zhuge": [
          {
            "bio": "他記得隆中的天下，也記得你怎樣把一場對話變成戰局。",
            "quote": "今日不論誰先勝，先論風何時起。",
            "when": "seen:zhuge"
          },
          {
            "bio": "七星壇上，他把最難借的東西說得像已經入袖。",
            "quote": "風會來。人未必肯等。"
          }
        ]
      }
    },
    "huarong": {
      "cast": [
        "caocao",
        "guanyu",
        "zhuge"
      ],
      "objective": "贏下窮途之後仍要親手選擇：讓舊賬隨刀落，還是讓義成爲麥城必須償還的債。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "曹操的坐騎陷在泥裏，身後只剩十幾騎。關羽橫刀立馬，卻沒看你，也沒看那條通往江陵的空路。"
        },
        {
          "speaker": "caocao",
          "text": "赤壁能燒連舫，燒不盡舊賬。雲長，今日這桌上只剩你我了嗎？"
        },
        {
          "speaker": "guanyu",
          "text": "軍令在此，舊恩也在此。關某隻問一句：這一刀，你替誰看？"
        },
        {
          "speaker": "zhuge",
          "text": "別替他選。你贏下的，只是讓選擇真的發生。"
        }
      ],
      "map": [
        {
          "id": "two-debts",
          "title": "華容 · 刀下兩賬",
          "node": 1,
          "lines": [
            {
              "speaker": "caocao",
              "text": "雲長殺我，是奉軍令；放我，是還舊恩。可你要他替哪一筆擔罪？"
            },
            {
              "speaker": "guanyu",
              "text": "他把活路說成了兩筆債。你聽着，像哪一筆？"
            },
            {
              "speaker": "you",
              "text": "都不是。刀在活人手裏，就不該由死去的情分替今日決定。"
            }
          ],
          "choices": [
            {
              "id": "weigh-oath",
              "text": "展開軍令狀，先念軍法",
              "detail": "曹軍起手士氣 -1，記住軍令",
              "effects": {
                "sow": 1,
                "fact": "huarong_oath"
              }
            },
            {
              "id": "weigh-debt",
              "text": "收起軍令狀，只聽舊恩",
              "detail": "看破提升，記住舊恩",
              "effects": {
                "keenEye": true,
                "fact": "huarong_debt"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "huarong-open",
          "speaker": "caocao",
          "text": "赤壁你懂得讓三家都不能先走。今日只剩你我，反倒難了吧？",
          "at": "start"
        },
        {
          "id": "huarong-oath",
          "speaker": "guanyu",
          "text": "軍令我立，罪我領。你若只把軍法推給我，仍是讓旁人替你落刀。",
          "at": "hand:2",
          "when": "fact:huarong_oath"
        },
        {
          "id": "huarong-debt",
          "speaker": "guanyu",
          "text": "恩是關某欠的，命是三軍爭來的。別拿一個義字，替所有人免單。",
          "at": "hand:2",
          "when": "fact:huarong_debt"
        },
        {
          "id": "huarong-unwritten",
          "speaker": "zhuge",
          "text": "我算到曹操命不該絕，卻算不到你怎樣選。這一頁，終於輪到人勝天一着。",
          "at": "hand:3"
        },
        {
          "id": "huarong-low",
          "speaker": "you",
          "text": "他已不談天下，只談舊情。窮途上的曹操，仍知道什麼能當籌碼。",
          "at": "low"
        }
      ],
      "win": {
        "text": "曹操的籌碼盡散，泥路靜得能聽見刀環。關羽終於看向你。前方無人阻攔，後方軍令猶在；贏牌沒有替你寫下結局，只把刀落與不落都留成了你的親手之筆。",
        "hook": "這一刀無論落未落，都會沿荊州傳到麥城。冬天還遠，賬已經記下了。"
      },
      "loss": {
        "text": "曹操仍從泥裏走出。你忙着替關羽計算忠義，卻忘了他最擅長讓別人替他爭一個活口。",
        "clue": "史鑑 · 窮途曹操會把軍令與舊恩輪流推上桌；重開時看破提升，終局選擇仍由你作出。",
        "clueFx": "keenEye"
      },
      "intros": {
        "caocao": [
          {
            "bio": "從青梅到赤壁，他每次窮途都仍記得怎樣與你談舊情。",
            "quote": "青梅酒、連舫火。你我又走到窄路了。",
            "when": "page:zhujiu:yeshi"
          },
          {
            "bio": "敗軍不足以護駕，他便把昔日恩情也編成了親軍。",
            "quote": "孤今日不講天下，只講故人。"
          }
        ],
        "guanyu": [
          {
            "bio": "從虎牢到華容，他的一諾始終比刀更重，也更難放下。",
            "quote": "你已知關某如何出刀。今日且看爲何收刀。",
            "when": "seen:guanyu"
          },
          {
            "bio": "軍令狀在懷，舊恩在心，他不肯讓任何一筆由旁人代簽。",
            "quote": "關某在此。忠與義，都不許借名。"
          }
        ]
      }
    },
    "nanjun": {
      "cast": [
        "zhouyu",
        "caoren",
        "chengpu",
        "ganning",
        "lusu"
      ],
      "objective": "在江陵城下與曹仁對讀,讓周瑜的箭瘡不必第二次裂開。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "赤壁的火光才熄,南郡的旗還在曹仁手裏。周瑜披甲臨江,箭瘡尚未收口,曹仁卻在城頭擺開了嘲諷的鼓。"
        },
        {
          "speaker": "zhouyu",
          "text": "曹子孝守城,十年不倦。要取南郡,先要贏他不肯出城的那顆心。"
        },
        {
          "speaker": "caoren",
          "text": "都督箭瘡未愈吧?本將這面鼓,專爲你擂。你若動氣,城門便爲你開。",
          "when": "!seen:caoren"
        },
        {
          "speaker": "ganning",
          "text": "都督,把夷陵交給興霸。鈴響之處,便是吳軍又進一步。"
        },
        {
          "speaker": "chengpu",
          "text": "公瑾,老夫陪你壓陣。箭瘡這東西,最怕的不是箭,是氣。"
        }
      ],
      "map": [
        {
          "id": "outside-mock",
          "title": "江陵 · 城下之鼓",
          "node": 1,
          "lines": [
            {
              "speaker": "zhouyu",
              "text": "他每日擂鼓罵我箭瘡,要我拔營決戰。我若應戰,瘡裂;我若不應,軍心餒。"
            },
            {
              "speaker": "lusu",
              "text": "都督不如把他擂給你的每一面鼓,都記成他出城的日子。"
            },
            {
              "speaker": "you",
              "text": "鼓聲是他的表,不是你的。讓鼓替你數他的換防。"
            }
          ],
          "choices": [
            {
              "id": "count-drums",
              "text": "記錄鼓點與垛口換防",
              "detail": "本回看破提升,記住換防之隙",
              "effects": {
                "keenEye": true,
                "fact": "nanjun_count"
              }
            },
            {
              "id": "yiling-feint",
              "text": "佯攻夷陵,分其兵勢",
              "detail": "曹軍起手軍資 -200,記住分兵",
              "effects": {
                "raid": true,
                "fact": "nanjun_feint"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "nanjun-open",
          "speaker": "caoren",
          "text": "周郎!箭瘡好些了嗎?本將的鼓,今日擂得更響!",
          "at": "start"
        },
        {
          "id": "nanjun-anger",
          "speaker": "zhouyu",
          "text": "他把鼓擂給我,我便把怒氣記在他賬上。等他換了第三班守軍——",
          "at": "hand:2"
        },
        {
          "id": "nanjun-gap",
          "speaker": "ganning",
          "text": "夷陵鈴響了!曹洪分兵了,江陵的牆薄了一層!",
          "at": "hand:3",
          "when": "fact:nanjun_feint"
        },
        {
          "id": "nanjun-low",
          "speaker": "chengpu",
          "text": "都督的臉白了。老夫替你壓住陣腳——這一陣,贏了再養傷!",
          "at": "low"
        }
      ],
      "win": {
        "text": "曹仁棄城西走的那夜,周瑜按着箭傷登上了江陵城頭。他沒有接受歡呼,只讓人把城頭那面嘲弄過他的鼓抬來,親手敲了三下,又送還曹仁:\"替我謝謝它,守住了我的耐心。\"南郡,終於姓孫。",
        "hook": "南郡到手,荊州的賬才翻開了第一頁。而北方的馬蹄聲,已帶着一腔仇恨碾向潼關。"
      },
      "loss": {
        "text": "鼓聲第三次響起時,周瑜提槍上馬,箭瘡在甲縫裏裂開。你扶住他的一瞬,江陵城門轟然大開——曹仁等的正是這一刻。",
        "clue": "史鑑 · 曹仁的鼓是給你情緒上的枷。重開後他的假破綻減少;數他的換防,別數他的挑釁。",
        "clueFx": "keenEye"
      },
      "intros": {
        "caoren": [
          {
            "bio": "他記得你怎樣替周瑜擋下怒氣,這次連鼓都懶得擂了。",
            "quote": "又來?這次我連激你的興致都省了。",
            "when": "seen:caoren"
          },
          {
            "bio": "他把守城寫成一門手藝:不賭氣,不僥倖,不心疼一磚一瓦。",
            "quote": "江陵的磚,一塊一塊都數過。來。"
          }
        ],
        "caohong": [
          {
            "bio": "他替兄長守夷陵道,信奉的道理只有一條:主公的退路比自己的命長。",
            "quote": "這道口,姓曹。想過?留下買路的東西。"
          }
        ]
      }
    },
    "sanqi": {
      "cast": [
        "zhouyu",
        "zhuge",
        "lusu",
        "liubei"
      ],
      "objective": "不再用第三激殺人，而讓周瑜在最難堪的一手裏看見自己的生路。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "巴丘的藥已經煎黑，周瑜卻把第三封戰書壓在琴下。前兩氣讓他失血，第三氣卻先讓他笑了。"
        },
        {
          "speaker": "zhouyu",
          "text": "赤壁同桌，你拿風作了引信。今日又想拿什麼，點我的箭瘡？"
        },
        {
          "speaker": "lusu",
          "text": "孔明來書只有四字：何必如此。公瑾看完，便把你的名字寫了三遍。"
        },
        {
          "speaker": "zhuge",
          "text": "若只想贏他，再激一次就夠。若想讓他活，得先讓他有一次不失態。"
        }
      ],
      "map": [
        {
          "id": "third-letter",
          "title": "柴桑 · 第三封書",
          "node": 1,
          "lines": [
            {
              "speaker": "lusu",
              "text": "他認定你每一步都在笑他。你送藥，他先找毒；你退兵，他先找伏。"
            },
            {
              "speaker": "zhuge",
              "text": "所以第三封書裏，我一句也沒有辯解。只寫了赤壁那一手，他本可怎樣贏我。"
            },
            {
              "speaker": "you",
              "text": "把勝法還給對手，比把罪名塞給他更難。"
            }
          ],
          "choices": [
            {
              "id": "write-way-out",
              "text": "在信尾寫清他的勝機",
              "detail": "看破提升，記住第三解",
              "effects": {
                "keenEye": true,
                "fact": "sanqi_way_out"
              }
            },
            {
              "id": "remove-taunts",
              "text": "請魯肅收走所有激將話",
              "detail": "周瑜起手士氣 -1，記住不激",
              "effects": {
                "sow": 1,
                "fact": "sanqi_no_taunt"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "sanqi-open",
          "speaker": "zhouyu",
          "text": "你又帶着孔明的信來。說罷，這次是哪座城、哪一句既生瑜？",
          "at": "start"
        },
        {
          "id": "sanqi-way-out",
          "speaker": "zhuge",
          "text": "看他棄掉好牌的那一手。他不是讓你，是在逼自己承認還有下局。",
          "at": "hand:2",
          "when": "fact:sanqi_way_out"
        },
        {
          "id": "sanqi-no-taunt",
          "speaker": "lusu",
          "text": "他等你譏諷，你便只報牌。沒有人接怒，火便只能燒回他自己。",
          "at": "hand:2",
          "when": "fact:sanqi_no_taunt"
        },
        {
          "id": "sanqi-silence",
          "speaker": "zhouyu",
          "text": "你爲何不笑？我若連怒都無處落，豈不成了你琴上一根斷絃？",
          "at": "hand:3"
        },
        {
          "id": "sanqi-low",
          "speaker": "you",
          "text": "第三氣不必是一句話。讓他發現，敗也可以不成爲笑話。",
          "at": "low"
        }
      ],
      "win": {
        "text": "周瑜沒有再喊“既生瑜”。他把那封寫着自己勝機的信壓在琴上，慢慢彈錯一音，又自己笑了一聲。魯肅聽見笑聲，纔敢讓醫官進帳。",
        "hook": "周郎暫離巴丘，入蜀的山路卻正向龐統收攏。落鳳坡這個地名，諸葛亮看了很久。"
      },
      "loss": {
        "text": "你把他的失態當作唯一的勝門，第三激終於奏效，也永遠關上了所有下局。琴沒有斷，聽琴的人先散了。",
        "clue": "史鑑 · 周瑜會等你先出譏諷再反撲；少接他的怒，重開時看破提升。",
        "clueFx": "keenEye"
      },
      "intros": {
        "zhouyu": [
          {
            "bio": "赤壁的火贏了曹操，也燒亮了他不肯居於人後的心。",
            "quote": "江上你留住同一刻。巴丘呢，等我先亂？",
            "when": "page:chibi:yeshi"
          },
          {
            "bio": "箭瘡未愈，他把每一次遲疑都聽成了曲誤。",
            "quote": "第三封書來了？念。看我還能氣幾次。"
          }
        ]
      }
    },
    "tongguan": {
      "cast": [
        "machao",
        "xuchu",
        "caocao",
        "jiaxu",
        "xuhuang"
      ],
      "objective": "在西涼鐵騎的怒火裏護住曹操,也讓馬超的仇有一個說得出口的去處。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "潼關的風捲着沙,馬超的白袍在陣前來回,像一杆不肯倒的旗。曹操的中軍帳裏,賈詡慢慢研着墨。"
        },
        {
          "speaker": "machao",
          "text": "曹瞞!殺父之仇,欺天之恨!今日不把你剁在潼關,馬超誓不爲人!"
        },
        {
          "speaker": "caocao",
          "text": "馬兒不死,孤無葬地也。諸公,誰替孤擋住這陣風?"
        },
        {
          "speaker": "xuchu",
          "text": "主公下帳,退後!虎癡在此——馬兒,過來!"
        },
        {
          "speaker": "jiaxu",
          "text": "明公莫慌。西涼人多,心卻不齊。文和的墨,比虎癡的刀慢,卻更毒。",
          "when": "!seen:jiaxu"
        }
      ],
      "map": [
        {
          "id": "weishui-ice",
          "title": "渭南 · 冰城疑雲",
          "node": 1,
          "lines": [
            {
              "speaker": "xuhuang",
              "text": "一夜寒風,渭水結出了冰沙。若連夜築城,天明便有一座冰營——馬超的騎兵,衝不動冰。"
            },
            {
              "speaker": "jiaxu",
              "text": "冰城只能擋馬,擋不住恨。要拆西涼,須先拆韓遂與馬超的情分——一封信,夠了。"
            },
            {
              "speaker": "you",
              "text": "讓他先把怒氣全押上來,再讓他看見信上的墨點。"
            }
          ],
          "choices": [
            {
              "id": "ice-wall",
              "text": "連夜築冰城,以靜制動",
              "detail": "本回看破提升,記住冰城之利",
              "effects": {
                "keenEye": true,
                "fact": "tongguan_ice"
              }
            },
            {
              "id": "letter-smudge",
              "text": "在離間信上留下塗改的墨點",
              "detail": "西涼軍起手士氣 -1,記住墨點之疑",
              "effects": {
                "sow": 1,
                "fact": "tongguan_smudge"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "tongguan-open",
          "speaker": "machao",
          "text": "曹瞞!你修的冰城,擋得住馬,擋不住仇!",
          "at": "start"
        },
        {
          "id": "tongguan-bare",
          "speaker": "xuchu",
          "text": "馬兒,認得俺嗎?虎侯今天,就站你面前!",
          "at": "hand:2",
          "when": "multi"
        },
        {
          "id": "tongguan-letter",
          "speaker": "narrator",
          "text": "韓遂捧着那封信,手指停在墨點上。馬超瞥見的那一眼,比曹操的千軍更冷。",
          "at": "hand:3",
          "when": "fact:tongguan_smudge"
        },
        {
          "id": "tongguan-low",
          "speaker": "caocao",
          "text": "馬兒,孤知你不服。可你父之死——你真敢把賬全算在孤一人身上嗎?",
          "at": "low"
        }
      ],
      "win": {
        "text": "渭南的風停時,西涼的營自己燒了起來——不是曹操的火,是那封信上的墨點。馬超單騎立在殘陣之前,槍指曹操,久久沒有落下,最終調頭向西。曹操撫着鬍鬚輕聲說:\"孤贏的不是他,是他終於開始想,那筆賬到底該找誰算。\"",
        "hook": "西涼散了,仇恨卻還在尋找一個騎手。它會在葭萌關的火盆邊,再等馬超三年。"
      },
      "loss": {
        "text": "馬超的怒火沒有等你的離間計生效。鐵騎三衝,冰城四裂,曹操割須棄袍的那一刻,你在亂軍中只看見了虎癡的背影。",
        "clue": "史鑑 · 馬超的強在於怒氣換籌碼。重開後他的假破綻減少;先用冰城耗,再用墨點疑。",
        "clueFx": "keenEye"
      },
      "intros": {
        "machao": [
          {
            "bio": "他記得渭水那夜的冰與火,恨意未減,槍卻更沉了。",
            "quote": "又來擋我?先問過我手裏的槍!",
            "when": "seen:machao"
          },
          {
            "bio": "葭萌的火盆邊他曾放下過槍,此刻槍尖卻在微微發抖。",
            "quote": "你見過我放下槍的樣子……別再提!",
            "when": "page:jiameng:yeshi"
          },
          {
            "bio": "錦袍銀槍,半生都在替死去的父叔討一個說法。",
            "quote": "父債子償,天經地義。讓開!"
          }
        ],
        "xuchu": [
          {
            "bio": "渭水之戰讓他記住了你,這次把腰間的繩又緊了三圈。",
            "quote": "再來!俺的力氣還沒用完!",
            "when": "seen:xuchu"
          },
          {
            "bio": "他不懂什麼離間計,只認一個理:主公在身後,就不能退。",
            "quote": "馬兒的槍快?俺的命更硬!"
          }
        ]
      }
    },
    "ruxu": {
      "cast": [
        "ganning",
        "zhoutai",
        "sunquan",
        "lingtong",
        "caocao"
      ],
      "objective": "護住百騎劫營的每一聲鈴響,讓曹操的四十萬大軍自亂一夜。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "曹操四十萬大軍壓向濡須,孫權帳中鴉雀無聲。甘寧把一百枚銅鈴擺上案,一枚一枚,擺成一條線。"
        },
        {
          "speaker": "sunquan",
          "text": "孟德有張遼,孤有興霸。可一百騎進四十萬人的營,興霸,孤要你活着回來。"
        },
        {
          "speaker": "ganning",
          "text": "主公放心。鈴響則進,鈴停則回——興霸帶的不是一百個送死的,是一百個來記賬的!"
        },
        {
          "speaker": "lingtong",
          "text": "甘寧!你又搶頭陣!我父親的舊部,還沒死絕!",
          "when": "!seen:ganning"
        },
        {
          "speaker": "zhoutai",
          "text": "都尉少說一句。這一百騎裏,有公績你父親的老兄弟。"
        }
      ],
      "map": [
        {
          "id": "hundred-bells",
          "title": "橫江 · 鈴響爲號",
          "node": 1,
          "lines": [
            {
              "speaker": "ganning",
              "text": "每人一根白鵝翎,銜在嘴裏。進營不殺人,只砍旗、放火、擂他們的鼓。"
            },
            {
              "speaker": "zhoutai",
              "text": "幼平守塢門。鈴響第二遍,無論回來幾個,塢門都開。"
            },
            {
              "speaker": "you",
              "text": "四十萬人的營,最怕的不是一百騎,是「不知來了多少騎」。"
            }
          ],
          "choices": [
            {
              "id": "feather-quiet",
              "text": "銜枚裹鈴,先靜後炸",
              "detail": "本回看破提升,記住靜默之利",
              "effects": {
                "keenEye": true,
                "fact": "ruxu_quiet"
              }
            },
            {
              "id": "three-fires",
              "text": "三處舉火,令其自相驚擾",
              "detail": "曹軍起手軍資 -200,記住火號",
              "effects": {
                "raid": true,
                "fact": "ruxu_fires"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "ruxu-open",
          "speaker": "caocao",
          "text": "江上靜得反常。傳令各營:今夜有警,先守,後動,別中了疑兵!",
          "at": "start"
        },
        {
          "id": "ruxu-bells",
          "speaker": "ganning",
          "text": "鈴——響!兄弟們,讓曹營自己踩自己!",
          "at": "hand:2"
        },
        {
          "id": "ruxu-chaos",
          "speaker": "narrator",
          "text": "三處火起,四十萬營帳的鼓互相擂響了。沒有一支箭知道該射向哪裏。",
          "at": "hand:3",
          "when": "fact:ruxu_fires"
        },
        {
          "id": "ruxu-low",
          "speaker": "sunquan",
          "text": "鈴停了……數一數,回來幾個?一個、兩個……都在。都在就好。",
          "at": "low"
        }
      ],
      "win": {
        "text": "天明時清點,一百騎連人帶鈴,一枚不少。曹操望着一夜自相踩踏的營盤,對左右說:\"孫權治軍如此,孤不可急圖也。\"遂班師。孫權親自替甘寧斟酒:\"孟德有張遼,孤有興霸——足矣。\"",
        "hook": "濡須的鈴聲讓合肥的名字更加滾燙。張遼在那裏等着,把「吳」字寫成江東兒郎的夢魘。"
      },
      "loss": {
        "text": "鈴響得太早,四十萬營從慌亂裏醒過來。回來的鈴,只有七十枚。甘寧把缺了三十枚的鈴串收進懷裏,從此再沒提過這一夜。",
        "clue": "史鑑 · 百騎劫營贏在「亂其耳目」而非「戰其兵鋒」。重開時先靜後炸;曹操的多疑是你唯一的內應。",
        "clueFx": "keenEye"
      },
      "intros": {
        "caocao": [
          {
            "bio": "草船的霧與今夜的鈴,讓他把江東的膽量重新記了一賬。",
            "quote": "借了孤的箭,又來借孤的營。好膽!",
            "when": "page:caochuan:yeshi"
          },
          {
            "bio": "他記得你每次都借他的多疑,這次索性把疑心佈滿四十萬營。",
            "quote": "孤的營,今夜誰碰誰死——問題是誰來碰?",
            "when": "seen:caocao"
          },
          {
            "bio": "四十萬人的營火,把江面照成了白晝,也把每一條影子都放大成敵。",
            "quote": "江東鼠輩,只會借霧借火。正面,孤等他們。"
          }
        ],
        "xuhuang": [
          {
            "bio": "他布的陣講究一個「整」字,連劫營者都會被整陣逼回原路。",
            "quote": "來劫營?先過我這排整齊的拒馬。"
          }
        ],
        "lejin": [
          {
            "bio": "文謙的名字取「進」,人也一樣——前鋒永遠比軍令快一步。",
            "quote": "先鋒營,先登!江東人,嚐嚐樂進的刀!"
          }
        ]
      }
    }
  },
  "3": {
    "luofengpo": {
      "cast": [
        "pangtong",
        "liubei",
        "zhangren",
        "liuzhang"
      ],
      "objective": "利用的盧與張任對鳳雛的執念，讓伏兵射中一個錯誤的目標。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "落鳳坡前，的盧不肯踏過白石道。龐統翻身下馬，將繮繩遞迴劉備手裏，忽然問張任要殺的究竟是馬，還是人。"
        },
        {
          "speaker": "pangtong",
          "text": "孔明來信只說將帥多凶少吉。他連我也一併算了，卻忘了伏兵也要先認人。"
        },
        {
          "speaker": "liuzhang",
          "text": "父兄守了三十年的蜀道,竟真有人打進來……任兒,成都的門,拜託你了。",
          "when": "!seen:liuzhang"
        },
        {
          "speaker": "liubei",
          "text": "士元，換馬本是好意。若這好意正好替你寫了死籍呢？"
        },
        {
          "speaker": "zhangren",
          "text": "不見的盧，不許放箭。我要劉備，莫傷錯了人。"
        }
      ],
      "map": [
        {
          "id": "false-phoenix",
          "title": "落鳳坡 · 反借伏眼",
          "node": 1,
          "lines": [
            {
              "speaker": "zhangren",
              "text": "林深，馬快。可我伏兵的號令只有一個：白馬入坡，萬箭齊發。"
            },
            {
              "speaker": "pangtong",
              "text": "他要射的是劉備必騎的盧這個成見。地名未必克我，人名卻會騙人。"
            },
            {
              "speaker": "liubei",
              "text": "那就讓這成見，最後一次替我們帶路。"
            }
          ],
          "choices": [
            {
              "id": "horse-decoy",
              "text": "空繮牽的盧走前隊",
              "detail": "看破伏兵，記住白馬誘餌",
              "effects": {
                "keenEye": true,
                "fact": "luofengpo_horse_decoy"
              }
            },
            {
              "id": "banner-decoy",
              "text": "以鳳翎旗引偏箭雨",
              "detail": "伏兵起手軍資 -200，記住假旗",
              "effects": {
                "raid": true,
                "fact": "luofengpo_banner_decoy"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "luofengpo-open",
          "speaker": "zhangren",
          "text": "龐統，你若真懂趨吉避凶，便不該走進這座坡。",
          "at": "start"
        },
        {
          "id": "luofengpo-horse",
          "speaker": "pangtong",
          "text": "聽，箭都追着的盧去了。張任守的是劉備必騎白馬，不是落鳳坡。",
          "at": "hand:2",
          "when": "fact:luofengpo_horse_decoy"
        },
        {
          "id": "luofengpo-banner",
          "speaker": "pangtong",
          "text": "鳳旗向東，伏兵便向東。所謂落鳳，也可以由我指定落在哪處。",
          "at": "hand:2",
          "when": "fact:luofengpo_banner_decoy"
        },
        {
          "id": "luofengpo-turn",
          "speaker": "zhangren",
          "text": "白馬是假，旗號也是假。你們拿我的謹慎，做了自己的弓。",
          "at": "hand:3"
        },
        {
          "id": "luofengpo-low",
          "speaker": "liubei",
          "text": "士元，伏兵已亂。今日不換馬，換一條他們沒寫過的路。",
          "at": "low"
        }
      ],
      "win": {
        "text": "箭雨落在空馬與假旗之後，龐統從側坡踏上高處。他沒有慶幸地名失效，只在那封“多凶少吉”的信後添了四字：人心亦然。成都的關門，第一次爲鳳雛露出縫隙。",
        "hook": "鳳雛入蜀，漢中隨之成爲下一張必爭之牌。定軍山上，黃忠正在擦拭一把不肯老的刀。"
      },
      "loss": {
        "text": "你只顧離開的盧，卻仍沿張任預設的山道前行。避開了被認出的馬，沒有避開被算準的人；第二輪箭雨不再等候號令。",
        "clue": "史鑑 · 張任先認旗號再下令，伏兵齊射前有一次錯認；重開時看破提升。",
        "clueFx": "keenEye"
      },
      "intros": {
        "zhangren": [
          {
            "bio": "他記得伏兵怎樣撲空，這一次把每面旗號都問得更細。",
            "quote": "旗號可以換。守土的心，你換不了。",
            "when": "seen:zhangren"
          },
          {
            "bio": "西川第一忠勇，謹慎是他守城的牆，也是伏兵的號令。",
            "quote": "白馬未現，諸軍不得擅發一箭。"
          }
        ]
      }
    },
    "jiameng": {
      "cast": [
        "zhangfei",
        "machao",
        "zhuge",
        "weiyan"
      ],
      "objective": "在葭萌關的火盆邊,讓兩杆天下最烈的槍打完,再談誰跟誰走。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "渭南的敗兵投了張魯,馬超領兵來到葭萌關下。關上的張飛聽說來的是他,先大笑三聲,再讓人把戒酒的誓書壓在案下。"
        },
        {
          "speaker": "zhangfei",
          "text": "馬超!聽說你在潼關追得曹操割須?好!俺老張遇強則喜——來來來,大戰三百回合!"
        },
        {
          "speaker": "machao",
          "text": "燕人張飛?潼關之後,人人都說天下只有你的三弟配和我一戰。放馬過來!"
        },
        {
          "speaker": "zhuge",
          "text": "翼德,此人恨極而勇,不可力取。亮只要你記住:打滿,別打死。",
          "when": "!fact:jiameng_done"
        },
        {
          "speaker": "weiyan",
          "text": "軍師,文長願領一軍繞後。若張將軍有個閃失——",
          "when": "seen:weiyan"
        }
      ],
      "map": [
        {
          "id": "lamp-duel",
          "title": "葭萌關 · 挑燈夜戰",
          "node": 1,
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "天黑了打不痛快!來人,點起火把,兩百盞!俺們夜戰!"
            },
            {
              "speaker": "machao",
              "text": "好氣魄!張飛,你比我聽聞的更像條漢子!"
            },
            {
              "speaker": "you",
              "text": "火把照得亮槍,也照得亮人心。打到後來,槍會說話。"
            }
          ],
          "choices": [
            {
              "id": "keep-count",
              "text": "替張飛數回合,嚴控體力",
              "detail": "本回看破提升,記住二百回合",
              "effects": {
                "keenEye": true,
                "fact": "jiameng_count"
              }
            },
            {
              "id": "warm-wine",
              "text": "溫兩碗酒候在場邊",
              "detail": "軍資 +120,二人愈戰愈敬",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "jiameng_wine"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "jiameng-open",
          "speaker": "zhangfei",
          "text": "馬超!接矛!今日不喝倒你,俺老張不姓張!",
          "at": "start"
        },
        {
          "id": "jiameng-fire",
          "speaker": "narrator",
          "text": "兩百盞火把把戰場照成了白晝。兩杆槍在光裏絞了又絞,看臺上的人漸漸忘了喝彩。",
          "at": "hand:2"
        },
        {
          "id": "jiameng-madai",
          "speaker": "madai",
          "text": "兄長,退吧!張魯的援兵到不了,西涼的人也剩不多了!",
          "at": "hand:3",
          "when": "!fact:jiameng_wine"
        },
        {
          "id": "jiameng-wine",
          "speaker": "machao",
          "text": "……場邊那兩碗酒,是給誰的?",
          "at": "hand:3",
          "when": "fact:jiameng_wine"
        },
        {
          "id": "jiameng-low",
          "speaker": "zhuge",
          "text": "翼德,收三分力。此人心中有事,槍再烈,也撐到頭了。",
          "at": "low"
        }
      ],
      "win": {
        "text": "兩百餘合之後,火把燒短了半截。張飛把矛往地上一拄:\"馬超,歇一夜,明日再打!\"馬超在馬上沉默良久,忽然問:\"張將軍,劉皇叔……真能容下我這身仇?\"場邊那兩碗溫酒,最終三個人分了——你,翼德,和一杆放平的槍。",
        "hook": "葭萌的火盆邊,西涼的槍找到了新的方向。而在荊州,魯肅正爲一張借據,請雲長過江。"
      },
      "loss": {
        "text": "你急着替張飛找勝機,反而打斷了那杆槍想說的話。馬超勒馬回陣,從此閉門不出,誰也請不動。",
        "clue": "史鑑 · 這一頁的勝負在槍外。重開時讓兩人打滿:數回合者得全局,溫酒者得人心。",
        "clueFx": "sow"
      },
      "intros": {
        "machao": [
          {
            "bio": "渭南的墨點他至今沒想透,這份恨意使他的槍少了三分方向。",
            "quote": "離間計贏不了兩次。這次,只論槍!",
            "when": "page:tongguan:yeshi"
          },
          {
            "bio": "他與張飛一戰之後,槍裏多了些說不清的東西。",
            "quote": "又見面了。這次,先打完,再說話。",
            "when": "seen:machao"
          },
          {
            "bio": "敗軍之將,把最後的體面都押在了這杆槍上。",
            "quote": "西涼已失,家已無。我只有這場仗。"
          }
        ],
        "madai": [
          {
            "bio": "他護着堂兄的側翼,也護着馬家最後的人丁。",
            "quote": "我兄長的事,便是我馬岱的事。",
            "when": "seen:madai"
          },
          {
            "bio": "話不多的西涼刀客,刀法與心事一樣沉。",
            "quote": "先過我這一關。"
          }
        ]
      }
    },
    "daodan": {
      "cast": [
        "guanyu",
        "lusu",
        "guanping",
        "zhoucang",
        "zhuge"
      ],
      "objective": "在陸口的酒宴上,讓魯肅討不到荊州,也讓關羽不必拔刀。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "魯肅的請帖寫了三遍,措辭一遍比一遍客氣。江心的船已備好,艙裏坐着刀斧手,帖上卻只寫了一個「敘舊」。"
        },
        {
          "speaker": "lusu",
          "text": "雲長,肅別無他意,只求把荊州的賬,當面算清。"
        },
        {
          "speaker": "guanyu",
          "text": "子敬相邀,關某豈敢不來。平兒,隨我赴宴;周倉,扛刀。"
        },
        {
          "speaker": "guanping",
          "text": "父親,臨行前軍師囑託:此宴在酒,不在荊州;在信,不在刀。"
        },
        {
          "speaker": "zhoucang",
          "text": "俺就把刀立在船頭,讓江東人看看分量!"
        }
      ],
      "map": [
        {
          "id": "river-feast",
          "title": "陸口 · 江心一宴",
          "node": 1,
          "lines": [
            {
              "speaker": "lusu",
              "text": "雲長,席間只有你我舊誼,別無他事——肅先乾爲敬。"
            },
            {
              "speaker": "guanyu",
              "text": "子敬的酒,關某喝。荊州的賬,醉後再說。"
            },
            {
              "speaker": "you",
              "text": "借據壓在他袖底,刀斧手壓在船板下。誰先急,誰先輸。"
            }
          ],
          "choices": [
            {
              "id": "count-cups",
              "text": "數魯肅斟酒的節奏與眼神",
              "detail": "本回看破提升,記住斟酒之律",
              "effects": {
                "keenEye": true,
                "fact": "daodan_count"
              }
            },
            {
              "id": "hold-scabbard",
              "text": "按住周倉的刀鞘,先禮後兵",
              "detail": "東吳伏兵起手士氣 -1,記住按刀之義",
              "effects": {
                "sow": 1,
                "fact": "daodan_hold"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "daodan-open",
          "speaker": "lusu",
          "text": "雲長,今日只談舊誼。來,滿飲此杯——",
          "at": "start"
        },
        {
          "id": "daodan-deed",
          "speaker": "guanyu",
          "text": "子敬,酒是好酒。只是這借據上的墨,關某記得比你清楚。",
          "at": "hand:2"
        },
        {
          "id": "daodan-blade",
          "speaker": "zhoucang",
          "text": "船板底下有腳步聲!將軍,俺的刀——",
          "at": "hand:3",
          "when": "!fact:daodan_hold"
        },
        {
          "id": "daodan-hold",
          "speaker": "guanyu",
          "text": "周倉,退後。今日這把刀,只陪關某喝酒。",
          "at": "hand:3",
          "when": "fact:daodan_hold"
        },
        {
          "id": "daodan-low",
          "speaker": "guanping",
          "text": "父親,魯肅親自送我們到船頭了。他的手,一直在袖子裏攥着那份借據。",
          "at": "low"
        }
      ],
      "win": {
        "text": "船離江心,魯肅立在渡口,久久望着那口八十二斤的刀遠去。他沒有摔杯,因爲關羽臨走時說:\"子敬,荊州之約,關某記下了。你保的不是借據,是兩家還沒破裂的信。\"回營的船上汽笛無聲,只有你知道,這杯酒替荊州又買了幾年。",
        "hook": "單刀會散,兩家的賬卻沒散。合肥的方向,一聲更比一聲緊的戰鼓,正在等孫權。"
      },
      "loss": {
        "text": "刀出鞘的那一瞬,宴席就輸了。你沒能按住那八十二斤的火氣,也沒能按住船板下的短兵。江水把「單刀赴會」衝成了「兩敗俱傷」。",
        "clue": "史鑑 · 魯肅要的是「信」不是「城」,伏兵等的是「刀」不是「理」。重開後看破提升,先按刀,再算賬。",
        "clueFx": "keenEye"
      },
      "intros": {
        "lusu": [
          {
            "bio": "他上次沒能討回荊州,這一次把道理磨得更圓,刀斧手埋得更深。",
            "quote": "雲長,這次肅要的仍不是降,是一個「還」字。",
            "when": "seen:lusu"
          },
          {
            "bio": "江東最厚道的人,也終於學會了在酒裏設局。",
            "quote": "借據在此。雲長,請過目。"
          }
        ],
        "dingfeng": [
          {
            "bio": "他埋伏的位置換了三次,卻始終沒等到那聲摔杯。",
            "quote": "再等等……主將的杯子,怎麼還不落地?",
            "when": "seen:dingfeng"
          },
          {
            "bio": "雪中奮短兵的老將,此刻把短兵藏在了案幾之下。",
            "quote": "酒過三巡,聽杯爲號。"
          }
        ]
      }
    },
    "xiaoyaojin": {
      "cast": [
        "sunquan",
        "zhangliao",
        "lingtong",
        "ganning",
        "zhoutai"
      ],
      "objective": "在逍遙津的窄橋邊,讓張遼的八百衝不散十萬,也護住淩統的斷後。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "合肥城頭,張遼把八百死士列在門前,甲葉上一滴水都沒有——他們已等了一夜。城外,吳軍十萬,剛拔完營。"
        },
        {
          "speaker": "zhangliao",
          "text": "吳人新至,營壘未立。此刻衝陣,八百人能當八萬。隨我——衝!"
        },
        {
          "speaker": "sunquan",
          "text": "張遼?!他怎麼敢出城!各營勿慌,先穩住——甘寧,淩統,護住側翼!"
        },
        {
          "speaker": "lingtong",
          "text": "主公先走!凌家三百親兵,還夠擋一陣!"
        },
        {
          "speaker": "ganning",
          "text": "公績!別逞英雄!你的三百人,不是拿來換主公一程的!"
        }
      ],
      "map": [
        {
          "id": "half-ford",
          "title": "逍遙津 · 半渡之橋",
          "node": 1,
          "lines": [
            {
              "speaker": "zhoutai",
              "text": "主公,津橋的板朽了兩塊,馬不能疾馳。幼平先背主公過橋!"
            },
            {
              "speaker": "lingtong",
              "text": "幼平帶主公走!我擋張遼!"
            },
            {
              "speaker": "you",
              "text": "張遼要的不是殺孫權,是「吳軍自亂」四個字。別把十萬人的心,輸給八百人的膽。"
            }
          ],
          "choices": [
            {
              "id": "hold-line",
              "text": "教十萬軍先結陣,再渡橋",
              "detail": "本回看破提升,記住結陣渡橋",
              "effects": {
                "keenEye": true,
                "fact": "xiaoyaojin_line"
              }
            },
            {
              "id": "rear-guard",
              "text": "親領斷後,換主公先渡",
              "detail": "軍資 +100,張遼軍起手士氣 -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "xiaoyaojin_rear"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "xiaoyaojin-open",
          "speaker": "zhangliao",
          "text": "張遼在此!吳軍聽着——今日,只取你們陣中最亂的一處!",
          "at": "start"
        },
        {
          "id": "xiaoyaojin-charge",
          "speaker": "narrator",
          "text": "八百人鑿進吳陣,像一柄錐子。所過之處,十萬人的旗自己在倒。",
          "at": "hand:2"
        },
        {
          "id": "xiaoyaojin-ling",
          "speaker": "lingtong",
          "text": "主公過了橋!三百親兵……還剩幾十。夠了,夠再擋一陣!",
          "at": "hand:3"
        },
        {
          "id": "xiaoyaojin-low",
          "speaker": "sunquan",
          "text": "公績回來!淩統——回來!孤的江東,不能靠你們一個個用命換!",
          "at": "low"
        }
      ],
      "win": {
        "text": "津橋修復的那一瞬,吳軍十萬終於列成了陣。張遼在城頭望見,收刀入鞘:\"吳人能穩住了,此城不可再出。\"淩統渾身是血地踏上橋板,孫權親自下馬扶住他。回建業的路上再無笑聲,只有孫權的一句:\"孤記住了合肥,記住了張文遠。\"",
        "hook": "逍遙津的教訓,讓江東把目光徹底收回荊州。而劉備的漢中鼓聲,已經敲到了定軍山下。"
      },
      "loss": {
        "text": "十萬人的陣,終究沒能擋住八百人的膽。津橋一斷,淩統的三百親兵留在了對岸,張遼的名字從此壓在江東六歲孩童的哭聲裏。",
        "clue": "史鑑 · 張遼贏在「趁亂」不在「兵多」。重開時先結陣再渡橋;他衝不亂你,就輪到他不敢單獨出城。",
        "clueFx": "keenEye"
      },
      "intros": {
        "zhangliao": [
          {
            "bio": "他記得你的陣怎樣在半渡時穩住,這次把衝鋒的時機又提前了半刻。",
            "quote": "又想穩住陣腳?我的刀,不給你列陣的時間。",
            "when": "seen:zhangliao"
          },
          {
            "bio": "八百人的膽,是他一夜一夜喂出來的。",
            "quote": "遼來十年,只爲今日這一衝!"
          }
        ],
        "lejin": [
          {
            "bio": "他與張遼、李典共守合肥,三人面和心齊,刀卻各自藏鋒。",
            "quote": "張將軍衝前,樂某守後——合肥的門,進得來出不去。"
          }
        ],
        "lidian": [
          {
            "bio": "他勸張遼「先折其盛氣」時不帶私怨,佈陣最重「餘地」二字。",
            "quote": "李曼成不與你鬥狠。我只封你要退的路。"
          }
        ]
      }
    },
    "dingjunshan": {
      "cast": [
        "huangzhong",
        "xiahouyuan",
        "zhanghe",
        "fazheng",
        "yanyan"
      ],
      "objective": "借夏侯淵的快與張郃的變互相牽制，讓老將一刀落在兩人換防的半拍。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "定軍山上下各有一面鼓。夏侯淵催人快攻，張郃卻按兵測路；兩面鼓總差半拍，黃忠聽了三遍，解下了弓。"
        },
        {
          "speaker": "huangzhong",
          "text": "他們說老將只剩一刀。夠是夠，只怕有人快得撞上來，有人巧得不肯來。"
        },
        {
          "speaker": "fazheng",
          "text": "漢升,山上兩將不和,便是天給你的第三條路。孝直在旌旗上,只寫一個「待」字。",
          "when": "!seen:fazheng"
        },
        {
          "speaker": "yanyan",
          "text": "老哥哥,當年蜀道上一聲「斷頭將軍」,今日原樣奉還。你的側翼,嚴顏包了。"
        },
        {
          "speaker": "xiahouyuan",
          "text": "年邁還敢居高？天明的鼓未響，我便先上山取你的刀。"
        },
        {
          "speaker": "zhanghe",
          "text": "妙才，居高者故意示弱。你若只會快，便正好替他省去誘敵。"
        }
      ],
      "map": [
        {
          "id": "half-beat",
          "title": "定軍山 · 換防半拍",
          "node": 1,
          "lines": [
            {
              "speaker": "zhanghe",
              "text": "我若向左補防，妙才必從右路搶功。你站得越高，他越不肯等我的旗。"
            },
            {
              "speaker": "xiahouyuan",
              "text": "等你陣成，黃忠早跑了！速戰便是最穩的陣。"
            },
            {
              "speaker": "huangzhong",
              "text": "不必盼他們和睦。一快一慢，正好替老朽數刀。"
            }
          ],
          "choices": [
            {
              "id": "measure-beats",
              "text": "先測兩營更鼓，再布刀陣",
              "detail": "看破提升，記住半拍",
              "effects": {
                "keenEye": true,
                "fact": "dingjunshan_measured_beats"
              }
            },
            {
              "id": "leave-antlers",
              "text": "留一段殘破鹿角誘敵搶修",
              "detail": "曹軍起手軍資 -200，記住假隙",
              "effects": {
                "raid": true,
                "fact": "dingjunshan_repair_bait"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "dingjunshan-open",
          "speaker": "xiahouyuan",
          "text": "張郃你看住側翼。至於你——接得住我三次快攻，再談年邁不年邁。",
          "at": "start",
          "when": "multi"
        },
        {
          "id": "dingjunshan-change",
          "speaker": "zhanghe",
          "text": "他越催，你越該看我。妙才的刀從正面來，我的陣可從你背後合。",
          "at": "hand:2",
          "when": "multi"
        },
        {
          "id": "dingjunshan-measured",
          "speaker": "huangzhong",
          "text": "你量的不是山，是妙才聽見快字以後，不肯回頭的那半拍。",
          "at": "hand:3",
          "when": "fact:dingjunshan_measured_beats"
        },
        {
          "id": "dingjunshan-bait",
          "speaker": "huangzhong",
          "text": "你補的不是鹿角，是給妙才一條非快不可的理由。現在，等他衝開門。",
          "at": "hand:3",
          "when": "fact:dingjunshan_repair_bait"
        },
        {
          "id": "dingjunshan-low",
          "speaker": "huangzhong",
          "text": "一個要我快，一個要他慢。老朽只需站在兩令之間。",
          "at": "low",
          "when": "multi"
        }
      ],
      "win": {
        "text": "夏侯淵衝進那半拍時，張郃的新陣尚未轉身。黃忠沒有追第二刀，只把刀背在肩上一橫，漢中各營便同時改旗。山上的兩面鼓，終於只敲出一個更次。",
        "hook": "漢中的勝利把關羽推上威震華夏的高處。沔水秋雨將至，盛名也會成爲最醒目的一面旗。"
      },
      "loss": {
        "text": "夏侯淵的快逼你倉促，張郃的變又封住退路。你等着他們相撞，卻先被兩種節奏輪流拖走；老將的刀始終沒有出鞘。",
        "clue": "史鑑 · 兩人會交替搶速與變陣，等一方行動後再讀另一方；重開時看破提升。",
        "clueFx": "keenEye"
      },
      "intros": {
        "xiahouyuan": [
          {
            "bio": "兵貴神速是他的軍令，也是別人最容易撥快的那面鼓。",
            "quote": "張郃善變，夏侯善速。你先接哪一個？"
          }
        ],
        "zhanghe": [
          {
            "bio": "巧變名將，最會改陣，卻未必改得了同袍的急性。",
            "quote": "兵無常勢。可惜妙才只認一種快。"
          }
        ],
        "huangzhong": [
          {
            "bio": "老將不與人爭腳力，只爭敵人邁入刀勢的那一步。",
            "quote": "老的是年歲，不是這一刀。"
          }
        ]
      }
    },
    "shuiyan": {
      "cast": [
        "guanyu",
        "yujin",
        "pangde"
      ],
      "objective": "蓄水而不恃水，在七軍改營前鎖住高地與退路，把天時變成軍令。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "沔水已經漫過舊界石，于禁仍把營壘排得一線不亂。龐德的棺木停在轅門外，漆色比烏雲更沉。"
        },
        {
          "speaker": "guanyu",
          "text": "七軍之穩，在令行禁止；七軍之險，也在無人敢先違令移營。"
        },
        {
          "speaker": "yujin",
          "text": "關雲長，天時未必助你。營中糧尚可支十日，你若久等，先亂的是樊城外。"
        },
        {
          "speaker": "pangde",
          "text": "於將軍,龐某此來,櫬已在營外。你我同守,守的不是魏土,是各自主帥的名字。",
          "when": "!seen:pangde"
        },
        {
          "speaker": "you",
          "text": "他要等雨停。我不必讓雨更早，只要讓他捨不得先動。"
        }
      ],
      "map": [
        {
          "id": "dry-order",
          "title": "罾口川 · 水未先攻",
          "node": 1,
          "lines": [
            {
              "speaker": "yujin",
              "text": "你若決堤，我軍便上高處；你若久圍，樊城先求援。雨再大，也不能替我下令。"
            },
            {
              "speaker": "guanyu",
              "text": "他最需要的不只是高地，還有一道仍允許他守住體面的軍令。"
            },
            {
              "speaker": "you",
              "text": "那就給他一條看似不必移營的退路。"
            }
          ],
          "choices": [
            {
              "id": "old-channel",
              "text": "留出舊河道，示弱不封",
              "detail": "看破退路，記住舊河道",
              "effects": {
                "keenEye": true,
                "fact": "shuiyan_old_channel"
              }
            },
            {
              "id": "highland-stakes",
              "text": "暗樁封住高地渡口",
              "detail": "于禁起手軍資 -200，記住暗樁",
              "effects": {
                "raid": true,
                "fact": "shuiyan_highland_stakes"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "shuiyan-open",
          "speaker": "yujin",
          "text": "軍陣未亂，水便只是水。關羽盛名在外，也不過要等天替他交戰。",
          "at": "start"
        },
        {
          "id": "shuiyan-channel",
          "speaker": "guanyu",
          "text": "舊河道看似能退，其實最淺。于禁不肯棄營，你便把這條穩路走成絕路。",
          "at": "hand:2",
          "when": "fact:shuiyan_old_channel"
        },
        {
          "id": "shuiyan-stakes",
          "speaker": "guanyu",
          "text": "暗樁已沉。他仍說高地可登，只因還沒看見水下那道門已經關了。",
          "at": "hand:2",
          "when": "fact:shuiyan_highland_stakes"
        },
        {
          "id": "shuiyan-no-reply",
          "speaker": "yujin",
          "text": "水位過膝，各軍仍不得擅動。等等——傳令高地，爲何不回報？",
          "at": "hand:3"
        },
        {
          "id": "shuiyan-low",
          "speaker": "guanyu",
          "text": "水不是刀。令他不能退的是軍令如山，水只負責把山淹了。",
          "at": "low"
        }
      ],
      "win": {
        "text": "七軍旗幟一面面沒入渾水，于禁放下劍時，關羽先命人遞去一條幹舟，而非繩索。威震華夏的呼聲到夜裏才起；他卻獨自回望上游，像已看見盛名之後那條更窄的雪路。",
        "hook": "于禁已擒，許都震動。呂蒙卻在江東脫下戰袍、換上白衣，陸遜把一封極恭順的信送往荊州。"
      },
      "loss": {
        "text": "雨終於來了，你卻把漲水當成已經獲勝。于禁依令退上高地，七軍雖溼未亂；關羽的樓船反而被堵在自己準備的河道里。",
        "clue": "史鑑 · 水勢只壓低陣型，不等於封死退路；先奪高地，重開時看破提升。",
        "clueFx": "keenEye"
      },
      "intros": {
        "yujin": [
          {
            "bio": "他記得低窪怎樣吞掉軍陣，這次仍不肯讓一次擅動毀去嚴名。",
            "quote": "水漲可測。軍心，不可先亂。",
            "when": "seen:yujin"
          },
          {
            "bio": "泰山之穩，最信軍令，也最晚承認軍令已經過時。",
            "quote": "各營聽令，無令不得移駐一步。"
          }
        ],
        "pangde": [
          {
            "bio": "西涼舊部出身的他不信天命,只信手中刀與營外那口棺。",
            "quote": "再戰一場。棺未用,人未還。",
            "when": "seen:pangde"
          },
          {
            "bio": "他記得西涼的散與聚,如今把不服換成了決死的忠。",
            "quote": "馬兒敗在西涼。龐某,不會敗在這裏。",
            "when": "page:tongguan:yeshi"
          },
          {
            "bio": "抬櫬而來的降將,每一箭都在替自己的名節還債。",
            "quote": "櫬在此。關公,請全力。"
          }
        ]
      }
    },
    "maicheng": {
      "cast": [
        "guanyu",
        "lvmeng",
        "luxun",
        "guanping",
        "zhoucang",
        "panzhang"
      ],
      "objective": "拆穿白衣與卑辭共同織成的舊我之局，讓關羽不以華容的舊賬決定麥城的活路。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "麥城的雪蓋住烽火臺，呂蒙的白衣與陸遜的綬帶一前一後入帳。關羽案上，擺着當年華容留下的一截刀穗。"
        },
        {
          "speaker": "guanyu",
          "text": "那日刀未落，曹軍今日在北按兵。關某放下的義，原來會沿地圖回來要賬。",
          "when": "choice:huarong:yeshiB"
        },
        {
          "speaker": "guanyu",
          "text": "那日刀落，北方諸侯各懷心思，求援的信到臨沮便沒了下文。恩義清了，路卻未寬。",
          "when": "choice:huarong:yeshi"
        },
        {
          "speaker": "guanping",
          "text": "父親,平兒探過路了:北面小道可走,唯臨沮一帶林密,恐有吳人設網。"
        },
        {
          "speaker": "zhoucang",
          "text": "俺的腿快過他們的馬!將軍上馬,俺扛刀開路——誰擋,俺踩誰!"
        },
        {
          "speaker": "lvmeng",
          "text": "雲長，你最盛時水淹七軍；可盟友與舊敵，都從那場水裏學會了怎樣對付你。"
        }
      ],
      "map": [
        {
          "id": "old-self-road",
          "title": "臨沮 · 雪路舊賬",
          "node": 1,
          "lines": [
            {
              "speaker": "lvmeng",
              "text": "我們不必猜關羽會不會降。只要算出他還相信誰，麥城便沒有第二扇門。"
            },
            {
              "speaker": "guanyu",
              "text": "荊州之失，不在一城一將。是每個人都把舊日的我，當成了今日的路標。"
            },
            {
              "speaker": "lvmeng",
              "text": "華容刀未落，曹操便欠你一命。可他按兵，是要還情，還是要等吳蜀兩傷？",
              "when": "choice:huarong:yeshiB"
            },
            {
              "speaker": "luxun",
              "text": "華容刀落，北方自顧不暇。你燒掉一條外援，也燒掉了敵人對你的舊判斷。",
              "when": "choice:huarong:yeshi"
            }
          ],
          "choices": [
            {
              "id": "split-letters",
              "text": "把求援信分送北、西兩路",
              "detail": "軍資 +150，呂蒙軍資 +100，記住分信",
              "effects": {
                "chips": 150,
                "oppChips": 100,
                "fact": "maicheng_split_letters"
              }
            },
            {
              "id": "burn-letters",
              "text": "燒掉舊信，只帶精銳突圍",
              "detail": "看破提升，記住焚信",
              "effects": {
                "keenEye": true,
                "fact": "maicheng_burn_letters"
              }
            },
            {
              "id": "false-beacons",
              "text": "重燃烽燧，假作仍在堅守",
              "detail": "吳軍起手軍資 -200，記住空烽",
              "effects": {
                "raid": true,
                "fact": "maicheng_false_beacons"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "maicheng-open",
          "speaker": "lvmeng",
          "text": "陸遜讓你以爲還有時間，我負責讓時間走完。雲長，該換一種看法了。",
          "at": "start",
          "when": "multi"
        },
        {
          "id": "maicheng-letters",
          "speaker": "luxun",
          "text": "你每次求援，我都先替收信人想一遍。等你想通，路已成了我的陣。",
          "at": "hand:2",
          "when": "multi"
        },
        {
          "id": "maicheng-spared",
          "speaker": "guanyu",
          "text": "華容那一放，不是叫曹操今日替我活。關某的義，從不向北國收利。",
          "at": "hand:3",
          "when": "choice:huarong:yeshiB"
        },
        {
          "id": "maicheng-slain",
          "speaker": "guanyu",
          "text": "華容那一落，關某未曾後悔。今日才懂，殺一人不能殺盡天下的算計。",
          "at": "hand:3",
          "when": "choice:huarong:yeshi"
        },
        {
          "id": "maicheng-zhouyu",
          "speaker": "lvmeng",
          "text": "你讓公瑾多活十年，卻沒讓江東忘掉荊州。他欠你一命，我不能替他還一城。",
          "at": "hand:4",
          "when": "page:sanqi:yeshi"
        },
        {
          "id": "maicheng-low-split",
          "speaker": "you",
          "text": "分信不是等誰來救，是讓吳軍不知該堵哪路。援書未至，疑兵已經出城。",
          "at": "low",
          "when": "fact:maicheng_split_letters"
        },
        {
          "id": "maicheng-low-burn",
          "speaker": "you",
          "text": "舊信燒盡，呂蒙只能猜今日的關羽。突圍，也要先讓舊我消失。",
          "at": "low",
          "when": "fact:maicheng_burn_letters"
        },
        {
          "id": "maicheng-low-beacon",
          "speaker": "you",
          "text": "烽火仍亮，呂蒙回頭望城的一瞬，雪下小路纔不是他算好的那頁。",
          "at": "low",
          "when": "fact:maicheng_false_beacons"
        }
      ],
      "win": {
        "text": "麥城西門在雪停前打開，關羽帶殘軍突出臨沮。華容那一刀，無論落過或未落，都沒有替今日開門；他把舊刀穗留在雪中，活着的人不再拿舊賬抵新命。荊州尚有來路，季漢也尚有一局。",
        "hook": "荊州未失，復仇之名卻未必會散。夷陵的營火與白帝城的託孤，都在下一卷等你改寫。"
      },
      "loss": {
        "text": "呂蒙算你的舊義，陸遜算你的新斷。一個封住求援，一個等你猶豫；雪停時，麥城仍只記住了那個不肯改變的關羽。",
        "clue": "史鑑 · 呂蒙與陸遜會分別利用舊恩與退路；重開時看破提升，華容的選擇仍會留下不同勸諫。",
        "clueFx": "keenEye"
      },
      "intros": {
        "panzhang": [
          {
            "bio": "他惦記的從來不只是城,還有城裏那口八十二斤的刀。",
            "quote": "青龍刀……這次,該換個主人了。",
            "when": "seen:panzhang"
          },
          {
            "bio": "設網的人先算的不是兵,是走投無路者的習慣。",
            "quote": "雪夜趕路的人,總愛挑最近的那條。"
          }
        ],
        "lvmeng": [
          {
            "bio": "他知道你曾放曹操北歸，便把這段舊義也算進了求援路。",
            "quote": "你能縱虎，能否走過我留給義氣的路？",
            "when": "choice:huarong:yeshiB"
          },
          {
            "bio": "他記得華容刀落，不再指望舊恩能拖住你的刀。",
            "quote": "你既殺過曹操，便該知道我無舊恩可還。",
            "when": "choice:huarong:yeshi"
          },
          {
            "bio": "白衣之下不是商賈，是一個把關羽讀得太熟的人。",
            "quote": "士別三日。雲長，可還認得呂蒙？"
          }
        ],
        "luxun": [
          {
            "bio": "公瑾因你而活，他卻要證明救命之恩改變不了荊州之爭。",
            "quote": "你救得公瑾，未必救得荊州。",
            "when": "page:sanqi:yeshi"
          },
          {
            "bio": "他把恭順寫得越低，麥城四周的網便收得越慢、越緊。",
            "quote": "後生陸遜，特來向威震華夏者請教。"
          }
        ]
      }
    },
    "yiling": {
      "cast": [
        "liubei",
        "luxun",
        "guanyu",
        "zhuge",
        "huangquan",
        "maliang",
        "shamoke"
      ],
      "objective": "拆開七百里連營，在陸遜點火之前，讓劉備看見覆仇之外還有多少條命。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "猇亭的林葉密得透不過風。每一座營盤都挨着下一座，像有人把七百里怨氣鋪成了一根火繩。"
        },
        {
          "speaker": "guanyu",
          "text": "麥城那條命，是你替我奪回來的。今日若還要東征，便別再拿我當報仇的理由。",
          "when": "page:maicheng:yeshi"
        },
        {
          "speaker": "liubei",
          "text": "雲長的首級送到洛陽時，朕沒有哭。如今每一座營裏都有人喊他，朕便不能再退。",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "huangquan",
          "text": "陛下,水軍當爲前鋒,沿江直下;若舍船就陸,連營林木之間,是把七百里的命交給天時。",
          "when": "!seen:huangquan"
        },
        {
          "speaker": "maliang",
          "text": "五溪番王沙摩柯已到,夷陵道上的圖,馬良又核了一遍。陛下,只差您一句「移營」。"
        },
        {
          "speaker": "shamoke",
          "text": "漢家皇帝替俺們撐腰,這一仗,番王的骨朵不認吳人的水!"
        },
        {
          "speaker": "luxun",
          "text": "我不怕劉使君怒。他越怒，越會把山林、連營和人心，親手擺成一堆柴。"
        }
      ],
      "map": [
        {
          "id": "move-camps",
          "title": "猇亭 · 火未到先移營",
          "node": 1,
          "lines": [
            {
              "speaker": "liubei",
              "text": "將士避暑入林，是朕的令。今日移營，便是叫他們以爲朕怕了陸遜。"
            },
            {
              "speaker": "zhuge",
              "text": "陛下，陸遜固守不是怯，是在等我們自己把營盤擺成柴。可退一座孤營，不可退七百里人心。"
            }
          ],
          "choices": [
            {
              "id": "high-ground",
              "text": "棄林就高，拆開相連營壘",
              "detail": "本回看破提升，記住移營之策",
              "effects": {
                "keenEye": true,
                "fact": "yiling_high_camp"
              }
            },
            {
              "id": "fire-oil",
              "text": "夜襲吳軍火油隊",
              "detail": "陸遜軍資 -200，記住火油所在",
              "effects": {
                "raid": true,
                "fact": "yiling_fireoil"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "yiling-open",
          "speaker": "luxun",
          "text": "你催得越急，我越不必急。你押上的不是軍資，是蜀營還能忍幾日。",
          "at": "start"
        },
        {
          "id": "yiling-anguish",
          "speaker": "liubei",
          "text": "我若在此退一步，是否便對不起那些隨我入蜀、又隨我東征的人？",
          "at": "hand:2"
        },
        {
          "id": "yiling-brother",
          "speaker": "guanyu",
          "text": "大哥，我的命尚在。別再拿別人的命祭我。",
          "at": "hand:3",
          "when": "page:maicheng:yeshi"
        },
        {
          "id": "yiling-counsel",
          "speaker": "zhuge",
          "text": "亡者不會因多死幾人便歸來。先看火油，再看你的仇。",
          "at": "hand:3",
          "when": "!page:maicheng:yeshi"
        },
        {
          "id": "yiling-low",
          "speaker": "luxun",
          "text": "你終於肯看營外了。可惜火燒起來以後，再清醒的將令也會慢一步。",
          "at": "low"
        }
      ],
      "win": {
        "text": "第一支火箭落下時，舊營已經空了。陸遜隔江望着分散的高壘，終於收起那柄始終未點的火折。劉備沒有乘勝追殺，只命人逐營清點歸鄉的姓名。",
        "hook": "夷陵沒有燒成灰燼，劉備卻倒在了永安宮。下一頁，對手連姓名也沒有。"
      },
      "loss": {
        "text": "火沿營盤奔去，比任何一道軍令都快。你護着劉備退向白帝，才懂陸遜等的從來不是東風，而是你因憤怒而不肯改變的那一夜。",
        "clue": "史鑑 · 陸遜以固守拖高盲注，再賭你急於求成；重開時假破綻減少，先拆連營之勢。",
        "clueFx": "keenEye"
      },
      "intros": {
        "luxun": [
          {
            "bio": "荊州無恙，他仍守着江東；這一戰不再只是復仇，卻仍可能毀於意氣。",
            "quote": "關將軍尚在，這仗便不該只爲一口氣。",
            "when": "page:maicheng:yeshi"
          },
          {
            "bio": "他把少年意氣藏進儒生衣袖，等劉備自己把勝機連成火路。",
            "quote": "你家主公要仇，我要江東。火該落在何處？"
          }
        ]
      }
    },
    "baidicheng": {
      "cast": [
        "liubei",
        "zhuge",
        "guanyu",
        "caopi"
      ],
      "objective": "同沉痾爭回劉備的時間，也讓那句託孤從試探與重擔，變回真正的信任。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "永安宮的藥香壓不住江潮。劉備枕邊放着寫了一半的遺詔，最後幾個字遲遲不肯落下。"
        },
        {
          "speaker": "narrator",
          "text": "兩年前，曹丕在受禪臺上接過漢家玉璽。消息傳到成都，滿朝勸進——先主登基，爲的是續漢，也爲了一句「漢可不亡」。"
        },
        {
          "speaker": "caopi",
          "text": "舜禹之事,朕知之矣。漢四百年,終須有人替它合上書頁——玄德,你不肯嗎?",
          "when": "!seen:caopi"
        },
        {
          "speaker": "liubei",
          "text": "雲長還活着，夷陵也沒燒起來。可我爲何還是躺到了這裏？原來人躲過自己的錯，也躲不過歲月。",
          "when": [
            "page:maicheng:yeshi",
            "page:yiling:yeshi"
          ]
        },
        {
          "speaker": "liubei",
          "text": "雲長還活着，夷陵的火卻仍舊燒過。原來救下一個名字，並不會替我們免去下一場錯。",
          "when": [
            "page:maicheng:yeshi",
            "!page:yiling:yeshi"
          ]
        },
        {
          "speaker": "liubei",
          "text": "二弟走後，我總覺得每一天都是借來的。今日連借也沒處借了，只得把阿斗和孔明都叫來。",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "陛下，病可醫，話不可反着留。您今日想見的是臣，還是一個能替您背完蜀漢的人？"
        }
      ],
      "map": [
        {
          "id": "last-words",
          "title": "永安宮 · 遺詔未落筆",
          "node": 1,
          "lines": [
            {
              "speaker": "liubei",
              "text": "我若說“君可自取”，是信你，還是把我不敢放下的江山壓給你？孔明，你猜我寫這句話時怕不怕？"
            },
            {
              "speaker": "zhuge",
              "text": "主公若真信亮，便別把信任寫成一道不許拒絕的命。臣要的不是自取，是您把阿斗該擔的也留給他。"
            }
          ],
          "choices": [
            {
              "id": "plain-words",
              "text": "請他當面說盡未言之語",
              "detail": "本回看破提升，記住病榻真言",
              "effects": {
                "keenEye": true,
                "fact": "baidi_plain_words"
              }
            },
            {
              "id": "adou-duty",
              "text": "讓阿斗先自己讀完奏章",
              "detail": "天命起手士氣 -1，記住少主親政",
              "effects": {
                "sow": 1,
                "fact": "baidi_adou_duty"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "baidi-open",
          "speaker": "unknown",
          "text": "你改得了人的命，改得了日出日落嗎？",
          "at": "start"
        },
        {
          "id": "baidi-trust",
          "speaker": "liubei",
          "text": "我這一生賣過草鞋，也坐過皇位。臨到最後，最怕的竟是阿斗離了人便站不住。",
          "at": "hand:2"
        },
        {
          "id": "baidi-answer",
          "speaker": "zhuge",
          "text": "那便讓他今日自己站起來。臣能輔他，不能替他活。",
          "at": "hand:3"
        },
        {
          "id": "baidi-brother",
          "speaker": "guanyu",
          "text": "大哥，麥城你沒丟下我。今日也不許先丟下自己。",
          "at": "low",
          "when": "page:maicheng:yeshi"
        },
        {
          "id": "baidi-memory",
          "speaker": "liubei",
          "text": "雲長，若你還在，會不會又罵我只會哭？",
          "at": "low",
          "when": "!page:maicheng:yeshi"
        }
      ],
      "win": {
        "text": "天光透進永安宮時，劉備推開藥碗，自己坐了起來。他把“君可自取”四字從遺詔上劃去，只寫阿斗當親政、孔明當盡言。那句沉重得無人敢接的託付，終於沒有說出口。",
        "hook": "病榻之後，南中又來急報。孟獲不服王化，孔明卻說要先擒住他的心。"
      },
      "loss": {
        "text": "遺詔還是寫完了。諸葛亮俯身接詔，劉備終於安心，卻也把一座江山從此壓在了他一個人的晨起與夜寐上。",
        "clue": "史鑑 · 沉痾靠長久消耗取勝；重開時軍資 +150，先保住自己的底池，再談託孤之外的可能。",
        "clueFx": "supply"
      },
      "intros": {
        "天命 · 沉疴": [
          {
            "bio": "夷陵的火沒能燒盡季漢，它便換作藥碗與更漏，慢慢收走劉備。",
            "quote": "人可躲過戰火，未必躲得過歲月。",
            "when": "page:yiling:yeshi"
          },
          {
            "bio": "它不用兵，也不出千，只把每一天都從病榻前拿走一點。",
            "quote": "你能贏羣雄，可能贏一場病？"
          }
        ],
        "天命 · 沉痾": [
          {
            "bio": "夷陵的火沒能燒盡季漢，它便換作藥碗與更漏，慢慢收走劉備。",
            "quote": "人可躲過戰火，未必躲得過歲月。",
            "when": "page:yiling:yeshi"
          },
          {
            "bio": "它不用兵，也不出千，只把每一天都從病榻前拿走一點。",
            "quote": "你能贏羣雄，可能贏一場病？"
          }
        ]
      }
    },
    "qiqin": {
      "cast": [
        "zhuge",
        "menghuo"
      ],
      "objective": "七戰不只擒人，更要讓孟獲從惱怒、猜疑到自省，親口決定南中的明天。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "瀘水瘴氣未散，第一根絆馬索已經備好。諸葛亮卻命人連孟獲的酒碗也一併洗淨。"
        },
        {
          "speaker": "menghuo",
          "text": "你帶多少兵，我借多少山。南中不是你地圖上一塊空着的地方！"
        },
        {
          "speaker": "zhuge",
          "text": "我若只要你的降表，擒一次便夠。我要的是你回去以後，不必再靠造反證明自己。"
        }
      ],
      "map": [
        {
          "id": "heart-of-nanzhong",
          "title": "瀘水 · 放人與收心",
          "node": 1,
          "lines": [
            {
              "speaker": "menghuo",
              "text": "你們漢人擒了王，不斬便囚。你若真放我，不怕我帶更多人回來？"
            },
            {
              "speaker": "zhuge",
              "text": "怕。所以我不只放你，還要讓你的族人看清：回去以後，鹽糧歸誰，山路歸誰，明日歸誰。"
            }
          ],
          "choices": [
            {
              "id": "listen-elders",
              "text": "先聽南中長者說完舊俗",
              "detail": "本回看破提升，記住南中之約",
              "effects": {
                "keenEye": true,
                "fact": "qiqin_listen"
              }
            },
            {
              "id": "return-salt",
              "text": "分出軍糧鹽巴，送俘虜回鄉",
              "detail": "軍資 -100，孟獲士氣 -1",
              "effects": {
                "chips": -100,
                "sow": 1,
                "fact": "qiqin_hearts"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "qiqin-r1",
          "speaker": "menghuo",
          "text": "一場便想讓我低頭？南中的山都不答應！",
          "at": "start",
          "when": "round:1"
        },
        {
          "id": "qiqin-r2",
          "speaker": "menghuo",
          "text": "上次是絆馬索，不是真本事。有膽再擒我一次！",
          "at": "start",
          "when": "round:2"
        },
        {
          "id": "qiqin-r3",
          "speaker": "menghuo",
          "text": "我輸在自己輕敵，不輸你。下次我把藤甲、毒泉和舊友都帶來。",
          "at": "start",
          "when": "round:3"
        },
        {
          "id": "qiqin-r4",
          "speaker": "menghuo",
          "text": "你燒的是藤甲，不是南中人的心。我還是不服！",
          "at": "start",
          "when": "round:4"
        },
        {
          "id": "qiqin-r5",
          "speaker": "menghuo",
          "text": "爲何每次擒了都放？你到底要我服你，還是服你的漢律？",
          "at": "start",
          "when": "round:5"
        },
        {
          "id": "qiqin-r6",
          "speaker": "menghuo",
          "text": "我若再回去起兵，倒顯得南中只識刀槍。且坐下，把這一局打完。",
          "at": "start",
          "when": "round:6"
        },
        {
          "id": "qiqin-r7",
          "speaker": "menghuo",
          "text": "不必再放。今日我若輸，替南中認你；我若贏，你也留下喝我一碗酒。",
          "at": "start",
          "when": "round:7"
        },
        {
          "id": "qiqin-answer",
          "speaker": "zhuge",
          "text": "他每怒一次，便多問一次爲何。別堵住他的問題，攻心纔有門。",
          "at": "hand:2"
        },
        {
          "id": "qiqin-low",
          "speaker": "menghuo",
          "text": "你贏的是底池，我還沒輸南中。再來！",
          "at": "low",
          "when": "!round:7"
        },
        {
          "id": "qiqin-low-seven",
          "speaker": "menghuo",
          "text": "我若此刻翻臉，先對不起的是那六次回去的路。",
          "at": "low",
          "when": "round:7"
        }
      ],
      "win": {
        "text": "第七次，孟獲沒有等兵士解繩，自己把王冠放在案上：“丞相，七次不是我的恥辱，是你七次肯信我還能明理。”他轉身向族人揮手，南中的鼓聲第一次不爲迎戰而響。",
        "hook": "南中既安，漢中燈亮。諸葛亮展開《出師表》，祁山在紙背等一條新路。"
      },
      "loss": {
        "text": "孟獲又一次走出營門，這次卻沒有回頭。不是他不服，是你只記住了要放六次，忘了每一次都該讓他多明白一點。",
        "clue": "史鑑 · 七場連戰會耗盡底池，擒人之前先留退路；重開時軍資 +150，別爲一時痛快孤注一擲。",
        "clueFx": "supply"
      },
      "intros": {
        "menghuo": [
          {
            "bio": "南中已經心服，他卻仍願回到瀘水，看看那次服氣是不是偶然。",
            "quote": "服過一回，不等於讓你再贏七回！",
            "when": "page:qiqin:yeshi"
          },
          {
            "bio": "他記得上次未被擒滿的七局，也記得你每一次把他放到何處。",
            "quote": "上次沒打完。南王說話算數，從頭來！",
            "when": "seen:menghuo"
          },
          {
            "bio": "他有山的硬、酒的直，也有一句寧死不肯先說出口的“服”。",
            "quote": "先贏我，再跟我講什麼攻心！"
          }
        ]
      }
    },
    "qishan": {
      "cast": [
        "zhuge",
        "zhaoyun",
        "caozhen"
      ],
      "objective": "把《出師表》從遺言寫成開端，在祁山打通一條糧道與人心都能久行的北伐路。",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "隆中那一日，我說天下可分。如今先主把未盡之言交給我，我才懂三分不是答案，只是讓人少流血的起點。",
          "when": "page:sangu:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "草堂門開了多少次，我便欠門外人多少句答覆。今日出師，不爲證明臥龍多智，只爲不再只寫“來日”。",
          "when": "!page:sangu:yeshi"
        },
        {
          "speaker": "zhaoyun",
          "text": "丞相，常山趙子龍還能請先登。別因我白了頭，便把我寫成一面只供人回望的舊旗。"
        },
        {
          "speaker": "caozhen",
          "text": "諸葛亮，你把國事寫成一表，我把祁山寫成一堵牆。看誰先被自己的字困住。"
        }
      ],
      "map": [
        {
          "id": "road-beyond-fire",
          "title": "祁山 · 不用火的進軍",
          "node": 1,
          "lines": [
            {
              "speaker": "zhaoyun",
              "text": "曹真把我的旗號都畫在冊上，卻把我白髮的數目畫多了。他以爲老將只能做疑兵。"
            },
            {
              "speaker": "zhuge",
              "text": "博望初用火時，諸將只問我何時再燒。今日偏不燒——祁山要爭的是一條明年還能走的道。"
            }
          ],
          "choices": [
            {
              "id": "zhaoyun-feint",
              "text": "讓子龍以舊旗佯攻斜谷",
              "detail": "曹真起手士氣 -1，記住常山疑兵",
              "effects": {
                "sow": 1,
                "fact": "qishan_zhaoyun_feint"
              }
            },
            {
              "id": "grain-road",
              "text": "先修糧站，再談進兵",
              "detail": "軍資 +200，記住祁山糧道",
              "effects": {
                "chips": 200,
                "fact": "qishan_grain_road"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "qishan-open",
          "speaker": "caozhen",
          "text": "六出祁山？你若能出六次，我便能守六次。季漢耗得起幾個六年？",
          "at": "start"
        },
        {
          "id": "qishan-patience",
          "speaker": "zhuge",
          "text": "他以爲持久便是原地不動。非也。能讓糧與人持續向前，才叫持久。",
          "at": "hand:2"
        },
        {
          "id": "qishan-veteran",
          "speaker": "zhaoyun",
          "text": "長坂坡我七進七出，不是爲了讓後人只記住一個“勇”字。今日看我怎樣回來。",
          "at": "hand:3"
        },
        {
          "id": "qishan-low",
          "speaker": "caozhen",
          "text": "你不火攻，不奇襲，竟真把一步一營走成了攻勢？",
          "at": "low"
        }
      ],
      "win": {
        "text": "祁山關門未破，山路卻先活了：糧站一站接一站，趙雲的舊旗從斜谷安然折返。曹真這才發現，諸葛亮要的不是一次入關，而是以後每次都能再來。",
        "hook": "路既通，下一道門叫街亭。馬謖已在帳中鋪開地圖，把山上圈得極重。"
      },
      "loss": {
        "text": "《出師表》被風掀回案上。你不是敗在曹真那一堵牆，而是把北伐當成一局必須立刻贏下的豪賭，忘了山路要留給下一年。",
        "clue": "史鑑 · 曹真借祁山消耗你的耐心；重開時假破綻減少，辨清他何時真守、何時等你搶進。",
        "clueFx": "keenEye"
      },
      "intros": {
        "caozhen": [
          {
            "bio": "祁山曾被走通過一次，他不再只守關隘，而要找出那條重新續上的糧路。",
            "quote": "同樣的山路，我不會讓你走通第二次。",
            "when": "page:qishan:yeshi"
          },
          {
            "bio": "他守住的不是一座祁山，而是魏國以逸待勞、耗空季漢的老辦法。",
            "quote": "表寫得再好，糧車也不會自己過山。"
          }
        ]
      }
    },
    "tianshui": {
      "cast": [
        "zhuge",
        "zhaoyun",
        "jiangwei",
        "weiyan",
        "guanxing",
        "zhangbao"
      ],
      "objective": "識破冀城少年的每一步先手,把北伐最大的意外之得,請進蜀營。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "一出祁山,三郡響應。諸葛亮親自設伏天水,卻見城頭一少年按圖佈防,把丞相的疑兵一一識破。"
        },
        {
          "speaker": "zhaoyun",
          "text": "某自長坂以來,未逢敵手。今日天水城下,這少年的槍,竟逼得某撥馬而回。"
        },
        {
          "speaker": "jiangwei",
          "text": "老將軍莫怪。維自幼讀丞相兵法,今日不過是,替守城的弟兄們,把它原樣還回去。"
        },
        {
          "speaker": "zhuge",
          "text": "子龍一生謹慎,能令他「撥馬而回」的人,亮必親往會之。"
        },
        {
          "speaker": "guanxing",
          "text": "丞相,興願隨軍!聽說是同輩人,某這口刀,也想會會他。"
        }
      ],
      "map": [
        {
          "id": "young-reader",
          "title": "天水 · 他在讀你",
          "node": 1,
          "lines": [
            {
              "speaker": "zhuge",
              "text": "亮布疑兵,他識疑兵;亮調糧道,他護糧道。此子用兵,倒像是把亮的舊稿先讀了一遍。"
            },
            {
              "speaker": "weiyan",
              "text": "丞相,何須費事?文長領一軍,連夜拿下冀城,人自然到手!"
            },
            {
              "speaker": "zhangbao",
              "text": "魏將軍急什麼!丞相要的不是城,是那個人。俺爹說過,搶來的不服,請來的才真。"
            },
            {
              "speaker": "you",
              "text": "他現在守的,是郡守的命令。要贏他,得先讓他發現,自己真正想守的是什麼。"
            }
          ],
          "choices": [
            {
              "id": "mirror-plan",
              "text": "以丞相舊稿反設一局",
              "detail": "本回看破提升,記住鏡像之局",
              "effects": {
                "keenEye": true,
                "fact": "tianshui_mirror"
              }
            },
            {
              "id": "open-letter",
              "text": "陣前遞去丞相手書一封",
              "detail": "軍資 +120,姜維起手士氣 -1",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "tianshui_letter"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "tianshui-open",
          "speaker": "jiangwei",
          "text": "丞相的疑兵,某已拆過一遍。你,是第二遍嗎?",
          "at": "start"
        },
        {
          "id": "tianshui-zhaoyun",
          "speaker": "zhaoyun",
          "text": "少年,你的槍是快。可你在守的是馬遵的城,不是你自己的心。",
          "at": "hand:2"
        },
        {
          "id": "tianshui-mirror",
          "speaker": "narrator",
          "text": "他照舊稿布的陣,被你用同一份舊稿反鎖。少年盯着陣圖,忽然發現自己爛熟於胸的,竟是蜀營的路數。",
          "at": "hand:3",
          "when": "fact:tianshui_mirror"
        },
        {
          "id": "tianshui-low",
          "speaker": "zhuge",
          "text": "伯約,亮不奪你的城。亮只想問你一句:你的兵法,可願有個用它的天下?",
          "at": "low"
        }
      ],
      "win": {
        "text": "冀城開城的那天,姜維單騎出降,甲冑未卸,先向蜀營深深一揖。諸葛亮下車扶住他:\"亮平生所學,今有傳人。\"趙雲在一旁按槍而笑。此後北伐的每一次點將,名單上多了一個年輕的、讀遍丞相舊稿的名字。",
        "hook": "得了姜維,北伐的旗更急。可街亭的名字,已在軍圖上冷冷地亮了起來。"
      },
      "loss": {
        "text": "你急於收服,反被少年將計就計。天水城門合攏的那一刻,他站在城頭輕聲說:\"丞相之才,某敬佩。可某的槍,只爲守土而出。\"",
        "clue": "史鑑 · 姜維贏在先手,不在兵多。重開時先遞信、後設局;讓他自己走過來,別去追他。",
        "clueFx": "sow"
      },
      "intros": {
        "jiangwei": [
          {
            "bio": "他記得你怎樣一步步卸掉他的先手,這次把陣紮在了你要來的路上。",
            "quote": "又來?這次,先手在我。",
            "when": "seen:jiangwei"
          },
          {
            "bio": "冀城天水之間的少年郡吏,兵法是偷學的,忠義是自家的。",
            "quote": "姜維在此。丞相的計,某接得住。"
          }
        ]
      }
    },
    "jieting": {
      "cast": [
        "zhuge",
        "masuo",
        "wangping",
        "zhanghe"
      ],
      "objective": "讓馬謖把“高處必勝”改寫成當道與水源，在張郃抵達前守住街亭，也守住他的命。",
      "coldOpen": [
        {
          "speaker": "masuo",
          "text": "丞相，置之死地而後生，兵書寫得明白。山上俯瞰街亭，張郃來多少，我便破多少。"
        },
        {
          "speaker": "wangping",
          "text": "馬參軍，兵書也寫水源。你圈的山頭那麼高，可曾看見士兵要下山幾日才喝到水？"
        },
        {
          "speaker": "zhuge",
          "text": "幼常，我讓你守的不是一幅好看的陣圖。今日若再無人敢駁你，錯便先在我。"
        },
        {
          "speaker": "zhanghe",
          "text": "山上的旗越整齊越好。那樣我只需圍住山下，等他替我軍渴死。"
        }
      ],
      "map": [
        {
          "id": "water-before-height",
          "title": "街亭 · 先看水後看山",
          "node": 1,
          "lines": [
            {
              "speaker": "masuo",
              "text": "若我今日聽王平，是全軍都會說我紙上談兵，還是我終於敢承認自己也有一頁沒讀懂？"
            },
            {
              "speaker": "wangping",
              "text": "參軍，肯改軍令不是丟臉。讓弟兄們活着看見明早，才輪得到你我的臉面。"
            }
          ],
          "choices": [
            {
              "id": "joint-order",
              "text": "讓馬謖與王平共籤守寨軍令",
              "detail": "張郃起手士氣 -1，記住兩人共守",
              "effects": {
                "sow": 1,
                "fact": "jieting_joint_order"
              }
            },
            {
              "id": "survey-water",
              "text": "帶馬謖親自踏勘山下取水路",
              "detail": "本回看破提升，記住水源軍圖",
              "effects": {
                "keenEye": true,
                "fact": "jieting_water_survey"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "jieting-open",
          "speaker": "zhanghe",
          "text": "馬謖在山上？那我不必急着仰攻。先問他營中水囊，還夠幾局。",
          "at": "start"
        },
        {
          "id": "jieting-wangping",
          "speaker": "wangping",
          "text": "他切糧道是假，試水道是真。別追那一面來回晃的旗。",
          "at": "hand:2"
        },
        {
          "id": "jieting-masuo",
          "speaker": "masuo",
          "text": "傳令，下寨當道。不是王平勝了我，是街亭比我的勝負要緊。",
          "at": "hand:3"
        },
        {
          "id": "jieting-low",
          "speaker": "zhanghe",
          "text": "你肯從山上下來，我便少了一半勝算。諸葛亮身邊，竟有人肯認錯。",
          "at": "low"
        }
      ],
      "win": {
        "text": "張郃抵達時，當道營寨已經咬住山口，取水隊從後溝安然往返。馬謖親手劃去圖上的山頂大寨，諸葛亮沒有揮淚，只讓他與王平同坐，重寫那份軍令。",
        "hook": "街亭守住，司馬懿卻轉向西城。那裏沒有馬謖，只有一張琴和敞開的門。"
      },
      "loss": {
        "text": "山上的喊聲先亂，隨後纔是刀兵。諸葛亮要斬的似乎不只是馬謖，還有那個明知他愛逞才、卻仍把街亭交給他的自己。",
        "clue": "史鑑 · 張郃會假攻糧道、實困水源；重開時其起手士氣 -1，先守住底池再圖反擊。",
        "clueFx": "sow"
      },
      "intros": {
        "zhanghe": [
          {
            "bio": "他已在街亭等到過一次山上的破綻，這一次連水道會從哪裏斷都知道。",
            "quote": "山與水，你還會把哪一個留給敵人？",
            "when": "page:jieting:history"
          },
          {
            "bio": "張郃不與你爭一處漂亮陣地，只逼你承認地形之外還有時日與渴。",
            "quote": "兵無常勢。你卻把山當成了常勢。"
          }
        ]
      }
    }
  },
  "4": {
    "kongcheng": {
      "cast": [
        "zhuge",
        "simayi"
      ],
      "objective": "把無兵可守變成司馬懿不敢承受的代價，讓琴聲、城門與他的多疑各守一道防線。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "西城的門軸上了油，連一聲吱呀也不肯出。城中老弱灑掃，城上只擺一張琴。"
        },
        {
          "speaker": "simayi",
          "text": "博望的火、赤壁的風，我都覆盤過。孔明，你今日又替我備了什麼？"
        },
        {
          "speaker": "zhuge",
          "text": "街亭未失，他卻仍咬住西城。看來他不是來捉馬謖，是來逼我親手承認無兵。",
          "when": "page:jieting:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "街亭的敗報在袖中，城中的老弱在門下。仲達要看我的破綻，便給他一個最像真的。",
          "when": "!page:jieting:yeshi"
        }
      ],
      "map": [
        {
          "id": "tune-for-sima",
          "title": "城樓 · 琴要彈給誰聽",
          "node": 1,
          "lines": [
            {
              "speaker": "zhuge",
              "text": "他若進城，我輸；他若因不敢輸而退，我們便贏。把城門再擦淨些，別留半分欲蓋彌彰。"
            },
            {
              "speaker": "you",
              "text": "若他這次寧可犯錯，也要進來看一看呢？"
            },
            {
              "speaker": "zhuge",
              "text": "所以琴不能只求鎮定，要讓他聽見：我已經把他不肯認錯的後路，也算進伏兵裏。"
            }
          ],
          "choices": [
            {
              "id": "slow-qin",
              "text": "把最後一遍琴彈得更慢",
              "detail": "司馬懿起手士氣 -1，記住慢琴",
              "effects": {
                "sow": 1,
                "fact": "kongcheng_slow_qin"
              }
            },
            {
              "id": "dust-reinforce",
              "text": "令斜谷塵土佯作援軍",
              "detail": "司馬懿軍資 -200，記住疑兵塵影",
              "effects": {
                "raid": true,
                "fact": "kongcheng_dust"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "kongcheng-open",
          "speaker": "simayi",
          "text": "城中無人，你便是虛；城中有伏，你便是險。我只需決定，哪一種錯更便宜。",
          "at": "start"
        },
        {
          "id": "kongcheng-zhuge",
          "speaker": "zhuge",
          "text": "別看他的手，看他每加註一次便多怕一分的後果。空城賣的是他的顧忌。",
          "at": "hand:2"
        },
        {
          "id": "kongcheng-you",
          "speaker": "you",
          "text": "他怕的不是伏兵，是一旦攻錯，天下都會說他輸給了空城。",
          "at": "hand:3"
        },
        {
          "id": "kongcheng-low",
          "speaker": "simayi",
          "text": "琴絃若斷，我進；琴絃不斷，我便還要想。孔明，你連斷絃也捨得拿來騙我。",
          "at": "low"
        }
      ],
      "win": {
        "text": "琴音落到城下，司馬懿終於勒馬。他在三十里外回望空門：“我不是輸給伏兵，是輸給了不敢輸。”諸葛亮掌心全是汗，卻只讓書童再添一爐香。",
        "hook": "空城各輸一口氣，五丈原再算總賬。這一次，司馬懿決定連琴也不聽。"
      },
      "loss": {
        "text": "魏軍踏過城門時，琴聲還維持着最後一個音。司馬懿沒有笑，只說：“你賭我怕錯，我這次偏要付一次錯的代價。”",
        "clue": "史鑑 · 司馬懿會衡量詐唬的代價，而非只看氣勢；重開時假破綻減少，別重複同一條下注線。",
        "clueFx": "keenEye"
      },
      "intros": {
        "simayi": [
          {
            "bio": "他曾在西城退過一次，此後每一聲琴都像在提醒那次不敢輸。",
            "quote": "同一座城，我不會再替你退第二次。",
            "when": "page:kongcheng:yeshi"
          },
          {
            "bio": "街亭沒有替他耗空蜀軍，他便親自來讀諸葛亮最險的一筆。",
            "quote": "馬謖沒敗，你便以爲我也看不穿西城？",
            "when": "page:jieting:yeshi"
          },
          {
            "bio": "他記得你的下注，也記得自己曾因算得太深而放走一座城。",
            "quote": "這次我會少算一層，還是多算一層？",
            "when": "seen:simayi"
          },
          {
            "bio": "冢虎第一次坐到臥龍對面，最利的武器不是兵，而是肯多想一層。",
            "quote": "城中若無人，你爲何敢請我進？"
          }
        ]
      }
    },
    "chencang": {
      "cast": [
        "zhuge",
        "haozhao",
        "weiyan",
        "jiangwei",
        "guanxing"
      ],
      "objective": "在雲梯與火箭之間,找到郝昭守城的理由,再決定陳倉該不該破。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "陳倉城小而堅,守將郝昭,不過千人。蜀軍雲梯、衝車、地道輪番上陣,城頭的火箭一一點名。"
        },
        {
          "speaker": "haozhao",
          "text": "諸葛丞相的攻具,昭領教二十日了。城小,好在要守的也少。"
        },
        {
          "speaker": "zhuge",
          "text": "郝伯道守城有法,強攻徒損將士。伯約,你說,困城先困什麼?"
        },
        {
          "speaker": "jiangwei",
          "text": "維以爲,困城先困心。郝昭同鄉靳詳在軍中,可先勸降,探他守志。"
        },
        {
          "speaker": "weiyan",
          "text": "二十日了!再勸下去,長安的援軍就到了。丞相,給文長三日益,必破此城!"
        }
      ],
      "map": [
        {
          "id": "siege-letters",
          "title": "散關 · 雲梯與書信",
          "node": 1,
          "lines": [
            {
              "speaker": "haozhao",
              "text": "昭知丞相必得陳倉而後去。只可惜,陛下給的城,昭一寸也不讓。"
            },
            {
              "speaker": "zhuge",
              "text": "他不肯降,是信魏,還是信他身後無人肯守?攻具要繼續,信,也要繼續。"
            },
            {
              "speaker": "guanxing",
              "text": "丞相,興押糧時數過:城中炊煙,一日淡過一日。"
            },
            {
              "speaker": "you",
              "text": "那就比誰先到——他的糧盡,還是長安的援軍。"
            }
          ],
          "choices": [
            {
              "id": "count-smoke",
              "text": "以炊煙計城中存糧",
              "detail": "本回看破提升,記住炊煙之數",
              "effects": {
                "keenEye": true,
                "fact": "chencang_smoke"
              }
            },
            {
              "id": "cut-relief",
              "text": "伏兵散關,截長安援軍",
              "detail": "魏軍起手軍資 -200,記住斷援",
              "effects": {
                "raid": true,
                "fact": "chencang_cut"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "chencang-open",
          "speaker": "haozhao",
          "text": "又是雲梯。昭說過了——換法子吧,丞相。",
          "at": "start"
        },
        {
          "id": "chencang-fire",
          "speaker": "narrator",
          "text": "火箭如雨,雲梯成排地燒。城頭那個瘦削的身影,二十日來沒有離開過一步。",
          "at": "hand:2"
        },
        {
          "id": "chencang-shuang",
          "speaker": "wangshuang",
          "text": "郝昭撐住!王雙的援軍到了——呔!追兵也敢跟這麼緊?!",
          "at": "hand:3"
        },
        {
          "id": "chencang-low",
          "speaker": "zhuge",
          "text": "罷。傳令:斂兵,回漢中。陳倉雖在,郝伯道之名,亮記下了。",
          "at": "low"
        }
      ],
      "win": {
        "text": "退軍的路上,王雙追來,卻一頭撞進你布在散關的伏兵。斬王雙,退大軍,陳倉的城頭,郝昭扶着垛口望了許久。他守住了城,諸葛亮贏得了整個隴右的從容——這一仗,兩人都沒有輸。",
        "hook": "陳倉雖退,北伐的心沒有退。渭水上游,一場更大的對峙正在蓄水——這一次,對手是司馬。"
      },
      "loss": {
        "text": "攻城的第二十日,雲梯燒盡了,長安的援軍也到了。你在陳倉城下學會了同一件事:有些城,強攻不動;有些將,勸降不動。",
        "clue": "史鑑 · 郝昭以「守」待「攻」,你的每一步攻具都在替他點名。重開時先斷援軍、再數炊煙,等他的糧替你說話。",
        "clueFx": "keenEye"
      },
      "intros": {
        "haozhao": [
          {
            "bio": "他記得你的每一種攻具,城頭又添了三排火箭。",
            "quote": "雲梯?衝車?還是地道?我都備好了。",
            "when": "seen:haozhao"
          },
          {
            "bio": "千人守孤城,守的從來不是城,是一個「信」字。",
            "quote": "昭受魏恩,城在人在。請丞相換法子吧。"
          }
        ],
        "wangshuang": [
          {
            "bio": "他的流星錘記過你的將,也記過自己的輕進。",
            "quote": "這次跟緊大隊!錘下不留情!",
            "when": "seen:wangshuang"
          },
          {
            "bio": "隴西大漢,先登的獎賞他背了一路。",
            "quote": "王雙在此!誰的頭,配我的錘?"
          }
        ]
      }
    },
    "shangfanggu": {
      "cast": [
        "zhuge",
        "simayi",
        "simazhao",
        "weiyan",
        "yangyi"
      ],
      "objective": "把司馬懿父子誘入葫蘆谷,在雨落下之前,讓火替蜀軍說最後一句話。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "渭水南岸,蜀軍屯田,魏軍築壘。上方谷口堆滿乾柴,只等司馬懿自己走進來。"
        },
        {
          "speaker": "simayi",
          "text": "孔明屯田,是邀孤決戰;孤偏不戰。他若退,孤追——只追到谷口爲止。"
        },
        {
          "speaker": "simazhao",
          "text": "父親,蜀軍糧車連日向北原移動,孩兒願領一軍,探他虛實。"
        },
        {
          "speaker": "zhuge",
          "text": "司馬懿不是不肯來,是不肯一個人來。那就給他的兒子,一個非來不可的理由。"
        },
        {
          "speaker": "yangyi",
          "text": "丞相,木牛流馬三十車已備,每車都做了記號——威公保證,一車都不會真丟。"
        }
      ],
      "map": [
        {
          "id": "granary-carts",
          "title": "北原 · 糧車之餌",
          "node": 1,
          "lines": [
            {
              "speaker": "weiyan",
              "text": "丞相,誘敵的差事,該文長去了!司馬懿若肯入谷,文長願領五百人,替他關谷門!"
            },
            {
              "speaker": "zhuge",
              "text": "文長守谷門,孤放心。只是記住——火起之後,門要關得快,開得更快。"
            },
            {
              "speaker": "yangyi",
              "text": "糧車、乾柴、火油,賬目在此。丞相,威公只提醒一句:天,三月無雨了。"
            },
            {
              "speaker": "you",
              "text": "無雨的天,是火的朋友,也是雨的前奏。這一局,要贏得比天氣快。"
            }
          ],
          "choices": [
            {
              "id": "watch-sky",
              "text": "先觀雲腳,擇乾燥日縱火",
              "detail": "本回看破提升,記住天時之擇",
              "effects": {
                "keenEye": true,
                "fact": "shangfanggu_sky"
              }
            },
            {
              "id": "burn-carts",
              "text": "棄三十車糧,佯敗入谷",
              "detail": "魏軍起手軍資 -200,記住棄糧之餌",
              "effects": {
                "raid": true,
                "fact": "shangfanggu_carts"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "shangfanggu-open",
          "speaker": "simayi",
          "text": "糧車北移,營壘東傾。孔明,你的每一步,都在請孤入谷。",
          "at": "start"
        },
        {
          "id": "shangfanggu-zhao",
          "speaker": "simazhao",
          "text": "父親!糧車亂了,蜀軍真的敗了——追不追,就在此刻!",
          "at": "hand:2",
          "when": "multi"
        },
        {
          "id": "shangfanggu-fire",
          "speaker": "weiyan",
          "text": "谷門——落!火箭,上!今日便叫魏軍知道,什麼叫進得來,出不去!",
          "at": "hand:3"
        },
        {
          "id": "shangfanggu-low",
          "speaker": "simayi",
          "text": "中計了……我父子三人,竟要畢命於此谷?罷了,罷了!",
          "at": "low"
        }
      ],
      "win": {
        "text": "火起時,谷口的牌局已經收官。司馬懿仰頭看天,烏雲正從山後壓過來——可這次,雨落在火燒完之後。他從灰燼裏被扶出來,半晌只說了一句:「天意猶在,人事先盡。」渭南的魏軍,從此再不出壘。",
        "hook": "上方谷的火沒能燒盡司馬氏,卻燒掉了他們的傲氣。渭濱的秋風,就要替這場對峙收尾。"
      },
      "loss": {
        "text": "雨比你的火快了半刻。谷中父子在雨裏放聲大笑,笑聲比火更燙。你終於明白:算盡了人事的人,輸給天時,最痛。",
        "clue": "史鑑 · 司馬懿入谷前會反覆試探。重開時先觀雲再縱火,棄糧之餌能減其軍資 200——別讓天氣先亮牌。",
        "clueFx": "raid"
      },
      "intros": {
        "simayi": [
          {
            "bio": "西城的琴聲之後,他更信「孔明之退皆有伏」,這份疑心,正是你要的鎖。",
            "quote": "琴我聽過一次。這次,我只信我的眼睛。",
            "when": "page:kongcheng:yeshi"
          },
          {
            "bio": "他仍舊閉目養神,可耳聽八方——你在谷口做的每一處記號,他都想知道。",
            "quote": "把你的糧車再往前挪一里。孤,看着。",
            "when": "seen:simayi"
          },
          {
            "bio": "冢虎不出洞,除非洞外的人,替他把洞口的石頭搬開。",
            "quote": "孔明啊孔明,你的耐心,終究要輸給歲數。"
          }
        ],
        "simazhao": [
          {
            "bio": "他領教過你的伏筆,這次把父親的謹慎折了一半,添進自己的果決。",
            "quote": "父親的謹慎我學一半。另一半,我改。",
            "when": "seen:simazhao"
          },
          {
            "bio": "隨軍的次子,眼睛卻總盯着帥帳裏那把還沒坐熱的椅子。",
            "quote": "小將軍司馬昭,代父巡谷。"
          }
        ]
      }
    },
    "wuzhangyuan": {
      "cast": [
        "zhuge",
        "simayi",
        "jiangwei"
      ],
      "objective": "在糧盡與秋風之前逼司馬懿作答，並把諸葛亮從既定的星落裏帶回人間。",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "博望借火，赤壁借風，我一生都在借天時。此次不借了。你替我爭一日，我便把這一日活完。"
        },
        {
          "speaker": "simayi",
          "text": "西城我退得太快，這次我連你的琴也不聽。你糧盡之日，便是我出兵之時。",
          "when": "page:kongcheng:yeshi"
        },
        {
          "speaker": "simayi",
          "text": "我不問你有何伏兵，也不問你有何妙計。五丈原只比一件事：誰先耗盡。",
          "when": "!page:kongcheng:yeshi"
        },
        {
          "speaker": "jiangwei",
          "text": "丞相，藥又涼了。您總說看完這道軍報，可軍報永遠沒有最後一道。"
        }
      ],
      "map": [
        {
          "id": "one-more-day",
          "title": "武功水 · 向人間借一日",
          "node": 1,
          "lines": [
            {
              "speaker": "jiangwei",
              "text": "他不接戰，軍中便都勸丞相再催。可愈催，愈像替他證明秋風真的站在魏營。"
            },
            {
              "speaker": "zhuge",
              "text": "伯約，屯田不是認輸。讓兵士知道明年有糧，讓百姓知道今年不擾，我纔不必向夜空多借那幾年。"
            }
          ],
          "choices": [
            {
              "id": "tuntian",
              "text": "與民屯田，讓糧道自己生長",
              "detail": "軍資 +200，記住渭濱屯田",
              "effects": {
                "chips": 200,
                "fact": "wuzhang_tuntian"
              }
            },
            {
              "id": "raid-grain",
              "text": "斜谷出奇兵，反斷魏軍糧路",
              "detail": "司馬懿軍資 -200，記住反客爲主",
              "effects": {
                "raid": true,
                "fact": "wuzhang_counterraid"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "wuzhang-open",
          "speaker": "simayi",
          "text": "你送女裝來，我便穿給諸將看。能讓丈夫羞怒的，從來不叫勝負。",
          "at": "start"
        },
        {
          "id": "wuzhang-zhuge",
          "speaker": "zhuge",
          "text": "他不是無膽，是把我的命也算作盲注。別陪他等，要讓他每不應一次都付出軍資。",
          "at": "hand:2"
        },
        {
          "id": "wuzhang-jiangwei",
          "speaker": "jiangwei",
          "text": "丞相，東南星還未暗。您先喝藥，這一手我陪您看。",
          "at": "hand:7"
        },
        {
          "id": "wuzhang-tuntian-low",
          "speaker": "zhuge",
          "text": "仲達，新糧已經入倉。你等的那陣秋風，今年怕要遲到了。",
          "at": "low",
          "when": "fact:wuzhang_tuntian"
        },
        {
          "id": "wuzhang-sima-low",
          "speaker": "simayi",
          "text": "你要星星再亮十年，我只等它暗一刻。看誰先撐不住。",
          "at": "low",
          "when": "!fact:wuzhang_tuntian"
        }
      ],
      "win": {
        "text": "五丈原的燈沒有滅。司馬懿終於出戰，又在武功水畔折損先手；諸葛亮趁隙讓大軍與糧道一同向前。天亮時，他推開藥碗，寫下另一篇出師表——不是借來十年，而是不再把每一天交給命數。",
        "hook": "十四年很快。洛陽有人開始裝病；這一次，臥龍尚在，舊局未清。"
      },
      "loss": {
        "text": "東南星暗下去時，司馬懿仍沒有出戰。他不是贏了某一手，只是讓你把所有“明日再做”都拖成了秋風裏的盲注。",
        "clue": "史鑑 · 堅壁把盲注拖成刀；重開時軍資 +150，先手爭糧，莫與他比誰更能空耗。",
        "clueFx": "supply"
      },
      "intros": {
        "simayi": [
          {
            "bio": "這一次你親手執起羽扇，冢虎終於不必隔着蜀營猜測臥龍的神色。",
            "quote": "孔明，你終於肯親自坐在我對面。",
            "when": "asZhuge"
          },
          {
            "bio": "東南星明以後，他知道命數也會被贏走，卻仍相信自己最懂消耗。",
            "quote": "多活的歲月，也是歲月。我仍耗得起。",
            "when": "page:wuzhangyuan:yeshi"
          },
          {
            "bio": "空城的退兵成了他的舊傷；如今他用堅壁把舊傷磨成耐心。",
            "quote": "上次我算你的城，這次我只算你的糧。",
            "when": "page:kongcheng:yeshi"
          },
          {
            "bio": "他把不戰當作最長久的一注，等秋風替自己清掉對面的籌碼。",
            "quote": "你可以贏每一陣，我只要等到最後一夜。"
          }
        ]
      }
    },
    "gaopingling": {
      "cast": [
        "simayi",
        "caoshuang",
        "simashi",
        "zhuge"
      ],
      "objective": "拆穿一罈專給曹爽看的病，在司馬懿睜眼之前守住詔書、武庫與曹魏最後的選擇。",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "五丈原後，我與他又通了許多年的信。今日只寄來四字：勿信其病。他不是等死，是等你先把他當死人。",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "speaker": "writer",
          "text": "五丈原的星已經落過。如今沒人替你看冢虎，只剩一碗故意灑在手背上的粥。",
          "when": "!page:wuzhangyuan:yeshi"
        },
        {
          "speaker": "caoshuang",
          "text": "他連粥都喂不進，還能奪我的兵權？我去看過三次，三次都是如此。"
        },
        {
          "speaker": "simashi",
          "text": "父親病成這樣,師兒只能先持家中饋。將軍若疑,何不親自再探一次?",
          "when": "!seen:simashi"
        },
        {
          "speaker": "simayi",
          "text": "大將軍……老朽只有一事，不放心。來日……還請你多照看我的兩個兒子。"
        }
      ],
      "map": [
        {
          "id": "medicine-and-armory",
          "title": "高平陵 · 病榻外有刀",
          "node": 1,
          "lines": [
            {
              "speaker": "caoshuang",
              "text": "他若裝病，騙的是我；他若真病，我此時動手，便坐實了欺辱老臣。你要我怎麼辦？"
            },
            {
              "speaker": "zhuge",
              "text": "五丈原後我只教他一件事：耐心也是下注。你若不看底牌，便會把他的忍耐當成天命。",
              "when": "page:wuzhangyuan:yeshi"
            },
            {
              "speaker": "writer",
              "text": "沒有臥龍隔江提醒，你只能自己分辨：那碗粥餵給了病人，還是餵給了你的輕視。",
              "when": "!page:wuzhangyuan:yeshi"
            }
          ],
          "choices": [
            {
              "id": "read-prescription",
              "text": "對照藥方、更次與喂粥的人",
              "detail": "本回看破提升，記住病榻僞證",
              "effects": {
                "keenEye": true,
                "fact": "gaoping_medicine"
              }
            },
            {
              "id": "guard-armory",
              "text": "先護太后詔書與洛陽武庫",
              "detail": "司馬懿軍資 -150，記住先手守門",
              "effects": {
                "oppChips": -150,
                "fact": "gaoping_armory"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "gaoping-open-alive",
          "speaker": "simayi",
          "text": "孔明還活着，你也還愛多事。看來五丈原那一局，我確實輸得不甘心。",
          "at": "start",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-open-fallen",
          "speaker": "simayi",
          "text": "孔明已不在。你們還有誰，肯把一個將死之人當作對手？",
          "at": "start",
          "when": "!page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-caoshuang",
          "speaker": "caoshuang",
          "text": "他是在裝？可滿朝都看見了……你爲何不早說！",
          "at": "hand:2"
        },
        {
          "id": "gaoping-letter",
          "speaker": "zhuge",
          "text": "你若只會等他死，便永遠看不見他怎樣活。",
          "at": "hand:3",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-low",
          "speaker": "simayi",
          "text": "你識破我的病，卻識不破百官的怕。刀出鞘以後，他們自會站到我這邊。",
          "at": "low"
        }
      ],
      "win": {
        "text": "粥碗落地，司馬懿翻身而起，卻見武庫門已閉、太后詔已讀。曹爽沒有交出印綬，滿朝也沒有等來一場只能站隊的清洗。冢虎第一次發現，滿座聰明人並不都願意陪他裝睡。",
        "hook": "司馬家的刀暫回鞘中，三國卻未停手。多年後，陰平小道響起裹氈滾崖之聲。"
      },
      "loss": {
        "text": "曹爽交印時還相信能做個富家翁。司馬懿沒有立刻殺他，只讓他慢慢想明白：那壇病不是騙一個人的眼睛，是喂大一羣人的僥倖。",
        "clue": "史鑑 · 他的虛弱多是誘餌，真正的強注藏在病後；重開時假破綻減少，別因攤牌前的示弱鬆手。",
        "clueFx": "keenEye"
      },
      "intros": {
        "simayi": [
          {
            "bio": "高平陵敗過一次後，他不再只裝病，連你的疑心也可能被他拿來佈局。",
            "quote": "同一帖藥，我不會再煎第二遍。",
            "when": "page:gaopingling:yeshi"
          },
          {
            "bio": "五丈原沒能熬走臥龍，他便把耐心帶回洛陽，等另一個輕敵的人。",
            "quote": "孔明尚在，正好。我要讓他看看，熬得住不只是命。",
            "when": "page:wuzhangyuan:yeshi"
          },
          {
            "bio": "他熬走過太多對手，如今把衰老演成最後一層甲，把曹爽的輕視養成刀。",
            "quote": "老朽病得很重。大將軍，你當然可以放心。"
          }
        ]
      }
    },
    "tielongshan": {
      "cast": [
        "jiangwei",
        "simazhao",
        "guohuai",
        "xiahouba",
        "zhangyi"
      ],
      "objective": "圍住鐵籠山的人,先要算贏解圍的人——替姜維保住隴右這一手棋。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "姜維背水列陣,大破魏軍於洮水,把司馬昭圍在了鐵籠山上。山上無水,山下的人卻帶來了羌兵的火。"
        },
        {
          "speaker": "jiangwei",
          "text": "司馬昭困守無水之山,三日內必降。維只擔心一件事——郭淮的援軍,會借羌人的路。"
        },
        {
          "speaker": "simazhao",
          "text": "山上掘三丈不得泉……父親常說,困局先算援手。郭伯濟,你會來嗎?"
        },
        {
          "speaker": "guohuai",
          "text": "羌人反覆,魏蜀皆用。老夫此去,不必破姜維,只要讓羌人的火,燒回他自己的營。",
          "when": "!seen:guohuai"
        },
        {
          "speaker": "xiahouba",
          "text": "伯約!夏侯霸降蜀三年,今日方知:隴右的每一寸,都是舊相識。"
        }
      ],
      "map": [
        {
          "id": "qiang-road",
          "title": "洮水 · 羌人的路",
          "node": 1,
          "lines": [
            {
              "speaker": "xiahouba",
              "text": "伯約,羌人與魏人眉來眼去三日了。雍州的事,仲權看了半輩子——他們只認糧,不認旗。"
            },
            {
              "speaker": "jiangwei",
              "text": "維背水一戰,已無退路。若羌人倒向郭淮,山上山下,就要換一個圍法。"
            },
            {
              "speaker": "zhangyi",
              "text": "將軍,張翼願領一軍扼住羌道。翼位卑,可這一步棋,差不得。"
            },
            {
              "speaker": "you",
              "text": "圍山的人最怕兩件事:山上的水,和山外的路。水他沒找到,路,還在你手裏。"
            }
          ],
          "choices": [
            {
              "id": "hold-qiang",
              "text": "先穩羌部,斷郭淮之援",
              "detail": "本回看破提升,記住羌道之要",
              "effects": {
                "keenEye": true,
                "fact": "tielongshan_qiang"
              }
            },
            {
              "id": "rush-hill",
              "text": "趁無水速攻,先取山寨",
              "detail": "軍資 +150,山上守軍士氣 -1",
              "effects": {
                "chips": 150,
                "sow": 1,
                "fact": "tielongshan_rush"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "tielongshan-open",
          "speaker": "simazhao",
          "text": "姜維,你圍得住山,圍不住天。三日後,自有你的敗報。",
          "at": "start"
        },
        {
          "id": "tielongshan-guo",
          "speaker": "guohuai",
          "text": "羌帳已應老夫。姜將軍,你的背後,還站得住人嗎?",
          "at": "hand:2"
        },
        {
          "id": "tielongshan-wing",
          "speaker": "zhangyi",
          "text": "羌道還在我手裏!將軍只管攻山——張翼的陣地,羌人過不來!",
          "at": "hand:3",
          "when": "fact:tielongshan_qiang"
        },
        {
          "id": "tielongshan-low",
          "speaker": "jiangwei",
          "text": "丞相,維又差一步……不,還差的那一步,維自己走!",
          "at": "low"
        }
      ],
      "win": {
        "text": "羌道未失,郭淮的「借」字落了空。鐵籠山上,司馬昭捧着最後一皮囊水解了渴,然後望着山下紋絲不動的蜀軍營壘,第一次主動議和退兵。姜維沒有追——洮水大勝,隴右的城一座座開了門,北伐的路,又寬了一程。",
        "hook": "隴右烽煙未熄,淮南的檄文已至洛陽——魏國的土地上,連着三年,燃起了三把同名的火。"
      },
      "loss": {
        "text": "羌人的火從你背後燒起,鐵籠山上的司馬昭在雨裏大笑。姜維引兵退回劍閣時,回頭看了一眼那座山——圍局如牌局,他終於信了這句話。",
        "clue": "史鑑 · 郭淮贏在「借外勢」,不在兵鋒。重開時先定羌部再攻山;你的圍,輸給的一定是山外的路。",
        "clueFx": "keenEye"
      },
      "intros": {
        "guohuai": [
          {
            "bio": "定軍山的老對手還記得你的山,這次把援軍藏進了羌帳。",
            "quote": "上次你佔了高地。這次,我借了風。",
            "when": "seen:guohuai"
          },
          {
            "bio": "關西三十年,他最懂「借」字——借羌,借水,借你圍城的耐心。",
            "quote": "郭淮不與你鬥圍。我只拆你的圍。"
          }
        ],
        "simazhao": [
          {
            "bio": "上方谷的雨救過他一次,他從此信「困局自有天意」。",
            "quote": "又困我?上次的雨,這次也會來。",
            "when": "page:shangfanggu:yeshi"
          },
          {
            "bio": "他嘗過被圍的滋味,這次在山上鎮定得反常。",
            "quote": "困我三日?我等得起。你呢?",
            "when": "seen:simazhao"
          },
          {
            "bio": "被圍的次子不慌,因爲他的鎮定本身就是疑兵。",
            "quote": "姜將軍,山高風大,你的糧,吹得散。"
          }
        ]
      }
    },
    "huainan": {
      "cast": [
        "simashi",
        "simazhao",
        "guanqiujian",
        "wenqin",
        "zhugedan",
        "wenyang"
      ],
      "objective": "在淮南三叛的連局裏,讀出忠義與僥倖的分界,替檄文找到它該送達的人。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "司馬懿死後第二年,淮南第一道討賊檄文豎起。此後四年,同樣的火在這片土地上燒了三次。"
        },
        {
          "speaker": "guanqiujian",
          "text": "司馬師廢帝自立,天地不容!淮南六軍,今日只問一句:魏,還是司馬?"
        },
        {
          "speaker": "simashi",
          "text": "淮南又反。父親留下的局面,師來收。眼疾再痛,也得親征。"
        },
        {
          "speaker": "wenqin",
          "text": "毌丘將軍,文欽父子三千騎,願爲先鋒!衝中軍,擒司馬師!"
        },
        {
          "speaker": "wenyang",
          "text": "爹,夜裏劫營,兒的槍先出。樂嘉城的魏旗,一夜就換!"
        }
      ],
      "map": [
        {
          "id": "three-fires",
          "title": "項城 · 同名的火",
          "node": 1,
          "lines": [
            {
              "speaker": "simazhao",
              "text": "兄長眼裏有瘤,仍要親征淮南。我留在洛陽——不是怯,是要看着朝堂上每一雙眼睛。"
            },
            {
              "speaker": "guanqiujian",
              "text": "第一叛敗於糧,第二叛敗於疑,第三叛……老夫等不到了。後來的人,替我把檄文寫完。"
            },
            {
              "speaker": "wenyang",
              "text": "壽春城破那日,兒單騎七進七出。爹叫我走,我就走——留這條命,接着反!"
            },
            {
              "speaker": "you",
              "text": "三把火,燒的是同一句話。你要讀的是:哪一縷煙,是忠;哪一縷,只是不甘。"
            }
          ],
          "choices": [
            {
              "id": "read-manifesto",
              "text": "細讀檄文署名與糧冊",
              "detail": "本回看破提升,記住檄文之別",
              "effects": {
                "keenEye": true,
                "fact": "huainan_read"
              }
            },
            {
              "id": "aid-shouchun",
              "text": "護檄文東傳,連結東吳",
              "detail": "軍資 +150,記住外援之約",
              "effects": {
                "chips": 150,
                "fact": "huainan_wu"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "huainan-open",
          "speaker": "guanqiujian",
          "text": "魏的將,司馬的兵——諸位,你們的刀,究竟聽誰的?!",
          "at": "start"
        },
        {
          "id": "huainan-yang",
          "speaker": "wenyang",
          "text": "追兵百騎?文鴦回頭——一槍一個,排好隊!",
          "at": "hand:2",
          "when": "round:2"
        },
        {
          "id": "huainan-dan",
          "speaker": "zhugedan",
          "text": "壽春的糧,夠守一年。你們司馬家的刀,先鈍!先冷!",
          "at": "hand:3",
          "when": "round:2"
        },
        {
          "id": "huainan-low",
          "speaker": "simazhao",
          "text": "殺他們的,不是我。是「等」字——等援軍,等天命,等別人先拼命。",
          "at": "low"
        }
      ],
      "win": {
        "text": "檄文送到了洛陽,也送進了史官的夢裏。三把火沒有燒倒司馬氏,卻把「魏」字的筆畫一根根燙深:連他們的兵都開始記住,自己曾經姓曹。司馬師摘掉眼上的紗布,發現痛的不只是眼疾。",
        "hook": "淮南的火三次燃盡,洛陽的天子坐不住了——他要親手,把龍旗打出宮門。"
      },
      "loss": {
        "text": "三叛相繼敗亡,壽春城頭三次換旗。你記住了每一份檄文的抬頭,卻沒算到:東吳的援兵,每次都晚到一步,而司馬氏的刀,一次比一次快。",
        "clue": "史鑑 · 淮南之敗不在寡助,在「各等各的」。重開時先讀檄文分清主從;文鴦之勇是最後的門,別把他當成整座城。",
        "clueFx": "keenEye"
      },
      "intros": {
        "guanqiujian": [
          {
            "bio": "遼東刻石的老將仍在等,等第二封沒人敢回的檄文。",
            "quote": "石頭再硬,也要刻第二遍。",
            "when": "seen:guanqiujian"
          },
          {
            "bio": "他刻過遼東的功勳,如今要刻司馬氏的罪。",
            "quote": "此檄一出,成敗在天,名義在我。"
          }
        ],
        "wenqin": [
          {
            "bio": "勇而無謀的譙郡男兒,嗓門與膽氣一樣大。",
            "quote": "怕死的不姓文!衝!"
          }
        ],
        "zhugedan": [
          {
            "bio": "壽春的火他見過一次,這次把城牆又加高了三尺。",
            "quote": "再守一次。反正天下人只記得我反了。",
            "when": "seen:zhugedan"
          },
          {
            "bio": "諸葛家的「狗」,咬得最兇,也最孤獨。",
            "quote": "寧作斷頭鬼,不姓司馬!"
          }
        ],
        "wenyang": [
          {
            "bio": "十八歲的槍,追兵的夢。",
            "quote": "誰敢追?文鴦在此!"
          }
        ],
        "leshen": [
          {
            "bio": "他守着父親留下的淮南,守着樂進家的門楣。",
            "quote": "家父的陣,我一步沒改。"
          }
        ]
      }
    },
    "ganlu": {
      "cast": [
        "caomao",
        "simazhao",
        "jiachong",
        "wangshen"
      ],
      "objective": "在南闕之前替天子留住最後一步退路——或者,一場問心無愧的死戰。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "甘露五年,洛陽。二十歲的天子在陵雲臺寫了最後一首詩,題目叫《潛龍》。詩成,他把筆一折。"
        },
        {
          "speaker": "caomao",
          "text": "司馬昭之心,路人皆知!朕不能坐受廢辱——今日,卿等隨朕,親討此賊!"
        },
        {
          "speaker": "jiachong",
          "text": "殿下勿慌。天子親自持劍,不過是個孩子的把戲。養兵千日——用在此刻。",
          "when": "!seen:jiachong"
        },
        {
          "speaker": "wangshen",
          "text": "陛下……沈,沈萬死。可這件事,沈只能,只能先走一步了。"
        },
        {
          "speaker": "caomao",
          "text": "朕意已決。縱使今日血濺宮牆,史筆之上,「魏」字仍在!"
        }
      ],
      "map": [
        {
          "id": "dragon-poem",
          "title": "太極殿 · 潛龍之詩",
          "node": 1,
          "lines": [
            {
              "speaker": "caomao",
              "text": "「傷哉龍受困,不能越深淵。」……寫得再好,也不過是替自己哭喪。"
            },
            {
              "speaker": "you",
              "text": "陛下,詩可以留,路不能只剩一條。宮牆之外,還有人肯聽天子的嗎?"
            },
            {
              "speaker": "caomao",
              "text": "有沒有,朕都要走這一遭。史官,帶上你的筆——今日每一筆,都直書!"
            },
            {
              "speaker": "jiachong",
              "text": "南闕的甲士,只聽成濟的。而成濟——只聽我的。"
            }
          ],
          "choices": [
            {
              "id": "rally-old-guard",
              "text": "先聚三千宿衛舊臣",
              "detail": "軍資 +150,記住舊臣之心",
              "effects": {
                "chips": 150,
                "fact": "ganlu_rally"
              }
            },
            {
              "id": "read-halberd",
              "text": "盯住成濟握戟的手",
              "detail": "本回看破提升,記住那杆戟",
              "effects": {
                "keenEye": true,
                "fact": "ganlu_halberd"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "ganlu-open",
          "speaker": "caomao",
          "text": "朕乃天子!誰敢弒君——誰敢?!",
          "at": "start"
        },
        {
          "id": "ganlu-chee",
          "speaker": "jiachong",
          "text": "司馬公養你們,不就是爲了今日嗎?!動手——",
          "at": "hand:2",
          "when": "multi"
        },
        {
          "id": "ganlu-halberd",
          "speaker": "narrator",
          "text": "成濟的戟抬起來了。滿街的甲士都在看着——看天子,也看這杆戟,究竟聽誰的。",
          "at": "hand:3",
          "when": "fact:ganlu_halberd"
        },
        {
          "id": "ganlu-low",
          "speaker": "caomao",
          "text": "戟若落,史筆在;朕若死,「魏」字在。來啊——朕在此!",
          "at": "low"
        }
      ],
      "win": {
        "text": "南闕之下,成濟的戟最終沒有落下——你當街喚出了他父親的名字,喊破了那道只認「主公」的軍令。甲士譁然退散,賈充的袖子第一次空了。天子持劍立於宮門,史官蘸墨:「甘露五年,帝親討賊,賊黨潰。」魏,還剩一口氣;這口氣,姓曹。",
        "hook": "天子的血沒有流,司馬氏的耐心卻到了頭。魏蜀吳三家最後的名字,都將寫進同一部史書。"
      },
      "loss": {
        "text": "戟落了。天子的血濺在南闕的磚上,三日不褪。司馬昭聞訊「大驚」,誅了成濟三族——把刀和罪,一起收回了鞘。",
        "clue": "史鑑 · 賈充贏在「先斷你的耳目」。重開時盯住那杆戟、聚攏舊臣;勝負之外,這一頁賭的是史筆的下一行。",
        "clueFx": "keenEye"
      },
      "intros": {
        "jiachong": [
          {
            "bio": "他記得上次那杆停在半空的戟,這次連「停」的口令都不下了。",
            "quote": "這次,不留手。變數,先除。",
            "when": "seen:jiachong"
          },
          {
            "bio": "他從不親手拿刀,只負責把刀遞到最合適的手裏。",
            "quote": "賈充在此。陛下,別讓下人爲難。"
          }
        ],
        "simazhao": [
          {
            "bio": "鐵籠山的困局讓他學會了謙卑的外殼,如今殼更厚,刀更近。",
            "quote": "困過我的人,都得死。天子,也不例外?",
            "when": "page:tielongshan:yeshi"
          },
          {
            "bio": "他與你交手多次,這次背靠的是整個司馬氏的門楣。",
            "quote": "又來。你的「改寫」,朕…我,倒要看看能改到哪一頁。",
            "when": "seen:simazhao"
          },
          {
            "bio": "離皇位一步的人,最恨別人提醒他「名不正」。",
            "quote": "天子親征?好大的陣仗。可惜,兵符在我。"
          }
        ],
        "wangshen": [
          {
            "bio": "他的筆上次沒能等到天亮,這次蘸墨蘸得更早。",
            "quote": "沈的奏表,已謄了兩份。給晉公的那份,先行一步。",
            "when": "seen:wangshen"
          },
          {
            "bio": "史學世家的筆,在名節與門第之間,落了個乾淨利落。",
            "quote": "王沈,有一表上奏。"
          }
        ]
      }
    },
    "jiange": {
      "cast": [
        "jiangwei",
        "zhonghui",
        "liaohua",
        "zhangyi"
      ],
      "objective": "在劍閣天險擋住鍾會的大軍,也要替蜀漢擋住「側面」兩個字。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "十八萬魏軍壓向劍閣,姜維憑險拒守。鍾會的檄書寫得漂亮,可惜劍門關只認得箭。"
        },
        {
          "speaker": "zhonghui",
          "text": "姜伯約,孤城之守,守的是忠,還是不甘?獻關者,會保你封侯。"
        },
        {
          "speaker": "jiangwei",
          "text": "鍾士季的檄文,比你的雲梯好看。劍閣的路,卻只有一條——你的兵,鋪不開。"
        },
        {
          "speaker": "liaohua",
          "text": "老夫從麥城一路退到劍閣,退了四十年。這一關,元儉不退了!"
        },
        {
          "speaker": "zhangyi",
          "text": "將軍,張翼再進一言:陰平小道,不可不防。艾若偷渡,劍閣再險也是空門!"
        }
      ],
      "map": [
        {
          "id": "pass-and-flank",
          "title": "劍閣 · 關與側翼",
          "node": 1,
          "lines": [
            {
              "speaker": "zhangyi",
              "text": "將軍,正面交給我。可翼把醜話說完:鄧艾在沓中,他若不走大道——"
            },
            {
              "speaker": "jiangwei",
              "text": "伯恭放心。維在陰平留了哨,在江油留了眼。劍閣守的不是門,是整面牆。"
            },
            {
              "speaker": "liaohua",
              "text": "牆再厚,也得有人肯站上來。老夫這把骨頭,先靠上去了。"
            },
            {
              "speaker": "you",
              "text": "鍾會要的只是你回頭。你一回頭,正面就薄了——讓他喊,別讓他牽動。"
            }
          ],
          "choices": [
            {
              "id": "hold-wall",
              "text": "死守正面,不受檄文牽動",
              "detail": "本回看破提升,記住牆式守禦",
              "effects": {
                "keenEye": true,
                "fact": "jiange_wall"
              }
            },
            {
              "id": "flank-beacons",
              "text": "分兵三哨,盯死陰平道",
              "detail": "鍾會起手軍資 -200,記住側翼之眼",
              "effects": {
                "raid": true,
                "fact": "jiange_beacons"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "jiange-open",
          "speaker": "zhonghui",
          "text": "姜維!劍閣雖險,你的糧,比我的筆先竭!",
          "at": "start"
        },
        {
          "id": "jiange-lao",
          "speaker": "liaohua",
          "text": "老夫守的這段牆,四十年了沒讓人過去!小輩,再加把勁!",
          "at": "hand:2"
        },
        {
          "id": "jiange-flank",
          "speaker": "zhangyi",
          "text": "陰平三哨,燈都亮着!將軍,正面放心——牆,是整面!",
          "at": "hand:3",
          "when": "fact:jiange_beacons"
        },
        {
          "id": "jiange-low",
          "speaker": "jiangwei",
          "text": "鍾士季,你的檄文寫得再好,也翻不過這道山。回去告訴司馬昭:蜀,還有人在。",
          "at": "low"
        }
      ],
      "win": {
        "text": "鍾會圍關二十餘日,糧草先盡,檄文寫盡了最後的修辭。拔營西退那日,他回望劍門,把姜維的名字寫進了自己的筆記:「取蜀不難,難在此人。」而劍閣的牆上,老將廖化靠着長刀睡着了——四十年,他第一次在關前睡着。",
        "hook": "劍閣守住了正面,可摩天嶺的雪線上,還有一支裹氈而下的孤軍——那是下一頁的風。"
      },
      "loss": {
        "text": "鍾會的佯攻牽走了你的哨兵,劍門的正面在一夜之間薄成了一層紙。關破時姜維沒有回望,只朝陰平的方向一抱拳:「伯恭,是維負了你。」",
        "clue": "史鑑 · 鍾會以「勢」壓「險」,勸降與強攻輪番上。重開時先定牆後設哨;他的檄文,是他最便宜的一種雲梯。",
        "clueFx": "keenEye"
      },
      "intros": {
        "zhonghui": [
          {
            "bio": "他記過關前的每一面旗,這次把勸降書又多寫了三頁。",
            "quote": "這次,孤連你勸降的退路都想好了。",
            "when": "seen:zhonghui"
          },
          {
            "bio": "潁川的貴公子,筆比劍快,野心比兩者都快。",
            "quote": "取蜀如摘冠。諸位,競相摘之。"
          }
        ]
      }
    },
    "yinping": {
      "cast": [
        "dengai",
        "dengzhong",
        "jiangwei",
        "zhugezhan",
        "zhugeshang",
        "zhuge"
      ],
      "objective": "從摩天嶺到綿竹設下兩重回答，讓鄧艾的孤軍無處落地，諸葛父子不必以死守名。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "陰平沒有路，只有被雨沖淡的獸跡。鄧艾命人裹氈滾崖，把自己的命也捲進了那層舊氈。"
        },
        {
          "speaker": "dengai",
          "text": "都、都說陰平無路。無路，纔沒人攔我。"
        },
        {
          "speaker": "dengzhong",
          "text": "父、父親,忠先下探。綿竹若破,成都不戰自降——這一程,兒替您蹚。",
          "when": "!seen:dengzhong"
        },
        {
          "speaker": "zhugezhan",
          "text": "父相在時,常嘆我等生於安樂。今日綿竹在身後,成都歲餘,瞻,退無可退。"
        },
        {
          "speaker": "zhugeshang",
          "text": "祖父,父親,兒孫三代之名,繫於今日。尚,願先登!"
        },
        {
          "speaker": "jiangwei",
          "text": "沓中不能丟，成都也不能丟。最怕的不是兩線作戰，是每一處都以爲另一處有人。"
        }
      ],
      "map": [
        {
          "id": "light-on-cliff",
          "title": "陰平 · 無人處先點燈",
          "node": 1,
          "lines": [
            {
              "speaker": "zhuge",
              "text": "舊札只有一句：陰平非道，守江油者不可撤。當年人人說它多慮，如今紙頁比崖石還重。"
            },
            {
              "speaker": "jiangwei",
              "text": "守住了哨位，還要守哨位之間的迴音。否則一盞燈滅，百里仍以爲自己看得見。"
            },
            {
              "speaker": "zhugezhan",
              "text": "父相舊札我讀了三遍:「陰平非道,守江油者不可撤」。哨位要設在能互相看見的地方。",
              "when": "page:jieting:yeshi"
            }
          ],
          "choices": [
            {
              "id": "three-beacons",
              "text": "依舊札設三處互望烽哨",
              "detail": "本回看破提升，記住絕壁燈火",
              "effects": {
                "keenEye": true,
                "fact": "yinping_beacons"
              }
            },
            {
              "id": "grain-ambush",
              "text": "遷走江油糧道，反設空倉誘敵",
              "detail": "鄧艾軍資 -200，記住空倉之計",
              "effects": {
                "raid": true,
                "fact": "yinping_empty_granary"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "yinping-open",
          "speaker": "dengai",
          "text": "我、我身後沒有糧，腳下沒有路。你猜我除了向前，還能往哪兒退？",
          "at": "start"
        },
        {
          "id": "yinping-jiangwei",
          "speaker": "jiangwei",
          "text": "別追他的將旗。裹着氈的纔是他，走得最慢的輜重才藏着全軍活路。",
          "at": "hand:2"
        },
        {
          "id": "yinping-zhan",
          "speaker": "zhugezhan",
          "text": "高處不是勝勢,能守住水與退路纔是。綿竹的陣,瞻替父相補上這一課。",
          "at": "hand:3",
          "when": "page:jieting:yeshi"
        },
        {
          "id": "yinping-shang",
          "speaker": "zhugeshang",
          "text": "鄧忠!我祖我父之名在此——我的槍,比你的快!",
          "at": "hand:3",
          "when": "multi"
        },
        {
          "id": "yinping-low",
          "speaker": "dengai",
          "text": "山都讓我過了，你、你以爲幾堆石頭便能留住我？",
          "at": "low"
        }
      ],
      "win": {
        "text": "摩天嶺上先有燈，再有滾木。鄧艾抬頭時，江油的空倉也已落鎖；這條以命換出來的奇路，終於成了絕路。姜維收好舊札，沒有慶功，只先給三處烽哨添了燈油。",
        "hook": "蜀地守住，建業的潮聲卻漸低。舊史只剩最後一句：三分歸晉。"
      },
      "loss": {
        "text": "鄧艾落地時，身後只剩一層磨穿的氈。江油開門不是因爲城中無勇，而是所有人都把陰平的那一句“不可能”當成了守備。",
        "clue": "史鑑 · 鄧艾以孤軍不斷搶進，退守只會替他省糧；重開時敵軍軍資 -200，搶先壓住他的落地之勢。",
        "clueFx": "raid"
      },
      "intros": {
        "dengai": [
          {
            "bio": "陰平曾讓他撞上伏守，他卻更相信絕境裏總還有第二條獸徑。",
            "quote": "這、這次我換一處下山。你還等得到嗎？",
            "when": "page:yinping:yeshi"
          },
          {
            "bio": "他說得結巴，行得決絕；所有人口中的不可能，都是他敢孤注一擲的理由。",
            "quote": "山、山不會讓人。可人會繞過山。"
          }
        ],
        "dengzhong": [
          {
            "bio": "初陣綿竹讓他嘗過血,這次把父親的險棋又往前推了一格。",
            "quote": "父、父親教我的,我教給你。",
            "when": "seen:dengzhong"
          },
          {
            "bio": "虎父之下的少年,急於證明「鄧」字不只屬於上一輩。",
            "quote": "家父面前,休得無禮!"
          }
        ]
      }
    },
    "yanglu": {
      "cast": [
        "lukang",
        "yanghu"
      ],
      "objective": "與羊祜對境兩年,贏下「不戰之戰」,替吳國留住最後的將,也留住最後的信。",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "荊州邊境,兩軍對壘,卻兩年無戰。吳人打獵,獵物逃入晉境,羊祜必遣人送還;陸抗病了,羊祜送藥,陸抗當衆服下。"
        },
        {
          "speaker": "yanghu",
          "text": "陸將軍,祜不欺喪亂之人,亦不欺有病之將。藥在此,信亦在此。"
        },
        {
          "speaker": "lukang",
          "text": "羊公贈藥,抗豈疑之?倒是抗有一問:將軍以信獵城,獵的究竟是吳地,還是吳心?"
        },
        {
          "speaker": "lukang",
          "text": "建業來的詔書,比襄陽的兵更急。他們要抗出戰,抗,偏要再守一年。"
        },
        {
          "speaker": "narrator",
          "text": "西陵城下,步闡舉城降晉。陸抗的圍城,圍的已是自家的叛城。"
        }
      ],
      "map": [
        {
          "id": "border-trust",
          "title": "襄陽 · 各安其境",
          "node": 1,
          "lines": [
            {
              "speaker": "yanghu",
              "text": "祜每次會戰,只與你約期而陣,不掩不襲。有人罵祜迂——他們不懂,這纔是最快的刀。"
            },
            {
              "speaker": "lukang",
              "text": "羊公以信待我,抗以信還之。可西陵一叛,兩境的信,就要經受火了。"
            },
            {
              "speaker": "you",
              "text": "他贏的方式是「不戰」。你若急着開戰,便替他把人心送過江去。"
            }
          ],
          "choices": [
            {
              "id": "siege-xiling",
              "text": "先克西陵,再論邊境",
              "detail": "晉軍起手軍資 -200,記住先定內",
              "effects": {
                "raid": true,
                "fact": "yanglu_xiling"
              }
            },
            {
              "id": "keep-compact",
              "text": "守與羊公之約,不開邊釁",
              "detail": "本回看破提升,記住兩年之信",
              "effects": {
                "keenEye": true,
                "fact": "yanglu_pact"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "yanglu-open",
          "speaker": "yanghu",
          "text": "陸將軍,今日又免一戰。祜備了新茶——江陵的,你嘗得出來。",
          "at": "start"
        },
        {
          "id": "yanglu-city",
          "speaker": "lukang",
          "text": "西陵城破了。步闡的人頭,抗親自送還建業。晉公的算盤,少了一顆關鍵的子。",
          "at": "hand:2",
          "when": "fact:yanglu_xiling"
        },
        {
          "id": "yanglu-tea",
          "speaker": "yanghu",
          "text": "茶要趁熱,城要等熟。將軍,祜等得起——你等得起建業嗎?",
          "at": "hand:3",
          "when": "fact:yanglu_pact"
        },
        {
          "id": "yanglu-low",
          "speaker": "lukang",
          "text": "抗常勝於外,而困於內。羊公……你圍的從來不是我,是我的朝廷,對嗎?",
          "at": "low"
        }
      ],
      "win": {
        "text": "西陵既定,邊信未破。羊祜臨終前上表請伐吳,把一生的準備與一懷的藥味一併交給了杜預;陸抗也在同一年病逝,吳人立碑,碑上無「敗」字。兩塊碑隔江相望——你贏了這一頁:兩個名字,誰也沒有輸給誰。",
        "hook": "羊陸之後,再無名將可守。益州的樓船已下水,建業的鐵鎖,正在一寸寸生鏽。"
      },
      "loss": {
        "text": "建業催戰的詔書終於壓過了邊境的信。你出兵的那一日,江邊百姓指着晉營說:「羊公之德,不掠我禾。」仗還沒打,城外的人心已先過江。",
        "clue": "史鑑 · 羊祜的刀是「信」,急攻正中其懷。重開時先定西陵、再守其約;他輸得起時間,你輸不起人心。",
        "clueFx": "keenEye"
      },
      "intros": {
        "yanghu": [
          {
            "bio": "他把你的陣圖讀了兩遍,仍只把圍獵的網收緊一寸。",
            "quote": "急什麼?祜的網,一年只收一寸。",
            "when": "seen:yanghu"
          },
          {
            "bio": "輕裘緩帶的名將,以信爲餌,以德爲鉤。",
            "quote": "祜不與你鬥刀兵。祜,只等人心自己過江。"
          }
        ]
      }
    },
    "guijin": {
      "cast": [
        "simayan",
        "wangjun",
        "duyu",
        "sunhao",
        "cenhun",
        "writer"
      ],
      "objective": "在“天下歸一”落筆前打完三國最後一局，證明合併不必等於抹掉所有人的名字。",
      "coldOpen": [
        {
          "speaker": "simayan",
          "text": "華容那一刀早落過，北方卻照樣換了人間。你們總說能改命，最後不還是由我司馬氏收場？",
          "when": [
            "choice:huarong:yeshi",
            "!choice:huarong:yeshiB"
          ]
        },
        {
          "speaker": "simayan",
          "text": "華容你肯放曹操，是給魏續了一口氣。可惜那口氣最後姓了司馬，你的“義”又救了誰？",
          "when": "choice:huarong:yeshiB"
        },
        {
          "speaker": "wangjun",
          "text": "樓船百丈,鐵鎖千尋。王濬在益州造了七年船,只爲這一趟順流。",
          "when": "!seen:wangjun"
        },
        {
          "speaker": "duyu",
          "text": "羊公臨終薦預。荊州的人心他已經收好了,預只欠一場水漲。",
          "when": "!seen:duyu"
        },
        {
          "speaker": "sunhao",
          "text": "鐵鎖橫江,天塹自在。晉人的樓船?讓他們先問過江裏的石頭!"
        },
        {
          "speaker": "cenhun",
          "text": "陛下放心,岑昏再加三道鎖,火燒不斷,水淹不透!"
        },
        {
          "speaker": "writer",
          "text": "這是舊史最後一頁。你若贏，“天下歸一”便不再是唯一能寫完的句子。"
        }
      ],
      "map": [
        {
          "id": "names-under-unification",
          "title": "石頭城 · 降表外的姓名",
          "node": 1,
          "lines": [
            {
              "speaker": "simayan",
              "text": "朕給建業留全城性命，給蜀主留安樂封號。你們還要什麼？難道割據一生的名字，比太平更要緊？"
            },
            {
              "speaker": "you",
              "text": "太平若只准一個人命名，下一次分裂時，便又只有刀能說話。"
            },
            {
              "speaker": "writer",
              "text": "別隻替英雄爭座位。看看降表背面，那些沒被寫進去的人，才真正等了三代。"
            }
          ],
          "choices": [
            {
              "id": "record-people",
              "text": "先記下降表背後的百姓姓名",
              "detail": "本回看破提升，記住萬民之史",
              "effects": {
                "keenEye": true,
                "fact": "guijin_people"
              }
            },
            {
              "id": "three-flags",
              "text": "重列三國舊旗，再爭最後一局",
              "detail": "司馬炎起手士氣 -1，記住三分餘響",
              "effects": {
                "sow": 1,
                "fact": "guijin_three_flags"
              }
            }
          ]
        }
      ],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "guijin-open",
          "speaker": "simayan",
          "text": "魏熬走了蜀，晉又接過了魏。你看，等待比你們的奇謀都長久。",
          "at": "start"
        },
        {
          "id": "guijin-writer",
          "speaker": "writer",
          "text": "他把“歸一”當作底牌，你便不必比他更像天命。讓他證明，憑什麼只能如此。",
          "at": "hand:2"
        },
        {
          "id": "guijin-you",
          "speaker": "you",
          "text": "合不是把三個名字磨成一個，是讓下一個名字出現時，不必先掀起一場亂世。",
          "at": "hand:3"
        },
        {
          "id": "guijin-low",
          "speaker": "simayan",
          "text": "沒有朕來收場，你們還要打多少年？你敢把這句話也說給城中百姓聽嗎？",
          "at": "low"
        }
      ],
      "win": {
        "text": "樓船在江心停下，建業沒有獻出降表。司馬炎看着三分舊旗，第一次問：“若天下不是一件戰利品，朕還能留下什麼？”沒有人能替他作答，但城中糧市第二天照常開了門。",
        "hook": "卷四寫盡，紙背卻還有一頁。寫卷人已擺好牌：他要與你談談這些被改過的命。"
      },
      "loss": {
        "text": "石頭城終於掛出晉旗。百姓確實等來了太平，只是舊史把所有人的名字越寫越小，最後只留下“歸晉”二字。",
        "clue": "史鑑 · 司馬炎借歸一大勢持續施壓；重開時敵軍軍資 -200，別替他提前相信結局。",
        "clueFx": "raid"
      },
      "intros": {
        "simayan": [
          {
            "bio": "他曾被迫承認歸併非唯一結局，因此再來時更想把所有可能一併收回。",
            "quote": "上次你留下三面旗。這次朕連旗杆也要收走。",
            "when": "page:guijin:yeshi"
          },
          {
            "bio": "他繼承的不只是三國疆土，還有祖父最懂的那種等待：等所有人都厭倦。",
            "quote": "你們打了一輩子，最後還不是要一個“合”字？"
          }
        ],
        "wangjun": [
          {
            "bio": "上一場江風讓他記住了你,這次連火炬都備了兩份。",
            "quote": "燒、燒不斷的是我的船。再來!",
            "when": "seen:wangjun"
          },
          {
            "bio": "七十歲還想封侯的老將,把半生都押在了這條江上。",
            "quote": "樓船下益州。金陵王氣,收在此行。"
          }
        ]
      }
    }
  },
  "5": {
    "zuizhong": {
      "cast": [
        "writer"
      ],
      "objective": "讓寫卷人承認你不是他的註腳；贏下最後一局，在封卷、還史、撕卷之間決定全書的去處。",
      "coldOpen": [
        {
          "speaker": "writer",
          "text": "白門樓你讓呂布活下，後來每個人都多了一條本不該有的路。你以爲我沒看見？我每一筆都記着。",
          "when": "fact:lvbu_lives"
        },
        {
          "speaker": "writer",
          "text": "麥城你救下關羽，我便看着夷陵少了理由、白帝城少了遺恨。可你沒有救下所有遺憾，對不對？",
          "when": "page:maicheng:yeshi"
        },
        {
          "speaker": "writer",
          "text": "麥城的雪仍在，夷陵的火也曾等着。你救過一些人，也親手翻過一些來不及救的頁。",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "writer",
          "text": "封卷，留住你的野史；還史，歸還原來的命；撕卷，讓往後不再有人預知。贏我，這三件事才輪得到你。"
        }
      ],
      "map": [],
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {},
      "battle": [
        {
          "id": "zuizhong-open-survivor",
          "speaker": "writer",
          "text": "五丈原那顆星還亮着。你以爲救下孔明是答案？那只是讓仲達多了一個不能靠等待贏的人。",
          "at": "start",
          "when": "fact:zhuge_survives"
        },
        {
          "id": "zuizhong-open-fallen",
          "speaker": "writer",
          "text": "五丈原的秋風我留着。你可以贏司馬懿，卻未必背得動一個非死不可的人。",
          "at": "start",
          "when": "!fact:zhuge_survives"
        },
        {
          "id": "zuizhong-seal",
          "speaker": "writer",
          "text": "封卷，我把這些野史裝幀成書。他們會活在你改過的那一頁，卻永遠到不了下一頁。",
          "at": "hand:2"
        },
        {
          "id": "zuizhong-return",
          "speaker": "writer",
          "text": "還史，我把筆墨收回。麥城的雪、五丈原的風照舊，你只帶走自己見過他們的記憶。",
          "at": "hand:3"
        },
        {
          "id": "zuizhong-tear",
          "speaker": "writer",
          "text": "撕卷，誰都可能再活一次，誰都可能再死一次。沒有底稿，也沒有我替你兜底。",
          "at": "hand:4"
        },
        {
          "id": "zuizhong-huarong-spare",
          "speaker": "writer",
          "text": "華容你放走曹操，信一個“義”字能抵過後患。今日再問你：敢不敢信未知也能抵過結局？",
          "at": "hand:5",
          "when": "choice:huarong:yeshiB"
        },
        {
          "id": "zuizhong-huarong-strike",
          "speaker": "writer",
          "text": "華容你讓刀落下，改了一個奸雄的命，改不了後人爭位。撕卷也不會替你免去選擇。",
          "at": "hand:5",
          "when": [
            "choice:huarong:yeshi",
            "!choice:huarong:yeshiB"
          ]
        },
        {
          "id": "zuizhong-low",
          "speaker": "writer",
          "text": "我知你每一張舊牌，卻不知下一張。讀者，這就是我肯坐下與你賭的原因。",
          "at": "low"
        }
      ],
      "win": {
        "text": "寫卷人推開牌，第一次沒有替你寫結局。桌上並排放着封繩、舊史與一把無刃的裁紙刀：封卷，留住所改；還史，承擔所失；撕卷，交還未知。你伸手時，整本書都在等。",
        "hook": "三個答案都在下一問裏。你選擇的不是結局，而是誰有權寫下結局。"
      },
      "loss": {
        "text": "他提筆在你的名字旁添了一個“又”字，所有改寫便退回頁邊。可他沒有抹去你坐過的位置——那說明下一次，他仍需要你來。",
        "clue": "史鑑 · 寫卷人熟知你的舊策，卻只能按牌理下注；重開時假破綻減少，別被他的全知語氣嚇退。",
        "clueFx": "keenEye"
      },
      "intros": {
        "写卷人": [
          {
            "bio": "他記得你曾把結局帶出這一頁，卻仍不肯承認書只能有一種歸處。",
            "quote": "又回來改答案？這次連我也不替你記着。",
            "when": "page:zuizhong:yeshi"
          },
          {
            "bio": "他看見東南星仍亮，也知道你救下孔明之後，歷史並沒有因此變輕。",
            "quote": "你救過他一次，便真懂怎樣救人了嗎？",
            "when": "fact:zhuge_survives"
          },
          {
            "bio": "他知道你翻過的每一頁，卻第一次坐在只能驗牌、不能預設結果的位置。",
            "quote": "我寫過你的來路。現在，讓我看看你的選擇。"
          }
        ],
        "寫卷人": [
          {
            "bio": "他記得你曾把結局帶出這一頁，卻仍不肯承認書只能有一種歸處。",
            "quote": "又回來改答案？這次連我也不替你記着。",
            "when": "page:zuizhong:yeshi"
          },
          {
            "bio": "他看見東南星仍亮，也知道你救下孔明之後，歷史並沒有因此變輕。",
            "quote": "你救過他一次，便真懂怎樣救人了嗎？",
            "when": "fact:zhuge_survives"
          },
          {
            "bio": "他知道你翻過的每一頁，卻第一次坐在只能驗牌、不能預設結果的位置。",
            "quote": "我寫過你的來路。現在，讓我看看你的選擇。"
          }
        ]
      }
    }
  }
};
