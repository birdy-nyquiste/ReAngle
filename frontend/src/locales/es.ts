/**
 * Spanish locale for UI copy.
 * Keys match en.ts: nav.*, landing.*, mainApp.*, common.*, auth.*, pricing.*, profile.*
 */

import type { LocaleEn } from "./en"

export const es: LocaleEn = {
  nav: {
    pricing: "Precios",
    profile: "Perfil",
    settings: "Configuración",
    openApp: "Abrir aplicación",
    login: "Iniciar sesión",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    getStarted: "Comenzar gratis",
    signOut: "Cerrar sesión",
  },

  lang: {
    en: "English",
    zh: "中文",
    es: "Español",
  },

  landing: {
    // Hero
    heroTitleLine1: "ReAngle",
    heroTitleLine2: "Reframe the story from your own Angle",
    heroSubheadline: "",
    heroCta: "Prueba ReAngle",

    // Section 2
    insightTitle1: "Los hechos son objetivos.",
    insightTitle2: "Las narrativas se construyen.",
    insightSameEventCanBe: "Un mismo evento puede presentarse como:",
    insightHeroized: "Una historia heroica",
    insightMoralized: "Un juicio moral",
    insightScandalized: "Un escándalo",
    insightInstitutionalized: "Un análisis institucional",
    insightIdeologized: "Una lectura ideológica",
    insightEntertained: "Un contenido de entretenimiento",
    insightQuote:
      "«Mirar una montaña de frente es ver una cresta; de lado, una cumbre. Desde cada distancia, la perspectiva cambia.»",
    insightReasonPrefix:
      "En medio de la sobrecarga informativa, la mayoría solo consume contenido ya estructurado. Pocos cuentan con la capacidad de descomponer, reorganizar y diseñar su propia narrativa.",
    insightReasonHighlight: "Por eso nació ReAngle.",
    insightSourceA: "Fuente A: Noticias Tecnológicas",
    insightSourceAQuote: "«La regulación de la IA frena la innovación...»",
    insightSourceB: "Fuente B: Ética Digital",
    insightSourceBQuote: "«Una IA sin control implica riesgos existenciales...»",
    insightYourNarrative: "Tu versión ReAngled",
    insightYourNarrativeQuote:
      "«Si bien la regulación busca mitigar riesgos sistémicos, debe aplicarse con precisión para no sofocar el ciclo de innovación que define nuestra era.»",

    // Engine
    engineTitle: "Pasos principales",
    engineIntro:
      "De la filosofía a la ejecución, ReAngle funciona con un flujo claro de tres pasos: Source, Reveal y Reframe.",
    engineFeature1Title: "Source (Fuente)",
    engineFeature1Desc:
      "Hasta 3 fuentes. Todas las fuentes deben tratar sobre la misma historia. Se admiten múltiples formatos: copiar y pegar, TXT, PDF, DOCX y URL. Todas las fuentes se procesan en un único documento de solo texto.",
    engineFeature2Title: "Reveal (Revelar)",
    engineFeature2Desc:
      "ReAngle trabaja a través de las fuentes sobre la misma historia y las trata como portadoras de dos tipos de elementos extraíbles: Eventos (Events) y Puntos de vista (Viewpoints). Verifica la credibilidad de los Eventos en 4 niveles: Verificado, Parcialmente verificado, Falso o fabricado, y No verificado.",
    engineFeature3Title: "Reframe (Replantear)",
    engineFeature3Desc:
      "Elige los eventos y puntos de vista que deseas conservar, o agrega contenido nuevo. Luego, usa indicaciones (longitud, tono, estilo, etc.) para dar forma al artículo reescrito. ReAngle sintetizará todo en una pieza completa y lista para publicar.",

    // Section 4: Glossary
    howToTitle: "Glosario",
    howToIntro:
      "Los pilares básicos de ReAngle: cómo deconstruimos cualquier narrativa.",
    howToStep1Title: "Historia (Story)",
    howToStep1Desc:
      "El tema general compartido en una o más fuentes.",
    howToStep2Title: "Evento (Event)",
    howToStep2Desc:
      "Un suceso que ocurrió dentro de esa historia. Los verificamos mediante evidencia confiable para marcarlos como: Verificado, Parcialmente verificado, Falso o fabricado, o No verificado.",
    howToStep3Title: "Punto de vista (Viewpoint)",
    howToStep3Desc:
      "Una forma particular en que una fuente enmarca la historia y sus eventos.",

    // Who
    whoTitle: "¿Quién usa ReAngle?",
    whoIntro:
      "Haciendo que la capacidad narrativa sea accesible en todos los sectores.",
    whoAudience1Title: "Creadores de contenido y newsletters",
    whoAudience1Desc:
      "Transforma información dispersa en piezas profundas y bien estructuradas, manteniendo tu estilo personal.",
    whoAudience2Title: "PR y marketing digital",
    whoAudience2Desc:
      "Genera respuestas alineadas con el posicionamiento de marca de forma rápida y consistente.",
    whoAudience3Title: "Analistas e investigadores",
    whoAudience3Desc:
      "Filtra el ruido del mercado y sintetiza múltiples fuentes en marcos analíticos claros.",

    // Final CTA
    finalCtaTitle: "ReAngle revela Eventos y Puntos de Vista, y ayuda a los usuarios a reformular la historia en un artículo reescrito con su propia perspectiva.",
    finalCtaButton: "Prueba ReAngle",

    footerCopy: "© 2023–2026 Nyquiste Corporation. All rights reserved.",
  },

  mainApp: {
    profile: "Perfil",
    signOut: "Cerrar sesión",
    inputSources: "Fuentes",
    addContentToTransform: "Agregar contenido",
    pastePlaceholder: "Pega tu texto aquí...",
    urlPlaceholder: "https://example.com/article",
    ytPlaceholder: "https://youtube.com/watch?v=...",
    uploadFile: "Subir archivo",
    supportedFormats: "Soporta: TXT, PDF, DOCX",
    addToQueue: "Añadir a la cola",
    queue: "Cola",
    noItemsInQueue: "Agrega una fuente arriba para comenzar.",

    configuration: "Configuración",
    aiModel: "Modelo de IA",
    selectModel: "Seleccionar modelo",
    modelGpt: "GPT-5",
    modelGemini: "Gemini 3",
    modelQwen: "Qwen 3",

    styleInstructions: "Indicaciones de estilo",
    presets: "Preajustes",
    presetHumorous: "Humorístico",
    presetAcademic: "Académico",
    presetJournalistic: "Periodístico",
    presetBlog: "Blog",
    promptPlaceholder: "Ej: Más profesional y conciso...",

    processing: "Procesando...",
    transformContent: "Generar",

    checkoutBanner: "Ahora tienes Pro. Disfruta de reencuadres ilimitados.",
    addSourcesHint: 'Agrega fuentes arriba y haz clic en "Bloquear fuentes y continuar" para comenzar.',

    summary: "Resumen",
    rewritten: "Resultado",
    compare: "Comparar",
    readAloud: "Leer en voz alta",
    download: "Descargar",
    rewrittenContent: "Contenido generado",

    errorAddItem: "Agrega al menos un elemento.",
    errorUsageLimit:
      "Has alcanzado el límite de uso. Actualiza tu plan.",
    errorSessionExpired:
      "Tu sesión ha expirado. Inicia sesión nuevamente.",

    monthlyLimitReached: "Límite mensual alcanzado",
    upgradeProDesc:
      "Actualiza a Pro para generación ilimitada.",
    upgradeToPro: "Actualizar a Pro",

    textSnippet: "Texto",
    url: "Enlace",
    youtube: "YouTube",
    configureReAngle: "Configura tu ReAngle",
    serverBusy: "Servidor ocupado",
    executionError: "Error de ejecución",
    gatherInputs: "Source Entradas",
    step1Gather: "1. Source",
    step2Deangle: "2. Reveal",
    step3Reangle: "3. Reframe",
    maxInputsAllowed: "Máximo 3 entradas permitidas.",
    usageLimitReached: "Límite de uso alcanzado",
    failedToProcessInputs: "Error al procesar las entradas",
    peakCapacity: "El servicio de IA está saturado. Espera unos segundos e inténtalo de nuevo.",
    themeValidationFailed: "Error de validación del tema",
    completeInputsFirst: "Completa primero el paso Source.",
    deangleFailed: "Reveal falló",
    mustDeangleFirst: "Ejecuta Reveal primero para extraer eventos y puntos de vista.",
    reangleFailed: "Reframe falló",
    ttsFailed: "TTS falló",
    failedToGenerateTTS: "Error al generar el audio. Inténtalo de nuevo.",
    inputsLocked: "Fuentes bloqueadas",
    completeAndContinue: "Bloquear fuentes y continuar",
    deangleDescription: "Extrae eventos y puntos de vista de tus fuentes. Los eventos se verifican contra evidencia externa.",
    startDeangle: "Revelar eventos y puntos de vista",
    selectedFacts: "Eventos",
    selectedOpinions: "Puntos de vista",
    noEventsSelected: "Ningún evento seleccionado.",
    customization: "Prompts",
    customizationPlaceholder: "Da forma al resultado: longitud, tono, estilo, formato, audiencia…",
    reframeDescription: "Selecciona los eventos y puntos de vista a conservar, luego dales forma con prompts.",
    selectFromReveal: "Seleccionar",
    addCustom: "Añadir",
    addCustomFactPlaceholder: "Añade un evento manualmente...",
    addCustomAnglePlaceholder: "Añade un punto de vista manualmente...",
    startReangle: "Generar artículo reencuadrado",
    tabDeangle: "Reveal",
    tabReangle: "Reframe",
    runDeangleToShowResult: "Completa Reveal en la barra lateral para ver eventos y puntos de vista extraídos.",
    runReangleToShowResult: "Completa Reframe en la barra lateral para generar tu artículo.",
    noAnglesSelected: "Ninguna opinión seleccionada.",
    fact: "Hecho",
    opinion: "Opinión",
    copySummary: "Copiar resumen",
    downloadSummaryTxt: "Descargar resumen (TXT)",
    noSummaryGenerated: "Sin resumen generado.",
    summaryLengthChars: "Longitud: {n} caracteres",
    reangledContent: "Contenido reencuadrado",
    avatarBroadcast: "Emisión con avatar",
    copyContent: "Copiar contenido",
    downloadAsTxt: "Descargar como TXT",
    noContentGenerated: "Sin contenido generado.",
    script: "Guion",
    broadcastScript: "Guion de emisión",
    generateScript: "Generar guion",
    generateAvatarVideo: "Generar video con avatar",
    generatingScript: "Generando guion...",
    voiceoverPlaceholder: "Haz clic en Generar guion, luego edita aquí antes de crear el video con avatar.",
    avatarVideo: "Video con avatar",
    downloadAvatarVideo: "Descargar video con avatar",
    generatingAvatarVideo: "Generando video con avatar, espera…",
    noAvatarVideoYet: "Aún no hay video con avatar. Genera uno desde la sección del guion.",
    howToCreateAvatarVideo: "Cómo crear tu video con avatar",
    avatarStep1: "1. Haz clic en \"Generar guion\" y edita (menos de {n} caracteres).",
    avatarStep2: "2. Haz clic en \"Generar video con avatar\"; suele tardar 5-10 minutos.",
    avatarUnavailable: "Avatar no disponible",
    avatarSignInRequired: "Inicia sesión para usar el avatar.",
    avatarCheckingAccess: "Comprobando acceso al avatar...",
    avatarProOnly: "El avatar está disponible solo para usuarios Pro.",
    avatarSignInRequiredQuota: "Inicio de sesión requerido.",
    avatarCheckingQuota: "Comprobando cuota de avatar...",
    avatarProRequired: "Se requiere plan Pro: 5 generaciones de avatar por ciclo.",
    avatarUnavailableGeneric: "El avatar no está disponible en este momento.",
    avatarConfirmScriptFirst: "Genera y confirma el guion de voz en off antes de generar el video con avatar.",
    avatarUsageCycleUnlimited: "Uso de avatar este ciclo: {n} usado (ilimitado).",
    avatarUsageCycleUsed: "Uso de avatar este ciclo: {used}/{limit} usado.",
    originalFacts: "Eventos",
    selectFactsHint: "Selecciona eventos para conservar en tu narrativa",
    originalOpinions: "Puntos de vista",
    selectOpinionsHint: "Selecciona puntos de vista para conservar en tu narrativa",
    analysisLabel: "Análisis:",
    descriptionLabel: "Descripción:",
    noFactsYet: "Aún no hay eventos extraídos.",
    noOpinionsYet: "Aún no hay puntos de vista detectados.",
    factVerified: "Verificado",
    factPartiallyVerified: "Parcialmente verificado",
    factFalseOrFabricated: "Falso o Fabricado",
    factUnverified: "No verificado",
    credibilityVerified: "Verificado — Respaldado firmemente por evidencia confiable",
    credibilityPartially: "Parcialmente verificado — Respaldado en parte, pero algunos detalles siguen siendo poco claros, exagerados o sin respaldo",
    credibilityFalse: "Falso o fabricado — Evidencia sólida contradice el evento, o parece ser en gran parte inventado",
    credibilityUnverified: "No verificado — No se encontró suficiente evidencia confiable para confirmar el evento",
    removeSelection: "quitar",
    revealAnalyzing: "Analizando eventos y puntos de vista…",
    reframeGenerating: "Generando tu narrativa reencuadrada…",
    voiceoverGenerateFailed: "Error al generar el guion de voz",
    voiceoverGenerateFailedRetry: "Error al generar el guion de voz. Inténtalo de nuevo.",
    avatarScriptTooLong: "El guion supera los {n} caracteres. Acórtalo antes de generar el video con avatar.",
    avatarVideoGenerateFailed: "Error al generar el video con avatar",
    avatarVideoGenerateFailedRetry: "Error al generar el video con avatar. Inténtalo de nuevo.",
  },

  common: {
    backHome: "Volver al inicio",
    loading: "Cargando...",
  },

  auth: {
    loginTitle: "Bienvenido de nuevo",
    loginSubtitle: "Inicia sesión en tu cuenta",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    noAccount: "¿No tienes cuenta?",
    signUp: "Registrarse",

    registerTitle: "Crear cuenta",
    registerSubtitle:
      "Empieza con el plan gratuito (5 usos)",
    confirmPasswordLabel: "Confirmar contraseña",
    creatingAccount: "Creando cuenta...",
    createAccount: "Crear cuenta",
    alreadyHaveAccount: "¿Ya tienes cuenta?",
    registerSignInLink: "Iniciar sesión",

    registerSuccessTitle: "Revisa tu correo",
    registerSuccessPrefix: "Hemos enviado un enlace de confirmación a",
    registerSuccessSuffix:
      "Haz clic en el enlace para activar tu cuenta.",
    goToLogin: "Ir a iniciar sesión",

    passwordMismatch: "Las contraseñas no coinciden",
    passwordTooShort:
      "La contraseña debe tener al menos 6 caracteres",
  },

  pricing: {
    title: "Precios",
    subtitle:
      "Precios en USD. Empieza gratis y actualiza cuando necesites escala.",
    freeTitle: "Gratis",
    freeTagline: "Para uso mensual ligero",
    proTitle: "Pro",
    proBadge: "Popular",
    proTagline: "Para creación continua",

    featWorkflow: "Función Central",
    featGenerations: "Generación de Artículo (ReAngle)",
    featTTS: "Generación TTS",
    featAvatar: "Generación de Avatar",
    featDashboard: "Panel de control y gestión",
    featPriority: "Procesamiento prioritario",

    freeWorkflow: "Incluido",
    freeGenerations: "5 / mes",
    freeTTS: "1 / mes",
    freeAvatar: "No incluido",
    freeDashboard: "No incluido",
    freePriority: "No incluido",

    proWorkflow: "Incluido",
    proGenerations: "Ilimitado",
    proTTS: "20 / mes",
    proAvatar: "5 / mes",
    proDashboard: "Incluido",
    proPriority: "Incluido",

    freeCtaGoToApp: "Ir a la app",
    freeCtaGetStarted: "Comenzar",
    proCta: "Actualizar a Pro",
    proCtaLoading: "Espera...",
    upgradeErrorGeneric:
      "Algo salió mal. Intenta nuevamente.",
  },

  profile: {
    accountTitle: "Cuenta",
    emailLabel: "Correo",
    planLabel: "Plan",
    planPro: "Pro",
    planFree: "Gratis",
    expiresLabel: "Expira",
    renewsLabel: "Renueva",

    usageTitle: "Uso",
    rewritesUsed: "Reencuadres usados",
    ttsUsed: "TTS usados",
    avatarUsed: "Avatar usados",
    usageLoading: "Cargando...",

    subscriptionTitle: "Suscripción",
    cancelledWarningPrefix:
      "Tu plan Pro estará activo hasta",
    cancelledWarningSuffix:
      "Luego pasarás al plan gratuito.",
    renewInfoPrefix:
      "Tu plan se renovará el",

    manageSubscription: "Gestionar suscripción",
    manageOpening: "Abriendo...",
    manageSubtitleActive:
      "Actualizar pago, cancelar o ver facturas",
    manageSubtitleCancelled:
      "Reactivar, actualizar pago o ver facturas",

    upgradeTeaser:
      "Obtén usos ilimitados, TTS y avatar por $9.99/mes.",
    viewPlans: "Ver planes",
    signOut: "Cerrar sesión",
  },
  settings: {
    title: "Configuración",
    subtitle: "Configura modelos y system prompts.",
    revealModel: "Modelo Reveal",
    reframeModel: "Modelo Reframe",
    revealDetachPrompt: "System Prompt de separación Reveal",
    revealFactCheckPrompt: "System Prompt de verificación Reveal",
    reframePrompt: "System Prompt de Reframe",
    usingDefault: "Usando valor por defecto",
    customized: "Personalizado",
    save: "Guardar",
    saving: "Guardando...",
    reset: "Restablecer por defecto",
    loadError: "No se pudo cargar la configuración.",
    saveError: "No se pudo guardar la configuración.",
    saveSuccess: "Configuración guardada.",
    sectionReveal: "Reveal",
    sectionReframe: "Reframe",
    sectionAvatar: "Avatar",
    modelLabel: "Modelo",
    promptLabel: "Prompt",
    collapse: "Contraer",
    expand: "Expandir",
    collapseReveal: "Contraer sección Reveal",
    expandReveal: "Expandir sección Reveal",
    collapseReframe: "Contraer sección Reframe",
    expandReframe: "Expandir sección Reframe",
    collapseAvatar: "Contraer sección Avatar",
    expandAvatar: "Expandir sección Avatar",
    avatarComingSoon: "La configuración de avatar estará disponible pronto.",
  },
}
