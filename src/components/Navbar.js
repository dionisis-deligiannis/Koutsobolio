import React from 'react'
import {Link} from "react-router-dom"

function Navbar() {
  return (
    <nav>
        <h3>
            <Link to="/">Koutsobolio</Link>
        </h3>
    </nav>
  )
}

export default Navbar