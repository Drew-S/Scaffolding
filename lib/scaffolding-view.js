'use babel';

import { Directory, File } from 'atom';

export default class ScaffoldingView {

  constructor(serializedState) {
    this.win = false;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('scaffolding');

    var scaf = this.getConfigDir();
    this.buildDir(scaf);

    var h1 = document.createElement('h1');
    h1.innerHTML = "Scaffolding";
    h1.classList.add('header');

    var edit = document.createElement('div');
    edit.classList.add('edit-icon');
    var button = document.createElement('button');
    button.innerHTML = "edit";
    button.onclick = () => {
      this.edit();
    };
    edit.appendChild(button);

    if(this.win) this.scafFile = new File(scaf + "\\scaffolding.json");
    else this.scafFile = new File(scaf + "/scaffolding.json");
    this.scafFile.create().then(() => {
      this.scafFile.read().then((string) => {
        if(!string){
          this.scaf = [];
        } else {
          this.scaf = JSON.parse(string);
        }
        this.element.appendChild(h1);
        this.buildScaf(this.element.children[1]);
        this.element.appendChild(edit);

      });

    });
    this.scafFile.onDidChange(() => {
      this.scafFile.read().then((string) => {
        if(!string){
          this.scaf = [];
        } else {
          this.scaf = JSON.parse(string);
        }
        this.buildScaf(this.element.children[1]);

      });
    });


  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  // get atom config directory
  getConfigDir() {
    if(/^win/.test(process.platform)){
      return "%USERPROFILE%\\.atom\\scaffolding";
      this.win = true;

    } else if(/^darwin/.test(process.platform)){
      return "~/.atom/scaffolding";

    } else {
      return "~/.atom/scaffolding";
    }
  }

  // build initial Scaffolding directory if it does not already exist
  buildDir(dir) {
    var D = new Directory(dir);
    D.create();
    delete D;
  }

  // build the panel elements
  buildScaf(elem) {
    var t = false;
    if(elem){
      while(elem.firstChild) {
        elem.removeChild(elem.firstChild);
      }

    } else {
      elem = document.createElement('ul');
      elem.classList.add('list-group');
      t = true;
    }

    var index = 0;

    for(var i of this.scaf){
      var li = document.createElement('li');
      li.innerHTML = i.name;
      li.classList.add('full-menu');
      li.classList.add('list-tree');

      let ind = index;
      li.onclick = () => {
        this.buildScaffolding(ind);
      };

      index++;
      elem.appendChild(li);

    }
    if(t) this.element.appendChild(elem);

  }

  // pass through for generating files from index
  buildScaffolding(index) {
    var root = atom.project.rootDirectories[0].path;
    var objRoot = this.scaf[index].root;
    this.buildScaffoldingStructure(objRoot, root);

  }

  // generate files from object
  buildScaffoldingStructure(obj, dir, callback){
    for(var i of obj){
      let e = i;
      if(e.type == "file"){
        if(this.win) var f = new File(dir + "\\" + e.name);
        else var f = new File(dir + "/" + e.name);
        f.create().then(() => {
          if(e.contents) {
            f.write(e.contents);
          }

        });
      } else if(e.type == "dir"){
        if(this.win) var D = new Directory(dir + "\\" + e.name);
        else var D = new Directory(dir + "/" + e.name);
        D.create().then(() => {
          if(e.root){
            if(this.win) this.buildScaffoldingStructure(e.root, dir + "\\" + e.name, callback());
            else this.buildScaffoldingStructure(e.root, dir + "/" + e.name, callback());
          }
        });
      }
    }
    callback();
  }

  // open scaffolding file for editing
  edit(callback) {
    atom.workspace.open(this.scafFile.path).then(callback(editor));
  }

}
