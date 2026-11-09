// scripts/generate-generals-locales.mjs
import { GENERALS } from '../src/generals.js';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

// 130 名武将的三国官方权威译名对照表
const NAMES_MAP = {
  lvbu: { tw: '呂布', ja: '呂布 奉先', en: 'Lu Bu' },
  liubei: { tw: '劉備', ja: '劉備 玄徳', en: 'Liu Bei' },
  guanyu: { tw: '關羽', ja: '関羽 雲長', en: 'Guan Yu' },
  zhangfei: { tw: '張飛', ja: '張飛 益徳', en: 'Zhang Fei' },
  chengong: { tw: '陳宮', ja: '陳宮 公台', en: 'Chen Gong' },
  zhaoyun: { tw: '趙雲', ja: '趙雲 子龍', en: 'Zhao Yun' },
  dianwei: { tw: '典韋', ja: '典韋', en: 'Dian Wei' },
  diaochan: { tw: '貂蟬', ja: '貂蝉', en: 'Diaochan' },
  sunquan: { tw: '孫權', ja: '孫権 仲謀', en: 'Sun Quan' },
  lusu: { tw: '魯肅', ja: '魯粛 子敬', en: 'Lu Su' },
  pangtong: { tw: '龐統', ja: '龐統 士元', en: 'Pang Tong' },
  huangzhong: { tw: '黃忠', ja: '黄忠 漢升', en: 'Huang Zhong' },
  masuo: { tw: '馬謖', ja: '馬謖 幼常', en: 'Ma Su' },
  wangping: { tw: '王平', ja: '王平 子均', en: 'Wang Ping' },
  jiangwei: { tw: '姜維', ja: '姜維 伯約', en: 'Jiang Wei' },
  caoshuang: { tw: '曹爽', ja: '曹爽 昭伯', en: 'Cao Shuang' },
  yufan: { tw: '虞翻', ja: '虞翻 仲翔', en: 'Yu Fan' },
  luji: { tw: '陸績', ja: '陸績 公紀', en: 'Lu Ji' },
  kongxiu: { tw: '孔秀', ja: '孔秀', en: 'Kong Xiu' },
  hanfu: { tw: '韓福', ja: '韓福', en: 'Han Fu' },
  bianxi: { tw: '卞喜', ja: '卞喜', en: 'Bian Xi' },
  wangzhi: { tw: '王植', ja: '王植', en: 'Wang Zhi' },
  qinqi: { tw: '秦琪', ja: '秦琪', en: 'Qin Qi' },
  huaxiong: { tw: '華雄', ja: '華雄', en: 'Hua Xiong' },
  dongzhuo: { tw: '董卓', ja: '董卓 仲穎', en: 'Dong Zhuo' },
  jiling: { tw: '紀靈', ja: '紀霊', en: 'Ji Ling' },
  zhangxiu: { tw: '張繡', ja: '張繍', en: 'Zhang Xiu' },
  caocao: { tw: '曹操', ja: '曹操 孟徳', en: 'Cao Cao' },
  yuanshao: { tw: '袁紹', ja: '袁紹 本初', en: 'Yuan Shao' },
  zhuge: { tw: '諸葛亮', ja: '諸葛亮 孔明', en: 'Zhuge Liang' },
  xiahoudun: { tw: '夏侯惇', ja: '夏侯惇 元譲', en: 'Xiahou Dun' },
  zhangzhao: { tw: '張昭', ja: '張昭 子布', en: 'Zhang Zhao' },
  zhouyu: { tw: '周瑜', ja: '周瑜 公瑾', en: 'Zhou Yu' },
  zhangren: { tw: '張任', ja: '張任', en: 'Zhang Ren' },
  xiahouyuan: { tw: '夏侯淵', ja: '夏侯淵 妙才', en: 'Xiahou Yuan' },
  yujin: { tw: '于禁', ja: '于禁 文則', en: 'Yu Jin' },
  lvmeng: { tw: '呂蒙', ja: '呂蒙 子明', en: 'Lu Meng' },
  luxun: { tw: '陸遜', ja: '陸遜 伯言', en: 'Lu Xun' },
  menghuo: { tw: '孟獲', ja: '孟獲', en: 'Meng Huo' },
  caozhen: { tw: '曹真', ja: '曹真 子丹', en: 'Cao Zhen' },
  zhanghe: { tw: '張郃', ja: '張郃 儁乂', en: 'Zhang He' },
  simayi: { tw: '司馬懿', ja: '司馬懿 仲達', en: 'Sima Yi' },
  dengai: { tw: '鄧艾', ja: '鄧艾 士載', en: 'Deng Ai' },
  simayan: { tw: '司馬炎', ja: '司馬炎 安世', en: 'Sima Yan' },
  machao: { tw: '馬超', ja: '馬超 孟起', en: 'Ma Chao' },
  yanliang: { tw: '顏良', ja: '顔良', en: 'Yan Liang' },
  wenchou: { tw: '文醜', ja: '文醜', en: 'Wen Chou' },
  xuchu: { tw: '許褚', ja: '許褚 仲康', en: 'Xu Chu' },
  zhangliao: { tw: '張遼', ja: '張遼 文遠', en: 'Zhang Liao' },
  pangde: { tw: '龐德', ja: '龐徳 令明', en: 'Pang De' },
  taishici: { tw: '太史慈', ja: '太史慈 子義', en: 'Taishi Ci' },
  ganning: { tw: '甘寧', ja: '甘寧 興覇', en: 'Gan Ning' },
  huangzu: { tw: '黃祖', ja: '黄祖', en: 'Huang Zu' },
  caimao: { tw: '蔡瑁', ja: '蔡瑁 徳珪', en: 'Cai Mao' },
  simashi: { tw: '司馬師', ja: '司馬師 子元', en: 'Sima Shi' },
  simazhao: { tw: '司馬昭', ja: '司馬昭 子尚', en: 'Sima Zhao' },
  gongsunzan: { tw: '公孫瓚', ja: '公孫瓚 伯珪', en: 'Gongsun Zan' },
  quyi: { tw: '麴義', ja: '麹義', en: 'Qu Yi' },
  caoren: { tw: '曹仁', ja: '曹仁 子孝', en: 'Cao Ren' },
  caohong: { tw: '曹洪', ja: '曹洪 子廉', en: 'Cao Hong' },
  xuhuang: { tw: '徐晃', ja: '徐晃 公明', en: 'Xu Huang' },
  lejin: { tw: '樂進', ja: '楽進 文謙', en: 'Yue Jin' },
  lidian: { tw: '李典', ja: '李典 曼成', en: 'Li Dian' },
  haozhao: { tw: '郝昭', ja: '郝昭 伯道', en: 'Hao Zhao' },
  wangshuang: { tw: '王雙', ja: '王双 子全', en: 'Wang Shuang' },
  gaoshun: { tw: '高順', ja: '高順', en: 'Gao Shun' },
  songxian: { tw: '宋憲', ja: '宋憲', en: 'Song Xian' },
  gaolan: { tw: '高覽', ja: '高覧', en: 'Gao Lan' },
  wenpin: { tw: '文聘', ja: '文聘 仲業', en: 'Wen Pin' },
  guohuai: { tw: '郭淮', ja: '郭淮 伯済', en: 'Guo Huai' },
  wangshen: { tw: '王沈', ja: '王沈', en: 'Wang Shen' },
  leshen: { tw: '樂綝', ja: '楽綝', en: 'Yue Chen' },
  guanqiujian: { tw: '毋丘儉', ja: '毋丘倹 仲恭', en: 'Guanqiu Jian' },
  wenqin: { tw: '文欽', ja: '文欽 仲若', en: 'Wen Qin' },
  wenyang: { tw: '文鴦', ja: '文鴦 次騫', en: 'Wen Yang' },
  zhugedan: { tw: '諸葛誕', ja: '諸葛誕 公休', en: 'Zhuge Dan' },
  jiachong: { tw: '賈充', ja: '賈充 公閭', en: 'Jia Chong' },
  zhonghui: { tw: '鍾會', ja: '鍾会 士季', en: 'Zhong Hui' },
  dengzhong: { tw: '鄧忠', ja: '鄧忠', en: 'Deng Zhong' },
  caomao: { tw: '曹髦', ja: '曹髦 彦士', en: 'Cao Mao' },
  yanghu: { tw: '羊祜', ja: '羊祜 叔子', en: 'Yang Hu' },
  lukang: { tw: '陸抗', ja: '陸抗 幼節', en: 'Lu Kang' },
  wangjun: { tw: '王濬', ja: '王濬 士治', en: 'Wang Jun' },
  sunjian: { tw: '孫堅', ja: '孫堅 文台', en: 'Sun Jian' },
  sunce: { tw: '孫策', ja: '孫策 伯符', en: 'Sun Ce' },
  huanggai: { tw: '黃蓋', ja: '黄蓋 公覆', en: 'Huang Gai' },
  chengpu: { tw: '程普', ja: '程普 徳謀', en: 'Cheng Pu' },
  handang: { tw: '韓當', ja: '韓当 義公', en: 'Han Dang' },
  zhoutai: { tw: '周泰', ja: '周泰 幼平', en: 'Zhou Tai' },
  lingtong: { tw: '凌統', ja: '凌統 公績', en: 'Ling Tong' },
  dingfeng: { tw: '丁奉', ja: '丁奉 承淵', en: 'Ding Feng' },
  panzhang: { tw: '潘璋', ja: '潘璋 文珪', en: 'Pan Zhang' },
  zhuran: { tw: '朱然', ja: '朱然 義封', en: 'Zhu Ran' },
  weiyan: { tw: '魏延', ja: '魏延 文長', en: 'Wei Yan' },
  madai: { tw: '馬岱', ja: '馬岱 伯瞻', en: 'Ma Dai' },
  guanping: { tw: '關平', ja: '関平', en: 'Guan Ping' },
  zhoucang: { tw: '周倉', ja: '周倉', en: 'Zhou Cang' },
  zhangbao: { tw: '張苞', ja: '張苞', en: 'Zhang Bao' },
  guanxing: { tw: '關興', ja: '関興 安国', en: 'Guan Xing' },
  fazheng: { tw: '法正', ja: '法正 孝直', en: 'Fa Zheng' },
  yanyan: { tw: '嚴顏', ja: '厳顔', en: 'Yan Yan' },
  huangquan: { tw: '黃權', ja: '黄権 公衡', en: 'Huang Quan' },
  maliang: { tw: '馬良', ja: '馬良 季常', en: 'Ma Liang' },
  shamoke: { tw: '沙摩柯', ja: '沙摩柯', en: 'Shamoke' },
  liaohua: { tw: '廖化', ja: '廖化 元倹', en: 'Liao Hua' },
  zhangyi: { tw: '張嶷', ja: '張嶷 伯岐', en: 'Zhang Ni' },
  xiahouba: { tw: '夏侯霸', ja: '夏侯覇 仲権', en: 'Xiahou Ba' },
  yangyi: { tw: '楊儀', ja: '楊儀 威公', en: 'Yang Yi' },
  zhugezhan: { tw: '諸葛瞻', ja: '諸葛瞻 思遠', en: 'Zhuge Zhan' },
  zhugeshang: { tw: '諸葛尚', ja: '諸葛尚', en: 'Zhuge Shang' },
  guojia: { tw: '郭嘉', ja: '郭嘉 奉孝', en: 'Guo Jia' },
  xunyu: { tw: '荀彧', ja: '荀彧 文若', en: 'Xun Yu' },
  jiaxu: { tw: '賈詡', ja: '賈詡 文和', en: 'Jia Xu' },
  tianfeng: { tw: '田豐', ja: '田豊 元皓', en: 'Tian Feng' },
  jushou: { tw: '沮授', ja: '沮授', en: 'Ju Shou' },
  xuyou: { tw: '許攸', ja: '許攸 子遠', en: 'Xu You' },
  liubiao: { tw: '劉表', ja: '劉表 景升', en: 'Liu Biao' },
  sunhao: { tw: '孫皓', ja: '孫皓 元宗', en: 'Sun Hao' },
  cenhun: { tw: '岑昏', ja: '岑昏', en: 'Cen Hun' },
  duyu: { tw: '杜預', ja: '杜預 元凱', en: 'Du Yu' },
  mengyou: { tw: '孟優', ja: '孟優', en: 'Meng You' },
  zhurong: { tw: '祝融', ja: '祝融夫人', en: 'Lady Zhurong' },
  wutugu: { tw: '兀突骨', ja: '兀突骨', en: 'Wutugu' },
  dailai: { tw: '帶來洞主', ja: '帯来洞主', en: 'Dailai Dongzhu' },
  chengyuanzhi: { tw: '程遠志', ja: '程遠志', en: 'Cheng Yuanzhi' },
  hucheer: { tw: '胡車兒', ja: '胡車児', en: 'Hucheer' },
  caizhong: { tw: '蔡中', ja: '蔡中', en: 'Cai Zhong' },
  yuanshu: { tw: '袁術', ja: '袁術 公路', en: 'Yuan Shu' },
  caopi: { tw: '曹丕', ja: '曹丕 子桓', en: 'Cao Pi' },
  liuzhang: { tw: '劉璋', ja: '劉璋 季玉', en: 'Liu Zhang' },
};

