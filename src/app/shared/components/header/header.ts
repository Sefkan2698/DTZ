import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Menu state
  isMenuOpen = false;
  
  // Scroll state for navbar styling
  isScrolled = false;
  
  // Router subscription
  private routerSubscription?: Subscription;
  
  // Scroll position for smooth behavior
  private lastScrollTop = 0;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Close menu on route change
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
      });
    
    // Check initial scroll position
    this.checkScroll();
    
    // Prevent body scroll when menu is open
    this.handleBodyScroll();
  }
  
  ngOnDestroy(): void {
    // Clean up subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    
    // Ensure body scroll is restored
    this.enableBodyScroll();
  }
  
  /**
   * Toggle mobile menu
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.handleBodyScroll();
  }
  
  /**
   * Close mobile menu
   */
  closeMenu(): void {
    this.isMenuOpen = false;
    this.enableBodyScroll();
  }
  
  /**
   * Handle scroll event for navbar styling
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }
  
  /**
   * Handle window resize
   */
  @HostListener('window:resize', [])
  onWindowResize(): void {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }
  
  /**
   * Handle escape key press
   */
  @HostListener('document:keydown.escape', [])
  onEscapePress(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }
  
  /**
   * Check scroll position and update navbar style
   */
  private checkScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when scrolled more than 50px
    this.isScrolled = scrollTop > 50;
    
    // Store last scroll position
    this.lastScrollTop = scrollTop;
  }
  
  /**
   * Handle body scroll when menu is open/closed
   */
  private handleBodyScroll(): void {
    if (this.isMenuOpen) {
      this.disableBodyScroll();
    } else {
      this.enableBodyScroll();
    }
  }
  
  /**
   * Disable body scroll
   */
  private disableBodyScroll(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
  }
  
  /**
   * Enable body scroll
   */
  private enableBodyScroll(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  
  /**
   * Get scrollbar width to prevent layout shift
   */
  private getScrollbarWidth(): number {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);
    
    return scrollbarWidth;
  }
  
  /**
   * Track by function for performance
   */
  trackByIndex(index: number): number {
    return index;
  }
  
  /**
   * Check if current route matches
   */
  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
  
  /**
   * Handle logo click
   */
  onLogoClick(): void {
    this.closeMenu();
    // Scroll to top if already on home page
    if (this.router.url === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  /**
   * Handle CTA button click with analytics (optional)
   */
  onCtaClick(): void {
    this.closeMenu();
    
    // Track CTA click if you have analytics
    // this.analytics.track('cta_header_clicked');
    
    // You can add additional logic here
    console.log('CTA Button clicked');
  }
  
  /**
   * Get current year for copyright (if needed)
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }
  
  /**
   * Check if browser supports specific features
   */
  get isModernBrowser(): boolean {
    return 'IntersectionObserver' in window && 
           'CSS' in window && 
           CSS.supports('display', 'grid');
  }
}