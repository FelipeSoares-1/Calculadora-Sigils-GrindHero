import customtkinter as ctk
from PIL import Image, ImageTk, ImageDraw, ImageFont
import os
import math

# =====================================================
# CONFIGURAÇÕES GERAIS E DADOS
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PATH_SIGILS = os.path.join(BASE_DIR, "sigils_icons")

ctk.set_appearance_mode("dark")  # Define o tema escuro para a interface
COR_FUNDO_APP = "#0a0a0c"        # Cor de fundo personalizada (quase preto)

# Configurações de Cores para o desenho via PIL
COR_VERDE_OVERLAY = (25, 120, 60, 110)      # Verde semitransparente para o preenchimento
COR_ESTRELA_ACESA_PIL = (250, 205, 103, 255) # Dourado das estrelas ativas
COR_ESTRELA_APAGADA_PIL = (30, 30, 30, 255)  # Cinza escuro das estrelas inativas
COR_DOURADO_PIL = (250, 205, 103, 255)       # Cor da borda de seleção

HEX_DOURADO = "#facd67"  # Cor dourada para textos da interface
HEX_BRANCO = "#ffffff"   # Cor branca para textos da interface

# Tabela com os custos de evolução de cada Sigil (Nível 1 ao 6/MAX)
TABELA_VALORES = {
    "Agressão": [125, 250, 312, 375, 437, 500],
    "Alquimista": [75, 150, 187, 225, 262, 300],
    "Apressado": [45, 90, 112, 135, 158, 180],
    "Artesão": [45, 90, 112, 135, 158, 180],
    "Atleta": [145, 290, 362, 435, 508, 580],
    "Drenar Mana": [225, 450, 562, 674, 787, 899],
    "Drenar Stamina": [125, 250, 312, 375, 437, 500],
    "Drenar Vida": [185, 370, 462, 555, 647, 740],
    "Especialista": [125, 250, 312, 375, 437, 500],
    "Esquiva": [125, 250, 312, 375, 437, 500],
    "Ganância": [125, 250, 312, 375, 437, 500],
    "Letalidade": [85, 170, 212, 255, 298, 340],
    "Naturalista": [150, 300, 375, 450, 525, 600],
    "Ousadia": [125, 250, 312, 375, 437, 500],
    "Pacifista": [125, 250, 312, 375, 437, 500],
    "Precisão": [105, 210, 262, 315, 368, 420],
    "Proteção": [75, 150, 187, 225, 262, 300],
    "Refletir": [125, 250, 312, 375, 437, 500],
    "Sorte": [125, 250, 312, 375, 437, 500],
    "Velocidade": [125, 250, 312, 375, 437, 500],
    "Vida": [75, 150, 187, 225, 262, 300]
}

