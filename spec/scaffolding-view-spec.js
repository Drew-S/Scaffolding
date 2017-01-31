'use babel';

import ScaffoldingView from '../lib/scaffolding-view';

describe('ScaffoldingView', () => {

  describe('when scaffolding:edit event is triggered', () => {
    it("scaffolding.json should be open in editor", () => {
      ScaffoldingView.edit(() => {
        expect(editor.getPath().toContain('scaffolding.json'));
      });
    });
  });

  describe('Building a tree', () => {
    it("Project should have new files", () => {
      var obj = {
        name: "test",
        root: [
            {
            type: "dir",
            name: "test",
            root: [
              {
                type: "file",
                name: "test.txt"
              }
            ]
          }
        ]
      };
      var root = atom.project.rootDirectories[0].path;
      ScaffoldingView.buildScaffoldingStructure(obj, root, () => {
        expect(atom.project.contains(root + "/test/test.txt")).toBe(true);
      });

    });

  });
});
