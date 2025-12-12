import { useState, useEffect } from 'react'

export function useSidebarWidth() {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('otexam-sidebar-collapsed')
    return saved === 'true'
  })

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('otexam-sidebar-collapsed')
      setCollapsed(saved === 'true')
    }

    window.addEventListener('storage', handleStorage)

    // Also listen for changes within the same tab
    const interval = setInterval(() => {
      const saved = localStorage.getItem('otexam-sidebar-collapsed')
      if ((saved === 'true') !== collapsed) {
        setCollapsed(saved === 'true')
      }
    }, 100)

    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [collapsed])

  return collapsed ? 'lg:ml-16' : 'lg:ml-64'
}
