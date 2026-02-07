
const NavBar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <h1 className="font-bold text-xl">SoundRhythm</h1>
      <nav>
        <ul className="flex gap-2 text-xs">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </div>
  )
}

export default NavBar