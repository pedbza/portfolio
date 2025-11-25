/* Arquivo: app.js
   Descrição: Lógicas de interação (3D, Scroll, Projetos, Animações e Formulário AJAX)
*/

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================== */
    /* 1. EFEITO 3D NO CRACHÁ (TILT EFFECT)                 */
    /* ===================================================== */
    const card = document.getElementById("tilt-card");
    const container = document.querySelector(".hero-container");

    if (card && container) {
        // Movimento do Mouse
        container.addEventListener("mousemove", (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 25;
            const y = (window.innerHeight / 2 - e.pageY) / 25;
            card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });

        // Mouse entra: remove transição para resposta instantânea
        container.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
        
        // Mouse sai: volta suavemente ao centro
        container.addEventListener("mouseleave", () => {
            card.style.transition = "transform 0.5s ease";
            card.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }

    /* ===================================================== */
    /* 2. NAVBAR SCROLL (Aparecer/Esconder)                 */
    /* ===================================================== */
    const navbar = document.querySelector(".navbar");
    const hero = document.getElementById("landing");

    if (navbar && hero) {
        window.addEventListener("scroll", () => {
            // Se rolar mais que 70% da altura da seção Hero, mostra a navbar
            if (window.scrollY > (hero.offsetHeight * 0.7)) {
                navbar.classList.add("visible");
            } else {
                navbar.classList.remove("visible");
            }
        });
    }

    /* ===================================================== */
    /* 3. SMOOTH SCROLL (Navegação Suave)                   */
    /* ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ===================================================== */
    /* 4. CARREGAR PROJETOS (JSON)                          */
    /* ===================================================== */
    const projContainer = document.getElementById("projetos-container");

    if (projContainer) {
        fetch("projetos.json") 
            .then(res => {
                if (!res.ok) throw new Error("Erro ao carregar JSON");
                return res.json();
            })
            .then(data => {
                projContainer.innerHTML = "";
                data.forEach(p => {
                    const div = document.createElement("div");
                    div.className = "project-card";
                    div.innerHTML = `
                        <h4>${p.titulo}</h4>
                        <p>${p.descricao}</p>
                        <br>
                        <a href="${p.link}" target="_blank">Ver Código</a>
                    `;
                    projContainer.appendChild(div);
                });
            })
            .catch(error => {
                console.error("Erro:", error);
                projContainer.innerHTML = "<p>Não foi possível carregar os projetos no momento.</p>";
            });
    }

    /* ===================================================== */
    /* 5. ANIMAÇÃO AO ROLAR (GSAP)                          */
    /* ===================================================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, { 
                    y: 50, 
                    opacity: 0, 
                    duration: 1,
                    ease: "power3.out"
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.gsap-reveal').forEach(el => observer.observe(el));

    /* ===================================================== */
    /* 6. ENVIO DE FORMULÁRIO SEM RECARREGAR (AJAX)         */
    /* ===================================================== */
    const form = document.getElementById("my-form");
    const successMessage = document.getElementById("success-message");
    const status = document.getElementById("my-form-status");

    if (form) {
        async function handleSubmit(event) {
            event.preventDefault(); // IMPORTANTE: Impede o redirecionamento padrão
            
            const btn = document.getElementById("my-form-button");
            btn.textContent = "Enviando...";
            btn.disabled = true;

            const data = new FormData(event.target);

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // SUCESSO: Esconde o form e mostra a mensagem de obrigado
                    form.style.display = "none";
                    if (successMessage) successMessage.style.display = "block";
                    form.reset();
                } else {
                    // ERRO: Mostra o erro vindo do Formspree
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            status.innerHTML = "Oops! Ocorreu um erro ao enviar.";
                        }
                        status.style.color = "#ff6b6b"; // Vermelho
                        btn.textContent = "Enviar Mensagem";
                        btn.disabled = false;
                    })
                }
            }).catch(error => {
                // ERRO DE REDE
                status.innerHTML = "Erro de conexão. Tente novamente.";
                status.style.color = "#ff6b6b";
                btn.textContent = "Enviar Mensagem";
                btn.disabled = false;
            });
        }
        
        form.addEventListener("submit", handleSubmit);
    }
});