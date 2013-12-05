define([
  '../../../api/command'
], function (
  Command
) {

  'use strict';

  return function () {
    return function (scribe) {
      var redoCommand = new Command(scribe, 'redo');

      redoCommand.execute = function () {
        var historyItem = scribe.undoManager.redo();

        if (typeof historyItem !== 'undefined') {
          scribe.restoreFromHistory(historyItem);
        }
      };

      redoCommand.queryEnabled = function () {
        return scribe.undoManager.position < scribe.undoManager.stack.length - 1;
      };

      scribe.patchedCommands.redo = redoCommand;

      scribe.el.addEventListener('keydown', function (event) {
        if (event.shiftKey && event.metaKey && event.keyCode === 90) {
          event.preventDefault();
          redoCommand.execute();
        }
      });
    };
  };

});