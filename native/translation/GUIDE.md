# 《三国：天下为注》多语言翻译指南 / Translation Guide

## 项目背景（必读）
这是一款"三国 × 德州扑克"单机叙事游戏。乱世英雄白天争天下、夜里赌江山。玩家捡到残卷《英雄记》，用牌局改写历史的遗憾。文案分几层：
- **章节文学文本**（story.*/brief.*）：史书冷开场、行军见闻、胜负双结局——文风凝练、有史书感，但不是文言文。
- **武将台词**（gen.*.bark、tell.*）：每个武将有固定性格语气——张飞粗豪、诸葛沉静、吕布狂傲、刘备温厚。台词要"像那个人说出来的话"。
- **战书/题记**（brief.*、ch.*）：交代史实底稿与改编边界，语气克制、信息准确。
- **破绽台词**（tell.*）：牌桌上武将"说漏嘴的话"，短促、口语、有表演性。真强偏随意笃定，装强偏用力过火。

## 铁律（所有语言）
1. **禁止翻译腔**。不要逐字直译，不要"被AI翻译过"的塑料味。读完中文后，用目标语言"重新写一遍"——像一个母语写手为这款游戏专门创作。
2. **同一个词全篇统一**（人名、术语、机制名）。译前先通读本指南术语表；译中不确定的词，回头看已译过的用法。
3. **语气分层**：旁白=克制叙述；武将台词=有个性口癖；系统文案=简短明确。
4. **扑克术语用各语言社区通用说法**（见术语表），不要自造。
5. **人名、地名**遵循各语言的三国习惯译名（见下）。
6. 数字、占位符、标点结构保持；引号内引号处理按目标语言规范。
7. 宁可短、不要空泛。中文的留白用目标语言的自然节奏补偿，不逐字硬撑长度。
8. 输出 JSON：**键与源文件完全一致，一个不漏、一个不加**；值为译文。写完自查 JSON 可解析、键数相等。

## 核心术语表（务必遵循；如确有更自然的译法可在译文中统一调整，但一个词只能有一种译法）

| 中文 | en | ja | ko | es | de |
|---|---|---|---|---|---|
| 德州扑克 | Texas Hold'em | テキサス・ホールデム | 텍사스 홀덤 | Texas Hold'em | Texas Hold'em |
| 底池 | pot | ポット | 팟 | bote | Pot |
| 盲注 | blinds | ブラインド | 블라인드 | ciegas | Blinds |
| 小盲/大盲 | small blind / big blind | スモールブラインド / ビッグブラインド | 스몰 블라인드 / 빅 블라인드 | ciega pequeña / ciega grande | Small Blind / Big Blind |
| 下注/加注 | bet / raise | ベット / レイズ | 벳 / 레이즈 | apostar / subir | setzen / erhöhen |
| 跟注 | call | コール | 콜 | igualar | mitgehen (Call) |
| 过牌 | check | チェック | 체크 | pasar | schieben (Check) |
| 弃牌 | fold | フォールド | 폴드 | retirarse | passen (Fold) |
| 全压 | all-in | オールイン | 올인 | all-in | All-In |
| 边池 | side pot | サイドポット | 사이드팟 | bote lateral | Side Pot |
| 庄位 | dealer button | ディーラーボタン | 딜러 버튼 | botón | Dealer Button |
| 军资（筹码） | war chest | 軍資金 | 군자금 | arca de guerra | Kriegskasse |
| 破绽 | tell | テル | 텔 | tell | Tell |
| 攻心（技能） | Goading | 攻心 | 공심 | Provocación | Anstacheln |
| 观星（技能） | Reading the Stars | 観星 | 관성 | Leer las estrellas | Sterne deuten |
| 天时 | Omen | 天時 | 천시 | Presagio | Omen |
| 战书 | Challenge | 挑戦状 | 도전장 | Desafío | Herausforderung |
| 史鉴 | Lesson | 史鑑 | 사감 | Lección | Lehre |
| 残卷 | the tattered scroll | 残巻 | 잔권 | el rollo dañado | die zerfledderte Rolle |
| 原卷/野史 | the record / the apocrypha | 原巻／野史 | 원권／야사 | el registro / la historia no oficial | die Originalaufzeichnung / die inoffizielle Geschichte |
| 写卷人 | the Writer | 写し手 | 두루마리 필자 | el Escriba | der Schreiber |
| 行军 | the march | 行軍 | 행군 | la marcha | der Marsch |
| 观阵录 | Annals | 観陣録 | 관진록 | Anales | Annalen |
| 野战练习场 | Skirmish Grounds | 野戦練兵場 | 야전 연습장 | Campo de maniobras | Übungsfeld |
| 武将 | general | 武将 | 무장 | general | General |
| 六维 武勇/智谋/诈术/胆识/耐性/心性 | Valor / Wits / Deceit / Nerve / Patience / Temper | 武勇／智謀／詐術／胆識／忍耐／心性 | 무용／지모／술책／담력／인내／심성 | Valentía / Astucia / Engaño / Temple / Paciencia / Genio | Tapferkeit / Verstand / Täuschung / Nerven / Geduld / Gemüt |
| 牌型 高牌~同花顺 | High Card, Pair, Two Pair, Trips, Straight, Flush, Full House, Quads, Straight Flush | ハイカード、ワンペア、ツーペア、スリーカード、ストレート、フラッシュ、フルハウス、フォーカード、ストレートフラッシュ | 하이카드, 원페어, 투페어, 트리플, 스트레이트, 플러시, 풀하우스, 포카드, 스트레이트 플러시 | Carta alta, Pareja, Doble pareja, Trío, Escalera, Color, Full, Póker, Escalera de color | Höchste Karte, Paar, Zwei Paare, Drilling, Straße, Flush, Full House, Vierlinge, Straight Flush |

