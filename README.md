# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
1. Panel Inicio de Sesión
<img width="852" height="481" alt="Image" src="https://github.com/user-attachments/assets/8ddf780c-93a7-4dd6-9306-075d6d42825e" />

2. Ingreso al Dashboard
<img width="852" height="481" alt="Image" src="https://github.com/user-attachments/assets/9f49a731-dfdb-47b4-8552-848984bb0a04" />

3. Registro de Articulos
<img width="852" height="481" alt="Image" src="https://github.com/user-attachments/assets/03915cf4-e6e3-4c54-8276-0795c84db01f" />

4. Nueva solicitud
<img width="852" height="481" alt="Image" src="https://github.com/user-attachments/assets/fc90e45d-6982-49bb-b4ff-21821f5aeb7e" />

<img width="852" height="481" alt="Image" src="https://github.com/user-attachments/assets/36c76eba-5923-4d9a-aa28-10ad8df404fb" />

5. Módulo de Prestamo
<img width="852" height="481" alt="Image" src="https://github.com/user-attachments/assets/6ff63f59-18e0-4949-96fa-6d13bc9d92d7" />

6. Módulo de Usuarios
<img width="852" height="481" alt="Image" src="https://github.com/user-attachments/assets/c7472ce8-6669-45b5-8890-6cd3f93536cf" />

7. Lista de Solicitudes

<img width="852" height="481" alt="Image" src="https://github.com/user-attachments/assets/fa736d9d-8730-4c36-bd85-94849d517592" />

```
