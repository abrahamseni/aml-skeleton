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
  pageHandler: (type: 'forward' | 'backward') => void
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
      <div>{contents[activeTabs].content}</div>
    </>
  )
}

export default TabsSection

/**
 * Will be better if we use Callback
 */
interface GenerateTableContents extends Omit<TabsSectionProps, 'pageHandler'> {}

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
          checked={activeTabs === index ? !!true : !!false}
          onClick={() => setActiveTabs(index)}
        />
        <label htmlFor={`tab-${index}-fw`} className="el-tabs-label">
          <span className="el-tabs-item">
            <FlexContainer isFlexAlignCenter isFlexJustifyEnd>
              <div>
                <BodyText hasNoMargin hasGreyText hasBoldText={activeTabs === index ? true : false}>
                  {v.name}
                </BodyText>
              </div>
              <div className={elMl6}>
                <StatusIndicator intent={v.status ? 'success' : 'neutral'} />
              </div>
            </FlexContainer>
          </span>
        </label>
      </React.Fragment>
    )
  })
}