# Descrições que aparecem no painel lateral ao clicar
DESC_SIGILS = {
    "Agressão": "Causa um aumento nos ataques desferidos, tanto físico quanto mágico.",
    "Alquimista": "Aumenta a potencia de suas porções, fazendo com que recuperem mais vida, mana e estamina do que o normal.",
    "Apressado": "Reduz o tempo de cooldown (para usar habilidades de mesma categoria) de suas magias e itens, fazendo com que sejam lançadas mais rapidamente.",
    "Artesão": "Aumenta a quantidade de itens produzidos em todas as magias de criaçao, como por exemplo, magias de criaçao de flechas.",
    "Atleta": "Acelera a evoluçao de seus atributos(corpo a corpo, magia, distância, escudaria ou adestramento), fazendo com que eles subam de nível mais rapidamente.",
    "Drenar Mana": "Seus ataques drenam uma quantia de pontos de mana de seu oponente para seus próprios pontos de mana.",
    "Drenar Stamina": "Seus ataques drenam uma quantia de pontos de stamina de seu oponente para seus próprios pontos de stamina.",
    "Drenar Vida": "Seus ataques drenam uma quantia de pontos de vida de seu oponente para seus próprios pontos de vida.",
    "Especialista": "Acelera o ganho de experiência para evolução de seus itens, fazendo com que eles subam de nível mais rapidamente.",
    "Esquiva": "Obtém a chance de se esquivar de ataques inimigos.",
    "Ganância": "A quantidade de loot coletado será maior.",
    "Letalidade": "Aumenta o total de dano causado por seus ataques críticos.",
    "Naturalista": "Reduz o tempo de recuperação natural de seus pontos de vida, mana e stamina, fazendo que se regenere mais rapidamente.",
    "Ousadia": "Aumenta a chance de provocar monstros em seus ataques. O valor é adicionado diretamente na habilidade no momento do ataque, por exemplo, se a habilidade possuir uma chance de provocar de 10% e o seu sigil tiver 2%, no total serão 12% de chance.",
    "Pacifista": "Reduz a chance de provocar monstros em seus ataques. O valor é removido diretamente na habilidade no momento do ataque, por exemplo, se a habilidade possuir uma chance de provocar de 10% e o seu sigil tiver 2%, no total serão 8% de chance.",
    "Precisão": "Aumenta a chance de acerto crítico e precisão de disparos.",
    "Proteção": "Causa uma redução no dano recebido, tanto físico quanto mágico.",
    "Refletir": "Sempre que receber um ataque, parte do dano será devolvido para aquele que desferiu o golpe.",
    "Sorte": "Sua chance será maior para encontrar itens e loots em monstros.",
    "Velocidade": "Causa um aumento na velocidade de movimento do personagem.",
    "Vida": "Causa um aumento nos pontos de vida do personagem."
}

