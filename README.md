# 🎵 MusicUz - Professional Audio Streaming UI

Ushbu loyiha **React**, **Tailwind CSS**, **Custom Hooks** va xavfsiz **FastAPI** backend integratsiyasi asosida yaratilgan zamonaviy musiqa striming foydalanuvchi interfeysidir.

---

## ✨ Imkoniyatlar va Xususiyatlar

1. **Xavfsiz Backend (.env)**:
   - Backend URL manzili xavfsiz tarzda `.env` faylida `VITE_API_BASE_URL` o'zgaruvchisiga biriktirilgan.
   - Manzil: `https://music-l8kd.onrender.com`

2. **Custom Hooks Arxitekturasi**:
   - `useTheme`: Tungi va kunduzgi rejimni boshqaradi (`localStorage` ga saqlash bilan).
   - `useModal`: Standart `alert()` o'rniga zamonaviy animatsiyali modal oynalarni boshqaradi.
   - `useMusicApi`: Backend API dan musiqalarni olish, janrlar bo'yicha saralash, qidirish, sevimlilar (like) va eshitishlar sonini yozib borish.
   - `useAudioPlayer`: Audio ijrosi, oldinga/ortga o'tish, pauza/davom etish, ovozni boshqarish, takrorlash (loop), tasodifiy ijro (shuffle) va progress boshqaruvi.

3. **Yorqin va Chiroyli Tugmalar**:
   - **Ortga (Previous)**: Yorqin Cyan/Teal neon effekti.
   - **Oldinga (Next)**: Yorqin Violet/Fuchsia neon effekti.
   - **To'xtatish va Davom etish (Play / Pause)**: Yorqin Neon Emerald/Lime pulsatsiyali katta dinamik tugma.

4. **Tungi va Kunduzgi Rejim (Dark / Light Mode)**:
   - To'liq Tailwind CSS asosida `dark:` klasslari orqali boshqariladi.
   - Bir tugma orqali osongina almashadi.

5. **Modal Bildirishnomalari (Hech qanday alert yo'q)**:
   - Barcha muvaffaqiyat, xatolik, ogohlantirish va musiqa haqidagi to'liq ma'lumotlar chiroyli dizayndagi maxsus Modal oynasida chiqadi.

6. **Klaviatura Tugmalari (Shortcuts)**:
   - `Space`: To'xtatish / Davom etish
   - `ArrowRight`: Keyingi qo'shiq (Oldinga)
   - `ArrowLeft`: Oldingi qo'shiq (Ortga)
   - `M`: Ovozni o'chirish / yoqish (Mute)

---

## 🚀 Ishga tushirish (Getting Started)

Loyihani o'z kompyuteringizda ishga tushirish uchun:

```bash
# Rivojlanish rejimida ishga tushirish:
npm run dev

# Ishlab chiqarish (production) uchun yig'ish:
npm run build

# Yig'ilgan loyihani ko'rish:
npm run preview
```
