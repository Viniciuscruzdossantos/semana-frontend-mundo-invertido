
[README.md](https://github.com/user-attachments/files/34538769/README.md)
<p align="center">
  <img width="300" src="./assets/images/banner/logo.svg" alt="Logo Mundo Invertido">
</p>

# 🔴 Mundo Invertido | Semana Front-end

Uma página inspirada em **Stranger Things**, feita com **HTML, CSS e JavaScript puro**, sem frameworks e sem nenhuma biblioteca de fora. Um botão inverte o site entre o **Mundo Normal** e o **Mundo Invertido**, mudando cores, fontes, imagens, personagens e música.

> 🎉 **Parabéns aos criadores do projeto original** pela ideia e pela base tão bem pensada para quem está aprendendo front-end. Esta versão nasceu dela e mantém a mesma estrutura de arquivos. Veja os créditos no final.

*Uma jornada para quem não tem medo do desconhecido. O caminho para o Mundo Invertido é incerto, repleto de obstáculos e perigos. Porém, a recompensa é grande: salvar Hawkings e o mundo todo das garras de Vecna. Você está preparado(a)?*

---

## 🎮 Como usar

1. Abra a página e veja o **Mundo Normal**.
2. Clique em **Inverter Mundos** (ou aperte a tecla **I**) para entrar no Mundo Invertido.
3. Clique no botão **♪** para ligar ou desligar a música.
4. Role a página para ver o trailer, a galeria e o formulário do Clube de D&D.
5. No formulário, preencha seus dados ou clique em **Rolar D20** para sortear o seu level.
6. Clique em **Me inscrever** e veja o seu nome na lista **A party de Hawkins**.

### Os controles

| Controle | O que faz |
|---|---|
| **Inverter Mundos / tecla I** | Alterna entre o Mundo Normal e o Mundo Invertido |
| **♪** | Liga ou desliga a música |
| **Rolar D20** | Sorteia um level de 1 a 20, com mensagens especiais para 20 e para 1 |
| **Me inscrever** | Valida o formulário e salva a inscrição no navegador |

---

## ✨ O que a página tem

- **Troca de mundos animada**: a tela pisca e treme, as imagens se invertem, o texto pisca e aparecem esporos flutuando.
- **Dois temas completos** (claro e escuro), com cores, fontes, personagens e lâmpadas diferentes em cada um.
- **Música com transição** (fade) entre os dois mundos e botão para ligar ou desligar o som.
- **Preferências salvas**: o tema e o som ficam gravados no navegador.
- **Trailer e galeria** de Stranger Things, com efeito ao passar o mouse.
- **Formulário do Clube de D&D** com validação, dado D20 e lista "A party de Hawkins" com as últimas inscrições.
- **Lâmpadas piscando**, animações ao rolar a página e **layout responsivo** para celular.

---

## 🔍 Como funciona (explicação simples)

### Como os dois mundos funcionam
Cada mundo é uma **classe CSS** no `body`: `light-theme` ou `dark-theme`. Cada classe define as **variáveis** do tema (cores, fonte, imagens). Ao clicar no botão, o `main.js` troca a classe, e todo o visual muda junto, porque o CSS inteiro usa essas variáveis.

```css
/*** VARIABLES & THEMES ***/

:root {
  --primary-color: #cf0f0f;
  --primary-color-contrast: #ffffff;
  --field-background-color: #000;
}

.light-theme {
  --page-background: linear-gradient(180deg, #ffffff 0%, #ffffff 65%, rgba(255, 255, 255, 0.75) 100%);
  --header-background-color: #e3e3e3;
  --highlight-color: #000000;
  --featured-font-family: "Archivo", sans-serif;
  --character-top-image-src: url("../images/characters/kids-on-the-bike.svg");
  --character-top-image-color: #ffffff;
  --character-bottom-image-src: url("../images/characters/inverted-world-monster.svg");
  --character-bottom-image-color: #e5e5e5;
  --background-lamp-image: url("../images/backgrounds/lamps.png");
  --footer-background-color: #b5bbbf;
}

.dark-theme {
  --page-background: linear-gradient(180deg, #050000 0%, #130404 65%, rgba(19, 1, 1, 0.75) 100%);
  --header-background-color: #220f0f;
  --highlight-color: #ffffff;
  --featured-font-family: "Rubik Glitch", sans-serif;
  --character-bottom-image-src: url("../images/characters/kids-on-the-bike.svg");
  --character-bottom-image-color: rgba(255, 255, 255, 0.1);
  --character-top-image-src: url("../images/characters/inverted-world-monster.svg");
  --character-top-image-color: #000;
  --background-lamp-image: url("../images/backgrounds/lamps-inverted.png");
  --footer-background-color: #000;
}
```

### Os arquivos

| Arquivo | O que faz |
|---|---|
| `index.html` | Monta a página: cabeçalho, seções, trailer, galeria, formulário e rodapé. |
| `assets/css/styles.css` | Todo o visual: os dois temas, o layout, as animações e o modo responsivo. |
| `assets/js/main.js` | Controla tudo: troca de tema, música, esporos, dado D20, validação e inscrições. |
| `assets/images` | Personagens, fundos, banner e imagens do conteúdo. |
| `assets/musics` | As trilhas do Mundo Normal e do Mundo Invertido. |

### Onde ficam as inscrições
Os dados do formulário são guardados no **navegador** de cada pessoa (`localStorage`), não em um banco compartilhado. Para usar o Firebase, basta trocar o corpo da função `saveSubscription()` no `main.js`, onde há um comentário indicando o lugar.

---

## 🧠 O que dá para aprender com este projeto

- Estruturar uma página com HTML **semântico** e **acessível**.
- Trocar de tema usando **variáveis CSS** e classes no `body`.
- Fazer animações só com CSS: `@keyframes`, `transition`, pseudo-elementos e filtros.
- Posicionar elementos com `flexbox`, `grid` e `position`.
- Manipular o DOM e reagir a cliques e ao teclado com `addEventListener`.
- Validar um formulário e guardar dados com `localStorage`.
- Usar `IntersectionObserver` para animar seções ao rolar a página.
- Tocar áudio com JavaScript, com *fade* entre as faixas.

### Assuntos abordados na Semana Front-end

- **HTML:** estruturação da página, semântica, acessibilidade, web scraping e SEO
- **CSS:** posicionamentos, pseudo-elementos, pseudo-classes, flexbox e animações
- **JavaScript:** introdução ao JavaScript, manipulação do DOM, introdução ao Firebase e integração com o Firebase

▶️ **Lives da Semana Front-end:** [Dia 01](https://www.youtube.com/watch?v=FZgIQUDn8zo) | [Dia 02](https://www.youtube.com/watch?v=WHbhgxJLbN4)

---

## 🛠️ Tecnologias usadas

| Tecnologia | Para que serve neste projeto |
|---|---|
| **HTML** | Estrutura da página, do formulário e do trailer. |
| **CSS** | Todo o visual: temas, personagens, lâmpadas, galeria, formulário e animações. |
| **JavaScript** | A lógica: trocar de mundo, tocar a música, rolar o D20 e salvar as inscrições. |
| **Google Fonts** | As fontes Archivo e Rubik Glitch. |

---

## ▶️ Como rodar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador, com duplo clique.

Se você usa o **VS Code**, também pode clicar em **Go Live** (extensão *Live Server*).

> 💡 **Importante:** as fontes e o trailer do YouTube precisam de **internet**. Sem conexão, a página continua funcionando, mas com uma fonte padrão e sem o vídeo.

---

## 📁 Estrutura do projeto

```
├── index.html
├── README.md
└── assets
    ├── css
    │   └── styles.css
    ├── js
    │   └── main.js
    ├── images
    │   ├── backgrounds
    │   ├── banner
    │   ├── characters
    │   ├── content
    │   └── footer
    └── musics
        ├── normal-world.mpeg
        └── inverted-world.mpeg
```

---

## 🚀 O que foi melhorado em relação ao original

**Mantido do original:** a mesma estrutura de arquivos, os dois temas com as mesmas variáveis CSS, as fontes, os personagens, as imagens, as músicas e todas as seções.

**Corrigido:**
- Um `span` que estava mal fechado e atributos `role` inválidos no HTML.
- Os `label` agora apontam para os campos certos (acessibilidade).
- O script usa `<script defer>` comum, e não `type="module"`, para a página funcionar também ao abrir o arquivo com duplo clique.
- Um `<script>` vazio foi removido.

**Novo:**
- A troca de mundos animada, com a tela piscando e tremendo, os esporos e as imagens invertidas.
- Música com fade, botão de som e preferências salvas no navegador.
- Dado D20 no formulário e validação dos campos.
- Lista "A party de Hawkins" com as últimas inscrições.
- Lâmpadas piscando, animações ao rolar a página e layout responsivo.

---

## 🙌 Créditos

Este projeto é uma versão melhorada do **semana-frontend-mundo-invertido**, proposto pela **[DIO](https://www.dio.me/)**, com base no repositório original.

Todo o conceito, o design, a estrutura e as aulas da Semana Front-end foram idealizados pelos criadores originais, que ensinaram de forma clara, divertida e generosa como transformar HTML, CSS e JavaScript em algo memorável. Muito obrigado pela ideia e pela base do projeto! 👏

<p>
  <img align="left" margin="10" width="80" src="https://avatars.githubusercontent.com/u/16018277?v=4" alt="Diogo Medeiros Mainardes"/>
  <b>&nbsp;&nbsp;&nbsp;Diogo Medeiros Mainardes</b><br>
  &nbsp;&nbsp;&nbsp;<a href="http://instagram.com/diogomainardes.dev">Instagram</a> | <a href="https://github.com/diogomainardes">GitHub</a> | <a href="https://www.linkedin.com/in/diogomainardes/">LinkedIn</a> | <a href="https://www.twitch.tv/dimmbr">Twitch</a>
</p>
<br/><br/>
<p>
  <img align="left" margin="10" width="80" src="https://avatars.githubusercontent.com/u/55519539?v=4" alt="Michele Queiroz Ambrosio"/>
  <b>&nbsp;&nbsp;&nbsp;Michele Queiroz Ambrosio</b><br>
  &nbsp;&nbsp;&nbsp;<a href="http://instagram.com/programi_">Instagram</a> | <a href="https://github.com/micheleambrosio">GitHub</a> | <a href="https://www.linkedin.com/in/michele-ambrosio-a4899661/">LinkedIn</a> | <a href="https://www.twitch.tv/michele_ambrosio">Twitch</a>
</p>
<br/><br/>
<p>
  <img align="left" margin="10" width="80" src="https://avatars.githubusercontent.com/u/3266640?v=4" alt="Renan Johannsen de Paula"/>
  <b>&nbsp;&nbsp;&nbsp;Renan Johannsen de Paula</b><br>
  &nbsp;&nbsp;&nbsp;<a href="https://github.com/RenanJPaula">GitHub</a> | <a href="https://www.linkedin.com/in/renanjpaula/">LinkedIn</a>
</p>
<br/><br/>

- 🔗 Projeto original: [micheleambrosio/semana-frontend-mundo-invertido](https://github.com/micheleambrosio/semana-frontend-mundo-invertido)
- 🌐 Demo original: [micheleambrosio.github.io/semana-frontend-mundo-invertido](https://micheleambrosio.github.io/semana-frontend-mundo-invertido/)
- 🎨 Design: [Figma do projeto](https://www.figma.com/file/I3Q42CcVUziRN3iMfTrbfb/Stranger-Things?node-id=0%3A1)

Também agradeço à **DIO** por abrir esse tipo de oportunidade de aprendizado prática e gratuita.

As imagens, os áudios e o layout base vêm do material oficial do projeto. Stranger Things é marca de seus respectivos proprietários. Este é um projeto de estudo, sem fins comerciais.

### 🔗 Links auxiliares

- [W3C - World Wide Web Consortium](http://w3c.org)
- [WAI - Web Accessibility Initiative](https://www.w3.org/WAI/)
- [WCAG 2](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 👨‍💻 Autor desta versão

Feito por **Vinícius Cruz dos Santos** 👋



[![GitHub](https://img.shields.io/badge/GitHub-Viniciuscruzdossantos-181717?logo=github)](https://github.com/Viniciuscruzdossantos)