## 人名/地名惯例
- **ja**：汉字名直接沿用日文惯用写法（劉備・関羽・張飛・趙雲・曹操・呂布・諸葛亮・周瑜・司馬懿…），簡体字形转日本汉字字形。地名同理（虎牢関、白馬、麦城、五丈原…）。
- **ko**：한국 한자음（유비·관우·장비·조조·여포·제갈량·주유·사마의…），지명도 관례 표기（호로관·백마·맥성·오장원…）.
- **en/es/de**：人名用拼音（Liu Bei, Guan Yu, Lü Bu, Zhuge Liang, Zhou Yu, Sima Yi…），地名用通行译名（Hulao Pass, Baima, Maicheng, Wuzhang Plains, Red Cliffs/Chibi…；es/de 同用拼音，不另造）。头衔（渠帅/渠魁）意译为该语言的自然说法。

## 各语言风格要点
- **ja**：史書の落ち着いた現代日本語。セリフはキャラ口調（張飛「俺」、諸葛亮「私」、吕布の尊大…）。助詞まで自然に。翻訳調の「ですます」多用は禁止（旁白は「である」調でもよい）。
- **ko**：역사소설 톤의 자연스러운 한국어. 하드번역투 금지. 무장 말투 구분(장비 거침, 제갈량 침착). 개행과 리듬을 한국어에 맞게.
- **en**：文学但克制，短句有力。保持 Writer 那种冷幽默、惜字如金的 voice。避免维多利亚腔和过度修饰。
- **es**：西班牙语自然文学腔（中性拉美/半岛均可，全文统一），避免英语借词滥用；póker 术语用通行说法。
- **de**：自然德语文学腔，避免名词串和被动句堆砌；扑克术语保留英语借词（Pot, Blinds, All-In）如德语社区惯例。

## 工作流程
1. 读本指南 + `glossary-check.json`（若有）。
2. 依次处理 `chunks/chunk-01.json` … `chunk-19.json`（键→中文）。
3. 每块译文写入 `out/<lang>/chunk-XX.json`，键与源块完全一致。
4. 已存在的输出文件跳过（支持断点续传）。
5. 每写完一块，用 `node -e` 或 python 校验：JSON 可解析、键集合与源块一致。
6. 全部完成后输出简报：块数、键数、术语决策（如有偏离术语表的决定请列出）。
