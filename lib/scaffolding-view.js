'use babel';

const Parser = require('./scaffold-file');

export default class ScaffoldingView {

    constructor(serializedState, testing=false) {

        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('scaffolding');

        var h1 = document.createElement('h1');
        h1.innerHTML = "Scaffolding";
        h1.classList.add('header');
        this.element.appendChild(h1);

        if(testing){
            this.parser = new Parser(this.element, true);
        } else {
            this.parser = new Parser(this.element);
        }

        this.element = this.parser.build();

        var edit = document.createElement('div');
        edit.classList.add('edit-icon');
        var button = document.createElement('button');
        button.innerHTML = "edit";
        button.onclick = () => {
            this.edit();
        };
        edit.appendChild(button);
        this.element.appendChild(edit);

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

    // open scaffolding file for editing
    edit(callback) {
        atom.workspace.open(this.parser.scafFile.path).then(() => {
            if (callback)
                callback();
            }
        );
    }

}
