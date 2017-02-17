const fs = require('fs');

class parser {

    readFile(file, callback){
        fs.readFile(file, (err, data) => {
            data = data.toString().replace(/\t{1}/g, '    ');

            var lines = data.split(/\n/);

            if(lines[lines.length-1] == ""){
                lines.pop();
            }

            if(lines[0].match(/^#/)){
                var root = lines[0].replace(/^#{1}/, '');
                lines.splice(0, 1);
            }

            if(root){
                var tree = new Tree(root);
            } else {
                var tree = new Tree();
            }

            var prev = 0;


            var index;
            var file = false;
            var fileIndent;

            for(var line of lines){
                var indent = this.getIndent(line);
                if(indent == prev){
                    if(fileIndent && fileIndent >= prev){
                        var diff = prev - indent;
                        if(file){
                            file = false;
                            fileIndent = null;
                            tree.current.contents = tree.current.contents.replace(/\n$/g, '');
                        }
                        for(var i=0; i<=diff; i++){
                            tree.current = tree.current.parent;
                        }
                        prev = indent;
                        if(line.match(/\/$/)){
                            index = tree.add(line.replace(/\ {4}/g, '').replace(/\n/g, ''), "dir");
                        } else {
                            index = tree.add(line.replace(/\ {4}/g, '').replace(/\n/g, ''), "file");
                        }
                    } else if(file){
                        for(var i=0; i<=prev; i++){
                            line = line.replace(/^\ {4}/);
                        }
                        var str = '';
                        for(var i=0; i<fileIndent; i++){
                            str += '    ';
                        }
                        var reg = new RegExp('^'+str+"{1}");
                        tree.current.contents += line.replace(reg, '')+"\n";
                    } else {
                        if(line.match(/\/$/)){
                            index = tree.add(line.replace(/\ {4}/g, '').replace(/\n/g, ''), "dir");
                        } else {
                            index = tree.add(line.replace(/\ {4}/g, '').replace(/\n/g, ''), "file");
                        }
                        tree.current = tree.current.children[index];
                    }
                } else if(indent > prev){
                    if(file){
                        var str = '';
                        for(var i=0; i<fileIndent; i++){
                            str += '    ';
                        }
                        var reg = new RegExp('^'+str+"{1}");
                        tree.current.contents += line.replace(reg, '')+"\n";

                    } else {
                        if(!line.match(/\/$/)){
                            file = true;
                            fileIndent = indent+1;
                        }
                        prev = prev+1;
                        if(line.match(/\/$/)){
                            index = tree.add(line.replace(/\ {4}/g, '').replace(/\n/g, ''), "dir");
                        } else {
                            index = tree.add(line.replace(/\ {4}/g, '').replace(/\n/g, ''), "file");
                        }
                        tree.current = tree.current.children[index];
                    }
                } else {
                    if(file){
                        file = false;
                        var diff = fileIndent - indent;
                    } else {
                        var diff = prev - indent;
                    }
                    for(var i=0; i<=diff; i++){
                        tree.current = tree.current.parent;
                    }
                    prev = indent;
                    if(line.match(/\/$/)){
                        index = tree.add(line.replace(/\ {4}/g, '').replace(/\n/g, ''), "dir");
                    } else {
                        index = tree.add(line.replace(/\ {4}/g, '').replace(/\n/g, ''), "file");
                    }
                }
            }
            callback(tree.getJSON());
        });

    }

    getIndent(string){
        var tmp = string;
        var len = 0;
        while(tmp.match(/^\ {4}/)){
            tmp = tmp.replace(/^\ {4}/, '');
            len++;
        }
        return len;
    }

}

class Tree {

    constructor(name="root"){
        this.root = new Node(name);
        this.current = this.root;
    }

    add(name, type){
        var node = new Node(name, type);
        return this.current.add(node);
    }

    print(){
        console.log(this.root.name+" : "+this.root.children.length+" [");
        for(var i of this.root.children){
            this.printR(i, 0);
        }
        console.log("]");
    }

    printR(node, ind){
        var str = '';
        for(var i=0; i<=ind; i++){
            str += '    ';
        }
        if(node.contents != ''){
            console.log(str + "|" + node.name + " : " + node.type);
            console.log(str+"    |"+node.contents.replace(/^\ {4}/g, '').replace(/\n{1}/g, '\n'+str+"    |")+"");
        } else {
            console.log(str + "|" + node.name + " : " + node.type);
        }
        for(var i of node.children){
            this.printR(i, ind + 1);
        }
    }

    getJSON(){
        var obj = {
            root: []
        }
        for(var i of this.root.children){
            if(i.children.length > 0){
                if(i.contents != ''){
                    obj.root.push({
                        type: i.type,
                        name: i.name,
                        root: this.getJSONroot(i),
                        contents: i.contents
                    });
                } else {
                    obj.root.push({
                        type: i.type,
                        name: i.name,
                        root: this.getJSONroot(i)
                    });
                }
            } else {
                if(i.contents != ''){
                    obj.root.push({
                        type: i.type,
                        name: i.name,
                        root: this.getJSONroot(i),
                        contents: i.contents
                    });
                } else {
                    obj.root.push({
                        type: i.type,
                        name: i.name,
                        root: this.getJSONroot(i)
                    });
                }
            }
        }
        return obj;
    }

    getJSONroot(node){
        var arr = [];
        for(var i of node.children){
            if(i.children.length > 0){
                if(i.contents != ''){
                    arr.push({
                        type: i.type,
                        name: i.name,
                        root: this.getJSONroot(i),
                        contents: i.contents
                    });
                } else {
                    arr.push({
                        type: i.type,
                        name: i.name,
                        root: this.getJSONroot(i)
                    });
                }
            } else {
                if(i.contents != ''){
                    arr.push({
                        type: i.type,
                        name: i.name,
                        root: this.getJSONroot(i),
                        contents: i.contents
                    });
                } else {
                    arr.push({
                        type: i.type,
                        name: i.name,
                        root: this.getJSONroot(i)
                    });
                }
            }
        }
        return arr;
    }
}

class Node {

    constructor(name="", type="") {
        this.name = name;
        this.type = type;
        this.parent;
        this.children = [];
        this.contents = '';
    }

    add(node){
        var len = this.children.length;
        node.parent = this;
        this.children.push(node);
        return len;
    }

}

module.exports = parser;
