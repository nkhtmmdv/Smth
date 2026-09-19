export type Language = "en" | "az" | "ru";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "az", label: "AZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" }
];

export interface Translations {
  brand: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  secondaryMessage: string;
  finalSlogan: string;
  uploadCta: string;
  tryDemoCta: string;
  dragDropTitle: string;
  dragDropOr: string;
  chooseImage: string;
  formatsNote: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  demoPickerTitle: string;
  demoPickerSubtitle: string;
  analysisTitle: string;
  stageReading: string;
  stageStructure: string;
  stageFields: string;
  stageTypes: string;
  stageBuilding: string;
  formReadyTitle: string;
  originalLabel: string;
  digitalLabel: string;
  fieldsDetected: (n: number) => string;
  languageDetected: string;
  submit: string;
  submitting: string;
  submissionSaved: string;
  requiredMessage: string;
  uploadAnother: string;
  viewSubmissions: string;
  navForm: string;
  navSubmissions: string;
  navMyForms: string;
  backToUpload: string;
  backToForm: string;
  submissionsTitle: string;
  submissionsEmpty: string;
  submissionNumber: (n: number) => string;
  yes: string;
  no: string;
  selectPlaceholder: string;
  errorUnsupportedFileType: string;
  errorFileTooLarge: string;
  errorAiUnavailable: string;
  errorInvalidAiResponse: string;
  errorNoFormTitle: string;
  errorNoFormSubtitle: string;
  tryAgain: string;
  aiNotConfiguredBanner: string;
  productStatement: string;
  close: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brand: "Snap2Form AI",
    heroTitle: "Turn paper into software.",
    heroSubtitle:
      "Upload a photo of any paper form and Snap2Form AI turns it into a working digital form in seconds.",
    heroTagline: "One photo. One AI analysis. One working digital form.",
    secondaryMessage: "We don't just scan documents. We understand the workflow behind them.",
    finalSlogan: "From paper to working software in seconds.",
    uploadCta: "Upload Document",
    tryDemoCta: "Try Demo",
    dragDropTitle: "Drag & drop a paper form here",
    dragDropOr: "or",
    chooseImage: "Choose Image",
    formatsNote: "JPG, PNG or WEBP · up to 10 MB",
    step1Title: "Upload",
    step1Desc: "Snap a photo of any paper form or checklist.",
    step2Title: "AI understands",
    step2Desc: "Our AI reads the structure, not just the text.",
    step3Title: "Use your digital form",
    step3Desc: "Fill it, submit it, and see it saved instantly.",
    demoPickerTitle: "Choose a demo document",
    demoPickerSubtitle: "No upload needed — see the full flow with a bundled example.",
    analysisTitle: "Understanding your document…",
    stageReading: "Reading document...",
    stageStructure: "Understanding structure...",
    stageFields: "Detecting fields...",
    stageTypes: "Identifying input types...",
    stageBuilding: "Building digital form...",
    formReadyTitle: "Your form is ready ✨",
    originalLabel: "Original",
    digitalLabel: "Digital Version",
    fieldsDetected: (n: number) => `${n} field${n === 1 ? "" : "s"} detected`,
    languageDetected: "Language",
    submit: "Submit",
    submitting: "Submitting…",
    submissionSaved: "Submission saved ✓",
    requiredMessage: "This field is required.",
    uploadAnother: "Upload another document",
    viewSubmissions: "View submissions",
    navForm: "Form",
    navSubmissions: "Submissions",
    navMyForms: "My Forms",
    backToUpload: "Back to upload",
    backToForm: "Back to form",
    submissionsTitle: "Submissions",
    submissionsEmpty: "No submissions yet. Fill out the form to see it here.",
    submissionNumber: (n: number) => `Submission #${String(n).padStart(3, "0")}`,
    yes: "Yes",
    no: "No",
    selectPlaceholder: "Select an option",
    errorUnsupportedFileType: "Please upload JPG, PNG or WEBP.",
    errorFileTooLarge: "The image is too large. Please upload a file smaller than 10 MB.",
    errorAiUnavailable: "AI analysis is temporarily unavailable. Try again or use Demo Mode.",
    errorInvalidAiResponse: "We couldn't understand this document reliably. Please try a clearer image.",
    errorNoFormTitle: "No clear form structure detected.",
    errorNoFormSubtitle: "Try a document containing labels, blank fields, checkboxes, questions or selectable options.",
    tryAgain: "Try again",
    aiNotConfiguredBanner: "Live AI analysis isn't configured yet — try the bundled demos below.",
    productStatement: "We don't just digitize documents. We digitize the workflow behind them.",
    close: "Close"
  },
  ru: {
    brand: "Snap2Form AI",
    heroTitle: "Превратите бумагу в программу.",
    heroSubtitle:
      "Загрузите фото любой бумажной формы, и Snap2Form AI превратит её в рабочую цифровую форму за секунды.",
    heroTagline: "Одно фото. Один анализ ИИ. Одна рабочая цифровая форма.",
    secondaryMessage: "Мы не просто сканируем документы. Мы понимаем рабочий процесс за ними.",
    finalSlogan: "От бумаги к рабочему софту за секунды.",
    uploadCta: "Загрузить документ",
    tryDemoCta: "Попробовать демо",
    dragDropTitle: "Перетащите бумажную форму сюда",
    dragDropOr: "или",
    chooseImage: "Выбрать изображение",
    formatsNote: "JPG, PNG или WEBP · до 10 МБ",
    step1Title: "Загрузите",
    step1Desc: "Сфотографируйте любую бумажную форму или чек-лист.",
    step2Title: "ИИ понимает",
    step2Desc: "Наш ИИ считывает структуру, а не только текст.",
    step3Title: "Используйте форму",
    step3Desc: "Заполните, отправьте и мгновенно увидите результат.",
    demoPickerTitle: "Выберите демо-документ",
    demoPickerSubtitle: "Загрузка не нужна — посмотрите весь процесс на готовом примере.",
    analysisTitle: "Анализируем ваш документ…",
    stageReading: "Чтение документа...",
    stageStructure: "Анализ структуры...",
    stageFields: "Поиск полей...",
    stageTypes: "Определение типов ввода...",
    stageBuilding: "Создание цифровой формы...",
    formReadyTitle: "Форма готова ✨",
    originalLabel: "Оригинал",
    digitalLabel: "Цифровая версия",
    fieldsDetected: (n: number) => `Найдено полей: ${n}`,
    languageDetected: "Язык",
    submit: "Отправить",
    submitting: "Отправка…",
    submissionSaved: "Форма сохранена ✓",
    requiredMessage: "Это поле обязательно.",
    uploadAnother: "Загрузить другой документ",
    viewSubmissions: "Смотреть отправленные формы",
    navForm: "Форма",
    navSubmissions: "Отправленные формы",
    navMyForms: "Мои формы",
    backToUpload: "Назад к загрузке",
    backToForm: "Назад к форме",
    submissionsTitle: "Отправленные формы",
    submissionsEmpty: "Пока нет отправленных форм. Заполните форму, чтобы увидеть её здесь.",
    submissionNumber: (n: number) => `Заявка №${String(n).padStart(3, "0")}`,
    yes: "Да",
    no: "Нет",
    selectPlaceholder: "Выберите вариант",
    errorUnsupportedFileType: "Загрузите файл JPG, PNG или WEBP.",
    errorFileTooLarge: "Файл слишком большой. Загрузите изображение до 10 МБ.",
    errorAiUnavailable: "ИИ-анализ временно недоступен. Попробуйте снова или используйте демо-режим.",
    errorInvalidAiResponse: "Не удалось надёжно распознать документ. Попробуйте более чёткое изображение.",
    errorNoFormTitle: "Чёткая структура формы не обнаружена.",
    errorNoFormSubtitle: "Попробуйте документ с подписями, пустыми полями, чекбоксами или вопросами.",
    tryAgain: "Попробовать снова",
    aiNotConfiguredBanner: "Живой ИИ-анализ ещё не настроен — попробуйте демо ниже.",
    productStatement: "Мы не просто оцифровываем документы. Мы оцифровываем рабочий процесс за ними.",
    close: "Закрыть"
  },
  az: {
    brand: "Snap2Form AI",
    heroTitle: "Kağızı proqrama çevirin.",
    heroSubtitle:
      "İstənilən kağız formanın şəklini yükləyin, Snap2Form AI onu bir neçə saniyəyə işlək rəqəmsal formaya çevirsin.",
    heroTagline: "Bir şəkil. Bir AI analizi. Bir işlək rəqəmsal forma.",
    secondaryMessage: "Biz sadəcə sənədi skan etmirik. Onun arxasındakı iş prosesini anlayırıq.",
    finalSlogan: "Kağızdan işlək proqrama bir neçə saniyəyə.",
    uploadCta: "Sənədi yüklə",
    tryDemoCta: "Demo sınayın",
    dragDropTitle: "Kağız formanı buraya sürükləyin",
    dragDropOr: "və ya",
    chooseImage: "Şəkil seçin",
    formatsNote: "JPG, PNG və ya WEBP · maksimum 10 MB",
    step1Title: "Yükləyin",
    step1Desc: "İstənilən kağız formanın və ya checklist-in şəklini çəkin.",
    step2Title: "AI anlayır",
    step2Desc: "AI-mız yalnız mətni deyil, strukturu oxuyur.",
    step3Title: "Formanızdan istifadə edin",
    step3Desc: "Doldurun, göndərin və nəticəni dərhal görün.",
    demoPickerTitle: "Demo sənəd seçin",
    demoPickerSubtitle: "Yükləməyə ehtiyac yoxdur — hazır nümunə ilə bütün prosesi görün.",
    analysisTitle: "Sənədiniz analiz edilir…",
    stageReading: "Sənəd oxunur...",
    stageStructure: "Struktur anlaşılır...",
    stageFields: "Sahələr müəyyən edilir...",
    stageTypes: "Giriş tipləri müəyyən edilir...",
    stageBuilding: "Rəqəmsal forma qurulur...",
    formReadyTitle: "Formanız hazırdır ✨",
    originalLabel: "Orijinal",
    digitalLabel: "Rəqəmsal versiya",
    fieldsDetected: (n: number) => `${n} sahə tapıldı`,
    languageDetected: "Dil",
    submit: "Təsdiqlə",
    submitting: "Göndərilir…",
    submissionSaved: "Göndərmə saxlanıldı ✓",
    requiredMessage: "Bu sahə mütləqdir.",
    uploadAnother: "Başqa sənəd yüklə",
    viewSubmissions: "Göndərilənlərə bax",
    navForm: "Forma",
    navSubmissions: "Göndərilənlər",
    navMyForms: "Formalarım",
    backToUpload: "Yükləməyə qayıt",
    backToForm: "Formaya qayıt",
    submissionsTitle: "Göndərilənlər",
    submissionsEmpty: "Hələ heç bir göndərmə yoxdur. Formanı doldurub burada görün.",
    submissionNumber: (n: number) => `Göndərmə #${String(n).padStart(3, "0")}`,
    yes: "Bəli",
    no: "Xeyr",
    selectPlaceholder: "Seçim edin",
    errorUnsupportedFileType: "Zəhmət olmasa JPG, PNG və ya WEBP yükləyin.",
    errorFileTooLarge: "Şəkil çox böyükdür. 10 MB-dan kiçik fayl yükləyin.",
    errorAiUnavailable: "AI analizi müvəqqəti əlçatan deyil. Yenidən cəhd edin və ya Demo rejimindən istifadə edin.",
    errorInvalidAiResponse: "Bu sənədi etibarlı şəkildə anlaya bilmədik. Daha aydın şəkil sınayın.",
    errorNoFormTitle: "Aydın forma strukturu aşkarlanmadı.",
    errorNoFormSubtitle: "Etiketlər, boş sahələr, checkbox-lar və ya seçim variantları olan sənəd sınayın.",
    tryAgain: "Yenidən cəhd edin",
    aiNotConfiguredBanner: "Canlı AI analizi hələ konfiqurasiya edilməyib — aşağıdakı demolara baxın.",
    productStatement: "Biz sadəcə sənədləri rəqəmsallaşdırmırıq. Onların arxasındakı iş prosesini rəqəmsallaşdırırıq.",
    close: "Bağla"
  }
};

export type TranslationKey = keyof Translations;
