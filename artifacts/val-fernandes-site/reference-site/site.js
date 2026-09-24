(function () {
  // Safe HTML Escaping
  const escapeHtml = str => String(str || '').replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));

  // Fallback Posts
  const fallbackPosts = [
    {
      id: 1,
      title: 'Como a Hipnoterapia Pode Destravar Padrões Subconscientes',
      category: 'Hipnoterapia',
      excerpt: 'Entenda como o acesso ao subconsciente permite ressignificar traumas antigos e criar novas programações mentais saudáveis.',
      image: '/assets/expert2.jpeg',
      date: '10 de Agosto, 2026',
      content: 'Muitas das nossas reações automáticas, medos e bloqueios têm origem em memórias guardadas no subconsciente. A hipnoterapia clínica é uma ferramenta terapêutica de alta precisão que permite acessar esses registros de forma segura e acolhedora.\n\nDurante o processo, o paciente permanece em estado de relaxamento profundo e foco direcionado, mantendo o controle total da sua mente. É nesse estado que conseguimos desarmar crenças limitantes sobre valor próprio, fracasso ou rejeição, substituindo-as por sentimentos de capacidade, paz e segurança.'
    },
    {
      id: 2,
      title: 'Ansiedade Generalizada: Compreendendo os Sinais do Seu Corpo',
      category: 'Ansiedade & Pânico',
      excerpt: 'A ansiedade não é um inimigo, mas um alerta do seu corpo. Saiba como a Psicanálise ajuda a identificar as causas profundas.',
      image: '/assets/expert.png',
      date: '04 de Agosto, 2026',
      content: 'Taquicardia, pensamentos acelerados, sensação de aperto no peito e preocupação constante com o futuro são sintomas frequentes da Ansiedade Generalizada e da Síndrome do Pânico.\n\nAtravés da Psicanálise Clínica, buscamos não apenas aliviar os sintomas, mas compreender o que o seu inconsciente está tentando expressar. Ao dar voz a emoções reprimidas e feridas não curadas, a necessidade do sintoma ansioso se dissipa, devolvendo a tranquilidade ao seu dia a dia.'
    },
    {
      id: 3,
      title: 'Feridas Emocionais da Infância e Seus Impactos nas Relações',
      category: 'Relacionamentos',
      excerpt: 'Abandono, rejeição e traição no passado costumam se repetir nos relacionamentos adultos. Aprenda a quebrar esse ciclo.',
      image: '/assets/testimonials/testimonial_4.png',
      date: '28 de Julho, 2026',
      content: 'Quando carregamos feridas emocionais de rejeição, abandono ou traição, é comum desenvolvermos comportamentos defensivos nos relacionamentos adultos — como ciúme excessivo, medo da intimidade ou dependência emocional.\n\nCom a Terapia Sistêmica e a Reprogramação de Crenças, investigamos a dinâmica familiar e os padrões inconscientes para que você possa estabelecer limites saudáveis, cultivar a autoestima e construir relações baseadas no respeito e no amor autêntico.'
    }
  ];

  let allPosts = [];
  let currentFilterCategory = 'all';
  let currentSearchQuery = '';

  // Render Blog Posts
  function renderPosts(posts) {
    if (posts) allPosts = posts;
    const isBlogPage = !!document.querySelector('#categories-filter');
    const container = document.querySelector('#blog-posts');
    if (!container) return;

    let displayPosts = allPosts.length ? allPosts : fallbackPosts;

    if (isBlogPage) {
      // Apply filters
      if (currentFilterCategory !== 'all') {
        displayPosts = displayPosts.filter(p => p.category === currentFilterCategory);
      }
      if (currentSearchQuery.trim() !== '') {
        const query = currentSearchQuery.toLowerCase();
        displayPosts = displayPosts.filter(p => 
          (p.title || '').toLowerCase().includes(query) || 
          (p.excerpt || '').toLowerCase().includes(query) || 
          (p.content || '').toLowerCase().includes(query)
        );
      }

      // No results message
      const noResultsMsg = document.querySelector('#no-results-msg');
      if (noResultsMsg) {
        noResultsMsg.style.display = displayPosts.length === 0 ? 'block' : 'none';
      }
    } else {
      // Home page: only show the 4 most recent posts
      displayPosts = displayPosts.slice(0, 4);
    }

    container.innerHTML = displayPosts.map(p => `
      <article class="blog-card">
        <img src="${escapeHtml(p.image || '/assets/expert.png')}" alt="${escapeHtml(p.title)}">
        <div class="blog-card-body">
          <span class="blog-category">${escapeHtml(p.category || 'Artigo')}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.excerpt)}</p>
          <button class="read-more-btn" onclick="openArticleModalById(${p.id})">Ler artigo completo →</button>
        </div>
      </article>
    `).join('');
  }

  // Open Article Modal by Post ID
  window.openArticleModalById = function (postId) {
    const post = allPosts.find(p => p.id == postId) || fallbackPosts.find(p => p.id == postId);
    if (!post) return;

    const modal = document.querySelector('#article-modal');
    const modalBody = document.querySelector('#modal-body');
    if (!modal || !modalBody) return;

    // Detect if content is HTML or plain text
    const hasHtml = /<[a-z][\s\S]*>/i.test(post.content || '');
    const formattedContent = hasHtml 
      ? (post.content || post.excerpt)
      : escapeHtml(post.content || post.excerpt)
        .split('\n\n')
        .map(para => `<p style="font-size:15px; color:var(--text-muted); line-height:1.7; margin-bottom:16px;">${para}</p>`)
        .join('');

    modalBody.innerHTML = `
      <span class="blog-category" style="display:block; margin-bottom:8px;">${escapeHtml(post.category || 'Artigo')}</span>
      <h2 style="font-size:26px; color:var(--text-primary); margin:0 0 12px; line-height:1.2;">${escapeHtml(post.title)}</h2>
      ${post.image ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" style="width:100%; max-height:280px; object-fit:cover; border-radius:12px; margin-bottom:20px;">` : ''}
      <div class="post-text-body">${formattedContent}</div>
      <div style="margin-top:25px; padding-top:20px; border-top:1px solid var(--border-subtle); text-align:center;">
        <a class="button whatsapp-link" href="https://wa.me/5565992199578" target="_blank" rel="noopener">
          Deseja agendar uma sessão sobre esse tema? Falar no WhatsApp →
        </a>
      </div>
    `;

    modal.style.display = 'flex';
  };

  // Close Article Modal
  function closeModal() {
    const modal = document.querySelector('#article-modal');
    if (modal) modal.style.display = 'none';
  }

  // Setup Google Reviews Carousel
  function initGoogleReviewsCarousel() {
    const track = document.querySelector('#carousel-track');
    const prevBtn = document.querySelector('#carousel-prev');
    const nextBtn = document.querySelector('#carousel-next');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.google-card-item');
    if (!cards.length) return;

    let currentIndex = 0;

    function getVisibleCardsCount() {
      if (window.innerWidth <= 700) return 1;
      if (window.innerWidth <= 1000) return 2;
      return 3;
    }

    function updateCarousel() {
      const visibleCardsCount = getVisibleCardsCount();
      const maxIndex = Math.max(0, cards.length - visibleCardsCount);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      const cardStyle = window.getComputedStyle(cards[0]);
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 18;

      const moveAmount = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${moveAmount}px)`;
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        const visibleCardsCount = getVisibleCardsCount();
        currentIndex = Math.max(0, cards.length - visibleCardsCount);
      }
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      const visibleCardsCount = getVisibleCardsCount();
      const maxIndex = Math.max(0, cards.length - visibleCardsCount);
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  // Helper to safely insert widget HTML and execute script tags
  function insertWidget(containerSelector, htmlCode) {
    const container = document.querySelector(containerSelector);
    if (!container || !htmlCode) return;

    container.innerHTML = '';
    const tempEl = document.createElement('div');
    tempEl.innerHTML = htmlCode;

    Array.from(tempEl.childNodes).forEach(node => {
      if (node.tagName === 'SCRIPT') {
        const script = document.createElement('script');
        if (node.src) {
          script.src = node.src;
        } else {
          script.textContent = node.textContent;
        }
        Array.from(node.attributes).forEach(attr => {
          script.setAttribute(attr.name, attr.value);
        });
        document.body.appendChild(script);
      } else {
        container.appendChild(node.cloneNode(true));
      }
    });
  }

  // Setup Blog Page Filters and Search
  function setupBlogFilters(posts) {
    const filterContainer = document.querySelector('#categories-filter');
    if (!filterContainer) return;

    const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))];
    filterContainer.innerHTML = categories.map(cat => {
      const label = cat === 'all' ? 'Todos' : cat;
      const activeClass = cat === currentFilterCategory ? 'active' : '';
      return `<button class="filter-tag ${activeClass}" data-category="${cat}">${escapeHtml(label)}</button>`;
    }).join('');

    filterContainer.querySelectorAll('.filter-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilterCategory = btn.getAttribute('data-category');
        renderPosts();
      });
    });

    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
      searchInput.value = currentSearchQuery;
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderPosts();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
      });
      // Close mobile menu when a link is clicked
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          menuToggle.textContent = '☰';
        });
      });
    }

    // Init Google Reviews Carousel
    initGoogleReviewsCarousel();

    // Setup Modal Close Event
    const closeBtn = document.querySelector('#modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const modalOverlay = document.querySelector('#article-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    // Set Copyright Year
    const yearEl = document.querySelector('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Fetch Posts JSON
    fetch('/content/posts.json')
      .then(r => r.json())
      .then(d => {
        const posts = d.posts || [];
        renderPosts(posts);
        setupBlogFilters(posts);
      })
      .catch(() => {
        renderPosts(fallbackPosts);
        setupBlogFilters(fallbackPosts);
      });

    // Fetch Settings JSON
    fetch('/content/settings.json')
      .then(r => r.json())
      .then(d => {
        if (d.instagramUrl) {
          const instaBtns = document.querySelectorAll('#instagram-link, .insta-item');
          instaBtns.forEach(btn => btn.href = d.instagramUrl);
        }

        if (d.whatsappUrl) {
          const waLinks = document.querySelectorAll('.whatsapp-link');
          waLinks.forEach(link => link.href = d.whatsappUrl);
        }

        if (d.googleReviewUrl) {
          const gBtn = document.querySelector('#google-review-btn');
          if (gBtn) gBtn.href = d.googleReviewUrl;
        }

        if (d.phone) {
          const phoneEl = document.querySelector('#display-phone');
          if (phoneEl) {
            phoneEl.textContent = d.phone;
            phoneEl.href = 'tel:' + d.phone.replace(/\D/g, '');
          }
        }

        if (d.googleReviewsWidgetCode) {
          insertWidget('#google-reviews-widget-container', d.googleReviewsWidgetCode);
        }

        if (d.instagramWidgetCode) {
          insertWidget('#instagram-widget-container', d.instagramWidgetCode);
        }

        if (d.headTags) {
          document.head.insertAdjacentHTML('beforeend', d.headTags);
        }

        if (d.bodyTags) {
          document.body.insertAdjacentHTML('beforeend', d.bodyTags);
        }
      })
      .catch(() => {});
  });
})();
