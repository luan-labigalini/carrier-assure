import { CarriersDashboard } from '@/app/components/carriers'
import { mockCarrierHistory } from '@/app/lib/schemas'
import { render, screen } from '@testing-library/react'

const columns = [
        {
            title: "Legal Name",
            dataIndex: "legal_name",
            alignn: 'center',
        },
        {
            title: "DOT Number",
            dataIndex: "dot_number",
            alignn: 'center',
        },
        {
            title: "Score",
            dataIndex: "score",
            alignn: 'center',
            
        },
        {
            title: "Authority Status",
            dataIndex: "authority_status",
            alignn: 'center',
        }
]


describe('DashboardCarriers', () => {

  it('renders the column headers', () => {
    render(<CarriersDashboard 
        dataSource={mockCarrierHistory} 
        pagination={undefined}
        columns={columns}
        />)

    expect(screen.getByText('Legal Name')).toBeInTheDocument()
    expect(screen.getByText('DOT Number')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Authority Status')).toBeInTheDocument()
  })

  it('renders one row per mock item', () => {
    render(<CarriersDashboard 
        dataSource={mockCarrierHistory} 
        pagination={undefined}
        columns={columns}
        />)

    // Ant Design renders each row as role="row" — first row is the header
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(mockCarrierHistory.length + 1) // +1 for the header row
  })


  it('renders an empty table when data is empty', () => {
    render(<CarriersDashboard 
        dataSource={[]}         
        pagination={undefined}
        columns={columns}
        />)

    expect(screen.getByText(/no data/i)).toBeInTheDocument()
  })

})