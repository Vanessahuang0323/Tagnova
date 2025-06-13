import { Language } from '../types/language.ts';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  zh: {
    companyName: '公司名稱',
    contactPerson: '聯絡人姓名',
    email: '電子郵件',
    industry: '產業類別',
    description: '公司簡介',
    password: '設定密碼 / 第三方登入',
    next: '下一步',
    aiPlatformTitle: 'AI 智慧媒合平台',
    aiPlatformDesc: '結合語意分析、CRM 標籤與模擬面試系統，推薦最合適的職缺與人才',
    student: '我是學生',
    company: '我是企業主',
  },
  en: {
    companyName: 'Company Name',
    contactPerson: 'Contact Person',
    email: 'Email',
    industry: 'Industry',
    description: 'Company Description',
    password: 'Set Password / Third-party Login',
    next: 'Next',
    aiPlatformTitle: 'AI Talent Matching Platform',
    aiPlatformDesc: 'AI-powered semantic analysis and CRM matching to connect talents with the right opportunities.',
    student: 'I’m a Student',
    company: 'I’m a Company',
  }
};

export const t = (lang: Language, key: string): string => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['zh'][key] || key;
};
