import React, { useState } from 'react'
import { Button, Text, Flex, Message, Modal, InjectedModalProps, Checkbox } from '@pancakeswap/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'

interface ExpertModalProps extends InjectedModalProps {
  setShowConfirmExpertModal: (boolean) => void
  setShowExpertModeAcknowledgement: (boolean) => void
}

const ExpertModal: React.FC<ExpertModalProps> = ({
  setShowConfirmExpertModal,
  setShowExpertModeAcknowledgement,
  noModal,
}) => {
  const [, toggleExpertMode] = useExpertModeManager()
  const [isRememberChecked, setIsRememberChecked] = useState(false)

  const { t } = useTranslation()

  const renderModalBody = () => {
    return (
      <>
        <Message variant="warning" mb="24px">
          <Text small>
            {t(
              "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
            )}
          </Text>
        </Message>
        <Text mb="24px" small>
          {t('Only use this mode if you know what you’re doing.')}
        </Text>
        <Flex alignItems="center" mb="24px">
          <Checkbox
            name="confirmed"
            type="checkbox"
            checked={isRememberChecked}
            onChange={() => setIsRememberChecked(!isRememberChecked)}
            scale="sm"
          />
          <Text ml="10px" color="textSubtle" style={{ userSelect: 'none' }} small>
            {t('Don’t show this again')}
          </Text>
        </Flex>
        <Flex flexDirection="column" width="100%">
          <Button
            mb="8px"
            id="confirm-expert-mode"
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                toggleExpertMode()
                setShowConfirmExpertModal(false)
                if (isRememberChecked) {
                  setShowExpertModeAcknowledgement(false)
                }
              }
            }}
          >
            {t('Turn On Expert Mode')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirmExpertModal(false)
            }}
          >
            {t('Cancel')}
          </Button>
        </Flex>
      </>
    )
  }

  if (noModal) {
    return renderModalBody()
  }

  return (
    <Modal
      title={t('Expert Mode')}
      onBack={() => setShowConfirmExpertModal(false)}
      onDismiss={() => setShowConfirmExpertModal(false)}
      // headerBackground="gradients.cardHeader"
      style={{ maxWidth: '425px' }}
    >
      {renderModalBody()}
    </Modal>
  )
}

export default ExpertModal
