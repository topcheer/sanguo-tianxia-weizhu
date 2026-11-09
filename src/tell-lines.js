// tell-lines.js —— 破绽台词池:信息长在人物身上。
import { localizeTells, localizeIntentNotes } from './i18n.js';
// 席位气泡两层:台词层(他说漏嘴的话)+注解层(generals.js 的 tells 动作文案+识破履历)。
// 六类别:strongTrue 真强 / strongFake 装强 / weakTrue 真弱 / weakFake 装弱
//        bluffLeak 诈唬线泄露(恒真) / trapLeak 埋伏泄露(恒真)
// 写法约定:同一张"强"脸,真强偏随意笃定,装强偏用力过火——判真伪靠语气,
// 不靠字面;这是把 lieChance 从随机数变成"可读演技"的关键。台词全部是
// "说出口的话",动作细节归注解层。名将专属词池(generals.js 有档案者),
// 其余按六维原型(猛将/谋士/统帅/宿将)落通用池。

// 意图型破绽的注解判词(恒真,直接把信息钉死)
export const INTENT_NOTES = {
  bluff: '指尖泄了密——他在演',
  trap: '按兵太久了——他在等你上钩',
};

const FAMOUS = {
  lvbu: {
    strongTrue: ['哼,就这些?', '插标卖首之辈。'],
    strongFake: ['谁敢与我一战?!……怎么,没人?', '我吕布,何曾怕过!'],
    weakTrue: ['……此牌,呸。', '换赤兔来,再来!'],
    weakFake: ['罢了罢了,你且赢去。', '今日布,无意争胜。'],
    bluffLeak: ['来呀,跟呀!你倒是不跟!', '怕?我这里没有这个字!'],
    trapLeak: ['急什么,让你三招。', '且慢,再看看。'],
  },
  guanyu: {
    strongTrue: ['关某在此,自管来。', '何足挂齿。'],
    strongFake: ['关某何惧之有!?', '此局,关某一力承之!'],
    weakTrue: ['……失手,失手。', '大意了。'],
    weakFake: ['胜负乃常事,你且取去。', '关某今日,不欲争锋。'],
    bluffLeak: ['你猜,这刀出不出鞘?', '关某说过,不怕。'],
    trapLeak: ['不急,春秋未读完。', '且饮了这盏。'],
  },
  zhangfei: {
    strongTrue: ['哈哈哈,痛快!', '就这点本事?'],
    strongFake: ['俺张飞怕过谁?!啊?!', '来来来,都别走!'],
    weakTrue: ['呸,晦气!', '这把不算,俺没使劲!'],
    weakFake: ['俺今日喝多了,你赢去。', '让让你,让让你。'],
    bluffLeak: ['有本事你跟啊!', '俺手里……哼,你猜!'],
    trapLeak: ['俺不动,你也别动。', '急什么,酒还没凉。'],
  },
  liubei: {
    strongTrue: ['备,静候佳音。', '汉室在天之灵。'],
    strongFake: ['备……并非无备!', '此局备自有主张!'],
    weakTrue: ['唉,谋事在人。', '备,又输了些。'],
    weakFake: ['备不过陪君一乐。', '让贤,让贤。'],
    bluffLeak: ['莫非,君疑备无牌?', '备,尚可一战。'],
    trapLeak: ['备再想想,君先请。', '不急,不急。'],
  },
  zhuge: {
    strongTrue: ['一切,尽在算中。', '此局,亮已观至终局。'],
    strongFake: ['亮……早有妙算!', '锦囊在此,何惧!'],
    weakTrue: ['谋不在多,在时。', '亮,失一先。'],
    weakFake: ['亮才疏,君且先行。', '胜负之外,另有天地。'],
    bluffLeak: ['扇底乾坤,君且猜猜。', '亮生平,不敢稍懈。'],
    trapLeak: ['博望坡,等的就是你。', '再等等,火候未到。'],
  },
  caocao: {
    strongTrue: ['胜败,皆吾雅意。', '此局,如探囊取物。'],
    strongFake: ['吾——岂会输?!', '宁教我负人,此局亦然!'],
    weakTrue: ['胜固欣然,败亦可喜。', '罢了,权当纳粮。'],
    weakFake: ['今日操兴不佳,让君三分。', '吾今日心慈,破例让之。'],
    bluffLeak: ['吾梦中好杀人,亦好诈牌。', '你敢跟么?'],
    trapLeak: ['且看他横槊赋诗。', '吾好梦中——布局。'],
  },
  zhouyu: {
    strongTrue: ['曲有误,周郎顾;此局亦然。', '此局在弦上矣。'],
    strongFake: ['公瑾岂是浪得虚名!', '此曲——必胜!'],
    weakTrue: ['既生瑜……', '雅意尽矣。'],
    weakFake: ['今日琴弦松了,君且得意。', '周郎让客,先礼后兵。'],
    bluffLeak: ['拍子在我手里。', '火候到了,你敢来么?'],
    trapLeak: ['东风未起,且慢。', '借你三箭,何妨。'],
  },
  luxun: {
    strongTrue: ['棋势已明。', '晚辈,承让。'],
    strongFake: ['晚辈……未必输!', '此局,晚辈亦有所备!'],
    weakTrue: ['学艺不精。', '容我回去再读书。'],
    weakFake: ['君是前辈,逊不敢争。', '书生之牌,不入方家之眼。'],
    bluffLeak: ['你说,这把火点不点?', '火烧连营,总要有人先点。'],
    trapLeak: ['书生意气,重在收梢。', '再等一炷香。'],
  },
  lusu: {
    strongTrue: ['子敬,运气尚可。', '这手,是有点意思。'],
    strongFake: ['肃、肃并非无牌!', '吾亦能胜!今日便是!'],
    weakTrue: ['唉,又让吴侯失望了。', '肃,只好看下一局了。'],
    weakFake: ['君且赢,莫伤和气。', '肃本意,在联盟不在胜负。'],
    bluffLeak: ['老实人,也会藏牌。', '肃……有一手,不妨直说。'],
    trapLeak: ['借荆州,总要慢慢还。', '不忙,先喝口茶。'],
  },
  simayi: {
    strongTrue: ['时候到了。', '吾忍至此,正为此刻。'],
    strongFake: ['吾——不复忍矣!', '今日便与君决之!'],
    weakTrue: ['且退,且退。', '忍字头上一把刀。'],
    weakFake: ['老夫年迈,让君先手。', '吾且装睡,君自便。'],
    bluffLeak: ['君可识得,鹰视狼顾?', '装病数十载,何况装牌。'],
    trapLeak: ['高平陵,等了十年。', '再忍一手,只一手。'],
  },
  jiangwei: {
    strongTrue: ['丞相之志,维承之。', '此阵,维已推演百遍。'],
    strongFake: ['维……不愧对丞相!', '此局维必胜,必胜!'],
    weakTrue: ['计不及此,维之过。', '差一步,只差一步。'],
    weakFake: ['维新承遗志,且让前辈。', '今日不谈兵。'],
    bluffLeak: ['九伐中原,哪次怕过。', '虚则实之,维也会。'],
    trapLeak: ['段谷之败,不会再有。', '再引一程。'],
  },
  zhaoyun: {
    strongTrue: ['云,见过阵仗。', '不必试探。'],
    strongFake: ['长坂坡尚且去得,何况此局!', '云,何惧之有!'],
    weakTrue: ['云,失手了。', '此番算学不精。'],
    weakFake: ['云不敢与前辈争先。', '今日且叙旧,不论牌。'],
    bluffLeak: ['这一枪,虚实君自辨。', '七进七出,靠的不是运气。'],
    trapLeak: ['护主之人,最擅后发。', '再候一息。'],
  },
  machao: {
    strongTrue: ['西凉铁骑,踏碎之。', '来得正好!'],
    strongFake: ['谁说西凉无人?!', '马儿今日不认输!'],
    weakTrue: ['此局风紧。', '重整,再战!'],
    weakFake: ['马儿乏了,你先。', '今日权且绕道。'],
    bluffLeak: ['杀——声势也是杀!', '你敢不敢跟?!'],
    trapLeak: ['勒马,回身,再刺。', '渭水之畔,再等一等。'],
  },
  huangzhong: {
    strongTrue: ['老夫臂未衰。', '宝刀未老,此为证。'],
    strongFake: ['老将虽老,尚能一战!!', '谁言老夫怯阵?!'],
    weakTrue: ['唉,岁月不饶人。', '手,终究慢了。'],
    weakFake: ['老朽让贤,让贤。', '这把年纪,图个乐。'],
    bluffLeak: ['听,弦外之音。', '定军山,老夫亦会诈败。'],
    trapLeak: ['引他百步,再放箭。', '老将用兵,惯于后发。'],
  },
  dianwei: {
    strongTrue: ['好!够劲!', '双戟在此。'],
    strongFake: ['俺、俺典韦不怕!', '来啊!再来啊!'],
    weakTrue: ['这……没看懂。', '咦?不对劲。'],
    weakFake: ['俺先歇歇,你玩。', '让俺让俺。'],
    bluffLeak: ['怕死不当典韦!', '跟不跟?给句痛快话!'],
    trapLeak: ['守门,俺最在行。', '俺不动,你敢来?'],
  },
  xiahoudun: {
    strongTrue: ['独眼,看得分明。', '拔矢啖睛,不过等闲。'],
    strongFake: ['元让何曾退过?!', '今日不死战,不归!'],
    weakTrue: ['伤目,失了准头。', '哼,改日再战。'],
    weakFake: ['且给君几分薄面。', '元让今日,战略后撤。'],
    bluffLeak: ['虚张声势?俺也会!', '身可残,志不可夺!'],
    trapLeak: ['盲夏侯,听得见你的脚步。', '且待其深入。'],
  },
  dongzhuo: {
    strongTrue: ['天下,皆吾掌中物。', '郿坞之粮,堆得比这高。'],
    strongFake: ['吾富有四海,岂惧一局!', '谁敢赢吾?!啊?'],
    weakTrue: ['竖子,运气罢了。', '不谈这个,不谈。'],
    weakFake: ['吾今日心慈,放你一马。', '看在酒肉面上,让你。'],
    bluffLeak: ['吾起家西凉,靠的就是胆子。', '跟啊!这局也是吾的!'],
    trapLeak: ['肥猪,亦会咬人。', '急什么,酒肉未凉。'],
  },
  menghuo: {
    strongTrue: ['此乃洞天福地之力!', '象阵已成。'],
    strongFake: ['蛮王岂会输你?!', '再战!此地必胜!'],
    weakTrue: ['又中计了……', '这洞,不利我军。'],
    weakFake: ['让你一程,免得说我欺你。', '蛮子认输,改日再打。'],
    bluffLeak: ['藤甲刀枪不入,你跟啊!', '七次?我一次都不服!'],
    trapLeak: ['诱敌深入,我熟。', '再放你进一程。'],
  },
  diaochan: {
    strongTrue: ['月下之舞,自有分寸。', '这一步,早已算好。'],
    strongFake: ['贱妾……未必会输哦?', '莫小瞧深闺中人!'],
    weakTrue: ['这一曲,乱了。', '妾身,技穷了。'],
    weakFake: ['君是英雄,妾怎敢赢。', '贱妾不过逢场作戏。'],
    bluffLeak: ['你猜,哪一环?', '连环计,环环相扣。'],
    trapLeak: ['好戏,不急开场。', '凤仪亭,等的就是人齐。'],
  },
  pangtong: {
    strongTrue: ['凤雏一啄,便知胜负。', '此局,俗手看不懂。'],
    strongFake: ['吾与卧龙齐名!!', '莫以貌取人——此局必胜!'],
    weakTrue: ['哼,时也命也。', '此局未入吾彀中。'],
    weakFake: ['让君赢,权当付酒钱。', '今日风雅,不谈俗胜负。'],
    bluffLeak: ['跟,便中计。', '连环计,虚则实之。'],
    trapLeak: ['赤壁那把火,等的就是风。', '茶凉,即收网。'],
  },
};

