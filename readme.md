# Yu-Gi-Oh | Jo-ken-po Edition 🎴

Jogo de Jo-ken-po (pedra, papel e tesoura) com cartas do universo Yu-Gi-Oh!, feito com **HTML, CSS e JavaScript puro**. Enfrente o oponente em duelos com Life Points, combos, tempo por rodada, poderes especiais e várias dificuldades.

## 🕹️ Como jogar

Zere os LP do oponente antes que ele zere os seus. As cartas seguem a lógica do Jo-ken-po:

| Carta | Vence |
|---|---|
| Dragão Branco de Olhos Azuis (papel) | Exodia |
| Exodia, o Proibido (pedra) | Mago Negro |
| Mago Negro (tesoura) | Dragão Branco |

Dentro do jogo há um menu **Instruções** (tecla `H`) com todas as regras.

## ✨ Recursos

- **Life Points e combos:** vitórias seguidas aumentam o dano (1000 a 3000).
- **Tempo por rodada:** se o tempo acabar, o oponente ataca. O cronômetro pode ser desligado.
- **3 dificuldades:** Fácil, Normal e Difícil (o oponente aprende seu padrão de jogo).
- **2 modos:** duelo único e melhor de 3.
- **Poderes especiais:** Escudo, Dano x2 e Olho do Milênio (1 uso de cada por duelo).
- **Ranking e estatísticas** salvos no navegador (`localStorage`).
- **Opções:** pausa, música, efeitos sonoros e controle de volume.

## ⌨️ Comandos

| Tecla | Ação |
|---|---|
| `1` `2` `3` | Jogar Dragão, Exodia ou Mago |
| `Q` | Escudo |
| `W` | Dano x2 |
| `E` | Olho do Milênio |
| `P` | Pausar / continuar |
| `H` ou `?` | Abrir instruções |
| `Esc` | Fechar instruções |

## 🚀 Como executar

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador.

Não precisa instalar nada.

## 📁 Estrutura

```
index.html
src/
├── assets/    # imagens, áudios, cursores e vídeo
├── scripts/   # engine.js (lógica do jogo)
└── styles/    # reset, botões, containers e estilos principais
```

## 🧠 Conceitos abordados

- Armazenamento e gerenciamento de estado manual
- Funções puras (`judge`, `damage`, `fmt`)
- Organização de código (dados, estado, renderização e eventos)
- `localStorage`, temporizadores e eventos de teclado

## 🙏 Créditos

Este projeto é baseado no jogo **Yu-Gi-Oh | Jo-ken-po Edition**, criado pelo professor **Felipe Aguiar** ([@felipeAguiarCode](https://github.com/felipeAguiarCode)) para a **[Digital Innovation One (DIO)](https://www.dio.me/)**.

- Repositório original (assets e base do projeto): [digitalinnovationone/js-yugioh-assets](https://github.com/digitalinnovationone/js-yugioh-assets)
- Imagens, áudios, vídeo e estilos de interface vêm dos assets do projeto original.
- Esta versão expandida, com Life Points, combos, tempo, dificuldades, poderes, ranking e menu de instruções, foi desenvolvida por Vinícius Cruz dos Santos com apoio do Claude (Anthropic).

Yu-Gi-Oh! é marca registrada de seus respectivos proprietários. Projeto sem fins lucrativos, feito para fins educacionais.
