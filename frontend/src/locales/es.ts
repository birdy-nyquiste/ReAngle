/**
 * Spanish locale for UI copy.
 * Keys match en.ts: nav.*, landing.*, mainApp.*, common.*, auth.*, pricing.*, profile.*
 */

import type { LocaleEn } from "./en"

export const es: LocaleEn = {
  nav: {
    pricing: "Precios",
    profile: "Perfil",
    openApp: "Abrir aplicación",
    login: "Iniciar sesión",
    getStarted: "Comenzar gratis",
    signOut: "Cerrar sesión",
  },

  lang: {
    en: "English",
    zh: "中文",
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
    rewritesUsed: "Usos realizados",
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
}