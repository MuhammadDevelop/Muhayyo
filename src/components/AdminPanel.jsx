import React, { useState, useMemo } from 'react'
import {
  FaUsers,
  FaCalendarDay,
  FaClock,
  FaFileArrowDown,
  FaPlus,
  FaTrashCan,
  FaMagnifyingGlass,
  FaArrowLeft,
  FaArrowRightFromBracket,
  FaEnvelope,
  FaCheck,
  FaSun,
  FaMoon,
  FaShieldHalved
} from 'react-icons/fa6'
import useTranslate from '../hooks/useTranslate'

export const AdminPanel = ({
  adminUser,
  onLogout,
  onBackToSite,
  theme,
  toggleTheme,
  emails = [],
  onAddEmail,
  onDeleteEmail,
  onExportCsv
}) => {
  const { t, language, setLanguage } = useTranslate()
  const [search, setSearch] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newEmailInput, setNewEmailInput] = useState('')
  const [addError, setAddError] = useState('')

  // Filtrlangan emaillar
  const filteredEmails = useMemo(() => {
    if (!search.trim()) return emails
    const q = search.toLowerCase().trim()
    return emails.filter(item => item.email.toLowerCase().includes(q))
  }, [emails, search])

  // Bugungi emaillar soni
  const todayCount = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('ru-RU') // DD.MM.YYYY
    return emails.filter(item => item.date?.includes(todayStr)).length
  }, [emails])

  // So'nggi kirgan vaqti
  const lastLoginTime = emails.length > 0 ? emails[0].date : '-'

  const handleAddSubmit = (e) => {
    e.preventDefault()
    setAddError('')
    const res = onAddEmail(newEmailInput)
    if (res.success) {
      setNewEmailInput('')
      setIsAddModalOpen(false)
    } else {
      setAddError(t('emailModal.errorInvalid'))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30">
              <FaShieldHalved className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {t('admin.title')}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {adminUser || 'Muhammad'}
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                {t('admin.subtitle')}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'uz' ? 'en' : 'uz')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:scale-105 active:scale-95 transition"
              title={t('navbar.switchLanguage')}
            >
              <span>{language === 'uz' ? '🇺🇿' : '🇬🇧'}</span>
              <span className="uppercase">{language}</span>
            </button>

            {/* Dark / Light toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition"
              title={theme === 'dark' ? t('navbar.switchToLight') : t('navbar.switchToDark')}
            >
              {theme === 'dark' ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Back to site */}
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
              title={t('admin.backToSite')}
            >
              <FaArrowLeft />
              <span className="hidden sm:inline">{t('admin.backToSite')}</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition active:scale-95"
              title={t('admin.logoutBtn')}
            >
              <FaArrowRightFromBracket />
              <span className="hidden sm:inline">{t('admin.logoutBtn')}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Jami foydalanuvchilar */}
          <div className="relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('admin.totalEmails')}
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {emails.length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl">
              <FaUsers />
            </div>
          </div>

          {/* Card 2: Bugungi kirganlar */}
          <div className="relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('admin.todayEmails')}
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {todayCount}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center text-2xl">
              <FaCalendarDay />
            </div>
          </div>

          {/* Card 3: So'nggi tashrif */}
          <div className="relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="space-y-1 min-w-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('admin.lastLogin')}
              </span>
              <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {lastLoginTime}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl flex-shrink-0">
              <FaClock />
            </div>
          </div>
        </div>

        {/* Database Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Table Actions Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('admin.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Action Buttons: Add & Export */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition"
              >
                <FaPlus />
                <span>{t('admin.addEmailBtn')}</span>
              </button>

              <button
                onClick={onExportCsv}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold active:scale-95 transition"
              >
                <FaFileArrowDown className="text-cyan-500" />
                <span>{t('admin.exportCsv')}</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{t('admin.tableNo')}</th>
                  <th className="px-6 py-4">{t('admin.tableEmail')}</th>
                  <th className="px-6 py-4">{t('admin.tableDate')}</th>
                  <th className="px-6 py-4">{t('admin.tableDevice')}</th>
                  <th className="px-6 py-4">{t('admin.tableStatus')}</th>
                  <th className="px-6 py-4 text-right">{t('admin.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredEmails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      {t('admin.emptyList')}
                    </td>
                  </tr>
                ) : (
                  filteredEmails.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <FaEnvelope className="text-xs" />
                        </div>
                        <span>{item.email}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-medium">
                          {item.device || 'Desktop'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <FaCheck className="w-2.5 h-2.5" />
                          <span>{t('admin.statusActive')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(t('admin.deleteConfirm'))) {
                              onDeleteEmail(item.id)
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
                          title={t('common.cancel')}
                        >
                          <FaTrashCan className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* Manual Add Email Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('admin.addModalTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {t('admin.addModalDesc')}
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="foydalanuvchi@gmail.com"
                className="w-full px-4 py-2.5 text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {addError && <p className="text-xs text-rose-500">{addError}</p>}

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
                >
                  {t('admin.addModalSave')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminPanel
