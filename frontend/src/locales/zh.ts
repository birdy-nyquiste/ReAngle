/**
 * Chinese locale for UI copy.
 * Keys match en.ts: nav.*, landing.*, mainApp.*, common.*, auth.*, pricing.*, profile.*
 */

import type { LocaleEn } from "./en"

export const zh: LocaleEn = {
  nav: {
    pricing: "订阅",
    profile: "个人中心",
    settings: "设置",
    openApp: "进入应用",
    login: "登录",
    signIn: "登录",
    signUp: "注册",
    getStarted: "免费开始",
    signOut: "退出登录",
  },
  lang: {
    en: "English",
    zh: "中文",
  },
  landing: {
    // Hero
    heroTitleLine1: "别只消费别人的叙事",
    heroTitleLine2: "把它 ReAngle",
    heroSubheadline:
      "事实是客观的，叙事是被塑造的。ReAngle 把叙事主动权还给你：先看清事件，再选择立场，最后用你的语气完成表达。",
    heroCta: "立即开始",

    // Section 2: The Insight
    insightTitle1: "事实是客观的",
    insightTitle2: "叙事是被塑造的",
    insightSameEventCanBe: "同一件事，可以被讲成：",
    insightHeroized: "英雄叙事",
    insightMoralized: "道德评判",
    insightScandalized: "丑闻爆料",
    insightInstitutionalized: "制度解读",
    insightIdeologized: "立场解读",
    insightEntertained: "娱乐包装",
    insightQuote: "“横看成岭侧成峰，远近高低各不同。”",
    insightReasonPrefix:
      "信息爆炸的洪流里，多数人只是被动接收——缺少把信息拆开、理顺、再用自己的方式讲清楚的能力。",
    insightReasonHighlight: "这正是 ReAngle 诞生的原因。",
    insightSourceA: "来源 A：科技媒体",
    insightSourceAQuote: "「AI 监管正在压制市场创新……」",
    insightSourceB: "来源 B：伦理观察",
    insightSourceBQuote: "「缺乏约束的 AI 可能带来生存级风险……」",
    insightYourNarrative: "你的 ReAngled 版本",
    insightYourNarrativeQuote:
      "「全面监管固然意在降低生存级风险，但政策应更精准，避免扼杀推动时代向前的快速创新周期。」",

    // Section 3: The Narrative Engine
    engineTitle: "三阶段引擎",
    engineIntro:
      "从理念到执行，ReAngle 用清晰的三段流程工作：Gather、DeAngle、ReAngle。",
    engineFeature1Title: "Gather",
    engineFeature1Desc:
      "围绕同一主题收集多个输入，系统会先做主题一致性验证，再进入后续处理。",
    engineFeature2Title: "DeAngle",
    engineFeature2Desc:
      "先做 Detach，拆出事实与观点；再做 Fact Check，为后续生成建立可信事实底座。",
    engineFeature3Title: "ReAngle",
    engineFeature3Desc:
      "基于已验证事实和你选择的观点，重组出符合你风格和目标的最终叙事。",

    // Section 4: How to ReAngle
    howToTitle: "流程说明",
    howToIntro: "面向叙事控制的可执行流程。",
    howToStep1Title: "Gather（主题验证）",
    howToStep1Desc:
      "为同一主题添加多个输入，系统会自动检查输入是否主题一致。",
    howToStep2Title: "DeAngle（Detach + Fact Check）",
    howToStep2Desc:
      "先拆分事实与观点，再对拆出的事实进行核查，降低噪音和失真。",
    howToStep3Title: "ReAngle",
    howToStep3Desc:
      "把核查后的事实与选定观点重组为你的表达版本。",

    // Section 5: Who is ReAngling?
    whoTitle: "谁在用 ReAngle？",
    whoIntro: "让更专业的表达能力，变得人人可用。",
    whoAudience1Title: "Newsletter / 内容创作者",
    whoAudience1Desc:
      "把每周信息整合成更锋利、更有洞见的长文，并保留个人写作风格。",
    whoAudience2Title: "公关 / 品牌与数字营销",
    whoAudience2Desc:
      "快速生成更贴合品牌定位的回应与新闻稿，保持口径一致、表达更稳。",
    whoAudience3Title: "分析师 / 研究者",
    whoAudience3Desc:
      "过滤行业噪音，把多源材料提炼成更清晰的分析框架与研究观点。",

    // Section 6: Final CTA
    finalCtaTitle: "把表达主动权拿回来",
    finalCtaButton: "开始使用 ReAngle",

    // Footer
    footerCopy: "© 2026 ReAngle. 让表达更清晰、更有方向。",
  },

  mainApp: {
    profile: "个人中心",
    signOut: "退出登录",
    inputSources: "输入来源",
    addContentToTransform: "添加要处理的内容",
    pastePlaceholder: "在这里粘贴文本…",
    urlPlaceholder: "https://example.com/article",
    ytPlaceholder: "https://youtube.com/watch?v=...",
    uploadFile: "上传文件",
    supportedFormats: "支持：TXT / PDF / DOCX",
    addToQueue: "加入队列",
    queue: "队列",
    noItemsInQueue: "队列里还没有内容",

    configuration: "设置",
    aiModel: "AI 模型",
    selectModel: "选择模型",
    modelGpt: "GPT-5",
    modelGemini: "Gemini 3",
    modelQwen: "Qwen 3",

    styleInstructions: "风格要求",
    presets: "预设",
    presetHumorous: "幽默",
    presetAcademic: "学术",
    presetJournalistic: "新闻",
    presetBlog: "博客",
    promptPlaceholder: "例如：更专业、更简洁…",

    processing: "处理中…",
    transformContent: "开始生成",

    checkoutBanner: "你已升级到 Pro！可无限使用。",
    addSourcesHint: "先添加来源，再点击「开始生成」查看结果",

    summary: "摘要",
    rewritten: "生成稿",
    compare: "对比",
    readAloud: "朗读",
    download: "下载",
    rewrittenContent: "生成内容",

    errorAddItem: "请至少添加一条内容。",
    errorUsageLimit: "本月用量已达上限，请升级套餐。",
    errorSessionExpired: "登录已过期，请重新登录。",

    monthlyLimitReached: "本月用量已用完",
    upgradeProDesc: "升级 Pro，解锁无限生成。",
    upgradeToPro: "升级到 Pro",

    textSnippet: "文本",
    url: "链接",
    youtube: "YouTube",
  },

  common: {
    backHome: "返回首页",
    loading: "加载中…",
  },

  auth: {
    loginTitle: "欢迎回来",
    loginSubtitle: "登录你的账户",
    emailLabel: "邮箱",
    passwordLabel: "密码",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    signIn: "登录",
    signingIn: "正在登录…",
    noAccount: "还没有账号？",
    signUp: "注册",

    registerTitle: "创建账号",
    registerSubtitle: "免费试用：每月 5 次",
    confirmPasswordLabel: "确认密码",
    creatingAccount: "正在创建账号…",
    createAccount: "创建账号",
    alreadyHaveAccount: "已有账号？",
    registerSignInLink: "去登录",

    registerSuccessTitle: "请查收邮箱",
    registerSuccessPrefix: "我们已向",
    registerSuccessSuffix: "发送确认链接，请点击激活账号。",
    goToLogin: "前往登录",

    passwordMismatch: "两次输入的密码不一致",
    passwordTooShort: "密码至少 6 位",
  },

  pricing: {
    title: "简单定价",
    subtitle: "美元计价。先免费使用，需要规模化时再升级。",
    freeTitle: "免费版",
    freeTagline: "适合轻度使用",
    freeFeature1: "每月 5 次 ReAngle 生成",
    freeFeature2: "每月 1 次 TTS",
    freeFeature3: "Gather + DeAngle + ReAngle 流程",
    freeFeature4: "不包含 Avatar",
    freeCtaGoToApp: "进入应用",
    freeCtaGetStarted: "免费开始",

    proTitle: "Pro 版",
    proBadge: "热门选择",
    proTagline: "适合持续创作",
    proFeature1: "无限次 ReAngle 生成",
    proFeature2: "每月 20 次 TTS",
    proFeature3: "每账期 5 次 Avatar",
    proFeature4: "Gather + DeAngle + ReAngle 流程",
    proFeature5: "Stripe 订阅管理",
    proFeature6: "个人中心用量看板",
    proCta: "升级到 Pro",
    proCtaLoading: "处理中…",
    upgradeErrorGeneric: "出错了，请稍后重试。",
  },

  profile: {
    accountTitle: "账户信息",
    emailLabel: "邮箱",
    planLabel: "套餐",
    planPro: "Pro",
    planFree: "Free",
    expiresLabel: "到期时间",
    renewsLabel: "续费时间",

    usageTitle: "用量",
    rewritesUsed: "ReAngle 已用次数",
    ttsUsed: "TTS 已用次数",
    avatarUsed: "Avatar 已用次数",
    usageLoading: "加载中…",

    subscriptionTitle: "订阅",
    cancelledWarningPrefix: "你的 Pro 将在",
    cancelledWarningSuffix: "到期，之后自动切换为免费版。",
    renewInfoPrefix: "你的套餐将于以下日期续费：",

    manageSubscription: "管理订阅",
    manageOpening: "正在打开…",
    manageSubtitleActive: "可更新支付方式、取消订阅或查看账单",
    manageSubtitleCancelled: "可重新开通、更新支付方式或查看账单",

    upgradeTeaser: "每月 $9.99，解锁无限生成 + TTS / 数字人。",
    viewPlans: "查看套餐",
    signOut: "退出登录",
  },
  settings: {
    title: "设置",
    subtitle: "配置模型与 System Prompt。",
    deangleModel: "DeAngle 模型",
    reangleModel: "ReAngle 模型",
    deangleDetachPrompt: "DeAngle 拆分 System Prompt",
    deangleFactCheckPrompt: "DeAngle 事实核查 System Prompt",
    reanglePrompt: "ReAngle System Prompt",
    usingDefault: "使用默认值",
    customized: "已自定义",
    save: "保存",
    saving: "保存中…",
    reset: "恢复默认",
    loadError: "加载设置失败。",
    saveError: "保存设置失败。",
    saveSuccess: "设置已保存。",
  },
}
