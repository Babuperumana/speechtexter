/**
 * Multilingual Database for SpeechTexter
 * Over 120+ languages and locales supported by Web Speech API
 */

export const LANGUAGES = [
  {
    name: "English",
    code: "en",
    flag: "🌐",
    locales: [
      { code: "en-US", name: "English (United States)", country: "United States", flag: "🇺🇸" },
      { code: "en-GB", name: "English (United Kingdom)", country: "United Kingdom", flag: "🇬🇧" },
      { code: "en-IN", name: "English (India)", country: "India", flag: "🇮🇳" },
      { code: "en-AU", name: "English (Australia)", country: "Australia", flag: "🇦🇺" },
      { code: "en-CA", name: "English (Canada)", country: "Canada", flag: "🇨🇦" },
      { code: "en-NZ", name: "English (New Zealand)", country: "New Zealand", flag: "🇳🇿" },
      { code: "en-ZA", name: "English (South Africa)", country: "South Africa", flag: "🇿🇦" },
      { code: "en-IE", name: "English (Ireland)", country: "Ireland", flag: "🇮🇪" },
      { code: "en-SG", name: "English (Singapore)", country: "Singapore", flag: "🇸🇬" },
      { code: "en-PH", name: "English (Philippines)", country: "Philippines", flag: "🇵🇭" },
      { code: "en-NG", name: "English (Nigeria)", country: "Nigeria", flag: "🇳🇬" },
      { code: "en-GH", name: "English (Ghana)", country: "Ghana", flag: "🇬🇭" },
      { code: "en-KE", name: "English (Kenya)", country: "Kenya", flag: "🇰🇪" },
      { code: "en-TZ", name: "English (Tanzania)", country: "Tanzania", flag: "🇹🇿" },
      { code: "en-PK", name: "English (Pakistan)", country: "Pakistan", flag: "🇵🇰" }
    ]
  },
  {
    name: "Español",
    native: "Español",
    code: "es",
    flag: "🇪🇸",
    locales: [
      { code: "es-ES", name: "Español (España)", country: "Spain", flag: "🇪🇸" },
      { code: "es-MX", name: "Español (México)", country: "Mexico", flag: "🇲🇽" },
      { code: "es-US", name: "Español (Estados Unidos)", country: "United States", flag: "🇺🇸" },
      { code: "es-AR", name: "Español (Argentina)", country: "Argentina", flag: "🇦🇷" },
      { code: "es-CO", name: "Español (Colombia)", country: "Colombia", flag: "🇨🇴" },
      { code: "es-CL", name: "Español (Chile)", country: "Chile", flag: "🇨🇱" },
      { code: "es-PE", name: "Español (Perú)", country: "Peru", flag: "🇵🇪" },
      { code: "es-VE", name: "Español (Venezuela)", country: "Venezuela", flag: "🇻🇪" },
      { code: "es-EC", name: "Español (Ecuador)", country: "Ecuador", flag: "🇪🇨" },
      { code: "es-GT", name: "Español (Guatemala)", country: "Guatemala", flag: "🇬🇹" },
      { code: "es-CU", name: "Español (Cuba)", country: "Cuba", flag: "🇨🇺" },
      { code: "es-BO", name: "Español (Bolivia)", country: "Bolivia", flag: "🇧🇴" },
      { code: "es-DO", name: "Español (República Dominicana)", country: "Dominican Republic", flag: "🇩🇴" },
      { code: "es-HN", name: "Español (Honduras)", country: "Honduras", flag: "🇭🇳" },
      { code: "es-PY", name: "Español (Paraguay)", country: "Paraguay", flag: "🇵🇾" },
      { code: "es-SV", name: "Español (El Salvador)", country: "El Salvador", flag: "🇸🇻" },
      { code: "es-NI", name: "Español (Nicaragua)", country: "Nicaragua", flag: "🇳🇮" },
      { code: "es-CR", name: "Español (Costa Rica)", country: "Costa Rica", flag: "🇨🇷" },
      { code: "es-PA", name: "Español (Panamá)", country: "Panama", flag: "🇵🇦" },
      { code: "es-UY", name: "Español (Uruguay)", country: "Uruguay", flag: "🇺🇾" },
      { code: "es-PR", name: "Español (Puerto Rico)", country: "Puerto Rico", flag: "🇵🇷" }
    ]
  },
  {
    name: "Français",
    native: "Français",
    code: "fr",
    flag: "🇫🇷",
    locales: [
      { code: "fr-FR", name: "Français (France)", country: "France", flag: "🇫🇷" },
      { code: "fr-CA", name: "Français (Canada)", country: "Canada", flag: "🇨🇦" },
      { code: "fr-BE", name: "Français (Belgique)", country: "Belgium", flag: "🇧🇪" },
      { code: "fr-CH", name: "Français (Suisse)", country: "Switzerland", flag: "🇨🇭" }
    ]
  },
  {
    name: "Deutsch",
    native: "Deutsch",
    code: "de",
    flag: "🇩🇪",
    locales: [
      { code: "de-DE", name: "Deutsch (Deutschland)", country: "Germany", flag: "🇩🇪" },
      { code: "de-AT", name: "Deutsch (Österreich)", country: "Austria", flag: "🇦🇹" },
      { code: "de-CH", name: "Deutsch (Schweiz)", country: "Switzerland", flag: "🇨🇭" }
    ]
  },
  {
    name: "Italiano",
    native: "Italiano",
    code: "it",
    flag: "🇮🇹",
    locales: [
      { code: "it-IT", name: "Italiano (Italia)", country: "Italy", flag: "🇮🇹" },
      { code: "it-CH", name: "Italiano (Svizzera)", country: "Switzerland", flag: "🇨🇭" }
    ]
  },
  {
    name: "Português",
    native: "Português",
    code: "pt",
    flag: "🇵🇹",
    locales: [
      { code: "pt-BR", name: "Português (Brasil)", country: "Brazil", flag: "🇧🇷" },
      { code: "pt-PT", name: "Português (Portugal)", country: "Portugal", flag: "🇵🇹" }
    ]
  },
  {
    name: "العربية",
    native: "العربية",
    code: "ar",
    dir: "rtl",
    flag: "🇸🇦",
    locales: [
      { code: "ar-SA", name: "العربية (المملكة العربية السعودية)", country: "Saudi Arabia", flag: "🇸🇦", dir: "rtl" },
      { code: "ar-AE", name: "العربية (الإمارات)", country: "UAE", flag: "🇦🇪", dir: "rtl" },
      { code: "ar-EG", name: "العربية (مصر)", country: "Egypt", flag: "🇪🇬", dir: "rtl" },
      { code: "ar-DZ", name: "العربية (الجزائر)", country: "Algeria", flag: "🇩🇿", dir: "rtl" },
      { code: "ar-BH", name: "العربية (البحرين)", country: "Bahrain", flag: "🇧🇭", dir: "rtl" },
      { code: "ar-IQ", name: "العربية (العراق)", country: "Iraq", flag: "🇮🇶", dir: "rtl" },
      { code: "ar-IL", name: "العربية (إسرائيل)", country: "Israel", flag: "🇮🇱", dir: "rtl" },
      { code: "ar-JO", name: "العربية (الأردن)", country: "Jordan", flag: "🇯🇴", dir: "rtl" },
      { code: "ar-KW", name: "العربية (الكويت)", country: "Kuwait", flag: "🇰🇼", dir: "rtl" },
      { code: "ar-LB", name: "العربية (لبنان)", country: "Lebanon", flag: "🇱🇧", dir: "rtl" },
      { code: "ar-MA", name: "العربية (المغرب)", country: "Morocco", flag: "🇲🇦", dir: "rtl" },
      { code: "ar-OM", name: "العربية (عمان)", country: "Oman", flag: "🇴🇲", dir: "rtl" },
      { code: "ar-PS", name: "العربية (فلسطين)", country: "Palestine", flag: "🇵🇸", dir: "rtl" },
      { code: "ar-QA", name: "العربية (قطر)", country: "Qatar", flag: "🇶🇦", dir: "rtl" },
      { code: "ar-TN", name: "العربية (تونس)", country: "Tunisia", flag: "🇹🇳", dir: "rtl" },
      { code: "ar-YE", name: "العربية (اليمن)", country: "Yemen", flag: "🇾🇪", dir: "rtl" }
    ]
  },
  {
    name: "മലയാളം (Malayalam)",
    native: "മലയാളം",
    code: "ml",
    flag: "🇮🇳",
    locales: [
      { code: "ml-IN", name: "മലയാളം (ഇന്ത്യ)", country: "India", flag: "🇮🇳" }
    ]
  },
  {
    name: "हिन्दी (Hindi)",
    native: "हिन्दी",
    code: "hi",
    flag: "🇮🇳",
    locales: [
      { code: "hi-IN", name: "हिन्दी (भारत)", country: "India", flag: "🇮🇳" }
    ]
  },
  {
    name: "தமிழ் (Tamil)",
    native: "தமிழ்",
    code: "ta",
    flag: "🇮🇳",
    locales: [
      { code: "ta-IN", name: "தமிழ் (இந்தியா)", country: "India", flag: "🇮🇳" },
      { code: "ta-LK", name: "தமிழ் (இலங்கை)", country: "Sri Lanka", flag: "🇱🇰" },
      { code: "ta-SG", name: "தமிழ் (சிங்கப்பூர்)", country: "Singapore", flag: "🇸🇬" },
      { code: "ta-MY", name: "தமிழ் (மலேசியா)", country: "Malaysia", flag: "🇲🇾" }
    ]
  },
  {
    name: "తెలుగు (Telugu)",
    native: "తెలుగు",
    code: "te",
    flag: "🇮🇳",
    locales: [
      { code: "te-IN", name: "తెలుగు (భారతదేశం)", country: "India", flag: "🇮🇳" }
    ]
  },
  {
    name: "ಕನ್ನಡ (Kannada)",
    native: "ಕನ್ನಡ",
    code: "kn",
    flag: "🇮🇳",
    locales: [
      { code: "kn-IN", name: "ಕನ್ನಡ (ಭಾರತ)", country: "India", flag: "🇮🇳" }
    ]
  },
  {
    name: "मराठी (Marathi)",
    native: "मराठी",
    code: "mr",
    flag: "🇮🇳",
    locales: [
      { code: "mr-IN", name: "मराठी (भारत)", country: "India", flag: "🇮🇳" }
    ]
  },
  {
    name: "ગુજરાતી (Gujarati)",
    native: "ગુજરાતી",
    code: "gu",
    flag: "🇮🇳",
    locales: [
      { code: "gu-IN", name: "ગુજરાતી (ભારત)", country: "India", flag: "🇮🇳" }
    ]
  },
  {
    name: "বাংলা (Bengali)",
    native: "বাংলা",
    code: "bn",
    flag: "🇧🇩",
    locales: [
      { code: "bn-BD", name: "বাংলা (বাংলাদেশ)", country: "Bangladesh", flag: "🇧🇩" },
      { code: "bn-IN", name: "বাংলা (ভারত)", country: "India", flag: "🇮🇳" }
    ]
  },
  {
    name: "ਪੰਜਾਬੀ (Punjabi)",
    native: "ਪੰਜਾਬੀ",
    code: "pa",
    flag: "🇮🇳",
    locales: [
      { code: "pa-Guru-IN", name: "ਪੰਜਾਬੀ (ਭਾਰਤ)", country: "India", flag: "🇮🇳" }
    ]
  },
  {
    name: "اردو (Urdu)",
    native: "اردو",
    code: "ur",
    dir: "rtl",
    flag: "🇵🇰",
    locales: [
      { code: "ur-PK", name: "اردو (پاکستان)", country: "Pakistan", flag: "🇵🇰", dir: "rtl" },
      { code: "ur-IN", name: "اردو (بھارت)", country: "India", flag: "🇮🇳", dir: "rtl" }
    ]
  },
  {
    name: "中文 (Chinese)",
    native: "中文",
    code: "zh",
    flag: "🇨🇳",
    locales: [
      { code: "cmn-Hans-CN", name: "普通话 (中国大陆 - 简体)", country: "Mainland China", flag: "🇨🇳" },
      { code: "cmn-Hant-TW", name: "國語 (台灣 - 繁體)", country: "Taiwan", flag: "🇹🇼" },
      { code: "yue-Hant-HK", name: "粵語 (香港 - 繁體)", country: "Hong Kong", flag: "🇭🇰" }
    ]
  },
  {
    name: "日本語 (Japanese)",
    native: "日本語",
    code: "ja",
    flag: "🇯🇵",
    locales: [
      { code: "ja-JP", name: "日本語 (日本)", country: "Japan", flag: "🇯🇵" }
    ]
  },
  {
    name: "한국어 (Korean)",
    native: "한국어",
    code: "ko",
    flag: "🇰🇷",
    locales: [
      { code: "ko-KR", name: "한국어 (대한민국)", country: "South Korea", flag: "🇰🇷" }
    ]
  },
  {
    name: "Русский (Russian)",
    native: "Русский",
    code: "ru",
    flag: "🇷🇺",
    locales: [
      { code: "ru-RU", name: "Русский (Россия)", country: "Russia", flag: "🇷🇺" }
    ]
  },
  {
    name: "Türkçe (Turkish)",
    native: "Türkçe",
    code: "tr",
    flag: "🇹🇷",
    locales: [
      { code: "tr-TR", name: "Türkçe (Türkiye)", country: "Turkey", flag: "🇹🇷" }
    ]
  },
  {
    name: "Nederlands (Dutch)",
    native: "Nederlands",
    code: "nl",
    flag: "🇳🇱",
    locales: [
      { code: "nl-NL", name: "Nederlands (Nederland)", country: "Netherlands", flag: "🇳🇱" },
      { code: "nl-BE", name: "Nederlands (België)", country: "Belgium", flag: "🇧🇪" }
    ]
  },
  {
    name: "Polski (Polish)",
    native: "Polski",
    code: "pl",
    flag: "🇵🇱",
    locales: [
      { code: "pl-PL", name: "Polski (Polska)", country: "Poland", flag: "🇵🇱" }
    ]
  },
  {
    name: "Українська (Ukrainian)",
    native: "Українська",
    code: "uk",
    flag: "🇺🇦",
    locales: [
      { code: "uk-UA", name: "Українська (Україна)", country: "Ukraine", flag: "🇺🇦" }
    ]
  },
  {
    name: "Ελληνικά (Greek)",
    native: "Ελληνικά",
    code: "el",
    flag: "🇬🇷",
    locales: [
      { code: "el-GR", name: "Ελληνικά (Ελλάδα)", country: "Greece", flag: "🇬🇷" }
    ]
  },
  {
    name: "Svenska (Swedish)",
    native: "Svenska",
    code: "sv",
    flag: "🇸🇪",
    locales: [
      { code: "sv-SE", name: "Svenska (Sverige)", country: "Sweden", flag: "🇸🇪" }
    ]
  },
  {
    name: "Norsk (Norwegian)",
    native: "Norsk",
    code: "no",
    flag: "🇳🇴",
    locales: [
      { code: "no-NO", name: "Norsk bokmål (Norge)", country: "Norway", flag: "🇳🇴" }
    ]
  },
  {
    name: "Dansk (Danish)",
    native: "Dansk",
    code: "da",
    flag: "🇩🇰",
    locales: [
      { code: "da-DK", name: "Dansk (Danmark)", country: "Denmark", flag: "🇩🇰" }
    ]
  },
  {
    name: "Suomi (Finnish)",
    native: "Suomi",
    code: "fi",
    flag: "🇫🇮",
    locales: [
      { code: "fi-FI", name: "Suomi (Suomi)", country: "Finland", flag: "🇫🇮" }
    ]
  },
  {
    name: "Čeština (Czech)",
    native: "Čeština",
    code: "cs",
    flag: "🇨🇿",
    locales: [
      { code: "cs-CZ", name: "Čeština (Česká republika)", country: "Czech Republic", flag: "🇨🇿" }
    ]
  },
  {
    name: "Magyar (Hungarian)",
    native: "Magyar",
    code: "hu",
    flag: "🇭🇺",
    locales: [
      { code: "hu-HU", name: "Magyar (Magyarország)", country: "Hungary", flag: "🇭🇺" }
    ]
  },
  {
    name: "Română (Romanian)",
    native: "Română",
    code: "ro",
    flag: "🇷🇴",
    locales: [
      { code: "ro-RO", name: "Română (România)", country: "Romania", flag: "🇷🇴" }
    ]
  },
  {
    name: "Bahasa Indonesia",
    native: "Bahasa Indonesia",
    code: "id",
    flag: "🇮🇩",
    locales: [
      { code: "id-ID", name: "Bahasa Indonesia (Indonesia)", country: "Indonesia", flag: "🇮🇩" }
    ]
  },
  {
    name: "Bahasa Melayu",
    native: "Bahasa Melayu",
    code: "ms",
    flag: "🇲🇾",
    locales: [
      { code: "ms-MY", name: "Bahasa Melayu (Malaysia)", country: "Malaysia", flag: "🇲🇾" }
    ]
  },
  {
    name: "Tiếng Việt (Vietnamese)",
    native: "Tiếng Việt",
    code: "vi",
    flag: "🇻🇳",
    locales: [
      { code: "vi-VN", name: "Tiếng Việt (Việt Nam)", country: "Vietnam", flag: "🇻🇳" }
    ]
  },
  {
    name: "ไทย (Thai)",
    native: "ไทย",
    code: "th",
    flag: "🇹🇭",
    locales: [
      { code: "th-TH", name: "ไทย (ประเทศไทย)", country: "Thailand", flag: "🇹🇭" }
    ]
  },
  {
    name: "Filipino (Tagalog)",
    native: "Filipino",
    code: "fil",
    flag: "🇵🇭",
    locales: [
      { code: "fil-PH", name: "Filipino (Pilipinas)", country: "Philippines", flag: "🇵🇭" }
    ]
  },
  {
    name: "עברית (Hebrew)",
    native: "עברית",
    code: "he",
    dir: "rtl",
    flag: "🇮🇱",
    locales: [
      { code: "he-IL", name: "עברית (ישראל)", country: "Israel", flag: "🇮🇱", dir: "rtl" }
    ]
  },
  {
    name: "فارسی (Persian)",
    native: "فارسی",
    code: "fa",
    dir: "rtl",
    flag: "🇮🇷",
    locales: [
      { code: "fa-IR", name: "فارسی (ایران)", country: "Iran", flag: "🇮🇷", dir: "rtl" }
    ]
  },
  {
    name: "Kiswahili (Swahili)",
    native: "Kiswahili",
    code: "sw",
    flag: "🇹🇿",
    locales: [
      { code: "sw-TZ", name: "Kiswahili (Tanzania)", country: "Tanzania", flag: "🇹🇿" },
      { code: "sw-KE", name: "Kiswahili (Kenya)", country: "Kenya", flag: "🇰🇪" }
    ]
  },
  {
    name: "Afrikaans",
    native: "Afrikaans",
    code: "af",
    flag: "🇿🇦",
    locales: [
      { code: "af-ZA", name: "Afrikaans (Suid-Afrika)", country: "South Africa", flag: "🇿🇦" }
    ]
  },
  {
    name: "Hrvatski (Croatian)",
    native: "Hrvatski",
    code: "hr",
    flag: "🇭🇷",
    locales: [
      { code: "hr-HR", name: "Hrvatski (Hrvatska)", country: "Croatia", flag: "🇭🇷" }
    ]
  },
  {
    name: "Srpski (Serbian)",
    native: "Srpski",
    code: "sr",
    flag: "🇷🇸",
    locales: [
      { code: "sr-RS", name: "Srpski (Srbija)", country: "Serbia", flag: "🇷🇸" }
    ]
  },
  {
    name: "Slovenčina (Slovak)",
    native: "Slovenčina",
    code: "sk",
    flag: "🇸🇰",
    locales: [
      { code: "sk-SK", name: "Slovenčina (Slovensko)", country: "Slovakia", flag: "🇸🇰" }
    ]
  },
  {
    name: "Slovenščina (Slovenian)",
    native: "Slovenščina",
    code: "sl",
    flag: "🇸🇮",
    locales: [
      { code: "sl-SI", name: "Slovenščina (Slovenija)", country: "Slovenia", flag: "🇸🇮" }
    ]
  },
  {
    name: "Български (Bulgarian)",
    native: "Български",
    code: "bg",
    flag: "🇧🇬",
    locales: [
      { code: "bg-BG", name: "Български (България)", country: "Bulgaria", flag: "🇧🇬" }
    ]
  },
  {
    name: "Català (Catalan)",
    native: "Català",
    code: "ca",
    flag: "🇦🇩",
    locales: [
      { code: "ca-ES", name: "Català (Espanya)", country: "Spain", flag: "🇪🇸" }
    ]
  },
  {
    name: "Euskara (Basque)",
    native: "Euskara",
    code: "eu",
    flag: "🇪🇸",
    locales: [
      { code: "eu-ES", name: "Euskara (Espainia)", country: "Spain", flag: "🇪🇸" }
    ]
  },
  {
    name: "Galego (Galician)",
    native: "Galego",
    code: "gl",
    flag: "🇪🇸",
    locales: [
      { code: "gl-ES", name: "Galego (España)", country: "Spain", flag: "🇪🇸" }
    ]
  },
  {
    name: "Íslenska (Icelandic)",
    native: "Íslenska",
    code: "is",
    flag: "🇮🇸",
    locales: [
      { code: "is-IS", name: "Íslenska (Ísland)", country: "Iceland", flag: "🇮🇸" }
    ]
  },
  {
    name: "Lietuvių (Lithuanian)",
    native: "Lietuvių",
    code: "lt",
    flag: "🇱🇹",
    locales: [
      { code: "lt-LT", name: "Lietuvių (Lietuva)", country: "Lithuania", flag: "🇱🇹" }
    ]
  },
  {
    name: "Latviešu (Latvian)",
    native: "Latviešu",
    code: "lv",
    flag: "🇱🇻",
    locales: [
      { code: "lv-LV", name: "Latviešu (Latvija)", country: "Latvia", flag: "🇱🇻" }
    ]
  },
  {
    name: "Eesti (Estonian)",
    native: "Eesti",
    code: "et",
    flag: "🇪🇪",
    locales: [
      { code: "et-EE", name: "Eesti (Eesti)", country: "Estonia", flag: "🇪🇪" }
    ]
  },
  {
    name: "Shqip (Albanian)",
    native: "Shqip",
    code: "sq",
    flag: "🇦🇱",
    locales: [
      { code: "sq-AL", name: "Shqip (Shqipëri)", country: "Albania", flag: "🇦🇱" }
    ]
  },
  {
    name: "Македонски (Macedonian)",
    native: "Македонски",
    code: "mk",
    flag: "🇲🇰",
    locales: [
      { code: "mk-MK", name: "Македонски (Северна Македонија)", country: "North Macedonia", flag: "🇲🇰" }
    ]
  },
  {
    name: "Bosanski (Bosnian)",
    native: "Bosanski",
    code: "bs",
    flag: "🇧🇦",
    locales: [
      { code: "bs-BA", name: "Bosanski (Bosna i Hercegovina)", country: "Bosnia & Herzegovina", flag: "🇧🇦" }
    ]
  },
  {
    name: "ქართული (Georgian)",
    native: "ქართული",
    code: "ka",
    flag: "🇬🇪",
    locales: [
      { code: "ka-GE", name: "ქართული (საქართველო)", country: "Georgia", flag: "🇬🇪" }
    ]
  },
  {
    name: "Հայերեն (Armenian)",
    native: "Հայերեն",
    code: "hy",
    flag: "🇦🇲",
    locales: [
      { code: "hy-AM", name: "Հայերեն (Հայաստան)", country: "Armenia", flag: "🇦🇲" }
    ]
  },
  {
    name: "Azərbaycan (Azerbaijani)",
    native: "Azərbaycan",
    code: "az",
    flag: "🇦🇿",
    locales: [
      { code: "az-AZ", name: "Azərbaycan (Azərbaycan)", country: "Azerbaijan", flag: "🇦🇿" }
    ]
  },
  {
    name: "Қазақ тілі (Kazakh)",
    native: "Қазақ",
    code: "kk",
    flag: "🇰🇿",
    locales: [
      { code: "kk-KZ", name: "Қазақша (Қазақстан)", country: "Kazakhstan", flag: "🇰🇿" }
    ]
  },
  {
    name: "Oʻzbekcha (Uzbek)",
    native: "Oʻzbek",
    code: "uz",
    flag: "🇺🇿",
    locales: [
      { code: "uz-UZ", name: "Oʻzbekcha (Oʻzbekiston)", country: "Uzbekistan", flag: "🇺🇿" }
    ]
  },
  {
    name: "Монгол (Mongolian)",
    native: "Монгол",
    code: "mn",
    flag: "🇲🇳",
    locales: [
      { code: "mn-MN", name: "Монгол хэл (Монгол Улс)", country: "Mongolia", flag: "🇲🇳" }
    ]
  },
  {
    name: "नेपाली (Nepali)",
    native: "नेपाली",
    code: "ne",
    flag: "🇳🇵",
    locales: [
      { code: "ne-NP", name: "नेपाली (नेपाल)", country: "Nepal", flag: "🇳🇵" }
    ]
  },
  {
    name: "සිංහල (Sinhala)",
    native: "සිංහල",
    code: "si",
    flag: "🇱🇰",
    locales: [
      { code: "si-LK", name: "සිංහල (ශ්‍රී ලංකාව)", country: "Sri Lanka", flag: "🇱🇰" }
    ]
  },
  {
    name: "ភាសាខ្មែរ (Khmer)",
    native: "ភាសាខ្មែរ",
    code: "km",
    flag: "🇰🇭",
    locales: [
      { code: "km-KH", name: "ភាសាខ្មែរ (កម្ពុជា)", country: "Cambodia", flag: "🇰🇭" }
    ]
  },
  {
    name: "ພາສາລາວ (Lao)",
    native: "ລາວ",
    code: "lo",
    flag: "🇱🇦",
    locales: [
      { code: "lo-LA", name: "ພາສາລາວ (ລາວ)", country: "Laos", flag: "🇱🇦" }
    ]
  },
  {
    name: "မြန်မာဘာသာ (Burmese)",
    native: "မြန်မာ",
    code: "my",
    flag: "🇲🇲",
    locales: [
      { code: "my-MM", name: "မြန်မာဘာသာ (မြန်မာ)", country: "Myanmar", flag: "🇲🇲" }
    ]
  },
  {
    name: "አማርኛ (Amharic)",
    native: "አማርኛ",
    code: "am",
    flag: "🇪🇹",
    locales: [
      { code: "am-ET", name: "አማርኛ (ኢትዮጵያ)", country: "Ethiopia", flag: "🇪🇹" }
    ]
  },
  {
    name: "isiZulu (Zulu)",
    native: "isiZulu",
    code: "zu",
    flag: "🇿🇦",
    locales: [
      { code: "zu-ZA", name: "isiZulu (iNingizimu Afrika)", country: "South Africa", flag: "🇿🇦" }
    ]
  },
  {
    name: "isiXhosa (Xhosa)",
    native: "isiXhosa",
    code: "xh",
    flag: "🇿🇦",
    locales: [
      { code: "xh-ZA", name: "isiXhosa (Mzantsi Afrika)", country: "South Africa", flag: "🇿🇦" }
    ]
  }
];

/**
 * Get all flat locale options
 */
export function getAllLocales() {
  const list = [];
  LANGUAGES.forEach(group => {
    group.locales.forEach(loc => {
      list.push({
        ...loc,
        groupName: group.name,
        dir: loc.dir || group.dir || "ltr"
      });
    });
  });
  return list;
}

/**
 * Find locale info by locale code (e.g., 'en-US', 'ml-IN')
 */
export function findLocale(code) {
  const normalized = (code || "").toLowerCase();
  for (const group of LANGUAGES) {
    for (const loc of group.locales) {
      if (loc.code.toLowerCase() === normalized) {
        return {
          ...loc,
          groupName: group.name,
          dir: loc.dir || group.dir || "ltr"
        };
      }
    }
  }
  // Default to English (US)
  return {
    code: "en-US",
    name: "English (United States)",
    country: "United States",
    flag: "🇺🇸",
    groupName: "English",
    dir: "ltr"
  };
}
