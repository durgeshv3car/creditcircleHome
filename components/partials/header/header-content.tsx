'use client';
import React from 'react'
import { useConfig } from '@/hooks/use-config'
import { cn } from '@/lib/utils'

const HeaderContent = ({ children }: { children: React.ReactNode }) => {
  const [config] = useConfig()
  const headerTheme = config.headerTheme !== 'light' && config.headerTheme !== 'transparent' ? ` dark theme-${config.headerTheme}` : `theme-${config.headerTheme}`
  if (config.sidebar === 'two-column') {
    return (
      <header className={cn('top-0 z-50', config.navbar, {
        'has-sticky-header sticky top-6  px-6 ': config.navbar === 'floating'
      })}>
        <div className={cn('flex-none   bg-header backdrop-blur-lg md:px-6 px-[15px] py-3    xl:ms-[300px] flex items-center justify-between  relative', headerTheme, {
          'xl:ms-[72px]': config.subMenu || !config.hasSubMenu,
          'border-b': config.skin === 'bordered' && config.layout !== 'semi-box',
          'xl:ms-0': config.menuHidden || config.layout === "horizontal",
          'border': config.skin === 'bordered' && config.layout === 'semi-box',
          'shadow-base': config.skin === 'default',
          'rounded-sm': config.navbar === 'floating'


        })}>
          {children}
        </div>

      </header>
    )
  }

  return (
    <header className={cn('top-0 z-50', config.navbar, {
      'has-sticky-header sticky top-6  px-6 ': config.navbar === 'floating',
      'top-10 has-sticky-header': config.layout === 'compact',
      'has-sticky-header': config.layout === 'semi-box' && config.navbar !== 'floating',
      'top-0 px-0': config.layout === 'semi-box' && config.navbar === 'floating'
    })}>
      <div className={cn('flex-none bg-white/90 backdrop-blur-xl md:px-7 px-4 py-3 xl:ms-[248px] border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(11,23,64,0.05)] flex items-center justify-between relative transition-all duration-300 ease-in-out', headerTheme, {
        'xl:ms-[72px]': config.collapsed,
        'border-b': true,
        'xl:ms-0': config.menuHidden || config.layout === "horizontal",
        'top-6 rounded-sm': config.layout === 'semi-box',
        'xl:ms-28': config.sidebar === 'compact' && config.layout !== 'horizontal',
        'rounded-sm': config.navbar === 'floating'

      })}>
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B4A]/35 to-transparent pointer-events-none" />

        {children}
      </div>
    </header>
  )
}

export default HeaderContent