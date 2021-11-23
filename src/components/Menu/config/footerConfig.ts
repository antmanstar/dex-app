import { CertikIcon, FooterLinkType, GithubIcon, MediumIcon, PaladinIcon } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { ISmallFooterLinks } from '../../FooterSmall/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://docs.pancakeswap.finance/contact-us',
      },
      {
        label: t('Blog'),
        href: 'https://pancakeswap.medium.com/',
      },
      {
        label: t('Community'),
        href: 'https://docs.pancakeswap.finance/contact-us/telegram',
      },
      {
        label: t('CAKE token'),
        href: 'https://docs.pancakeswap.finance/tokenomics/cake',
      },
      {
        label: '—',
      },
      {
        label: t('Online Store'),
        href: 'https://pancakeswap.creator-spring.com/',
        isHighlighted: true,
      },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://docs.pancakeswap.finance/contact-us/customer-support',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://docs.pancakeswap.finance/help/troubleshooting',
      },
      {
        label: t('Guides'),
        href: 'https://docs.pancakeswap.finance/get-started',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/pancakeswap',
      },
      {
        label: t('Documentation'),
        href: 'https://docs.pancakeswap.finance',
      },
      {
        label: t('Bug Bounty'),
        href: 'https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty',
      },
      {
        label: t('Audits'),
        href: 'https://docs.pancakeswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited',
      },
      {
        label: t('Careers'),
        href: 'https://docs.pancakeswap.finance/hiring/become-a-chef',
      },
    ],
  },
]

export const smallFooterLinks: (t: ContextApi['t']) => ISmallFooterLinks = (t) => {
  return {
    links: [
      {
        id: 1,
        title: t('Documentation'),
        url: '#',
      },
      {
        id: 2,
        title: t('Analytics'),
        url: '#',
      },
      {
        id: 3,
        title: t('Request'),
        url: '#',
      }
    ],
    audit: [
      {
        title: t('Certik'),
        url: 'https://www.certik.com',
        icon: CertikIcon,
        isTsSvg: true,
      },
      {
        title: t('Paladin'),
        url: 'https://www.paladin.com',
        icon: PaladinIcon,
        isTsSvg: true,
      },
    ],
    socialMedia: [
      {
        id: 1,
        title: t('Telegram'),
        url: 'https://www.telegram.com',
        icon: '/images/footer/telegram.svg',
      },
      {
        id: 2,
        title: t('discord'),
        url: 'https://www.dicord.com',
        icon: '/images/footer/discord.svg',
      },
      {
        id: 2,
        title: t('Twitter'),
        url: '#',
        icon: '/images/footer/twitter.svg',
      },
      {
        id: 3,
        title: t('Medium'),
        url: '#',
        icon: MediumIcon,
        isTsSvg: true,
      },
      {
        id: 4,
        title: t('Github'),
        url: '#',
        icon: GithubIcon,
        isTsSvg: true,
      },
    ],
  }
}
