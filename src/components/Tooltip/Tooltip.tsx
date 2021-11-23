import React from "react";
import { BoxProps, Flex, InfoIcon, useTooltip } from '@pancakeswap/uikit'

type InfoTooltip = {
  text: string;
} & BoxProps;

const InfoTooltip: React.FC<InfoTooltip> = ({ text, ...props }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, {placement: "top"});
  return (
    // eslint-disable-next-line react/jsx-no-undef
    <Flex {...props} alignItems="center">
      {tooltipVisible && tooltip}
      <Flex ref={targetRef} alignItems="center">
        <InfoIcon width={16} height={16} />
      </Flex>
    </Flex>
  );
};

export default InfoTooltip;
