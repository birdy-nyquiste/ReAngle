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
    heroTitleLine1: "No consumas la narrativa.",
    heroTitleLine2: "ReAngléala.",
    heroSubheadline:
      "Los hechos son objetivos. Las narrativas se construyen. Tomamos múltiples fuentes dispersas sobre un mismo evento y las reestructuramos en un artículo coherente, con el ángulo preciso y tu propia voz.",
    heroCta: "Empieza hoy",

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
    engineTitle: "El Motor Narrativo",
    engineIntro:
      "No es solo otra herramienta de resumen. ReAngle es un motor diseñado para darte control real sobre cómo se estructura y comunica una historia.",
    engineFeature1Title: "Reformula la historia",
    engineFeature1Desc:
      "No aceptes puntos de vista prefabricados. Cambia el ángulo y cuenta la historia a tu manera.",
    engineFeature2Title: "Capacidad convertida en herramienta",
    engineFeature2Desc:
      "La construcción narrativa ya no es privilegio exclusivo de grandes agencias. La convertimos en un sistema accesible para creadores.",
    engineFeature3Title: "Flujo simplificado",
    engineFeature3Desc:
      "Reduce horas de análisis y redacción a unos pocos pasos claros.",

    // How To
    howToTitle: "Cómo usar ReAngle",
    howToIntro:
      "Del ruido digital a un texto sólido y estructurado en tres pasos.",
    howToStep1Title: "Reúne",
    howToStep1Desc:
      "Agrega enlaces, videos de YouTube, PDFs o texto plano y centraliza toda la información en el motor.",
    howToStep2Title: "Define el ángulo",
    howToStep2Desc:
      "¿Más analítico? ¿Más crítico? Ajusta los parámetros y elige la postura que deseas adoptar.",
    howToStep3Title: "ReAngle",
    howToStep3Desc:
      "El motor reorganiza los hechos según tu perspectiva y genera un artículo coherente y consistente.",

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
    finalCtaTitle: "Recupera el control de tu narrativa.",
    finalCtaButton: "Comenzar ahora",

    footerCopy:
      "© 2026 ReAngle. Diseña tu narrativa con claridad.",
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
    noItemsInQueue: "No hay elementos en la cola",

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

    checkoutBanner:
      "Ahora tienes Pro. Disfruta de generación ilimitada.",
    addSourcesHint:
      'Agrega fuentes y haz clic en "Generar" para ver el resultado',

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
    gatherInputs: "Reunir entradas",
    step1Gather: "1. Reunir entradas",
    step2Deangle: "2. DeAngle",
    step3Reangle: "3. ReAngle",
    maxInputsAllowed: "Máximo 3 entradas permitidas.",
    usageLimitReached: "Límite de uso alcanzado",
    failedToProcessInputs: "Error al procesar las entradas",
    peakCapacity: "El servicio de IA está saturado. Espera unos segundos e inténtalo de nuevo.",
    themeValidationFailed: "Error de validación del tema",
    completeInputsFirst: "Completa primero el paso de entradas.",
    deangleFailed: "DeAngle falló",
    mustDeangleFirst: "Debes ejecutar DeAngle primero.",
    reangleFailed: "ReAngle falló",
    ttsFailed: "TTS falló",
    failedToGenerateTTS: "Error al generar el audio. Inténtalo de nuevo.",
    inputsLocked: "Entradas bloqueadas",
    completeAndContinue: "Completar y continuar",
    deangleDescription: "Aplica DeAngle a tus entradas y distingue opiniones de hechos verificados",
    startDeangle: "Iniciar DeAngle",
    selectedFacts: "Hechos seleccionados",
    selectedOpinions: "Opiniones seleccionadas",
    noEventsSelected: "Ningún evento seleccionado.",
    customization: "Personalización",
    customizationPlaceholder: "Personaliza tu ReAngle...",
    startReangle: "Iniciar ReAngle",
    tabDeangle: "DeAngle",
    tabReangle: "ReAngle",
    runDeangleToShowResult: "Ejecuta DeAngle para ver el resultado.",
    runReangleToShowResult: "Ejecuta ReAngle para ver el resultado.",
    noAnglesSelected: "Ninguna opinión seleccionada.",
    fact: "Hecho",
    opinion: "Opinión",
    copySummary: "Copiar resumen",
    downloadSummaryTxt: "Descargar resumen (TXT)",
    noSummaryGenerated: "Sin resumen generado.",
    summaryLengthChars: "Longitud: {n} caracteres",
    reangledContent: "Contenido ReAngled",
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
    originalFacts: "Hechos originales",
    selectFactsHint: "Selecciona hechos para usar en ReAngle",
    originalOpinions: "Opiniones originales",
    selectOpinionsHint: "Selecciona opiniones para usar en ReAngle",
    analysisLabel: "Análisis:",
    descriptionLabel: "Descripción:",
    noFactsYet: "Aún no hay hechos extraídos.",
    noOpinionsYet: "Aún no hay opiniones detectadas.",
    factSupported: "Respaldado",
    factMostlySupported: "Mayormente respaldado",
    factPartiallySupported: "Parcialmente respaldado",
    factContradicted: "Contradicho",
    factUnverifiable: "No verificable",
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
    title: "Precios simples",
    subtitle:
      "Empieza gratis y actualiza cuando necesites más.",
    freeTitle: "Gratis",
    freeTagline: "Para probar la plataforma",
    freeFeature1: "5 usos al mes",
    freeFeature2: "Todos los modelos de IA",
    freeFeature3: "Todos los formatos de entrada",
    freeFeature4: "Resumen y comparación",
    freeCtaGoToApp: "Ir a la app",
    freeCtaGetStarted: "Comenzar",

    proTitle: "Pro",
    proBadge: "Popular",
    proTagline: "Para usuarios frecuentes",
    proFeature1: "Usos ilimitados",
    proFeature2: "Todos los modelos de IA",
    proFeature3: "Todos los formatos",
    proFeature4: "Resumen y comparación",
    proFeature5: "Soporte prioritario",
    proFeature6: "TTS y avatar digital",
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
    rewritesUsed: "ReAngle usados",
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
    deangleModel: "Modelo de DeAngle",
    reangleModel: "Modelo de ReAngle",
    deangleDetachPrompt: "System Prompt de separación DeAngle",
    deangleFactCheckPrompt: "System Prompt de verificación DeAngle",
    reanglePrompt: "System Prompt de ReAngle",
    usingDefault: "Usando valor por defecto",
    customized: "Personalizado",
    save: "Guardar",
    saving: "Guardando...",
    reset: "Restablecer por defecto",
    loadError: "No se pudo cargar la configuración.",
    saveError: "No se pudo guardar la configuración.",
    saveSuccess: "Configuración guardada.",
    sectionDeangle: "DeAngle",
    sectionReangle: "ReAngle",
    sectionAvatar: "Avatar",
    modelLabel: "Modelo",
    promptLabel: "Prompt",
    collapse: "Contraer",
    expand: "Expandir",
    collapseDeangle: "Contraer sección DeAngle",
    expandDeangle: "Expandir sección DeAngle",
    collapseReangle: "Contraer sección ReAngle",
    expandReangle: "Expandir sección ReAngle",
    collapseAvatar: "Contraer sección Avatar",
    expandAvatar: "Expandir sección Avatar",
    avatarComingSoon: "La configuración de avatar estará disponible pronto.",
  },
}
