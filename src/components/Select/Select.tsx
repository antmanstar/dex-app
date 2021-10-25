import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Box, BoxProps, Text } from '@pancakeswap/uikit'

const DropDownHeader = styled.div<{ background?: string }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  // border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 8px;
  background: ${({ theme, background }) => background || theme.colors.backgroundAlt};
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.tertiary};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;
  box-shadow: 0 0 4px 6px rgba(134, 134, 134, 0.09);

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`

const DropDownContainer = styled(Box)<{ isOpen: boolean }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.colors.tertiary};
  border-radius: 8px;
  height: 40px;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        //border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 8px 8px 0 0;
      }

      border-radius: 8px 8px 0 0;

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        // border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        border-top-width: 0;
        border-radius: 0 0 8px 8px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}

  svg {
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

export interface SelectProps extends BoxProps {
  options: OptionProps[]
  onOptionChange?: (option: OptionProps) => void
  selectedTextColor?: string
  selectedBackgroundColor?: string
}

export interface OptionProps {
  label: string
  icon?: string
  value: any
}

const Select: React.FunctionComponent<SelectProps> = ({
  options,
  onOptionChange,
  selectedTextColor,
  selectedBackgroundColor,
  ...props
}) => {
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)

    if (onOptionChange) {
      onOptionChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <DropDownContainer isOpen={isOpen} {...props}>
      <DropDownHeader onClick={toggling} background={selectedBackgroundColor}>
        <>
          {options[selectedOptionIndex]?.icon && (
            <img
              width="24px"
              height="24px"
              src={options[selectedOptionIndex]?.icon}
              alt={options[selectedOptionIndex].value}
            />
          )}
        </>
        <Text color={selectedTextColor || 'text'}>{options[selectedOptionIndex].label}</Text>
        <ArrowDropDownIcon color={selectedTextColor || 'text'} onClick={toggling} />
      </DropDownHeader>
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Text>{option.label}</Text>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
