import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, FileText, Award, Eye, X, Shield, Lock
} from 'lucide-react';
import { educationData } from '../../data/educationData';
import { RevealOnScroll } from '../../components/ui/Animations';

// ── Mini document thumbnail render component
const DocumentThumbnail = ({ doc }) => {
  if (doc.status === "Coming Soon") {
    return (
      <div className="w-full aspect-[4/3] rounded-2xl bg-slate-100/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 dark:text-slate-650 gap-1.5 p-3 select-none">
        <FileText size={20} className="opacity-50" />
        <span className="text-[9px] font-bold tracking-widest uppercase">Coming Soon</span>
      </div>
    );
  }

  const isCert = doc.docDetails?.isCertificate;

  return (
    <div className="w-full aspect-[4/3] rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      {/* Tiny diagonal watermark label repeated in background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none text-[8px] font-bold flex flex-wrap gap-4 p-2 rotate-[-15deg]">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i}>Sicky Kumar</span>
        ))}
      </div>

      <div className="flex justify-between items-start z-10">
        <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary dark:text-primary-light border border-primary/10">
          {doc.category}
        </span>
        <span className="text-[9px] font-semibold text-slate-400">{doc.year}</span>
      </div>

      {isCert ? (
        <div className="my-auto text-center space-y-1.5 z-10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-300/20">
            <Award size={14} className="text-white" />
          </div>
          <p className="text-[9px] font-black tracking-wider text-slate-700 dark:text-slate-350 uppercase">DIPLOMA CERT</p>
        </div>
      ) : (
        <div className="my-auto space-y-1 z-10 pl-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="h-1 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <div className="h-1 w-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="h-1 w-14 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-slate-200/20 dark:border-slate-800/30 z-10 text-[8px] font-mono text-slate-400 dark:text-slate-500">
        <span>VERIFIED RECORD</span>
        <span className="font-sans font-bold text-slate-655 dark:text-slate-400">
          {doc.docDetails?.summaryText?.split(" | ")[0] || "Passed"}
        </span>
      </div>
    </div>
  );
};

