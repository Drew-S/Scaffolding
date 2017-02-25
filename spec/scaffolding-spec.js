'use babel';

import Scaffolding from '../lib/scaffolding';

describe('Scaffolding', () => {
    let workspaceElement, scaffolding, activationPromise;

    beforeEach(() => {
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);

        console.log(atom.packages.getActivePackage("scaffolding"));

        waitsForPromise(() => {
            return atom.packages.activatePackage("scaffolding");
        });

    });

    describe('Running command scaffolding:toggle', () => {
        it('Should not be visible yet', () => {

            expect(workspaceElement.querySelector('.scaffolding')).not.toExist();

        });

        it('Should be visable after toggling', () => {
            atom.commands.dispatch(workspaceElement, "scaffolding:toggle");

            expect(workspaceElement.querySelector('.scaffolding')).toExist();
            expect(workspaceElement.querySelector('.scaffolding')).toBeVisible();

        });
    });
});
