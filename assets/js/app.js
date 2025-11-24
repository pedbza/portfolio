/* Arquivo Principal de JavaScript
    Atividade Final - Desenvolvimento Front-End
    Aluno: Pedro Henrique Martins Barbosa
*/

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================== */
    /* 1. EFEITO 3D NO CRACHÁ (TILT EFFECT)                 */
    /* ===================================================== */
    const card = document.getElementById("tilt-card");
    const container = document.querySelector(".hero-container");

    if (card && container) {
        // Evento: Mouse se move dentro do container
        container.addEventListener("mousemove", (e) => {
            // Calcula o centro da tela
            const x = (window.innerWidth / 2 - e.pageX) / 25; // /25 suaviza a rotação
            const y = (window.innerHeight / 2 - e.pageY) / 25;

            // Aplica a rotação (Inverte eixo X e Y para sensação natural)
            card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });

        // Evento: Mouse entra (remove transição para resposta rápida)
        container.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });

        // Evento: Mouse sai (reseta posição com suavidade)
        container.addEventListener("mouseleave", () => {
            card.style.transition = "transform 0.5s ease";
            card.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }

    /* ===================================================== */
    /* 2. NAVBAR INTELIGENTE (SCROLL DETECTION)             */
    /* ===================================================== */
    const navbar = document.querySelector(".navbar");
    const heroSection = document.getElementById("landing");

    if (navbar && heroSection) {
        window.addEventListener("scroll", () => {
            // Pega a altura da seção Hero
            const heroHeight = heroSection.offsetHeight;
            // Pega quanto a página já rolou
            const scrollPosition = window.scrollY;

            // Se rolou mais que 70% da altura do hero, mostra a navbar
            if (scrollPosition > (heroHeight * 0.7)) {
                navbar.classList.add("visible");
            } else {
                navbar.classList.remove("visible");
            }
        });
    }

    /* ===================================================== */
    /* 3. SMOOTH SCROLL (NAVEGAÇÃO SUAVE)                   */
    /* ===================================================== */
    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Impede o "pulo" padrão
            
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    /* ===================================================== */
    /* 4. CARREGAMENTO DE PROJETOS (JSON + FETCH API)       */
    /* ===================================================== */
    const projetosContainer = document.getElementById("projetos-container");

    if (projetosContainer) {
        fetch("projetos.json")
            .then(response => {
                if (!response.ok) throw new Error("Erro na rede");
                return response.json();
            })
            .then(data => {
                // Limpa o texto de "Carregando..."
                projetosContainer.innerHTML = "";

                // Cria os cards dinamicamente
                data.forEach(projeto => {
                    const cardDiv = document.createElement("div");
                    cardDiv.classList.add("project-card");

                    cardDiv.innerHTML = `
                        <h4>${projeto.titulo}</h4>
                        <p>${projeto.descricao}</p>
                        <a href="${projeto.link}" target="_blank">Ver Repositório <i class="fas fa-arrow-right"></i></a>
                    `;

                    projetosContainer.appendChild(cardDiv);
                });
            })
            .catch(error => {
                console.error("Erro ao carregar projetos:", error);
                projetosContainer.innerHTML = "<p style='color: #ff6b6b;'>Não foi possível carregar os projetos no momento.</p>";
            });
    }

    /* ===================================================== */
    /* 5. VALIDAÇÃO DE FORMULÁRIO                           */
    /* ===================================================== */
    const contactForm = document.getElementById("contact-form");
    const statusMsg = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Não recarrega a página

            // Reset status
            statusMsg.textContent = "Enviando...";
            statusMsg.style.color = "#ccc";

            const name = document.getElementById("form-name").value.trim();
            const email = document.getElementById("form-email").value.trim();
            const msg = document.getElementById("form-message").value.trim();

            // Validação Simples
            if (!name || !email || !msg) {
                statusMsg.textContent = "Preencha todos os campos!";
                statusMsg.style.color = "#ff6b6b";
                return;
            }

            // Regex para Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                statusMsg.textContent = "E-mail inválido!";
                statusMsg.style.color = "#ff6b6b";
                return;
            }

            // Simulação de Envio (Success)
            setTimeout(() => {
                statusMsg.textContent = "Mensagem enviada com sucesso!";
                statusMsg.style.color = "#00f5c3";
                contactForm.reset();
            }, 1000);
        });
    }

    /* ===================================================== */
    /* 6. ANIMAÇÃO GSAP + INTERSECTION OBSERVER (EXTRA)     */
    /* ===================================================== */
    // Esta parte anima os elementos com a classe .gsap-reveal quando eles entram na tela
    
    // Configura o Observer
    const observerOptions = {
        threshold: 0.1 // Ativa quando 10% do elemento estiver visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ativa a animação GSAP
                gsap.from(entry.target, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
                
                // Para de observar o elemento depois que animou uma vez
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos com a classe gsap-reveal
    document.querySelectorAll('.gsap-reveal').forEach((element) => {
        observer.observe(element);
    });

});