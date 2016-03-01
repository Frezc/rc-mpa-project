import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

//import your action creators
import { textChange } from '../actions';

//import your components
import HelloWorld from '../components/HelloWorld';

//App Entry
class App extends React.Component {
  render () {
  	const { text, dispatch } = this.props;

    return (
    	<div>
	    	<HelloWorld
	    		text={text} />
	    	<input 
	    		type="text" 
	    		defaultValue="Hello World!" 
	    		onChange={e => dispatch(textChange(e.target.value))}/>
    	</div>
    );
  }
}

App.propTypes = {
	text: PropTypes.string.isRequired
};

function select (state) {
	return {
		text: state.text
	};
}

export default connect(select)(App);