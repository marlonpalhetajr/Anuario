(function () {
    const layoutFixCss = `
  <style id="repo-layout-fix">
    .footer-main .container,
    .footer-copyright .container {
      background: transparent !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      overflow: visible !important;
      max-width: 1320px !important;
    }

    .repo-home-btn {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 50px;
      height: 50px;
      background: #2f7f2f;
      color: #ffffff;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: all 0.3s ease;
      z-index: 999999;
    }

    .repo-home-btn.show {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .repo-home-btn:hover,
    .repo-home-btn:focus {
      color: #ffffff;
      background: #1a5f1a;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
      text-decoration: none;
    }

    .repo-home-btn:active {
      transform: translateY(0);
    }

    @media (max-width: 768px) {
      .repo-home-btn {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
        font-size: 18px;
      }
    }
  </style>`;

    const homeButtonHtml = `
  <a href="../index.html" class="repo-home-btn" id="repo-home-btn" title="Início" aria-label="Ir para o início">
    <i class="bi bi-house-door-fill"></i>
  </a>`;

    const headerHtml = `
  <div id="acess-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>

  <nav class="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0" id="navbar">
      <a href="https://www.fapespa.pa.gov.br/" target="_blank" class="navbar-brand d-flex align-items-center px-4 px-lg-5">
          <h1 class="m-3" data-i18n="nav_fapespa">FAPESPA</h1>
      </a>
      <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-label="Alternar navegação">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav ms-auto p-4 p-lg-0">
              <li class="nav-item"><a class="nav-link" href="../index.html" data-i18n="menu_home">Home</a></li>
              <li class="nav-item"><a class="nav-link" href="../index.html#anuario" data-i18n="menu_anuario">Anuário</a></li>
              <li class="nav-item"><a class="nav-link" href="../index.html#sobre" data-i18n="menu_sobre">Sobre</a></li>
              <li class="nav-item"><a class="nav-link" href="../index.html#contato" data-i18n="menu_contato">Contato</a></li>
              <li class="nav-item dropdown">
                  <button class="nav-link dropdown-toggle bg-transparent border-0" id="langDropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                       🌐 <span data-i18n="menu_idioma">Idioma</span>
                  </button>
                  <ul class="dropdown-menu">
                      <li><a class="dropdown-item lang-option" data-lang="pt" href="#">Português</a></li>
                      <li><a class="dropdown-item lang-option" data-lang="en" href="#">English</a></li>
                      <li><a class="dropdown-item lang-option" data-lang="es" href="#">Español</a></li>
                  </ul>
              </li>
              <li class="nav-item position-relative">
                  <button id="acess-open-btn" class="nav-link border-0 bg-transparent" title="Acessibilidade" onclick="toggleAccessibilityMenu(event);" type="button">
                    ♿ <span class="d-none d-lg-inline">Acessibilidade</span>
                  </button>
                  <div id="acessibilidadeMenu" class="acess-dropdown" style="display:none;">
                    <div class="acess-section-title">Visão</div>
                    <div class="acess-row">
                      <button id="acess-contrast" class="acess-control" type="button">Alto contraste</button>
                      <button id="acess-night" class="acess-control" type="button">Modo noturno</button>
                    </div>
                    <div class="acess-section-title">Cores</div>
                    <div class="acess-row">
                      <button id="acess-grayscale" class="acess-control" type="button">Escala em Cinza</button>
                    </div>
                    <div class="acess-section-title">Tamanho da Fonte</div>
                    <div class="acess-row">
                      <button id="font-dec" class="acess-control" type="button">A-</button>
                      <button id="font-reset" class="acess-control" type="button">A</button>
                      <button id="font-inc" class="acess-control" type="button">A+</button>
                    </div>
                    <div class="acess-section-title">Daltonismo</div>
                    <div class="acess-row">
                      <button id="dalton-prot" class="acess-control" type="button">Protanopia</button>
                      <button id="dalton-deut" class="acess-control" type="button">Deuteranopia</button>
                      <button id="dalton-trit" class="acess-control" type="button">Tritanopia</button>
                      <button id="dalton-off" class="acess-control" type="button">Normal</button>
                    </div>
                    <div class="acess-section-title">Leitura &amp; Legibilidade</div>
                    <div class="acess-row">
                      <button id="acess-dislexia" class="acess-control" type="button">Modo Dislexia</button>
                      <button id="acess-reading" class="acess-control" type="button">Modo Leitura</button>
                      <button id="acess-links" class="acess-control" type="button">Destacar Links</button>
                    </div>
                    <div class="acess-section-title">Movimento</div>
                    <div class="acess-row">
                      <button id="reduce-motion" class="acess-control" type="button">Reduzir Animações</button>
                    </div>
                    <div class="acess-section-title">Geral</div>
                    <div class="acess-row">
                      <button id="acess-reset" class="acess-control acess-reset" type="button">Restaurar Tudo</button>
                    </div>
                  </div>
              </li>
          </ul>
      </div>
  </nav>`;

    const footerHtml = `
  <footer class="footer-main" id="contato">
    <div class="container py-5">
      <div class="row g-5">
        <div class="col-lg-3 col-md-6">
          <h5 class="footer-title mb-4">Sobre FAPESPA</h5>
          <p class="small text-light">Fundação Amazônia de Amparo a Estudos e Pesquisas, promovendo ciência, tecnologia e inovação para o desenvolvimento do estado.</p>
          <div class="social-icons mt-4">
            <a href="https://www.instagram.com/fapespa/" target="_blank" rel="noopener noreferrer" class="social-link" title="Instagram" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
            <a href="https://www.facebook.com/FapespaPA" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="https://x.com/fapespa" target="_blank" rel="noopener noreferrer" class="social-link" title="Twitter" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <h5 class="footer-title mb-4">Contato</h5>
          <ul class="list-unstyled small text-light">
            <li class="mb-3"><i class="bi bi-geo-alt me-2 text-primary"></i> <span>Av. Presidente Vargas, 670</span></li>
            <li class="mb-3"><i class="bi bi-telephone me-2 text-primary"></i> <span>+55 (91) 3323-2550</span></li>
            <li class="mb-3"><i class="bi bi-clock me-2 text-primary"></i> <span>Seg-Sex: 8h às 14h</span></li>
            <li><i class="bi bi-envelope me-2 text-primary"></i> <a href="mailto:contato@fapespa.pa.gov.br" class="text-light text-decoration-none">contato@fapespa.pa.gov.br</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6">
          <h5 class="footer-title mb-4">Produtos</h5>
          <ul class="list-unstyled small">
            <li class="mb-2"><a href="https://www.fapespa.pa.gov.br/anuario-estatistico-do-para-2/" target="_blank" rel="noopener noreferrer" class="text-light text-decoration-none">Anuário Estatístico</a></li>
            <li class="mb-2"><a href="https://www.fapespa.pa.gov.br/radar-de-indicadores-das-ri/" target="_blank" rel="noopener noreferrer" class="text-light text-decoration-none">Radar de Indicadores</a></li>
            <li class="mb-2"><a href="https://www.fapespa.pa.gov.br/para-no-contexto-nacional-2/" target="_blank" rel="noopener noreferrer" class="text-light text-decoration-none">Pará no Contexto Nacional</a></li>
            <li class="mb-2"><a href="https://www.fapespa.pa.gov.br/estatistica-municipal/" target="_blank" rel="noopener noreferrer" class="text-light text-decoration-none">Estatística Municipal</a></li>
            <li class="mb-2"><a href="https://www.fapespa.pa.gov.br/para-em-numeros/" target="_blank" rel="noopener noreferrer" class="text-light text-decoration-none">Pará em Números</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6">
          <h5 class="footer-title mb-4">Localização</h5>
          <div class="map-embed rounded">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.61483842183!2d-48.4907923!3d-1.4589201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a488a1b633b497%3A0xf63d2e2601a4e1e8!2sFundação%20Amazônia%20de%20Amparo%20a%20Estudos%20e%20Pesquisas%20-%20FAPESPA!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Localização FAPESPA">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <div class="footer-copyright text-center py-4">
    <div class="container">
      <small class="text-muted">© Anuário Estatístico do Pará, Todos os direitos reservados. <a href="https://www.fapespa.pa.gov.br/" class="text-muted text-decoration-none">FAPESPA</a></small>
    </div>
  </div>`;

    function injectLayout() {
      if (!document.body) {
        return;
      }

      if (!document.getElementById('repo-layout-fix')) {
        document.head.insertAdjacentHTML('beforeend', layoutFixCss);
      }

      // Do not inject the global site navbar/footer into this folder's pages.
      // The repository pages include their own headers/footers; skip insertion.

      if (!document.getElementById('repo-home-btn')) {
        document.body.insertAdjacentHTML('beforeend', homeButtonHtml);
      }

      const homeBtn = document.getElementById('repo-home-btn');
      if (homeBtn && !homeBtn.dataset.bound) {
        const isRepoIndex = /\/repositorio_oficial2\/(index\.html)?$/i.test(window.location.pathname);

        const toggleHomeBtn = () => {
          if (isRepoIndex) {
            homeBtn.classList.add('show');
            return;
          }

          const scrolled = window.pageYOffset || document.documentElement.scrollTop;
          if (scrolled > 200) {
            homeBtn.classList.add('show');
          } else {
            homeBtn.classList.remove('show');
          }
        };

        window.addEventListener('scroll', toggleHomeBtn, { passive: true });
        toggleHomeBtn();
        homeBtn.dataset.bound = '1';
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectLayout, { once: true });
    } else {
      injectLayout();
    }
})();