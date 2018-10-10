import React, {Component} from "react";

import Bar from "./Bar"

class Layout extends Component {
	render(){
		const barComponents = this.props.bars.map((barProps) =>
							<Bar key={barProps.id} {...barProps} />);
		return( <ul>{barComponents}</ul> );
	}
}

export default Layout;