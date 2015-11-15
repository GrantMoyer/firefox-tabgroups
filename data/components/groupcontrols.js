const GroupControls = React.createClass({
  render: function() {
    let expanderClasses = classNames({
      "group-expand": true,
      "fa": true,
      "fa-fw": true,
      "fa-chevron-down": !this.props.expanded,
      "fa-chevron-up": this.props.expanded
    });

    return React.DOM.span(
      {
        className: "group-controls"
      },
      React.DOM.i({
        className: "group-edit fa fa-fw fa-pencil",
        onClick: this.props.onEdit
      }),
      React.DOM.i({
        className: "group-close fa fa-fw fa-times",
        onClick: this.props.onClose
      }),
      React.DOM.i({
        className: expanderClasses,
        onClick: this.props.onExpand
      })
    );
  }
});