// ── Vector document render component
const VectorDocument = ({ docDetails }) => {
  if (!docDetails) return null;

  const isCert = docDetails.isCertificate;

  return (
    <div 
      className="w-full p-6 sm:p-10 text-slate-800 dark:text-slate-200 relative overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* Repeated diagonal watermark strings */}
      <div className="absolute inset-0 pointer-events-none select-none z-30 flex flex-col justify-around items-center opacity-[0.06] dark:opacity-[0.09] rotate-[-25deg] scale-125">
        {Array.from({ length: 5 }).map((_, r) => (
          <div key={r} className="text-[11px] sm:text-xs font-black tracking-[0.2em] whitespace-nowrap uppercase">
            SICKY KUMAR PORTFOLIO • FOR VERIFICATION ONLY • SICKY KUMAR PORTFOLIO
          </div>
        ))}
      </div>

      {/* Frame border outlines */}
      <div className="absolute inset-4 border border-slate-200/40 dark:border-slate-800 pointer-events-none rounded-xl" />
      <div className="absolute inset-5 border-2 border-double border-slate-200/50 dark:border-slate-700/50 pointer-events-none rounded-xl" />

      {/* Main vector elements */}
      <div className="relative z-10 space-y-6 pt-3">
        {/* Authority details */}
        <div className="text-center space-y-1.5 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <p className="text-[9px] font-bold tracking-widest text-slate-450 uppercase">
            {docDetails.authority}
          </p>
          <h3 className="text-lg sm:text-xl font-black tracking-tight font-heading uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
            {docDetails.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {docDetails.institution}
          </p>
        </div>

        {/* Candidate info grid */}
        <div className="grid grid-cols-2 gap-4 text-[11px]">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Candidate Name</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5 text-xs sm:text-sm uppercase">SICKY KUMAR</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Academic Session / Year</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5 text-xs sm:text-sm">{docDetails.year}</p>
          </div>

          {/* Privacy shielding (Masked / Blur-shielded details) */}
          <div className="relative">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Roll Number</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-bold text-slate-900 dark:text-white filter blur-[3px] select-none">
                {docDetails.roll}
              </span>
              <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold border border-slate-250/20 dark:border-slate-700/50 select-none">
                Masked
              </span>
            </div>
          </div>
          <div className="relative">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Registration Number</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-bold text-slate-900 dark:text-white filter blur-[3px] select-none">
                {docDetails.registration}
              </span>
              <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold border border-slate-250/20 dark:border-slate-700/50 select-none">
                Masked
              </span>
            </div>
          </div>
        </div>

        {/* Document core contents */}
        {isCert ? (
          <div className="py-6 px-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 text-center space-y-6 relative">
            <p className="text-xs sm:text-sm leading-relaxed italic text-slate-655 dark:text-slate-350 px-4">
              "{docDetails.awardText}"
            </p>
            {/* Stamp mock */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 border border-amber-300/40 shadow-xl mx-auto flex items-center justify-center relative">
              <div className="w-10 h-10 rounded-full border border-dashed border-white/40 flex items-center justify-center">
                <Award className="text-white" size={20} />
              </div>
            </div>
          </div>
        ) : (
          /* Marksheet score lists */
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-xl overflow-hidden text-[11px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/60 dark:border-slate-800/80 text-[9px] text-slate-400 font-bold tracking-wider text-left">
                  <th className="p-3">Subject Name</th>
                  <th className="p-3 text-center">Marks Obtained</th>
                  <th className="p-3 text-center">Max Marks</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {docDetails.records?.map((rec, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{rec.subject}</td>
                    <td className="p-3 text-center font-bold text-slate-900 dark:text-white">{rec.marks}</td>
                    <td className="p-3 text-center text-slate-400">{rec.maxMarks}</td>
                    <td className="p-3 text-right text-emerald-500 font-bold">Passed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Area with QR encryption & details */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Blurred QR element */}
            <div className="relative w-12 h-12 rounded-lg bg-white p-1 border border-slate-200/80 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-slate-900 grid grid-cols-4 gap-1 p-0.5 filter blur-[1.5px] opacity-70" />
              <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center rounded-lg">
                <span className="text-[6px] text-white font-bold leading-none text-center px-0.5 uppercase tracking-tighter">
                  Privacy
                </span>
              </div>
            </div>
            <p className="text-[9px] text-slate-450 leading-tight font-medium max-w-[150px]">
              Scanner verification block redacted for privacy protection.
            </p>
          </div>

          <div className="text-right space-y-0.5">
            <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Result Status</p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              {docDetails.summaryText?.split(" | ")[0] || "Passed"}
            </p>
            <p className="text-[9px] font-bold text-primary dark:text-primary-light uppercase tracking-wider">
              {docDetails.summaryText?.split(" | ")[1] || "Clear"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EducationPage = () => {
  const { hero, levels } = educationData;
  const [selectedDoc, setSelectedDoc] = useState(null);

  // SEO metadata setup
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Sicky Kumar | Academic Credentials & Journey";
    
    // Meta updates helper
    const setMeta = (nameOrProperty, value, isProperty = false) => {
      if (!value) return null;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      let created = false;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, nameOrProperty);
        document.head.appendChild(element);
        created = true;
      }
      const prevVal = element.getAttribute('content');
      element.setAttribute('content', value);
      return { element, created, prevVal };
    };

    // Set Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    const descText = "Explore the verified academic records, semester marksheets, certificates, and educational journey of Sicky Kumar.";
    
    const dMeta = setMeta('description', descText);
    const ogTitle = setMeta('og:title', "Sicky Kumar | Academic Credentials & Journey", true);
    const ogDesc = setMeta('og:description', descText, true);
    const ogUrl = setMeta('og:url', window.location.href, true);
    const twitterTitle = setMeta('twitter:title', "Sicky Kumar | Academic Credentials & Journey");
    const twitterDesc = setMeta('twitter:description', descText);

    return () => {
      document.title = prevTitle;
      if (canonical) {
        canonical.setAttribute('href', prevCanonical || 'https://www.sickykumar.in/');
      }
      if (dMeta?.element) dMeta.element.setAttribute('content', dMeta.prevVal || '');
      if (ogTitle?.element) ogTitle.element.setAttribute('content', ogTitle.prevVal || '');
      if (ogDesc?.element) ogDesc.element.setAttribute('content', ogDesc.prevVal || '');
      if (ogUrl?.element) ogUrl.element.setAttribute('content', ogUrl.prevVal || '');
      if (twitterTitle?.element) twitterTitle.element.setAttribute('content', twitterTitle.prevVal || '');
      if (twitterDesc?.element) twitterDesc.element.setAttribute('content', twitterDesc.prevVal || '');
    };
  }, []);

  // Lock parent window scroll when document modal is open
  useEffect(() => {
    if (selectedDoc) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [selectedDoc]);

  return (
    <div className="w-full relative overflow-hidden pb-16">
      {/* Backdrop soft grids and blobs */}
      <div className="blob blob-primary w-[500px] h-[500px] -top-20 -right-40 opacity-40" />
      <div className="blob blob-accent w-[350px] h-[350px] bottom-10 left-0 opacity-30" />

      {/* ========================================== */}
      {/* HERO SECTION */}
      {/* ========================================== */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-10 sm:pt-36 text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary dark:text-primary-light border border-primary/15 dark:border-primary/10 mb-4">
          <Shield size={12} className="text-primary" /> Verified Credentials
        </span>
        <h1 
          className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
        >
          {hero.title}
        </h1>
        <p className="max-w-2xl text-base text-slate-550 dark:text-slate-400 leading-relaxed mt-4 font-medium">
          {hero.description}
        </p>
      </section>

      {/* ========================================== */}
      {/* ACADEMIC DASHBOARD MAIN SECTION */}
      {/* ========================================== */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 space-y-10">
        {levels.map((level, levelIdx) => (
          <RevealOnScroll key={level.id} delay={levelIdx * 0.1}>
            <div className="glass p-6 sm:p-8 rounded-[32px] border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
              
              {/* Parent details & summary header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/30 dark:border-slate-800/30">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={20} className="text-primary" />
                    <h2 
                      className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
                      style={{ fontFamily: 'Satoshi, sans-serif' }}
                    >
                      {level.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {level.institution}
                  </p>
                </div>

                {/* Clean summary stats list */}
                <div className="flex flex-wrap gap-2 sm:self-center">
                  {level.summary.map((sum, sumIdx) => {
                    const isBadge = sum.isBadge;
                    return (
                      <div 
                        key={sumIdx}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border ${
                          isBadge
                            ? 'bg-primary/10 text-primary dark:text-primary-light border-primary/20 animate-pulse-glow'
                            : 'glass border-slate-200/60 dark:border-slate-800/40 text-slate-655 dark:text-slate-400'
                        }`}
                      >
                        <span className="opacity-60 mr-1">{sum.label}:</span>
                        <span className="text-slate-850 dark:text-slate-200">{sum.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Child marksheets grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {level.documents.map((doc) => {
                  const isAvailable = doc.status === "Available";
                  return (
                    <div 
                      key={doc.id}
                      className="group p-3 rounded-2xl glass-subtle border border-slate-200/30 dark:border-slate-800/40 flex flex-col justify-between hover:border-primary/20 dark:hover:border-primary/10 transition-all duration-300 h-full"
                    >
                      {/* Thumbnail view */}
                      <DocumentThumbnail doc={doc} />

                      {/* Info & action bar */}
                      <div className="mt-3.5 space-y-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                            {doc.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {isAvailable ? "Official Record" : "Pending Session"}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <button
                          onClick={() => isAvailable && setSelectedDoc(doc)}
                          disabled={!isAvailable}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                            isAvailable
                              ? 'bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-900/60 dark:hover:bg-primary dark:hover:text-white text-slate-700 dark:text-slate-300 cursor-pointer hover:shadow-md active:scale-97'
                              : 'bg-slate-100/50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-dashed border-slate-200/50 dark:border-slate-800'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <Eye size={12} />
                              Preview Document
                            </>
                          ) : (
                            <>
                              <Lock size={11} className="opacity-55" />
                              Coming Soon
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </section>

      {/* ========================================== */}
      {/* FULLSCREEN PREVIEW MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl relative shadow-2xl overflow-hidden my-8 border border-slate-200/40 dark:border-slate-800/80"
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ overscrollContain: 'contain' }}
            >
              {/* Close Button overlay */}
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 transition-colors cursor-pointer border border-slate-250/20 shadow-sm"
                aria-label="Close Preview"
              >
                <X size={15} />
              </button>

              {/* Vector document display */}
              <VectorDocument docDetails={selectedDoc.docDetails} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
