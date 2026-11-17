import { useState, useCallback } from 'react'

/**
 * Custom Hook for Modal Notifications (Replaces window.alert)
 */
export const useModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'info', // 'info' | 'success' | 'error' | 'warning' | 'song'
    title: '',
    message: '',
    data: null,
    confirmText: 'Tushunarli',
    onConfirm: null,
    showCancel: false,
    cancelText: 'Bekor qilish',
    onCancel: null
  })

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const openModal = useCallback((options) => {
    setModalState({
      isOpen: true,
      type: options.type || 'info',
      title: options.title || "Bildirishnoma",
      message: options.message || '',
      data: options.data || null,
      confirmText: options.confirmText || 'Tushunarli',
      onConfirm: options.onConfirm || null,
      showCancel: Boolean(options.showCancel),
      cancelText: options.cancelText || 'Bekor qilish',
      onCancel: options.onCancel || null
    })
  }, [])

  const showSuccess = useCallback((title, message, options = {}) => {
    openModal({ ...options, type: 'success', title, message })
  }, [openModal])

  const showError = useCallback((title, message, options = {}) => {
    openModal({ ...options, type: 'error', title, message })
  }, [openModal])

  const showInfo = useCallback((title, message, options = {}) => {
    openModal({ ...options, type: 'info', title, message })
  }, [openModal])

  const showWarning = useCallback((title, message, options = {}) => {
    openModal({ ...options, type: 'warning', title, message })
  }, [openModal])

  const showSongDetail = useCallback((song) => {
    openModal({
      type: 'song',
      title: song.title,
      message: `${song.artist} • ${song.genre}`,
      data: song,
      confirmText: 'Yopish'
    })
  }, [openModal])

  return {
    modalState,
    openModal,
    closeModal,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showSongDetail
  }
}

export default useModal
