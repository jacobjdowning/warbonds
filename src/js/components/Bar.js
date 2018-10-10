import React, {Component} from "react";

class Bar extends Component {
	render(){
		const divStyle = {
 			width: this.props.share + '%',
		};
		const link = "https://www.wowhead.com/item=" + this.props.id;
		return(
			<li>
				<a href={link} data-wowhead={this.props.id}>
					<div className="itemicon">
						<img src={this.props.icon} />
						<img src="https://wow.zamimg.com/images/Icon/large/border/default.png" />
						<span>{this.props.count}</span>
					</div>
				</a>
				<div className="bar" style={divStyle}>
					<span>{this.props.cost}g</span>
				</div>
			</li>
		);
	}
}

export default Bar;