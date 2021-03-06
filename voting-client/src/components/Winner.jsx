import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actionCreators from '../action_creators';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div className="winner">
      Winner is {this.props.winner}!

      <button ref="restart"
              onClick={this.props.restart}>
        Restart
      </button>
    </div>;
  }
});
