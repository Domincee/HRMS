  function toggleTheme() {
      document.documentElement.classList.toggle('dark');
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);

      const btnText = document.querySelector('.btn-theme p');
      btnText.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }

    document.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('theme');
      const isDark = savedTheme === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
      }

      const btnText = document.querySelector('.btn-theme p');
      btnText.textContent = isDark ? 'Light' : 'Dark';
    });