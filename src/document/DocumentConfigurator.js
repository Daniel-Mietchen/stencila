import { Configurator, BasePackage } from 'substance'

import TitlePackage from './nodes/title/TitlePackage'
import SummaryPackage from './nodes/summary/SummaryPackage'
import HeadingPackage from './nodes/heading/HeadingPackage'
import ParagraphPackage from './nodes/paragraph/ParagraphPackage'
import EmphasisPackage from './nodes/emphasis/EmphasisPackage'
import StrongPackage from './nodes/strong/StrongPackage'
import SubscriptPackage from './nodes/subscript/SubscriptPackage'
import SuperscriptPackage from './nodes/superscript/SuperscriptPackage'
import CodePackage from './nodes/code/CodePackage'
import LinkPackage from './nodes/link/LinkPackage'
import ListPackage from './nodes/list/ListPackage'
// import MathPackage from './nodes/math/MathPackage'

// import ImagePackage from './nodes/image/ImagePackage'
import BlockquotePackage from './nodes/blockquote/BlockquotePackage'
import CodeblockPackage from './nodes/codeblock/CodeblockPackage'

// import InputPackage from './nodes/input/InputPackage'
// import SelectPackage from './nodes/select/SelectPackage'
// import OutputPackage from './nodes/output/OutputPackage'
// import ExecutePackage from './nodes/execute/ExecutePackage'
// import IncludePackage from './nodes/include/IncludePackage'
// import PrintPackage from './nodes/print/PrintPackage'

import DefaultPackage from './nodes/default/DefaultPackage'

// QUESTION: What does the SessionPackage do?
// import SessionPackage from '../shared/nodes/session/SessionPackage'

import ToolsPackage from './tools/ToolsPackage'

/**
 * A "configurator" for a document.
 *
 * Uses the Substance package mechanism to reduce repetition.
 * See `substance/util/AbstractConfigurator` for inherited methods
 * used by `DocumentHTMLImporter`, `DocumentEditor` etc
 *
 * @class      DocumentConfigurator (name)
 */
class DocumentConfigurator extends Configurator {

  constructor () {
    super()

    // Define the schema (used by `getSchema()` to generate a `DocumentSchema` based on this
    // and the nodes added below by imports)
    this.defineSchema({
      name: 'stencila-document',
      defaultTextType: 'paragraph'
    })

    // At present, need at least the 'default' tool group before adding tools via imports below
    this.addToolGroup('default')

    this.import(BasePackage)
    // Import node packages, in "order of appearance"
    this.import(TitlePackage)
    this.import(SummaryPackage)
    this.import(HeadingPackage)
    this.import(ParagraphPackage)
    this.import(EmphasisPackage)
    this.import(StrongPackage)
    this.import(SubscriptPackage)
    this.import(SuperscriptPackage)
    this.import(CodePackage)
    this.import(LinkPackage)
    this.import(ListPackage)
    
    // this.import(MathPackage)
    // this.import(ImagePackage)
    this.import(BlockquotePackage)
    this.import(CodeblockPackage)

    // TODO: this currently conflicts with Substance
    // input package, imported by the BasePackage.
    // this.import(InputPackage)
    // this.import(SelectPackage)
    // this.import(OutputPackage)
    // this.import(ExecutePackage)
    // this.import(IncludePackage)
    // this.import(PrintPackage)
    // this.import(SessionPackage)
    this.import(DefaultPackage)

    // Import UI packages
    this.import(ToolsPackage)
  }

  /**
   * Gets the file client
   *
   * Method required by `AbstractEditor._initialize`
   *
   * @return     {<type>}  The file client.
   */
  getFileClient () {
    return null
  }

  /**
   * Gets the save handler.
   *
   * Method required by `AbstractEditor._initialize`
   *
   * @return     {<type>}  The save handler.
   */
  getSaveHandler () {
    return null
  }
}

export default DocumentConfigurator
