import { Command } from 'substance'
import { InsertNodeCommand } from 'substance-texture'
import { getCellState } from '../shared/cellHelpers'
import { ERROR } from '../engine/CellState'

export class SetLanguageCommand extends Command {

  getCommandState({ selection, editorSession }) {
    let doc = editorSession.getDocument()
    if (selection.isNodeSelection()) {
      let nodeId = selection.getNodeId()
      let node = doc.get(nodeId)
      if (node.type === 'cell') {
        let language = node.find('source-code').attr('language')
        return {
          cellId: node.id,
          newLanguage: this.config.language,
          disabled: false,
          active: this.config.language === language
        }
      }
    }
    return { disabled: true }
  }

  execute({ editorSession, commandState }) {
    let { cellId, newLanguage, disabled } = commandState
    if (!disabled) {
      editorSession.transaction((tx) => {
        let cell = tx.get(cellId)
        let sourceCode = cell.find('source-code')
        sourceCode.attr({ language: newLanguage })
      })
    }
  }
}

export class ToggleAllCodeCommand extends Command {

  /*
    Always enabled
  */
  getCommandState() {
    return {
      disabled: false,
      active: false
    }
  }

  /*
    Returns all cell components found in the document
  */
  _getCellComponents(params) {
    let editor = params.editorSession.getEditor()
    return editor.findAll('.sc-cell')
  }

  execute(params) {
    let cellComponents = this._getCellComponents(params)
    let sel = params.editorSession.getSelection()
    cellComponents.forEach((cellComponent) => {
      cellComponent.extendState({
        hideCode: this.config.hideCode
      })
    })
    params.editorSession.setSelection(sel)
  }
}


export class HideCellCodeCommand extends Command {

  /*
    Always enabled
  */
  getCommandState({ selection, editorSession }) {
    let doc = editorSession.getDocument()
    if (selection.isNodeSelection()) {
      let nodeId = selection.getNodeId()
      let node = doc.get(nodeId)
      if (node.type === 'cell') {
        return {
          cellId: node.id,
          disabled: false
        }
      }
    }
    return { disabled: true }
  }

  /*
    Returns all cell components found in the document
  */
  _getCellComponents(params) {
    let editor = params.editorSession.getEditor()
    return editor.findAll('.sc-cell')
  }

  execute({ commandState, editorSession }) {
    const { cellId } = commandState
    let editor = editorSession.getEditor()
    let cellComponent = editor.find(`[data-id=${cellId}] .sc-cell`)
    cellComponent.setState({
      hideCode: true
    })
  }
}

export class CodeErrorsCommand extends Command {
  getCommandState({ selection, editorSession }) {
    let doc = editorSession.getDocument()
    // console.log('selection', selection)
    if (selection.isPropertySelection()) {
      let nodeId = selection.getNodeId()
      let node = doc.get(nodeId)
      if (node.type === 'source-code') {
        let cellNode = node.parentNode
        let cellState = getCellState(cellNode)

        if (cellState.status === ERROR) {
          return {
            disabled: false,
            messages: cellState.messages
          }
        }
      }
    }

    return {
      disabled: true
    }
  }

  execute(params) { } // eslint-disable-line
}


export class InsertCellCommand extends InsertNodeCommand {

  createNode(tx) {
    let cell = tx.createElement('cell')
    cell.append(
      tx.createElement('source-code').attr('language', 'mini'),
      tx.createElement('output').attr('language', 'json')
    )
    return cell
  }
}