import { ChainId } from '@pancakeswap/sdk'
import { serializeTokens } from './tokens'
import { SerializedReferralConfig } from './types'


const referral: SerializedReferralConfig = {
  header1: 'Tell your friends about ',
  header2: 'Earn together.',
  header3: 'Invite your friends and receive 6% of the earnings they claimed from our products. No invitation limits. Rewards credited instantly.',
  headerLabels: ["Total Referred Friends", "Totla Commissions Earned", "Your Commission Rate"],
  shareLink: "Share your link & earn more!",
  roundButtons: [
    {
      text: 'Earn 50% commission in Eco on every trade!',
      iconPath: '/images/referral/bt1.png'
    },
    {
      text: 'Payout within 24 hours!',
      iconPath: '/images/referral/bt2.png'
    },
    {
      text: 'Unlimited earnings',
      iconPath: '/images/referral/bt3.png'
    },
    {
      text: 'Easy Tracking & Reports',
      iconPath: '/images/referral/bt4.png'
    },
  ],
  steps: [
    {
      step: 'Step1',
      title: 'Get a link',
      content: 'Connect a wallet and generate your link in Share-to-earn section.',
      img: '/images/referral/step1.png'
    },
    {
      step: 'Step2',
      title: 'Invite friends',
      content: 'Invite your friends to register via your link.',
      img: '/images/referral/step2.png'
    },
    {
      step: 'Step3',
      title: 'Earn ECO',
      content: 'Receive Rewards in ECO tokens from your friends’ earning.',
      img: '/images/referral/step3.png'
    }
  ]
}

export default referral
