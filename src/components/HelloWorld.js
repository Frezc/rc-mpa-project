import React, { PropTypes } from 'react';

export default class HelloWorld extends React.Component {

	render() {
		const { text } = this.props;

		return (
			<div style={styles.text}>{text}</div>
		);
	}
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