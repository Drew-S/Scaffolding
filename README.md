# Scaffolding

Scaffolding is a package used to create a project folder and file hierarchy with the click of a button.

![Scaffolding](/preview/preview.png)

## Structure

Simply edit the scaffolding.json file to include your folder file hierarchy:

You can edit this by using the command:
```
"ctrl-alt-o": "scaffolding:edit"
```

or by clicking the edit button in the scaffolding panel.

When you click on your scaffolding name in the list it is created in the current project root directory.

```json
[
  {
    "name": "Scaffolding",
    "root": [
      {
        "type": "dir",
        "name": "folder",
        "root": [
          {
            "type": "file",
            "name": "file.txt"
          }
        ]
      },
      {
        "type": "dir",
        "name": "empty"
      },
      {
        "type": "file",
        "name": "file_with_stuff.txt",
        "contents": "stuff"
      }
    ]
  },
  {
    "name": "item 2",
    ...
  }
]
```

## keymapping

This package uses the default keymapping from package generation:

Toggle scaffolding panel:

```
"ctrl-alt-o": "scaffolding:toggle"
```

### project

at [https://github.com/Drew-S/Scaffolding](https://github.com/Drew-S/Scaffolding)
