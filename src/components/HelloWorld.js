import React, { PropTypes } from 'react';

function HelloWorld(props) {
	const { text } = props;

	return (
		<div style={styles.text}>{text}</div>
	);
}

const styles = {
	text: {
		color: '#2196F3',
		fontSize: 24,
		fontWeight: 'bold',
		minHeight: 32
	}
};

HelloWorld.propTypes = {
	text: PropTypes.string.isRequired
};

export default HelloWorld;