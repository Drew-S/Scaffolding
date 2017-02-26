'use babel';

import Scaffolding from '../lib/scaffolding';

describe('Scaffolding', () => {
    describe('Before activation', () => {
        it('Should not exist yet', () => {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmine.attachToDOM(workspaceElement);

            expect(workspaceElement.querySelector('.scaffolding')).not.toExist();
        });
    });

    describe('Scaffolding command tests', () => {
        let workspaceElement, scaffolding, activationPromise;

        beforeEach(() => {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmine.attachToDOM(workspaceElement);

            atom.commands.dispatch(workspaceElement, "scaffolding:test");

            waitsForPromise(() => {
                return atom.packages.activatePackage("scaffolding");
            });

        });

        describe('Running command scaffolding:toggle', () => {

            it('Should be visible after toggling', () => {

                expect(workspaceElement.querySelector('.scaffolding')).toExist();
                expect(workspaceElement.querySelector('.scaffolding')).toBeVisible();

            });

            it('Should not be visible after toggling twice', () => {
                atom.commands.dispatch(workspaceElement, "scaffolding:toggle");

                expect(workspaceElement.querySelector('.scaffolding')).toExist();
                expect(workspaceElement.querySelector('.scaffolding')).not.toBeVisible();
            });
        });
    });
});
