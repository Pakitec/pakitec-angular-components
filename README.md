# Pakitec Angular Components

Biblioteca Angular 22 com os componentes e tokens visuais reutilizáveis do Pakitec Amora.

Catálogo visual: https://leonardoaa.github.io/pakitec-angular-components/

## Uso

```bash
npm install github:Pakitec/pakitec-angular-components#v0.1.0
```

O pacote é distribuído exclusivamente pelo GitHub. Fixe sempre uma tag de
versão; não use `master` como dependência.

Importe o tema global no `styles.scss` da aplicação:

```scss
@use 'pakitec-angular-components/styles/pakitec-theme';
```

Os componentes são standalone e podem ser importados diretamente:

```ts
import { PakiButton, PakiInput } from 'pakitec-angular-components';
```

## Storybook

```bash
npm run storybook
npm run build-storybook
```

O toolbar do Storybook permite alternar entre os temas claro e escuro.

## Componentes

- Badge
- Button
- Card
- Combobox
- Date
- Input
- Module tabs
- Page header
- Pagination
- Select
- Switch
- Textarea