// 原型池:非名将按六维归档。武勇压智谋为猛将,智谋压武勇为谋士,
// 双高为统帅,其余为宿将。池子通用但语气仍分四路,避免千人一面。
const ARCHETYPE = {
  fierce: {
    strongTrue: ['就这?', '痛快!', '再来!'],
    strongFake: ['怕?没这个字!', '谁敢跟我拼?!', '今日必赢,谁拦跟谁急!'],
    weakTrue: ['呸,晦气。', '这把不算!', '没看清,重来!'],
    weakFake: ['今日乏了,让你。', '不与你计较。', '先让你三分,莫得意。'],
    bluffLeak: ['跟不跟?给句痛快话!', '是条汉子就跟!', '怕死不抬牌!'],
    trapLeak: ['且让你走近些。', '俺不动,你敢来?', '再等一息。'],
  },
  sage: {
    strongTrue: ['一切在算中。', '胜负已分,君未察耳。', '此局已至收官。'],
    strongFake: ['吾早有妙算!', '锦囊尚在,何惧!', '此策万无一失……必是!'],
    weakTrue: ['谋事在人,成事在天。', '失一先,满盘掣肘。', '吾算漏一着。'],
    weakFake: ['才疏学浅,让君先手。', '今日论道,不论胜。', '君且先行,吾压阵。'],
    bluffLeak: ['虚则实之,君猜?', '君可读过孙子?', '虚实之变,存乎一心。'],
    trapLeak: ['请君入瓮,瓮已备好。', '再等半刻,火候即到。', '静待其变。'],
  },
  commander: {
    strongTrue: ['三军可夺气,此局亦然。', '兵粮足备,何惧持久。', '稳了。'],
    strongFake: ['吾自领兵,未尝败绩!', '今日定要赢下,以振军心!', '众将看着,此局必胜!'],
    weakTrue: ['胜败兵家常事。', '且收兵,再图。', '此局失了地利。'],
    weakFake: ['今日练兵,不较胜负。', '让君一阵,以示诚意。', '兵不厌诈——今日让之。'],
    bluffLeak: ['兵者,诡道也。', '疑兵之计,君识得么?', '虚营一座,敢不敢进?'],
    trapLeak: ['诱敌深入,兵法常课。', '壁垒已固,等君来攻。', '再退三十里。'],
  },
  veteran: {
    strongTrue: ['见得多了。', '老经验,还在。', '这一手,稳的。'],
    strongFake: ['老夫当年……今日也行!', '宝刀未老,未老!', '谁说我不行了?'],
    weakTrue: ['岁月不饶人呐。', '手慢了,认了。', '这脑子,转不动喽。'],
    weakFake: ['老朽让贤。', '陪君玩玩,莫当真。', '这把年纪,输赢看淡。'],
    bluffLeak: ['姜还是老的辣。', '老夫这招,叫兵不厌诈。', '跟呀,犹豫什么。'],
    trapLeak: ['等你犯错,等了一辈子。', '老家伙的耐心,最是熬人。', '不急,茶还烫。'],
  },
};

