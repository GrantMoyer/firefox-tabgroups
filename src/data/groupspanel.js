const store = Redux.createStore(Reducer);

const Actions = {
  addGroup: function() {
    browser.runtime.sendMessage({type: "Group:Add"});
  },

  addGroupWithTab: function(sourceGroupID, tabIndex) {
    browser.runtime.sendMessage({type: "Group:AddWithTab",
                                 event: {sourceGroupID, tabIndex}});
  },

  closeGroup: function(groupID) {
    browser.runtime.sendMessage({type: "Group:Close",
                                 event: {groupID}});
  },

  uiHeightChanged: function() {
    browser.runtime.sendMessage({type: "UI:Resize",
                                 event: {width: document.body.clientWidth,
                                         height: document.body.clientHeight}});
  },

  renameGroup: function(groupID, title) {
    browser.runtime.sendMessage({type: "Group:Rename",
                                 event: {groupID, title}});
  },

  selectGroup: function(groupID) {
    browser.runtime.sendMessage({type: "Group:Select",
                                 event: {groupID}});
  },

  moveTabToGroup: function(sourceGroupID, tabIndex, targetGroupID) {
    browser.runtime.sendMessage({type: "Group:Drop",
                                 event: {sourceGroupID, tabIndex, targetGroupID}});
  },

  selectTab: function(groupID, tabIndex) {
    browser.runtime.sendMessage({type: "Tab:Select",
                                 event: {groupID, tabIndex}});
  },

  dragTab: function(groupID, tabIndex) {
    browser.runtime.sendMessage({type: "Tab:Drag",
                                 event: {groupID, tabIndex}});
  },

  dragTabStart: function(groupID, tabIndex) {
    browser.runtime.sendMessage({type: "Tab:DragStart",
                                 event: {groupID, tabIndex}});
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider,
      {store: store},
      React.createElement(App, {
        onGroupAddClick: Actions.addGroup,
        onGroupAddDrop: Actions.addGroupWithTab,
        onGroupClick: Actions.selectGroup,
        onGroupDrop: Actions.moveTabToGroup,
        onGroupCloseClick: Actions.closeGroup,
        onGroupTitleChange: Actions.renameGroup,
        onTabClick: Actions.selectTab,
        onTabDrag: Actions.dragTab,
        onTabDragStart: Actions.dragTabStart,
        uiHeightChanged: Actions.uiHeightChanged
      })
    ),
    document.getElementById("content")
  );
});

browser.runtime.onMessage.addListener((message) => {
  switch (message.type) {
  case "Groups:Changed":
    store.dispatch(ActionCreators.setTabgroups(message.tabgroups));
    break;
  case "Groups:CloseTimeoutChanged":
    store.dispatch(ActionCreators.setGroupCloseTimeout(message.timeout));
    break;
  }
});
