import React from 'react'
import { TabsSectionProps } from '../tab-section'

export const TAB_SECTION_MOCK_CONTENT: TabsSectionProps['contents'] = [
  {
    name: 'tab-name-1',
    content: <p>test section 1</p>,
    status: true,
  },
  {
    name: 'tab-name-2',
    content: <p>test section 2</p>,
    status: true,
  },
  {
    name: 'tab-name-3',
    content: <p>test section 3</p>,
    status: false,
  },
]
