import React from 'react';
import './Header.css';
const Header = () => {
  return (
    <header className  = "Header">
      헤더입니다.
      <nav>
                    <ul>
                        <li><a href="#">Food</a></li>
                        <li><a href="">Hobby</a></li>
                        <li><a href="">Game</a></li>
                        <li><a href="">Dream</a></li>
                    </ul>
                </nav>
      <hr/>
    </header>
  );
};

export default Header;