# Scaffolding

Scaffolding is a package used to create a project folder and file hierarchy with the click of a button.

![Scaffolding](https://github.com//Drew-S/Scaffolding/blob/69f4b9a8e7b0f616c00586a4839c85971ad7d303/preview/preview.png)

Added a separate file hierarchy system for splitting the main file up into smaller files for better management.

__I still need to actually develop some unit testing__

## Structure

Edit the scaffolding.cson file to include your folder file hierarchy:

You can edit this by using the command:
```
"ctrl-alt-o": "scaffolding:edit"
```

or by clicking the edit button in the scaffolding panel.

When you click on your scaffolding name in the list the hierarchy is built in the current project root directory.

```CSON
[
  {
    name: "Scaffolding"
    root: [
      {
        type: "dir"
        name: "folder"
        root: [
          {
            type: "file"
            name: "file.txt"
          }
        ]
      }
      {
        type: "dir"
        name: "empty"
      }
      {
        type: "file"
        name: "file_with_stuff.txt"
        contents: "stuff"
      }
      {
        type: "file"
        name: "file_with_multi-line_stuff.txt"
        contents: '''
          stuff
          more stuff
        '''
      }
    ]
  }
  {
    name: "item 2"
    rootUrl: './file.txt'
    ...
  }
]
```

## Separate file structure

You can setup an external root file using the `rootUrl` option instead of using `root`, this is a relative path to the file from the default scaffolding.cson file. This is designed to store the other files in the same directory as the main scaffolding file.

You can optionally link a plain text hierarchy file `.txt`, `.cson`, or `.json` file

### CSON

```CSON
{
    name: "name"
    root: [
        {
            name: "name"
            type: "file|dir"
            root: [

            ]
        }
    ]
}
```

### JSON

```JSON
{
    "name": "name",
    "root": [
        {
            "name": "name",
            "type": "file|dir",
            "root": [

            ]
        }
    ]
}
```

### Plain text

```
#Name
folder/
    file.txt
        content
        content
            indented content
    folder2/
```

The first line is optionally the name of the hierarchy denoted by starting the line with `#`.

Folders require a `/` at the end of the line to denote a folder.

The structure is indent sensitive. The file needs to be indented by 4 spaces ` ` ` ` ` ` ` `, or a tab `\t`. Indenting inside a file, such as the example `file.txt` is ignored past the first indent and will show up in the contents of the file:

file.txt:

```
content
content
    indented content
```

## keymapping

This package uses the default keymapping from package generation:

Toggle scaffolding panel:

```
"ctrl-alt-o": "scaffolding:toggle"
```
