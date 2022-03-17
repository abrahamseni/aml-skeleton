import React from 'react'
import { elMl6, FlexContainer, BodyText, StatusIndicator } from '@reapit/elements'

export interface TabsSectionProps {
  tabName: string
  contents: {
    name: string
    content: React.ReactElement
    status?: boolean
  }[]
  activeTabs: number
  setActiveTabs: React.Dispatch<React.SetStateAction<number>>
}

const TabsSection: React.FC<TabsSectionProps> = ({
  activeTabs,
  setActiveTabs,
  tabName,
  contents,
}): React.ReactElement => {
  return (
    <>
      <div className="el-tabs-full-width el-tabs-wrap">
        <div className="el-tabs-options-wrap">
          {generateTableContent({ activeTabs, setActiveTabs, contents, tabName })}
        </div>
        <div className="el-tabs-footer"></div>
      </div>
      <div data-testid="test.active.tab.content">{contents[activeTabs].content}</div>
    </>
  )
}

export default TabsSection

/**
 * Will be better if we use Callback
 */
interface GenerateTableContents extends TabsSectionProps {}

const generateTableContent = (props: GenerateTableContents): React.ReactNode => {
  const { activeTabs, setActiveTabs, contents, tabName } = props

  return contents.map((v, index) => {
    return (
      <React.Fragment key={index}>
        <input
          readOnly
          id={`tab-${index}-fw`}
          name={tabName}
          type="radio"
          className="el-tabs"
          value={`tab-${index}-fw`}
          checked={activeTabs === index ? true : false}
          onClick={() => setActiveTabs(index)}
          data-testid="test.tab.header"
        />
        <label htmlFor={`tab-${index}-fw`} className="el-tabs-label">
          <span className="el-tabs-item">
            <FlexContainer isFlexAlignCenter isFlexJustifyEnd>
              <div data-testid="test.tab.name">
                <BodyText hasNoMargin hasGreyText hasBoldText={activeTabs === index ? true : false}>
                  {v.name}
                </BodyText>
              </div>
              <div data-testid="test.status.indicator" className={elMl6}>
                <StatusIndicator intent={v.status ? 'success' : 'neutral'} />
              </div>
            </FlexContainer>
          </span>
        </label>
      </React.Fragment>
    )
  })
}