const CATEGORIES = ['strongTrue', 'strongFake', 'weakTrue', 'weakFake', 'bluffLeak', 'trapLeak'];

export function archetypeOf(traits = {}) {
  const wu = traits.武勇 ?? 50;
  const zhi = traits.智谋 ?? 50;
  if (wu >= 65 && wu >= zhi + 10) return 'fierce';
  if (zhi >= 65 && zhi >= wu + 10) return 'sage';
  if (wu >= 55 && zhi >= 55) return 'commander';
  return 'veteran';
}

// 牌力破绽类别:shown(演给你看) × actual(真实牌力)。mid 不入池。
export function tellCategory(shown, actual) {
  if (shown === 'strong') return actual === 'strong' ? 'strongTrue' : 'strongFake';
  if (shown === 'weak') return actual === 'weak' ? 'weakTrue' : 'weakFake';
  return null;
}

export function tellLine({ genId, category, traits, rng = Math.random } = {}) {
  const { named, defaults } = localizeTells(FAMOUS, ARCHETYPE);
  const pool = (named[genId]?.[category]) || defaults[archetypeOf(traits)]?.[category];
  if (!pool || !pool.length) return '……';
  return pool[Math.floor(rng() * pool.length)];
}

export function getIntentNote(type) {
  const notes = localizeIntentNotes(INTENT_NOTES);
  return notes[type] || INTENT_NOTES[type];
}

// 供内容校验(tests/content/tell-lines.lint.mjs)与调试导出
export const TELL_LINE_POOLS = { FAMOUS, ARCHETYPE, CATEGORIES };
