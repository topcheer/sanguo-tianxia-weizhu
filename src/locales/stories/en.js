export default {
  "1": {
    "taoyuan": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei"
      ],
      "objective": "Protect the volunteer militia amidst the chaos of the Yellow Turbans, and ensure the oath of three strangers can withstand its first defeat.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Peach blossoms of Zhuo Commandery drifted upon the recruitment notice, rain blurring the ink of 'Yellow Turbans'. Three men reached out to tear it down at the exact same instant, their fingertips brushing together."
        },
        {
          "speaker": "liubei",
          "text": "I possess only a pair of straw sandals and a heart of burning blood. If you two are willing to walk beside me, let us first lend our lives to the common folk."
        },
        {
          "speaker": "zhangfei",
          "text": "I have wine, and I have a serpent spear—wagering my life is what I do best! But if we lose, who will be left to gather our bones?"
        },
        {
          "speaker": "guanyu",
          "text": "Then let us not swear for shared glory today, but pledge one solemn pact: whoever falls back, the other two must ride out and bring him home."
        }
      ],
      "map": [
        {
          "id": "peach-oath",
          "node": 1,
          "title": "Peach Grove · Pledge of Mutual Cover",
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "Swearing brotherhood without drinking first? What nonsense! I don't give a damn which hill they bury my bones in!"
            },
            {
              "speaker": "guanyu",
              "text": "Facing death without fear is easy. What is difficult is watching a brother fall and casting aside your own glory to bring him home."
            },
            {
              "speaker": "liubei",
              "text": "Then let us place this pact before the vow of the same day and year. Only by returning alive can we ride together again."
            }
          ],
          "choices": [
            {
              "id": "mutual-cover",
              "text": "Inscribe 'bring each other home' into the oath",
              "detail": "Enemy starting Morale -1; remember the vow of mutual rescue",
              "effects": {
                "sow": 1,
                "fact": "taoyuan_cover"
              }
            },
            {
              "id": "village-rearguard",
              "text": "Teach the militia how to identify escape routes first",
              "detail": "Insight increased this round; remember the militia's retreat path",
              "effects": {
                "keenEye": true,
                "fact": "taoyuan_rearguard"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "taoyuan-open",
          "at": "start",
          "speaker": "zhangfei",
          "text": "I charge first! Don't drag your feet behind me, or the Yellow Turbans will laugh at us!"
        },
        {
          "id": "taoyuan-cover",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "Yide press their lines, Xuande shield the militia. Do not all three push forward together and leave our retreat open to the enemy."
        },
        {
          "id": "taoyuan-low-oath",
          "at": "low",
          "speaker": "liubei",
          "when": "fact:taoyuan_cover",
          "text": "Yide, fall back! You promised that whoever falls will be rescued—do not apply that oath only to others!"
        },
        {
          "id": "taoyuan-low",
          "at": "low",
          "speaker": "liubei",
          "text": "Do not stare at the fallen banners. Look closely at who is still waiting for a comrade's reaching hand."
        }
      ],
      "win": {
        "text": "Peach blossoms settled into three bowls. Liu Bei slid the fourth toward you, yet did not ask you to call him elder brother. 'Today you have witnessed how we began; if ever we are scattered in the days ahead, remind us of the way back.'",
        "hook": "Before the wine of the Peach Garden has faded, the lords have rallied at Suanzao. The next cup must remain warm before a man named Hua Xiong."
      },
      "loss": {
        "text": "The wine remained warm, yet the three were trapped in separate pockets of battle. At last you understand: if living and dying together merely means charging forward at the same time, it is nothing more than three lonely battles fought in blindness.",
        "clue": "Historical Record · Mutual rescue is not all three going all-in together: if one presses the line, another must hold the rear. Restart with +150 Supplies; secure a path of retreat for your brothers first.",
        "clueFx": "supply"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "sishui": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "caocao",
        "huaxiong"
      ],
      "objective": "Amidst the contempt of the coalition lords and the unbroken victories of Hua Xiong, secure for Guan Yu the chance to ride out before a cup of wine grows cold.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Nineteen cups of wine lined the lords' great tent, while outside the pass Hua Xiong severed two champions in rapid succession. A third cup was poured, yet not a single warlord dared to rise."
        },
        {
          "speaker": "caocao",
          "text": "I pour this wine myself. Whoever brings Hua Xiong's head shall find it still warm upon his return."
        },
        {
          "speaker": "guanyu",
          "when": "page:taoyuan:yeshi",
          "text": "The oath of the Peach Garden was not made so my brothers could die in my stead. Pray keep this cup; Guan Mou shall return to drink it himself."
        },
        {
          "speaker": "zhangfei",
          "text": "Second Brother, I will beat the war drums for you! If you don't come back, I won't drink a drop no matter how hot the wine is!"
        }
      ],
      "intros": {
        "huaxiong": [
          {
            "when": "seen:huaxiong",
            "bio": "He remembers that cup of wine that never went cold, and remembers even more clearly who refused to rush.",
            "quote": "Pouring wine again? This time, I will make it turn ice-cold before the feast even begins."
          },
          {
            "bio": "A string of easy victories convinced him that every challenger would be more reckless than the last.",
            "quote": "The wine is suitably warm. And your head is suitably ripe."
          }
        ]
      },
      "map": [
        {
          "id": "warm-cup",
          "node": 1,
          "title": "Sishui Pass · Wine as Pledge",
          "lines": [
            {
              "speaker": "caocao",
              "text": "The whole tent merely counts how many Hua Xiong has slain; only Yunchang watches where he wheels his horse after each kill."
            },
            {
              "speaker": "guanyu",
              "text": "He relies on unbroken victories to cow the lords. If I refuse to panic, it is he who will grow frantic."
            }
          ],
          "choices": [
            {
              "id": "leave-wine",
              "text": "Leave the wine in the tent without boastful words",
              "detail": "Hua Xiong starting Morale -1; remember the vow of return for this cup",
              "effects": {
                "sow": 1,
                "fact": "sishui_return_cup"
              }
            },
            {
              "id": "watch-reins",
              "text": "Observe how Hua Xiong reins in his steed and turns back",
              "detail": "Insight increased this round; remember his backward glance",
              "effects": {
                "keenEye": true,
                "fact": "sishui_horse_reins"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "sishui-open",
          "at": "start",
          "speaker": "huaxiong",
          "text": "Yet another fool trying to buy fame with wine! Before that cup turns cold, you will have died three times over!"
        },
        {
          "id": "sishui-cup",
          "at": "hand:2",
          "speaker": "caocao",
          "text": "The surface of the wine remains still. Yunchang, what the tent urges on is their drum, not your blade."
        },
        {
          "id": "sishui-low",
          "at": "low",
          "speaker": "guanyu",
          "text": "Guan Mou feels no haste. If he only dares swing his blade while riding the crest of momentum, it is he who will grow frantic before the wine turns cold."
        }
      ],
      "win": {
        "text": "Guan Yu returned the cup into Cao Cao's hands, its surface still steaming. Liu Bei untied his dust-stained cloak, and only now did Zhang Fei's thunderous drumfall cease. Cao Cao turned to you: 'Just now the entire tent was consumed with panic—only you were willing to wait for him.'",
        "hook": "Hua Xiong has fallen, yet the gates of Hulao Pass have creaked open. Lu Bu asks but one question: Does the man who warmed the wine dare step forward once more?"
      },
      "loss": {
        "text": "The wine went utterly cold, and not a single soul in the tent mentioned a second cup. You were not defeated by Hua Xiong's swift blade, but by mistaking 'returning to drink' for 'needing to win instantly.'",
        "clue": "Historical Record · Warming wine was never an urge to rush, but faith that one will return. Hua Xiong relies on his winning streak to bait rushed assaults; let him grow frantic first. On restart, his starting Morale is -1.",
        "clueFx": "sow"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "hulao": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "lvbu"
      ],
      "objective": "Read Lu Bu's advances and retreats, and win the first 'impossible' battle before Hulao Pass.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "As the halberd pointed from atop the pass, the banners of the warlords lowered by half. The moment you arrived, Liu Bei slid a cup of wine before you."
        },
        {
          "speaker": "liubei",
          "text": "My second brother's wine once severed Hua Xiong. Today over this cup, do you dare accept?"
        },
        {
          "speaker": "writer",
          "when": "!seen:lvbu",
          "text": "Everyone knows the outcome of this page. Yet none knew why you were also present."
        },
        {
          "speaker": "lvbu",
          "when": "seen:lvbu",
          "text": "You again. What went unfinished last time shall be settled together today."
        }
      ],
      "intros": {
        "lvbu": [
          {
            "when": "seen:lvbu",
            "bio": "He remembers you sitting across the table last time, and remembers how you seized the pot.",
            "quote": "Do not attempt to scare me with coalition lords. You—come face me alone."
          },
          {
            "bio": "Before Hulao Pass, he wielded 'Peerless Under Heaven' as the briefest declaration of war.",
            "quote": "Let the three heroes come together, or come alone yourself. Do not keep me waiting."
          }
        ]
      },
      "map": [
        {
          "id": "three-heroes",
          "node": 1,
          "title": "Sishui · Ancient Oath of Three Heroes",
          "lines": [
            {
              "speaker": "guanyu",
              "text": "His strength lies not in betting on every hand; once fear grips your heart, he needs no cards at all."
            },
            {
              "speaker": "zhangfei",
              "text": "Why waste breath on this! Let me flip his table first!"
            }
          ],
          "choices": [
            {
              "id": "allies",
              "text": "Invite the three heroes to support the flank",
              "detail": "Supplies +100, Lu Bu starting Morale -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "hulao_allies"
              }
            },
            {
              "id": "watch",
              "text": "Watch him play out a full hand alone",
              "detail": "False bluffs reduced this round",
              "effects": {
                "keenEye": true,
                "fact": "hulao_watch"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "hulao-open",
          "at": "start",
          "speaker": "lvbu",
          "text": "Your chips are just like the courage of these lords—plentiful only in appearance."
        },
        {
          "id": "hulao-read",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "The smoother his run, the more his strong hand is written upon his brow. Be in no haste to fear him."
        },
        {
          "id": "hulao-low",
          "at": "low",
          "speaker": "lvbu",
          "when": "!fact:hulao_watch",
          "text": "Splendid! Only this is worthy of being called Hulao!"
        },
        {
          "id": "hulao-low-watch",
          "at": "low",
          "speaker": "you",
          "when": "fact:hulao_watch",
          "text": "So 'only advance and never retreat' was not courage—it was simply the only way he knew how to win."
        }
      ],
      "win": {
        "text": "The halberd crashed to the earth, yet the coalition lords did not cheer. Liu Bei held you steady first, while Guan Yu lifted the cup of wine that had remained untouched throughout.",
        "hook": "Before Lu Bu retreated in defeat, he remembered your name. Your next encounter will not be here at Hulao."
      },
      "loss": {
        "text": "You fell back along with the coalition lords. Only after leaving Hulao Pass did you realize: he had been compelling you all along to treat 'Peerless Under Heaven' as a fifth community card.",
        "clue": "Historical Record · Lu Bu magnifies dread through unrelenting pressure. Upon restart, his false bluffs will decrease.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "xianshan": {
      "cast": [
        "sunjian",
        "huanggai",
        "chengpu",
        "handang",
        "liubiao"
      ],
      "objective": "Read that fatal arrow amidst the bamboo shadows of Mount Xian for Sun Jian, keeping Jiangdong's ember from being snuffed out at its very inception.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The embers of Luoyang were not yet cold, and the Imperial Jade Seal burned against Sun Jian's chest. Atop the battlements of Xiangyang, Liu Biao had already nocked his second arrow."
        },
        {
          "speaker": "sunjian",
          "text": "I have fought all the way from Changsha to Luoyang without tasting a single defeat! Does Liu Jingsheng truly believe a single citadel and a handful of arrows can bring down the Tiger of Jiangdong?!"
        },
        {
          "speaker": "chengpu",
          "text": "My Lord, the bamboo of Mount Xian is dense; we must not commit all our pursuit at once. Better to dispatch scouts ahead while this old subject anchors the rear."
        },
        {
          "speaker": "huanggai",
          "text": "Demou, you are cautious to a fault! That Lu Gong fled so frantically his helmet was crooked! If we do not give chase now, Liu Biao will surely rally his reinforcements!"
        },
        {
          "speaker": "writer",
          "when": "!seen:sunjian",
          "text": "In the forgotten histories, the fiercest tiger always meets its end on the day it trusts its own claws most blindly."
        }
      ],
      "intros": {
        "huangzu": [
          {
            "when": "seen:huangzu",
            "bio": "He remembers how terrifyingly swift Sun Jian's blade was, and this time he buried his ambush even deeper.",
            "quote": "Another tiger of the Sun clan arrives. The arrows of Mount Xian are plentiful enough for all."
          },
          {
            "bio": "He cannot best Sun Jian in single combat, but he knows the man's temperament—a tiger never detours.",
            "quote": "The arrows of Jiangxia have waited two long years for this very day."
          }
        ],
        "caimao": [
          {
            "when": "seen:caimao",
            "bio": "With retreat paths prepared for the naval fleet, only one task remains for him: do not let the Cai clan go down with the ship.",
            "quote": "This time I guard the waterways. As for affairs in the mountains, General Huang, do as you please."
          },
          {
            "bio": "He traded his sister's pillow whispers and his brother-in-law's military tally into bargaining chips.",
            "quote": "The waters of Jingzhou cannot nourish a tiger. General, waste no arrows in vain."
          }
        ]
      },
      "map": [
        {
          "id": "bamboo-veil",
          "node": 1,
          "title": "Dengsai · Shadowed Bamboo Deception",
          "lines": [
            {
              "speaker": "handang",
              "text": "There are shadows amidst the bamboo groves, countless in number. This general is willing to lead our volunteers to scout ahead while my Lord holds the rear."
            },
            {
              "speaker": "sunjian",
              "text": "I hear your words, Yigong. But if I linger behind, my warriors will hesitate half a beat on my behalf."
            },
            {
              "speaker": "you",
              "text": "A tiger's courage lies before the lines, yet its path to survival often rests in that single backward glance."
            }
          ],
          "choices": [
            {
              "id": "scout-first",
              "text": "Send Han Dang to scout the bamboo first and advance slowly",
              "detail": "Insight increased this round; remember the ambush in the bamboo shadows",
              "effects": {
                "keenEye": true,
                "fact": "xianshan_scout"
              }
            },
            {
              "id": "tiger-charge",
              "text": "Follow the Tiger to pierce straight through the bamboo thicket",
              "detail": "Supplies +100, enemy starting Morale -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "xianshan_charge"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "xianshan-open",
          "at": "start",
          "speaker": "huangzu",
          "text": "Sun Jian! You have pursued us for two days, and our arrows have shadowed you for two days as well!"
        },
        {
          "id": "xianshan-slow",
          "at": "hand:2",
          "speaker": "chengpu",
          "when": "fact:xianshan_scout",
          "text": "Do not rush to answer every war drum. The bamboo clatters, but not every rustle comes from men."
        },
        {
          "id": "xianshan-rain",
          "at": "hand:2",
          "speaker": "sunjian",
          "when": "!fact:xianshan_scout",
          "text": "A storm of arrows approaches! Watch the banners, not the man—the direction the banners fall reveals the true ambush."
        },
        {
          "id": "xianshan-low",
          "at": "low",
          "speaker": "huanggai",
          "text": "My Lord, switch mounts! Gongfu's back can still weather another volley!"
        }
      ],
      "win": {
        "text": "The arrows loosed from the bamboo shadows fell harmlessly into the earth. Even as Huang Zu was pinned beneath his horse, he screamed 'Impossible!' Sun Jian did not take his life, only snapped two of his arrows: 'Return and tell Liu Jingsheng that next year, I shall come knocking on Xiangyang's gates once more.' Thus did Jiangdong's ember blaze past Mount Xian.",
        "hook": "With the Fierce Tiger preserved, the tale of Jiangdong has earned its next name—at Jieqiao, the white steeds gallop toward Youzhou."
      },
      "loss": {
        "text": "The moment the arrows whistled through the bamboo shadows, you finally realized how deceptively orderly that 'rout' had been. The Fierce Tiger fell in hot pursuit, leaving Jiangdong to wait for a youth to inherit his legendary name.",
        "clue": "Historical Record · Huang Zu's ambush relies on chaos to lure your all-in: when the bamboo rustles, watch the banners first. Upon restart, his false bluffs will decrease.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "jieqiao": {
      "cast": [
        "gongsunzan",
        "zhaoyun",
        "quyi",
        "wenchou"
      ],
      "objective": "At Jieqiao, shield the White Horse Volunteers from the heavy crossbows of the Vanguard, and earn Zhao Yun his first chance to be truly seen.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The White Horse Volunteers of Youzhou were hailed as the realm's foremost cavalry—until across the river at Jieqiao, eight hundred men of the Vanguard Corps silently raised their heavy crossbows."
        },
        {
          "speaker": "gongsunzan",
          "text": "A single charge from the White Horse Volunteers keeps Hebei quiet for a decade! In Youzhou, Bogui has fought the fiercest wolves, but never wolves that know how to lie in wait."
        },
        {
          "speaker": "zhaoyun",
          "text": "Yun hails from Changshan, joining an army to defend our soil, not one thrown needlessly to slaughter. General, their lines are uneven; treachery surely lies in wait."
        },
        {
          "speaker": "quyi",
          "when": "seen:quyi",
          "text": "Cavalry? Once they cross the shallows, they are nothing more than breathing targets."
        },
        {
          "speaker": "wenchou",
          "when": "!seen:wenchou",
          "text": "Lord Yuan decrees: today, the spears of Hebei shall teach the men of Youzhou how war is waged."
        }
      ],
      "intros": {
        "quyi": [
          {
            "when": "seen:quyi",
            "bio": "He remembers how your white steeds wheeled around his crossbow ranks last time; now he plants his shields even lower.",
            "quote": "Trying to outflank again? My crossbows are lined more than one rank deep."
          },
          {
            "bio": "His eight hundred veterans have all tasted blood, and not one flinches before charging horsemen.",
            "quote": "Cross the river, then. My crossbows have waited for you long enough."
          }
        ],
        "wenchou": [
          {
            "when": "page:baima:yeshi",
            "bio": "The name of Yan Liang is both his scar and his fury—he heard that defeat was baffling and unjust.",
            "quote": "The Twin Pillars of Hebei lost a pillar. Today, I stand in to make it whole."
          },
          {
            "when": "seen:wenchou",
            "bio": "Still refusing to accept the prior bout, his spear holds back a fraction of its former conceit.",
            "quote": "This time, I shall wait for you to cross the river first."
          },
          {
            "bio": "Revered alongside Yan Liang as the Twin Pillars of Hebei, his sole advantage over Yan Liang is his patience.",
            "quote": "I feel no haste. My spear is longer than yours; I have all the time in the world."
          }
        ]
      },
      "map": [
        {
          "id": "river-read",
          "node": 1,
          "title": "Jieqiao · Crossing the Shallows",
          "lines": [
            {
              "speaker": "zhaoyun",
              "text": "The bridge is narrow and the horses packed tight. If the Vanguard looses their crossbows while we are half-across, no number of white steeds can form ranks."
            },
            {
              "speaker": "gongsunzan",
              "text": "Zilong, you are overly timid! In years past, I pierced through wolf packs of Xianbei riders with a mere few dozen mounts!"
            },
            {
              "speaker": "you",
              "text": "Piercing lines relies on surprise. Today, the men across the river are waiting specifically for your charge."
            }
          ],
          "choices": [
            {
              "id": "dismount-line",
              "text": "Order vanguard to dismount, lock shields, and lead horses across",
              "detail": "Insight increased this round; remember the perils of crossing",
              "effects": {
                "keenEye": true,
                "fact": "jieqiao_dismount"
              }
            },
            {
              "id": "white-storm",
              "text": "Full gallop with the white steeds, charging headlong at the Vanguard",
              "detail": "Supplies +100, Vanguard starting Morale -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "jieqiao_storm"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "jieqiao-open",
          "at": "start",
          "speaker": "quyi",
          "text": "Shields—up! Crossbows—level! Let these Youzhou bumpkins see what Vanguard truly means!"
        },
        {
          "id": "jieqiao-shield",
          "at": "hand:2",
          "speaker": "zhaoyun",
          "when": "fact:jieqiao_dismount",
          "text": "Each time their shields dip, their crossbows wind a new notch. Count their rhythm, not their bolts."
        },
        {
          "id": "jieqiao-wen",
          "at": "hand:3",
          "speaker": "wenchou",
          "text": "The white steeds are thrown into disarray! Spears of Hebei, collect the debt!"
        },
        {
          "id": "jieqiao-low",
          "at": "low",
          "speaker": "gongsunzan",
          "text": "Over half the volunteers fallen... Zilong, you spoke true. Bogui was too impatient."
        }
      ],
      "win": {
        "text": "Having deciphered every rhythm of their crossbow volleys, the white steeds charged in three rotational waves until the Vanguard's wall of shields fractured. When Wen Chou thrust his spear to the rescue, Zhao Yun pinned him with a single stroke: 'General, your spear is steady, but pity it serves an arrogant master.' Yuan Shao's center army fell back into Hebei; from that day forth, both banks of the Jieqiao river remembered the name of Zhao Zilong of Changshan.",
        "hook": "Gongsun Zan prevailed in this bout, yet ultimately fell victim to his own towering battlements. Meanwhile, at the Phoenix Pavilion in Meiwu, another rift between father and son was about to blossom."
      },
      "loss": {
        "text": "As the river was half-crossed, a thunder of crossbows cracked in unison, and rows of white steeds collapsed into the currents. Zhao Yun held the rear to pull Gongsun Zan from the jaws of death; glancing back at you, he spoke not a word.",
        "clue": "Historical Record · Qu Yi's crossbow phalanx triumphs by 'waiting for your charge'. Upon restart, his false bluffs decrease; do not push all your cavalry forward mid-crossing.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "fengyiting": {
      "cast": [
        "diaochan",
        "dongzhuo",
        "lvbu"
      ],
      "objective": "Sow suspicion between Dong Zhuo and Lu Bu at the very same table, completing the final step of the Interlocking Stratagem for Diaochan.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The lotuses of the Phoenix Pavilion bloomed in eerie silence. Outside the pavilion, Dong Zhuo awaited his beauty; behind the artificial rockery, Lu Bu awaited an explanation; yet Diaochan awaited only the moment they sat together."
        },
        {
          "speaker": "diaochan",
          "text": "The Imperial Preceptor demands my surrender; the General demands my vows. Today I answer neither—I shall make them hear each other's truth."
        },
        {
          "speaker": "lvbu",
          "when": "page:hulao:yeshi",
          "text": "At Hulao you forced me to yield a step. If you demand I retreat once more today, what departs will not be me, but the whole of Meiwu itself."
        },
        {
          "speaker": "dongzhuo",
          "text": "Fengxian, I have treated you with utmost generosity. Must even you gaze upon her through my beaded curtains?!"
        }
      ],
      "intros": {
        "dongzhuo": [
          {
            "when": "seen:dongzhuo",
            "bio": "The gates of Meiwu have had their locks replaced, yet he still believes all sincerity can be locked inside his treasury.",
            "quote": "Scheming again? This time, I shall watch you first before eyeing Fengxian."
          },
          {
            "bio": "He keeps gratitude logged like an accountant's ledger, demanding Lu Bu repay every entry with obedience.",
            "quote": "Father and son sit at one table—what words cannot be spoken plainly?"
          }
        ],
        "lvbu": [
          {
            "when": "page:hulao:yeshi",
            "bio": "After Hulao he was willing to retreat once, but he refuses to let anyone dictate his path ever again.",
            "quote": "Last time you bested my halberd. This time, do not presume to choose for her."
          },
          {
            "when": "seen:lvbu",
            "bio": "Past defeats never dulled his edge; they only made him loathe being treated as someone else's possession.",
            "quote": "I know you. And I know that look in your eyes, claiming to act 'for my own good'."
          },
          {
            "bio": "The Sky Piercer halberd stands outside the pavilion; what he fears most is an ambiguous whisper from within.",
            "quote": "Let her speak plainly. And you do the same."
          }
        ]
      },
      "map": [
        {
          "id": "two-listeners",
          "node": 1,
          "title": "Phoenix Pavilion · One Word, Two Listeners",
          "lines": [
            {
              "speaker": "diaochan",
              "text": "If they question me separately, I can only give each half an answer. Once seated together, the Preceptor must check Fengxian's face to raise, and Fengxian must bear the Preceptor's laughter to fold."
            },
            {
              "speaker": "you",
              "text": "So you need not deceive two men; you only need a single truth that bears two meanings."
            },
            {
              "speaker": "diaochan",
              "text": "No. I also want them to finally understand: I am not the bounty promised in that truth."
            }
          ],
          "choices": [
            {
              "id": "tell-dong",
              "text": "Let Dong Zhuo notice Lu Bu's hesitation first",
              "detail": "Insight increased this round; remember the Preceptor's doubt",
              "effects": {
                "keenEye": true,
                "fact": "fengyi_dong_doubt"
              }
            },
            {
              "id": "tell-lvbu",
              "text": "Let Lu Bu overhear Dong Zhuo's claim of possession",
              "detail": "Enemy starting Morale -1; remember Fengxian's rage",
              "effects": {
                "sow": 1,
                "fact": "fengyi_lvbu_rage"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "fengyi-open-multi",
          "at": "start",
          "speaker": "diaochan",
          "when": "multi",
          "text": "Today there are no two hole cards, only the bond of father and son. Whichever treats the other as an enemy first opens the game for me."
        },
        {
          "id": "fengyi-dong",
          "at": "hand:2",
          "speaker": "dongzhuo",
          "when": "multi",
          "text": "Fengxian, do you follow her, or do you follow me? Think carefully before you wager."
        },
        {
          "id": "fengyi-lvbu",
          "at": "hand:3",
          "speaker": "lvbu",
          "when": "multi",
          "text": "Foster Father claims you have treated me so well—yet it turns out everything I possess has been tabulated so neatly!"
        },
        {
          "id": "fengyi-low",
          "at": "low",
          "speaker": "diaochan",
          "when": "multi",
          "text": "Do not look at me. Look into yourselves: one fears losing his grip on power, while the other fears he was never truly his own master."
        }
      ],
      "win": {
        "text": "Diaochan pushed open the pavilion doors, for the first time free from speaking in deference to any man's gaze. Dong Zhuo and Lu Bu glared at one another until the bond of father and son was reduced to a torn banquet invitation. She ran to neither, but walked her own path out of Meiwu.",
        "hook": "Parting at the Phoenix Pavilion, both Lu Bu and Diaochan walked away from Meiwu. Yet an envoy from Xiaopei is already on the road—next time, he must mediate a feud between two houses."
      },
      "loss": {
        "text": "Dong Zhuo took it as petty jealousy for favor; Lu Bu saw only betrayal and deceit. Diaochan took off her earrings without a tear: you tried to win two men for her, forgetting that what she truly sought was the freedom to never belong to anyone.",
        "clue": "Historical Record · Do not guess Dong Zhuo's and Lu Bu's cards separately; watch whom one glances at when the other bets. The fissure of the Interlocking Stratagem lies between them. Upon restart, false bluffs decrease.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "shenting": {
      "cast": [
        "sunce",
        "taishici",
        "zhouyu",
        "chengpu"
      ],
      "objective": "At Shenting Ridge, let both weapons clash through the entire duel, preserving honor and dignity for both Sun Ce and Taishi Ci.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Outside the walls of Qu'a, scouts reported: Sun Ce had ridden out with a mere twelve horsemen to reconnoiter Liu Yao's main encampment. Taishi Ci gripped his spear, mounted his steed, and rode out with only a drum-beating stripling at his back."
        },
        {
          "speaker": "sunce",
          "text": "All call me the Little Conqueror. Today on this ridge there are no battle lines and no drums—the perfect chance to see what remains beneath the title!"
        },
        {
          "speaker": "taishici",
          "text": "Taishi Ci of Donglai, a man who could barely afford a meal, yet yields to no living soul with a spear! If we fight, we fight—who fears whom?!"
        },
        {
          "speaker": "zhouyu",
          "text": "Bofu, the wind on Shenting Ridge is shifting. When this duel is halfway done, a third party is bound to arrive."
        }
      ],
      "intros": {
        "taishici": [
          {
            "when": "seen:taishici",
            "bio": "The shattered halberd and torn armor from last time engraved your name in his mind, as well as your fairness.",
            "quote": "You again. This time, lend your eyes to judge who is truly worthy to win."
          },
          {
            "when": "page:jieqiao:yeshi",
            "bio": "Having heard of the reader who counted the volleys at Jieqiao, his spear carries an extra touch of respect.",
            "quote": "One who can count a crossbow barrage can surely count the thrusts of my spear."
          },
          {
            "bio": "In all his life he acknowledges only two things: his mother's teachings, and a rival worthy of battle.",
            "quote": "The wind on Shenting Ridge blows fierce. Grip your weapon tight!"
          }
        ]
      },
      "map": [
        {
          "id": "no-flags",
          "node": 2,
          "title": "Shenting Ridge · Formation without Drums",
          "lines": [
            {
              "speaker": "taishici",
              "text": "Here there are no military orders, no tactical diagrams. If you scheme for either side, this fight becomes tainted."
            },
            {
              "speaker": "sunce",
              "text": "Agreed! Clear the field! Gongjin, fall back thirty paces—this is a duel today, and whoever interferes answers to me!"
            },
            {
              "speaker": "you",
              "text": "Then I shall watch from the sidelines. Let us see who displays true skill first, and who reveals true character."
            }
          ],
          "choices": [
            {
              "id": "fair-watch",
              "text": "Stand by with folded arms, committing their spear paths to memory",
              "detail": "Insight increased this round; remember the spear paths of Shenting",
              "effects": {
                "keenEye": true,
                "fact": "shenting_watch"
              }
            },
            {
              "id": "drink-bet",
              "text": "Set out wine atop the ridge, wagering who tires first",
              "detail": "Supplies +120; both men's fighting spirit burns hotter",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "shenting_bet"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "shenting-open",
          "at": "start",
          "speaker": "taishici",
          "text": "Little Conqueror, meet my spear! Let no onlooker look down on what we are!"
        },
        {
          "id": "shenting-halberd",
          "at": "hand:2",
          "speaker": "sunce",
          "text": "Magnificent technique! Faster with your spear—the hands of the Sun clan do not tremble!"
        },
        {
          "id": "shenting-armor",
          "at": "hand:3",
          "speaker": "taishici",
          "text": "I ripped your helmet away, and your breastplate is next! Still eager to fight? I will see you to the bitter end!"
        },
        {
          "id": "shenting-low",
          "at": "low",
          "speaker": "zhouyu",
          "text": "When two tigers clash, one is bound to be mauled—and whichever falls wounded must still defend the city tomorrow."
        }
      ],
      "win": {
        "text": "The halberd snapped, the breastplates cracked, and both men lay collapsed on the ridge clutching their weapons, panting until they burst into uproarious laughter together. Taishi Ci rolled upright: 'Young Master Sun, when we meet before the lines tomorrow, I will show no mercy.' Sun Ce tossed the broken halberd to him: 'Keep it. Once mended, come at me again.' You poured the wine atop the ridge into two bowls—one for the victor, and one for the man who never lost.",
        "hook": "Before the laughter on Shenting Ridge faded, the canvas of Jiangdong was waiting to unfold. Meanwhile in Xiaopei, a painted halberd was about to broker peace between two warring houses."
      },
      "loss": {
        "text": "Your meddling soured the duel, turning both weapons against you in unison. Taishi Ci withdrew his spear in bitter disappointment: 'So even a reader of scrolls knows how to flip the gaming table.'",
        "clue": "Historical Record · This page asks not for a swift triumph, but for both heroes to duel to the very limit. Upon restart, observe who exhausts their strength first before placing your bet.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Ensure both Ji Ling and Liu Bei retain a path of retreat, while compelling Lu Bu to prove his arrow is not merely another display of tyranny.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Outside the camp gates stood the halberd with only a slender side-prong to strike; within the gates sat two massive armies coiled to slaughter each other. Lu Bu set his bow upon the table and invited you to deal the cards first."
        },
        {
          "speaker": "lvbu",
          "when": "page:hulao:yeshi",
          "text": "At Hulao you claimed I knew only how to advance. Today both armies are present—watch how I use a single arrow to make them both withdraw."
        },
        {
          "speaker": "yuanshu",
          "when": "!seen:yuanshu",
          "text": "Ji Ling, hear my decree: If Xiaopei does not fall, do not dare return to Huainan! My Imperial Seal belongs to the realm under heaven, not to the sentimental favor of a Lu Bu!"
        },
        {
          "speaker": "jiling",
          "text": "Ji serves the decree of my lord; I will not pull back my troops for a single arrow. Unless all seated here agree that this arrow is a wager worth taking."
        },
        {
          "speaker": "liubei",
          "text": "I have no desire to gamble the lives of Xiaopei's people just to validate any man's archery."
        }
      ],
      "intros": {
        "jiling": [
          {
            "when": "seen:jiling",
            "bio": "Still refusing to yield to that single arrow, he now weighs carefully the lives hanging beneath its trajectory.",
            "quote": "Wagering again is fine. But state the terms of both armies plainly, word for word."
          },
          {
            "bio": "With his three-pointed blade weighed down by lordly orders, he cannot retreat like a coward frightened by miraculous archery.",
            "quote": "General Lu possesses miraculous archery, but Ji also possesses his lord's command."
          }
        ]
      },
      "map": [
        {
          "id": "shared-wager",
          "node": 1,
          "title": "Camp Gate · A Shared Stake",
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "A single arrow to spare my Eldest Brother from war? If he misses, I will smash his bow across his face first!"
            },
            {
              "speaker": "guanyu",
              "text": "Hence the truest challenge lies not in hitting the mark, but in ensuring both sides honor the debt even should it miss."
            },
            {
              "speaker": "lvbu",
              "text": "Then let us state plainly what follows a miss as well. Lu Mou does not rely on others to manufacture his confidence."
            }
          ],
          "choices": [
            {
              "id": "name-the-miss",
              "text": "Stipulate how both sides withdraw if the arrow misses",
              "detail": "Insight increased this round; remember the shared wager",
              "effects": {
                "keenEye": true,
                "fact": "yuanshemen_named_miss"
              }
            },
            {
              "id": "seat-the-rivals",
              "text": "Seat Xuande and Ji Ling on the same side",
              "detail": "Ji Ling starting Morale -1; remember the bond of sitting together",
              "effects": {
                "sow": 1,
                "fact": "yuanshemen_shared_seat"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "yuanmen-open",
          "at": "start",
          "speaker": "jiling",
          "text": "Speak not of miraculous shots yet! If I win this hand, do you dare let Xuande ride out for an open field battle?!"
        },
        {
          "id": "yuanmen-arrow",
          "at": "hand:2",
          "speaker": "lvbu",
          "text": "If I miss the prong, I shall naturally comply with your terms. But if you only wish to see me humiliated, you have fundamentally misread this table."
        },
        {
          "id": "yuanmen-low",
          "at": "low",
          "speaker": "liubei",
          "text": "General Ji, what we must win today is not defiance of your orders, but a reason you can hold your head high before your soldiers upon your return."
        }
      ],
      "win": {
        "text": "As the arrow left the bowstring, Ji Ling looked not at the halberd's prong, but first at Liu Bei. Only when Liu Bei pushed the blade before him an inch away did Ji Ling finally withdraw his troops. Lu Bu laughed thunderously, yet only you noticed the sweat glistening on his palms: had this arrow been merely a boast of skill, it could have saved no one.",
        "hook": "The shot at the gate preserved Xiaopei, yet could not preserve Lu Bu's own Xiapi; meanwhile Cao Cao from Xuchang has already set out toward Wancheng."
      },
      "loss": {
        "text": "Before the arrow had even left the bowstring, Ji Ling and Liu Bei were already on their feet. In your haste to guarantee Lu Bu could not miss, you forgot to ask whether the other two were willing to stake military commands and common lives on a single boast.",
        "clue": "Historical Record · Mediating peace is not about flattering both sides, but getting both to accept a shared stake. Do not promise too much before the arrow flies; upon restart, false bluffs decrease.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "wancheng": {
      "cast": [
        "caocao",
        "dianwei",
        "zhangxiu"
      ],
      "objective": "On the night Zhang Xiu surrendered only to rebel, guard Dian Wei's twin halberds first, and secure a final line of retreat for Cao Cao.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The surrender banners of Wancheng were not yet taken down, yet feasts in Cao Cao's camp dragged into the dead of night. Dian Wei sat cradling his twin halberds outside the tent, while only you noticed an extra pair of feet lurking in the shadows along the wall."
        },
        {
          "speaker": "caocao",
          "when": "page:sishui:yeshi",
          "text": "That cup of warm wine at Sishui remains etched in my mind to this day. Alas, tonight men's hearts turn cold faster than wine, and I failed to taste it in time."
        },
        {
          "speaker": "dianwei",
          "text": "Rest peacefully, my Lord. Dian understands nothing of cards—I know only this gate: so long as I stand and my halberds remain, this threshold holds."
        },
        {
          "speaker": "zhangxiu",
          "text": "Must the wine of a surrendered general always be drunk with bowed head? Lord Cao, come tally the ledger tonight and see who owes whom!"
        }
      ],
      "intros": {
        "zhangxiu": [
          {
            "when": "seen:zhangxiu",
            "bio": "A banner of surrender can be raised once more, but the silent humiliation suffered can never be undone.",
            "quote": "Ask not of the twin halberds this time. Ask whether you are still willing to hear me out."
          },
          {
            "bio": "The Spear King of the Northern Border has surrendered once; striking again, he will harbor not a shred of hesitation.",
            "quote": "By daylight you accept my surrender; by night you answer to my spear. Lord Cao, pray be seated."
          }
        ]
      },
      "map": [
        {
          "id": "twin-halberds",
          "node": 1,
          "title": "Wancheng · Twin Halberds Unguarded",
          "lines": [
            {
              "speaker": "dianwei",
              "text": "Hu Che'er toasted me with three bowls of wine tonight, but his eyes never left my halberds. If my weapons are lost, how can I secure an escape for my Lord?!"
            },
            {
              "speaker": "caocao",
              "text": "Since Zhang Xiu surrendered, why does he look as though he sits upon needles? Did I mistake 'submission' for 'having nothing left to say'?"
            }
          ],
          "choices": [
            {
              "id": "guard-arms",
              "text": "Stand guard with Dian Wei over the twin halberds and rear horse trail",
              "detail": "Insight increased this round; halberds and escape path both secured",
              "effects": {
                "keenEye": true,
                "fact": "wancheng_arms_ready"
              }
            },
            {
              "id": "return-camps",
              "text": "Allow surrendered troops to return to former camps without disarming them",
              "detail": "Zhang Xiu starting Morale -1; remember the hearts of surrendered men",
              "effects": {
                "sow": 1,
                "fact": "wancheng_respect"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "wancheng-open",
          "at": "start",
          "speaker": "zhangxiu",
          "text": "By day you accepted my surrender, yet by night you took me for a mute dog! This spear of Zhang Xiu is only now striking home!"
        },
        {
          "id": "wancheng-regret",
          "at": "hand:2",
          "speaker": "caocao",
          "text": "Did I miscalculate Zhang Xiu, or did I misjudge myself? Dian Wei, let no man breach this tent!"
        },
        {
          "id": "wancheng-low-ready",
          "at": "low",
          "speaker": "dianwei",
          "when": "fact:wancheng_arms_ready",
          "text": "My Lord, flee! With my twin halberds in hand, no man shall force Dian to guard this gate barehanded tonight!"
        },
        {
          "id": "wancheng-low",
          "at": "low",
          "speaker": "dianwei",
          "text": "My Lord, flee! Ask not how much longer Dian can remain standing—ask only whether your steed is ready!"
        }
      ],
      "win": {
        "text": "The twin halberds remained in Dian Wei's grasp, and Zhang Xiu's fire failed to seal the camp gate. Having fled far into the dark, Cao Cao looked back for the first time without asking how many troops were lost, asking only: 'Does Dian Wei still stand where he was?' In the distance, the giant lifted a bloodied halberd in silent reply.",
        "hook": "The gate of Wancheng held, yet Cao Cao had no leisure to heed the lesson. His legions are already at Xiapi; this time, the one encircled is Lu Bu."
      },
      "loss": {
        "text": "The moment the halberds were stolen, you realized Zhang Xiu was not waiting for Cao Cao to fall asleep, but for him to mistake another man's humiliation for safety. Flames still burned at the gate; Dian Wei yielded not another step.",
        "clue": "Historical Record · Zhang Xiu's resolve was written the moment he stopped looking at Cao Cao. Do not merely watch his spearpoint; guard the camp gate and twin halberds first. Upon restart, false bluffs decrease.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "baimenlou": {
      "cast": [
        "lvbu",
        "chengong",
        "caocao",
        "liubei"
      ],
      "objective": "Unravel the true deadlock between Lu Bu and Chen Gong, and decide whether Xiapi has a tomorrow.",
      "coldOpen": [
        {
          "speaker": "chengong",
          "text": "Outside lie Cao Cao's hordes; inside are soldiers parched of water for three days. Yet the Marquis still proclaims that so long as he takes the field, defeat does not exist."
        },
        {
          "speaker": "lvbu",
          "when": "page:hulao:yeshi",
          "text": "At Hulao, what you won was mere cards. Today, do you dare gamble with life itself once more?!"
        },
        {
          "speaker": "chengong",
          "when": "page:hulao:yeshi",
          "text": "You have come. I have read that chapter of Hulao—yet this time, what must be saved is not his martial glory."
        },
        {
          "speaker": "writer",
          "text": "The noose of White Gate Tower dangles just beyond the page. With each hand you win, its knot tightens into sharper focus."
        }
      ],
      "intros": {
        "lvbu": [
          {
            "when": "page:hulao:yeshi",
            "bio": "Having tasted defeat once at Hulao, Lu Bu is all the more desperate to deny he is trapped like a beast.",
            "quote": "You made me taste defeat—can you find a way to let me live?!"
          },
          {
            "bio": "The waters of the Si submerge the city walls, yet the Peerless Under Heaven still waits for a heading to charge.",
            "quote": "Out of my way. I will carve out another bloody path!"
          }
        ],
        "chengong": [
          {
            "bio": "He came not to seek victory for Lu Bu, but to secure a route of escape for Xiapi.",
            "quote": "If you know only how to win hands, you cannot save him."
          }
        ]
      },
      "map": [
        {
          "id": "last-counsel",
          "node": 1,
          "title": "Sishui · The Final Counsel",
          "lines": [
            {
              "speaker": "chengong",
              "text": "I urged him to take his camp outside the walls; he asked me whether he would still be Lu Bu once outside. You see, that arrogance is his true prison."
            },
            {
              "speaker": "caocao",
              "text": "Xuande stands upon the tower as well. If you spare Fengxian today, who under heaven will hold him in check tomorrow?"
            }
          ],
          "choices": [
            {
              "id": "chen-plan",
              "text": "Finish articulating Chen Gong's strategy for retreat",
              "detail": "Insight increased; remember Chen Gong's counsel",
              "effects": {
                "keenEye": true,
                "fact": "chen_plan"
              }
            },
            {
              "id": "lvbu-oath",
              "text": "Compel Lu Bu to swear aloud never to charge blindly again",
              "detail": "Enemy starting Morale -1",
              "effects": {
                "sow": 1,
                "fact": "lvbu_oath"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "baimen-open",
          "at": "start",
          "speaker": "chengong",
          "text": "Watch when his chips dwindle beneath thirty percent. A cornered beast will stake even his last sliver of sanity on the table."
        },
        {
          "id": "baimen-low",
          "at": "low",
          "speaker": "lvbu",
          "text": "Chen Gong! If I listen to you this time, will the world mock me as a coward?!"
        },
        {
          "id": "baimen-answer",
          "at": "low",
          "speaker": "chengong",
          "text": "They will. But only the living possess the luxury of being mocked."
        }
      ],
      "win": {
        "text": "At last, Lu Bu did not make a frantic charge for the gates. Removing his golden hair-cap, he asked Chen Gong for the very first time: 'Where do we retreat?' The weeping across Xiapi fell silent for the night.",
        "hook": "In Xuchang, the green plums are ripening. Cao Cao has already heard: the Peerless Under Heaven did not perish, and you sat at that very table.",
        "choiceFact": "lvbu_lives"
      },
      "loss": {
        "text": "As the noose cinched tight, you realized with dread that you had only ever answered 'how to defeat Lu Bu', while never answering 'how Lu Bu could be willing to live'.",
        "clue": "Historical Record · Chen Gong saw through the rhythm of the trapped beast. Upon restart, false bluffs decrease.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "zhujiu": {
      "cast": [
        "caocao",
        "liubei",
        "lvbu"
      ],
      "objective": "Conceal your own true answer, and listen closely for the words Cao Cao left unsaid.",
      "coldOpen": [
        {
          "speaker": "caocao",
          "when": "page:baimenlou:yeshi",
          "text": "Upon White Gate Tower you chose a path of survival for him. Over this cup of wine today, I want to know what you choose for yourself."
        },
        {
          "speaker": "liubei",
          "when": "page:baimenlou:yeshi",
          "text": "If he mentions Fengxian, do not rush to answer. First listen to how many men of the realm he names before us."
        },
        {
          "speaker": "caocao",
          "when": "page:baimenlou:history",
          "text": "Since our parting at White Gate Tower, Xuande has grown all the more cautious. And a cautious man makes the finest drinking companion."
        },
        {
          "speaker": "narrator",
          "text": "Green plums floated in small cups as thunder rumbled in the distance. Suddenly you realize: not a single riddle at this table is truly about the realm."
        }
      ],
      "intros": {
        "caocao": [
          {
            "when": "page:baimenlou:yeshi",
            "bio": "He remembers every decision made atop White Gate Tower, especially remembering whom you allowed to live.",
            "quote": "Fengxian lives, and Xuande is seated here. Today, I fear there are more than two heroes under heaven."
          },
          {
            "bio": "Boiling wine over green plums, he treats every man's ambition as a hole card to be tested and revealed.",
            "quote": "Fear not the thunder. Fear what I speak next."
          }
        ]
      },
      "map": [
        {
          "id": "green-plum",
          "node": 1,
          "title": "Plum Pavilion · Answer Before Asked",
          "lines": [
            {
              "speaker": "liubei",
              "text": "When he calls you a hero, if you merely offer modest denials, he will instantly know you understood his trap."
            },
            {
              "speaker": "you",
              "text": "Then should I pretend ignorance?"
            },
            {
              "speaker": "liubei",
              "text": "No. Make him believe you understand nothing beyond the cards in your hand."
            }
          ],
          "choices": [
            {
              "id": "thunder",
              "text": "Use the clash of thunder to veil your expression",
              "detail": "Cao Cao starting Morale -1",
              "effects": {
                "sow": 1,
                "fact": "thunder_mask"
              }
            },
            {
              "id": "watch-cao",
              "text": "Counter by asking what he feared most at White Gate Tower",
              "detail": "Insight increased this round",
              "effects": {
                "keenEye": true,
                "fact": "watch_cao"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "zhujiu-open",
          "at": "start",
          "speaker": "caocao",
          "text": "Cards are like men. Watch them first; do not rush to call."
        },
        {
          "id": "zhujiu-mid",
          "at": "hand:2",
          "speaker": "caocao",
          "text": "Of heroes under heaven today—whom do you think I shall name first?"
        },
        {
          "id": "zhujiu-low",
          "at": "low",
          "speaker": "liubei",
          "text": "The thunder is upon us. It is time for your chopsticks to drop."
        }
      ],
      "win": {
        "text": "The chopsticks fell; the thunder ceased. Cao Cao chuckled and poured your wine, asking not a single question more. Liu Bei knew that for one fleeting heartbeat, all three of you had glimpsed each other's hidden cards.",
        "hook": "Guan Yu is soon to seal his gold and hang up his seal of office. In this duel in Xuchang, Cao Cao remembered your concealed edge."
      },
      "loss": {
        "text": "You answered 'who is a hero', but failed to hear that his true question was 'do you intend to become my enemy?'. The wine held no poison, yet his words had already tightened an inescapable ring around you.",
        "clue": "Historical Record · Cao Cao begins reading your bets on the second hand. Upon restart, his false bluffs decrease.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "baima": {
      "cast": [
        "caocao",
        "guanyu",
        "guojia",
        "xunyu",
        "yanliang",
        "wenchou"
      ],
      "objective": "Between the twin battlefronts of Baima and Yanjin, forge two monumental triumphs into Guan Yu's road back to his brothers.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Before the slopes of Baima, Yan Liang slew Song Xian and Wei Xu in rapid succession, defeating Xu Huang in twenty bouts until Cao Cao's commanders trembled in dismay. Cao Cao turned his gaze toward the lone man who stood with his back turned to the battle reports."
        },
        {
          "speaker": "caocao",
          "text": "Yunchang, I know your body is here while your heart is elsewhere. But Yan Liang's scimitar now hangs over the neck of every general I command."
        },
        {
          "speaker": "guanyu",
          "text": "Guan Mou gave my word: once I repay your kindness with merit, I depart. After this battle, pray keep your promise, Prime Minister—I have already heard word of Xuande's whereabouts."
        },
        {
          "speaker": "guojia",
          "when": "!seen:guojia",
          "text": "Yan Liang's ferocity cannot be matched by raw force; Wen Chou's rashness can be exploited through guile. Fengxiao fears only one thing: once Yunchang delivers these two fatal blows, no one under heaven will ever be able to retain him."
        },
        {
          "speaker": "yanliang",
          "when": "!seen:yanliang",
          "text": "Has Cao's camp run out of men?! Call forth that red-faced mounted archer to let me test his mettle!"
        }
      ],
      "intros": {
        "yanliang": [
          {
            "when": "seen:yanliang",
            "bio": "He remembers that blindingly swift crescent blade; this time he entrenches his fortifications even deeper.",
            "quote": "That blade... this time, I shall see its stroke clearly."
          },
          {
            "bio": "Foremost blade of Hebei; a string of swift victories convinced him that no faster blade exists under heaven.",
            "quote": "My camp stretches ten leagues unbroken; whoever dares approach shall perish."
          }
        ],
        "wenchou": [
          {
            "when": "seen:wenchou",
            "bio": "After Jieqiao he learned to wait, yet at Yanjin he was ordered to pursue—he despises such contradictions.",
            "quote": "You taught me how to count rhythms. Now, it is your turn to count my thundering hooves."
          },
          {
            "bio": "The burning desire to avenge Yan Liang weighs heavier than his spear; supply wagons strewn across the dirt cannot stall his charge.",
            "quote": "The debt of Baima shall be settled here at Yanjin."
          }
        ],
        "songxian": [
          {
            "bio": "Awakened from the broken dream of Lu Bu, he burns to prove his worth to his new master.",
            "quote": "The veterans of Marquis Wen are no cowards! Watch me!"
          }
        ]
      },
      "map": [
        {
          "id": "two-blades",
          "node": 1,
          "title": "Liyang · Between Two Fronts",
          "lines": [
            {
              "speaker": "xunyu",
              "text": "Yan Liang's soldiers are elite but rigid; Wen Chou is fierce but rash. Between these two battle lines, what must truly be read is Yunchang's heart."
            },
            {
              "speaker": "guanyu",
              "text": "Rest easy, Lord Xun. Guan Mou strikes this blow only to repay the Prime Minister; once delivered, I depart to seek my brother."
            },
            {
              "speaker": "you",
              "text": "Two battles, two strokes—each stroke must be clean and decisive. Any hesitation will make the road back unbearably long."
            }
          ],
          "choices": [
            {
              "id": "feed-few",
              "text": "Bait with weak units, feigning abandonment of baggage",
              "detail": "Wen Chou army starting Supplies -200; remember the bait stratagem",
              "effects": {
                "raid": true,
                "fact": "baima_bait"
              }
            },
            {
              "id": "watch-blade",
              "text": "Accompany Guan Yu to spot Yan Liang's command canopy first",
              "detail": "Insight increased this round; remember what lies beneath the canopy",
              "effects": {
                "keenEye": true,
                "fact": "baima_watch"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "baima-open",
          "at": "start",
          "speaker": "yanliang",
          "text": "Another fool?! The blades of Song Xian and Wei Xu are still dangling from my saddle!"
        },
        {
          "id": "baima-ride",
          "at": "hand:2",
          "speaker": "narrator",
          "when": "fact:baima_watch",
          "text": "The Red Hare galloped from behind the earthen hill; Yan Liang's command canopy stood stark and solitary before the ranks. Before he could demand the rider's name, the crescent blade had already arrived."
        },
        {
          "id": "baima-clash",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "!fact:baima_watch",
          "text": "Beneath the canopy is the morale he strives to protect. Shatter his banner, and this battle is ended."
        },
        {
          "id": "baima-wen",
          "at": "hand:3",
          "speaker": "wenchou",
          "text": "Swift steed! Wen Chou's spear has barely warmed—why do you flee?!"
        },
        {
          "id": "baima-low",
          "at": "low",
          "speaker": "guojia",
          "text": "Between two fronts, lingering in battle is most fatal. Yunchang, your wine is here, and your road home is here."
        }
      ],
      "win": {
        "text": "As the canopy at Baima crashed down, Wen Chou at Yanjin was still counting your beats amidst the thunder of hooves. Two fronts, two strokes—clean as the spine of Guan Yu's crescent blade. He did not drink the wine Cao Cao personally poured, merely cupping his fists: 'Prime Minister, Guan Mou takes his leave.' The letter in his sleeve seeking his brother was at last unfolded.",
        "hook": "Two glorious triumphs earned a single pass of departure. Ahead lie five passes and six commanders—and not a single one has read that decree."
      },
      "loss": {
        "text": "Victory in the first clash lured you into rushing the second. As Wen Chou's armored cavalry swept over the river flats, only then did you remember Guo Jia's warning: 'Between two fronts, what must truly be read is Yunchang's heart.'",
        "clue": "Historical Record · Yan Liang fell to arrogance; Wen Chou triumphs by waiting for you to rush. Upon restart, abandon baggage first to throw their ranks into confusion: Wen Chou starting Supplies -200.",
        "clueFx": "raid"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "qianli": {
      "cast": [
        "guanyu",
        "kongxiu",
        "hanfu",
        "bianxi",
        "wangzhi",
        "qinqi",
        "zhangfei",
        "liubei",
        "caocao"
      ],
      "objective": "Escort the carriages through five fortified passes, unravel the distinct traps of Kong Xiu, Han Fu, Bian Xi, Wang Zhi, and Qin Qi, and preserve your final ounce of strength for the reunion at the Ancient City.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The gates of Xuchang receded behind; seals hung high, gold and silks untouched. Guan Yu brought only carriages and a blade unwilling to bear any more debts of sentiment."
        },
        {
          "speaker": "caocao",
          "text": "That day over boiling wine, Xuande hid his brilliance beneath the thunder. Today Yunchang departs to seek him—should I grant passage, or detain you for one final feast?"
        },
        {
          "speaker": "guanyu",
          "text": "The Prime Minister's benevolence is etched upon Guan Mou's heart; yet the oath sworn to my brother waits for me on the road ahead."
        },
        {
          "speaker": "liubei",
          "text": "Yunchang, let these words be as if we met face to face. Do not let thoughts of me burden your heart, nor treat me as a debt. Come if you can; in the Ancient City, someone waits for you."
        }
      ],
      "intros": {
        "kongxiu": [
          {
            "bio": "The locks of Dongling Pass acknowledge only official decrees; he guards his duty within boundaries narrower than life itself.",
            "quote": "Without official permits from the Prime Minister, not even Guan Yunchang may pass."
          }
        ],
        "hanfu": [
          {
            "bio": "He conceals his reverence behind a drawn bowstring, seeking to cling to old courtesies even as he prepares to loose an arrow.",
            "quote": "General Guan, Han respects your name, yet cannot abandon my post."
          }
        ],
        "bianxi": [
          {
            "bio": "The burning incense of Zhenguo Temple cannot mask the killing intent; his offered 'path of peace' leads straight into an ambush.",
            "quote": "Leave your blade before the Buddha and drink the cup; then, General, you may rest peacefully."
          }
        ],
        "wangzhi": [
          {
            "bio": "The guest quarters of Xingyang are suspiciously immaculate; every doorway was designed with the exact hour of its barricade in mind.",
            "quote": "The night is long and the road perilous—why not lodge until fire erupts—ah, until dawn breaks?"
          }
        ],
        "qinqi": [
          {
            "bio": "The final military post at the Yellow River ferry; he shuts out both past kinship and rising storm surges at the shoreline.",
            "quote": "What of passing four gates?! The Yellow River answers only to Qin's banner!"
          }
        ]
      },
      "map": [
        {
          "id": "two-kinds-of-gates",
          "node": 2,
          "title": "Luoyang · Gates Open and Veiled",
          "lines": [
            {
              "speaker": "guanyu",
              "text": "Kong Xiu demands paperwork, Han Fu hides cold arrows, while Bian Xi sets out wine before the Buddha. Different passes, yet each harbors its own pretext to bar our way."
            },
            {
              "speaker": "narrator",
              "text": "Not a word of haste came from the carriage. Guan Yu glanced back along the road, shifting his blade from his right hand to his left, solely to put the drivers at ease."
            }
          ],
          "choices": [
            {
              "id": "share-rations",
              "text": "Trade dry rations for local villagers' knowledge of the five passes",
              "detail": "Insight increased this round; remember the sentiments of folk along the way",
              "effects": {
                "keenEye": true,
                "fact": "qianli_guides"
              }
            },
            {
              "id": "guard-the-rear",
              "text": "Personally guard the rear, allowing the carriages to proceed ahead",
              "detail": "Defending commanders starting Morale -1; remember the rearguard pledge",
              "effects": {
                "sow": 1,
                "fact": "qianli_rearguard"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "qianli-kongxiu",
          "at": "start",
          "speaker": "kongxiu",
          "when": "round:1",
          "text": "Dongling Pass recognizes only the Prime Minister's official seal, not your past renown. Without official scrolls, even the Green Dragon Crescent Blade stays behind!"
        },
        {
          "id": "qianli-hanfu",
          "at": "start",
          "speaker": "hanfu",
          "when": "round:2",
          "text": "General Guan, Han respects your storied name, yet cannot abandon the duty of defending this pass. After this arrow flies, hold no grudge against me."
        },
        {
          "id": "qianli-bianxi",
          "at": "start",
          "speaker": "bianxi",
          "when": "round:3",
          "text": "The wine at Zhenguo Temple is warm. Leave your blade before the altar of the Buddha, and Bian shall show you a path of safe passage."
        },
        {
          "id": "qianli-wangzhi",
          "at": "start",
          "speaker": "wangzhi",
          "when": "round:4",
          "text": "The lodge at Xingyang is spotless and the night is long. Why does the General not stay, while I secure every door shut on your behalf?"
        },
        {
          "id": "qianli-qinqi",
          "at": "start",
          "speaker": "qinqi",
          "when": "round:5",
          "text": "The Yellow River lies before you. Whatever favors you enjoyed across four passes expire here; Qin Qi obeys only General Xiahou's command!"
        },
        {
          "id": "qianli-no-sixth-grave",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "Five passes bear five locks, yet the hearts of men need not be shackles. Where bloodshed can be bypassed, let us not carve a sixth grave into this road."
        },
        {
          "id": "qianli-drums",
          "at": "low",
          "speaker": "zhangfei",
          "when": "round:5",
          "text": "Second Brother, do you hear the war drums?! You need guard no pass for any master anymore—come back and strike this drum alongside me!"
        }
      ],
      "win": {
        "text": "As Qin Qi fell, the roar of the Yellow River drowned out the clash of steel. Guan Yu did not count the fifth severed head, only turning to steady the carriage. Beneath the gates of the Ancient City, Zhang Fei cast down his drumsticks and rushed forward to embrace the warhorse; when Liu Bei arrived, Guan Yu murmured only 'I have arrived late.' Three pairs of eyes gave the single answer: 'You have returned, and that is all that matters.'",
        "hook": "Before the drums of the Ancient City subsided, Yuan Shao and Cao Cao were locked in stalemate in the north. The next clash is no longer one man riding through five passes, but two colossal armies fighting for their breath."
      },
      "loss": {
        "text": "You triumphed in steel at one pass, yet left the carriages, chips, and appointed return behind in the dust. The hardest trial of a thousand leagues was never carving a straight bloody road, but arriving at the Ancient City with the right to say: 'All are safe.'",
        "clue": "Historical Record · Kong Xiu drains tokens, Han Fu snipes with hidden arrows, Bian Xi sets banquets, Wang Zhi borrows fire, Qin Qi blocks the ferry. Five passes share a single life—do not exhaust your travel toll at a single gate. On restart, Supplies +150.",
        "clueFx": "supply"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Turn Yuan Shao's vast war chest into hesitation, and uncover the true vulnerability of Wuchao before rising blinds consume Cao Cao's army.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "At Guandu, the grain ledgers were thinner than the battle reports. For every day Cao Cao crossed off, another strategist claiming a flawless plan appeared in Yuan Shao's tent."
        },
        {
          "speaker": "yuanshao",
          "text": "Mengde, we have known each other since youth. I know your temper well—and I know your grain reserves even better."
        },
        {
          "speaker": "caocao",
          "text": "Yunchang has departed for Xuande after all. I could keep Red Hare, but not his heart. Yet you, Benchu, have never even seen into the hearts of men.",
          "when": "page:qianli:yeshi"
        },
        {
          "speaker": "guojia",
          "text": "My Lord, of the ten victories over Yuan Shao I spoke of, I can guarantee only the first nine. The final victory you must seize with your own hands."
        },
        {
          "speaker": "tianfeng",
          "text": "If my lord triumphs, I die; if my lord fails, I die all the same. Here in Jizhou's prison, Yuanhao has already inscribed the fate of you all.",
          "when": "!seen:tianfeng"
        },
        {
          "speaker": "caocao",
          "text": "If Xu You arrives, invite him to sit. I may run out with only one shoe to greet him, but I cannot let my whole army see that only three days of grain remain."
        }
      ],
      "intros": {
        "yuanshao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "He heard that only Liu and Cao were deemed heroes over boiled plums, and burns to turn an old rivalry into an audit of the entire realm.",
            "quote": "Mengde, if we count heroes under heaven once more today, is there still room for Yuan Benchu?"
          },
          {
            "when": "seen:yuanshao",
            "bio": "Returning with thousands of troops and endless strategies, he still lacks a single man willing to sign his name to a decision.",
            "quote": "Last time the council reached no verdict. Whose counsel will you heed this time?"
          },
          {
            "bio": "Four generations of the Three Excellencies gifted him countless advisors, yet left him in a seat where he never has to admit fault first.",
            "quote": "The soldiers of Hebei are elite and our grain is boundless. Mengde, with what can you possibly stall?"
          }
        ]
      },
      "map": [
        {
          "id": "true-ledger",
          "node": 2,
          "title": "Guandu · True and False Ledgers",
          "lines": [
            {
              "speaker": "caocao",
              "text": "Xu You asks how much grain I have left. Tell the truth, and he may reveal Wuchao; lie, and he slips into the night."
            },
            {
              "speaker": "narrator",
              "text": "Outside the tent, Yuan Shao's battle drums thunder closer by the heartbeat. Cao Cao slides the true ledger toward you: what burns tonight is not merely grain, but Yuan Shao's habit of letting others decide his fate."
            }
          ],
          "choices": [
            {
              "id": "true-account",
              "text": "Trade the true grain count for a single truth from Xu You",
              "detail": "Insight improved this chapter; remember greeting him barefoot",
              "effects": {
                "keenEye": true,
                "fact": "guandu_true_account"
              }
            },
            {
              "id": "feint-wuchao",
              "text": "Feign attacks on multiple fronts, committing real force only to Wuchao",
              "detail": "Yuan Shao starting war chest -200; remember the raid on Wuchao",
              "effects": {
                "raid": true,
                "fact": "guandu_feint"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "guandu-open",
          "at": "start",
          "speaker": "yuanshao",
          "text": "With every play you calculate how many days you can survive. I need only wait. What Hebei fears least of all is holding one more council of war."
        },
        {
          "id": "guandu-old-friend",
          "at": "hand:2",
          "speaker": "caocao",
          "text": "Benchu, it is not that you do not know who to heed. You merely dread that when mistakes are made, there will be no one left to blame."
        },
        {
          "id": "guandu-unsigned",
          "at": "hand:3",
          "speaker": "narrator",
          "text": "Wuchao has not yet caught flame, yet Hebei's generals all wait for another to speak first. Out of a thousand strategies, suddenly not one bears a signature."
        },
        {
          "id": "guandu-low",
          "at": "low",
          "speaker": "yuanshao",
          "text": "Tian Feng, Ju Shou, Xu You... who among them betrayed me? Mengde, you tell me first!"
        }
      ],
      "win": {
        "text": "No fire reached Wuchao, yet the lamps in Yuan Shao's pavilion went out one by one. Cao Cao did not mock his old friend in triumph, but quietly closed the ledger filled with fictitious grain: \"Benchu, you lost because every man under you was waiting for someone else to concede first.\"",
        "hook": "The north draws near to unity, yet Liu Bei waits for falling snow at Xinye. Cao Cao commands a tent brimming with strategists, while Liu has yet to find a single soul willing to open a cottage door."
      },
      "loss": {
        "text": "The flames of Wuchao never rose. Yuan Shao remained seated behind mountains of war reports—every single one sensible, and not a single one his responsibility. Meanwhile, your grain truly dwindled day by day into nothingness.",
        "clue": "Historical Note: Yuan Shao's immense chip stack is not his strength, but his dread of personal accountability is his flaw. Force his hand before blinds climb; restart with a raid on Wuchao to reduce enemy war chest by 200.",
        "clueFx": "raid"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "sangu": {
      "cast": [
        "liubei",
        "guanyu",
        "zhangfei",
        "zhuge"
      ],
      "objective": "Give distinct purpose to each of the three knocks: return faithfully win or lose for the first two, and on the third, truly comprehend the realm the Sleeping Dragon envisions.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Twice already had Liu Bei trodden the road from Xinye to Longzhong. Zhang Fei called this third journey through wind and snow pointless torment, yet Guan Yu gently dusted his elder brother's calling card once more."
        },
        {
          "speaker": "zhangfei",
          "text": "Second Brother rode a thousand leagues to return—that showed me no distance is too great. But why must a mere scholar make us trek three times through the blizzard?",
          "when": "page:qianli:yeshi"
        },
        {
          "speaker": "liubei",
          "text": "If he is willing to leave his mountains for the common folk, what does it matter if Bei walks this road a few more times?"
        },
        {
          "speaker": "guanyu",
          "text": "Victory or defeat may be urged, but an open door cannot be rushed. Yide, put away your flint."
        }
      ],
      "intros": {
        "zhuge": [
          {
            "when": "page:bowang:yeshi",
            "bio": "After Bowang, he gauges not only your patience, but whether you can grant others room to claim glory.",
            "quote": "Since parting at the thatched cottage, you have learned when to yield. Are you still willing to wait today?"
          },
          {
            "when": "seen:zhuge",
            "bio": "He remembers the triumphs and defeats of the first two visits, yet refuses to use them as the key to unlock his gate.",
            "quote": "I witnessed your victories and defeats. Tell me, why do you return today?"
          },
          {
            "bio": "Behind closed doors he listened twice to the howling snow, waiting until the third visit to spread the realm before you on the table.",
            "quote": "Please enter, General. Before asking of the realm, can you still sit in silence?"
          }
        ]
      },
      "map": [
        {
          "id": "leave-the-door-unforced",
          "node": 1,
          "title": "Longzhong · An Unforced Door",
          "lines": [
            {
              "speaker": "liubei",
              "text": "If he still will not receive us today, I shall simply leave my calling card. Seeking virtuous counsel does not mean compelling the world to wake on Liu Bei's schedule."
            },
            {
              "speaker": "zhangfei",
              "text": "Then I shall wait outside! If I grow restless, I will count the snowflakes, not his faults!"
            },
            {
              "speaker": "guanyu",
              "text": "If you can wait with such grace, Brother's journey has already borne fruit."
            }
          ],
          "choices": [
            {
              "id": "disarm-and-wait",
              "text": "Order the troops to disarm and wait quietly outside the gate",
              "detail": "Sleeping Dragon starting morale -1; remember the courtesy of disarming",
              "effects": {
                "sow": 1,
                "fact": "sangu_disarmed_wait"
              }
            },
            {
              "id": "ask-the-sleep",
              "text": "Ask not of the realm, but inquire gently if the master slept well",
              "detail": "Insight improved this chapter; remember the patient inquiry",
              "effects": {
                "keenEye": true,
                "fact": "sangu_gentle_question"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "sangu-first-door",
          "at": "start",
          "speaker": "unknown",
          "text": "First visit: the master is away. You may win this hand, but you cannot compel his promise to meet.",
          "when": "round:1"
        },
        {
          "id": "sangu-first-return",
          "at": "hand:2",
          "speaker": "zhangfei",
          "text": "A loss is just a loss, Brother! We shall return tomorrow. Anything is better than playing sentry at his porch!",
          "when": "round:1"
        },
        {
          "id": "sangu-second-snow",
          "at": "start",
          "speaker": "unknown",
          "text": "Second visit: snow blankets the thatched cottage. You return once more—do you seek triumph, or do you seek the man?",
          "when": "round:2"
        },
        {
          "id": "sangu-second-intent",
          "at": "hand:2",
          "speaker": "liubei",
          "text": "Yunchang, Yide, step closer against the blizzard. The master may choose not to see us, but we must never lose the sincerity of our purpose.",
          "when": "round:2"
        },
        {
          "id": "sangu-third-reveal",
          "at": "start",
          "speaker": "zhuge",
          "text": "The servant's refusal and cold dismissals of the first two visits were tests to see if victory breeds arrogance and defeat breeds despair. You have come three times; the door now stands open.",
          "when": "round:3"
        },
        {
          "id": "sangu-third-world",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "Ask not of cards for now. Does the General seek Jing and Yi provinces, or a world where common folk no longer need to flee?",
          "when": "round:3"
        },
        {
          "id": "sangu-third-answer",
          "at": "hand:3",
          "speaker": "liubei",
          "text": "If the master remains in seclusion, Bei shall walk on alone. But if the master walks beside me, this path belongs to us both.",
          "when": "round:3"
        }
      ],
      "win": {
        "text": "Zhuge Liang placed Jingzhou and Yizhou beneath a single lamp, never designating who was master and who was guest. Liu Bei bowed deeply, Guan Yu sheathed his blade, and Zhang Fei pulled up a fourth stool for you: at last, this hand was not played to force anyone's surrender.",
        "hook": "With the Longzhong Plan sealed, Cao Cao's vanguard descends upon Xinye. The Sleeping Dragon's first blaze must convince the two brothers who doubted him most."
      },
      "loss": {
        "text": "On the third visit you finally beheld the Longzhong scroll, yet you still dwelled upon old scores from the first two rounds. Zhuge Liang folded his feather fan in silence: true patience is not pacing extra miles, but listening with an open heart even after the answer is revealed.",
        "clue": "Historical Note: Defeats in the first two visits still lead to another call; do not exhaust yourself clinging to early skirmishes. Save your strength for the third visit; restart with +150 war chest.",
        "clueFx": "supply"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Win the genuine respect of Guan Yu and Zhang Fei, while making Xiahou Dun believe every step of his pursuit is entirely his own idea.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The grass on Bowang Slope was dry and crisp. Zhuge Liang set his fire strikers beneath the map, charting for each warrior a retreat they were bound to endure in apparent defeat."
        },
        {
          "speaker": "zhangfei",
          "text": "At the cottage I yielded to my elder brother's courtesy. But today, if you only know how to tell me to run, I will not obey!",
          "when": "page:sangu:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "Yide, fall back until you hear Yunchang's bronze gong, then halt. Before the fire is struck, do not let our bait turn into genuine collapse."
        },
        {
          "speaker": "liubei",
          "text": "I invited the master down the mountain not to indulge your bravado, but to teach you how not to throw your lives away in vain."
        }
      ],
      "intros": {
        "xiahoudun": [
          {
            "when": "seen:xiahoudun",
            "bio": "He remembers the ambush of before, yet still refuses to believe that an aggressive charge could be manipulated like a puppet.",
            "quote": "On this same slope, I will not let you trick me twice."
          },
          {
            "bio": "His single eye gazes only forward, reading every enemy retreat as simple cowardice.",
            "quote": "If Xinye relies only on fire, let it scorch Liu Bei first!"
          }
        ]
      },
      "map": [
        {
          "id": "planned-retreat",
          "node": 1,
          "title": "Bowang Slope · How Far to Retreat",
          "lines": [
            {
              "speaker": "guanyu",
              "text": "The Military Advisor ordered each of us to yield specific paces, detailing even which tree to halt behind. It seems feigning defeat is far harder than winning."
            },
            {
              "speaker": "zhaoyun",
              "text": "My spear shall draw Xiahou Dun first. Only if he fixates on me will Yunchang and Yide's ambush spring true."
            },
            {
              "speaker": "zhangfei",
              "text": "Very well! I will make my loss look convincing. But whoever loses his nerve and truly runs, he will wash everyone's spears when we return!"
            }
          ],
          "choices": [
            {
              "id": "brothers-ambush",
              "text": "Coordinate Yunchang and Yide's ambush with bronze gongs",
              "detail": "Xiahou Dun starting morale -1; remember the brothers' ambush",
              "effects": {
                "sow": 1,
                "fact": "bowang_brothers_ambush"
              }
            },
            {
              "id": "zhaoyun-route",
              "text": "Chart every phase of the decoy retreat route alongside Zilong",
              "detail": "Insight improved this chapter; remember every stage of the ambush",
              "effects": {
                "keenEye": true,
                "fact": "bowang_zhaoyun_route"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "bowang-open",
          "at": "start",
          "speaker": "xiahoudun",
          "text": "Has Liu Xuande taken a new strategist only to learn how to flee? Then I shall pursue you until there is nowhere left to hide!"
        },
        {
          "id": "bowang-bait",
          "at": "hand:2",
          "speaker": "zhaoyun",
          "text": "Xiahou Dun has bitten onto my spear. Military Advisor, is the fire not yet ready?"
        },
        {
          "id": "bowang-wait",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "Have patience. Only while he believes he is winning will he plunge forward. The fire is meant to ignite the very instant he feels utterly invincible."
        },
        {
          "id": "bowang-low",
          "at": "low",
          "speaker": "zhangfei",
          "text": "Now I see! Falling back was not ceding the path to him, but squeezing his throat narrower with every step!"
        }
      ],
      "win": {
        "text": "Zhang Fei sheathed his serpent spear first, followed by Guan Yu's respectful clasp of fists. Zhuge Liang did not accept their bows as tribute, but quietly handed the scorched banner to Zilong. Liu Bei smiled: from this day forward, they fought not over who stood first, but who would be the last to retreat.",
        "hook": "The inferno of Bowang carved Xinye into Cao Cao's memory. The next storm gathers swifter: clutching baby Adou close to his chest, Zilong must carve his way out in reverse from a landscape bristling with pursuit."
      },
      "loss": {
        "text": "Xiahou Dun did not plunge into the flames because your retreat appeared too much like genuine panic: the ambushers rushed to rescue, and the decoy forgot to hold ground. Bowang Slope held only choking smoke, and not a single Cao soldier fell into the trap.",
        "clue": "Historical Note: Falling back is not fleeing; preserve your ambush lines and chips at each stage of feigned weakness. Restart with +150 war chest; do not let your lure become real collapse.",
        "clueFx": "supply"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Under the coordinated pursuit of Cao Cao, Xiahou Dun, and Zhang He at the same table, ensure Zhao Yun retrieves Adou and Zhang Fei holds Dangyang Bridge.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Amidst the dust of Changban, civilians, baggage wagons, and routed soldiers jammed into a single road. Zhao Yun rode against the tide, while Zhang Fei reined in his steed at the bridgehead."
        },
        {
          "speaker": "zhaoyun",
          "text": "My Lord, the lady and Adou are still behind. Yun shall return swiftly—if I do not return, let Yide hold the bridge in my stead."
        },
        {
          "speaker": "zhangfei",
          "text": "I won't hold it for you! Come back and guard it yourself!"
        },
        {
          "speaker": "wenpin",
          "text": "Zhao Zilong of Changshan... Wen Pin was ordered to intercept, yet cannot bear to drive you to the death. With this spear, Pin withholds three measures.",
          "when": "!seen:wenpin"
        },
        {
          "speaker": "caocao",
          "text": "Pass the order: Zhao Yun must be taken alive. As for the dark-faced general upon the bridge—I wish to see with my own eyes what gives him the audacity to halt my three armies."
        }
      ],
      "intros": {
        "wenpin": [
          {
            "when": "page:chibi:yeshi",
            "bio": "After Red Cliffs, he held the old domain of Jingzhou, acutely aware that whether to pursue or let go is inscribed forever in historical annals.",
            "quote": "Whether I should have pursued at Changban that year, Pin still cannot find an answer."
          },
          {
            "when": "seen:wenpin",
            "bio": "Remembering that half-held spear at Changban, this time his strikes offer no mercy.",
            "quote": "This time I will not let you pass. I owe no further apology to the family of my former lord."
          },
          {
            "bio": "A former Jingzhou general newly sworn to Cao Cao's camp, every inch of his spear wavers between duty to his new master and old loyalty.",
            "quote": "Pin is ordered to patrol this route. The road through Changban is closed."
          }
        ],
        "caocao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "Ever since the Green Plum Pavilion he remembers the clap of thunder; now he brings thousands of troops to force out the hidden answer.",
            "quote": "That day you hid behind the thunder. Today, I watch my legions force your hand."
          },
          {
            "when": "page:bowang:yeshi",
            "bio": "The fresh sting of defeat at Bowang made him more cautious, and far less willing to grant Liu Bei another chance to regroup.",
            "quote": "A single flame cannot win twice. Pursue!"
          },
          {
            "bio": "He seeks not merely Xuande's defeat, but to see what manner of man is worth turning back for in the face of a shattered army.",
            "quote": "Zhao Yun must be taken alive. As for the rest, spare none."
          }
        ],
        "xiahoudun": [
          {
            "when": "page:bowang:yeshi",
            "bio": "The fire of Bowang Slope still burns in his single eye; he views Zilong's wheeled horse as another ambush in disguise.",
            "quote": "Zhuge is not on the bridge today. Let us see who can save you now!"
          },
          {
            "when": "seen:xiahoudun",
            "bio": "Reunited with you, he still charges ahead, yet watches every overly convenient path of escape with suspicion.",
            "quote": "This time if you retreat, I will look behind you first."
          },
          {
            "bio": "The one-eyed general carries lingering fury from Bowang, quick to catch Zhao Yun and just as prone to overshooting.",
            "quote": "Before Changban, settle the debt of Bowang's flames!"
          }
        ],
        "zhanghe": [
          {
            "when": "seen:zhanghe",
            "bio": "He remembers how you broke through last time, this time marking every loop in the terrain onto his battle formation.",
            "quote": "The path you escaped by last time, I shall seal with my own hands."
          },
          {
            "bio": "He refrains from racing Xiahou Dun for glory, calculating only the paces remaining between Zhao Yun and Zhang Fei.",
            "quote": "One rescues a child, one guards the bridge. Keep them severed."
          }
        ]
      },
      "map": [
        {
          "id": "rescue-route",
          "node": 1,
          "title": "Dangyang · Against the Tide of Refugees",
          "lines": [
            {
              "speaker": "liubei",
              "text": "Zilong, Bei cannot order you to abandon the people to save my son. If you return only with Adou while leaving our folk under the blade, this battle is still my defeat."
            },
            {
              "speaker": "zhaoyun",
              "text": "Yun understands. Seven times in and seven times out is not boasting of valor, but returning each time knowing someone is still waiting."
            }
          ],
          "choices": [
            {
              "id": "people-first",
              "text": "Shield the civilians first, then trace the crying child",
              "detail": "Insight improved this chapter; remember righteous counter-flow",
              "effects": {
                "keenEye": true,
                "fact": "changban_people_first"
              }
            },
            {
              "id": "bridge-mark",
              "text": "Agree with Zilong to navigate back solely by Yide's war banner",
              "detail": "Pursuers starting morale -1; remember bridge rendezvous",
              "effects": {
                "sow": 1,
                "fact": "changban_bridge_mark"
              }
            }
          ]
        },
        {
          "id": "bridge-signal",
          "node": 2,
          "title": "Changban Slope · Three Orders for One Bridge",
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "If the dust behind the bridge thins, Cao Cao will suspect an ambush; if it rises too thick, the fleeing people lose their way. Zilong has not returned, and I cannot even break the bridge in good conscience!"
            },
            {
              "speaker": "zhaoyun",
              "text": "Yide, leave a single-rider gap. If three Cao generals pursue together, make them fight over who crosses first."
            }
          ],
          "choices": [
            {
              "id": "single-file-gap",
              "text": "Leave a narrow bridle path before cutting the bridge timbers",
              "detail": "Insight improved this chapter; remember the thread of life",
              "effects": {
                "keenEye": true,
                "fact": "changban_single_file"
              }
            },
            {
              "id": "split-banners",
              "text": "Shift three decoy banners to divide the three pursuing columns",
              "detail": "Cao Cao starting war chest -150; remember diversion strategy",
              "effects": {
                "oppChips": -150,
                "fact": "changban_split_pursuit"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "changban-open",
          "at": "start",
          "speaker": "caocao",
          "text": "Yuanrang pursues Zilong; Junyi cuts off the bridge. I want only Xuande driven into utter ruin.",
          "when": "multi"
        },
        {
          "id": "changban-zhaoyun",
          "at": "hand:2",
          "speaker": "zhaoyun",
          "text": "With Adou in my arms, my spear cannot fight merely for victory. Yide, does the bridge still stand?",
          "when": "multi"
        },
        {
          "id": "changban-zhanghe",
          "at": "hand:3",
          "speaker": "zhanghe",
          "text": "Every time he wheels his horse, he looks for the same person. Stop chasing his spear—chase the bridge he must return to!",
          "when": "multi"
        },
        {
          "id": "changban-xiahoudun",
          "at": "hand:4",
          "speaker": "xiahoudun",
          "text": "The fire of Bowang shall be repaid today with your lifeblood and your severed retreat!",
          "when": "multi"
        },
        {
          "id": "changban-low",
          "at": "low",
          "speaker": "zhangfei",
          "text": "As long as I stand upon this bridge, their hundred thousand troops must face me one by one!",
          "when": "multi"
        }
      ],
      "win": {
        "text": "Only when Zhao Yun placed the child safely into Liu Bei's arms did Zhang Fei finally agree to step down from the bridgehead. Cao Cao did not reprimand Xiahou Dun or Zhang He, but merely gazed at the ruined span: \"One dared to ride back alone, and the other refused to take a single step back. I was not defeated by their soldiers.\"",
        "hook": "The boats of Han Jin are near, and Cao Cao has etched this bridge deep into his mind. The next road turns toward Jiangdong: Liu Bei needs words powerful enough to move Sun Quan's banners."
      },
      "loss": {
        "text": "Zhao Yun found Adou, but lost his path back to the bridge; Zhang Fei's roar halted the vanguard, but could not check three separate pursuit columns closing in. Solitary bravery may triumph for a moment, but it cannot save everyone.",
        "clue": "Historical Note: Cao Cao desires a live capture, Yuanrang seeks vengeance, and Zhang He targets the bridge. Force them to crowd the same line of pursuit rather than cutting off three escapes; restart with enemy morale -1.",
        "clueFx": "sow"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "shezhan": {
      "cast": [
        "zhangzhao",
        "yufan",
        "luji",
        "zhuge",
        "sunquan"
      ],
      "objective": "Expose the false shelter of \"surrendering to Cao to preserve Jiangdong,\" and force Sun Quan to hear the unspoken terror within his courtiers' hearts.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Four tables stood in the council hall; three were piled high with Confucian classics, while yours bore only a single feather fan. Zhang Zhao pressed immediately on how many times Liu Bei had fled, while Yu Fan had already framed the insult of \"homeless wanderer\" upon his lips."
        },
        {
          "speaker": "zhangzhao",
          "text": "Lord Cao commands a host of a million; with what does the gentleman intend to resist him? Do not mistake your Longzhong dialogue for an amulet of salvation."
        },
        {
          "speaker": "sunquan",
          "text": "Sir, what I wish to hear is not who has memorized the classics best, but who dares to shoulder Jiangdong's tomorrow."
        },
        {
          "speaker": "zhuge",
          "text": "At Longzhong you inquired of the entire realm; today they ask merely of winning and losing. Do not confuse the two."
        }
      ],
      "intros": {
        "zhangzhao": [
          {
            "when": "seen:zhangzhao",
            "bio": "Remembering how you disassembled his arguments last time, he arranges every ancient classic into a defensive bulwark.",
            "quote": "Ancient precedents can be cited again. Sir, can a record of repeated defeats be answered again?"
          },
          {
            "bio": "The literary cornerstone of Jiangdong, building fortresses from classic texts and treating capitulation as the final sanctuary.",
            "quote": "Set military matters aside. Is it not fact that Liu Yuzhou has suffered defeat after defeat?"
          }
        ],
        "yufan": [
          {
            "bio": "His words waste no polite circles, striking directly at the rawest wounds of his opponents.",
            "quote": "Does a refugee fleeing disaster dare lecture us on salvation?"
          }
        ],
        "luji": [
          {
            "bio": "Framing legitimacy with pristine dignity, yet hiding in his sleeve a surrender petition he dares not bear alone.",
            "quote": "Before resisting Cao Cao, answer me first: what is a loyal servant of the Han?"
          }
        ]
      },
      "map": [
        {
          "id": "three-questions",
          "node": 1,
          "title": "Guest Lodge · Three Locked Questions",
          "lines": [
            {
              "speaker": "yufan",
              "text": "Master Zhang questions strength; Master Lu questions legitimacy. I ask only this: what right has a routed fugitive from Xiakou to speak of saving others?"
            },
            {
              "speaker": "luji",
              "text": "Chancellor Cao commands the Emperor to discipline unruly vassals. Are you defying Cao's army, or defying the Imperial Court itself?"
            },
            {
              "speaker": "you",
              "text": "All three questions share a single lock: to force my confession that we are already vanquished."
            }
          ],
          "choices": [
            {
              "id": "ask-burden",
              "text": "Demand: \"Who shoulders Jiangdong after surrender?\"",
              "detail": "Insight improved; remember the shared terror",
              "effects": {
                "keenEye": true,
                "fact": "shezhan_common_fear"
              }
            },
            {
              "id": "sign-surrender",
              "text": "Challenge each peace advocate to sign their own name to surrender",
              "detail": "Courtiers starting morale -1; remember individual signatures",
              "effects": {
                "sow": 1,
                "fact": "shezhan_signed"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "shezhan-open-multi",
          "at": "start",
          "speaker": "zhangzhao",
          "when": "multi",
          "text": "The three of us shall question you in turn. If you falter on a single word, speak no more of resisting Cao Cao."
        },
        {
          "id": "shezhan-open-single",
          "at": "start",
          "speaker": "zhangzhao",
          "when": "single",
          "text": "Cao Cao's might is recorded in the annals of history. Does the gentleman intend to gamble our lord's life merely to build his own reputation?"
        },
        {
          "id": "shezhan-defeats",
          "at": "hand:2",
          "speaker": "yufan",
          "text": "Do not dodge the issue! Is it not true that Liu Yuzhou suffered defeat after defeat?"
        },
        {
          "id": "shezhan-name",
          "at": "hand:3",
          "speaker": "luji",
          "text": "The House of Han totters on the brink; true wisdom lies in recognizing the times. You disregard legitimacy entirely—how dare you speak of restoration?"
        },
        {
          "id": "shezhan-low-fear",
          "at": "low",
          "speaker": "you",
          "when": "fact:shezhan_common_fear",
          "text": "You claim Jiangdong cannot be gambled with, but in truth, you simply fear leaving your own names upon the page of resistance."
        },
        {
          "id": "shezhan-low-sign",
          "at": "low",
          "speaker": "zhuge",
          "when": "fact:shezhan_signed",
          "text": "Not one of them dares write the word \"surrender\" alone, yet together they presume to sign away the lives of millions. Zibu, to whom does this Jiangdong belong?"
        }
      ],
      "win": {
        "text": "Sun Quan turned face down the character for \"Surrender\" upon his desk and ordered the battle maps brought forward. Zhang Zhao asked no more about the size of Cao Cao's army, but inquired how many battle-ready vessels Jiangdong could muster. Dissenting whispers remained, but none dared present surrender as a cost-free escape again.",
        "hook": "Lu Su has readied vessels by the riverbank. Zhuge Liang still requires one hundred thousand arrows, and Cao Cao's quivers are far more plentiful than Jiangdong's patience."
      },
      "loss": {
        "text": "You answered every classical allusion with precision, yet failed to expose their inner dread. Sun Quan heard only a loud salon debate, not a soul willing to shoulder the consequences of standing firm.",
        "clue": "Historical Note: The scholars take turns to wear you down through attrition; dismantle their shared premise first. Restart with improved insight.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "caochuan": {
      "cast": [
        "zhuge",
        "lusu",
        "caocao",
        "caizhong"
      ],
      "objective": "Before the river mist clears, compel Cao Cao's army to loose their arrows of their own accord, transforming his paranoia into military supplies for Jiangdong.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "At the third night watch, Lu Su touched the straw mannequins lined along the gunwales, finally understanding that what Zhuge Liang sought to borrow was not merely arrows, but Cao Cao's dread of marching into the unknown."
        },
        {
          "speaker": "lusu",
          "text": "What if the fog suddenly scatters? Zijing can risk his life beside you, but Jiangdong cannot be dragged into an early grave!"
        },
        {
          "speaker": "caizhong",
          "text": "Rest assured, Chancellor! My brother and I know Jiangdong's waterways like our own hands—in this heavy fog, they would never dare launch a single boat!",
          "when": "!seen:caizhong"
        },
        {
          "speaker": "zhuge",
          "text": "Since we urged Jiangdong to wage war in the hall, our arrows must not remain mere figures in a ledger. Zijing, this voyage fulfills a vow; it is not a gamble of despair."
        },
        {
          "speaker": "you",
          "text": "The mist only conceals the hulls. What Cao Cao sees through the haze is for us to orchestrate."
        }
      ],
      "intros": {
        "caizhong": [
          {
            "when": "seen:caizhong",
            "bio": "The fake defectors have donned a new disguise, yet their story remains half a beat out of sync.",
            "quote": "T-this time my brother couldn't make it. I'll handle the intelligence myself!"
          },
          {
            "bio": "A petty kinsman of Lady Cai; every word of his surrender letter was rehearsed, except for coordinating with each other.",
            "quote": "Defector Cai Zhong stands ready to serve the Prime Minister like a dog or horse!"
          }
        ],
        "caocao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "Having observed your hidden edge at the Green Plum Pavilion, he trusts river probes least of all.",
            "quote": "Old friend of the plum wine, have you learned to veil your blade within the river mist?"
          },
          {
            "bio": "Within his northern water fortress, he hears every drumbeat as an unfinished deception.",
            "quote": "Boats appearing in night mist must conceal deep treachery. Hold position—do not sortie!"
          }
        ]
      },
      "map": [
        {
          "id": "fog-cadence",
          "node": 1,
          "title": "River Mist · Leaving Space for the Foe",
          "lines": [
            {
              "speaker": "lusu",
              "text": "Quivers, boats, watches are all arranged—all hinges on whether Cao Cao takes the bait. What if he realizes they are straw dummies?"
            },
            {
              "speaker": "zhuge",
              "text": "Therefore we cannot leave him entirely blind. We must make him feel he sees further than we do."
            },
            {
              "speaker": "you",
              "text": "While mist veils the ships, our war drums paint the phantoms of an ambush in his mind."
            }
          ],
          "choices": [
            {
              "id": "full-drums",
              "text": "Beat drums across twenty ships at once, feigning the main fleet",
              "detail": "Cao Cao starting morale -1; remember drum cadence",
              "effects": {
                "sow": 1,
                "fact": "caochuan_full_drums"
              }
            },
            {
              "id": "answering-drums",
              "text": "Echo drums between bow and stern, leaving hollow vessels in between",
              "detail": "Insight improved; remember leaving space in mist",
              "effects": {
                "keenEye": true,
                "fact": "caochuan_empty_space"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "caochuan-open",
          "at": "start",
          "speaker": "caocao",
          "text": "Keep the fleet moored; archers to the front! I will see how many men lurk within this fog!"
        },
        {
          "id": "caochuan-drums",
          "at": "hand:2",
          "speaker": "zhuge",
          "when": "fact:caochuan_full_drums",
          "text": "Now quiet half the drums. Hearing our thunder fade, Cao Cao will conclude our trap is springing shut."
        },
        {
          "id": "caochuan-space",
          "at": "hand:2",
          "speaker": "lusu",
          "when": "fact:caochuan_empty_space",
          "text": "The empty hulls have turned outward. Cao Cao looks away from the loudest beats, obsessing over the quietest shadows."
        },
        {
          "id": "caochuan-more-arrows",
          "at": "hand:3",
          "speaker": "caocao",
          "text": "Their drums falter! Do not pursue—pour on more arrows! If they withdraw, it is surely a trap!"
        },
        {
          "id": "caochuan-low",
          "at": "low",
          "speaker": "you",
          "text": "These arrows were never stolen; they were prepared by Cao Cao for the phantoms in his own mind."
        }
      ],
      "win": {
        "text": "As the mist cleared, every straw mannequin bristled with arrows. Lu Su ceased asking what might happen if the fog lifted too early, occupied with tallying the haul; Zhuge Liang plucked a single arrowpoint and tucked it into his sleeve. The arrows were secured; next, they must borrow fire.",
        "hook": "The arrows are ready, yet the southeast wind has not arrived. Zhou Yu awaits at Red Cliffs, watching for any flicker of hesitation from Zhuge Liang."
      },
      "loss": {
        "text": "Before the mist parted, Cao Cao halted his archers. You treated suspicion as an immutable law, forgetting that a paranoid man excels above all at changing his mind. Lu Su could only steer your empty ships back into the gloom.",
        "clue": "Historical Note: Cao Cao adjusts his assessment of reality based on drumbeats; do not rely on a single deception to the end. Restart with improved insight.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "chibi": {
      "cast": [
        "caocao",
        "zhouyu",
        "zhuge"
      ],
      "objective": "In a three-sided contest where each harbors their own vision of victory, bring the fire ships, the southeast wind, and Cao Cao's suspicion into alignment at the exact same moment.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Cao Cao's chained flotilla stretched across the north, Zhou Yu's fire ships waited in the south, and Zhuge Liang's Seven Star Altar stood between them. Three powers shared the table, yet no two pursued the same victory."
        },
        {
          "speaker": "caocao",
          "text": "My chained vessels are steady as dry earth. I would hear what Dongwu can possibly bring to burn them!"
        },
        {
          "speaker": "zhouyu",
          "text": "If Kongming cannot summon the wind, the fire attack dies here. If you defeat only him, Cao Cao still crosses the river."
        },
        {
          "speaker": "zhuge",
          "text": "Therefore this table holds no allies—only the question of who first perceives the wind already stirring within their sleeve."
        }
      ],
      "intros": {
        "caocao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "From boiled plums to Red Cliffs, he still seeks to force your concealed answers onto the table.",
            "quote": "Boiled wine could mask the thunder, but where will you hide from this inferno today?"
          },
          {
            "bio": "With eight hundred thousand men chained across the river, he aims to ensure the North never needs to fear water battles again.",
            "quote": "The ships are chained; this river is now my Central Plains!"
          }
        ],
        "zhouyu": [
          {
            "when": "page:caochuan:yeshi",
            "bio": "Having seen the hundred thousand arrows arrive as promised, he refuses all the more to let Kongming claim Red Cliffs alone.",
            "quote": "You borrowed the arrows. But the fire answers to me!"
          },
          {
            "bio": "His fire attack is prepared down to the last detail, yet he refuses to admit that he, too, is waiting on the wind.",
            "quote": "When a tune errs, Zhou Yu turns his head; but what if the wind itself errs?"
          }
        ],
        "zhuge": [
          {
            "when": "seen:zhuge",
            "bio": "Remembering the vision of Longzhong, he recalls how you turned a quiet conversation into a deciding conflict.",
            "quote": "Today, speak not of who triumphs first—ask only when the wind arises."
          },
          {
            "bio": "Atop the Seven Star Altar, he speaks of nature's most elusive force as though it already rested in his sleeve.",
            "quote": "The wind shall arrive. Whether men possess the patience to wait is another matter."
          }
        ]
      },
      "map": [
        {
          "id": "three-fuses",
          "node": 1,
          "title": "Wulin · Three Fuses",
          "lines": [
            {
              "speaker": "zhouyu",
              "text": "The fire ships can burn but once. If Kongming leaves the table first, the wind may never blow; if Mengde leaves first, his main fleet retreats intact."
            },
            {
              "speaker": "caocao",
              "text": "You both wait for the wind. But I have chained my fleet into an iron shield—even if the wind comes, it will merely illuminate a few more lanterns."
            },
            {
              "speaker": "you",
              "text": "What we must win is not three separate piles of chips, but ensuring no player can leave the table early."
            }
          ],
          "choices": [
            {
              "id": "loose-chain",
              "text": "Secretly unfasten a single section of the iron chain",
              "detail": "Cao Cao starting war chest -200; remember unchained link",
              "effects": {
                "raid": true,
                "fact": "chibi_loose_chain"
              }
            },
            {
              "id": "empty-jars",
              "text": "Replace fire oil with empty jars to feign weakness",
              "detail": "Insight improved; remember empty jars concealing true fire",
              "effects": {
                "keenEye": true,
                "fact": "chibi_empty_jars"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "chibi-open",
          "at": "start",
          "speaker": "caocao",
          "when": "multi",
          "text": "One borrowing the wind, one playing with fire, and one nameless wanderer. Excellent—I shall sweep you all from the board at once!"
        },
        {
          "id": "chibi-read",
          "at": "hand:2",
          "speaker": "zhouyu",
          "when": "multi",
          "text": "Do you strike Kongming first, or test me? For every player you best, the other is reading your hand."
        },
        {
          "id": "chibi-chain",
          "at": "hand:3",
          "speaker": "zhuge",
          "when": "fact:chibi_loose_chain",
          "text": "The severed chain made him believe his ships could scatter safely. Yet before orders reach the decks, fire has already made the decision for him."
        },
        {
          "id": "chibi-jars",
          "at": "hand:3",
          "speaker": "zhuge",
          "when": "fact:chibi_empty_jars",
          "text": "The empty jars were not lack of oil, but to convince Gongjin that you held no further moves. Now—push forward the real oil!"
        },
        {
          "id": "chibi-low",
          "at": "low",
          "speaker": "you",
          "when": "multi",
          "text": "Cao Cao fears ambush, Zhou Yu fears irrelevance, and Kongming fears the wind missing its hour. The gap where the fire ignites lies precisely between those three fears."
        }
      ],
      "win": {
        "text": "Just as the last opponent departed the table, the southeast wind swept past the corner of the banner. Fire ships crashed into the chained fleet on the roaring gale. Zhou Yu did not meet your gaze, but Zhuge Liang had already folded his fan—both understood that what you had held onto was not three separate fortunes, but that single, indispensable moment.",
        "hook": "Cao Cao flees toward Huarong Path. Guan Yu's blade awaits in the marsh, and Zhuge Liang murmurs that tonight, a debt of honor must finally be weighed."
      },
      "loss": {
        "text": "If you eliminate Zhou Yu first, Cao Cao pulls back his fleet; if you suppress Cao Cao first, Zhuge Liang stops waiting for the wind. Red Cliffs was not lost to a single card, but to the reality that all three powers never truly entered the fray together.",
        "clue": "Historical Note: Multi-sided battles read each other's bets; eliminating one too early gives another the chance to strike sail. Restart with improved insight.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "huarong": {
      "cast": [
        "caocao",
        "guanyu",
        "zhuge"
      ],
      "objective": "After conquering the desperate road, you must still make the choice with your own hands: let old debts fall with the blade, or let righteousness become a debt that Mai Castle must repay.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Cao Cao's warhorse was mired deep in mud, with barely a dozen riders at his back. Guan Yu held his Green Dragon Crescent Blade athwart his saddle, looking neither at you nor at the open trail leading to Jiangling."
        },
        {
          "speaker": "caocao",
          "text": "The fires of Red Cliffs burned my chained fleet, but they cannot burn away old debts. Yunchang, does this table hold only you and me today?"
        },
        {
          "speaker": "guanyu",
          "text": "The military oath is here, and past generosity is here as well. Guan asks but one thing: for whose sake do you watch this descending blade?"
        },
        {
          "speaker": "zhuge",
          "text": "Do not choose for him. What you won was merely the right for the choice to truly exist."
        }
      ],
      "intros": {
        "caocao": [
          {
            "when": "page:zhujiu:yeshi",
            "bio": "From boiled wine to Red Cliffs, at the end of every desperate path he still knows how to speak of old ties.",
            "quote": "Boiled wine, burning ships... You and I have reached the narrow pass once more."
          },
          {
            "bio": "His broken army can no longer shield him, so he rallies bygone kindness into his personal bodyguard.",
            "quote": "Today I speak not of the empire, but of old friends."
          }
        ],
        "guanyu": [
          {
            "when": "seen:guanyu",
            "bio": "From Hulao Pass to Huarong, his single word has always weighed heavier than his blade, and proved far harder to put down.",
            "quote": "You already know how Guan strikes with his blade. Today, see why he sheathes it."
          },
          {
            "bio": "The death-warrant oath rests in his breast, old debts in his heart; he refuses to let anyone sign his name for him.",
            "quote": "Guan is here. Neither loyalty nor righteousness may be borrowed in another's name."
          }
        ]
      },
      "map": [
        {
          "id": "two-debts",
          "node": 1,
          "title": "Huarong · Two Debts Beneath the Blade",
          "lines": [
            {
              "speaker": "caocao",
              "text": "If Yunchang slays me, he upholds military law; if he spares me, he repays old kindness. But for which debt would you have him bear the guilt?"
            },
            {
              "speaker": "guanyu",
              "text": "He speaks of survival as two distinct debts. To your ears, which does it resemble?"
            },
            {
              "speaker": "you",
              "text": "Neither. The blade rests in the hands of the living—dead sentiments must not dictate the choice of today."
            }
          ],
          "choices": [
            {
              "id": "weigh-oath",
              "text": "Unroll the military oath and recite the law of the army",
              "detail": "Cao Cao starting morale -1; remember military oath",
              "effects": {
                "sow": 1,
                "fact": "huarong_oath"
              }
            },
            {
              "id": "weigh-debt",
              "text": "Put away the military oath and listen only to bygone kindness",
              "detail": "Insight improved; remember bygone debt",
              "effects": {
                "keenEye": true,
                "fact": "huarong_debt"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "huarong-open",
          "at": "start",
          "speaker": "caocao",
          "text": "At Red Cliffs you knew how to keep all three powers at the table. Now that only you and I remain, has it become harder instead?"
        },
        {
          "id": "huarong-oath",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "fact:huarong_oath",
          "text": "The oath was mine to pledge, and the penalty mine to bear. If you push only military law upon me, you are still letting others strike the blow for you."
        },
        {
          "id": "huarong-debt",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "fact:huarong_debt",
          "text": "Kindness is what Guan owes; life is what the three armies fought to take. Do not use the word 'righteousness' to wipe everyone's debts clean."
        },
        {
          "id": "huarong-unwritten",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "I foresaw that Cao Cao's destiny had not run dry, yet I could not foresee how you would choose. On this page, mortal will finally prevails over Heaven."
        },
        {
          "id": "huarong-low",
          "at": "low",
          "speaker": "you",
          "text": "He speaks no longer of the empire, but only of past grace. Even at the end of the road, Cao Cao still knows what serves as bargaining chips."
        }
      ],
      "win": {
        "text": "Cao Cao's chips were entirely spent, and the muddy pass grew so silent that one could hear the rattle of the blade's ring. Guan Yu turned his gaze to you at last. Ahead, the path was clear; behind, the military oath remained. Winning the hand did not write the ending for you—it merely ensured that whether the blade fell or stayed, it remained your own deliberate choice.",
        "hook": "Whether that blade fell or was stayed, its echo will travel down the river from Jingzhou to Mai Castle. Winter is still far off, but the account has already been inscribed."
      },
      "loss": {
        "text": "Cao Cao walked out from the mud once more. You were so busy calculating loyalty and righteousness for Guan Yu that you forgot Cao Cao's greatest gift is making others fight over keeping him alive.",
        "clue": "Historical Note: At the end of his rope, Cao Cao will alternate between pushing military oaths and past debts; restart with improved insight. The final choice remains yours to make.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "nanjun": {
      "cast": [
        "zhouyu",
        "caoren",
        "chengpu",
        "ganning",
        "lusu"
      ],
      "objective": "Read Cao Ren across the walls of Jiangling, and ensure Zhou Yu's arrow wound does not burst open a second time.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The fires of Red Cliffs had barely cooled, yet the banner of Nanjun remained firmly in Cao Ren's grip. Zhou Yu stood by the river in full armor, his arrow wound unhealed, while Cao Ren beat mocking war drums atop the ramparts."
        },
        {
          "speaker": "zhouyu",
          "text": "Cao Zixiao has defended cities for ten tireless years. To take Nanjun, one must first overcome his stubborn resolve never to step beyond the gates."
        },
        {
          "speaker": "caoren",
          "text": "The Commander's arrow wound has not healed, has it? This drum of mine beats solely for you! Lose your temper, and these gates will swing open just for you!",
          "when": "!seen:caoren"
        },
        {
          "speaker": "ganning",
          "text": "Commander, leave Yiling to Xingba! Wherever our bells chime, Wu's army advances another step!"
        },
        {
          "speaker": "chengpu",
          "text": "Gongjin, this old soldier stands beside you to anchor the line. With an arrow wound, the deadliest foe is not the iron tip, but your own fury."
        }
      ],
      "intros": {
        "caoren": [
          {
            "when": "seen:caoren",
            "bio": "Remembering how you shielded Zhou Yu from rage, this time he does not even bother beating the drum.",
            "quote": "Back again? This time I won't even waste the energy trying to provoke you."
          },
          {
            "bio": "He turned defending fortresses into a master craft: never acting on spite, never gambling on chance, and never mourning a single brick.",
            "quote": "Every single brick of Jiangling has been counted. Come, if you dare."
          }
        ],
        "caohong": [
          {
            "bio": "Holding the Yiling path for his brother, he believes in only one truth: his lord's retreat must outlast his own life.",
            "quote": "This pass belongs to the Cao clan! If you wish to cross, leave your toll behind!"
          }
        ]
      },
      "map": [
        {
          "id": "outside-mock",
          "node": 1,
          "title": "Jiangling · Drums Beneath the Walls",
          "lines": [
            {
              "speaker": "zhouyu",
              "text": "Daily he beats his drums to mock my wound, daring me to march out for decisive battle. If I accept, the wound ruptures; if I decline, morale collapses."
            },
            {
              "speaker": "lusu",
              "text": "Why not let the Commander count every drumbeat directed at you as the day he must finally march out?"
            },
            {
              "speaker": "you",
              "text": "The drum rhythm belongs to his clock, not yours. Let his drums count his own garrison shifts for you."
            }
          ],
          "choices": [
            {
              "id": "count-drums",
              "text": "Chart drum cadences and battlement watch shifts",
              "detail": "Insight improved this chapter; remember shift intervals",
              "effects": {
                "keenEye": true,
                "fact": "nanjun_count"
              }
            },
            {
              "id": "yiling-feint",
              "text": "Feign an assault on Yiling to split their force",
              "detail": "Cao army starting war chest -200; remember divided force",
              "effects": {
                "raid": true,
                "fact": "nanjun_feint"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "nanjun-open",
          "at": "start",
          "speaker": "caoren",
          "text": "Master Zhou! Has your arrow wound improved? My drums beat even louder today!"
        },
        {
          "id": "nanjun-anger",
          "at": "hand:2",
          "speaker": "zhouyu",
          "text": "He beats his drum for me, so I tally my fury onto his bill. When his third shift of guards rotates—"
        },
        {
          "id": "nanjun-gap",
          "at": "hand:3",
          "speaker": "ganning",
          "when": "fact:nanjun_feint",
          "text": "The bells of Yiling are ringing! Cao Hong has split his troops, and Jiangling's walls have grown one layer thinner!"
        },
        {
          "id": "nanjun-low",
          "at": "low",
          "speaker": "chengpu",
          "text": "The Commander's face has gone pale. This old soldier holds the line for you—win this battle before tending to your wound!"
        }
      ],
      "win": {
        "text": "On the night Cao Ren abandoned the citadel and fled west, Zhou Yu pressed his hand against his arrow wound and ascended Jiangling's ramparts. Refusing all cheers, he ordered brought forward the drum that had mocked him from the walls, struck it three times with his own hand, and sent it back to Cao Ren: \"Give it my thanks—it preserved my patience.\" Nanjun at last belonged to the House of Sun.",
        "hook": "Nanjun was secured, yet the account book of Jingzhou had only turned its very first page. In the north, iron hooves charged toward Tong Pass with unquenchable vengeance."
      },
      "loss": {
        "text": "When the drum echoed for the third time, Zhou Yu leaped into his saddle spear in hand, the wound tearing open through his armor plates. The moment you rushed to support him, Jiangling's iron gates groaned wide—the exact opportunity Cao Ren had awaited all along.",
        "clue": "Historical Note: Cao Ren's drums are emotional shackles; restart reduces his feigned flaws. Count his garrison shifts, not his provocations.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "sanqi": {
      "cast": [
        "zhouyu",
        "zhuge",
        "lusu",
        "liubei"
      ],
      "objective": "Refrain from using a third provocation to kill; instead, let Zhou Yu perceive his own path forward within his most unbearable hand.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "At Baqiu the herbal brew had boiled black, yet Zhou Yu pressed the third challenge letter beneath his zither. The first two insults had made him bleed; the third provoked only a hollow smile."
        },
        {
          "speaker": "zhouyu",
          "text": "Sharing the board at Red Cliffs, you turned the wind into a fuse. What do you intend to ignite my arrow wound with today?"
        },
        {
          "speaker": "lusu",
          "text": "Kongming's letter contained only four words: 'Why must this be?' After reading it, Gongjin wrote your name three times in silence."
        },
        {
          "speaker": "zhuge",
          "text": "If the goal were merely to defeat him, one more taunt would suffice. But if we wish him to live, we must grant him one departure without losing dignity."
        }
      ],
      "intros": {
        "zhouyu": [
          {
            "when": "page:chibi:yeshi",
            "bio": "The fire of Red Cliffs triumphed over Cao Cao, but also set ablaze his refusal to stand beneath any other mortal under heaven.",
            "quote": "On the river you seized that singular moment. Here at Baqiu, do you wait for me to unravel first?"
          },
          {
            "bio": "His arrow wound unhealed, he hears every hesitation as an out-of-tune chord.",
            "quote": "The third letter has arrived? Read it! Let us see how many more times I can be provoked!"
          }
        ]
      },
      "map": [
        {
          "id": "third-letter",
          "node": 1,
          "title": "Chaisang · The Third Letter",
          "lines": [
            {
              "speaker": "lusu",
              "text": "He is convinced that every step you take is laughing at him. If you send medicine, he suspects poison; if you withdraw, he searches for ambushes."
            },
            {
              "speaker": "zhuge",
              "text": "Therefore, in this third letter, I offer not a single word of argument. I wrote only how he could have defeated me at Red Cliffs."
            },
            {
              "speaker": "you",
              "text": "Returning the path of victory to an opponent is far harder than heaping accusations upon him."
            }
          ],
          "choices": [
            {
              "id": "write-way-out",
              "text": "Inscribe his true winning lines at the letter's end",
              "detail": "Insight improved; remember the third solution",
              "effects": {
                "keenEye": true,
                "fact": "sanqi_way_out"
              }
            },
            {
              "id": "remove-taunts",
              "text": "Ask Lu Su to strip away every provocative phrase",
              "detail": "Zhou Yu starting morale -1; remember forbearance",
              "effects": {
                "sow": 1,
                "fact": "sanqi_no_taunt"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "sanqi-open",
          "at": "start",
          "speaker": "zhouyu",
          "text": "You come again bearing Kongming's letter. Speak—which fortress is it this time, and which repetition of 'Since Heaven gave birth to Yu'?"
        },
        {
          "id": "sanqi-way-out",
          "at": "hand:2",
          "speaker": "zhuge",
          "when": "fact:sanqi_way_out",
          "text": "Look at that hand where he discarded his best cards. He was not yielding to you; he was compelling himself to admit another round remains."
        },
        {
          "id": "sanqi-no-taunt",
          "at": "hand:2",
          "speaker": "lusu",
          "when": "fact:sanqi_no_taunt",
          "text": "He waits for your taunt, so simply state your cards. When no one catches his fury, the fire can only burn back upon itself."
        },
        {
          "id": "sanqi-silence",
          "at": "hand:3",
          "speaker": "zhouyu",
          "text": "Why do you not laugh? If I have nowhere left to direct my wrath, do I become nothing more than a snapped string upon your zither?"
        },
        {
          "id": "sanqi-low",
          "at": "low",
          "speaker": "you",
          "text": "The third anger does not need to be an insult. Show him that defeat does not have to become a laughingstock."
        }
      ],
      "win": {
        "text": "Zhou Yu did not cry out 'Since Heaven gave birth to Yu' again. He placed the letter detailing his winning lines upon his zither, plucked a single discordant note, and chuckled softly to himself. Only upon hearing that laugh did Lu Su dare beckon the physician into the tent.",
        "hook": "Master Zhou departs Baqiu for a time, yet the mountain path into Shu closes around Pang Tong. At the name 'Fallen Phoenix Slope,' Zhuge Liang stared in brooding contemplation for a long time."
      },
      "loss": {
        "text": "You treated his loss of composure as the only gateway to victory; the third provocation succeeded, but closed the door forever on all future matches. The zither did not break, yet the listeners had dispersed into the mist.",
        "clue": "Historical Note: Zhou Yu waits for your mockery to launch a counterstrike; absorb his fury with restraint. Restart with improved insight.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "tongguan": {
      "cast": [
        "machao",
        "xuchu",
        "caocao",
        "jiaxu",
        "xuhuang"
      ],
      "objective": "Shield Cao Cao amidst the fury of the Xiliang iron cavalry, and give Ma Chao's vengeance an outlet that can bear the light of day.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The wind of Tong Pass swirled with grit. Ma Chao's white robe wheeled before the lines like an unyielding banner. Within Cao Cao's central pavilion, Jia Xu slowly ground ink."
        },
        {
          "speaker": "machao",
          "text": "Cao Ah-man! Murderer of my father, usurper of Heaven! If I do not hack you to pieces at Tong Pass today, Ma Chao is no true man!"
        },
        {
          "speaker": "caocao",
          "text": "If this horse-cub does not die, I shall have no ground left for my burial! Gentlemen, who will turn aside this whirlwind for me?"
        },
        {
          "speaker": "xuchu",
          "text": "My Lord, step down and fall back! The Tiger Fool is here—come, horse-cub, face me!"
        },
        {
          "speaker": "jiaxu",
          "text": "Do not panic, My Lord. Xiliang has numbers, but their hearts are divided. Wenhe's ink moves slower than Xu Chu's blade, yet cuts far deeper.",
          "when": "!seen:jiaxu"
        }
      ],
      "intros": {
        "machao": [
          {
            "when": "seen:machao",
            "bio": "Remembering the ice and fire of the Wei River, his hatred has not cooled, and his spear weighs heavier than ever.",
            "quote": "Standing in my way again? Ask my spear first!"
          },
          {
            "when": "page:jiameng:yeshi",
            "bio": "Beside the brazier at Jiameng Pass he once laid down his spear, yet now the steel tip quivers faintly.",
            "quote": "You saw me lay down my weapon... speak of it no more!"
          },
          {
            "bio": "In brocade robe and silver spear, he spent half his life demanding justice for his slaughtered kin.",
            "quote": "A son avenges his father—it is the law of Heaven and Earth. Out of my way!"
          }
        ],
        "xuchu": [
          {
            "when": "seen:xuchu",
            "bio": "The Battle of the Wei River made him remember you, and this time he cinches the cord at his waist three turns tighter.",
            "quote": "Come again! My strength hasn't even begun to run dry!"
          },
          {
            "bio": "Blind to stratagems of division, he knows only one iron rule: with his lord behind him, retreat is unthinkable.",
            "quote": "The horse-cub's spear is swift? My life is tougher!"
          }
        ]
      },
      "map": [
        {
          "id": "weishui-ice",
          "node": 1,
          "title": "South of the Wei · Clouds Over the Ice Fortress",
          "lines": [
            {
              "speaker": "xuhuang",
              "text": "A night of bitter wind turned the Wei River into slush. If we pour water through the night, morning will bring an ice fortress—Ma Chao's cavalry cannot pierce solid ice."
            },
            {
              "speaker": "jiaxu",
              "text": "An ice wall blocks horses, but cannot block hatred. To dismantle Xiliang, we must sever the bond between Han Sui and Ma Chao—a single letter suffices."
            },
            {
              "speaker": "you",
              "text": "Let him wager all his fury first, then reveal the blotted ink upon the letter."
            }
          ],
          "choices": [
            {
              "id": "ice-wall",
              "text": "Build the ice fortress overnight to master motion through stillness",
              "detail": "Insight improved this chapter; remember advantage of the ice wall",
              "effects": {
                "keenEye": true,
                "fact": "tongguan_ice"
              }
            },
            {
              "id": "letter-smudge",
              "text": "Smudge black ink blots across the forged letter of discord",
              "detail": "Xiliang cavalry starting morale -1; remember suspicion of the ink blot",
              "effects": {
                "sow": 1,
                "fact": "tongguan_smudge"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "tongguan-open",
          "at": "start",
          "speaker": "machao",
          "text": "Cao Ah-man! Your ice wall may stop horses, but it can never stop vengeance!"
        },
        {
          "id": "tongguan-bare",
          "at": "hand:2",
          "speaker": "xuchu",
          "when": "multi",
          "text": "Horse-cub, do you know me? The Tiger Marquis stands right before you today!"
        },
        {
          "id": "tongguan-letter",
          "at": "hand:3",
          "speaker": "narrator",
          "when": "fact:tongguan_smudge",
          "text": "Han Sui held the letter, his fingers frozen upon the ink blots. The sidelong glance Ma Chao cast was colder than Cao Cao's entire army."
        },
        {
          "id": "tongguan-low",
          "at": "low",
          "speaker": "caocao",
          "text": "Horse-cub, I know you refuse to bow. But your father's death—do you truly dare lay the entire account at my feet alone?"
        }
      ],
      "win": {
        "text": "When the wind over the southern Wei died down, the Xiliang encampment burned with its own fires—ignited not by Cao Cao's torches, but by the ink blots upon that letter. Ma Chao stood alone before the broken lines, spear leveled at Cao Cao; after a long stillness, he lowered his weapon and turned westward. Cao Cao stroked his beard and whispered: \"I did not conquer him; he simply began to wonder to whom that blood debt truly belongs.\"",
        "hook": "Xiliang dissolved, yet vengeance still sought a rider. It would wait three more years for Ma Chao beside the charcoal fires of Jiameng Pass."
      },
      "loss": {
        "text": "Ma Chao's volcanic rage did not wait for your discord to take root. With three cavalry charges the ice fortress shattered, and as Cao Cao cut his beard and shed his robe, you caught sight only of the Tiger Fool's bloodied back in the chaos.",
        "clue": "Historical Note: Ma Chao's might lies in trading raw fury for chips; restart reduces his feigned flaws. Wear him down with the ice wall first, then sow doubt with the ink blot.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "ruxu": {
      "cast": [
        "ganning",
        "zhoutai",
        "sunquan",
        "lingtong",
        "caocao"
      ],
      "objective": "Shield every chime of the hundred riders' bells during the night raid, throwing Cao Cao's host of four hundred thousand into chaos from within.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Cao Cao's four hundred thousand troops bore down upon Ruxu, plunging Sun Quan's pavilion into utter silence. Gan Ning laid one hundred bronze bells upon the table, aligning them one by one into an unbroken line."
        },
        {
          "speaker": "sunquan",
          "text": "Mengde boasts Zhang Liao; I have Xingba! Yet to enter a camp of four hundred thousand with only a hundred horsemen—Xingba, I demand you return alive."
        },
        {
          "speaker": "ganning",
          "text": "Rest easy, My Lord! Advance while the bells ring, retreat when the bells cease—Xingba leads not one hundred sacrifices, but one hundred warriors who come to settle the score!"
        },
        {
          "speaker": "lingtong",
          "text": "Gan Ning! Snatching the vanguard again! My father's veterans have not all perished yet!",
          "when": "!seen:ganning"
        },
        {
          "speaker": "zhoutai",
          "text": "Hold your tongue, Commandant. Among these hundred riders are comrades who fought beside your father."
        }
      ],
      "intros": {
        "caocao": [
          {
            "when": "page:caochuan:yeshi",
            "bio": "The mist of the thatched boats and the bells of tonight make him recalibrate Jiangdong's sheer audacity once more.",
            "quote": "Having borrowed my arrows, you come to borrow my encampment? What insolence!"
          },
          {
            "when": "seen:caocao",
            "bio": "Remembering how you exploit his suspicious nature, this time he blankets his entire army of four hundred thousand with paranoia.",
            "quote": "Whoever touches my camp tonight dies—the question is, who dares come?"
          },
          {
            "bio": "Campfires of four hundred thousand turn the river surface into day, yet amplify every shifting shadow into an approaching army.",
            "quote": "Rats of Jiangdong only know how to borrow fog and fire. Face to face, I await them."
          }
        ],
        "xuhuang": [
          {
            "bio": "His formations epitomize discipline, capable of forcing even sudden night raiders back along their own tracks.",
            "quote": "Raiding our camp? Cross my barricades first!"
          }
        ],
        "lejin": [
          {
            "bio": "His name Wenqian means \"advance,\" and his deeds match—the vanguard commander whose blade always outpaces the military order.",
            "quote": "Vanguard camp, scale the works! Men of Jiangdong, taste Yue Jin's steel!"
          }
        ]
      },
      "map": [
        {
          "id": "hundred-bells",
          "node": 1,
          "title": "Hengjiang · The Bell Signal",
          "lines": [
            {
              "speaker": "ganning",
              "text": "Each man clenches a white goose feather in his teeth. Enter the camp not to slaughter, but to topple banners, set fires, and beat their own war drums!"
            },
            {
              "speaker": "zhoutai",
              "text": "Youping will guard the dock gates. At the second chime of bells, however many return, the gates swing open!"
            },
            {
              "speaker": "you",
              "text": "What a camp of four hundred thousand fears most is not a hundred horsemen, but not knowing how many riders have breached the perimeter."
            }
          ],
          "choices": [
            {
              "id": "feather-quiet",
              "text": "Gag the mounts and muffle the bells: silence before the tempest",
              "detail": "Insight improved this chapter; remember the virtue of silence",
              "effects": {
                "keenEye": true,
                "fact": "ruxu_quiet"
              }
            },
            {
              "id": "three-fires",
              "text": "Ignite fires in three separate sectors to sow mutual panic",
              "detail": "Cao army starting war chest -200; remember fire signal",
              "effects": {
                "raid": true,
                "fact": "ruxu_fires"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "ruxu-open",
          "at": "start",
          "speaker": "caocao",
          "text": "The river is unnaturally still. Order all sectors: if alarms sound tonight, hold position first before moving—do not fall for deception!"
        },
        {
          "id": "ruxu-bells",
          "at": "hand:2",
          "speaker": "ganning",
          "text": "Bells—chime! Brothers, make Cao's camp trample itself!"
        },
        {
          "id": "ruxu-chaos",
          "at": "hand:3",
          "speaker": "narrator",
          "when": "fact:ruxu_fires",
          "text": "Fires erupted in three sectors, and the drums across four hundred thousand tents hammered in mutual alarm. Not a single arrow knew where it should fly."
        },
        {
          "id": "ruxu-low",
          "at": "low",
          "speaker": "sunquan",
          "text": "The bells have stopped... Count how many have returned. One, two... all here. All here—that is all that matters."
        }
      ],
      "win": {
        "text": "At daybreak the headcount was taken: all one hundred riders and all one hundred bells were accounted for, not one missing. Surveying the shattered campgrounds trampled by his own panicked men, Cao Cao told his generals: \"Sun Quan governs his army with such discipline; I cannot take him in haste.\" With that, he ordered the withdrawal. Sun Quan poured wine for Gan Ning with his own hands: \"Mengde has Zhang Liao, but I have Xingba—it is more than enough.\"",
        "hook": "The chimes of Ruxu made the name of Hefei burn even hotter. Zhang Liao waited there, ready to inscribe the character 'Wu' as the eternal nightmare of Jiangdong's youth."
      },
      "loss": {
        "text": "The bells rang too early, and the camp of four hundred thousand woke from confusion into grim order. Only seventy bells returned. Gan Ning tucked the string of bells missing thirty into his breast, and never spoke of that night again.",
        "clue": "Historical Note: The night raid of a hundred riders triumphs by blinding the enemy's senses, not by trading blows. Restart with silence before detonation; Cao Cao's suspicion is your only inside agent.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Exploit Hex Mark and Zhang Ren's obsession with the Phoenix Fledgling to make the ambushing archers strike the wrong target.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Before Fallen Phoenix Slope, Hex Mark refused to tread across the white stone path. Pang Tong swung down from the saddle, handing the reins back to Liu Bei, suddenly asking whether Zhang Ren sought to kill the steed or the rider."
        },
        {
          "speaker": "pangtong",
          "text": "Kongming's letter warned only that fortune leans grim for commander and host. He took me into his calculations, yet forgot that ambushers must first tell one man from another."
        },
        {
          "speaker": "liuzhang",
          "text": "My father and brother guarded Shu's mountain passes for thirty years; to think an invader has pierced our realm... Ren'er, the gates of Chengdu rest in your hands.",
          "when": "!seen:liuzhang"
        },
        {
          "speaker": "liubei",
          "text": "Shiyuan, offering my horse was born of goodwill. What if this goodwill has inscribed your name upon death's register?"
        },
        {
          "speaker": "zhangren",
          "text": "Until Hex Mark appears, hold all arrows. My quarry is Liu Bei—harm no other man."
        }
      ],
      "intros": {
        "zhangren": [
          {
            "when": "seen:zhangren",
            "bio": "He remembers how his ambush struck empty air, and now questions every fluttering standard with sharper scrutiny.",
            "quote": "Banners may be swapped. A heart sworn to defend its realm cannot be traded."
          },
          {
            "bio": "Foremost in loyalty and valor across Western Chuan; caution is the rampart of his bastion, and the signal horn of his ambush.",
            "quote": "Until the white steed reveals itself, no soldier shall loose a single shaft."
          }
        ]
      },
      "map": [
        {
          "id": "false-phoenix",
          "node": 1,
          "title": "Fallen Phoenix Slope · Turning the Watcher's Eye",
          "lines": [
            {
              "speaker": "zhangren",
              "text": "The forest is deep, the steed swift. Yet my ambush heeds but one command: the moment the white horse enters the gorge, ten thousand arrows shall loose in unison."
            },
            {
              "speaker": "pangtong",
              "text": "He aims not at me, but at the preconception that Liu Bei must ride Hex Mark. The land's omen might not curse me, but names deceive mortal men."
            },
            {
              "speaker": "liubei",
              "text": "Then let that preconception guide our vanguard one final time."
            }
          ],
          "choices": [
            {
              "id": "horse-decoy",
              "text": "Send Hex Mark forward with empty reins",
              "detail": "See through the ambush; record the white steed decoy",
              "effects": {
                "keenEye": true,
                "fact": "luofengpo_horse_decoy"
              }
            },
            {
              "id": "banner-decoy",
              "text": "Divert the arrow storm with phoenix feather banners",
              "detail": "Enemy starting war chest -200; record the decoy banner",
              "effects": {
                "raid": true,
                "fact": "luofengpo_banner_decoy"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "luofengpo-open",
          "at": "start",
          "speaker": "zhangren",
          "text": "Pang Tong, if you truly understood omens and fortune, you would never have stepped foot into this slope."
        },
        {
          "id": "luofengpo-horse",
          "at": "hand:2",
          "speaker": "pangtong",
          "when": "fact:luofengpo_horse_decoy",
          "text": "Hark, the arrows chase after Hex Mark. Zhang Ren guards the notion that Liu Bei rides a white steed, not Fallen Phoenix Slope."
        },
        {
          "id": "luofengpo-banner",
          "at": "hand:2",
          "speaker": "pangtong",
          "when": "fact:luofengpo_banner_decoy",
          "text": "Where the phoenix banner veers east, the ambuscade follows east. This so-called fall of the phoenix can be decreed by my own design."
        },
        {
          "id": "luofengpo-turn",
          "at": "hand:3",
          "speaker": "zhangren",
          "text": "The white horse was a phantom, the banner a ruse. You turned my very caution into a bow against me!"
        },
        {
          "id": "luofengpo-low",
          "at": "low",
          "speaker": "liubei",
          "text": "Shiyuan, their ambush is in disarray. Today we swap no steeds—we forge a path never written in their plans."
        }
      ],
      "win": {
        "text": "The rain of arrows fell uselessly upon an unmounted steed and false standards as Pang Tong ascended the heights along the flanking ridge. He celebrated no defiance of geography; he merely added four words to Kongming's grim missive: 'So too human hearts.' For the very first time, the gates of Chengdu cracked open before the Phoenix Fledgling.",
        "hook": "With the Phoenix Fledgling entering Shu, Hanzhong loomed as the next contested prize on the board. Atop Mount Dingjun, Huang Zhong was already honing a blade that refused to grow old."
      },
      "loss": {
        "text": "In your haste to part with Hex Mark, you still marched along the canyon trail Zhang Ren had foreseen. You spared the horse from being targeted, yet failed to spare the man whose mind was read; the second volley of arrows awaited no command.",
        "clue": "Historical Chronicle · Zhang Ren verifies banners before giving the command; the ambuscade falters on a single misidentification. Keen Eye increases on restart.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "jiameng": {
      "cast": [
        "zhangfei",
        "machao",
        "zhuge",
        "weiyan"
      ],
      "objective": "Beside the braziers of Jiameng Pass, let the realm's two fiercest spears finish their clash before deciding who walks with whom.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The defeated soldiers of Weinan surrendered to Zhang Lu, and Ma Chao marched his vanguard beneath Jiameng Pass. Atop the battlements, Zhang Fei heard who had arrived; he roared with laughter thrice, then tucked his pledge to abstain from wine beneath the desk."
        },
        {
          "speaker": "zhangfei",
          "text": "Ma Chao! I heard that at Tong Pass you chased Cao Cao until he shaved his beard and threw off his robe! Splendid! Old Zhang only rejoices when facing the strong—come, let us duel three hundred rounds!"
        },
        {
          "speaker": "machao",
          "text": "Zhang Fei of Yan? Ever since Tong Pass, all under heaven claim only your third brother is worthy of crossing spears with me. Gallop forth!"
        },
        {
          "speaker": "zhuge",
          "text": "Yide, this man fights with desperate fury born of grief and wrath; he cannot be bested by raw force alone. I ask only one thing: fight to the full, but do not slay him.",
          "when": "!fact:jiameng_done"
        },
        {
          "speaker": "weiyan",
          "text": "Military Advisor, Wenchang requests to lead a force to circle behind them. Should General Zhang suffer any mishap—",
          "when": "seen:weiyan"
        }
      ],
      "intros": {
        "machao": [
          {
            "when": "page:tongguan:yeshi",
            "bio": "He still has not deciphered that blot of ink south of the Wei River; that lingering grievance robbed his spear of three parts of its true direction.",
            "quote": "A trick of sowing discord will not prevail twice. Today, spears alone shall speak!"
          },
          {
            "when": "seen:machao",
            "bio": "Following his duel with Zhang Fei, his spearpoint carried an unspoken weight.",
            "quote": "We meet once more. This time, let the duel finish before words begin."
          },
          {
            "bio": "A defeated general who staked his remaining dignity upon this solitary silver spear.",
            "quote": "West Liang is lost, my kin wiped out. All that remains to me is this battle."
          }
        ],
        "madai": [
          {
            "when": "seen:madai",
            "bio": "He guards his cousin's flank, and shields the last living branch of the Ma lineage.",
            "quote": "Whatever concerns my elder brother concerns Ma Dai as well."
          },
          {
            "bio": "A taciturn blade of West Liang, whose saber runs as heavy as the burdens in his heart.",
            "quote": "You must first cross through me."
          }
        ]
      },
      "map": [
        {
          "id": "lamp-duel",
          "node": 1,
          "title": "Jiameng Pass · Duel by Torchlight",
          "lines": [
            {
              "speaker": "zhangfei",
              "text": "Dusk falls and we cannot fight to our hearts' content! Men, light the torches—two hundred lanterns! We duel through the night!"
            },
            {
              "speaker": "machao",
              "text": "Magnificent spirit! Zhang Fei, you are far more of a true man than the tales recounted!"
            },
            {
              "speaker": "you",
              "text": "Torches illuminate spears, but they also lay bare the heart. In the final bouts, spears speak true."
            }
          ],
          "choices": [
            {
              "id": "keep-count",
              "text": "Count rounds for Zhang Fei and pace his stamina",
              "detail": "Keen Eye increases this round; remember the two hundred passes",
              "effects": {
                "keenEye": true,
                "fact": "jiameng_count"
              }
            },
            {
              "id": "warm-wine",
              "text": "Warm two bowls of wine and wait at the arena rim",
              "detail": "War chest +120; mutual respect deepens with every clash",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "jiameng_wine"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "jiameng-open",
          "at": "start",
          "speaker": "zhangfei",
          "text": "Ma Chao! Receive my spear! If I cannot drink you beneath the table today, old Zhang will renounce his name!"
        },
        {
          "id": "jiameng-fire",
          "at": "hand:2",
          "speaker": "narrator",
          "text": "Two hundred torches turned the battleground into midday sun. The two spears intertwined and flashed in the blaze until the onlookers forgot even to cheer."
        },
        {
          "id": "jiameng-madai",
          "at": "hand:3",
          "speaker": "madai",
          "text": "Brother, fall back! Zhang Lu's reinforcements will not arrive, and few sons of West Liang remain!",
          "when": "!fact:jiameng_wine"
        },
        {
          "id": "jiameng-wine",
          "at": "hand:3",
          "speaker": "machao",
          "text": "...Those two bowls of warmed wine at the field's edge—for whom are they poured?",
          "when": "fact:jiameng_wine"
        },
        {
          "id": "jiameng-low",
          "at": "low",
          "speaker": "zhuge",
          "text": "Yide, withhold three parts of your might. His heart carries a heavy sorrow; no matter how fierce the spear, it has reached its limit."
        }
      ],
      "win": {
        "text": "After more than two hundred rounds, the torches had burned down by half. Zhang Fei planted his serpent spear into the soil: 'Ma Chao, rest for the night, and tomorrow we fight again!' Ma Chao sat silent upon his steed for a long while, then suddenly asked: 'General Zhang... can Imperial Uncle Liu truly harbor a man consumed by vengeance like me?' Those two bowls of warm wine by the ring were shared at last among three: you, Yide, and a lowered spear.",
        "hook": "Beside the braziers of Jiameng Pass, the spear of West Liang discovered a new compass. Meanwhile in Jingzhou, Lu Su was crossing the river with an old receipt, inviting Guan Yu to a fateful banquet."
      },
      "loss": {
        "text": "In your rush to engineer an opening for Zhang Fei, you interrupted the dialogue that the two spears were speaking. Ma Chao wheeled his mount back to his lines and shut his gates, refusing to emerge for any envoy.",
        "clue": "Historical Chronicle · The true victory on this page lies beyond the spearpoints. On restart, let them duel to the full: he who counts rounds masters the battle; he who warms wine wins the man.",
        "clueFx": "sow"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "daodan": {
      "cast": [
        "guanyu",
        "lusu",
        "guanping",
        "zhoucang",
        "zhuge"
      ],
      "objective": "At the banquet of Lukou, prevent Lu Su from recovering Jingzhou while ensuring Guan Yu never needs to draw his blade.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Lu Su penned the invitation thrice, each draft far more deferential than the last. The vessel in the river's center stood ready with axemen concealed within the hold, yet the parchment bore only the words 'reminiscing on old friendship.'"
        },
        {
          "speaker": "lusu",
          "text": "Yunchang, Su harbors no ulterior design, seeking only to settle the account of Jingzhou face to face."
        },
        {
          "speaker": "guanyu",
          "text": "Since Zijing invites me, how could Guan refuse? Ping'er, accompany me to the feast; Zhou Cang, shoulder the blade."
        },
        {
          "speaker": "guanping",
          "text": "Father, before our departure the Military Advisor instructed: this banquet is about wine, not Jingzhou; it is about trust, not the sword."
        },
        {
          "speaker": "zhoucang",
          "text": "I will plant the Green Dragon Crescent Blade upon the ship's prow and let the men of Eastern Wu witness its true weight!"
        }
      ],
      "intros": {
        "lusu": [
          {
            "when": "seen:lusu",
            "bio": "He failed to reclaim Jingzhou last time; now his arguments are polished smoother, and the axemen lurk deeper.",
            "quote": "Yunchang, what Su seeks today is still not surrender, but the single word 'return.'"
          },
          {
            "bio": "The most honest gentleman in Eastern Wu has finally learned to weave an ambush into cups of wine.",
            "quote": "The promissory note is here. Yunchang, please look upon it."
          }
        ],
        "dingfeng": [
          {
            "when": "seen:dingfeng",
            "bio": "He shifted his ambush position thrice, yet never heard the cup shatter upon the floor.",
            "quote": "Wait a little longer... why has the commander's cup not fallen?"
          },
          {
            "bio": "The veteran commander famed for charging through snow with short blades now hides those blades beneath the banquet tables.",
            "quote": "After three rounds of wine, heed the shatter of the cup."
          }
        ]
      },
      "map": [
        {
          "id": "river-feast",
          "node": 1,
          "title": "Lukou · Mid-River Banquet",
          "lines": [
            {
              "speaker": "lusu",
              "text": "Yunchang, at this table there is only our past fellowship, nothing else—Su drinks first to show his good faith."
            },
            {
              "speaker": "guanyu",
              "text": "Guan will gladly drink Zijing's wine. As for the accounts of Jingzhou, we shall speak once we are merry."
            },
            {
              "speaker": "you",
              "text": "The covenant is hidden beneath his sleeve; the axemen lie beneath the deck. Whoever shows impatience first has lost."
            }
          ],
          "choices": [
            {
              "id": "count-cups",
              "text": "Observe Lu Su's pouring rhythm and glancing eyes",
              "detail": "Keen Eye increases this round; remember the rhythm of pouring",
              "effects": {
                "keenEye": true,
                "fact": "daodan_count"
              }
            },
            {
              "id": "hold-scabbard",
              "text": "Rest a hand on Zhou Cang's scabbard: courtesy before arms",
              "detail": "Eastern Wu ambush initial morale -1; remember the honor of staying the blade",
              "effects": {
                "sow": 1,
                "fact": "daodan_hold"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "daodan-open",
          "at": "start",
          "speaker": "lusu",
          "text": "Yunchang, today we speak only of old days. Come, drink this cup to the lees—"
        },
        {
          "id": "daodan-deed",
          "at": "hand:2",
          "speaker": "guanyu",
          "text": "Zijing, the wine is exquisite. Yet the ink upon that promissory note is remembered far more clearly by Guan than by you."
        },
        {
          "id": "daodan-blade",
          "at": "hand:3",
          "speaker": "zhoucang",
          "text": "Footsteps rustle beneath the floorboards! General, my blade—",
          "when": "!fact:daodan_hold"
        },
        {
          "id": "daodan-hold",
          "at": "hand:3",
          "speaker": "guanyu",
          "text": "Zhou Cang, step back. Today this blade drinks wine only in Guan's company.",
          "when": "fact:daodan_hold"
        },
        {
          "id": "daodan-low",
          "at": "low",
          "speaker": "guanping",
          "text": "Father, Lu Su personally escorted us to the prow. His fingers inside his sleeve have been clutching that covenant all along."
        }
      ],
      "win": {
        "text": "As the boat pulled away from mid-river, Lu Su stood upon the pier, gazing long after that eighty-two-catty crescent blade drifting into the mist. He never smashed his cup, for Guan Yu had spoken upon parting: 'Zijing, Guan remembers our Jingzhou covenant. What you preserve today is not a deed of debt, but the unbroken trust between our two houses.' Across the quiet river, only you knew that this cup had bought Jingzhou several more precious years.",
        "hook": "The single blade banquet adjourned, yet the ledger between the two houses remained unclosed. Toward Hefei, war drums beating with frantic haste awaited Sun Quan."
      },
      "loss": {
        "text": "The moment cold steel cleared its scabbard, the banquet was already lost. You failed to restrain eighty-two catties of wrath, and failed to stay the daggers beneath the deck. The currents of the Yangtze washed 'attending a feast with a single blade' into a mutual ruin.",
        "clue": "Historical Chronicle · Lu Su sought 'trust' rather than 'conquest'; the ambush waited for 'steel' rather than 'reason.' Keen Eye increases on restart; stay the blade first before settling accounts.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "xiaoyaojin": {
      "cast": [
        "sunquan",
        "zhangliao",
        "lingtong",
        "ganning",
        "zhoutai"
      ],
      "objective": "Beside the narrow bridge of Xiaoyao Ford, prevent Zhang Liao's eight hundred from shattering one hundred thousand, and protect Ling Tong's rearguard.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Astride the walls of Hefei, Zhang Liao arrayed eight hundred death-sworn warriors before the gate, their armor bone-dry—they had waited through the entire night. Beyond the moat, Wu's host of one hundred thousand had just broken camp."
        },
        {
          "speaker": "zhangliao",
          "text": "The Wu men have just arrived, their palisades not yet pitched. If we strike now, eight hundred can rival eighty thousand. Follow me—charge!"
        },
        {
          "speaker": "sunquan",
          "text": "Zhang Liao?! How dares he sally from the city! Formations, do not panic, hold firm—Gan Ning, Ling Tong, cover the flanks!"
        },
        {
          "speaker": "lingtong",
          "text": "My lord, flee first! The three hundred retainers of the Ling clan are enough to hold him off!"
        },
        {
          "speaker": "ganning",
          "text": "Gongji! Do not play the martyr! Your three hundred men are not pawns to be traded for my lord's escape!"
        }
      ],
      "intros": {
        "zhangliao": [
          {
            "when": "seen:zhangliao",
            "bio": "He remembers how your lines held firm during the river crossing; this time he advances the charge by half a quarter-hour.",
            "quote": "Seeking to steady your ranks again? My blade will grant you no time to deploy."
          },
          {
            "bio": "The valor of eight hundred warriors was nurtured night after sleepless night through his own fierce resolve.",
            "quote": "Liao has waited ten years for this single charge!"
          }
        ],
        "lejin": [
          {
            "bio": "Together with Zhang Liao and Li Dian he holds Hefei; outwardly united and inwardly concordant, their blades conceal distinct edges.",
            "quote": "General Zhang charges the vanguard while Yue holds the rear—the gates of Hefei are entered easily, but none depart alive."
          }
        ],
        "lidian": [
          {
            "bio": "When advising Zhang Liao to break their spirits first, he harbored no personal enmity; his formations emphasize leaving room for maneuver above all.",
            "quote": "Li Mancheng competes not in ferocity. I seal only the path along which you hope to retreat."
          }
        ]
      },
      "map": [
        {
          "id": "half-ford",
          "node": 1,
          "title": "Xiaoyao Ford · Bridge of the Half-Crossing",
          "lines": [
            {
              "speaker": "zhoutai",
              "text": "My lord, two planks of the ford bridge have rotted away; the steed cannot leap at speed. Youping shall carry my lord across the bridge upon his back!"
            },
            {
              "speaker": "lingtong",
              "text": "Youping, take my lord away! I shall hold Zhang Liao!"
            },
            {
              "speaker": "you",
              "text": "What Zhang Liao craves is not Sun Quan's life, but the complete unraveling of Wu's host. Do not surrender the hearts of one hundred thousand to the audacity of eight hundred."
            }
          ],
          "choices": [
            {
              "id": "hold-line",
              "text": "Command the host to form lines before crossing",
              "detail": "Keen Eye increases this round; remember formation before ford",
              "effects": {
                "keenEye": true,
                "fact": "xiaoyaojin_line"
              }
            },
            {
              "id": "rear-guard",
              "text": "Personally lead the rearguard to let my lord cross first",
              "detail": "War chest +100; Zhang Liao host starting morale -1",
              "effects": {
                "chips": 100,
                "sow": 1,
                "fact": "xiaoyaojin_rear"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "xiaoyaojin-open",
          "at": "start",
          "speaker": "zhangliao",
          "text": "Zhang Liao is here! Hearken, men of Wu—today, my blade strikes only where your battle line is most disordered!"
        },
        {
          "id": "xiaoyaojin-charge",
          "at": "hand:2",
          "speaker": "narrator",
          "text": "Eight hundred horsemen bored into Wu's formations like an iron chisel. Wherever they thundered, the banners of one hundred thousand toppled of their own accord."
        },
        {
          "id": "xiaoyaojin-ling",
          "at": "hand:3",
          "speaker": "lingtong",
          "text": "My lord has crossed the bridge! Of my three hundred retainers... only a few score remain. It is enough—enough to hold for another round!"
        },
        {
          "id": "xiaoyaojin-low",
          "at": "low",
          "speaker": "sunquan",
          "text": "Gongji, come back! Ling Tong—return! My Eastern Wu cannot rely on you shedding your lives one by one!"
        }
      ],
      "win": {
        "text": "The instant the ford bridge was repaired, Wu's host finally locked shields into an unbroken bulwark. Watching from atop the ramparts, Zhang Liao sheathed his blade: 'The Wu men have regained their footing; we can sortie no longer.' Bathed in blood, Ling Tong stepped onto the planks, and Sun Quan dismounted to clasp his hands in tears. On the march back to Jianye, laughter was absent, replaced by Sun Quan's vow: 'I shall never forget Hefei, nor Zhang Wenyuan.'",
        "hook": "The bitter lesson of Xiaoyao Ford forced Eastern Wu to turn its gaze wholly back toward Jingzhou. Meanwhile, Liu Bei's war drums for Hanzhong were already resounding beneath Mount Dingjun."
      },
      "loss": {
        "text": "A host of one hundred thousand was broken by the audacity of eight hundred. The moment the ford bridge collapsed, Ling Tong's three hundred retainers perished on the far bank, and Zhang Liao's name became a nightmare that silenced the crying infants of Eastern Wu for generations.",
        "clue": "Historical Chronicle · Zhang Liao won by exploiting chaos, not numbers. On restart, form ranks before crossing the bridge; if he cannot break your line, he will not dare venture forth alone.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "dingjunshan": {
      "cast": [
        "huangzhong",
        "xiahouyuan",
        "zhanghe",
        "fazheng",
        "yanyan"
      ],
      "objective": "Pit Xiahou Yuan's speed against Zhang He's flexibility, striking with the veteran's blade in the half-beat of their relief.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Above and below Mount Dingjun, two war drums thundered. Xiahou Yuan urged his hosts to charge, while Zhang He held his ranks to survey the mountain roads; the two rhythms were perpetually out of step by half a beat. Listening thrice, Huang Zhong unslung his bow."
        },
        {
          "speaker": "huangzhong",
          "text": "They say this veteran has only one blade strike left. One is plenty, provided one foe charges in blindly while the other cunningly refuses to engage."
        },
        {
          "speaker": "fazheng",
          "text": "Hansheng, discord between the enemy generals on the ridge is heaven's third road granted to you. Upon our banner, Xiaozhi writes only one word: 'Wait.'",
          "when": "!seen:fazheng"
        },
        {
          "speaker": "yanyan",
          "text": "Elder brother, that cry of 'unyielding headless general' on the Shu roads of old is returned in kind today. Your flank is safe in Yan Yan's hands."
        },
        {
          "speaker": "xiahouyuan",
          "text": "Withered with age, yet you dare claim the high ground? Before the drums of dawn roll, I shall charge the heights and take your blade!"
        },
        {
          "speaker": "zhanghe",
          "text": "Miaocai, he who holds the high ground feigns weakness by design. If you know only haste, you merely spare him the trouble of luring you out."
        }
      ],
      "intros": {
        "xiahouyuan": [
          {
            "bio": "Speed as sovereign virtue is his military doctrine, and also the war drum that foes can most easily hurry.",
            "quote": "Zhang He excels in guile, Xiahou in swiftness. Which will you face first?"
          }
        ],
        "zhanghe": [
          {
            "bio": "A general famed for cunning adaptations; unmatched in shifting formations, yet powerless to curb his comrade's rash temper.",
            "quote": "Warfare knows no constant form. Pity that Miaocai recognizes only a single speed."
          }
        ],
        "huangzhong": [
          {
            "bio": "The veteran general does not vie in foot races; he vies only for the single stride when the enemy steps into his blade's arc.",
            "quote": "What has grown old is the passage of years, not this blade."
          }
        ]
      },
      "map": [
        {
          "id": "half-beat",
          "node": 1,
          "title": "Mount Dingjun · Half-Beat of Relief",
          "lines": [
            {
              "speaker": "zhanghe",
              "text": "If I shift left to bolster defenses, Miaocai will surely rush the right to snatch glory. The higher you stand, the less he will heed my signals."
            },
            {
              "speaker": "xiahouyuan",
              "text": "By the time your formation locks shields, Huang Zhong will have long escaped! Swift battle is the firmest of formations."
            },
            {
              "speaker": "huangzhong",
              "text": "No need to hope for harmony between them. One fast, one slow—just right to measure my strike."
            }
          ],
          "choices": [
            {
              "id": "measure-beats",
              "text": "Measure the watch drums of both camps before setting the blade",
              "detail": "Keen Eye increases; remember the half-beat cadence",
              "effects": {
                "keenEye": true,
                "fact": "dingjunshan_measured_beats"
              }
            },
            {
              "id": "leave-antlers",
              "text": "Leave a breached palisade to bait an urgent repair",
              "detail": "Cao host initial war chest -200; remember the false breach",
              "effects": {
                "raid": true,
                "fact": "dingjunshan_repair_bait"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "dingjunshan-open",
          "at": "start",
          "speaker": "xiahouyuan",
          "when": "multi",
          "text": "Zhang He, guard the flank. As for you—withstand three of my charges before babbling about old age!"
        },
        {
          "id": "dingjunshan-change",
          "at": "hand:2",
          "speaker": "zhanghe",
          "when": "multi",
          "text": "The more he urges haste, the more you should watch me. Miaocai strikes your front, but my lines envelop your rear."
        },
        {
          "id": "dingjunshan-measured",
          "at": "hand:3",
          "speaker": "huangzhong",
          "when": "fact:dingjunshan_measured_beats",
          "text": "What you measured was not the mountain, but that half-beat where Miaocai hears 'charge' and refuses to look back."
        },
        {
          "id": "dingjunshan-bait",
          "at": "hand:3",
          "speaker": "huangzhong",
          "when": "fact:dingjunshan_repair_bait",
          "text": "What you repaired was not wooden antlers, but a compulsion that forced Miaocai to rush. Now, wait as he breaches the gate."
        },
        {
          "id": "dingjunshan-low",
          "at": "low",
          "speaker": "huangzhong",
          "when": "multi",
          "text": "One commands me to hurry; one commands him to slow. This old soldier needs only stand in the breath between them."
        }
      ],
      "win": {
        "text": "The moment Xiahou Yuan lunged into that half-beat gap, Zhang He's repositioned line had not yet turned. Huang Zhong delivered no second blow; he merely rested his great saber across his shoulder, and the garrisons throughout Hanzhong shifted their colors in unison. High upon the mountain, the two drums at last struck a single watch.",
        "hook": "Triumph in Hanzhong elevated Guan Yu's renown to shake all of China. Yet as the autumn rains of the Mian River gathered, fame itself would become the most perilous beacon."
      },
      "loss": {
        "text": "Xiahou Yuan's swiftness harried your vanguard, while Zhang He's cunning sealed your retreat. Waiting for them to collide, you were instead torn between two disparate tempos; the veteran's blade never had the chance to leave its scabbard.",
        "clue": "Historical Chronicle · The two commanders alternate between swift assaults and shifting lines; await one movement before reading the other. Keen Eye increases on restart.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "shuiyan": {
      "cast": [
        "guanyu",
        "yujin",
        "pangde"
      ],
      "objective": "Harness the waters without relying on nature alone; seal the heights and retreats before the seven armies relocate, turning heaven's weather into military decree.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The Mian River had already submerged the ancient boundary markers, yet Yu Jin still kept his encampments aligned without a single flaw. Outside the camp gates rested Pang De's coffin, its dark lacquer heavier than the thunderclouds."
        },
        {
          "speaker": "guanyu",
          "text": "The strength of the seven armies lies in absolute discipline; their peril lies in that none dare violate orders to relocate to safety."
        },
        {
          "speaker": "yujin",
          "text": "Guan Yunchang, heaven's seasons may not favor you. Our provisions can endure ten more days; if you hesitate, the siege outside Fancheng will crumble first."
        },
        {
          "speaker": "pangde",
          "text": "General Yu, Pang arrived with his coffin parked outside the gate. We hold this ground not for Wei soil, but for the honor of our lords.",
          "when": "!seen:pangde"
        },
        {
          "speaker": "you",
          "text": "He waits for the rain to cease. I need not rush the rain; I need only make him reluctant to take the first step."
        }
      ],
      "intros": {
        "yujin": [
          {
            "when": "seen:yujin",
            "bio": "He remembers how low ground swallowed whole legions, yet still refuses to let an unsanctioned movement tarnish his reputation for strict order.",
            "quote": "Rising water can be measured. The army's discipline must not waver first."
          },
          {
            "bio": "Steadfast as Mount Tai, he places absolute trust in military orders, and is the last to admit when an order has become fatal.",
            "quote": "All battalions heed my word: without orders, no man steps back one pace."
          }
        ],
        "pangde": [
          {
            "when": "seen:pangde",
            "bio": "Born of the West Liang hosts, he trusts not in destiny, but only in the blade in his grasp and the coffin outside the stockade.",
            "quote": "Fight once more. The coffin remains empty; the warrior has not yet returned."
          },
          {
            "when": "page:tongguan:yeshi",
            "bio": "He remembers the scattering of West Liang, now transforming stubborn defiance into death-sworn loyalty.",
            "quote": "Ma Chao fell in West Liang. Pang De shall not fall here."
          },
          {
            "bio": "A surrendered general who carried his own coffin to the front, paying off his debts of honor with every loosed arrow.",
            "quote": "The coffin is here. Lord Guan, unleash your full might."
          }
        ]
      },
      "map": [
        {
          "id": "dry-order",
          "node": 1,
          "title": "Zengkouchuan · Strike Before the Deluge",
          "lines": [
            {
              "speaker": "yujin",
              "text": "If you breach the dyke, my army ascends the heights; if you lay prolonged siege, Fancheng calls for aid. However torrential the rain, it cannot issue orders on my behalf."
            },
            {
              "speaker": "guanyu",
              "text": "What he requires is not merely high ground, but an order that allows him to preserve his pride."
            },
            {
              "speaker": "you",
              "text": "Then offer him a path of retreat that appears to demand no abandonment of camp."
            }
          ],
          "choices": [
            {
              "id": "old-channel",
              "text": "Leave the old river channel open, feigning weakness",
              "detail": "See through the retreat route; remember the old channel",
              "effects": {
                "keenEye": true,
                "fact": "shuiyan_old_channel"
              }
            },
            {
              "id": "highland-stakes",
              "text": "Drive sunken stakes to seal the highland fords",
              "detail": "Yu Jin starting war chest -200; remember the sunken stakes",
              "effects": {
                "raid": true,
                "fact": "shuiyan_highland_stakes"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "shuiyan-open",
          "at": "start",
          "speaker": "yujin",
          "text": "So long as our lines remain unbroken, water is merely water. Renowned as Guan Yu may be, he merely waits for heaven to fight his war."
        },
        {
          "id": "shuiyan-channel",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "fact:shuiyan_old_channel",
          "text": "The old riverbed appears safe, yet its depths are treacherous. Since Yu Jin refused to yield his ground, that sure path has become his tomb."
        },
        {
          "id": "shuiyan-stakes",
          "at": "hand:2",
          "speaker": "guanyu",
          "when": "fact:shuiyan_highland_stakes",
          "text": "The stakes are submerged. He still boasts that the heights can be scaled, only because he has not seen that the underwater gate is already barred."
        },
        {
          "id": "shuiyan-no-reply",
          "at": "hand:3",
          "speaker": "yujin",
          "text": "Water reaches our knees, yet no unit shall move without orders! Wait—messengers sent to the heights, why do they bring no reply?"
        },
        {
          "id": "shuiyan-low",
          "at": "low",
          "speaker": "guanyu",
          "text": "Water is no blade. What prevented his retreat was discipline as unyielding as a mountain; the deluge merely swallowed the mountain whole."
        }
      ],
      "win": {
        "text": "Banners of the seven armies sank one after another into the swirling torrents. When Yu Jin cast down his sword, Guan Yu ordered dry boats brought to him rather than cords of binding. The acclaim of shaking China arose only as night fell; yet Guan Yu gazed upstream in solitude, as though he had already glimpsed the narrower, snowbound path lying beyond glory.",
        "hook": "Yu Jin was taken and Xuchang trembled. Yet in Eastern Wu, Lu Meng stripped off his armor to don white merchant robes, while Lu Xun dispatched an exceedingly deferential missive toward Jingzhou."
      },
      "loss": {
        "text": "The deluge finally burst forth, yet you mistook the rising tide for guaranteed triumph. Yu Jin retreated systematically to the heights; though soaked, the seven armies stood firm, and Guan Yu's tower ships were stranded upon the very waterways he had prepared.",
        "clue": "Historical Chronicle · Rising water suppresses battle lines but does not seal off escape routes; seize the heights first. Keen Eye increases on restart.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Shatter the snare woven of white merchant robes and honeyed flatteries, so Guan Yu will not let the debts of Huarong Pass dictate the path of survival at Maicheng.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The snows of Maicheng blanketed the beacon towers. Lu Meng's white merchant garb and Lu Xun's silken sashes entered the tent in succession. Upon Guan Yu's desk rested a severed sword tassel from Huarong Pass of years long past."
        },
        {
          "speaker": "guanyu",
          "when": "choice:huarong:yeshiB",
          "text": "On that day my blade did not fall, and today Cao's host halts in the north. The debt of honor I laid down has traversed the map to demand repayment."
        },
        {
          "speaker": "guanyu",
          "when": "choice:huarong:yeshi",
          "text": "On that day my blade fell, and the northern lords harbor their own designs. Letters seeking relief reached Linju and vanished without reply. Honor was balanced, yet the road grew no wider."
        },
        {
          "speaker": "guanping",
          "text": "Father, Ping has scouted the terrain: the northern trail is passable, yet the forests of Linju are dense—Wu snares surely lie in wait."
        },
        {
          "speaker": "zhoucang",
          "text": "My legs outrun their steeds! General, mount your horse while I shoulder the blade and forge the path—whoever stands in our way, I shall trample underfoot!"
        },
        {
          "speaker": "lvmeng",
          "text": "Yunchang, at your pinnacle you drowned the seven armies; yet from that very flood, both allies and old foes learned how to bring you down."
        }
      ],
      "intros": {
        "panzhang": [
          {
            "when": "seen:panzhang",
            "bio": "He craves far more than the fortress; his eyes have always hungered for that eighty-two-catty blade within.",
            "quote": "The Green Dragon Crescent Blade... this time, it changes masters."
          },
          {
            "bio": "He who lays snares calculates not numbers, but the ingrained habits of desperate men.",
            "quote": "Those who hasten through snowy nights invariably choose the shortest trail."
          }
        ],
        "lvmeng": [
          {
            "when": "choice:huarong:yeshiB",
            "bio": "Knowing you once allowed Cao Cao to return north, he calculated that ancient debt into your path of seeking aid.",
            "quote": "You could release the tiger, but can you walk the path I have laid for your honor?"
          },
          {
            "when": "choice:huarong:yeshi",
            "bio": "Remembering the blade that fell at Huarong Pass, he no longer hopes that past mercy will check your steel.",
            "quote": "Since you slew Cao Cao, you must know I owe you no debts of the past."
          },
          {
            "bio": "Beneath the white merchant robes stands no trader, but a general who has read Guan Yu too thoroughly.",
            "quote": "Parted for three days, scholars must be viewed with new eyes. Yunchang, do you still recognize Lu Meng?"
          }
        ],
        "luxun": [
          {
            "when": "page:sanqi:yeshi",
            "bio": "Zhou Yu survived because of you, yet Lu Xun seeks to prove that a debt of life changes nothing in the contest for Jingzhou.",
            "quote": "You saved Zhou Yu, yet you cannot save Jingzhou."
          },
          {
            "bio": "The lower he bows in flattering letters, the slower and tighter the net closes around Maicheng.",
            "quote": "Junior Lu Xun comes specially to seek counsel from the warrior whose name shakes all of China."
          }
        ]
      },
      "map": [
        {
          "id": "old-self-road",
          "node": 1,
          "title": "Linju · Old Ledgers in the Snow",
          "lines": [
            {
              "speaker": "lvmeng",
              "text": "We need not guess whether Guan Yu will surrender. As long as we fathom who he still trusts, Maicheng has no second gate."
            },
            {
              "speaker": "guanyu",
              "text": "The loss of Jingzhou lies not in one fortress or one captain. It is that everyone took my past self as a road marker for today."
            },
            {
              "speaker": "lvmeng",
              "when": "choice:huarong:yeshiB",
              "text": "At Huarong Pass your blade stayed, and Cao Cao owed you a life. Yet does he hold back to repay kindness, or to watch Wu and Shu bleed together?"
            },
            {
              "speaker": "luxun",
              "when": "choice:huarong:yeshi",
              "text": "At Huarong Pass your blade struck, and the north is mired in its own chaos. You burned external aid, but you also burned their past assumptions of you."
            }
          ],
          "choices": [
            {
              "id": "split-letters",
              "text": "Send pleas for relief along northern and western routes",
              "detail": "War chest +150, Lu Meng war chest +100; remember dividing the dispatches",
              "effects": {
                "chips": 150,
                "oppChips": 100,
                "fact": "maicheng_split_letters"
              }
            },
            {
              "id": "burn-letters",
              "text": "Burn old missives and break out with elite cavalry only",
              "detail": "Keen Eye increases; remember incinerating the letters",
              "effects": {
                "keenEye": true,
                "fact": "maicheng_burn_letters"
              }
            },
            {
              "id": "false-beacons",
              "text": "Rekindle beacon towers to feign prolonged defense",
              "detail": "Wu host starting war chest -200; remember the empty beacons",
              "effects": {
                "raid": true,
                "fact": "maicheng_false_beacons"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "maicheng-open",
          "at": "start",
          "speaker": "lvmeng",
          "when": "multi",
          "text": "Lu Xun made you believe time remained; my duty is to run that time dry. Yunchang, it is time for a new perspective."
        },
        {
          "id": "maicheng-letters",
          "at": "hand:2",
          "speaker": "luxun",
          "when": "multi",
          "text": "Every time you seek aid, I deliberate first on behalf of the recipient. By the time you understand, the road has become my formation."
        },
        {
          "id": "maicheng-spared",
          "at": "hand:3",
          "speaker": "guanyu",
          "when": "choice:huarong:yeshiB",
          "text": "Sparing him at Huarong was never to make Cao Cao preserve my life today. Guan's honor never collects interest from northern realms."
        },
        {
          "id": "maicheng-slain",
          "at": "hand:3",
          "speaker": "guanyu",
          "when": "choice:huarong:yeshi",
          "text": "Striking him down at Huarong is a deed Guan never regretted. Only today do I realize that slaying one tyrant cannot slay all the scheming under heaven."
        },
        {
          "id": "maicheng-zhouyu",
          "at": "hand:4",
          "speaker": "lvmeng",
          "when": "page:sanqi:yeshi",
          "text": "You allowed Zhou Yu ten more years of breath, yet failed to make Eastern Wu forget Jingzhou. He owed you his life, but I cannot trade a province for it."
        },
        {
          "id": "maicheng-low-split",
          "at": "low",
          "speaker": "you",
          "when": "fact:maicheng_split_letters",
          "text": "Dividing the dispatches was not to await rescuers, but to leave Wu commanders baffled as to which road to block. Before the couriers arrived, decoy forces had sallied."
        },
        {
          "id": "maicheng-low-burn",
          "at": "low",
          "speaker": "you",
          "when": "fact:maicheng_burn_letters",
          "text": "With the letters reduced to ash, Lu Meng can only guess at today's Guan Yu. To break the siege, one's past self must first vanish."
        },
        {
          "id": "maicheng-low-beacon",
          "at": "low",
          "speaker": "you",
          "when": "fact:maicheng_false_beacons",
          "text": "The beacons still blaze. In the instant Lu Meng glances back at the ramparts, the mountain trail beneath the snow slips free of his design."
        }
      ],
      "win": {
        "text": "The west gate of Maicheng swung wide before the snow ceased, and Guan Yu led his remaining vanguard through the crags of Linju. That blade at Huarong Pass, whether it fell or stayed, opened no gates for today; he cast his frayed sword tassel into the snow, and those who survived no longer balanced ancient ledgers against fresh blood. Jingzhou still held a way forward, and the Han had yet another round to play.",
        "hook": "Though Jingzhou was not lost, the dark specter of vengeance remained unquenched. The campfires of Yiling and the final entrustment at Baidi City both await your hand in the next scroll."
      },
      "loss": {
        "text": "Lu Meng calculated your past honor, while Lu Xun calculated your new resolve. One barred your path to relief, while the other awaited your hesitation; when the snowfall cleared, Maicheng remembered only the Guan Yu who refused to change.",
        "clue": "Historical Chronicle · Lu Meng and Lu Xun exploit past favors and retreat routes respectively; Keen Eye increases on restart. The choices made at Huarong Pass yield different counsels.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Dismantle the seven-hundred-li linked camps before Lu Xun sparks the conflagration, showing Liu Bei how many lives exist beyond vengeance.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The canopy of Xiaoting was so dense that not a breath of wind could pierce it. Each stockade bordered the next, as though someone had laid seven hundred li of bitter grievance into a single fuse of fire."
        },
        {
          "speaker": "guanyu",
          "text": "My life at Maicheng was reclaimed by your hand. If you still must march east today, do not use me as your justification for vengeance.",
          "when": "page:maicheng:yeshi"
        },
        {
          "speaker": "liubei",
          "text": "When Yunchang's severed head was carried into Luoyang, I shed no tears. Now, with every camp crying out his name, I can retreat no longer.",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "huangquan",
          "text": "Your Majesty, our navy should spearhead the advance straight downriver; abandoning our vessels to camp amidst dense timber surrenders seven hundred li of living souls to heaven's whims.",
          "when": "!seen:huangquan"
        },
        {
          "speaker": "maliang",
          "text": "King Shamoke of the Five Streams has arrived, and I have re-verified the tactical maps along the Yiling pass. Your Majesty, we await only your single order to relocate camp."
        },
        {
          "speaker": "shamoke",
          "text": "The Emperor of the Great Han stands behind us! In this battle, the spiked mace of the tribal king yields nothing to Wu's waters!"
        },
        {
          "speaker": "luxun",
          "text": "I fear not Lord Liu's fury. The greater his wrath, the more surely he will arrange mountains, forests, linked camps, and mortal hearts into a funeral pyre with his own hands."
        }
      ],
      "intros": {
        "luxun": [
          {
            "when": "page:maicheng:yeshi",
            "bio": "Jingzhou remained intact, yet he still stands guard over Eastern Wu; this confrontation is no longer merely about revenge, yet it can still perish in rash pride.",
            "quote": "Since General Guan still lives, this campaign should not be waged purely for wounded pride."
          },
          {
            "bio": "He cloaks youthful audacity within the robes of a scholar, waiting as Liu Bei links every chance of victory into an infernal fuse.",
            "quote": "Your master demands blood; I demand the safety of Eastern Wu. Where then shall the fire fall?"
          }
        ]
      },
      "map": [
        {
          "id": "move-camps",
          "node": 1,
          "title": "Xiaoting · Moving Camp Before the Blaze",
          "lines": [
            {
              "speaker": "liubei",
              "text": "Ordering the host into the shade of the forest to escape the summer swelter was my decree. To move camp today would make them believe their Emperor quails before Lu Xun."
            },
            {
              "speaker": "zhuge",
              "text": "Your Majesty, Lu Xun's steadfast defense is not cowardice; he waits for us to array our own stockades into firewood. A single isolated outpost may be yielded, but the devotion of seven hundred li cannot be forsaken."
            }
          ],
          "choices": [
            {
              "id": "high-ground",
              "text": "Abandon the woods for high ground, severing linked stockades",
              "detail": "Keen Eye increases this round; remember the tactic of relocating camps",
              "effects": {
                "keenEye": true,
                "fact": "yiling_high_camp"
              }
            },
            {
              "id": "fire-oil",
              "text": "Launch a night raid against Wu flammable oil convoys",
              "detail": "Lu Xun war chest -200; remember the cache of oil",
              "effects": {
                "raid": true,
                "fact": "yiling_fireoil"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "yiling-open",
          "at": "start",
          "speaker": "luxun",
          "text": "The more you hasten the assault, the less I need to hurry. What you wager is not military coin, but how many more days the Shu camp can endure."
        },
        {
          "id": "yiling-anguish",
          "at": "hand:2",
          "speaker": "liubei",
          "text": "If I yield half a step here, will I not betray all those who followed me into Shu and marched east by my side?"
        },
        {
          "id": "yiling-brother",
          "at": "hand:3",
          "speaker": "guanyu",
          "text": "Elder Brother, my life is still here. Do not sacrifice more lives upon my altar.",
          "when": "page:maicheng:yeshi"
        },
        {
          "id": "yiling-counsel",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "The dead do not return merely because more join them in the grave. Look upon the pitch and oil before you gaze upon your vengeance.",
          "when": "!page:maicheng:yeshi"
        },
        {
          "id": "yiling-low",
          "at": "low",
          "speaker": "luxun",
          "text": "At last you deign to look beyond your palisades. Pity that once the blaze roars, even the clearest military decree arrives one step too late."
        }
      ],
      "win": {
        "text": "When the first fire arrow arched across the dusk, the old forest encampments were already desolate. Across the river, Lu Xun gazed upon the scattered redoubts stationed upon the high ridges, finally pocketing the flint he had never struck. Liu Bei pressed no pursuit, commanding his captains merely to tally the names of the living who would return home.",
        "hook": "Yiling did not burn to ash, yet Liu Bei collapsed within Yong'an Palace. On the next page, your adversary bears not even a human name.",
        "choiceFact": "yiling_fire_avoided"
      },
      "loss": {
        "text": "The sea of fire raced along the linked stockades, outrunning every panicked dispatch. Shielding Liu Bei as you retreated toward Baidi City, you finally grasped that Lu Xun had never waited for the east wind—he waited only for the stubborn night when your wrath refused to change.",
        "clue": "Historical Chronicle · Lu Xun uses steadfast defense to drag out blinds, betting upon your reckless haste. False tells decrease on restart; sever the linked camps first.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "baidicheng": {
      "cast": [
        "liubei",
        "zhuge",
        "guanyu",
        "caopi"
      ],
      "objective": "Wrest time back for Liu Bei from mortal sickness, transforming the final entrustment from suspicion and crushing burden back into sacred trust.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The medicinal scent of Yong'an Palace could not stifle the roar of the Yangtze surges. By Liu Bei's pillow rested a half-written imperial testament, its final characters hesitating to touch the silk."
        },
        {
          "speaker": "narrator",
          "text": "Two years earlier, Cao Pi received the jade seal of the Great Han atop the altar of abdication. When the report reached Chengdu, the court pleaded in tears—Liu Bei ascended the throne to preserve the lineage, and for that single cry: 'The Han shall not perish!'"
        },
        {
          "speaker": "caopi",
          "text": "The succession of Shun and Yu—now I understand it fully. After four hundred years, someone must close the chronicles of Han. Xuande, do you still refuse?",
          "when": "!seen:caopi"
        },
        {
          "speaker": "liubei",
          "text": "Yunchang still lives, and Yiling never burned. Yet why am I still lying here? It turns out a man can avoid his mistakes, but he cannot outrun the passage of years.",
          "when": [
            "page:maicheng:yeshi",
            "page:yiling:yeshi"
          ]
        },
        {
          "speaker": "liubei",
          "text": "Yunchang survived, yet the fires of Yiling still raged. Rescuing one beloved name does not exempt us from making the next tragic error.",
          "when": [
            "page:maicheng:yeshi",
            "!page:yiling:yeshi"
          ]
        },
        {
          "speaker": "liubei",
          "text": "Ever since my second brother departed, I felt every day was merely borrowed time. Today, there is nowhere left to borrow from, and I have summoned Adou and Kongming to my bedside.",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "Your Majesty, sickness can be healed, but last words must not be spoken in twisted tests. Whom do you wish to see today—your devoted minister, or a soul to carry the entire realm of Shu on his shoulders alone?"
        }
      ],
      "intros": {
        "Destiny · Failing Health": [
          {
            "when": "page:yiling:yeshi",
            "bio": "Though the flames of Yiling failed to consume the Han, fate substituted medicine bowls and water clocks, slowly claiming Liu Bei breath by breath.",
            "quote": "A man may evade the fires of war, but none escape the march of years."
          },
          {
            "bio": "It deploys no legions and plays no false tricks; it merely steals a fraction of life each day from before the sickbed.",
            "quote": "You could vanquish rival lords, but can you vanquish mortal illness?"
          }
        ]
      },
      "map": [
        {
          "id": "last-words",
          "node": 1,
          "title": "Yong'an Palace · Unfinished Testament",
          "lines": [
            {
              "speaker": "liubei",
              "text": "If I utter 'take the throne yourself if my son proves unworthy,' is it pure trust, or am I crushing you with an empire I cannot bear to release? Kongming, guess whether my brush trembled when writing those words."
            },
            {
              "speaker": "zhuge",
              "text": "If my lord truly trusts Liang, do not frame trust as an iron decree that forbids refusal. What I desire is not to usurp the realm, but for you to bequeath to Adou the burdens he must rightfully shoulder."
            }
          ],
          "choices": [
            {
              "id": "plain-words",
              "text": "Urge him to speak all unspoken truths face to face",
              "detail": "Keen Eye increases this round; remember the sickbed truth",
              "effects": {
                "keenEye": true,
                "fact": "baidi_plain_words"
              }
            },
            {
              "id": "adou-duty",
              "text": "Have Adou read the imperial memorials himself",
              "detail": "Destiny starting morale -1; remember the young master governing",
              "effects": {
                "sow": 1,
                "fact": "baidi_adou_duty"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "baidi-open",
          "at": "start",
          "speaker": "unknown",
          "text": "You can alter the fates of mortal men, but can you alter the rising and setting of the sun?"
        },
        {
          "id": "baidi-trust",
          "at": "hand:2",
          "speaker": "liubei",
          "text": "In this life I wove straw sandals, and I sat upon the imperial throne. At the very end, what terrifies me most is that Adou cannot stand without someone propping him up."
        },
        {
          "id": "baidi-answer",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "Then let him stand on his own two feet today. Liang can counsel and guide him, but Liang cannot live his life for him."
        },
        {
          "id": "baidi-brother",
          "at": "low",
          "speaker": "guanyu",
          "text": "Elder Brother, at Maicheng you did not abandon me. Today you are forbidden from abandoning yourself.",
          "when": "page:maicheng:yeshi"
        },
        {
          "id": "baidi-memory",
          "at": "low",
          "speaker": "liubei",
          "text": "Yunchang, if you were still by my side, would you scold me again for knowing only how to weep?",
          "when": "!page:maicheng:yeshi"
        }
      ],
      "win": {
        "text": "As morning light filtered through Yong'an Palace, Liu Bei pushed aside the bitter bowl and sat upright by his own strength. He struck out the four words 'take the throne yourself' from the testament, writing only that Adou must govern in person and Kongming must speak candidly without reserve. That crushing entrustment that no mortal dared receive was never spoken after all.",
        "hook": "Beyond the sickbed, urgent riders arrived from Nanzhong. Meng Huo refused to submit to imperial authority, yet Kongming declared that the southern king's heart must be captured first.",
        "choiceFact": "liubei_survives"
      },
      "loss": {
        "text": "The testament was completed after all. Zhuge Liang bowed low to receive the decree; Liu Bei finally found peace, yet an entire empire was crushed onto the sleepless nights of one solitary chancellor.",
        "clue": "Historical Chronicle · Lingering malady triumphs through attrition. War chest +150 on restart; protect your own chips first before seeking possibilities beyond entrustment.",
        "clueFx": "supply"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "qiqin": {
      "cast": [
        "zhuge",
        "menghuo"
      ],
      "objective": "Seven battles to capture not just his person, but to guide Meng Huo from fury and suspicion to profound reflection, deciding Nanzhong's dawn with his own lips.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Before the poisonous mists of the Lu River had cleared, the first tripwire had already been strung. Yet Zhuge Liang ordered Meng Huo's wine cup washed clean as well."
        },
        {
          "speaker": "menghuo",
          "text": "However many legions you bring, I have as many mountains to call upon! Nanzhong is no empty wasteland on your parchment maps!"
        },
        {
          "speaker": "zhuge",
          "text": "If I merely sought your formal surrender, a single capture would suffice. What I desire is that once you return, you will never need rebellion to prove your worth."
        }
      ],
      "intros": {
        "menghuo": [
          {
            "when": "page:qiqin:yeshi",
            "bio": "Nanzhong's heart was already won, yet he still willingly returns to the Lu River to see if that genuine submission was a fluke.",
            "quote": "Yielding once does not mean I will let you win seven times again!"
          },
          {
            "when": "seen:menghuo",
            "bio": "He remembers the seven rounds left unfinished last time, and remembers where you released him after every capture.",
            "quote": "Last time we did not finish. The Southern King keeps his word—start from the beginning!"
          },
          {
            "bio": "He has the unyielding stubbornness of his crags and the frankness of strong wine, alongside a proud vow to die rather than whisper 'I submit.'",
            "quote": "Defeat me first before lecturing me about winning hearts!"
          }
        ]
      },
      "map": [
        {
          "id": "heart-of-nanzhong",
          "node": 1,
          "title": "Lu River · Releasing the Man, Winning the Soul",
          "lines": [
            {
              "speaker": "menghuo",
              "text": "When you Han people capture a king, you either execute or imprison him. If you truly release me, are you not afraid I will return with even more warriors?"
            },
            {
              "speaker": "zhuge",
              "text": "I am. That is why I do not merely release you—I want your people to see clearly: upon your return, who controls the salt and grain, who commands the mountain roads, and to whom tomorrow belongs."
            }
          ],
          "choices": [
            {
              "id": "listen-elders",
              "text": "Listen to Nanzhong elders recount ancient customs first",
              "detail": "Keen Eye increases this round; remember the Nanzhong covenant",
              "effects": {
                "keenEye": true,
                "fact": "qiqin_listen"
              }
            },
            {
              "id": "return-salt",
              "text": "Distribute grain and salt, sending captives home",
              "detail": "War chest -100, Meng Huo morale -1",
              "effects": {
                "chips": -100,
                "sow": 1,
                "fact": "qiqin_hearts"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "qiqin-r1",
          "at": "start",
          "speaker": "menghuo",
          "text": "You think a single bout can make me bow my head? The very crags of Nanzhong refuse to submit!",
          "when": "round:1"
        },
        {
          "id": "qiqin-r2",
          "at": "start",
          "speaker": "menghuo",
          "text": "Last time was a hidden tripwire, not true martial skill. If you have the guts, capture me once more!",
          "when": "round:2"
        },
        {
          "id": "qiqin-r3",
          "at": "start",
          "speaker": "menghuo",
          "text": "I lost because of my own carelessness, not to your genius. Next time I will bring rattan armor, venomous springs, and old allies!",
          "when": "round:3"
        },
        {
          "id": "qiqin-r4",
          "at": "start",
          "speaker": "menghuo",
          "text": "You burned our rattan armor, but you cannot burn the heart of Nanzhong! I still yield nothing!",
          "when": "round:4"
        },
        {
          "id": "qiqin-r5",
          "at": "start",
          "speaker": "menghuo",
          "text": "Why do you release me every time I am taken? Do you want me to submit to you, or submit to your Han statutes?",
          "when": "round:5"
        },
        {
          "id": "qiqin-r6",
          "at": "start",
          "speaker": "menghuo",
          "text": "If I march back and raise arms again, it would make Nanzhong seem as though we know nothing but violence. Sit down, and let us finish this game.",
          "when": "round:6"
        },
        {
          "id": "qiqin-r7",
          "at": "start",
          "speaker": "menghuo",
          "text": "No need to release me again. If I lose today, I acknowledge you on behalf of all Nanzhong; if I win, you remain behind to drink a bowl of wine with me.",
          "when": "round:7"
        },
        {
          "id": "qiqin-answer",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "Every time his fury erupts, he questions 'why' once more. Do not silence his questioning; winning hearts begins with honest answers."
        },
        {
          "id": "qiqin-low",
          "at": "low",
          "speaker": "menghuo",
          "text": "You won the chips on the table, but I have not yet surrendered Nanzhong. Again!",
          "when": "!round:7"
        },
        {
          "id": "qiqin-low-seven",
          "at": "low",
          "speaker": "menghuo",
          "text": "If I turn against you now, I would betray those six long roads on which you sent me safely home.",
          "when": "round:7"
        }
      ],
      "win": {
        "text": "On the seventh capture, Meng Huo did not await soldiers to untie his cords; he placed his feathered headdress upon the table with his own hands: 'Chancellor, seven captures are not my disgrace; they are the seven times you believed that I could still heed reason.' He turned and waved toward his kinsmen, and the drums of Nanzhong sounded for the first time not to summon war, but to welcome peace.",
        "hook": "With the south pacified, lanterns blazed in Hanzhong. Zhuge Liang unrolled the 'Memorial on Departing the Army,' preparing to cross the northern ridges.",
        "choiceFact": "menghuo_submits"
      },
      "loss": {
        "text": "Seven releases were worn away into mutual resentment. You captured his body, yet left behind a scarred land of unresolved anger; when the Han legions marched north, plumes of smoke rose once more from the southern mountains.",
        "clue": "Historical Chronicle · Meng Huo's strength increases round by round, yet his doubts also deepen. On restart, hear out his grievances; winning the heart is supreme.",
        "clueFx": "sow"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "qishan": {
      "cast": [
        "zhuge",
        "zhaoyun",
        "caozhen"
      ],
      "objective": "Transform the 'Memorial on Departing the Army' from an epitaph into a beginning, establishing a northern supply road on Mount Qi where both grain and mortal hearts can endure.",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "That day in Longzhong, I spoke of the realm dividing threefold. Now that the Late Emperor has bequeathed his unfinished dream into my hands, I understand that the three kingdoms were never an ultimate answer—only a starting point to lessen the shedding of blood.",
          "when": "page:sangu:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "As many times as the cottage gate swung open, I owed the visitor outside that many answers. Setting forth today is not to prove the Sleeping Dragon's cunning, but to cease writing only of 'tomorrow.'",
          "when": "!page:sangu:yeshi"
        },
        {
          "speaker": "zhaoyun",
          "text": "Chancellor, Zhao Zilong of Changshan can still volunteer for the vanguard. Do not inscribe me as an ancient banner merely gazed upon because my brow has frosted with white."
        },
        {
          "speaker": "caozhen",
          "text": "Zhuge Liang, you inscribed statecraft into a memorial; I have fashioned Mount Qi into a fortress wall. Let us see who is trapped first by their own hand."
        }
      ],
      "intros": {
        "caozhen": [
          {
            "when": "page:qishan:yeshi",
            "bio": "Mount Qi was once breached; he no longer guards passes alone, focusing on locating that newly reconnected grain route.",
            "quote": "Along this very mountain road, I will not permit you passage a second time."
          },
          {
            "bio": "What he defends is not merely Mount Qi, but Wei's established strategy of resting at ease while exhausting the fragile resources of Shu.",
            "quote": "No matter how eloquently the memorial is written, grain wagons do not roll over mountains of their own accord."
          }
        ]
      },
      "map": [
        {
          "id": "road-beyond-fire",
          "node": 1,
          "title": "Mount Qi · March Without Fire",
          "lines": [
            {
              "speaker": "zhaoyun",
              "text": "Cao Zhen painted every one of my banners into his ledger, yet drew too many white hairs upon my head. He imagines a veteran general can only serve as a decoy."
            },
            {
              "speaker": "zhuge",
              "text": "When we first employed fire at Bowang, the generals asked only when we would ignite the woods again. Today we shall use no flame—what Mount Qi contends for is a road that can still be marched next year."
            }
          ],
          "choices": [
            {
              "id": "zhaoyun-feint",
              "text": "Have Zilong feign an advance at Xie Gorge with veteran banners",
              "detail": "Cao Zhen starting morale -1; remember the Changshan feint",
              "effects": {
                "sow": 1,
                "fact": "qishan_zhaoyun_feint"
              }
            },
            {
              "id": "grain-road",
              "text": "Establish supply waystations before advancing the host",
              "detail": "War chest +200; remember the Mount Qi supply route",
              "effects": {
                "chips": 200,
                "fact": "qishan_grain_road"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "qishan-open",
          "at": "start",
          "speaker": "caozhen",
          "text": "Six expeditions to Mount Qi? If you can march six times, I can hold six times. How many six-year spans can your fragile kingdom afford to squander?"
        },
        {
          "id": "qishan-patience",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "He imagines endurance means standing motionless. Far from it. Ensuring that grain and men advance continuously forward—that alone is true endurance."
        },
        {
          "id": "qishan-veteran",
          "at": "hand:3",
          "speaker": "zhaoyun",
          "text": "At Changban Slope I charged seven times in and seven times out, never so posterity would remember only the word 'valor.' Behold today how I return!"
        },
        {
          "id": "qishan-low",
          "at": "low",
          "speaker": "caozhen",
          "text": "You employ neither fire nor sudden ambuscade; can it be that marching step by step, camp by camp, has truly become an unstoppable offensive?"
        }
      ],
      "win": {
        "text": "Before the gates of Mount Qi were breached, the mountain passes came alive: supply depots linked one to the next, while Zhao Yun's veteran standards returned safely from Xie Gorge. Only then did Cao Zhen realize that Zhuge Liang sought not a single breakthrough, but the certainty that he could return every season thereafter.",
        "hook": "With the road opened, the next gateway was named Jieting. Inside his tent, Ma Su had already unfurled his maps, circling the hilltop with bold, heavy ink.",
        "choiceFact": "qishan_road_open"
      },
      "loss": {
        "text": "The 'Memorial on Departing the Army' was swept back onto the desk by mountain gusts. You were bested not by Cao Zhen's ramparts, but by treating the Northern Expedition as a desperate gamble that had to be won in a single stroke, forgetting that mountain paths must be preserved for the years to come.",
        "clue": "Historical Chronicle · Cao Zhen uses Mount Qi to exhaust your patience. False tells decrease on restart; discern when he genuinely holds firm and when he baits you to overextend.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Discern every opening gambit of the youth of Jicheng, welcoming the Northern Expedition's greatest unforeseen treasure into the Shu camp.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Upon the first expedition to Mount Qi, three commanderies responded in submission. Zhuge Liang personally laid an ambush at Tianshui, only to witness a young officer atop the ramparts deploying troops by textbook strategy, seeing through each of the Chancellor's decoys in turn."
        },
        {
          "speaker": "zhaoyun",
          "text": "Ever since Changban Slope, I have rarely met my match. Yet today beneath Tianshui, this youth's spear actually forced me to wheel my mount and withdraw."
        },
        {
          "speaker": "jiangwei",
          "text": "Old General, take no offense. Jiang Wei has studied the Chancellor's treatises since childhood; today, I merely return them in kind on behalf of my comrades guarding the ramparts."
        },
        {
          "speaker": "zhuge",
          "text": "Zilong has been prudent throughout his entire life; any warrior who could force him to 'wheel his mount' is one whom Liang must meet in person."
        },
        {
          "speaker": "guanxing",
          "text": "Chancellor, Xing requests to join the host! Hearing he is of my generation, this blade of mine yearns to cross paths with his steel."
        }
      ],
      "intros": {
        "jiangwei": [
          {
            "when": "seen:jiangwei",
            "bio": "He remembers how you dismantled his opening moves step by step, and now pitches his camp directly along the path you must tread.",
            "quote": "Coming again? This time, the opening move belongs to me."
          },
          {
            "bio": "A youthful commandery officer between Jicheng and Tianshui; his military doctrine was self-taught, but his loyalty is born of his own heart.",
            "quote": "Jiang Wei is here. Whatever stratagem the Chancellor devises, I shall meet it."
          }
        ]
      },
      "map": [
        {
          "id": "young-reader",
          "node": 1,
          "title": "Tianshui · He Is Reading You",
          "lines": [
            {
              "speaker": "zhuge",
              "text": "When Liang deploys decoys, he discerns the deception; when Liang shifts supply routes, he shields the granaries. This youth wages war as though he had read my past treatises page by page."
            },
            {
              "speaker": "weiyan",
              "text": "Chancellor, why expend such trouble? Wenchang shall lead a strike force, storm Jicheng by night, and take him captive in hand!"
            },
            {
              "speaker": "zhangbao",
              "text": "Why is General Wei in such a hurry? What the Chancellor desires is not the stone walls, but the man. My father used to say: what is snatched by force will never yield; what is courted with sincerity endures."
            },
            {
              "speaker": "you",
              "text": "What he currently defends is merely the magistrate's order. To win him, you must first let him discover what his heart truly longs to protect."
            }
          ],
          "choices": [
            {
              "id": "mirror-plan",
              "text": "Counter his tactics using the Chancellor's former treatises",
              "detail": "Keen Eye increases this round; remember the mirror stratagem",
              "effects": {
                "keenEye": true,
                "fact": "tianshui_mirror"
              }
            },
            {
              "id": "open-letter",
              "text": "Deliver a personal handwritten letter from the Chancellor",
              "detail": "War chest +120; Jiang Wei starting morale -1",
              "effects": {
                "chips": 120,
                "sow": 1,
                "fact": "tianshui_letter"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "tianshui-open",
          "at": "start",
          "speaker": "jiangwei",
          "text": "The Chancellor's feints have already been dismantled once by my hand. Are you here for a second lesson?"
        },
        {
          "id": "tianshui-zhaoyun",
          "at": "hand:2",
          "speaker": "zhaoyun",
          "text": "Young man, your spear is swift indeed. Yet you fight to guard Ma Zun's fortress, not the calling of your own heart."
        },
        {
          "id": "tianshui-mirror",
          "at": "hand:3",
          "speaker": "narrator",
          "text": "The formation he arranged from old military texts was countered and locked by that very same text. Staring at the tactical scroll, the youth suddenly realized that what he knew by heart was the soul of the Shu camp.",
          "when": "fact:tianshui_mirror"
        },
        {
          "id": "tianshui-low",
          "at": "low",
          "speaker": "zhuge",
          "text": "Boyue, Liang seeks not to wrest your fortress away. Liang asks only one question: does your art of war long for a realm worthy of wielding it?"
        }
      ],
      "win": {
        "text": "On the day the gates of Jicheng swung open, Jiang Wei rode forth alone to surrender, bowing deeply toward the Shu camp before removing his armor. Zhuge Liang stepped down from his carriage to clasp his hands: 'All that Liang has learned in this life has found its true heir.' Zhao Yun leaned upon his spear and smiled warmly. Henceforth, whenever the Northern Expedition summoned its generals, the roll call featured a youthful name who had read every word of the Chancellor's writings.",
        "hook": "Having gained Jiang Wei, the banners of the Northern Expedition surged forward with renewed fire. Yet upon the war map, the name of Jieting had already begun to glow with an ominous chill."
      },
      "loss": {
        "text": "Eager to win him over, you fell into the youth's counter-stratagem instead. As the gates of Tianshui swung shut, he stood upon the battlements and murmured: 'The Chancellor's genius commands my deepest respect. Yet my spear is drawn only to protect this soil.'",
        "clue": "Historical Chronicle · Jiang Wei triumphs through holding the initiative, not numerical superiority. On restart, send the letter first before setting the snare; let him step forward on his own rather than pursuing him.",
        "clueFx": "sow"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "jieting": {
      "cast": [
        "zhuge",
        "masuo",
        "wangping",
        "zhanghe"
      ],
      "objective": "Guide Ma Su to rewrite 'victory from the heights' into securing the road and water source, holding Jieting and preserving his life before Zhang He arrives.",
      "coldOpen": [
        {
          "speaker": "masuo",
          "text": "Chancellor, 'placing troops in mortal danger to ensure survival' is plainly written in the treatises of war. Gazing down upon Jieting from the summit, however many troops Zhang He brings, I shall shatter them all!"
        },
        {
          "speaker": "wangping",
          "text": "Counselor Ma, the treatises also write of water sources! You circle a peak so high—have you measured how many days a soldier must march downhill just to draw a single cup of water?"
        },
        {
          "speaker": "zhuge",
          "text": "Youchang, what I tasked you to guard is not an elegant tactical diagram upon silk. If today no man dares rebuke your folly, the fault begins with me."
        },
        {
          "speaker": "zhanghe",
          "text": "The more immaculate his banners on the summit, the better. That way, I need only encircle the base of the mountain and wait for thirst to slaughter his host on my behalf."
        }
      ],
      "intros": {
        "zhanghe": [
          {
            "when": "page:jieting:history",
            "bio": "He has already waited out a fatal flaw on the heights of Jieting once; this time, he knows precisely where the water routes will be severed.",
            "quote": "Between the mountain and the water, which one will you surrender to your enemy this time?"
          },
          {
            "bio": "Zhang He contends not for a picturesque hilltop position, but forces you to acknowledge that beyond terrain lie time and mortal thirst.",
            "quote": "Warfare knows no constant form. Yet you treated the mountain as an eternal truth."
          }
        ]
      },
      "map": [
        {
          "id": "water-before-height",
          "node": 1,
          "title": "Jieting · Water Before Heights",
          "lines": [
            {
              "speaker": "masuo",
              "text": "If I heed Wang Ping today, will the entire host mock me as a mere armchair strategist, or will I finally find the courage to admit there was a single page I failed to understand?"
            },
            {
              "speaker": "wangping",
              "text": "Counselor, amending a command brings no dishonor. Ensuring that our brothers live to behold tomorrow's dawn—that alone earns you and me the right to speak of honor."
            }
          ],
          "choices": [
            {
              "id": "joint-order",
              "text": "Have Ma Su and Wang Ping co-sign the defense order",
              "detail": "Zhang He starting morale -1; remember joint command",
              "effects": {
                "sow": 1,
                "fact": "jieting_joint_order"
              }
            },
            {
              "id": "survey-water",
              "text": "Accompany Ma Su in person to survey the water route",
              "detail": "Keen Eye increases this round; remember water source map",
              "effects": {
                "keenEye": true,
                "fact": "jieting_water_survey"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "jieting-open",
          "at": "start",
          "speaker": "zhanghe",
          "text": "Ma Su is camped upon the heights? Then I need not rush an uphill assault. First let me ask how many rounds his waterskins can endure."
        },
        {
          "id": "jieting-wangping",
          "at": "hand:2",
          "speaker": "wangping",
          "text": "Severing the supply road is his feint; testing the water route is his true aim. Do not chase that fluttering decoy banner!"
        },
        {
          "id": "jieting-masuo",
          "at": "hand:3",
          "speaker": "masuo",
          "text": "Relay my order: pitch camp across the main thoroughfare! It is not Wang Ping who has bested me; it is that Jieting matters far more than my personal pride."
        },
        {
          "id": "jieting-low",
          "at": "low",
          "speaker": "zhanghe",
          "text": "The moment you descended the heights, half my victory vanished. To think that beside Zhuge Liang, there still lives someone willing to confess an error."
        }
      ],
      "win": {
        "text": "When Zhang He arrived, the stockade straddling the main road had already locked the pass in an iron grip, while water convoys traveled peacefully through the rear ravine. Ma Su personally struck out the mountaintop redoubt from his map. Zhuge Liang shed no tears; he seated Ma Su beside Wang Ping, guiding them to re-write the defense decree together.",
        "hook": "Jieting held, yet Sima Yi pivoted toward Xicheng. There lay no Ma Su—only a lone zither and gates thrown wide open.",
        "choiceFact": "jieting_held"
      },
      "loss": {
        "text": "Cries of chaos erupted first upon the mountain heights, followed swiftly by cold steel. What Zhuge Liang wept to execute was seemingly not merely Ma Su, but himself—who knew Ma Su loved to flaunt talent, yet still entrusted Jieting into his hands.",
        "clue": "Historical Chronicle · Zhang He feigns attacks on supply routes while genuinely blockading water. On restart, his starting morale is -1; secure your chips first before mounting a counterattack.",
        "clueFx": "sow"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    }
  },
  "4": {
    "kongcheng": {
      "cast": [
        "zhuge",
        "simayi"
      ],
      "objective": "Turn an undefended fortress into an unbearable cost for Sima Yi, using the zither's notes, the wide-open gates, and his own profound suspicion as triple lines of defense.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "The hinges of Xicheng's gates had been freshly oiled, opening without the faintest groan. Within, the elderly and feeble swept the dust; atop the parapet sat a solitary zither."
        },
        {
          "speaker": "simayi",
          "text": "I have dissected the flames of Bowang and the winds of Chibi. Kongming, what ambush have you devised for me today?"
        },
        {
          "speaker": "zhuge",
          "text": "Even without taking Jieting, he still pursues Xicheng like a hound. He comes not to capture Ma Su, but to force me to confess my absolute helplessness.",
          "when": "page:jieting:yeshi"
        },
        {
          "speaker": "zhuge",
          "text": "The grim report of Jieting lies in my sleeve; only the frail and weary sweep below the gate. Zhongda seeks my flaw—so let us present him with one that seems entirely too real.",
          "when": "!page:jieting:yeshi"
        }
      ],
      "intros": {
        "simayi": [
          {
            "when": "page:kongcheng:yeshi",
            "bio": "Having once retreated before Xicheng, every chime of the zither echoes as a reminder of the battle he dared not lose.",
            "quote": "Before the same gates, I will not turn my horse a second time."
          },
          {
            "when": "page:jieting:yeshi",
            "bio": "Denied a swift victory at Jieting, he has come in person to decipher Zhuge Liang's most desperate gambit.",
            "quote": "Because Ma Su stood firm, did you think I could not see through Xicheng?"
          },
          {
            "when": "seen:simayi",
            "bio": "He remembers your wagers, and how his own excessive caution once cost him an undefended prize.",
            "quote": "Will I calculate one layer too few this time, or one layer too deep?"
          },
          {
            "bio": "The Crouching Tiger sits opposite the Sleeping Dragon for the first time, wielding not spear or horse, but the deadly habit of overthinking.",
            "quote": "If the city is truly empty, why dare invite me inside?"
          }
        ]
      },
      "map": [
        {
          "id": "tune-for-sima",
          "node": 1,
          "title": "The Battlements: For Whom the Zither Plays",
          "lines": [
            {
              "speaker": "zhuge",
              "text": "If he advances, I am undone; if he retreats from fear of defeat, we prevail. Clean the gates once more—leave not the slightest trace of deliberate concealment."
            },
            {
              "speaker": "you",
              "text": "What if this time he would rather err than wonder, and marches in just to look?"
            },
            {
              "speaker": "zhuge",
              "text": "Therefore the music cannot merely mimic calm. It must convince his ears that I have factored his refusal to back down into my waiting trap."
            }
          ],
          "choices": [
            {
              "id": "slow-qin",
              "text": "Play the final refrain at a slower, deliberate tempo",
              "detail": "Sima Yi starting Morale -1; remember Slow Melody",
              "effects": {
                "sow": 1,
                "fact": "kongcheng_slow_qin"
              }
            },
            {
              "id": "dust-reinforce",
              "text": "Stir dust along Xie Valley to feign approaching relief forces",
              "detail": "Sima Yi War Funds -200; remember Phantom Dust",
              "effects": {
                "raid": true,
                "fact": "kongcheng_dust"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "kongcheng-open",
          "at": "start",
          "speaker": "simayi",
          "text": "If the city is vacant, you are hollow; if an ambush lurks within, you are lethal. I need only decide which mistake costs me less."
        },
        {
          "id": "kongcheng-zhuge",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "Watch not his hands, but the burden of dread that mounts with every raise. The empty fort sells nothing but his own hesitation."
        },
        {
          "id": "kongcheng-you",
          "at": "hand:3",
          "speaker": "you",
          "text": "He fears not the ambush, but that should he blunder, the world will laugh that he fled an empty gate."
        },
        {
          "id": "kongcheng-low",
          "at": "low",
          "speaker": "simayi",
          "text": "If the string snaps, I advance; if it plays unbroken, I must weigh it still. Kongming, even a broken chord is a deceit you would dare wield against me!"
        }
      ],
      "win": {
        "text": "As the zither's dying notes drifted down the stone walls, Sima Yi finally pulled his reins. Ten miles distant, he looked back at the gaping portal: 'I did not lose to hidden soldiers; I lost to the terror of defeat.' Zhuge Liang's palms were soaked with cold sweat, yet he merely bade his attendant light another stick of incense.",
        "hook": "Both held their breath at the Empty Fort, saving the final reckoning for Wuzhangyuan. Next time, Sima Yi will not listen even to a single chord.",
        "choiceFact": "kongcheng_retreat"
      },
      "loss": {
        "text": "When the Wei cavalry thundered through the gate, the zither still vibrated with its last trembling note. Sima Yi did not laugh, but said softly: 'You wagered I feared failure; this time, I chose to pay the price of being wrong.'",
        "clue": "Historical Mirror: Sima Yi calculates the cost of calling a bluff rather than just posturing. Upon retry, false tells decrease; avoid repeating identical betting lines.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "chencang": {
      "cast": [
        "zhuge",
        "haozhao",
        "weiyan",
        "jiangwei",
        "guanxing"
      ],
      "objective": "Between cloud ladders and fire arrows, uncover Hao Zhao's true reason for holding the bastion, and decide whether Chencang should ever be breached.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Chencang was small yet unyielding, garrisoned by barely a thousand men under Hao Zhao. The Shu forces brought cloud ladders, battering rams, and sapping tunnels in turns, only to have fire arrows strike each down with unerring precision."
        },
        {
          "speaker": "haozhao",
          "text": "For twenty days I have tasted Chancellor Zhuge's siege machines. The city is small, but that means there is all the less to defend."
        },
        {
          "speaker": "zhuge",
          "text": "Hao Bodao defends with peerless skill; brute assault only squanders our soldiers' blood. Boyue, tell me: to besiege a fortress, what must be besieged first?"
        },
        {
          "speaker": "jiangwei",
          "text": "I believe one must first besiege the heart. Hao Zhao's kinsman Jin Xiang is in our ranks; we can send him to urge surrender and test Bodao's resolve."
        },
        {
          "speaker": "weiyan",
          "text": "Twenty days already! If we keep talking, reinforcements from Chang'an will arrive. Chancellor, grant Wen Zhang three days, and I swear I shall tear down this wall!"
        }
      ],
      "intros": {
        "haozhao": [
          {
            "when": "seen:haozhao",
            "bio": "Remembering every one of your siege engines, he has lined the ramparts with three fresh tiers of flame arrows.",
            "quote": "Cloud ladders? Battering rams? Or tunnels underground? I have prepared for them all."
          },
          {
            "bio": "A thousand men holding a lonely fortress defend not stone and mortar, but a solitary pledge of honor.",
            "quote": "Zhao owes his life to Wei; the city stands as long as I draw breath. Pray seek another path, Chancellor."
          }
        ],
        "wangshuang": [
          {
            "when": "seen:wangshuang",
            "bio": "His meteor hammer remembers your officers, but also his own reckless charge.",
            "quote": "Stay close to the vanguard this time! My hammer shows no mercy!"
          },
          {
            "bio": "The giant of Longxi has carried the glory of the vanguard across every frontier.",
            "quote": "Wang Shuang is here! Whose skull is worthy of my hammer?"
          }
        ]
      },
      "map": [
        {
          "id": "siege-letters",
          "node": 1,
          "title": "San Pass: Cloud Ladders and Letters",
          "lines": [
            {
              "speaker": "haozhao",
              "text": "Zhao knows the Chancellor must take Chencang before advancing. Regrettably, this city was entrusted by His Majesty, and Zhao yields not an inch."
            },
            {
              "speaker": "zhuge",
              "text": "Does he refuse to yield out of loyalty to Wei, or because he believes no one behind him will stand? The siege weapons must press on, and so too must our letters."
            },
            {
              "speaker": "guanxing",
              "text": "Chancellor, while escorting grain I counted: the smoke from the city's cooking fires thins with each passing day."
            },
            {
              "speaker": "you",
              "text": "Then let it be a race against time: his provisions running dry, or the vanguard from Chang'an."
            }
          ],
          "choices": [
            {
              "id": "count-smoke",
              "text": "Gauge the fortress supplies by counting cooking smoke",
              "detail": "Keen Eye boosted this round; remember Smoke Count",
              "effects": {
                "keenEye": true,
                "fact": "chencang_smoke"
              }
            },
            {
              "id": "cut-relief",
              "text": "Ambush San Pass to intercept the Chang'an relief army",
              "detail": "Wei forces starting War Funds -200; remember Severed Relief",
              "effects": {
                "raid": true,
                "fact": "chencang_cut"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "chencang-open",
          "at": "start",
          "speaker": "haozhao",
          "text": "Ladders again. Zhao has said it before—try another way, Chancellor."
        },
        {
          "id": "chencang-fire",
          "at": "hand:2",
          "speaker": "narrator",
          "text": "Fire arrows rained like a deluge, burning the cloud ladders row by row. On the ramparts, that gaunt figure had not retreated half a step in twenty days."
        },
        {
          "id": "chencang-shuang",
          "at": "hand:3",
          "speaker": "wangshuang",
          "text": "Hold fast, Hao Zhao! Wang Shuang's relief force has arrived—Curses! How dare the pursuers press so hard?!"
        },
        {
          "id": "chencang-low",
          "at": "low",
          "speaker": "zhuge",
          "text": "Enough. Sound the recall; return to Hanzhong. Though Chencang stands, Liang shall not forget the name of Hao Bodao."
        }
      ],
      "win": {
        "text": "On the retreat road, Wang Shuang gave furious chase, only to crash headlong into the ambush laid at San Pass. With Wang Shuang slain and the Wei host checked, Hao Zhao rested against the parapet, gazing long into the distance. He had held his fortress, while Zhuge Liang preserved the composure of Longxi—in this clash, neither man suffered defeat.",
        "hook": "Though Chencang held, the Northern Expedition did not falter. Upstream along the Wei River, an even grander confrontation gathered its waters—against Sima Yi."
      },
      "loss": {
        "text": "On the twentieth day of the siege, the ladders were reduced to ash, and the relief host from Chang'an descended upon the valley. Beneath the walls of Chencang, you learned the hard truth: some strongholds cannot be stormed, and some commanders cannot be swayed.",
        "clue": "Historical Mirror: Hao Zhao turns defense into an offensive counter, punishing each assault engine. Upon retry, sever reinforcements first and monitor the smoke; let his provisions speak for you.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "shangfanggu": {
      "cast": [
        "zhuge",
        "simayi",
        "simazhao",
        "weiyan",
        "yangyi"
      ],
      "objective": "Lure Sima Yi and his sons into Gourd Valley, and before the deluge falls, let fire speak the final words for Shu.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "On the southern bank of the Wei River, the Shu army cultivated fields while Wei fortified their ramparts. Gourd Valley was stacked high with dry kindling, waiting only for Sima Yi to step inside."
        },
        {
          "speaker": "simayi",
          "text": "Kongming's farming is an invitation to decisive battle; I shall refuse him. If he retreats, I pursue—but only as far as the mouth of the valley."
        },
        {
          "speaker": "simazhao",
          "text": "Father, the Shu supply carts have been moving towards the Northern Plains for days. Allow me to lead a force to test their reality."
        },
        {
          "speaker": "zhuge",
          "text": "Sima Yi does not refuse to come; he merely refuses to come alone. Then give his son a reason that cannot be ignored."
        },
        {
          "speaker": "yangyi",
          "text": "Chancellor, thirty wooden oxen and flowing horses are primed, each discreetly marked. Weigong guarantees not a single one shall truly be lost."
        }
      ],
      "intros": {
        "simayi": [
          {
            "when": "page:kongcheng:yeshi",
            "bio": "After the zither notes of Xicheng, he believed all the more that 'Kongming's retreat hides an ambush'—a suspicion that became your ultimate snare.",
            "quote": "I listened to your zither once. This time, I trust only my eyes."
          },
          {
            "when": "seen:simayi",
            "bio": "He still rests his eyes in contemplation, yet his ears strain to catch every echo—desperate to know every mark you left at the valley mouth.",
            "quote": "Nudge your grain wagons another mile forward. I am watching."
          },
          {
            "bio": "The Crouching Tiger never leaves his lair unless someone outside removes the stone blocking the cave.",
            "quote": "Kongming, oh Kongming, your patience must inevitably yield to your fleeting years."
          }
        ],
        "simazhao": [
          {
            "when": "seen:simazhao",
            "bio": "Having tasted your traps, he halved his father's caution and doubled his own decisive ambition.",
            "quote": "I take half of my father's prudence. The other half, I rewrite."
          },
          {
            "bio": "Accompanying the host, the second son's gaze rests unceasingly on the commander's seat that has scarcely grown warm.",
            "quote": "General Sima Zhao scouts the valley on my father's behalf."
          }
        ]
      },
      "map": [
        {
          "id": "granary-carts",
          "node": 1,
          "title": "Northern Plains: The Bait of Grain Carts",
          "lines": [
            {
              "speaker": "weiyan",
              "text": "Chancellor, the task of luring the prey belongs to Wen Zhang! If Sima Yi enters the gorge, I will lead five hundred men to slam the canyon gates shut!"
            },
            {
              "speaker": "zhuge",
              "text": "With Wen Zhang at the gate, I am at ease. Only remember—once the fires roar, shut the gates swiftly, but reopen them swifter still."
            },
            {
              "speaker": "yangyi",
              "text": "Grain wagons, kindling, and oil—the ledger is complete. Chancellor, Weigong merely offers one reminder: the heavens have seen no rain for three moons."
            },
            {
              "speaker": "you",
              "text": "A rainless sky is fire's ally, but also the prelude to a storm. In this hand, we must win faster than the weather."
            }
          ],
          "choices": [
            {
              "id": "watch-sky",
              "text": "Read the cloud patterns and choose an arid day to strike",
              "detail": "Keen Eye boosted this round; remember Celestial Reading",
              "effects": {
                "keenEye": true,
                "fact": "shangfanggu_sky"
              }
            },
            {
              "id": "burn-carts",
              "text": "Abandon thirty wagons of grain to feign a panicked rout",
              "detail": "Wei forces starting War Funds -200; remember Grain Bait",
              "effects": {
                "raid": true,
                "fact": "shangfanggu_carts"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "shangfanggu-open",
          "at": "start",
          "speaker": "simayi",
          "text": "Grain wagons rolling north, fortifications tilting east. Kongming, every step you take invites me into this gorge."
        },
        {
          "id": "shangfanggu-zhao",
          "at": "hand:2",
          "speaker": "simazhao",
          "text": "Father! Their wagons are in chaos, the Shu soldiers are truly fleeing—pursue or hold, the moment is now!",
          "when": "multi"
        },
        {
          "id": "shangfanggu-fire",
          "at": "hand:3",
          "speaker": "weiyan",
          "text": "Drop the valley gates! Launch the fire arrows! Today we teach the Wei host what it means to enter a tomb with no exit!"
        },
        {
          "id": "shangfanggu-low",
          "at": "low",
          "speaker": "simayi",
          "text": "Trapped... Are father and sons to perish together in this cursed ravine? So be it... so be it!"
        }
      ],
      "win": {
        "text": "When the inferno flared, the game at the canyon mouth had already concluded. Sima Yi raised his eyes to the heavens, dark clouds looming over the ridges—yet this time, the rain fell only after the flames had consumed their toll. Hauled from the embers, he uttered after a long silence: 'Heaven's will endures, but mortal will took the lead.' The Wei host south of the Wei River never ventured forth again.",
        "hook": "The fires of Gourd Valley failed to consume the House of Sima, but burned away their haughty pride. The autumn winds of Wuzhangyuan would soon write the final chapter of this stalemate."
      },
      "loss": {
        "text": "The deluge arrived half a moment before your fire caught. In the drenching rain, father and sons laughed like madmen, their laughter burning hotter than flames. You finally understood: for those who have calculated every mortal factor, losing to the sky cuts the deepest.",
        "clue": "Historical Mirror: Sima Yi probes repeatedly before committing to the gorge. Upon retry, read the sky before lighting the fire; the grain bait reduces his funds by 200—do not let the storm reveal your hand first.",
        "clueFx": "raid"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "wuzhangyuan": {
      "cast": [
        "zhuge",
        "simayi",
        "jiangwei"
      ],
      "objective": "Force Sima Yi to answer before the provisions run out and the autumn wind turns cold, and guide Zhuge Liang back from his fated falling star.",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "At Bowang I borrowed fire; at Chibi I borrowed the wind. All my life I have borrowed from the heavens. No longer. If you contest a single day for me, I shall live that day to its fullest."
        },
        {
          "speaker": "simayi",
          "text": "At Xicheng I turned back too hastily; this time, I will not even listen to your zither. The day your grain runs out is the hour my army strikes.",
          "when": "page:kongcheng:yeshi"
        },
        {
          "speaker": "simayi",
          "text": "I ask not what ambush you hide, nor what brilliant stratagem you brew. At Wuzhangyuan, there is only one contest: who depletes first.",
          "when": "!page:kongcheng:yeshi"
        },
        {
          "speaker": "jiangwei",
          "text": "Chancellor, the medicinal brew has cooled again. You always promise to finish just one more dispatch, yet the dispatches never end."
        }
      ],
      "intros": {
        "simayi": [
          {
            "when": "asZhuge",
            "bio": "This time you raise the feather fan with your own hand; the Crouching Tiger need no longer guess at the Sleeping Dragon's visage across the river.",
            "quote": "Kongming, you have finally deigned to sit across from me in person."
          },
          {
            "when": "page:wuzhangyuan:yeshi",
            "bio": "Having seen the southeastern star stay ablaze, he knows destiny can be wrested away, yet still believes he understands attrition better than any man.",
            "quote": "Borrowed years are still years. I can still outlast you."
          },
          {
            "when": "page:kongcheng:yeshi",
            "bio": "His retreat at the Empty Fort left an enduring scar; now he tempers that wound into inexhaustible patience behind stone ramparts.",
            "quote": "Last time I calculated your city; this time, I calculate only your grain."
          },
          {
            "bio": "Treating refusal to engage as his longest-held wager, he waits for the autumn wind to sweep away the chips across the table.",
            "quote": "You may win every skirmish; I need only outlive the final night."
          }
        ]
      },
      "map": [
        {
          "id": "one-more-day",
          "node": 1,
          "title": "Wugong Waters: Borrowing a Day from the World",
          "lines": [
            {
              "speaker": "jiangwei",
              "text": "As he refuses battle, the officers urge the Chancellor to provoke him again. Yet the more we press, the more it seems the autumn wind favors the Wei camp."
            },
            {
              "speaker": "zhuge",
              "text": "Boyue, cultivating the fields is no surrender. If the soldiers know next year brings grain, and the common folk know this year brings peace, I need not plead with the night sky for more years."
            }
          ],
          "choices": [
            {
              "id": "tuntian",
              "text": "Tillage among the people: let the supply lines grow from the soil",
              "detail": "War Funds +200; remember Wei River Tillage",
              "effects": {
                "chips": 200,
                "fact": "wuzhang_tuntian"
              }
            },
            {
              "id": "raid-grain",
              "text": "Launch a strike through Xie Valley to sever the Wei supply line",
              "detail": "Sima Yi War Funds -200; remember Counter-Raid",
              "effects": {
                "raid": true,
                "fact": "wuzhang_counterraid"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "wuzhang-open",
          "at": "start",
          "speaker": "simayi",
          "text": "Send women's garments, and I will don them before all my generals. That which provokes a man to wrath is never victory or defeat."
        },
        {
          "id": "wuzhang-zhuge",
          "at": "hand:2",
          "speaker": "zhuge",
          "text": "He lacks not courage; he has simply priced my mortality into his blinds. Do not wait with him—force him to bleed silver every time he folds."
        },
        {
          "id": "wuzhang-jiangwei",
          "at": "hand:7",
          "speaker": "jiangwei",
          "text": "Chancellor, the southeastern star has not faded! Drink your medicine; I will stand with you through this hand."
        },
        {
          "id": "wuzhang-tuntian-low",
          "at": "low",
          "speaker": "zhuge",
          "text": "Zhongda, the autumn harvest fills our granaries. The cold wind you have been awaiting will arrive late this year.",
          "when": "fact:wuzhang_tuntian"
        },
        {
          "id": "wuzhang-sima-low",
          "at": "low",
          "speaker": "simayi",
          "text": "You wish the star to blaze for another ten years; I only need it to dim for a single heartbeat. Let us see who breaks first.",
          "when": "!fact:wuzhang_tuntian"
        }
      ],
      "win": {
        "text": "The lamp at Wuzhangyuan did not go out. Sima Yi finally rode forth, only to lose his vanguard along the banks of the Wugong River; Zhuge Liang seized the moment to press army and supply lines forward in unison. At dawn, he pushed aside his medicine bowl and drafted a different Memorial on the Northern Expedition—not pleading for another decade, but resolving never again to surrender tomorrow to fate.",
        "hook": "Fourteen years pass like a dream. In Luoyang, an old fox begins to feign illness; this time, the Sleeping Dragon still breathes, and the grand game remains unsettled.",
        "choiceFact": "zhuge_survives"
      },
      "loss": {
        "text": "When the southeastern star dimmed into darkness, Sima Yi still had not left his camp. He did not defeat you in any single clash; he merely dragged every 'tomorrow' into a cold blind under the autumn wind.",
        "clue": "Historical Mirror: Defensive walls grind blinds into daggers. Upon retry, War Funds +150; seize provisions early, and never match him in a contest of starvation.",
        "clueFx": "supply"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "gaopingling": {
      "cast": [
        "simayi",
        "caoshuang",
        "simashi",
        "zhuge"
      ],
      "objective": "See through an illness staged purely for Cao Shuang's eyes; safeguard the imperial edict, the armory, and the final choices of Cao Wei before Sima Yi opens his eyes.",
      "coldOpen": [
        {
          "speaker": "zhuge",
          "text": "After Wuzhangyuan, he and I exchanged letters for many years. Today, only four words arrived: 'Doubt his ailment.' He is not awaiting death; he is waiting for you to treat him as a corpse.",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "speaker": "writer",
          "text": "The star of Wuzhangyuan has already fallen. Now no one watches the Crouching Tiger for you, leaving only a bowl of porridge deliberately spilled across trembling hands.",
          "when": "!page:wuzhangyuan:yeshi"
        },
        {
          "speaker": "caoshuang",
          "text": "He cannot even swallow porridge; how could he seize my military command? I visited him three times, and found the same pitiful sight each time."
        },
        {
          "speaker": "simashi",
          "text": "With father so gravely stricken, I must shoulder the family burdens alone. If the General harbors doubts, why not pay another visit yourself?",
          "when": "!seen:simashi"
        },
        {
          "speaker": "simayi",
          "text": "Grand General... this old decrepit has only one lingering worry. When tomorrow comes... I pray you will look after my two sons."
        }
      ],
      "intros": {
        "simayi": [
          {
            "when": "page:gaopingling:yeshi",
            "bio": "Having suffered defeat at Gaoping Tomb once, he no longer merely feigns illness; your very skepticism may become a piece in his grand design.",
            "quote": "The same draught of medicine will not be brewed a second time."
          },
          {
            "when": "page:wuzhangyuan:yeshi",
            "bio": "Unable to outlast the Sleeping Dragon at Wuzhangyuan, he brought his bottomless patience back to Luoyang, lying in wait for an arrogant prey.",
            "quote": "Kongming still lives? Splendid. I shall show him that enduring is more than mere longevity."
          },
          {
            "bio": "Having outlived countess rivals, he disguises frailty as his ultimate armor, nurturing Cao Shuang's contempt into a fatal blade.",
            "quote": "This old fool is terribly sick. Grand General, you may naturally rest at ease."
          }
        ]
      },
      "map": [
        {
          "id": "medicine-and-armory",
          "node": 1,
          "title": "Gaoping Tomb: Blades Beyond the Sickbed",
          "lines": [
            {
              "speaker": "caoshuang",
              "text": "If he feigns illness, he fools me; if he is truly ill and I strike now, I stand condemned for bullying a venerable elder. What would you have me do?"
            },
            {
              "speaker": "zhuge",
              "text": "After Wuzhangyuan, I taught him only one lesson: patience is also a wager. If you refuse to check the hole cards, you will mistake his forbearance for heaven's decree.",
              "when": "page:wuzhangyuan:yeshi"
            },
            {
              "speaker": "writer",
              "text": "Without the Sleeping Dragon's warning across the river, you must discern for yourself: was that porridge fed to a dying invalid, or to your fatal conceit?",
              "when": "!page:wuzhangyuan:yeshi"
            }
          ],
          "choices": [
            {
              "id": "read-prescription",
              "text": "Compare medicinal formulas, guard shifts, and servants feeding the porridge",
              "detail": "Keen Eye boosted this round; remember Sickbed Forgery",
              "effects": {
                "keenEye": true,
                "fact": "gaoping_medicine"
              }
            },
            {
              "id": "guard-armory",
              "text": "Secure the Empress Dowager's edict and the Luoyang Armory beforehand",
              "detail": "Sima Yi War Funds -150; remember Seizing the Gate",
              "effects": {
                "oppChips": -150,
                "fact": "gaoping_armory"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "gaoping-open-alive",
          "at": "start",
          "speaker": "simayi",
          "text": "Kongming still lives, and you still love to meddle. It seems I truly conceded that hand at Wuzhangyuan with great reluctance.",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-open-fallen",
          "at": "start",
          "speaker": "simayi",
          "text": "Kongming is gone. Who among you still dares to regard a dying old man as a worthy adversary?",
          "when": "!page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-caoshuang",
          "at": "hand:2",
          "speaker": "caoshuang",
          "text": "He was pretending all along?! But the entire court saw him... why did you not speak sooner?!"
        },
        {
          "id": "gaoping-letter",
          "at": "hand:3",
          "speaker": "zhuge",
          "text": "If you only wait for him to die, you will never perceive how he truly lives.",
          "when": "page:wuzhangyuan:yeshi"
        },
        {
          "id": "gaoping-low",
          "at": "low",
          "speaker": "simayi",
          "text": "You saw through my infirmity, but not the terror of the court. Once the blades are drawn, they will naturally flock to my side."
        }
      ],
      "win": {
        "text": "The porridge bowl shattered on the floor, and Sima Yi leapt to his feet—only to find the armory gates bolted and the Empress Dowager's edict proclaimed aloud. Cao Shuang did not surrender his seals, and the court was spared a bloody purge where men were forced to choose sides. For the first time, the Crouching Tiger realized that a room full of clever ministers would not all willingly play along with his slumber.",
        "hook": "The blades of the Sima clan returned temporarily to their sheaths, yet the Three Kingdoms knew no rest. Years later, down the treacherous precipices of Yinping, rolled the thunder of sheepskin-wrapped warriors.",
        "choiceFact": "sima_coup_stopped"
      },
      "loss": {
        "text": "Before the altar of the Luoshui River, Sima Yi pointed to the flowing waters and swore: 'I seek only the General's surrender of arms.' Cao Shuang threw down his sword, but the butcher's knife showed no mercy for naive trust. Three clans were erased in a single night; the era of Wei had lost its surname.",
        "clue": "Historical Mirror: Sima Yi's greatest weapon at Gaoping Tomb is 'waiting for you to drop your guard.' Upon retry, read the prescriptions first and secure the armory; never trade with a tiger at an altar.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "tielongshan": {
      "cast": [
        "jiangwei",
        "simazhao",
        "guohuai",
        "xiahouba",
        "zhangyi"
      ],
      "objective": "To besiege Mt. Tielong, one must first outmaneuver those who come to break the siege—preserve this vital piece in Longxi for Jiang Wei.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Jiang Wei formed ranks with his back to the river, crushing the Wei host at the Tao River and trapping Sima Zhao atop Mt. Tielong. The mountain lacked water, yet the valley below brought the fire of Qiang tribesmen."
        },
        {
          "speaker": "jiangwei",
          "text": "Sima Zhao is stranded upon a waterless crag; he must yield within three days. My only dread is Guo Huai's relief column borrowing passage through the Qiang lands."
        },
        {
          "speaker": "simazhao",
          "text": "Digging thirty cubits into rock yields not a drop... Father always said, in desperation, calculate the rescue first. Guo Boji, will you arrive in time?"
        },
        {
          "speaker": "guohuai",
          "text": "The Qiang are fickle, serving Wei or Shu as fortune blows. I need not crush Jiang Wei in battle; I need only turn the Qiang fire against his own camp.",
          "when": "!seen:guohuai"
        },
        {
          "speaker": "xiahouba",
          "text": "Boyue! Xiahou Ba has served Shu for three years, and only today do I understand: every inch of Longxi is an old acquaintance."
        }
      ],
      "intros": {
        "guohuai": [
          {
            "when": "seen:guohuai",
            "bio": "The veteran of Dingjun Mountain still remembers your ridges, this time hiding his relief army within Qiang pavilions.",
            "quote": "Last time you seized the high ground. This time, I borrowed the wind."
          },
          {
            "bio": "Thirty years in the western marches, he understands the art of borrowing: borrowing the Qiang, borrowing the water, borrowing your patience in the siege.",
            "quote": "Guo Huai does not contest your siege. I merely dismantle it."
          }
        ],
        "simazhao": [
          {
            "when": "page:shangfanggu:yeshi",
            "bio": "The rain at Gourd Valley saved him once; ever since, he believes 'desperate traps carry heaven's grace.'",
            "quote": "Trapping me again? The rain from last time will fall once more."
          },
          {
            "when": "seen:simazhao",
            "bio": "Having tasted the misery of encirclement, his composure on the peak is unnervingly unnatural.",
            "quote": "Surround me for three days? I can wait. Can you?"
          },
          {
            "bio": "The besieged second son does not panic, for his very tranquility serves as a phantom garrison.",
            "quote": "General Jiang, the mountain is high and the wind is fierce; your grain will scatter in the breeze."
          }
        ]
      },
      "map": [
        {
          "id": "qiang-road",
          "node": 1,
          "title": "Tao River: The Road of the Qiang",
          "lines": [
            {
              "speaker": "xiahouba",
              "text": "Boyue, the Qiang and the Wei have traded glances for three days. Zhongquan has watched Yongzhou for half a lifetime—they recognize grain, not banners."
            },
            {
              "speaker": "jiangwei",
              "text": "I fight with my back to the river and have no retreat. If the Qiang tilt toward Guo Huai, the mountain siege will reverse its teeth."
            },
            {
              "speaker": "zhangyi",
              "text": "General, Zhang Yi is willing to lead a detachment to choke the Qiang path. My rank is humble, but this move cannot falter."
            },
            {
              "speaker": "you",
              "text": "A besieger fears two things: water on the mountain, and roads outside the gorge. He has found no water; the road remains in your hands."
            }
          ],
          "choices": [
            {
              "id": "hold-qiang",
              "text": "Stabilize the Qiang tribes first to sever Guo Huai's passage",
              "detail": "Keen Eye boosted this round; remember Value of the Qiang Road",
              "effects": {
                "keenEye": true,
                "fact": "tielongshan_qiang"
              }
            },
            {
              "id": "rush-hill",
              "text": "Storm the mountain camp swiftly while they thirst for water",
              "detail": "War Funds +150; mountain defenders Morale -1",
              "effects": {
                "chips": 150,
                "sow": 1,
                "fact": "tielongshan_rush"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "tielongshan-open",
          "at": "start",
          "speaker": "simazhao",
          "text": "Jiang Wei, you can bottle up the mountain, but you cannot bottle up the sky. In three days, news of your defeat will arrive."
        },
        {
          "id": "tielongshan-guo",
          "at": "hand:2",
          "speaker": "guohuai",
          "text": "The Qiang tents have answered my summons. General Jiang, does anyone still guard your back?"
        },
        {
          "id": "tielongshan-wing",
          "at": "hand:3",
          "speaker": "zhangyi",
          "text": "The Qiang road remains under my grip! General, focus on the heights—no Qiang warrior breaches Zhang Yi's line!",
          "when": "fact:tielongshan_qiang"
        },
        {
          "id": "tielongshan-low",
          "at": "low",
          "speaker": "jiangwei",
          "text": "Chancellor, Wei has fallen one step short again... No! That missing step, Wei shall cross on my own feet!"
        }
      ],
      "win": {
        "text": "The Qiang road held firm, and Guo Huai's gambit collapsed. Atop Mt. Tielong, Sima Zhao quenched his parched lips with the very last drops of water, then gazed down upon the immovable Shu fortifications before offering terms of withdrawal. Jiang Wei did not pursue—with the Tao River secured, fortress after fortress across Longxi opened its gates, broadening the Northern Expedition's horizon once more.",
        "hook": "Before the smoke of Longxi could settle, rebellious proclamations from Huainan reached Luoyang—across four years, three identical fires would blaze across the realm of Wei."
      },
      "loss": {
        "text": "The Qiang flames swept from your rear, and Guo Huai's iron cavalry shattered the siege. Down the slopes rushed Sima Zhao's refreshed host, pinning Jiang Wei against the Tao River. You learned once more: a cage without a lock traps only yourself.",
        "clue": "Historical Mirror: Mt. Tielong hinges on 'intercepting relief rather than rushing the peak.' Upon retry, hold the Qiang road and check Guo Huai; do not exhaust your chips on the mountain walls.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "In the chained uprisings of Huainan, discern the fine boundary between righteous loyalty and sheer opportunism, and guide the manifesto to where it belongs.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Two years after Sima Yi's death, the first manifesto condemning the traitors was hoisted in Huainan. Across the following four years, the identical flame flared three times upon this soil."
        },
        {
          "speaker": "guanqiujian",
          "text": "Sima Shi deposes the Emperor and usurps authority—heaven and earth cannot tolerate this! The six armies of Huainan ask only one question today: do you stand with Wei, or with Sima?"
        },
        {
          "speaker": "simashi",
          "text": "Huainan rebels once more. The mantle left by my father shall be gathered by Shi. Though the tumor in my eye pains me to the bone, I must command this campaign in person."
        },
        {
          "speaker": "wenqin",
          "text": "General Guanqiu, Wen Qin and my son lead three thousand cavalry, eager to serve as vanguard! We will strike their center and take Sima Shi alive!"
        },
        {
          "speaker": "wenyang",
          "text": "Father, during the night raid, my spear will strike first. The Wei banners over Yuejia shall change before morning!"
        }
      ],
      "intros": {
        "guanqiujian": [
          {
            "when": "seen:guanqiujian",
            "bio": "The veteran general who carved stone in Liaodong still waits for a second manifesto that none dare answer.",
            "quote": "No matter how hard the stone, it must be carved a second time."
          },
          {
            "bio": "He etched glory in Liaodong; now he carves the treason of the Sima clan.",
            "quote": "Once this manifesto flies, success lies with heaven, but righteousness remains mine."
          }
        ],
        "wenqin": [
          {
            "bio": "A brave yet rash warrior of Qiao Commandery, whose roar is as vast as his courage.",
            "quote": "Those who fear death bear not the name Wen! Charge!"
          }
        ],
        "zhugedan": [
          {
            "when": "seen:zhugedan",
            "bio": "Having witnessed the blaze of Shouchun once, he raised the city walls another three paces.",
            "quote": "Defend once more. After all, the world only remembers that I rebelled."
          },
          {
            "bio": "The 'hound' of the Zhuge clan snaps the fiercest, and stands the loneliest.",
            "quote": "Better to be a headless ghost of Wei than take the name of Sima!"
          }
        ],
        "wenyang": [
          {
            "bio": "An eighteen-year-old spear, the waking nightmare of all who pursue.",
            "quote": "Who dares give chase? Wen Yang is here!"
          }
        ],
        "leshen": [
          {
            "bio": "He holds the Huainan left by his father, safeguarding the lintel of Yue Jin's lineage.",
            "quote": "I have not altered my father's battle formation by half a step."
          }
        ]
      },
      "map": [
        {
          "id": "three-fires",
          "node": 1,
          "title": "Xiangcheng: The Fires of a Common Name",
          "lines": [
            {
              "speaker": "simazhao",
              "text": "My elder brother bears a tumor in his eye, yet marches in person to Huainan. I remain in Luoyang—not from cowardice, but to watch every pair of eyes in the imperial court."
            },
            {
              "speaker": "guanqiujian",
              "text": "The first revolt fell to supplies, the second to distrust, and the third... this old man will not live to see. Let those who come after complete my manifesto."
            },
            {
              "speaker": "wenyang",
              "text": "The day Shouchun fell, I rode alone, breaking their ranks seven times in and out. When father bade me flee, I fled—to keep this life, and rebel again!"
            },
            {
              "speaker": "you",
              "text": "Three fires burn for the same cause. What you must read is: which plume of smoke is loyalty, and which is merely resentment."
            }
          ],
          "choices": [
            {
              "id": "read-manifesto",
              "text": "Scrutinize the manifesto signatures and the grain ledgers",
              "detail": "Keen Eye boosted this round; remember Truth of the Manifesto",
              "effects": {
                "keenEye": true,
                "fact": "huainan_read"
              }
            },
            {
              "id": "aid-shouchun",
              "text": "Escort the manifesto east to forge an alliance with Eastern Wu",
              "detail": "War Funds +150; remember Alliance Covenant",
              "effects": {
                "chips": 150,
                "fact": "huainan_wu"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "huainan-open",
          "at": "start",
          "speaker": "guanqiujian",
          "text": "Generals of Wei, soldiers of Sima—gentlemen, whose command does your blade truly serve?!"
        },
        {
          "id": "huainan-yang",
          "at": "hand:2",
          "speaker": "wenyang",
          "text": "A hundred riders in pursuit? Wen Yang turns his horse—form a line, and take your turns at my spear!",
          "when": "round:2"
        },
        {
          "id": "huainan-dan",
          "at": "hand:3",
          "speaker": "zhugedan",
          "text": "Shouchun has grain enough for a year. The Sima family's blades will blunt and freeze long before we yield!",
          "when": "round:2"
        },
        {
          "id": "huainan-low",
          "at": "low",
          "speaker": "simazhao",
          "text": "It was not I who killed them. It was the word 'wait'—waiting for relief, waiting for fate, waiting for others to gamble their lives first."
        }
      ],
      "win": {
        "text": "The manifesto reached Luoyang, haunting the dreams of the imperial historians. Three fires failed to bring down the Sima family, yet branded the characters of 'Wei' deeper into the stone: even their soldiers began to remember that they had once served Cao. Sima Shi pulled the bandages from his ruined eye, realizing the pain ran far deeper than flesh.",
        "hook": "With the flames of Huainan extinguished thrice, the young Emperor in Luoyang could endure no longer—he resolved to lead the dragon banner through the palace gates with his own hands."
      },
      "loss": {
        "text": "The three rebellions collapsed one after another, and Shouchun changed banners thrice. You remembered the header of each fiery manifesto, yet failed to anticipate: Wu's reinforcements always arrived a moment too late, while the Sima clan's executioner swung swifter each time.",
        "clue": "Historical Mirror: The defeat of Huainan stemmed not from lack of support, but from 'everyone waiting on someone else.' Upon retry, read the manifesto first to distinguish leader from follower; Wen Yang's spear is the final defense, not the entire city.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "ganlu": {
      "cast": [
        "caomao",
        "simazhao",
        "jiachong",
        "wangshen"
      ],
      "objective": "Preserve a final retreat for the Emperor before the Southern Gate—or an unyielding death worthy of the history scrolls.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "In the fifth year of Ganlu, the twenty-year-old Emperor Cao Mao unsheathed his sword in the palace hall, declaring before his ministers: 'Sima Zhao's ambition is known to every passerby on the street.'"
        },
        {
          "speaker": "caomao",
          "text": "I cannot sit and wait for deposition. Today I march with you to punish this traitor!"
        },
        {
          "speaker": "jiachong",
          "text": "Your Grace, do not be alarmed. The Emperor wielding a sword is nothing more than a child's tantrum. Feeding soldiers for a thousand days is meant for this single hour.",
          "when": "!seen:jiachong"
        },
        {
          "speaker": "wangshen",
          "text": "Your Majesty... Shen deserves ten thousand deaths. Yet in this matter, Shen... Shen must depart first."
        },
        {
          "speaker": "caomao",
          "text": "My resolve is taken. Even should imperial blood stain the palace walls today, upon the historian's brush, the name of 'Wei' shall never fade!"
        }
      ],
      "intros": {
        "jiachong": [
          {
            "when": "seen:jiachong",
            "bio": "Remembering the spear that hesitated mid-air last time, he issues no order to halt this day.",
            "quote": "No mercy this time. Eliminate the variable first."
          },
          {
            "bio": "He never holds a blade with his own hands, only ensuring the weapon is placed into the most compliant grip.",
            "quote": "Jia Chong is here. Your Majesty, do not make things difficult for your servants."
          }
        ],
        "simazhao": [
          {
            "when": "page:tielongshan:yeshi",
            "bio": "The siege at Mt. Tielong taught him a shell of modesty; now the shell is thicker, and the blade is closer.",
            "quote": "All who have trapped me must die. Does the Emperor believe himself an exception?"
          },
          {
            "when": "seen:simazhao",
            "bio": "Having crossed blades with you many times, he leans this time upon the grand threshold of the entire Sima lineage.",
            "quote": "Again? Your 'rewriting'... I wish to see which page it can reach."
          },
          {
            "bio": "The man standing one pace from the throne despises nothing more than being reminded that his mandate lacks legitimacy.",
            "quote": "The Emperor's personal expedition? What a grand show. A pity the tally of arms rests with me."
          }
        ],
        "wangshen": [
          {
            "when": "seen:wangshen",
            "bio": "His brush could not wait until dawn last time, dipping into ink even earlier tonight.",
            "quote": "Shen's memorials have already been drafted in duplicate. The one meant for the Duke of Jin departs first."
          },
          {
            "bio": "The brush of a noble historian lineage falls decisively between honor and family prestige.",
            "quote": "Wang Shen has a memorial to present."
          }
        ]
      },
      "map": [
        {
          "id": "dragon-poem",
          "node": 1,
          "title": "Taiji Hall: Poem of the Submerged Dragon",
          "lines": [
            {
              "speaker": "caomao",
              "text": "'Grievous is the dragon trapped, unable to leap the abyss.' ...No matter how finely phrased, it is merely mourning my own tomb."
            },
            {
              "speaker": "you",
              "text": "Your Majesty, poems can endure, but you cannot leave yourself with only one path. Beyond these palace walls, does anyone still heed the Emperor?"
            },
            {
              "speaker": "caomao",
              "text": "Whether they heed or not, I must make this charge. Imperial scribe, take your brush—record every stroke truthfully today!"
            },
            {
              "speaker": "jiachong",
              "text": "The soldiers at the Southern Gate answer only to Cheng Ji. And Cheng Ji answers only to me."
            }
          ],
          "choices": [
            {
              "id": "rally-old-guard",
              "text": "Rally the three thousand veterans of the imperial guard",
              "detail": "War Funds +150; remember Heart of the Old Court",
              "effects": {
                "chips": 150,
                "fact": "ganlu_rally"
              }
            },
            {
              "id": "read-halberd",
              "text": "Keep eyes locked on Cheng Ji's grip upon his halberd",
              "detail": "Keen Eye boosted this round; remember The Poised Halberd",
              "effects": {
                "keenEye": true,
                "fact": "ganlu_halberd"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "ganlu-open",
          "at": "start",
          "speaker": "caomao",
          "text": "I am the Son of Heaven! Who dares commit regicide—who dares?!"
        },
        {
          "id": "ganlu-chee",
          "at": "hand:2",
          "speaker": "jiachong",
          "text": "The Duke of Sima has fed you all for this very day! Strike down the chariot!",
          "when": "multi"
        },
        {
          "id": "ganlu-halberd",
          "at": "hand:3",
          "speaker": "narrator",
          "text": "Cheng Ji's halberd rose. Every armored warrior across the avenue watched—looking at their Emperor, and looking at the spear, waiting to see whom it obeyed.",
          "when": "fact:ganlu_halberd"
        },
        {
          "id": "ganlu-low",
          "at": "low",
          "speaker": "caomao",
          "text": "If the halberd strikes, the history brush records; if I die, the name of 'Wei' endures. Come then—I stand here!"
        }
      ],
      "win": {
        "text": "Beneath the Southern Gate, Cheng Ji's halberd never fell—you cried out his father's name before the crowd, tearing through the ruthless order that recognized only a warlord. The armored ranks parted in clamorous hesitation; Jia Chong's sleeves hung empty for the first time. Sword in hand, the Emperor stood tall at the palace gate, and the scribe dipped his brush in fresh ink: 'In the fifth year of Ganlu, the Emperor attacked the traitors, and the usurpers scattered.' The state of Wei still breathed—and that breath bore the name of Cao.",
        "hook": "The Emperor's blood did not spill, yet the patience of the Sima clan reached its breaking point. The final names of Wei, Shu, and Wu would soon be gathered into a single chronicle."
      },
      "loss": {
        "text": "The halberd struck. Imperial blood splashed across the paving stones of the Southern Gate, refusing to fade for three days. Hearing the news, Sima Zhao feigned profound shock and executed Cheng Ji's three clans—sheathing both the blade and the guilt in one clean stroke.",
        "clue": "Historical Mirror: Jia Chong triumphs by 'severing your senses first.' Upon retry, watch the halberd and rally the veterans; beyond victory or defeat, this page wagers on the next line of history.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "jiange": {
      "cast": [
        "jiangwei",
        "zhonghui",
        "liaohua",
        "zhangyi"
      ],
      "objective": "Stem Zhong Hui's grand host at the natural rampart of Sword Gate Pass, and guard the Shu Han against the fatal word: 'flank'.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "One hundred and eighty thousand Wei troops pressed upon Sword Gate Pass, where Jiang Wei held the gorge. Zhong Hui's declarations were elegantly worded, yet Sword Gate answered only with arrows."
        },
        {
          "speaker": "zhonghui",
          "text": "Jiang Boyue, in defending a solitary pass, do you defend loyalty or bitter resentment? Surrender the gates, and I guarantee you a marquisate."
        },
        {
          "speaker": "jiangwei",
          "text": "Zhong Shiji's prose is prettier than your scaling ladders. Yet Sword Gate has only one path—your army cannot deploy."
        },
        {
          "speaker": "liaohua",
          "text": "I have retreated all the way from Maicheng to Sword Gate over forty long years. At this pass, Yuanjian retreats no more!"
        },
        {
          "speaker": "zhangyi",
          "text": "General, Zhang Yi must speak once more: the Yinping trail must not be left unguarded! If Deng Ai slips past, no matter how steep Sword Gate is, it will become an open door!"
        }
      ],
      "intros": {
        "zhonghui": [
          {
            "when": "seen:zhonghui",
            "bio": "Remembering every banner before the pass, he has written three additional pages to his letters of surrender.",
            "quote": "This time, I have conceived even the retreat road for your surrender."
          },
          {
            "bio": "The pampered prodigy of Yingchuan, his brush quicker than his sword, and his ambition quicker than both.",
            "quote": "Taking Shu is like plucking a plum from a bough. Compete, gentlemen, to claim the crown!"
          }
        ]
      },
      "map": [
        {
          "id": "pass-and-flank",
          "node": 1,
          "title": "Sword Gate: The Pass and the Flank",
          "lines": [
            {
              "speaker": "zhangyi",
              "text": "General, leave the front to me. But I must say the ugly truth: Deng Ai is at Tazhong, and if he bypasses the main road—"
            },
            {
              "speaker": "jiangwei",
              "text": "Rest easy, Bogong. I left sentries at Yinping and scouts at Jiangyou. Sword Gate defends not merely a gateway, but an entire wall."
            },
            {
              "speaker": "liaohua",
              "text": "No matter how thick the wall, someone must stand upon it. These old bones of mine will lean against it first."
            },
            {
              "speaker": "you",
              "text": "Zhong Hui only wants you to look back. The moment you turn, the front thins out—let him shout, but do not let him sway you."
            }
          ],
          "choices": [
            {
              "id": "hold-wall",
              "text": "Hold the front with iron resolve, ignoring his manifestos",
              "detail": "Keen Eye boosted this round; remember Wall Defense",
              "effects": {
                "keenEye": true,
                "fact": "jiange_wall"
              }
            },
            {
              "id": "flank-beacons",
              "text": "Detach three outposts to watch the Yinping trail",
              "detail": "Zhong Hui starting War Funds -200; remember Eye on the Flank",
              "effects": {
                "raid": true,
                "fact": "jiange_beacons"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "jiange-open",
          "at": "start",
          "speaker": "zhonghui",
          "text": "Jiang Wei! Steep as Sword Gate is, your provisions will dry up long before my ink!"
        },
        {
          "id": "jiange-lao",
          "at": "hand:2",
          "speaker": "liaohua",
          "text": "This section of the wall I have held for forty years without letting a single soul pass! Young whelp, put some muscle into it!"
        },
        {
          "id": "jiange-flank",
          "at": "hand:3",
          "speaker": "zhangyi",
          "text": "All three outposts at Yinping have lit their beacons! General, fight freely on the front—the wall stands intact!",
          "when": "fact:jiange_beacons"
        },
        {
          "id": "jiange-low",
          "at": "low",
          "speaker": "jiangwei",
          "text": "Zhong Shiji, no matter how brilliantly your letters are written, they cannot scale this mountain. Return and tell Sima Zhao: Shu still has men standing!"
        }
      ],
      "win": {
        "text": "Zhong Hui besieged the pass for twenty days until his grain ran dry and his prose exhausted its last rhetorical flourish. The day he struck camp and retreated west, he looked back upon Sword Gate, recording Jiang Wei's name in his personal journal: 'Taking Shu is simple; the hardship lies with this one man.' Atop the ramparts of Sword Gate, the old general Liao Hua leaned against his polearm and drifted into slumber—for the first time in forty years, he slept peacefully before the pass.",
        "hook": "Sword Gate held the front, yet along the snowline of Mt. Motian, an isolated company wrapped in sheepskins was tumbling down the abyss—that was the chill wind of the next page."
      },
      "loss": {
        "text": "Zhong Hui's feigned attacks drew away your sentries, and Sword Gate's front thinned overnight to the frailty of parchment. When the gates fell, Jiang Wei did not look back, merely clasping his fists toward Yinping: 'Bogong, it is Wei who has failed you.'",
        "clue": "Historical Mirror: Zhong Hui leverages sheer momentum against natural defense, alternating between honeyed words and violent assaults. Upon retry, anchor the wall before setting outposts; his manifesto is merely his cheapest siege ladder.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Set a double response from Mt. Motian to Mianzhu, leaving Deng Ai's desperate gamble nowhere to land, so the Zhuge father and son need not die merely for a name.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "There were no roads in Yinping, only game trails washed faint by rain. Deng Ai ordered his men to wrap themselves in felt blankets and roll down the precipice, tumbling their very lives into that worn cloth."
        },
        {
          "speaker": "dengai",
          "text": "All... all say Yinping has no road. Because there is no road, no one will block me."
        },
        {
          "speaker": "dengzhong",
          "text": "Fa-father, Zhong shall scout ahead. If Mianzhu falls, Chengdu will yield without a fight—let your son forge this trail for you.",
          "when": "!seen:dengzhong"
        },
        {
          "speaker": "zhugezhan",
          "text": "When my father was alive, he often lamented that we grew up in comfort. Today Mianzhu stands at our backs and Chengdu is within reach; Zhan has nowhere left to retreat."
        },
        {
          "speaker": "zhugeshang",
          "text": "Grandfather, Father, the honor of three generations rests upon this day. Shang requests to take the vanguard!"
        },
        {
          "speaker": "jiangwei",
          "text": "Tazhong cannot be lost, nor can Chengdu. The greatest terror is not a two-front war, but each front believing someone else stands guard."
        }
      ],
      "intros": {
        "dengai": [
          {
            "when": "page:yinping:yeshi",
            "bio": "Having run into an ambush at Yinping once, he believes all the more that in desperate straits, there is always a second beast trail.",
            "quote": "Th-this time I descend from another ridge. Can you still wait for me?"
          },
          {
            "bio": "He stutters in speech, yet acts with ferocious resolve; what all men deem impossible is his very reason to stake everything on one cast.",
            "quote": "M-mountains will not yield to men. But men can circle around mountains."
          }
        ],
        "dengzhong": [
          {
            "when": "seen:dengzhong",
            "bio": "His first clash at Mianzhu gave him a taste of blood; this time he pushes his father's dangerous pawn another square forward.",
            "quote": "Wh-what my father taught me, I shall teach to you."
          },
          {
            "bio": "The youth under a fierce father's shadow burns to prove that the name 'Deng' belongs not only to the generation before.",
            "quote": "Show some respect before my father!"
          }
        ]
      },
      "map": [
        {
          "id": "light-on-cliff",
          "node": 1,
          "title": "Yinping: Lighting Beacons in the Wilds",
          "lines": [
            {
              "speaker": "zhuge",
              "text": "The old note contained only one sentence: 'Yinping is no road, yet those holding Jiangyou must never withdraw.' Back then all called it overcautious; today the parchment weighs heavier than cliff rock."
            },
            {
              "speaker": "jiangwei",
              "text": "To hold the sentry posts, we must also hold the echoes between them. Otherwise, if one lamp dies, a hundred leagues will still assume they can see."
            },
            {
              "speaker": "zhugezhan",
              "text": "I read my father's old note three times: 'Yinping is no road, yet those holding Jiangyou must never withdraw.' Sentries must be placed where they can see one another.",
              "when": "page:jieting:yeshi"
            }
          ],
          "choices": [
            {
              "id": "three-beacons",
              "text": "Station three interdependent beacon towers per the ancient notes",
              "detail": "Keen Eye boosted this round; remember Cliffside Beacons",
              "effects": {
                "keenEye": true,
                "fact": "yinping_beacons"
              }
            },
            {
              "id": "grain-ambush",
              "text": "Divert Jiangyou supplies and prepare an empty granary trap",
              "detail": "Deng Ai War Funds -200; remember Empty Granary Ruse",
              "effects": {
                "raid": true,
                "fact": "yinping_empty_granary"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "yinping-open",
          "at": "start",
          "speaker": "dengai",
          "text": "I... I have no food behind me, and no road beneath my feet. Guess where I can retreat, other than forward?"
        },
        {
          "id": "yinping-jiangwei",
          "at": "hand:2",
          "speaker": "jiangwei",
          "text": "Do not chase his general's banner. The man wrapped in felt is Deng Ai, and the slowest baggage train holds the life of their whole army."
        },
        {
          "id": "yinping-zhan",
          "at": "hand:3",
          "speaker": "zhugezhan",
          "text": "The heights do not guarantee victory; holding water and the retreat road does. Zhan shall make up for this lesson on my father's behalf.",
          "when": "page:jieting:yeshi"
        },
        {
          "id": "yinping-shang",
          "at": "hand:3",
          "speaker": "zhugeshang",
          "text": "Deng Zhong! The honor of my ancestors stands here—my spear is swifter than yours!",
          "when": "multi"
        },
        {
          "id": "yinping-low",
          "at": "low",
          "speaker": "dengai",
          "text": "Even the mountains let me through! Do y-you think a few piles of stone can hold me?!"
        }
      ],
      "win": {
        "text": "Atop Mt. Motian, lanterns flared first, followed by a torrent of rolling logs. When Deng Ai looked up, the empty granaries of Jiangyou were already padlocked; this miracle road bought with blood and bone had finally closed into an inescapable dead end. Jiang Wei rolled up the ancient note without celebration, merely adding oil to the three clifftop beacon towers.",
        "hook": "The lands of Shu were preserved, yet the tides of Jianye grew faint. The old chronicle held only its final words: Three Kingdoms Return to Jin.",
        "choiceFact": "yinping_held"
      },
      "loss": {
        "text": "The felt-wrapped phantoms tumbled through the cliffs, and Jiangyou surrendered without firing an arrow. Beneath the walls of Mianzhu, Zhuge Zhan and his son charged into the center of the Wei host; their deaths preserved the peerless honor of the Marquis of Wu, yet left the passes of Chengdu wide open to the enemy.",
        "clue": "Historical Mirror: Deng Ai bets everything on a single plunge, risking all on momentum. Upon retry, light beacons early and clear the granaries; do not let his desperate host feed upon your supplies.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    },
    "yanglu": {
      "cast": [
        "lukang",
        "yanghu"
      ],
      "objective": "Face Yang Hu across the border for two years, winning the 'war of no battle' to preserve the last general of Wu, and the final bond of honor.",
      "coldOpen": [
        {
          "speaker": "narrator",
          "text": "Along the border of Jingzhou, two armies confronted one another, yet two years passed without a battle. When Wu hunters pursued game that fled into Jin territory, Yang Hu always returned the quarry; when Lu Kang fell ill, Yang Hu sent medicine, and Lu Kang took it openly before his men."
        },
        {
          "speaker": "yanghu",
          "text": "General Lu, Hu does not deceive those in mourning, nor do I take advantage of a stricken commander. Here is the medicine, and here is my good faith."
        },
        {
          "speaker": "lukang",
          "text": "Duke Yang bestows medicine; how could Lu Kang doubt it? Yet I have one question: the Duke hunts cities with virtue, but do you hunt Wu's territory, or Wu's heart?"
        },
        {
          "speaker": "lukang",
          "text": "The edicts from Jianye are more pressing than the legions of Xiangyang. They demand that Kang march out, yet I resolve to hold for another year."
        },
        {
          "speaker": "narrator",
          "text": "Beneath Xiling, Bu Chan surrendered the city to Jin. Lu Kang's siege now surrounded what had been his own fortress."
        }
      ],
      "intros": {
        "yanghu": [
          {
            "when": "seen:yanghu",
            "bio": "Having studied your deployments twice, he still tightens the hunting net by a mere inch.",
            "quote": "Why the haste? Hu's net tightens only an inch each year."
          },
          {
            "bio": "The famed commander in light robes and easy sash uses trust as bait and virtue as his hook.",
            "quote": "Hu does not contest with weapons. Hu merely waits for men's hearts to cross the river on their own."
          }
        ]
      },
      "map": [
        {
          "id": "border-trust",
          "node": 1,
          "title": "Xiangyang: Peace on the Frontier",
          "lines": [
            {
              "speaker": "yanghu",
              "text": "Whenever Hu proposes battle, I only arrange an appointed date in open field, never ambushing or raiding. Some call me foolish—they do not understand this is the sharpest blade of all."
            },
            {
              "speaker": "lukang",
              "text": "Duke Yang treats me with good faith, and Kang returns the same. Yet with Xiling in revolt, the trust between our borders must withstand the fire."
            },
            {
              "speaker": "you",
              "text": "His way of winning is 'not fighting'. If you rush into battle, you will hand the people's hearts across the river for him."
            }
          ],
          "choices": [
            {
              "id": "siege-xiling",
              "text": "Subdue Xiling first before addressing the border",
              "detail": "Jin forces starting War Funds -200; remember Calming the Interior",
              "effects": {
                "raid": true,
                "fact": "yanglu_xiling"
              }
            },
            {
              "id": "keep-compact",
              "text": "Honor the pact with Duke Yang and avoid border clashes",
              "detail": "Keen Eye boosted this round; remember Two Years of Trust",
              "effects": {
                "keenEye": true,
                "fact": "yanglu_pact"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "yanglu-open",
          "at": "start",
          "speaker": "yanghu",
          "text": "General Lu, today we spare another battle. Hu has prepared fresh tea—from Jiangling, as you can surely taste."
        },
        {
          "id": "yanglu-city",
          "at": "hand:2",
          "speaker": "lukang",
          "text": "Xiling has fallen. Bu Chan's head has been sent to Jianye by Kang's own hand. The Duke of Jin's abacus is missing a vital bead.",
          "when": "fact:yanglu_xiling"
        },
        {
          "id": "yanglu-tea",
          "at": "hand:3",
          "speaker": "yanghu",
          "text": "Tea must be savored hot; cities must wait until ripe. General, Hu can afford to wait—can you wait for Jianye?",
          "when": "fact:yanglu_pact"
        },
        {
          "id": "yanglu-low",
          "at": "low",
          "speaker": "lukang",
          "text": "Kang has ever triumphed abroad, yet remained trapped from within. Duke Yang... you were never besieging me, but my imperial court, were you not?"
        }
      ],
      "win": {
        "text": "Xiling was subdued, yet the frontier trust remained unbroken. Before his passing, Yang Hu presented a memorial urging the conquest of Wu, entrusting a lifetime of preparation and the faint scent of medicinal herbs to Du Yu; Lu Kang died of illness that very same year, and the men of Wu erected a monument bearing no word of 'defeat'. The two steles faced one another across the Yangtze—you prevailed on this page: between the two great names, neither man yielded to the other.",
        "hook": "After Yang Hu and Lu Kang, no great commanders remained to guard the realm. In Yizhou, grand tower ships were launched, while the iron chains of Jianye rusted away inch by inch."
      },
      "loss": {
        "text": "The urgent edicts from Jianye finally crushed the fragile trust upon the border. On the day you marched forth, the common folk along the river pointed to the Jin banners and whispered: 'Duke Yang's virtue spares our harvest.' Before a single spear clashed, the hearts beyond the walls had already crossed the river.",
        "clue": "Historical Mirror: Yang Hu's weapon is 'virtue', and reckless assault plays directly into his hands. Upon retry, secure Xiling first and maintain the covenant; he can afford time, but you cannot afford to lose the people.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
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
      "objective": "Finish the final hand of the Three Kingdoms before 'All Under Heaven Returns to One' is penned, proving that unity need not mean erasing every name.",
      "coldOpen": [
        {
          "speaker": "simayan",
          "text": "At Huarong you ordered the blade to fall, yet Cao Pi still proclaimed himself Emperor, and the realm still fragmented. Was that grand turmoil meant only for my Sima clan to gather the pieces?",
          "when": [
            "choice:huarong:yeshi",
            "!choice:huarong:yeshiB"
          ]
        },
        {
          "speaker": "simayan",
          "text": "At Huarong you spared Cao Cao, granting Wei a prolonged breath. A pity that breath ultimately took the surname of Sima; whom did your 'righteousness' truly save?",
          "when": "choice:huarong:yeshiB"
        },
        {
          "speaker": "wangjun",
          "text": "Tower ships a hundred fathoms tall, iron chains spanning thousand-fold depths. Wang Jun built vessels in Yizhou for seven years, solely for this downstream sweep.",
          "when": "!seen:wangjun"
        },
        {
          "speaker": "duyu",
          "text": "Duke Yang recommended me on his deathbed. He had already gathered the hearts of Jingzhou; all Du Yu needed was the rising tide.",
          "when": "!seen:duyu"
        },
        {
          "speaker": "sunhao",
          "text": "Iron chains span the river, an impenetrable natural moat. The tower ships of the Jin? Let them ask the stones beneath the current first!"
        },
        {
          "speaker": "cenhun",
          "text": "Your Majesty, rest at ease. Cen Hun shall add three more chains—unbroken by flame, unpenetrated by flood!"
        },
        {
          "speaker": "writer",
          "text": "This is the final page of the old history. If you win, 'All Under Heaven Returns to One' will no longer be the only sentence that can be written."
        }
      ],
      "intros": {
        "simayan": [
          {
            "when": "page:guijin:yeshi",
            "bio": "Having once been forced to concede that unification was not the only outcome, his return is fueled by a desire to reclaim every possibility.",
            "quote": "Last time you left three banners standing. This time I shall strip even the flagpoles away."
          },
          {
            "bio": "He inherits not merely the lands of the Three Kingdoms, but the very patience his grandfather understood best: waiting until everyone grows weary.",
            "quote": "You fought for a lifetime; in the end, did you not all desire the single word 'Union'?"
          }
        ],
        "wangjun": [
          {
            "when": "seen:wangjun",
            "bio": "Remembering you from the last river gale, he prepared double the torches this time.",
            "quote": "Wh-what cannot be burned are my ships. Come on!"
          },
          {
            "bio": "The seventy-year-old veteran still seeking ennoblement staked half his life upon this very river.",
            "quote": "Tower ships descend from Yizhou. The imperial aura of Jinling gathers in this voyage."
          }
        ]
      },
      "map": [
        {
          "id": "names-under-unification",
          "node": 1,
          "title": "Stone Fortress: Names Beyond the Surrender Document",
          "lines": [
            {
              "speaker": "simayan",
              "text": "I spare every life in Jianye, and grant the Lord of Shu the title of Duke Anle. What more do you desire? Could the names of lifelong warlords matter more than peace?"
            },
            {
              "speaker": "you",
              "text": "If peace can be named by only one man, then when the next division comes, only blades will speak once more."
            },
            {
              "speaker": "writer",
              "text": "Do not contest seats only for the heroes. Look behind the surrender scrolls—those whose names were never penned have truly waited for three generations."
            }
          ],
          "choices": [
            {
              "id": "record-people",
              "text": "Record the names of the common folk behind the surrender roll",
              "detail": "Keen Eye boosted this round; remember History of the People",
              "effects": {
                "keenEye": true,
                "fact": "guijin_people"
              }
            },
            {
              "id": "three-flags",
              "text": "Raise the three banners of old once more for the final round",
              "detail": "Sima Yan starting Morale -1; remember Resonances of the Three",
              "effects": {
                "sow": 1,
                "fact": "guijin_three_flags"
              }
            }
          ]
        }
      ],
      "battle": [
        {
          "id": "guijin-open",
          "at": "start",
          "speaker": "simayan",
          "text": "Wei outlasted Shu, and Jin inherited Wei. You see, patience outlives all your brilliant schemes."
        },
        {
          "id": "guijin-writer",
          "at": "hand:2",
          "speaker": "writer",
          "text": "He treats 'Unification' as his hole card, so you need not mimic destiny more than he. Make him prove why it must only be so."
        },
        {
          "id": "guijin-you",
          "at": "hand:3",
          "speaker": "you",
          "text": "Unification does not mean grinding three names into one; it means when the next name arises, it need not unleash another age of blood."
        },
        {
          "id": "guijin-low",
          "at": "low",
          "speaker": "simayan",
          "text": "Without me to close the stage, how many more years would you bleed? Do you dare speak that question to the commoners in the city?"
        }
      ],
      "win": {
        "text": "The tower ships halted in midstream, and Jianye never presented its surrender scroll. Looking upon the three ancient banners, Sima Yan asked for the first time: 'If the world is not a trophy of conquest, what else can I leave behind?' None could answer for him, yet on the morrow, the city's grain markets opened as usual.",
        "hook": "Scroll Four is fully penned, yet another page lies behind the parchment. The Chronicler has arranged the cards: he wishes to speak with you of these altered destinies.",
        "choiceFact": "jin_unification_stopped"
      },
      "loss": {
        "text": "At last, the Jin banner was hoisted above the Stone Fortress. The commoners indeed received their long-awaited peace, yet the old annals shrank every mortal name smaller and smaller, until only the words 'Returned to Jin' remained.",
        "clue": "Historical Mirror: Sima Yan presses relentlessly with the momentum of inevitable unification. Upon retry, enemy funds -200; do not believe in the ending before he has earned it.",
        "clueFx": "raid"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    }
  },
  "5": {
    "zuizhong": {
      "cast": [
        "writer"
      ],
      "objective": "Compel the Chronicler to acknowledge you are not his footnote; win the final hand, and choose the destiny of the entire scroll among Sealing, Restoring, and Tearing.",
      "coldOpen": [
        {
          "speaker": "writer",
          "text": "At Baimen Tower you allowed Lu Bu to live, and thereafter everyone walked a path that was never meant to be. Did you think I didn't see? I recorded every single stroke.",
          "when": "fact:lvbu_lives"
        },
        {
          "speaker": "writer",
          "text": "At Maicheng you rescued Guan Yu, and so I watched Yiling lose its reason, and Baidicheng lose its sorrow. Yet you could not save every regret, could you?",
          "when": "page:maicheng:yeshi"
        },
        {
          "speaker": "writer",
          "text": "The snows of Maicheng still linger, and the fires of Yiling once waited. You saved some souls, yet turned with your own hands pages that could not be saved in time.",
          "when": "!page:maicheng:yeshi"
        },
        {
          "speaker": "writer",
          "text": "Seal the scroll, and preserve your apocrypha; restore history, and return each mortal fate; tear the scroll, and let no one foreknow tomorrow. Only by defeating me do you earn the right to choose."
        }
      ],
      "intros": {
        "writer": [
          {
            "when": "page:zuizhong:yeshi",
            "bio": "He remembers you carrying the ending out of this page, yet still refuses to admit a book can have only one conclusion.",
            "quote": "Back to change your answer again? This time, not even I will record it for you."
          },
          {
            "when": "fact:zhuge_survives",
            "bio": "He sees the southeastern star still burning bright, knowing that after you saved Kongming, history did not become any lighter.",
            "quote": "Having saved him once, do you truly think you understand how to save mankind?"
          },
          {
            "bio": "He knows every page you have ever turned, yet for the first time sits where cards must be verified, not preordained.",
            "quote": "I wrote the road you traveled. Now, show me the choice you make."
          }
        ]
      },
      "map": [],
      "battle": [
        {
          "id": "zuizhong-open-survivor",
          "at": "start",
          "speaker": "writer",
          "text": "That star above Wuzhangyuan still shines. Did you think saving Kongming was the answer? It merely gave Zhongda one more rival he could not defeat by waiting.",
          "when": "fact:zhuge_survives"
        },
        {
          "id": "zuizhong-open-fallen",
          "at": "start",
          "speaker": "writer",
          "text": "I kept the autumn wind of Wuzhangyuan. You can defeat Sima Yi, yet you cannot necessarily bear the weight of a man fated to die.",
          "when": "!fact:zhuge_survives"
        },
        {
          "id": "zuizhong-seal",
          "at": "hand:2",
          "speaker": "writer",
          "text": "Seal the scroll, and I bind these apocryphal tales into book form. They will live within the page you altered, yet never reach the next."
        },
        {
          "id": "zuizhong-return",
          "at": "hand:3",
          "speaker": "writer",
          "text": "Restore history, and I retract my brush and ink. The snow of Maicheng and the wind of Wuzhangyuan resume as before; you depart with only the memories of having met them."
        },
        {
          "id": "zuizhong-tear",
          "at": "hand:4",
          "speaker": "writer",
          "text": "Tear the scroll, and anyone might live again, or die once more. There will be no draft, and no chronicler to catch you when you fall."
        },
        {
          "id": "zuizhong-huarong-spare",
          "at": "hand:5",
          "speaker": "writer",
          "text": "At Huarong you let Cao Cao go, trusting that 'righteousness' could outweigh future calamity. Today I ask you once more: dare you trust that the unknown can outweigh destiny?",
          "when": "choice:huarong:yeshiB"
        },
        {
          "id": "zuizhong-huarong-strike",
          "at": "hand:5",
          "speaker": "writer",
          "text": "At Huarong you let the blade fall, altering a villain's fate without preventing the scramble for the throne. Tearing the scroll will not spare you from choosing either.",
          "when": [
            "choice:huarong:yeshi",
            "!choice:huarong:yeshiB"
          ]
        },
        {
          "id": "zuizhong-low",
          "at": "low",
          "speaker": "writer",
          "text": "I know every old card in your hand, yet not the next. Reader, that is the sole reason I agreed to sit and play this hand with you."
        }
      ],
      "win": {
        "text": "The Chronicler pushed aside his cards, for the first time leaving the ending unwritten. Upon the desk side by side lay the sealing cord, the ancient chronicle, and an edgeless paper knife: seal the scroll to keep what was rewritten; restore history to bear what was lost; tear the scroll to surrender all to the unknown. As you reach out your hand, the entire book waits in breathless silence.",
        "hook": "All three answers await in the question ahead. What you choose is not merely an ending, but who holds the right to write it."
      },
      "loss": {
        "text": "He lifted his brush and added the word 'again' beside your name, sending every rewritten line retreating to the margins. Yet he did not erase the seat where you sat—a silent sign that next time, he will still need you to come.",
        "clue": "Historical Mirror: The Chronicler knows your former strategies, yet must still bet by the logic of the cards. Upon retry, false tells decrease; do not be intimidated by his omniscient tone.",
        "clueFx": "keenEye"
      },
      "skirmishIntro": [],
      "skirmishOutcomes": {},
      "bossIntro": [],
      "bossOutcomes": {}
    }
  }
};
