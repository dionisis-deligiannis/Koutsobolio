import React from 'react'
import {Link} from "react-router-dom"

function Navbar() {
  return (
    <nav>
        <h3>
            <Link to="/">Koutsobolio</Link>
        </h3>
        <div>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </div>
    </nav>
  )
}

export default Navbar