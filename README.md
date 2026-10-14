# Site da Zyvora

Página de apresentação da Zyvora para lanchonetes, hamburguerias e pizzarias. HTML, CSS e JavaScript puros: não precisa instalar nada nem compilar.

## Arquivos

- `index.html`: página principal (seções, textos, planos, dúvidas)
- `politica-de-privacidade.html` e `termos-de-uso.html`: páginas legais
- `assets/config.js`: **WhatsApp, Instagram, e-mail, razão social e CNPJ**. Edite aqui e todos os botões se atualizam.
- `assets/main.js`: cardápio de demonstração e formulário (abre o WhatsApp com a mensagem pronta)
- `assets/styles.css`: cores e visual

## Ver no computador

```sh
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar de graça

Qualquer hospedagem de site estático serve. Duas opções simples:

- **Netlify**: em app.netlify.com, "Add new site" → "Import from GitHub" → escolha o repositório `zy.site2`. Deixe o *build command* vazio e o *publish directory* como `.` (raiz).
- **Vercel**: em vercel.com, "Add New Project" → importe o repositório `zy.site2`, escolha o *Framework Preset* "Other" e publique.

Depois é possível ligar um domínio próprio (ex.: `zyvora.com.br`, registrado no registro.br).
