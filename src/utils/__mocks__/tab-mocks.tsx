import React from 'react'
import { GenerateTabsContentResult } from 'components/ui/search/checklist-detail'

export const TAB_SECTION_MOCK_CONTENT: GenerateTabsContentResult[] = [
  {
    content: <p>test section 1</p>,
    status: true,
  },
  {
    content: <p>test section 2</p>,
    status: true,
  },
  {
    content: <p>test section 3</p>,
    status: false,
  },
]