# =====================================================
# CLASSE DOS CARDS (ÍCONES INDIVIDUAIS)
# =====================================================
class SigilCard(ctk.CTkCanvas):
    def __init__(self, master, nome, callback_total, callback_desc):
        self.w, self.h = 160, 230 
        super().__init__(master, width=self.w, height=self.h, bg=COR_FUNDO_APP, 
                         highlightthickness=0, bd=0)
        self.nome = nome
        self.nivel = -1  # Nível inicial (-1 significa que não está selecionado)
        self.callback_total = callback_total # Função para atualizar o custo total no App
        self.callback_desc = callback_desc   # Função para mostrar descrição no App
        
        # Tenta carregar a fonte para o custo, se falhar usa a padrão
        try:
            self.font_custo = ImageFont.truetype("arialbd.ttf", 24)
        except:
            self.font_custo = None

        # Procura a imagem do ícone na pasta
        img_path = os.path.join(PATH_SIGILS, f"{nome.replace(' ', '_')}.png")
        if not os.path.exists(img_path): img_path = os.path.join(PATH_SIGILS, f"{nome}.png")

        if os.path.exists(img_path):
            self.img_base = Image.open(img_path).resize((self.w, self.h), Image.LANCZOS).convert("RGBA")
            self.render()
        else:
            self.create_text(self.w/2, self.h/2, text=f"Erro:\n{nome}", fill="red")

        # Vincula os botões do mouse: Esquerdo (Subir Nível), Direito (Descer Nível)
        self.bind("<Button-1>", self.up)
        self.bind("<Button-3>", self.down)

    def up(self, _):
        """Aumenta o nível do Sigil até o máximo de 5."""
        if self.nivel < 5:
            self.nivel += 1
            self.render()
            self.callback_total()
        self.callback_desc(self.nome)

    def down(self, _):
        """Diminui o nível do Sigil. Se for menor que 0, ele 'desliga'."""
        if self.nivel >= 0:
            self.nivel -= 1
            self.render()
            self.callback_total()
        self.callback_desc(self.nome)

    def render(self):
        """Desenha todas as camadas do card: Base, Overlay Verde, Estrelas e Borda."""
        canvas_img = self.img_base.copy()
        draw_main = ImageDraw.Draw(canvas_img)
        
        # Desenha o custo do próximo nível na parte inferior da imagem
        precos = TABELA_VALORES[self.nome]
        prox_nivel = self.nivel + 1
        txt_custo = f"{precos[prox_nivel]}" if prox_nivel <= 5 else "MAX"
        draw_main.text((95, 210), txt_custo, fill=(255, 255, 255, 255), 
                       font=self.font_custo, anchor="mm")

        # Se o Sigil estiver ativo (Nível 0 ou mais), desenha os efeitos visuais
        if self.nivel >= 0:
            overlay = Image.new("RGBA", (self.w, self.h), (0,0,0,0))
            draw_ov = ImageDraw.Draw(overlay)
            
            # Coordenadas do retângulo verde (ajustes finos aplicados aqui)
            x0, y0, x1, y1 = 32, 46, 128, 147
            
            if self.nome == "Atleta":
                y0 += 2 # Ajuste para não vazar no topo
                y1 += 12
            elif self.nome == "Pacifista":
                y0 -= 5 # Ajuste para não vazar no topo
                y1 += 4
            elif self.nome == "Ganância": y1 += 12
            elif self.nome == "Velocidade": y1 += 11
            elif self.nome == "Naturalista": y0 -= 3; y1 += 7
            elif self.nome == "Refletir": y0 -= 1; y1 += 8
            elif self.nome == "Esquiva": y0 -= 3
            elif self.nome == "Vida": y0 -= 4; y1 += 5
            elif self.nome in ["Drenar Vida", "Drenar Stamina"]: y1 += 11
            elif self.nome in ["Letalidade", "Precisão"]: y1 += 7
            elif self.nome == "Proteção": y1 += 12
            elif self.nome == "Sorte": y0 -= 5; y1 -= 5; x0 += 4; x1 += 4; y1 += 10
            elif self.nome in ["Alquimista", "Apressado", "Artesão"]: y1 += 10
            elif self.nome in ["Drenar Mana", "Ousadia"]: y0 -= 8
            elif self.nome == "Especialista": y1 += 8

            # Desenha o fundo verde semitransparente
            draw_ov.rectangle([x0, y0, x1, y1], fill=COR_VERDE_OVERLAY)
            
            # Camada das Estrelas
            stars_layer = Image.new("RGBA", (self.w, self.h), (0,0,0,0))
            draw_st = ImageDraw.Draw(stars_layer)
            X_ESTRELAS = [27.0, 52.0, 78.5, 105.0, 131.0]
            Y_ESTRELA = 173 
            for i in range(5):
                cor = COR_ESTRELA_ACESA_PIL if (i < self.nivel) else COR_ESTRELA_APAGADA_PIL
                self.draw_star(draw_st, X_ESTRELAS[i], Y_ESTRELA, 8.5, cor)

            # Camada da Borda Dourada de seleção
            borda_layer = Image.new("RGBA", (self.w, self.h), (0,0,0,0))
            draw_bd = ImageDraw.Draw(borda_layer)
            draw_bd.rectangle([2, 2, self.w-3, self.h-3], outline=COR_DOURADO_PIL, width=3)

            # Combina todas as camadas na imagem base
            canvas_img = Image.alpha_composite(canvas_img, overlay)
            canvas_img = Image.alpha_composite(canvas_img, stars_layer)
            canvas_img = Image.alpha_composite(canvas_img, borda_layer)

        # Converte a imagem PIL para uma que o CTK entenda e atualiza o Canvas
        self.tk_img = ImageTk.PhotoImage(canvas_img)
        self.delete("all")
        self.create_image(0, 0, anchor="nw", image=self.tk_img)

    def draw_star(self, draw, x, y, size, color):
        """Função matemática para desenhar uma estrela perfeita de 5 pontas."""
        points = []
        for i in range(10):
            r = size if i % 2 == 0 else size / 2.3
            angle = i * 36
            px = x + r * math.sin(math.radians(angle))
            py = y - r * math.cos(math.radians(angle))
            points.append((px, py))
        draw.polygon(points, fill=color, outline=(0,0,0,255))

