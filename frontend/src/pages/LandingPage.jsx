import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Heart, Activity, Shield, Brain, Stethoscope, BarChart3,
    Zap, Users, ArrowRight, CheckCircle2
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

function LandingPage() {
    const navigate = useNavigate()
    const { t } = useLanguage()

    const features = [
        {
            icon: <Brain size={28} />,
            title: t('aiDetection'),
            description: t('aiDetectionDesc'),
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)',
        },
        {
            icon: <Activity size={28} />,
            title: t('riskScoring'),
            description: t('riskScoringDesc'),
            color: '#f97316',
            bgColor: 'rgba(249, 115, 22, 0.1)',
        },
        {
            icon: <Shield size={28} />,
            title: t('preventiveAlerts'),
            description: t('preventiveAlertsDesc'),
            color: '#eab308',
            bgColor: 'rgba(234, 179, 8, 0.1)',
        },
        {
            icon: <Stethoscope size={28} />,
            title: t('clinicalDashboard'),
            description: t('clinicalDashboardDesc'),
            color: '#22c55e',
            bgColor: 'rgba(34, 197, 94, 0.1)',
        },
        {
            icon: <Zap size={28} />,
            title: t('instantResults'),
            description: t('instantResultsDesc'),
            color: '#06b6d4',
            bgColor: 'rgba(6, 182, 212, 0.1)',
        },
        {
            icon: <Users size={28} />,
            title: t('accessibleScreening'),
            description: t('accessibleScreeningDesc'),
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)',
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="hero" id="hero-section">
                <div className="hero-bg">
                    <div className="hero-bg-gradient red"></div>
                    <div className="hero-bg-gradient violet"></div>
                    <div className="hero-bg-gradient cyan"></div>
                </div>

                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Heart size={14} />
                        {t('heroBadge')}
                    </motion.div>

                    <h1 className="hero-title">
                        <span className="gradient-text">{t('heroTitle1')}</span>
                        <br />
                        {t('heroTitle2')}<br />{t('heroTitle3')}
                    </h1>

                    <p className="hero-description">
                        {t('heroDescription')}
                    </p>

                    <div className="hero-actions">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/screening')}
                            id="hero-start-screening"
                        >
                            {t('startScreening')}
                            <ArrowRight size={18} />
                        </button>
                        <button
                            className="btn btn-secondary btn-lg"
                            onClick={() => navigate('/dashboard')}
                            id="hero-view-dashboard"
                        >
                            <BarChart3 size={18} />
                            {t('viewDashboard')}
                        </button>
                    </div>

                    <motion.div
                        className="hero-stats"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <div className="hero-stat">
                            <div className="hero-stat-value" style={{ color: 'var(--severity-normal)' }}>95%+</div>
                            <div className="hero-stat-label">{t('modelAccuracy')}</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value" style={{ color: 'var(--accent-cyan)' }}>20+</div>
                            <div className="hero-stat-label">{t('healthParameters')}</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value" style={{ color: 'var(--accent-orange)' }}>4</div>
                            <div className="hero-stat-label">{t('severityClasses')}</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value" style={{ color: 'var(--accent-violet)' }}>&lt;2s</div>
                            <div className="hero-stat-label">{t('analysisTime')}</div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features-section">
                <motion.h2
                    className="features-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {t('poweredByAI')}
                </motion.h2>

                <motion.div
                    className="features-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            variants={itemVariants}
                        >
                            <div
                                className="feature-card-icon"
                                style={{ background: feature.bgColor, color: feature.color }}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="feature-card-title">{feature.title}</h3>
                            <p className="feature-card-text">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* How It Works */}
            <section className="features-section" id="how-it-works">
                <motion.h2
                    className="features-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {t('howItWorks')}
                </motion.h2>

                <motion.div
                    className="features-grid"
                    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[
                        { step: '01', title: t('step1Title'), desc: t('step1Desc') },
                        { step: '02', title: t('step2Title'), desc: t('step2Desc') },
                        { step: '03', title: t('step3Title'), desc: t('step3Desc') },
                        { step: '04', title: t('step4Title'), desc: t('step4Desc') },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            variants={itemVariants}
                            style={{ textAlign: 'left' }}
                        >
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                opacity: 0.3,
                                marginBottom: '12px'
                            }}>
                                {item.step}
                            </div>
                            <h3 className="feature-card-title" style={{ textAlign: 'left' }}>{item.title}</h3>
                            <p className="feature-card-text" style={{ textAlign: 'left' }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '80px 24px', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        padding: '48px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-xl)',
                    }}
                >
                    <Heart size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>
                        {t('readyToScreen')}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: '1.7' }}>
                        {t('ctaDescription')}
                    </p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/screening')}
                        id="cta-start-screening"
                    >
                        {t('beginScreening')}
                        <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '32px 24px',
                textAlign: 'center',
                borderTop: '1px solid var(--border-primary)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Heart size={16} color="var(--primary)" />
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('appName')} {t('appTagline')}</span>
                </div>
                <p>{t('footerTeam')}</p>
                <p style={{ marginTop: '4px' }}>{t('footerDisclaimer')}</p>
            </footer>
        </div>
    )
}

export default LandingPage
