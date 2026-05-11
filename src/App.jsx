import { useState } from 'react'
import Nav from './components/Nav'
import Game from './pages/Game'
import Storage from './pages/Storage'

function App() {
   const [currentPage, setCurrentPage] = useState('game')
   
   return (
       <div>
           <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
           {currentPage === 'game' && <Game />}
           {currentPage === 'storage' && <Storage />}
       </div>
   )
}

export default App
