import * as React from 'react';
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');

  return (
		<IconButton
			size='md'
			fontSize='lg'
			variant='ghost'
			color='current'
			marginLeft='2'
			onClick={toggleColorMode}
			aria-label={`Switch to ${text} mode`}
			{...props}
		/>
	);
};
