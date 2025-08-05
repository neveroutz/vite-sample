import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme, isLight } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`현재 ${isLight ? '라이트' : '다크'} 모드, ${isLight ? '다크' : '라이트'} 모드로 변경`}
      title={`${isLight ? '다크' : '라이트'} 모드로 변경`}
    >
      <span className="theme-icon">
        {isLight ? (
          // 달 아이콘 (다크 모드로 변경 시)
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.4 13.7C20.6 14.5 19.6 15.1 18.4 15.4C17.2 15.7 16 15.6 14.9 15.1C13.8 14.6 12.9 13.8 12.3 12.8C11.7 11.8 11.4 10.6 11.5 9.4C11.6 8.2 12 7.1 12.7 6.2C13.4 5.3 14.3 4.6 15.4 4.3C14.1 3.9 12.7 3.9 11.4 4.3C10.1 4.7 8.9 5.5 8 6.5C7.1 7.5 6.5 8.7 6.2 10C5.9 11.3 6 12.7 6.4 13.9C6.8 15.1 7.5 16.2 8.5 17.1C9.5 18 10.7 18.6 12 18.9C13.3 19.2 14.7 19.1 15.9 18.7C17.1 18.3 18.2 17.6 19.1 16.6C20 15.6 20.6 14.4 20.9 13.1C21.1 13.3 21.3 13.5 21.4 13.7Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          // 태양 아이콘 (라이트 모드로 변경 시)
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path
              d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className="theme-text">{isLight ? '다크' : '라이트'}</span>
    </button>
  );
}

export default ThemeToggle;
