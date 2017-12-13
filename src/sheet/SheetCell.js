import { NodeComponent } from 'substance'
import CellValueComponent from '../shared/CellValueComponent'
import { isExpression } from '../shared/cellHelpers'

export default class SheetCell extends NodeComponent {

  didMount() {
    super.didMount()

    const cell = this.props.node
    cell.on('issue:changed', this.rerender, this)
  }

  dispose() {
    super.dispose()

    const cell = this.props.node
    cell.off(this)
  }

  render($$) {
    const cell = this.props.node
    const issueManager = this.context.issueManager
    let el = $$('div').addClass('sc-sheet-cell')

    let cellIssues = issueManager.getCellIssues(cell.id)
    if(cellIssues.length > 0) {
      if (cellIssues.length === 1 && cellIssues[0].severity === 4) {
        el.addClass('sm-issue sm-passed')
      } else {
        el.addClass('sm-issue sm-error')
      }
    }

    el.append(this._renderContent($$, cell))
    return el
  }

  _renderContent($$, cell) {
    let text = cell.text()
    let isExpressionCell = isExpression(text)

    if(isExpressionCell) {
      const displayMode = this._getDisplayMode()
      if(displayMode === 'maximum') {
        return $$('div').addClass('se-function-cell').append(
          $$(CellValueComponent, {cell: cell}).ref('value'),
          $$('div').addClass('sc-equation').append(text)
        )
      } else {
        return $$('div').addClass('sc-text-content').append(
          $$(CellValueComponent, {cell: cell}).ref('value')
        )
      }
    } else {
      return $$('div').addClass('sc-text-content').text(text)
    }
  }

  getContent() {
    return this.props.node.getText()
  }

  _getDisplayMode() {
    let sheetState = this.props.node.getDocument().getState()
    return sheetState.displayMode
  }
}
