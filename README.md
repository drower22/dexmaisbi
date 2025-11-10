# Dex+ BI Demo

Aplicação standalone do módulo BI com dados mock para demonstração.

## 🚀 Deploy na Vercel

### Passo 1: Importar repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New" → "Project"
3. Importe o repositório `drower22/dexmaisbi`

### Passo 2: Configurar projeto
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Passo 3: Configurar domínio (opcional)
- Após o deploy, vá em "Settings" → "Domains"
- Adicione `demo.usa-dex.com.br`
- Configure o DNS conforme instruções da Vercel

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📦 Estrutura

```
src/
├── modules/bi/          # Módulo BI completo (snapshot)
│   ├── components/      # BILayout, BIFiltersPanel, etc
│   ├── pages/           # BIDashboardPage, StoreDetailPage
│   ├── services/        # datasource.ts, mock.service.ts
│   └── types/           # Tipos TypeScript
├── App.tsx              # Rotas principais
└── main.tsx             # Entry point
```

## 🎨 Tecnologias

- **React 18** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **React Router** (rotas)
- **Lucide React** (ícones)

## 📊 Dados

Todos os dados são **mockados** via `mock.service.ts`. Ideal para demonstração sem necessidade de backend.

## 🔄 Evolução Futura

Quando adicionar lógica real no projeto principal:
- Este repositório permanece com mocks (demo)
- Projeto principal evolui independentemente
- Snapshot isolado garante estabilidade da demo

## 📝 Notas

- **Modo demo**: Sempre ativo (dados mock)
- **Sem autenticação**: Acesso direto ao dashboard
- **Sem Supabase**: Não requer configuração de banco

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

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

export default defineConfig([
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
