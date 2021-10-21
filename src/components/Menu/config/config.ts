import { MenuItemsType, DropdownMenuItemType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Home'),
    // icon: 'Dashboard',
    href: '/home',
    hideSubNav: true,
    showItemsOnMobile: false,
    // items: [
    //   {
    //     label: t('Exchange'),
    //     href: '/swap',
    //   },
    //   {
    //     label: t('Liquidity'),
    //     href: '/liquidity',
    //   },
    // ],
  },
  {
    label: t('Swap'),
    // icon: 'Swap',
    href: '/swap',
    hideSubNav: true,
    showItemsOnMobile: false,
    // items: [
    //   {
    //     label: t('Exchange'),
    //     href: '/swap',
    //   },
    //   {
    //     label: t('Liquidity'),
    //     href: '/liquidity',
    //   },
    // ],
  },
  {
    label: t('Pools'),
    href: '/liquidity',
    // icon: 'Pool',
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Farms'),
    href: '/farms',
    // icon: 'Farms',
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Stake'),
    href: '/stake',
    // icon: 'Stake',
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  // {
  //   label: t('NFT'),
  //   href: '/collectibles',
  //   icon: 'Nft',
  //   showOnMobile: false,
  //   showItemsOnMobile: false,
  //   items: [
  //     {
  //       label: t('Collectibles'),
  //       href: '/collectibles',
  //     },
  //   ],
  // },
  // {
  //   label: t('More'),
  //   href: '/info',
  //   icon: 'More',
  //   hideSubNav: true,
  //   items: [
  //     {
  //       label: t('Info'),
  //       href: '/info',
  //     },
  //   ],
  // },
]

export default config
