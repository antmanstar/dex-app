import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'EcoSwap',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by EcoSwap), NFTs, and more, on a platform you can trust.',
  // TODO: remove https://EcoSwap.finance
  image: '/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('EcoSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('EcoSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('EcoSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('EcoSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('EcoSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('EcoSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('EcoSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('EcoSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('EcoSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('EcoSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('EcoSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('EcoSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('EcoSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('EcoSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('EcoSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('EcoSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('EcoSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('EcoSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('EcoSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('EcoSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('EcoSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('EcoSwap Info & Analytics')}`,
        description: 'View statistics for EcoSwap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('EcoSwap Info & Analytics')}`,
        description: 'View statistics for EcoSwap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Pools')} | ${t('EcoSwap Info & Analytics')}`,
        description: 'View statistics for EcoSwap exchanges.',
      }
    default:
      return null
  }
}
