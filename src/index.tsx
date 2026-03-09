import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import { RegionData } from './types/types'
import { initRegions } from './utils/initRegions'
import { Provider } from './store/store'

const regions: RegionData[] = initRegions()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <Provider regions={regions}>
      <App />
    </Provider>
  </React.StrictMode>
)