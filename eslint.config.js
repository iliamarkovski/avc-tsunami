import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "sort-imports": ["error", {
        "ignoreCase": false,
        "ignoreDeclarationSort": false,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": false
      }],
      "import/order":
        [
          1,
          {
            "groups": [
              "external",
              "builtin",
              "internal",
              "sibling",
              "parent",
              "index"
            ],
            "pathGroups": [
              {
                "pattern": "components",
                "group": "internal"
              },
              {
                "pattern": "common",
                "group": "internal"
              },
              {
                "pattern": "routes/ **",
                "group": "internal"
              },
              {
                "pattern": "assets/**",
                "group": "internal",
                "position": "after"
              }
            ],
            "pathGroupsExcludedImportTypes":
              ["internal"],
            "alphabetize": {
              "order": "asc",
              "caseInsensitive": true
            }
          }
        ]
    },

  },
)
