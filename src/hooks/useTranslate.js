import { useContext } from 'react'
import { TranslateContext } from '../context/TranslateContext'

/**
 * useTranslate Hook
 * 
 * Ilovadagi matnlarni ko'p tillilikka o'tkazish uchun mo'ljallangan custom hook.
 * Standart asosiy til: O'zbek tili ('uz').
 * Qo'shimcha til: Ingliz tili ('en').
 * 
 * Qaytaradigan qiymatlari:
 * - language: Hozirgi tanlangan til kodi ('uz' | 'en')
 * - isUzbek: Hozirgi til o'zbekcha ekanligi (boolean)
 * - isEnglish: Hozirgi til inglizcha ekanligi (boolean)
 * - setLanguage(code): Tilni o'zgartirish
 * - toggleLanguage(): O'zbek va Ingliz tillari o'rtasida almashtirish
 * - t(key, params): Kalit bo'yicha tarjima matnini qaytarish
 * - languages: Mavjud tillar ro'yxati (kod, nom, bayroq)
 */
export const useTranslate = () => {
  const context = useContext(TranslateContext)
  
  if (!context) {
    throw new Error('useTranslate hooki TranslateProvider ichida ishlatilishi shart!')
  }

  return context
}

export default useTranslate
