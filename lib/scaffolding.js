'use babel';

import ScaffoldingView from './scaffolding-view';
import { CompositeDisposable } from 'atom';

export default {

  scaffoldingView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.scaffoldingView = new ScaffoldingView(state.scaffoldingViewState);
    this.modalPanel = atom.workspace.addRightPanel({
      item: this.scaffoldingView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'scaffolding:toggle': () => this.toggle(),
      'scaffolding:edit': () => this.edit()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.scaffoldingView.destroy();
  },

  serialize() {
    return {
      scaffoldingViewState: this.scaffoldingView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  edit() {
    this.ScaffoldingView.edit();
  }

};
