import { styled } from '@linaria/react'

export const ReportTable = styled.table`
  border-collapse: collapse;

  thead {
    tr {
      th {
        text-align: left;
        padding: 0.5rem 1rem;
        font-weight: 600;
      }
    }
  }
  tr:nth-child(odd) {
    background-color: var(--intent-secondary-light);
  }
  td {
    padding: 0.5rem 1rem;
  }
`

export const ReportWrap = styled.div`
  margin: auto;
  @media print {
    & {
      background-color: white;
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      margin: 0;
      padding: 40px;
      font-size: 14px;
      line-height: 18px;
    }
  }
`
