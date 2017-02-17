'use babel';

import {Directory, File} from 'atom';
const CSON   = require('cson');
const path   = require('path');
const Parser = require('./parser');
const fs     = require('fs');

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

        if (this.win)
            this.scafFile = new File(scaf + "\\scaffolding.cson");
        else
            this.scafFile = new File(scaf + "/scaffolding.cson");
        this.scafFile.create().then(() => {
            this.scafFile.read().then((string) => {
                if (!string) {
                    this.scaf = [];
                } else {
                    this.scaf = CSON.parse(string);
                }
                this.element.appendChild(h1);
                this.buildScaf(this.element.children[1]);
                this.element.appendChild(edit);

            });

        });
        this.scafFile.onDidChange(() => {
            this.scafFile.read().then((string) => {
                if (!string) {
                    this.scaf = [];
                } else {
                    this.scaf = CSON.parse(string);
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
        if (/^win/.test(process.platform)) {
            return path.join(atom.config.getUserConfigPath(), "../", '/scaffolding');
            this.win = true;

        } else {
            return path.join(atom.config.getUserConfigPath(), "../", '/scaffolding');

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
        if (elem) {
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }

        } else {
            elem = document.createElement('ul');
            elem.classList.add('list-group');
            t = true;
        }

        var index = 0;

        for (var i of this.scaf) {
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
        if (t)
            this.element.appendChild(elem);

        }

    // pass through for generating files from index
    buildScaffolding(index) {
        var root = atom.project.rootDirectories[0].path;

        // If using a seperate file for hierarchy
        if (this.scaf[index].rootUrl) {
            var rootUrl = this.scaf[index].rootUrl;
            var truePath = path.join(atom.config.getUserConfigPath(),
                                     "../scaffolding", rootUrl);

            // Plain text hierarchy
            if(rootUrl.match(/.txt$/)){
                var parser = new Parser();
                var objRoot = parser.readFile(truePath, (obj) => {
                    var objRoot = obj.root;
                    this.buildScaffoldingStructure(objRoot, root);
                });

            // CSON hierarchy
            } else if(rootUrl.match(/.cson$/)){
                fs.readFile(truePath, (err, data) => {
                    data = CSON.parse(data);
                    if(!data.root){
                        atom.notifications.addError('Error: No structure in file:', {
                            detail: truePath + "\nNo \"root\" array in file",
                            dismissable: true
                        });
                        return;
                    }
                    objRoot = data.root;
                    this.buildScaffoldingStructure(objRoot, root);
                });

            // JSON hierarchy
            } else if(rootUrl.match(/.json$/)){
                fs.readFile(truePath, (err, data) => {
                    data = JSON.parse(data);
                    if(!data.root){
                        atom.notifications.addError('Error: No structure in file:', {
                            detail: truePath + "\nNo \"root\" array in file",
                            dismissable: true
                        });
                        return;
                    }
                    objRoot = data.root;
                    this.buildScaffoldingStructure(objRoot, root);
                });

            // Not a valid type
            } else {
                atom.notifications.addError('Error: rootUrl is not a valid file', {
                    detail: "\"" + rootUrl + "\"\nAccepted file extensions are:\n\".cson\", \".json\", \".txt\"",
                    dismissable: true
                });
            }

        // Default to read directly from file
        } else {
            var objRoot = this.scaf[index].root;
            console.log(objRoot);
            this.buildScaffoldingStructure(objRoot, root);
        }

    }

    // generate files from object
    buildScaffoldingStructure(obj, dir) {
        dir = dir.replace(/\/$/, '').replace(/\\$/, '');
        for (var i of obj) {
            let e = i;
            if (e.type == "file") {
                if (this.win)
                    var f = new File(dir + "\\" + e.name);
                else
                    var f = new File(dir + "/" + e.name);
                let F = f;
                F.create().then(() => {
                    if (e.contents) {
                        F.write(e.contents);
                    }
                });
            } else if (e.type == "dir") {
                if (this.win)
                    var d = new Directory(dir + "\\" + e.name);
                else
                    var d = new Directory(dir + "/" + e.name);
                let D = d
                D.create().then(() => {
                    if (e.root) {
                        if (this.win) {
                            this.buildScaffoldingStructure(e.root, dir + "\\" + e.name);
                        } else {
                            this.buildScaffoldingStructure(e.root, dir + "/" + e.name);
                        }
                    }
                });
            }
        }
    }

    // open scaffolding file for editing
    edit(callback) {
        atom.workspace.open(this.scafFile.path).then(() => {
            if (callback)
                callback();
            }
        );
    }

}
