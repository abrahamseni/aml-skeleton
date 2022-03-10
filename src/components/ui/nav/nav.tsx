import React, { FC } from 'react'
import { useReapitConnect } from '@reapit/connect-session'
import { reapitConnectBrowserSession } from '../../../core/connect-session'
import { NavResponsive, NavResponsiveOption } from '@reapit/elements'
import { Routes } from '../../../constants/routes'
import { history } from '../../../core/router'
import { navigate } from '../../../utils/navigation'

export const getDefaultNavIndex = (pathname: string) => {
  switch (pathname) {
    case Routes.HOME:
    case Routes.SEARCH:
    case Routes.CHECKLIST_DETAIL:
      return 1
    default:
      return 0
  }
}

export const Nav: FC = () => {
  const { connectLogoutRedirect, connectIsDesktop } = useReapitConnect(reapitConnectBrowserSession)
  const navOptions: NavResponsiveOption[] = [
    {
      itemIndex: 0,
    },
    {
      itemIndex: 1,
      text: 'Search',
      iconId: 'searchMenu',
      callback: navigate(history, Routes.HOME),
      subItems: [
        {
          itemIndex: 1,
          callback: navigate(history, Routes.SEARCH),
          text: 'Client Search',
        },
        {
          itemIndex: 3,
          callback: navigate(history, Routes.CHECKLIST_DETAIL),
          text: 'Checklist Detail',
        },
      ],
    },
  ]

  if (!connectIsDesktop) {
    navOptions.push(
      {
        itemIndex: 4,
        callback: () => (window.location.href = window.reapit.config.marketplaceUrl),
        iconId: 'appsMenu',
        text: 'Apps',
      },
      {
        itemIndex: 5,
        callback: connectLogoutRedirect,
        isSecondary: true,
        iconId: 'logoutMenu',
        text: 'Logout',
      },
    )
  }

  return <NavResponsive options={navOptions} defaultNavIndex={getDefaultNavIndex(window.location.pathname)} />
}

export default Nav
