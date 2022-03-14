import React from 'react'
import { elMl6, FlexContainer, BodyText, StatusIndicator, Intent } from '@reapit/elements'

interface ContentType {
  name: string
  content: React.ReactElement
  status?: Intent
}

interface TabsSectionProps {
  tabName: string
  contents: ContentType[]
}

interface TabsSectionRefHandler {
  nextHandler: () => void
  prevHandler: () => void
}

const TabsSection = React.forwardRef<TabsSectionRefHandler, TabsSectionProps>(
  ({ tabName, contents }, ref): React.ReactElement => {
    const [activeTabs, setActiveTabs] = React.useState<number>(0)

    React.useImperativeHandle(ref, () => ({
      nextHandler() {
        nextHandlerProps()
      },
      prevHandler() {
        prevHandlerProps()
      },
    }))

    const nextHandlerProps = (): void => {
      if (activeTabs < contents.length - 1) setActiveTabs((prev) => prev + 1)
    }

    const prevHandlerProps = (): void => {
      if (activeTabs > 0) setActiveTabs((prev) => prev - 1)
    }

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
  },
)

export default TabsSection

interface GenerateTableContents extends TabsSectionProps {
  activeTabs: number
  setActiveTabs: React.Dispatch<React.SetStateAction<number>>
}

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
                <StatusIndicator intent={v.status ?? 'neutral'} />
              </div>
            </FlexContainer>
          </span>
        </label>
      </React.Fragment>
    )
  })
}
