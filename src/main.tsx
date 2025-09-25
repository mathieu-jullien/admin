import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Menu from './components/layout/Menu/Menu.tsx'
import Content from './components/layout/Content/Content.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Menu/>
    <Content/>
  </StrictMode>,
)
