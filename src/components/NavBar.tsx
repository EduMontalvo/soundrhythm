
const NavBar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex">
        <p className="text-xl">Sound</p>
        <p className="text-emerald-500 text-xl">Rhythm</p>
      </div>
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