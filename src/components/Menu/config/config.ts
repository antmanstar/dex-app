import { MenuItemsType, DropdownMenuItemType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  // {
  //   label: t('Home'),
  //   // icon: 'Dashboard',
  //   href: '/home',
  //   hideSubNav: true,
  //   showItemsOnMobile: false,
  //   // items: [
  //   //   {
  //   //     label: t('Exchange'),
  //   //     href: '/swap',
  //   //   },
  //   //   {
  //   //     label: t('Liquidity'),
  //   //     href: '/liquidity',
  //   //   },
  //   // ],
  // },
  // {
  //   label: t('Swap'),
  //   // icon: 'Swap',
  //   href: '/swap',
  //   hideSubNav: true,
  //   showItemsOnMobile: false,
  //   // items: [
  //   //   {
  //   //     label: t('Exchange'),
  //   //     href: '/swap',
  //   //   },
  //   //   {
  //   //     label: t('Liquidity'),
  //   //     href: '/liquidity',
  //   //   },
  //   // ],
  // },
  // {
  //   label: t('Pools'),
  //   href: '/liquidity',
  //   // icon: 'Pool',
  //   hideSubNav: true,
  //   showItemsOnMobile: false,
  // },
  // {
  //   label: t('Farms'),
  //   href: '/farms',
  //   // icon: 'Farms',
  //   hideSubNav: true,
  //   showItemsOnMobile: false,
  // },
  // {
  //   label: t('Stake'),
  //   href: '/stake',
  //   // icon: 'Stake',
  //   hideSubNav: true,
  //   showItemsOnMobile: false,
  // },
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
  {
    label: t('Stats'),
    href: "/dashboard",
    icon: "Dashboard",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Swap'),
    href: "/swap",
    icon: "SwapAlt",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Pools'),
    href: "/liquidity",
    icon: "Pools",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Farms'),
    href: "/farms",
    icon: "Farms",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Bridge'),
    href: "/bridge",
    icon: "Bridge",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Stake'),
    href: "/stake",
    icon: "Stake",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Tanks'),
    href: "/tanks",
    icon: "Tanks",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Vault'),
    href: "/vault",
    icon: "Vault",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('Lend'),
    href: "/lending",
    icon: "Lending",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: t('NFT'),
    href: "/nft",
    icon: "Boxes",
    hideSubNav: true,
    showItemsOnMobile: false,
  },
]

export default config
