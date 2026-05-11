function Nav({ currentPage, setCurrentPage }) {
    return (
        <nav>
            <button onClick={() => setCurrentPage('game')}>Game</button>
            <button onClick={() => setCurrentPage('storage')}>Storage</button>
        </nav>
    )
}

export default Nav
