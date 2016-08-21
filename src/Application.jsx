import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HomePage from './components/Home';
import StatusPage from './components/Status';
import Navigation from './components/Navigation';
import { Router, Route, Link, browserHistory } from 'react-router';

const routes = <Router history={browserHistory}>
          <Route path="/" component={HomePage} />
          <Route path="/status" component={StatusPage} />
        </Router>;

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: location.pathname
    };
  }

  componentDidMount() {
    browserHistory.listen(location => {
      this.setState({path: location.pathname});
    });
  }

  render() {
    return (<div>
      <Navigation path={this.state.path} />
      <div className={'container main-container'}>
        {routes}
      </div>
    </div>);
  }
}

ReactDOM.render(<Application />, document.getElementById('container'));
