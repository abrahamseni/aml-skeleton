import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { wait } from 'utils/test'
import TabsSection from '../tab-section'
import { TAB_SECTION_MOCK_CONTENT } from '../__mocks__'

describe('Tab Section', () => {
  it('should match a snapshot', () => {
    expect(renderComponent(defaultTabsSectionProps)).toMatchSnapshot()
  })

  describe('Handler', () => {
    it('should have 3 header tabs', () => {
      const { getAllByTestId } = renderComponent(defaultTabsSectionProps)

      const tabHeader = getAllByTestId('test.tab.name')
      expect(tabHeader.length).toEqual(3)

      expect(tabHeader[0].childNodes[0].textContent).toMatch(/tab-name-1/i)
      expect(tabHeader[1].childNodes[0].textContent).toMatch(/tab-name-2/i)
      expect(tabHeader[2].childNodes[0].textContent).toMatch(/tab-name-3/i)
    })

    it('tab header should able to click', async () => {
      const { getAllByTestId } = renderComponent(defaultTabsSectionProps)

      const { setActiveTabs } = defaultTabsSectionProps

      const tabHeader = getAllByTestId('test.tab.header')
      const tabContent = getAllByTestId('test.active.tab.content')[0].childNodes[0]

      expect(setActiveTabs).not.toBeCalled()

      fireEvent.click(tabHeader[0])

      expect(tabContent.textContent).toMatch(/test section 3/i)
      expect(setActiveTabs).toBeCalled()

      await wait(0)

      console.log(setActiveTabs.mockReturnValue)
      fireEvent.click(tabHeader[1])
      expect(tabContent.textContent).toMatch(/test section 3/i)

      await wait(0)

      fireEvent.click(tabHeader[2])
      expect(tabContent.textContent).toMatch(/test section 3/i)

      await wait(0)

      fireEvent.click(tabHeader[2])
      expect(tabContent.textContent).toMatch(/test section 3/i)

      expect(setActiveTabs).toBeCalledTimes(4)
    })

    it('should show correct status indicator node type', () => {
      const { getAllByTestId } = renderComponent(defaultTabsSectionProps)

      const statusIndicators = getAllByTestId('test.status.indicator') as HTMLSpanElement[]
      expect(statusIndicators[0].firstChild?.nodeName).toMatch(/span/i)
    })
  })
})

type TabsSectionProps = React.ComponentPropsWithRef<typeof TabsSection>

const mockedActiveTabs = jest.fn().mockReturnValueOnce(2).mockReturnValue(1)

const defaultTabsSectionProps = {
  tabName: 'test-tab-name',
  activeTabs: mockedActiveTabs(),
  setActiveTabs: jest.fn(() => mockedActiveTabs()),
  contents: TAB_SECTION_MOCK_CONTENT,
}

const renderComponent = (props: TabsSectionProps) => {
  return render(<TabsSection {...props} />)
}
