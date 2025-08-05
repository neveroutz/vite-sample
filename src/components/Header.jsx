import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">Vite Sample App</h1>
        </div>
        <div className="header-right">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
