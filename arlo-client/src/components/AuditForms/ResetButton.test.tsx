import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react'
import ResetButton from './ResetButton'
import api from '../utilities'

const apiMock = api as jest.Mock<ReturnType<typeof api>, Parameters<typeof api>>

jest.mock('../utilities')
apiMock.mockImplementationOnce(() => Promise.resolve({}))

describe('ResetButton', () => {
  it('renders', () => {
    const { container } = render(<ResetButton updateAudit={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })

  it('posts to /audit/reset and calls updateAudit', async () => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'reset-button-wrapper')

    const updateAuditMock = jest.fn()

    const { getByText } = render(
      <ResetButton updateAudit={updateAuditMock} />,
      { container: document.body.appendChild(wrapper) }
    )

    fireEvent.click(getByText('Clear & Restart'), { bubbles: true })

    await wait(() => {
      expect(apiMock).toHaveBeenCalledTimes(1)
      expect(updateAuditMock).toHaveBeenCalledTimes(1)
    })
  })
})