import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ChevronDownIcon, Box, BoxProps, Text } from '@pancakeswap/uikit'

const DropDownHeader = styled.div<{ background?: string, displayIconOnly?: boolean, bottomBorder?: boolean, height?: any }>`
  width: 100%;
  height: ${({height}) => height || "36px"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({displayIconOnly, bottomBorder}) => bottomBorder ? "0px" : displayIconOnly ? '0px 8px': '0px 16px'};
  box-shadow: ${({ theme, bottomBorder }) => bottomBorder ? 'none' : theme.shadows.inset};
  border-radius: ${({ bottomBorder }) => bottomBorder ? '0px' : "5px"};
  background: ${({ theme, background }) => background || theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme, bottomBorder }) => bottomBorder ?  theme.colors.text : 'transparent'};
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

const DropDownContainer = styled(Box)<{ isOpen: boolean, displayIconOnly?: boolean, zindex?: string }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.colors.tertiary};
  border-radius: 5px;
  height: ${({height}) => height || "36px"};
  min-width: ${({displayIconOnly, minWidth}) => minWidth || displayIconOnly ? '64px' : '130px'} ;
  user-select: none;
  z-index: ${({zindex}) => zindex ? `${zindex}` : '20'};

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: ${({minWidth}) => minWidth || "150px"};
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        //border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 5px 5px 0 0;
      }

      border-radius: 5px 5px 0 0;

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        // border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        border-top-width: 0;
        border-radius: 0 0 5px 5px;
        box-shadow: ${({theme}) => theme.colors.shadow.default};
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
  display: flex;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`

export interface SelectProps extends BoxProps {
  options: OptionProps[]
  onOptionChange?: (option: OptionProps) => void
  selectedTextColor?: string
  selectedBackgroundColor?: string
  displayIconOnly?: boolean
  bottomBorder?: boolean
}

export interface OptionProps {
  label: string
  icon?: string
  value: any
}

export interface ZIndexProps {
  zindex?: string
}

const Select: React.FunctionComponent<SelectProps & ZIndexProps> = ({
  options,
  onOptionChange,
  selectedTextColor,
  selectedBackgroundColor,
  displayIconOnly,
  bottomBorder,
  zindex,
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
    <DropDownContainer isOpen={isOpen} {...props} displayIconOnly={displayIconOnly} zindex={zindex}>
      <DropDownHeader onClick={toggling} background={selectedBackgroundColor} displayIconOnly={displayIconOnly} height={props.height} bottomBorder={bottomBorder}>
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
        {!displayIconOnly && <Text marginLeft={options[selectedOptionIndex]?.icon ? '8px' : '0'} color={selectedTextColor || 'text'}>{options[selectedOptionIndex].label}</Text>}
        <ChevronDownIcon color={selectedTextColor || 'text'} onClick={toggling} />
      </DropDownHeader>
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                {option?.icon && (
                  <img
                    width="24px"
                    height="24px"
                    src={option?.icon}
                    alt={option.value}
                  />
                )}
                <Text ml={option?.icon ? "16px" : '0'}>{option.label}</Text>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