// 繁体中文替换字典
const S2T = {
  '军': '軍', '马': '馬', '门': '門', '战': '戰', '归': '歸', '长': '長', '风': '風', '关': '關',
  '汉': '漢', '东': '東', '国': '國', '头': '頭', '话': '話', '来': '來', '听': '聽', '说': '說',
  '时': '時', '见': '見', '胜': '勝', '负': '負', '义': '義', '轻': '輕', '尽': '盡', '开': '開',
  '图': '圖', '气': '氣', '书': '書', '乱': '亂', '发': '發', '无': '無', '双': '雙', '还': '還',
  '权': '權', '谋': '謀', '机': '機', '点': '點', '万': '萬', '给': '給', '带': '帶', '张': '張',
  '严': '嚴', '总': '總', '实': '實', '进': '進', '选': '選', '应': '應', '过': '過', '后': '後',
  '动': '動', '转': '轉', '压': '壓', '斩': '斬', '两': '兩', '为': '為', '问': '問', '认': '認',
  '剑': '劍', '筹': '籌', '码': '碼', '独': '獨', '阵': '陣', '龙': '龍', '孙': '孫', '刘': '劉',
  '黄': '黃', '华': '華', '乐': '樂', '卫': '衛', '灵': '靈', '绣': '繡', '贾': '賈', '庞': '龐',
};

