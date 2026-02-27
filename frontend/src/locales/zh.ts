/**
 * Chinese locale for UI copy.
 * Keys match en.ts: nav.*, landing.*, mainApp.*
 */

import type { LocaleEn } from "./en"

export const zh: LocaleEn = {
  nav: {
    pricing: "定价",
    profile: "个人中心",
    openApp: "打开应用",
    login: "登录",
    getStarted: "免费开始",
    signOut: "退出登录",
  },
  lang: {
    en: "English",
    zh: "中文",
  },
  landing: {
    // Hero
    heroTitleLine1: "别只消费叙事。",
    heroTitleLine2: "换个角度，重讲一遍。",
    heroSubheadline:
      "事实是客观的，叙事是被建构的。我们把同一事件的多源、嘈杂信息整合成一篇统一、角度精准的文章——用你的口吻与立场。",
    heroCta: "立即开始 ReAngle",
    // Section 2: The Insight
    insightTitle1: "事实是客观的。",
    insightTitle2: "叙事是被建构的。",
    insightSameEventCanBe: "同一件客观事实可以被：",
    insightHeroized: "英雄化",
    insightMoralized: "道德化",
    insightScandalized: "丑闻化",
    insightInstitutionalized: "体制化",
    insightIdeologized: "意识形态化",
    insightEntertained: "娱乐化",
    insightQuote:
      "横看成岭侧成峰，远近高低各不同。",
    insightReason:
      "在信息爆炸的洪流中，多数人只是被动接受；他们缺乏拆解、重构或主动设计叙事的能力。这正是 ReAngle 诞生的理由。",
    insightSourceA: "来源 A：科技新闻",
    insightSourceAQuote: "「AI 监管扼杀市场创新……」",
    insightSourceB: "来源 B：伦理日报",
    insightSourceBQuote: "「不受约束的 AI 带来存在性风险……」",
    insightYourNarrative: "你的 ReAngle 叙事",
    insightYourNarrativeQuote:
      "「全面监管旨在化解存在性风险，但必须精准施策，避免扼杀定义我们时代的快速创新周期。」",
    // Section 3: The Narrative Engine
    engineTitle: "叙事引擎",
    engineIntro:
      "不只是又一个 AI 摘要工具。ReAngle 是专为「如何讲、如何发」而建的引擎，让你完全掌控故事的讲述与传播。",
    engineFeature1Title: "重讲这个故事",
    engineFeature1Desc:
      "拒绝现成的观点包。换个观察角度，自己把故事重讲一遍。",
    engineFeature2Title: "能力产品化",
    engineFeature2Desc:
      "叙事能力不再是大 PR 的专属。我们把它封装成创作者触手可及的服务。",
    engineFeature3Title: "流程极简",
    engineFeature3Desc:
      "把数小时的交叉引用、多源调研与撰稿压缩成几次点击。",
    // Section 4: How to ReAngle
    howToTitle: "如何 ReAngle",
    howToIntro:
      "从互联网的嘈杂噪音到一篇打磨好的作品，只需三步。",
    howToStep1Title: "汇聚",
    howToStep1Desc:
      "扔进一堆链接、YouTube、PDF 或纯文本，把互联网的混沌投进引擎。",
    howToStep2Title: "设定角度",
    howToStep2Desc:
      "英雄化？批判？分析？调好参数，选择你要的立场。",
    howToStep3Title: "ReAngle",
    howToStep3Desc:
      "看引擎用你的视角把事实纺成一篇打磨好的统一长文。",
    // Section 5: Who is ReAngling?
    whoTitle: "谁在用 ReAngle？",
    whoIntro: "让叙事能力在各行各业普及。",
    whoAudience1Title: "Newsletter 与内容创作者",
    whoAudience1Desc:
      "把每周新闻合成为犀利、有洞见的长文，并赋予个人化的语气。",
    whoAudience2Title: "公关与数字营销",
    whoAudience2Desc:
      "快速起草面向市场的回应与新闻稿，有力对齐并捍卫品牌立场。",
    whoAudience3Title: "分析师与研究者",
    whoAudience3Desc:
      "过滤行业喧嚣，把多源数据提炼成贴合机构观点的核心研究视角。",
    // Section 6: Final CTA
    finalCtaTitle: "夺回叙事权。",
    finalCtaButton: "开始使用 ReAngle",
    // Footer
    footerCopy: "© 2026 ReAngle. 让叙事为你服务。",
  },
  mainApp: {
    profile: "个人中心",
    signOut: "退出登录",
    inputSources: "输入来源",
    addContentToTransform: "添加待改写内容",
    pastePlaceholder: "在此粘贴文本...",
    urlPlaceholder: "https://example.com/article",
    ytPlaceholder: "https://youtube.com/watch?v=...",
    uploadFile: "上传文件",
    supportedFormats: "支持格式：TXT、PDF、DOCX",
    addToQueue: "加入队列",
    queue: "队列",
    noItemsInQueue: "队列为空",
    configuration: "配置",
    aiModel: "AI 模型",
    selectModel: "选择模型",
    modelGpt: "GPT-5（最佳质量）",
    modelGemini: "Gemini 2.5 Flash",
    modelQwen: "Qwen Flash",
    styleInstructions: "风格说明",
    presets: "预设",
    presetHumorous: "幽默",
    presetAcademic: "学术",
    presetJournalistic: "新闻",
    presetBlog: "博客",
    promptPlaceholder: "例如：更专业、更简洁...",
    processing: "处理中...",
    transformContent: "开始改写",
    checkoutBanner: "您已升级 Pro！享受无限改写。",
    addSourcesHint: "添加来源并点击「开始改写」查看结果",
    summary: "摘要",
    rewritten: "改写文",
    compare: "对比",
    readAloud: "朗读",
    download: "下载",
    rewrittenContent: "改写内容",
    errorAddItem: "请至少添加一项内容。",
    errorUsageLimit: "用量已达上限，请升级计划。",
    errorSessionExpired: "登录已过期，请重新登录。",
    monthlyLimitReached: "本月用量已用完",
    upgradeProDesc: "升级 Pro 享受无限改写。",
    upgradeToPro: "升级 Pro",
    textSnippet: "文本片段",
    url: "链接",
    youtube: "YouTube",
  },
}
