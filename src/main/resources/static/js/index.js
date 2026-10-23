document.addEventListener("DOMContentLoaded", () => {

    // ====================================================
    // 1. MENU MOBILE
    // ====================================================
    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            menu.classList.toggle("active");
            menu.classList.toggle("open");
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.remove("active", "open");
            });
        });
    }

    // ====================================================
    // 2. CARROSSEL
    // ====================================================
    const carouselTrack = document.getElementById("carouselTrack");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");

    if (carouselTrack && slides.length > 0) {
        let currentSlide = 0;
        let autoSlide;

        function showSlide(index) {
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }

            carouselTrack.style.transform =
                `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, idx) => {
                dot.classList.toggle("active", idx === currentSlide);
            });
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function previousSlide() {
            showSlide(currentSlide - 1);
        }

        function startAutoSlide() {
            clearInterval(autoSlide);
            autoSlide = setInterval(nextSlide, 5000);
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                nextSlide();
                startAutoSlide();
            });
        }

        if (previousButton) {
            previousButton.addEventListener("click", () => {
                previousSlide();
                startAutoSlide();
            });
        }

        dots.forEach((dot) => {
            dot.addEventListener("click", () => {
                showSlide(Number(dot.dataset.slide));
                startAutoSlide();
            });
        });

        showSlide(0);
        startAutoSlide();
    }

    // ====================================================
    // 3. FILTRO DE PRODUTOS
    // ====================================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");

    if (filterButtons.length && productCards.length) {
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const filtro = button.dataset.filter;

                filterButtons.forEach((item) => {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                productCards.forEach((card) => {
                    const categorias =
                        (card.dataset.category || "").split(/\s+/);

                    const visivel =
                        filtro === "todos" || categorias.includes(filtro);

                    card.style.display = visivel ? "" : "none";
                    card.classList.toggle("hidden", !visivel);
                });
            });
        });
    }

    // ====================================================
    // 4. SELECIONAR PRODUTO
    // ====================================================
    document
        .querySelectorAll(".add-product, .small-button[data-name]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const nomeProduto = button.dataset.name;

                if (!nomeProduto) return;

                const campoProduto = document.getElementById("product");
                const secaoPedidos = document.getElementById("pedidos");

                if (campoProduto) {
                    campoProduto.value = nomeProduto;
                }

                if (secaoPedidos) {
                    alert(`${nomeProduto} foi selecionado para o pedido.`);
                    secaoPedidos.scrollIntoView({ behavior: "smooth" });
                } else {
                    alert(
                        `${nomeProduto} foi selecionado. ` +
                        "Acesse a página Pedidos para concluir."
                    );
                }
            });
        });

    // ====================================================
    // 5. FORMULÁRIO DE PEDIDO
    // ====================================================
    const orderForm = document.getElementById("orderForm");

    if (orderForm) {
        orderForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const nome = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const telefone = document.getElementById("phone")?.value.trim();
            const produto = document.getElementById("product")?.value.trim();
            const quantidade = document.getElementById("quantity")?.value;
            const observacoes =
                document.getElementById("observations")?.value.trim();

            if (!nome || !email || !telefone || !produto || !quantidade) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            let pedidos = [];

            try {
                pedidos =
                    JSON.parse(localStorage.getItem("cafeAuraPedidos")) || [];
            } catch {
                pedidos = [];
            }

            const novoPedido = {
                id: Date.now(),
                nome,
                email,
                telefone,
                produto,
                quantidade: Number(quantidade),
                observacoes: observacoes || "Nenhuma",
                status: "atendimento",
                data: new Date().toLocaleString("pt-BR")
            };

            pedidos.push(novoPedido);

            localStorage.setItem(
                "cafeAuraPedidos",
                JSON.stringify(pedidos)
            );

            alert(
                `Pedido realizado com sucesso, ${nome}!\n\n` +
                `Produto: ${produto}\n` +
                `Quantidade: ${quantidade}\n\n` +
                "Seu pedido foi enviado para atendimento."
            );

            orderForm.reset();
        });
    }

    // ====================================================
    // 6. LOGIN DO CLIENTE
    // ====================================================
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email =
                document.getElementById("loginEmail")?.value.trim();

            const senha =
                document.getElementById("password")?.value;

            if (!email || !senha) {
                alert("Informe e-mail e senha.");
                return;
            }

            alert(`Login realizado com sucesso!\n\nBem-vindo, ${email}.`);
            loginForm.reset();
        });
    }

    // ====================================================
    // 7. LOGIN DO FUNCIONÁRIO
    // ====================================================
    const adminLoginForm = document.getElementById("adminLoginForm");
    const adminLoginArea = document.getElementById("adminLoginArea");
    const adminManagement = document.getElementById("adminManagement");
    const adminLogoutButton =
        document.getElementById("adminLogoutButton");

    const adminEmailInput = document.getElementById("adminEmail");
    const adminPasswordInput = document.getElementById("adminPassword");

    const funcionarioEmail = "funcionario@cafeaura.com";
    const funcionarioSenha = "123456";
    const ADMIN_SESSION_KEY = "cafeAuraFuncionarioLogado";

    function funcionarioEstaLogado() {
        return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
    }

    function mostrarGestaoPedidos() {
        if (adminLoginArea) adminLoginArea.style.display = "none";
        if (adminManagement) adminManagement.style.display = "block";
        carregarPedidosAdmin();
    }

    function mostrarLoginFuncionario() {
        if (adminLoginArea) adminLoginArea.style.display = "block";
        if (adminManagement) adminManagement.style.display = "none";
    }

    if (adminLoginForm || adminLoginArea || adminManagement) {
        if (funcionarioEstaLogado()) {
            mostrarGestaoPedidos();
        } else {
            mostrarLoginFuncionario();
        }
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = adminEmailInput?.value.trim();
            const senha = adminPasswordInput?.value;

            if (!email || !senha) {
                alert("Informe o e-mail e a senha do funcionário.");
                return;
            }

            if (
                email === funcionarioEmail &&
                senha === funcionarioSenha
            ) {
                sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
                adminLoginForm.reset();
                mostrarGestaoPedidos();

                alert(
                    "Login realizado com sucesso!\n\n" +
                    "Bem-vindo à Gestão de Pedidos do Café Aura."
                );
            } else {
                alert("E-mail ou senha do funcionário incorretos.");
            }
        });
    }

    // ====================================================
    // 8. SAIR DA ADMINISTRAÇÃO
    // ====================================================
    if (adminLogoutButton) {
        adminLogoutButton.addEventListener("click", () => {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            mostrarLoginFuncionario();
            alert("Você saiu da Gestão de Pedidos.");
        });
    }

    // ====================================================
    // 9. ABAS DE STATUS DOS PEDIDOS
    // ====================================================
    const pendingButton = document.getElementById("pendingButton");
    const finishedButton = document.getElementById("finishedButton");
    const pendingOrders = document.getElementById("pendingOrders");
    const finishedOrders = document.getElementById("finishedOrders");

    function mostrarPedidosEmAtendimento() {
        if (pendingButton) pendingButton.classList.add("active");
        if (finishedButton) finishedButton.classList.remove("active");

        if (pendingOrders) {
            pendingOrders.classList.add("active");
            pendingOrders.style.display = "block";
        }

        if (finishedOrders) {
            finishedOrders.classList.remove("active");
            finishedOrders.style.display = "none";
        }
    }

    function mostrarPedidosFinalizados() {
        if (finishedButton) finishedButton.classList.add("active");
        if (pendingButton) pendingButton.classList.remove("active");

        if (finishedOrders) {
            finishedOrders.classList.add("active");
            finishedOrders.style.display = "block";
        }

        if (pendingOrders) {
            pendingOrders.classList.remove("active");
            pendingOrders.style.display = "none";
        }
    }

    if (pendingButton) {
        pendingButton.addEventListener(
            "click",
            mostrarPedidosEmAtendimento
        );
    }

    if (finishedButton) {
        finishedButton.addEventListener(
            "click",
            mostrarPedidosFinalizados
        );
    }

    // ====================================================
    // 10. CARREGAR PEDIDOS NA ADMINISTRAÇÃO
    // ====================================================
    function carregarPedidosAdmin() {
        const pendingList =
            document.getElementById("pendingOrdersList");

        const finishedList =
            document.getElementById("finishedOrdersList");

        if (!pendingList || !finishedList) return;

        let pedidos = [];

        try {
            pedidos =
                JSON.parse(localStorage.getItem("cafeAuraPedidos")) || [];
        } catch {
            pedidos = [];
        }

        const pedidosAtendimento = pedidos.filter(
            (pedido) => pedido.status === "atendimento"
        );

        const pedidosFinalizados = pedidos.filter(
            (pedido) => pedido.status === "finalizado"
        );

        const pendingCount = document.getElementById("pendingCount");
        const finishedCount = document.getElementById("finishedCount");

        if (pendingCount) {
            pendingCount.textContent = pedidosAtendimento.length;
        }

        if (finishedCount) {
            finishedCount.textContent = pedidosFinalizados.length;
        }

        pendingList.innerHTML = "";
        finishedList.innerHTML = "";

        if (pedidosAtendimento.length === 0) {
            pendingList.innerHTML = `
                <div class="empty-orders">
                    <i class="fa-solid fa-mug-saucer"></i>
                    <h3>Nenhum pedido em atendimento</h3>
                    <p>Quando novos pedidos forem realizados, eles aparecerão aqui.</p>
                </div>`;
        } else {
            pedidosAtendimento.forEach((pedido) => {
                pendingList.appendChild(criarCardPedido(pedido));
            });
        }

        if (pedidosFinalizados.length === 0) {
            finishedList.innerHTML = `
                <div class="empty-orders">
                    <i class="fa-solid fa-circle-check"></i>
                    <h3>Nenhum pedido finalizado</h3>
                    <p>Os pedidos concluídos aparecerão aqui.</p>
                </div>`;
        } else {
            pedidosFinalizados.forEach((pedido) => {
                finishedList.appendChild(criarCardPedido(pedido));
            });
        }

        mostrarPedidosEmAtendimento();
    }

    // ====================================================
    // 11. CRIAR CARD DO PEDIDO
    // ====================================================
    function criarCardPedido(pedido) {
        const card = document.createElement("div");
        card.className = "order-admin-card";

        if (pedido.status === "finalizado") {
            card.classList.add("finished");
        }

        const info = document.createElement("div");
        info.className = "order-admin-info";

        const titulo = document.createElement("h3");
        titulo.textContent = `Pedido #${pedido.id}`;
        info.appendChild(titulo);

        const campos = [
            ["Cliente", pedido.nome],
            ["Produto", pedido.produto],
            ["Quantidade", pedido.quantidade],
            ["Email", pedido.email],
            ["Telefone", pedido.telefone],
            ["Observações", pedido.observacoes],
            ["Data", pedido.data]
        ];

        campos.forEach(([rotulo, valor]) => {
            const p = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = `${rotulo}: `;
            p.appendChild(strong);
            p.appendChild(
                document.createTextNode(String(valor ?? ""))
            );

            info.appendChild(p);
        });

        const actions = document.createElement("div");
        actions.className = "order-admin-actions";

        const actionButton = document.createElement("button");
        actionButton.type = "button";
        actionButton.className = "button";

        if (pedido.status === "atendimento") {
            actionButton.innerHTML =
                '<i class="fa-solid fa-check"></i> Finalizar';

            actionButton.addEventListener("click", () => {
                finalizarPedido(pedido.id);
            });
        } else {
            actionButton.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> Finalizado';

            actionButton.disabled = true;
        }

        actions.appendChild(actionButton);
        card.append(info, actions);

        return card;
    }

    // ====================================================
    // 12. FINALIZAR PEDIDO
    // ====================================================
    function finalizarPedido(id) {
        if (!funcionarioEstaLogado()) {
            alert("Você precisa estar logado como funcionário.");
            return;
        }

        let pedidos = [];

        try {
            pedidos =
                JSON.parse(localStorage.getItem("cafeAuraPedidos")) || [];
        } catch {
            pedidos = [];
        }

        const pedido = pedidos.find((item) => item.id === id);

        if (!pedido) {
            alert("Pedido não encontrado.");
            return;
        }

        pedido.status = "finalizado";

        localStorage.setItem(
            "cafeAuraPedidos",
            JSON.stringify(pedidos)
        );

        alert("Pedido finalizado com sucesso!");
        carregarPedidosAdmin();
    }

});