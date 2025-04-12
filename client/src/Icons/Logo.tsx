import logoIcon from './logo.png';

import { Image } from '@chakra-ui/react';

const Logo = ({
	style = {
		width: '100px',
		height: 'auto',
		marginTop: '10px',
		marginBottom: '10px',
	}
}: {
	style?: React.CSSProperties;
}) => {
	return (
		<Image
			src={logoIcon}
			alt='Logo'
			style={ style }
		/>
	);
};

export default Logo;
