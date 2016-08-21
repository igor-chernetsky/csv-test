import React, {Component} from 'react';
import { browserHistory } from 'react-router'

export default class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  redirect(e){
  	e.preventDefault();
  	browserHistory.push(e.target.pathname);
  }

  render() {
  	const loc = this.props.path.replace(/^\/|\/$/g,'');
    return (<nav className="navbar navbar-default navbar-fixed-top">
	    <div className="container">
	      <div className="navbar-header">
	        <a className="navbar-brand" href="/" onClick={this.redirect}>Test App</a>
	      </div>
	      <div id="navbar" className="collapse navbar-collapse">
	        <ul className="nav navbar-nav">
	          <li className={loc === '' ? 'active' : ''}>
	          	<a href="/" onClick={this.redirect}>Home</a>
	          </li>
	          <li className={loc === 'status' ? 'active' : ''}>
	          	<a href="/status" onClick={this.redirect}>Status</a>
	          </li>
	        </ul>
	      </div>
	    </div>
	  </nav>);
  }
}

