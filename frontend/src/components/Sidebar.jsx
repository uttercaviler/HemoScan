import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Activity, Home, Stethoscope, BarChart3, Info, Heart, Globe, ChevronDown, UtensilsCrossed } from 'lucide-react'
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext'

function Sidebar({ isOpen, onClose }) {
    const location = useLocation()
    const { t, language, setLanguage } = useLanguage()
    const [langOpen, setLangOpen] = useState(false)

    const currentLang = LANGUAGES.find(l => l.code === language)

    const navItems = [
        { path: '/screening', icon: Stethoscope, label: t('patientScreening') },
        { path: '/dashboard', icon: BarChart3, label: t('dashboard') },
        { path: '/diet', icon: UtensilsCrossed, label: t('dietRecommendations') },
        { path: '/about', icon: Info, label: t('about') },
    ]

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
            <div className="sidebar-header">
                <NavLink to="/" className="sidebar-logo" onClick={onClose}>
                    <div className="sidebar-logo-icon">
                        <Heart size={20} color="white" />
                    </div>
                    <span className="sidebar-logo-text">{t('appName')}</span>
                    <span className="sidebar-logo-badge">{t('appTagline')}</span>
                </NavLink>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section-label">{t('navigation')}</div>

                <NavLink
                    to="/"
                    className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={onClose}
                    id="nav-home"
                >
                    <Home size={18} className="nav-item-icon" />
                    <span>{t('home')}</span>
                </NavLink>

                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                        id={`nav-${item.path.slice(1)}`}
                    >
                        <item.icon size={18} className="nav-item-icon" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                <div className="nav-section-label" style={{ marginTop: '16px' }}>{t('quickActions')}</div>

                <NavLink
                    to="/screening?mode=quick"
                    className="nav-item"
                    onClick={onClose}
                    id="nav-quick-screen"
                >
                    <Activity size={18} className="nav-item-icon" />
                    <span>{t('quickScreen')}</span>
                </NavLink>

                {/* Language Switcher */}
                <div className="nav-section-label" style={{ marginTop: '16px' }}>
                    <Globe size={12} style={{ marginRight: '4px', display: 'inline' }} />
                    {t('language')}
                </div>
                <div className="lang-switcher" style={{ position: 'relative' }}>
                    <button
                        className="nav-item lang-btn"
                        onClick={() => setLangOpen(!langOpen)}
                        id="lang-toggle"
                        style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{currentLang?.flag}</span>
                            <span>{currentLang?.label}</span>
                        </span>
                        <ChevronDown size={14} style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    {langOpen && (
                        <div className="lang-dropdown" style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            marginTop: '4px'
                        }}>
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => { setLanguage(lang.code); setLangOpen(false) }}
                                    className="lang-option"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        padding: '10px 16px',
                                        border: 'none',
                                        background: language === lang.code ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                                        color: language === lang.code ? 'var(--primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.target.style.background = language === lang.code ? 'rgba(220, 38, 38, 0.1)' : 'transparent'}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                    {language === lang.code && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ marginBottom: '4px' }}>{t('appVersion')}</div>
                    <div>{t('copyright')}</div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
