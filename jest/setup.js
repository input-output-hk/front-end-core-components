import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })
Object.defineProperty(window, 'localStorage', { value: { setItem: jest.fn(), getItem: jest.fn() } })
Object.defineProperty(window, 'navigator', { value: { language: 'de-DE' } })

afterEach(() => {
  window.localStorage.setItem.mockReset()
  window.localStorage.getItem.mockReset()
})
