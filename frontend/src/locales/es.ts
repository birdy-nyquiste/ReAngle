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
  },

  landing: {
    // Hero
    heroTitleLine1: "No consumas narrativas sin filtro.",
    heroTitleLine2: "Haz ReAngle.",
    heroSubheadline:
      "Los hechos son objetivos. Las narrativas se construyen. ReAngle te devuelve el control narrativo: entiende el evento, define tu postura y expresa tu propia voz.",
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
    engineTitle: "Motor en 3 pasos",
    engineIntro:
      "De la filosofía a la ejecución, ReAngle funciona con un flujo claro: Gather, DeAngle y ReAngle.",
    engineFeature1Title: "Gather",
    engineFeature1Desc:
      "Reúne múltiples entradas sobre un mismo tema. El sistema valida coherencia temática antes de continuar.",
    engineFeature2Title: "DeAngle",
    engineFeature2Desc:
      "Primero detach (hechos vs. ángulos), luego fact-check para construir una base factual confiable.",
    engineFeature3Title: "ReAngle",
    engineFeature3Desc:
      "Reconstruye la narrativa final a partir de hechos validados y ángulos seleccionados, con tu estilo.",

    // How To
    howToTitle: "Cómo funciona",
    howToIntro:
      "Un flujo práctico para controlar la narrativa.",
    howToStep1Title: "Gather (validación temática)",
    howToStep1Desc:
      "Añade múltiples entradas del mismo tema. El sistema verifica consistencia temática.",
    howToStep2Title: "DeAngle (Detach + Fact Check)",
    howToStep2Desc:
      "Separa hechos y ángulos, y luego verifica los hechos para reducir ruido y distorsión.",
    howToStep3Title: "ReAngle",
    howToStep3Desc:
      "Genera la narrativa final a partir de hechos verificados y ángulos seleccionados.",

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
      "Precios en USD. Empieza gratis y actualiza cuando necesites escala.",
    freeTitle: "Gratis",
    freeTagline: "Para uso mensual ligero",
    freeFeature1: "5 generaciones ReAngle / mes",
    freeFeature2: "1 generación TTS / mes",
    freeFeature3: "Flujo Gather + DeAngle + ReAngle",
    freeFeature4: "Sin Avatar",
    freeCtaGoToApp: "Ir a la app",
    freeCtaGetStarted: "Comenzar",

    proTitle: "Pro",
    proBadge: "Popular",
    proTagline: "Para creación continua",
    proFeature1: "Generaciones ReAngle ilimitadas",
    proFeature2: "20 generaciones TTS / mes",
    proFeature3: "5 generaciones Avatar / ciclo de facturación",
    proFeature4: "Flujo Gather + DeAngle + ReAngle",
    proFeature5: "Gestión de suscripción en Stripe",
    proFeature6: "Panel de uso en Perfil",
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
  },
}
