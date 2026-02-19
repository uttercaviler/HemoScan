import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Apple, Leaf, Droplets, Flame, UtensilsCrossed,
    ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
    XCircle, ArrowLeft, Stethoscope, Sun, Moon, Coffee,
    Baby, Info, Sparkles, Clock
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const API_BASE = '/api'

// Category icons and colors
const FOOD_GROUP_CONFIG = {
    vegetables: { icon: <Leaf size={16} />, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', label: 'Vegetables' },
    fruits: { icon: <Apple size={16} />, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', label: 'Fruits' },
    grains: { icon: <Flame size={16} />, color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', label: 'Grains & Millets' },
    proteins: { icon: <Droplets size={16} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Proteins & Legumes' },
    dairy: { icon: <Coffee size={16} />, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', label: 'Dairy' },
    others: { icon: <Sparkles size={16} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', label: 'Superfoods' },
}

const CATEGORY_LABELS = {
    iron_rich: { en: 'Iron-Rich Foods', hi: 'आयरन-युक्त खाद्य पदार्थ', te: 'ఇనుము అధికమైన ఆహారాలు', ta: 'இரும்புச் சத்து நிறைந்த உணவுகள்' },
    vitamin_c: { en: 'Vitamin C Boosters', hi: 'विटामिन C बूस्टर', te: 'విటమిన్ C బూస్టర్లు', ta: 'வைட்டமின் C ஊக்கிகள்' },
    folate_rich: { en: 'Folate-Rich Foods', hi: 'फोलेट-युक्त खाद्य पदार्थ', te: 'ఫోలేట్ అధికమైన ఆహారాలు', ta: 'ஃபோலேட் நிறைந்த உணவுகள்' },
    vitamin_b12: { en: 'Vitamin B12 Sources', hi: 'विटामिन B12 स्रोत', te: 'విటమిన్ B12 మూలాలు', ta: 'வைட்டமின் B12 ஆதாரங்கள்' },
}

const MEAL_LABELS = {
    breakfast: { icon: <Sun size={16} />, en: 'Breakfast', hi: 'नाश्ता', te: 'అల్పాహారం', ta: 'காலை உணவு', color: '#f97316' },
    lunch: { icon: <Clock size={16} />, en: 'Lunch', hi: 'दोपहर का खाना', te: 'మధ్యాహ్న భోజనం', ta: 'மதிய உணவு', color: '#22c55e' },
    snack: { icon: <Coffee size={16} />, en: 'Snack', hi: 'नाश्ता', te: 'స్నాక్', ta: 'சிற்றுண்டி', color: '#8b5cf6' },
    dinner: { icon: <Moon size={16} />, en: 'Dinner', hi: 'रात का खाना', te: 'రాత్రి భోజనం', ta: 'இரவு உணவு', color: '#06b6d4' },
}

function DietPage() {
    const { t, language } = useLanguage()
    const location = useLocation()
    const navigate = useNavigate()

    const [dietData, setDietData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [expandedFood, setExpandedFood] = useState(null)
    const [activeTab, setActiveTab] = useState('foods')

    // Get screening result from navigation state (if coming from screening page)
    const screeningResult = location.state?.result
    const screeningFormData = location.state?.formData

    // Translation keys for the diet page
    const dietTranslations = {
        en: {
            pageTitle: 'Diet Recommendations',
            pageSubtitle: 'Personalized nutrition plan based on your screening results',
            noDataTitle: 'No Screening Data',
            noDataDesc: 'Run a screening first to get personalized diet recommendations, or try a sample below.',
            trySample: 'Try Sample (Mild Anemia)',
            goToScreening: 'Go to Screening',
            foodsTab: 'Recommended Foods',
            mealPlanTab: 'Meal Plan',
            tipsTab: 'Absorption Tips',
            ironContent: 'Iron Content',
            per100g: 'per 100g',
            howToPrepare: 'How to Prepare',
            nutrients: 'Key Nutrients',
            dailyTarget: 'Daily Iron Target',
            enhancers: 'Absorption Enhancers',
            enhancerDesc: 'Pair these with iron-rich foods for maximum benefit',
            inhibitors: 'Absorption Blockers',
            inhibitorDesc: 'Avoid these near iron-rich meals',
            pregnancyAlert: 'Pregnancy Nutrition Alert',
            detectedDeficiencies: 'Detected Deficiencies',
            lowIron: 'Low Iron',
            lowFerritin: 'Low Ferritin',
            lowHemoglobin: 'Low Hemoglobin',
            severity: 'Severity',
            backToResults: 'Back to Results',
            loading: 'Getting your recommendations...',
        },
        hi: {
            pageTitle: 'आहार सिफारिशें',
            pageSubtitle: 'आपकी जांच के परिणामों पर आधारित व्यक्तिगत पोषण योजना',
            noDataTitle: 'कोई जांच डेटा नहीं',
            noDataDesc: 'व्यक्तिगत आहार सिफारिशें पाने के लिए पहले जांच करें, या नीचे एक नमूना आज़माएं।',
            trySample: 'नमूना आज़माएं (हल्का एनीमिया)',
            goToScreening: 'जांच पर जाएं',
            foodsTab: 'अनुशंसित खाद्य पदार्थ',
            mealPlanTab: 'भोजन योजना',
            tipsTab: 'अवशोषण युक्तियां',
            ironContent: 'आयरन सामग्री',
            per100g: 'प्रति 100g',
            howToPrepare: 'कैसे बनाएं',
            nutrients: 'मुख्य पोषक तत्व',
            dailyTarget: 'दैनिक आयरन लक्ष्य',
            enhancers: 'अवशोषण बढ़ाने वाले',
            enhancerDesc: 'अधिकतम लाभ के लिए इन्हें आयरन-युक्त भोजन के साथ लें',
            inhibitors: 'अवशोषण रोकने वाले',
            inhibitorDesc: 'आयरन-युक्त भोजन के पास इनसे बचें',
            pregnancyAlert: 'गर्भावस्था पोषण चेतावनी',
            detectedDeficiencies: 'पाई गई कमियां',
            lowIron: 'कम आयरन',
            lowFerritin: 'कम फेरिटिन',
            lowHemoglobin: 'कम हीमोग्लोबिन',
            severity: 'गंभीरता',
            backToResults: 'परिणामों पर वापस',
            loading: 'सिफारिशें प्राप्त हो रही हैं...',
        },
        te: {
            pageTitle: 'ఆహార సిఫార్సులు',
            pageSubtitle: 'మీ పరీక్ష ఫలితాల ఆధారంగా వ్యక్తిగత పోషకాహార ప్లాన్',
            noDataTitle: 'పరీక్ష డేటా లేదు',
            noDataDesc: 'వ్యక్తిగత ఆహార సిఫార్సుల కోసం మొదట పరీక్ష చేయండి, లేదా కింద నమూనా ప్రయత్నించండి.',
            trySample: 'నమూనా ప్రయత్నించండి (తేలికపాటి రక్తహీనత)',
            goToScreening: 'పరీక్షకు వెళ్ళండి',
            foodsTab: 'సిఫార్సు చేసిన ఆహారాలు',
            mealPlanTab: 'భోజన ప్లాన్',
            tipsTab: 'శోషణ చిట్కాలు',
            ironContent: 'ఇనుము పరిమాణం',
            per100g: 'ప్రతి 100g',
            howToPrepare: 'ఎలా తయారు చేయాలి',
            nutrients: 'ముఖ్య పోషకాలు',
            dailyTarget: 'రోజువారీ ఇనుము లక్ష్యం',
            enhancers: 'శోషణ పెంచేవి',
            enhancerDesc: 'గరిష్ట ప్రయోజనం కోసం వీటిని ఇనుము ఆహారంతో జతచేయండి',
            inhibitors: 'శోషణ అడ్డుకునేవి',
            inhibitorDesc: 'ఇనుము భోజనం సమయంలో వీటిని నివారించండి',
            pregnancyAlert: 'గర్భధారణ పోషకాహార హెచ్చరిక',
            detectedDeficiencies: 'కనుగొనబడిన లోపాలు',
            lowIron: 'తక్కువ ఇనుము',
            lowFerritin: 'తక్కువ ఫెర్రిటిన్',
            lowHemoglobin: 'తక్కువ హీమోగ్లోబిన్',
            severity: 'తీవ్రత',
            backToResults: 'ఫలితాలకు తిరిగి',
            loading: 'సిఫార్సులు లోడ్ అవుతున్నాయి...',
        },
        ta: {
            pageTitle: 'உணவு பரிந்துரைகள்',
            pageSubtitle: 'உங்கள் பரிசோதனை முடிவுகளின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட ஊட்டச்சத்து திட்டம்',
            noDataTitle: 'பரிசோதனை தரவு இல்லை',
            noDataDesc: 'தனிப்பயனாக்கப்பட்ட உணவு பரிந்துரைகளுக்கு முதலில் பரிசோதனை செய்யவும், அல்லது கீழே ஒரு மாதிரியை முயற்சிக்கவும்.',
            trySample: 'மாதிரி முயற்சிக்கவும் (லேசான இரத்தசோகை)',
            goToScreening: 'பரிசோதனைக்கு செல்',
            foodsTab: 'பரிந்துரைக்கப்பட்ட உணவுகள்',
            mealPlanTab: 'உணவு திட்டம்',
            tipsTab: 'உறிஞ்சுதல் குறிப்புகள்',
            ironContent: 'இரும்பு உள்ளடக்கம்',
            per100g: 'ஒரு 100g க்கு',
            howToPrepare: 'எப்படி தயாரிப்பது',
            nutrients: 'முக்கிய ஊட்டச்சத்துக்கள்',
            dailyTarget: 'தினசரி இரும்பு இலக்கு',
            enhancers: 'உறிஞ்சுதல் அதிகரிப்பான்கள்',
            enhancerDesc: 'அதிகபட்ச நன்மைக்கு இவற்றை இரும்பு உணவுகளுடன் இணைக்கவும்',
            inhibitors: 'உறிஞ்சுதல் தடுப்பான்கள்',
            inhibitorDesc: 'இரும்பு உணவுகளின் போது இவற்றைத் தவிர்க்கவும்',
            pregnancyAlert: 'கர்ப்ப ஊட்டச்சத்து எச்சரிக்கை',
            detectedDeficiencies: 'கண்டறியப்பட்ட குறைபாடுகள்',
            lowIron: 'குறைந்த இரும்பு',
            lowFerritin: 'குறைந்த ஃபெர்ரிட்டின்',
            lowHemoglobin: 'குறைந்த ஹீமோகுளோபின்',
            severity: 'தீவிரம்',
            backToResults: 'முடிவுகளுக்கு திரும்பு',
            loading: 'பரிந்துரைகள் ஏற்றப்படுகின்றன...',
        },
    }

    const dt = (key) => dietTranslations[language]?.[key] || dietTranslations.en[key] || key

    const DEFICIENCY_LABELS = {
        low_iron: dt('lowIron'),
        low_ferritin: dt('lowFerritin'),
        low_hemoglobin: dt('lowHemoglobin'),
    }

    useEffect(() => {
        if (screeningResult) {
            fetchDiet(screeningResult, screeningFormData)
        }
    }, [screeningResult])

    const fetchDiet = async (result, formData) => {
        setLoading(true)
        setError(null)
        try {
            const severityMap = { 0: 'Normal', 1: 'Mild Anemia', 2: 'Moderate Anemia', 3: 'Severe Anemia' }
            const body = {
                severity: result?.severity_label || severityMap[result?.severity] || 'Mild Anemia',
                hemoglobin: parseFloat(formData?.hemoglobin) || 12,
                iron_level: parseFloat(formData?.iron_level) || 80,
                ferritin: parseFloat(formData?.ferritin) || 100,
                gender: parseInt(formData?.gender) || 0,
                pregnancy: parseInt(formData?.pregnancy) || 0,
                language: language,
            }

            const res = await fetch(`${API_BASE}/diet-recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                const data = await res.json()
                setDietData(data)
            } else {
                setError('Failed to get recommendations')
            }
        } catch (err) {
            setError('Backend not available')
        }
        setLoading(false)
    }

    const trySample = () => {
        const sampleResult = { severity_label: 'Mild Anemia', severity: 1 }
        const sampleForm = { hemoglobin: 10.5, iron_level: 45, ferritin: 15, gender: 0, pregnancy: 0 }
        fetchDiet(sampleResult, sampleForm)
    }

    // Group foods by category
    const groupedFoods = dietData?.foods?.reduce((acc, food) => {
        const cat = food.category
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(food)
        return acc
    }, {}) || {}

    const ironBarWidth = (mg) => Math.min((mg / 15) * 100, 100)

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">
                    <UtensilsCrossed size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--severity-normal)' }} />
                    {dt('pageTitle')}
                </h1>
                <p className="page-subtitle">{dt('pageSubtitle')}</p>
            </div>

            {/* No data state */}
            {!dietData && !loading && (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', padding: '60px 24px' }}
                >
                    <Apple size={56} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
                        {dt('noDataTitle')}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 24px' }}>
                        {dt('noDataDesc')}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={trySample}>
                            <Sparkles size={16} /> {dt('trySample')}
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/screening')}>
                            <Stethoscope size={16} /> {dt('goToScreening')}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Loading */}
            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <div className="loading-text">{dt('loading')}</div>
                </div>
            )}

            {/* Results */}
            {dietData && !loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Summary Banner */}
                    <motion.div
                        className="card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(6, 182, 212, 0.08))',
                            borderColor: 'rgba(34, 197, 94, 0.2)',
                            marginBottom: '24px',
                        }}
                    >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🎯</span>
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
                                        {dt('dailyTarget')}
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--severity-normal)' }}>
                                    {dietData.daily_iron_target} mg
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>/ day</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    {dietData.daily_target_label}
                                </div>
                            </div>

                            {/* Deficiencies */}
                            {dietData.deficiencies?.length > 0 && (
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                        {dt('detectedDeficiencies')}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {dietData.deficiencies.map(d => (
                                            <span key={d} style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '4px 12px', borderRadius: '999px',
                                                background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                                fontSize: '0.8rem', fontWeight: 600,
                                            }}>
                                                <AlertTriangle size={12} />
                                                {DEFICIENCY_LABELS[d] || d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Severity */}
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    {dt('severity')}
                                </div>
                                <span style={{
                                    padding: '6px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem',
                                    background: dietData.severity === 'Normal' ? 'rgba(34, 197, 94, 0.15)' :
                                        dietData.severity === 'Mild Anemia' ? 'rgba(234, 179, 8, 0.15)' :
                                            dietData.severity === 'Moderate Anemia' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                    color: dietData.severity === 'Normal' ? '#22c55e' :
                                        dietData.severity === 'Mild Anemia' ? '#eab308' :
                                            dietData.severity === 'Moderate Anemia' ? '#f97316' : '#ef4444',
                                }}>
                                    {dietData.severity}
                                </span>
                            </div>
                        </div>

                        {/* Pregnancy note */}
                        {dietData.pregnancy_note && (
                            <div style={{
                                marginTop: '16px', padding: '12px 16px', borderRadius: '8px',
                                background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
                                display: 'flex', gap: '10px', alignItems: 'flex-start',
                            }}>
                                <Baby size={18} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#8b5cf6', fontSize: '0.85rem', marginBottom: '4px' }}>
                                        {dt('pregnancyAlert')}
                                    </div>
                                    <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        {dietData.pregnancy_note}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--bg-card)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-primary)' }}>
                        {[
                            { key: 'foods', label: dt('foodsTab'), icon: <Apple size={16} /> },
                            { key: 'mealplan', label: dt('mealPlanTab'), icon: <UtensilsCrossed size={16} /> },
                            { key: 'tips', label: dt('tipsTab'), icon: <Info size={16} /> },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-body)',
                                    transition: 'all 0.2s',
                                    background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
                                    color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                                }}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Foods Tab */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'foods' && (
                            <motion.div
                                key="foods"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {Object.entries(groupedFoods).map(([category, foods], ci) => (
                                    <div key={category} style={{ marginBottom: '32px' }}>
                                        <h3 style={{
                                            fontFamily: 'var(--font-display)', fontWeight: 700,
                                            fontSize: '1rem', marginBottom: '16px',
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            color: 'var(--text-primary)',
                                        }}>
                                            <span style={{
                                                width: '28px', height: '28px', borderRadius: '8px',
                                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.9rem',
                                            }}>
                                                {ci + 1}
                                            </span>
                                            {CATEGORY_LABELS[category]?.[language] || CATEGORY_LABELS[category]?.en || category}
                                        </h3>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                                            {foods.map((food, fi) => {
                                                const groupConfig = FOOD_GROUP_CONFIG[food.food_group] || FOOD_GROUP_CONFIG.others
                                                const isExpanded = expandedFood === food.id

                                                return (
                                                    <motion.div
                                                        key={food.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: fi * 0.05 }}
                                                        className="card"
                                                        style={{ padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onClick={() => setExpandedFood(isExpanded ? null : food.id)}
                                                    >
                                                        {/* Food header */}
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <div style={{
                                                                    width: '42px', height: '42px', borderRadius: '12px',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    background: groupConfig.bg, fontSize: '1.5rem',
                                                                }}>
                                                                    {food.emoji}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>
                                                                        {food.name}
                                                                    </div>
                                                                    <div style={{
                                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                        fontSize: '0.7rem', color: groupConfig.color,
                                                                        background: groupConfig.bg, padding: '2px 8px',
                                                                        borderRadius: '999px', fontWeight: 600,
                                                                    }}>
                                                                        {groupConfig.icon} {groupConfig.label}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: '#ef4444' }}>
                                                                        {food.iron_per_100g} mg
                                                                    </div>
                                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                                        {dt('per100g')}
                                                                    </div>
                                                                </div>
                                                                {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
                                                            </div>
                                                        </div>

                                                        {/* Iron bar */}
                                                        <div style={{ marginTop: '12px', height: '4px', borderRadius: '2px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${ironBarWidth(food.iron_per_100g)}%` }}
                                                                transition={{ duration: 0.8, delay: fi * 0.05 }}
                                                                style={{
                                                                    height: '100%', borderRadius: '2px',
                                                                    background: `linear-gradient(90deg, #ef4444, ${food.iron_per_100g > 5 ? '#f97316' : '#eab308'})`,
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Expanded details */}
                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    style={{ overflow: 'hidden' }}
                                                                >
                                                                    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-primary)' }}>
                                                                        {/* Preparation */}
                                                                        <div style={{ marginBottom: '12px' }}>
                                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                                                                                🍳 {dt('howToPrepare')}
                                                                            </div>
                                                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                                                                {food.preparation}
                                                                            </div>
                                                                        </div>

                                                                        {/* Nutrients */}
                                                                        <div>
                                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                                                                                💊 {dt('nutrients')}
                                                                            </div>
                                                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                                                {food.nutrients.map(n => (
                                                                                    <span key={n} style={{
                                                                                        padding: '3px 10px', borderRadius: '999px',
                                                                                        background: 'var(--bg-tertiary)',
                                                                                        fontSize: '0.73rem', color: 'var(--text-secondary)',
                                                                                        fontWeight: 500, textTransform: 'capitalize',
                                                                                    }}>
                                                                                        {n.replace(/_/g, ' ')}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Meal Plan Tab */}
                        {activeTab === 'mealplan' && dietData.meal_plan && (
                            <motion.div
                                key="mealplan"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="card" style={{ marginBottom: '24px' }}>
                                    <h3 style={{
                                        fontFamily: 'var(--font-display)', fontWeight: 700,
                                        fontSize: '1.1rem', marginBottom: '24px',
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                    }}>
                                        <span style={{ fontSize: '1.4rem' }}>📋</span>
                                        {dietData.meal_plan.title}
                                    </h3>

                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {Object.entries(dietData.meal_plan.meals).map(([mealKey, mealText], i) => {
                                            const mealConfig = MEAL_LABELS[mealKey]
                                            return (
                                                <motion.div
                                                    key={mealKey}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    style={{
                                                        display: 'flex', gap: '16px', alignItems: 'flex-start',
                                                        padding: '16px', borderRadius: '12px',
                                                        background: 'var(--bg-secondary)',
                                                        border: '1px solid var(--border-primary)',
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '44px', height: '44px', borderRadius: '12px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: `${mealConfig?.color}15`,
                                                        color: mealConfig?.color,
                                                        flexShrink: 0,
                                                    }}>
                                                        {mealConfig?.icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: mealConfig?.color }}>
                                                            {mealConfig?.[language] || mealConfig?.en || mealKey}
                                                        </div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                                            {mealText}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* No meal plan (Normal severity) */}
                        {activeTab === 'mealplan' && !dietData.meal_plan && (
                            <motion.div
                                key="nomealplan"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="card"
                                style={{ textAlign: 'center', padding: '48px 24px' }}
                            >
                                <CheckCircle2 size={48} style={{ color: 'var(--severity-normal)', marginBottom: '16px' }} />
                                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No Special Meal Plan Needed</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Your results are within normal range. Maintain a balanced iron-rich diet.
                                </p>
                            </motion.div>
                        )}

                        {/* Absorption Tips Tab */}
                        {activeTab === 'tips' && (
                            <motion.div
                                key="tips"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{ display: 'grid', gap: '24px' }}
                            >
                                {/* Enhancers */}
                                <div className="card">
                                    <h3 style={{
                                        fontFamily: 'var(--font-display)', fontWeight: 700,
                                        fontSize: '1.05rem', marginBottom: '4px',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        color: '#22c55e',
                                    }}>
                                        <CheckCircle2 size={20} /> {dt('enhancers')}
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                                        {dt('enhancerDesc')}
                                    </p>
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        {dietData.absorption_tips?.enhancers?.map((tip, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                style={{
                                                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                                                    padding: '12px 16px', borderRadius: '10px',
                                                    background: 'rgba(34, 197, 94, 0.06)',
                                                    border: '1px solid rgba(34, 197, 94, 0.12)',
                                                }}
                                            >
                                                <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }}>✅</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                                    {tip}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Inhibitors */}
                                <div className="card">
                                    <h3 style={{
                                        fontFamily: 'var(--font-display)', fontWeight: 700,
                                        fontSize: '1.05rem', marginBottom: '4px',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        color: '#ef4444',
                                    }}>
                                        <XCircle size={20} /> {dt('inhibitors')}
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                                        {dt('inhibitorDesc')}
                                    </p>
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        {dietData.absorption_tips?.inhibitors?.map((tip, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                style={{
                                                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                                                    padding: '12px 16px', borderRadius: '10px',
                                                    background: 'rgba(239, 68, 68, 0.06)',
                                                    border: '1px solid rgba(239, 68, 68, 0.12)',
                                                }}
                                            >
                                                <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }}>⛔</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                                    {tip}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Back button */}
                    {screeningResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{ marginTop: '24px', textAlign: 'center' }}
                        >
                            <button className="btn btn-secondary" onClick={() => navigate('/screening')}>
                                <ArrowLeft size={16} /> {dt('backToResults')}
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    )
}

export default DietPage