# =====================================================
# CLASSE PRINCIPAL DO APLICATIVO
# =====================================================
class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Calculadora de Sigils MII")
        self.geometry("1200x950")
        self.configure(fg_color=COR_FUNDO_APP)
        self.cards = [] # Lista que guarda todos os objetos de cards criados
        self.setup_ui()

    def setup_ui(self):
        """Cria e organiza os elementos visuais da tela."""
        
        # --- CABEÇALHO (Apenas Custo Total) ---
        self.head = ctk.CTkFrame(self, fg_color="transparent")
        self.head.pack(fill="x", padx=40, pady=(30, 10))
        
        self.lbl_titulo = ctk.CTkLabel(self.head, text="CUSTO TOTAL: ", font=("Arial", 22, "bold"), text_color=HEX_BRANCO)
        self.lbl_titulo.pack(side="left")

        self.lbl_total = ctk.CTkLabel(self.head, text="0", font=("Arial", 54, "bold"), text_color=HEX_DOURADO)
        self.lbl_total.pack(side="left")

        # --- CONTAINER DE CONTEÚDO (Cards + Painel Direito) ---
        self.main_container = ctk.CTkFrame(self, fg_color="transparent")
        self.main_container.pack(fill="both", expand=True, padx=20)

        # Área de rolagem para os ícones
        self.scroll = ctk.CTkScrollableFrame(self.main_container, fg_color="transparent", width=800, height=750)
        self.scroll.pack(side="left", fill="both", expand=True)

        # Painel Direito (Descrições e Reset)
        self.desc_panel = ctk.CTkFrame(self.main_container, fg_color="#15151a", width=340, corner_radius=12, border_width=2, border_color="#333")
        self.desc_panel.pack(side="right", fill="y", padx=(20, 0), pady=10)
        self.desc_panel.pack_propagate(False)

        self.lbl_desc_titulo = ctk.CTkLabel(self.desc_panel, text="Selecione um Sigil", font=("Arial", 24, "bold"), text_color=HEX_DOURADO, wraplength=300)
        self.lbl_desc_titulo.pack(pady=(40, 20))

        self.lbl_desc_texto = ctk.CTkLabel(self.desc_panel, text="Clique em um ícone para ver os detalhes e bônus de cada nível.", font=("Arial", 16), text_color="#bbbbbb", wraplength=280, justify="left")
        self.lbl_desc_texto.pack(padx=25, pady=10)

        # --- BOTÃO DE RESET (No final do painel lateral) ---
        self.reset_btn = ctk.CTkButton(
            self.desc_panel, 
            text="ZERAR TUDO", 
            fg_color="#551111", 
            hover_color="#771111", 
            font=("Arial", 16, "bold"), 
            height=45, 
            command=self.reset_all # Chama a função que zera tudo
        )
        self.reset_btn.pack(side="bottom", pady=40, padx=40, fill="x")

        # Loop para criar os cards automaticamente baseados na tabela de valores
        for idx, nome in enumerate(sorted(TABELA_VALORES.keys())):
            r, c = divmod(idx, 4) # Organiza em 4 colunas
            card = SigilCard(self.scroll, nome, self.update_total, self.show_description)
            card.grid(row=r, column=c, padx=12, pady=12)
            self.cards.append(card)

    def show_description(self, nome):
        """Atualiza o texto do painel lateral com a descrição do Sigil clicado."""
        self.lbl_desc_titulo.configure(text=nome.upper())
        texto = DESC_SIGILS.get(nome, "Descrição não disponível.")
        self.lbl_desc_texto.configure(text=texto)

    def update_total(self):
        """Calcula a soma de todos os níveis de todos os cards e atualiza o topo."""
        total = 0
        for c in self.cards:
            if c.nivel >= 0:
                precos = TABELA_VALORES[c.nome]
                # Soma o custo acumulado (ex: Nível 2 = Preço Nível 0 + 1 + 2)
                total += sum(precos[:c.nivel + 1])
        # Formata o número com ponto (ex: 11.046)
        self.lbl_total.configure(text=f"{total:,}".replace(",", "."))

    def reset_all(self):
        """Reseta todos os Sigils para o estado inicial e limpa a tela."""
        for c in self.cards:
            c.nivel = -1 # Nível -1 desativa o visual verde e as estrelas
            c.render()
        self.update_total() # Zera o custo total
        self.lbl_desc_titulo.configure(text="Selecione um Sigil")
        self.lbl_desc_texto.configure(text="Clique em um ícone para ver os detalhes e bônus de cada nível.")

# Inicializa o programa
if __name__ == "__main__":
    app = App()
    app.mainloop()