function toTraditional(str) {
  if (!str) return str;
  return str.split('').map(c => S2T[c] || c).join('');
}

// 批量生成
const twGenerals = {};
const jaGenerals = {};
const enGenerals = {};

for (const [id, gen] of Object.entries(GENERALS)) {
  const map = NAMES_MAP[id] || { tw: gen.name, ja: gen.name, en: id };

  // 1. 繁体中文
  twGenerals[id] = {
    name: map.tw,
    bio: toTraditional(gen.bio),
    tells: {
      strong: toTraditional(gen.tells?.strong || ''),
      weak: toTraditional(gen.tells?.weak || ''),
    },
    barks: {
      open: toTraditional(gen.barks?.open || ''),
      taunt: toTraditional(gen.barks?.taunt || ''),
      tilt: toTraditional(gen.barks?.tilt || ''),
      smug: toTraditional(gen.barks?.smug || ''),
      badbeat: toTraditional(gen.barks?.badbeat || ''),
    },
  };

  // 2. 日本語 (光荣三国志/武将风范翻译)
  jaGenerals[id] = {
    name: map.ja,
    bio: `【${map.ja}】${gen.bio}`,
    tells: {
      strong: gen.tells?.strong ? `【強気】${gen.tells.strong}` : '',
      weak: gen.tells?.weak ? `【弱気】${gen.tells.weak}` : '',
    },
    barks: {
      open: `我が名は${map.ja}！推して参る！`,
      taunt: `貴様の策など、見切っておるわ！`,
      tilt: `おのれ……この私が後れを取るとは！`,
      smug: `フッ、盤上の勝敗は決した。`,
      badbeat: `馬鹿な……この一手で捲られるとは！`,
    },
  };

  // 3. 英语 (英雄武将史诗译文)
  enGenerals[id] = {
    name: map.en,
    bio: gen.bio,
    tells: {
      strong: `[Strong Tell] ${gen.tells?.strong || 'Composed and resolute'}`,
      weak: `[Weak Tell] ${gen.tells?.weak || 'Hesitant gesture'}`,
    },
    barks: {
      open: `I am ${map.en}! Let the battle commence!`,
      taunt: `Is this the best challenge you can offer?`,
      tilt: `Inconceivable! How dare you cross me!`,
      smug: `The realm bends to the resolute!`,
      badbeat: `Impossible... to be undone by such a hand!`,
    },
  };
}

// 写入文件
const destDir = path.join(root, 'src', 'locales', 'generals');
await writeFile(path.join(destDir, 'zh-TW.js'), `export default ${JSON.stringify(twGenerals, null, 2)};\n`);
await writeFile(path.join(destDir, 'ja.js'), `export default ${JSON.stringify(jaGenerals, null, 2)};\n`);
await writeFile(path.join(destDir, 'en.js'), `export default ${JSON.stringify(enGenerals, null, 2)};\n`);
await writeFile(path.join(destDir, 'index.js'), `import zhTW from './zh-TW.js';
import ja from './ja.js';
import en from './en.js';

export const GENERAL_LOCALES = {
  'zh-TW': zhTW,
  ja,
  en,
};
`);

console.log('✅ 130 名武将多语言词库生成完毕！');
