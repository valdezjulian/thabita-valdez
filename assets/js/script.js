// Configuração inicial
const CONFIG = {
    BREAKPOINT: 768,
    ANIMATION_DURATION: 300,
    SLIDER_AUTO_PLAY: true,
    SLIDER_INTERVAL: 5000
};

// Gerenciador do Menu
class MenuManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.hamburgerBtn = document.querySelector('.hamburger-btn');
        this.navMenu = document.querySelector('.nav-menu.mobile'); // Alterado para selecionar menu mobile
        this.menuLinks = document.querySelectorAll('.nav-menu.mobile a');
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        if (!this.validateElements()) return;
        this.setupEventListeners();
    }

    validateElements() {
        if (!this.hamburgerBtn || !this.navMenu) {
            console.error('Elementos críticos do menu não encontrados');
            return false;
        }
        return true;
    }

    setupEventListeners() {
        // Handler do botão hamburger
        this.hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Handler dos links do menu
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                // Adiciona delay para suavizar a transição
                setTimeout(() => {
                    this.hamburgerBtn.classList.remove('active');
                }, 300);
            });
        });

        // Handler de clique fora do menu
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen &&
                !this.navMenu.contains(e.target) &&
                !this.hamburgerBtn.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Handler de redimensionamento
        window.addEventListener('resize', () => this.handleResize());
    }


    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.hamburgerBtn.classList.toggle('active');
        this.navMenu.classList.toggle('active');

        // Toggle da classe no body para bloquear scroll
        document.body.classList.toggle('menu-open');

        // Anima os links sequencialmente
        if (this.isMenuOpen) {
            this.menuLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateX(0)';
                }, 100 * index);
            });
        }
    }

    closeMenu() {
        if (!this.isMenuOpen) return;

        this.isMenuOpen = false;
        this.hamburgerBtn.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');

        // Reset das animações dos links
        this.menuLinks.forEach(link => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(20px)';
        });
    }

    handleResize() {
        if (window.innerWidth > CONFIG.BREAKPOINT && this.isMenuOpen) {
            this.closeMenu();
        }
    }
}

// Gerenciador do Slider
class SliderManager {
    constructor() {
        this.cards = document.querySelectorAll('.card');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        if (!this.validateElements()) return;

        this.setupEventListeners();
        this.showCard(this.currentIndex);

        if (CONFIG.SLIDER_AUTO_PLAY) {
            this.startAutoPlay();
        }
    }

    validateElements() {
        if (!this.cards.length || !this.prevBtn || !this.nextBtn) {
            console.error('Elementos do slider não encontrados');
            return false;
        }
        return true;
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.navigate('prev'));
        this.nextBtn.addEventListener('click', () => this.navigate('next'));

        // Pausa autoplay no hover
        const sliderContainer = this.cards[0].parentElement;
        sliderContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
        sliderContainer.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }

    showCard(index, direction = 'next') {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        this.cards.forEach((card, i) => {
            card.classList.remove('active', 'slide-left', 'slide-right');
            if (i === index) {
                card.classList.add('active', direction === 'next' ? 'slide-right' : 'slide-left');
            }
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, CONFIG.ANIMATION_DURATION);
    }

    navigate(direction) {
        this.pauseAutoPlay();

        if (direction === 'prev') {
            this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        }

        this.showCard(this.currentIndex, direction);
        this.resumeAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.navigate('next');
        }, CONFIG.SLIDER_INTERVAL);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlay() {
        if (CONFIG.SLIDER_AUTO_PLAY && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
}

class ScrollToTopButton {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        this.init();
    }

    init() {
        if (!this.button) return;
        this.setupEventListeners();
        this.checkPosition();
    }

    setupEventListeners() {
        // Monitora o scroll da página
        window.addEventListener('scroll', () => this.checkPosition());

        // Adiciona o evento de click no botão
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    checkPosition() {
        // Mostra o botão depois de rolar 300px
        if (window.pageYOffset > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Polyfill para suporte a Smooth Scroll em Safari e navegadores antigos
if (!('scrollBehavior' in document.documentElement.style)) {
    import('smoothscroll-polyfill').then(smoothScroll => {
        smoothScroll.polyfill();
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const menuManager = new MenuManager();
    const sliderManager = new SliderManager();
    const scrollButton = new ScrollToTopButton();
});